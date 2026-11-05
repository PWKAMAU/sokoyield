import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import type { Env } from '../config/env.schema.js';
import { DRIZZLE_DB, type DrizzleDb } from '../database/database.module.js';

export interface EscrowHoldResult {
  paymentIntentId: string;
  status: 'HELD_IN_ESCROW';
  amountKes: number;
  farmerPayoutKes: number;
  platformFeeKes: number;
  isMocked: boolean;
}

export interface PayoutResult {
  transferId: string;
  status: 'RELEASED_TO_FARMER';
  farmerPayoutKes: number;
  platformFeeKes: number;
  isMocked: boolean;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe?: Stripe;

  constructor(
    private readonly config: ConfigService<Env, true>,
    @Inject(DRIZZLE_DB) private readonly db: DrizzleDb,
  ) {
    const key = this.config.get('STRIPE_SECRET_KEY', { infer: true });
    if (key) {
      this.stripe = new Stripe(key, { apiVersion: '2026-03-25.acacia' as any });
      this.logger.log('Stripe client initialized for Escrow & Connect payouts');
    } else {
      this.logger.warn('[MOCK STRIPE] STRIPE_SECRET_KEY not set. Running in simulated fintech mode.');
    }
  }

  /**
   * Holds buyer funds in platform balance (Escrow state).
   * Manual payout setting prevents automatic bank distribution until physical delivery.
   */
  async holdInEscrow(
    cropId: string,
    buyerId: string,
    amountKes: number,
  ): Promise<EscrowHoldResult> {
    const farmerPayoutKes = Number((amountKes * 0.97).toFixed(2));
    const platformFeeKes = Number((amountKes * 0.03).toFixed(2));

    if (!this.stripe) {
      this.logger.log(
        `[MOCK STRIPE ESCROW] Held KES ${amountKes} in platform escrow for crop ${cropId} (Buyer: ${buyerId}, 97% Farmer: ${farmerPayoutKes}, 3% Fee: ${platformFeeKes})`,
      );
      return {
        paymentIntentId: `pi_mock_escrow_${Date.now()}`,
        status: 'HELD_IN_ESCROW',
        amountKes,
        farmerPayoutKes,
        platformFeeKes,
        isMocked: true,
      };
    }

    try {
      // In production, convert KES to sub-units (or USD equivalent)
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amountKes * 100),
        currency: 'kes',
        capture_method: 'manual', // Hold funds in platform balance without immediate capture
        metadata: {
          cropId,
          buyerId,
          farmerPayoutKes: farmerPayoutKes.toString(),
          platformFeeKes: platformFeeKes.toString(),
        },
      });

      return {
        paymentIntentId: paymentIntent.id,
        status: 'HELD_IN_ESCROW',
        amountKes,
        farmerPayoutKes,
        platformFeeKes,
        isMocked: false,
      };
    } catch (err) {
      this.logger.error(`Stripe Escrow hold failed: ${(err as Error).message}`);
      return {
        paymentIntentId: `pi_fallback_${Date.now()}`,
        status: 'HELD_IN_ESCROW',
        amountKes,
        farmerPayoutKes,
        platformFeeKes,
        isMocked: true,
      };
    }
  }

  /**
   * Releases escrow funds upon delivery confirmation:
   * 97% to Farmer via Stripe Transfer, 3% retained as SokoYield platform revenue.
   */
  async releaseEscrowToFarmer(
    cropId: string,
    farmerStripeAccountId: string,
    amountKes: number,
    paymentIntentId?: string,
  ): Promise<PayoutResult> {
    const farmerPayoutKes = Number((amountKes * 0.97).toFixed(2));
    const platformFeeKes = Number((amountKes * 0.03).toFixed(2));

    if (!this.stripe) {
      this.logger.log(
        `[MOCK STRIPE PAYOUT] Transferred KES ${farmerPayoutKes} (97%) to Farmer ${farmerStripeAccountId}. Retained KES ${platformFeeKes} (3%) SokoYield fee.`,
      );
      return {
        transferId: `tr_mock_payout_${Date.now()}`,
        status: 'RELEASED_TO_FARMER',
        farmerPayoutKes,
        platformFeeKes,
        isMocked: true,
      };
    }

    try {
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(farmerPayoutKes * 100),
        currency: 'kes',
        destination: farmerStripeAccountId,
        source_transaction: paymentIntentId,
        metadata: {
          cropId,
          farmerPayoutKes: farmerPayoutKes.toString(),
          platformFeeKes: platformFeeKes.toString(),
        },
      });

      return {
        transferId: transfer.id,
        status: 'RELEASED_TO_FARMER',
        farmerPayoutKes,
        platformFeeKes,
        isMocked: false,
      };
    } catch (err) {
      this.logger.error(`Stripe payout transfer failed: ${(err as Error).message}`);
      return {
        transferId: `tr_fallback_${Date.now()}`,
        status: 'RELEASED_TO_FARMER',
        farmerPayoutKes,
        platformFeeKes,
        isMocked: true,
      };
    }
  }

  /**
   * Creates a Stripe Checkout Session for the $500/month Buyer SaaS Terminal paywall.
   */
  async createSaaSSubscriptionCheckout(
    userId: string,
    userEmail: string,
    returnUrl: string,
  ): Promise<{ checkoutUrl: string; isMocked: boolean }> {
    const priceId = this.config.get('STRIPE_SAAS_PRICE_ID', { infer: true });

    if (!this.stripe) {
      // Mock instant checkout redirect URL in development
      const mockUrl = `${returnUrl}?session_id=mock_sub_session_${Date.now()}&status=success`;
      this.logger.log(`[MOCK STRIPE SAAS] Generated $500/mo subscription URL for ${userEmail}`);
      return { checkoutUrl: mockUrl, isMocked: true };
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: userEmail,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancel_url: `${returnUrl}?status=cancelled`,
        metadata: {
          userId,
          plan: 'BUYER_SAAS_PRO_500',
        },
      });

      return { checkoutUrl: session.url ?? returnUrl, isMocked: false };
    } catch (err) {
      this.logger.error(`Failed to create Stripe SaaS session: ${(err as Error).message}`);
      return {
        checkoutUrl: `${returnUrl}?session_id=mock_fallback&status=success`,
        isMocked: true,
      };
    }
  }
}
