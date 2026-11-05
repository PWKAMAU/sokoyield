import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module.js';
import { SecurityModule } from '../security/security.module.js';
import { CropsController } from './crops.controller.js';
import { CropsService } from './crops.service.js';

@Module({
  imports: [AiModule, SecurityModule],
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService],
})
export class CropsModule {}
