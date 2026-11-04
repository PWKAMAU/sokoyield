import { Logger, VersioningType, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.schema.js';

/** Shared HTTP setup, reused by e2e tests so they exercise the real pipeline. */
export function configureApp(app: INestApplication): void {
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  app.use(helmet());
  app.enableCors({
    origin: config
      .get('API_CORS_ORIGINS', { infer: true })
      .split(',')
      .map((o) => o.trim()),
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableShutdownHooks();
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  const port = app.get<ConfigService<Env, true>>(ConfigService).get('API_PORT', { infer: true });
  await app.listen(port);
  Logger.log(`SokoYield API listening on http://localhost:${port}/api/v1`, 'Bootstrap');
}

if (process.env.NODE_ENV !== 'test') {
  await bootstrap();
}
