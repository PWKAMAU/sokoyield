import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { UserRole } from '../database/schema.js';
import { AdminService } from './admin.service.js';

interface RequestWithUser {
  user: {
    id: string;
    role: UserRole;
    email?: string;
  };
}

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('health-metrics')
  async getHealthMetrics() {
    return this.adminService.getSystemHealthMetrics();
  }

  @Get('liquidity')
  async getLiquidity() {
    return this.adminService.getLiquidityMonitor();
  }

  @Get('disputes')
  async getDisputes() {
    return this.adminService.getDisputeList();
  }

  @Post('disputes/:id/resolve')
  async resolveDispute(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body()
    body: {
      ruling: 'RELEASE_TO_FARMER' | 'REFUND_BUYER';
      notes?: string;
    },
  ) {
    return this.adminService.resolveDispute(id, {
      ruling: body.ruling,
      notes: body.notes ?? 'Administrative dispute resolution',
      adminId: req.user.id,
    });
  }
}
