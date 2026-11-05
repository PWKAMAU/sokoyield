import { Module } from '@nestjs/common';
import { FintechController } from './fintech.controller.js';
import { FintechService } from './fintech.service.js';
import { StripeService } from './stripe.service.js';

@Module({
  controllers: [FintechController],
  providers: [StripeService, FintechService],
  exports: [StripeService, FintechService],
})
export class FintechModule {}
