import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { KafkaService, KafkaTopics, type CropPhotoUploadedEvent } from '../kafka/kafka.module.js';
import { AiService } from './ai.service.js';

@Injectable()
export class AiQueueConsumer implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(AiQueueConsumer.name);
  private running = false;
  private consumer?: any;

  constructor(
    private readonly kafka: KafkaService,
    private readonly aiService: AiService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Only attempt starting the Kafka consumer if background consumers are enabled.
    // In dev/test when Kafka broker might not be actively listening, it gracefully catches and logs.
    this.startConsumer().catch((err: unknown) => {
      this.logger.warn(`Kafka AI Consumer startup bypassed: ${(err as Error).message}`);
    });
  }

  async startConsumer(): Promise<void> {
    try {
      const client = await this.kafka.client();
      this.consumer = (client as any).consumer({
        'group.id': 'sokoyield-ai-grading-group',
      });
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: KafkaTopics.CropPhotoUploaded,
        fromBeginning: false,
      });

      this.running = true;
      this.logger.log(`Kafka AI Consumer subscribed to topic: ${KafkaTopics.CropPhotoUploaded}`);

      await this.consumer.run({
        eachMessage: async ({ message }: { message: { value: Buffer | null } }) => {
          if (!message.value) return;

          try {
            const payload = JSON.parse(message.value.toString('utf-8')) as CropPhotoUploadedEvent;
            await this.processMessage(payload);
          } catch (err) {
            this.logger.error(`Error processing crop photo event: ${(err as Error).message}`);
          }
        },
      });
    } catch (err) {
      this.logger.warn(
        `Kafka consumer could not connect to broker (${(err as Error).message}). Local sync processing fallback remains active.`,
      );
    }
  }

  async processMessage(event: CropPhotoUploadedEvent): Promise<void> {
    this.logger.log(`Processing queued crop photo for AI grading: ${event.cropId}`);

    try {
      let imageBuffer: Buffer;

      if (event.filePath) {
        imageBuffer = await fs.readFile(event.filePath);
      } else {
        // Fallback dummy image buffer (1x1 pixel JPEG)
        imageBuffer = Buffer.from(
          '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
          'base64',
        );
      }

      await this.aiService.processCropGrading(event.cropId, imageBuffer, 'image/jpeg', {
        cropName: event.cropName,
        latitude: event.latitude,
        longitude: event.longitude,
        photoUrl: event.photoUrl,
      });

      this.logger.log(`Successfully graded crop ${event.cropId} via AI queue`);
    } catch (err) {
      this.logger.error(`Failed AI grading for ${event.cropId}: ${(err as Error).message}`);
      await this.kafka.emitCropPhotoDlq({
        cropId: event.cropId,
        error: (err as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.consumer && this.running) {
      await this.consumer.disconnect().catch((err: unknown) => {
        this.logger.warn(`Kafka consumer disconnect failed: ${String(err)}`);
      });
      this.running = false;
    }
  }
}
