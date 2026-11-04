import {
  Global,
  Inject,
  Injectable,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pg from 'pg';
import type { Env } from '../config/env.schema.js';

export const PG_POOL = Symbol('PG_POOL');

/**
 * Raw PostgreSQL connection pool used for infrastructure health checks.
 * The ORM / migration layer for the relational ledger is introduced in Phase 2.
 */
@Injectable()
class PgPoolLifecycle implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) =>
        new pg.Pool({
          connectionString: config.get('DATABASE_URL', { infer: true }),
          max: 10,
          connectionTimeoutMillis: 5_000,
          idleTimeoutMillis: 30_000,
        }),
    },
    PgPoolLifecycle,
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
