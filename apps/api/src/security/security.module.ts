import { Module } from '@nestjs/common';
import { PlayIntegrityService } from './play-integrity.service.js';

@Module({
  providers: [PlayIntegrityService],
  exports: [PlayIntegrityService],
})
export class SecurityModule {}
