import { Module } from '@nestjs/common';
import { TickerController } from './ticker.controller.js';
import { TickerGateway } from './ticker.gateway.js';
import { TickerService } from './ticker.service.js';

@Module({
  controllers: [TickerController],
  providers: [TickerGateway, TickerService],
  exports: [TickerService, TickerGateway],
})
export class TickerModule {}
