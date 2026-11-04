import { Inject, Injectable } from '@nestjs/common';
import type pg from 'pg';
import type { Redis } from 'ioredis';
import { PG_POOL } from '../database/database.module.js';
import { KafkaService, KafkaTopics } from '../kafka/kafka.module.js';
import { REDIS_CLIENT } from '../redis/redis.module.js';

export type ComponentStatus = 'up' | 'down';

export interface ComponentHealth {
  status: ComponentStatus;
  latencyMs: number;
  error?: string;
}

export interface HealthReport {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  components: {
    postgres: ComponentHealth;
    redis: ComponentHealth;
    kafka: ComponentHealth;
  };
}

const CHECK_TIMEOUT_MS = 3_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

@Injectable()
export class HealthService {
  constructor(
    @Inject(PG_POOL) private readonly pool: pg.Pool,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly kafka: KafkaService,
  ) {}

  async check(): Promise<HealthReport> {
    const [postgres, redis, kafka] = await Promise.all([
      this.probe(async () => {
        await this.pool.query('SELECT 1');
      }),
      this.probe(async () => {
        if (this.redis.status === 'wait' || this.redis.status === 'end') {
          await this.redis.connect();
        }
        const pong: string = await this.redis.ping();
        if (pong !== 'PONG') throw new Error(`unexpected reply: ${pong}`);
      }),
      this.probe(async () => {
        const topics = await this.kafka.listTopics(CHECK_TIMEOUT_MS);
        const missing = Object.values(KafkaTopics).filter((t) => !topics.includes(t));
        if (missing.length) throw new Error(`missing topics: ${missing.join(', ')}`);
      }),
    ]);

    const allUp = [postgres, redis, kafka].every((c) => c.status === 'up');
    return {
      status: allUp ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      components: { postgres, redis, kafka },
    };
  }

  private async probe(fn: () => Promise<void>): Promise<ComponentHealth> {
    const start = performance.now();
    try {
      await withTimeout(fn(), CHECK_TIMEOUT_MS);
      return { status: 'up', latencyMs: Math.round(performance.now() - start) };
    } catch (err) {
      return {
        status: 'down',
        latencyMs: Math.round(performance.now() - start),
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
