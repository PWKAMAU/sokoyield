import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { HealthService, type HealthReport } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  /** Liveness: the process is running. Never touches dependencies. */
  @Get('live')
  @HttpCode(200)
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }

  /** Readiness: Postgres and Redis are reachable. 503 when degraded. */
  @Get()
  async ready(@Res({ passthrough: true }) res: Response): Promise<HealthReport> {
    const report = await this.health.check();
    res.status(report.status === 'ok' ? 200 : 503);
    return report;
  }
}
