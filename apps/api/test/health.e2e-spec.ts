import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/main.js';

/**
 * Requires live infrastructure: `pnpm infra:up` locally,
 * or the Postgres/Redis service containers in CI.
 */
describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health/live -> 200', () =>
    request(app.getHttpServer()).get('/api/v1/health/live').expect(200, { status: 'ok' }));

  it('GET /api/v1/health -> 200 with Postgres, Redis and Kafka up', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.components.postgres.status).toBe('up');
    expect(res.body.components.redis.status).toBe('up');
    expect(res.body.components.kafka.status).toBe('up');
  });
});
