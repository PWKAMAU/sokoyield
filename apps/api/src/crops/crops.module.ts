import { Module } from '@nestjs/common';
import { CropsController } from './crops.controller.js';
import { CropsService } from './crops.service.js';

@Module({
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService],
})
export class CropsModule {}
