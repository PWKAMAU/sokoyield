import { Test } from '@nestjs/testing';
import { PG_POOL } from '../database/database.module.js';
import { KafkaService, KafkaTopics } from '../kafka/kafka.module.js';
import { REDIS_CLIENT } from '../redis/redis.module.js';
import { HealthService } from './health.service.js';

const ALL_TOPICS = Object.values(KafkaTopics);

interface Mocks {
  pg?: () => Promise<unknown>;
  redis?: () => Promise<string>;
  kafka?: () => Promise<string[]>;
}

function build({
  pg = () => Promise.resolve({ rows: [] }),
  redis = () => Promise.resolve('PONG'),
  kafka = () => Promise.resolve([...ALL_TOPICS]),
}: Mocks = {}) {
  return Test.createTestingModule({
    providers: [
      HealthService,
      { provide: PG_POOL, useValue: { query: vi.fn(pg) } },
      { provide: REDIS_CLIENT, useValue: { status: 'ready', ping: vi.fn(redis) } },
      { provide: KafkaService, useValue: { listTopics: vi.fn(kafka) } },
    ],
  }).compile();
}

describe('HealthService', () => {
  it('reports ok when Postgres, Redis and Kafka respond', async () => {
    const report = await (await build()).get(HealthService).check();

    expect(report.status).toBe('ok');
    expect(report.components.postgres.status).toBe('up');
    expect(report.components.redis.status).toBe('up');
    expect(report.components.kafka.status).toBe('up');
  });

  it('reports degraded with the error when Postgres is down', async () => {
    const mod = await build({ pg: () => Promise.reject(new Error('ECONNREFUSED')) });
    const report = await mod.get(HealthService).check();

    expect(report.status).toBe('degraded');
    expect(report.components.postgres).toMatchObject({ status: 'down', error: 'ECONNREFUSED' });
    expect(report.components.redis.status).toBe('up');
  });

  it('reports degraded when Redis replies unexpectedly', async () => {
    const report = await (await build({ redis: () => Promise.resolve('NOPE') }))
      .get(HealthService)
      .check();

    expect(report.status).toBe('degraded');
    expect(report.components.redis.status).toBe('down');
  });

  it('reports Kafka down when platform topics are missing', async () => {
    const mod = await build({ kafka: () => Promise.resolve([KafkaTopics.CropPhotoUploaded]) });
    const report = await mod.get(HealthService).check();

    expect(report.status).toBe('degraded');
    expect(report.components.kafka.status).toBe('down');
    expect(report.components.kafka.error).toContain(KafkaTopics.CropGradeCompleted);
  });
});
