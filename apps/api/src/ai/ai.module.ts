import { Module } from '@nestjs/common';
import { AiQueueConsumer } from './ai-queue.consumer.js';
import { AiService } from './ai.service.js';
import { KindwiseProvider } from './kindwise.provider.js';
import { PlantixProvider } from './plantix.provider.js';

@Module({
  providers: [
    KindwiseProvider,
    PlantixProvider,
    AiService,
    AiQueueConsumer,
  ],
  exports: [AiService, KindwiseProvider, PlantixProvider],
})
export class AiModule {}
