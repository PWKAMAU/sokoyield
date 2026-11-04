import {
  Global,
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { KafkaJS } from '@confluentinc/kafka-javascript';
import type { Env } from '../config/env.schema.js';

/** Topic names - must match infra/docker/kafka/create-topics.sh */
export const KafkaTopics = {
  CropPhotoUploaded: 'crop.photo.uploaded',
  CropGradeCompleted: 'crop.grade.completed',
  CropPhotoDlq: 'crop.photo.dlq',
  AgroAlertIssued: 'alerts.agro.issued',
} as const;

/**
 * Thin wrapper around the Confluent Kafka client (KafkaJS-compatible API, backed by librdkafka).
 * The native module is imported lazily so unit tests never load the binding.
 * Producers/consumers for the photo-upload pipeline are added in Phase 4.
 */
@Injectable()
export class KafkaService implements OnApplicationShutdown {
  private readonly logger = new Logger(KafkaService.name);
  private kafka?: KafkaJS.Kafka;
  private admin?: KafkaJS.Admin;
  private connecting?: Promise<KafkaJS.Admin>;

  constructor(private readonly config: ConfigService<Env, true>) {}

  async client(): Promise<KafkaJS.Kafka> {
    if (!this.kafka) {
      const mod = await import('@confluentinc/kafka-javascript');
      // CommonJS module: under ESM interop the exports live on `default`.
      const K = mod.default?.KafkaJS ?? mod.KafkaJS;
      this.kafka = new K.Kafka({
        kafkaJS: {
          clientId: this.config.get('KAFKA_CLIENT_ID', { infer: true }),
          brokers: this.config
            .get('KAFKA_BROKERS', { infer: true })
            .split(',')
            .map((b) => b.trim()),
          connectionTimeout: 3_000,
          logLevel: K.logLevel.WARN,
        },
      });
    }
    return this.kafka;
  }

  /** Lazily connected admin client, shared by health checks and ops tooling. */
  async adminClient(): Promise<KafkaJS.Admin> {
    if (this.admin) return this.admin;
    this.connecting ??= (async () => {
      const admin = (await this.client()).admin();
      await admin.connect();
      this.admin = admin;
      return admin;
    })().finally(() => {
      this.connecting = undefined;
    });
    return this.connecting;
  }

  async listTopics(timeoutMs = 3_000): Promise<string[]> {
    const admin = await this.adminClient();
    return admin.listTopics({ timeout: timeoutMs });
  }

  async onApplicationShutdown(): Promise<void> {
    await this.admin?.disconnect().catch((err: unknown) => {
      this.logger.warn(`Kafka admin disconnect failed: ${String(err)}`);
    });
  }
}

@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
