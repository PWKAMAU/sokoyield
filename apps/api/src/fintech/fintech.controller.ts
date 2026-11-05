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
import { FintechService } from './fintech.service.js';
import { StripeService } from './stripe.service.js';

interface RequestWithUser {
  user: {
    id: string;
    role: UserRole;
    email?: string;
  };
}

@Controller('api/v1/fintech')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FintechController {
  constructor(
    private readonly fintechService: FintechService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * Deposit buyer funds into platform escrow hold.
   */
  @Post('escrow/:cropId/hold')
  @Roles('BUYER', 'ADMIN')
  async holdInEscrow(
    @Request() req: RequestWithUser,
    @Param('cropId') cropId: string,
  ) {
    return this.fintechService.depositIntoEscrow(cropId, req.user.id);
  }

  /**
   * Confirms delivery and triggers automated Stripe payout (97% Farmer, 3% SokoYield).
   */
  @Post('escrow/:cropId/release')
  @Roles('BUYER', 'ADMIN')
  async releaseEscrow(
    @Request() req: RequestWithUser,
    @Param('cropId') cropId: string,
  ) {
    return this.fintechService.confirmDeliveryAndPayout(cropId, req.user);
  }

  /**
   * Admin Control Room liquidity & escrow monitor.
   */
  @Get('liquidity')
  @Roles('ADMIN')
  async getLiquidity() {
    return this.fintechService.getLiquiditySummary();
  }

  /**
   * Checks whether the buyer has an active $500/month SaaS subscription.
   */
  @Get('subscription/status')
  @Roles('BUYER', 'ADMIN')
  async getSubscriptionStatus(@Request() req: RequestWithUser) {
    return this.fintechService.checkBuyerSubscription(req.user.id);
  }

  /**
   * Generates Stripe Checkout Session for $500/mo SaaS subscription.
   */
  @Post('subscription/checkout')
  @Roles('BUYER')
  async createCheckout(
    @Request() req: RequestWithUser,
    @Body() body: { returnUrl?: string },
  ) {
    const returnUrl = body.returnUrl ?? 'http://localhost:3000/dashboard';
    const email = req.user.email ?? 'buyer@sokoyield.market';
    return this.stripeService.createSaaSSubscriptionCheckout(
      req.user.id,
      email,
      returnUrl,
    );
  }

  /**
   * Activates demo SaaS subscription to test paywall unlock.
   */
  @Post('subscription/activate-demo')
  @Roles('BUYER', 'ADMIN')
  async activateDemo(@Request() req: RequestWithUser) {
    const sub = await this.fintechService.activateSubscription(req.user.id);
    return { success: true, subscription: sub };
  }
}
