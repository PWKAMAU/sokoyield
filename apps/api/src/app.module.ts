import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module.js';
import { AiModule } from './ai/ai.module.js';
import { AlertsModule } from './alerts/alerts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { validateEnv } from './config/env.schema.js';
import { CropsModule } from './crops/crops.module.js';
import { DatabaseModule } from './database/database.module.js';
import { FintechModule } from './fintech/fintech.module.js';
import { HealthModule } from './health/health.module.js';
import { KafkaModule } from './kafka/kafka.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { RedisModule } from './redis/redis.module.js';
import { TickerModule } from './ticker/ticker.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // Monorepo: the single source of truth is the repo-root .env
      envFilePath: ['.env', '../../.env'],
      validate: validateEnv,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RedisModule,
    KafkaModule,
    NotificationsModule,
    AiModule,
    AlertsModule,
    AuthModule,
    CropsModule,
    TickerModule,
    FintechModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
