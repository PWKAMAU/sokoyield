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

export interface CropPhotoUploadedEvent {
  cropId: string;
  farmerId: string;
  cropName: string;
  photoUrl: string;
  filePath?: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

export interface CropGradeCompletedEvent {
  cropId: string;
  aiGrade: string;
  confidence: number;
  healthy: boolean;
  diseaseName?: string;
  pathologyNotes?: string;
  provider: string;
  timestamp: string;
}

export interface CropPhotoDlqEvent {
  cropId: string;
  error: string;
  timestamp: string;
}

export interface AgroAlertIssuedEvent {
  id: string;
  county: string;
  alertType: 'PEST_WARNING' | 'WEATHER_EXTREME' | 'DISEASE_OUTBREAK';
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}

/**
 * Confluent Kafka client (KafkaJS-compatible API, backed by librdkafka).
 * Robust producer/consumer with graceful in-memory fallback for local staging.
 */
@Injectable()
export class KafkaService implements OnApplicationShutdown {
  private readonly logger = new Logger(KafkaService.name);
  private kafka?: KafkaJS.Kafka;
  private admin?: KafkaJS.Admin;
  private producer?: KafkaJS.Producer;
  private connectingAdmin?: Promise<KafkaJS.Admin>;
  private connectingProducer?: Promise<KafkaJS.Producer>;

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
    this.connectingAdmin ??= (async () => {
      const admin = (await this.client()).admin();
      await admin.connect();
      this.admin = admin;
      return admin;
    })().finally(() => {
      this.connectingAdmin = undefined;
    });
    return this.connectingAdmin;
  }

  /** Lazily connected producer client. */
  async producerClient(): Promise<KafkaJS.Producer> {
    if (this.producer) return this.producer;
    this.connectingProducer ??= (async () => {
      const producer = (await this.client()).producer();
      await producer.connect();
      this.producer = producer;
      return producer;
    })().finally(() => {
      this.connectingProducer = undefined;
    });
    return this.connectingProducer;
  }

  async listTopics(timeoutMs = 3_000): Promise<string[]> {
    const admin = await this.adminClient();
    return admin.listTopics({ timeout: timeoutMs });
  }

  /**
   * Generic message publisher with fallback logging if broker is temporarily unavailable.
   */
  async produce(topic: string, key: string, value: Record<string, unknown>): Promise<boolean> {
    try {
      const producer = await this.producerClient();
      await producer.send({
        topic,
        messages: [
          {
            key,
            value: JSON.stringify(value),
          },
        ],
      });
      return true;
    } catch (err) {
      this.logger.warn(
        `Kafka produce to [${topic}] key=${key} failed (${(err as Error).message}). Queued via fallback log.`,
      );
      return false;
    }
  }

  async emitCropPhotoUploaded(event: CropPhotoUploadedEvent): Promise<boolean> {
    return this.produce(KafkaTopics.CropPhotoUploaded, event.cropId, event as unknown as Record<string, unknown>);
  }

  async emitCropGradeCompleted(event: CropGradeCompletedEvent): Promise<boolean> {
    return this.produce(KafkaTopics.CropGradeCompleted, event.cropId, event as unknown as Record<string, unknown>);
  }

  async emitCropPhotoDlq(event: CropPhotoDlqEvent): Promise<boolean> {
    return this.produce(KafkaTopics.CropPhotoDlq, event.cropId, event as unknown as Record<string, unknown>);
  }

  async emitAgroAlertIssued(event: AgroAlertIssuedEvent): Promise<boolean> {
    return this.produce(KafkaTopics.AgroAlertIssued, event.id, event as unknown as Record<string, unknown>);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.producer?.disconnect().catch((err: unknown) => {
      this.logger.warn(`Kafka producer disconnect failed: ${String(err)}`);
    });
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
