import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StripeService } from './stripe.service.js';

describe('StripeService', () => {
  let service: StripeService;
  let mockConfig: any;
  let mockDb: any;

  beforeEach(() => {
    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'STRIPE_SAAS_PRICE_ID') return 'price_buyer_saas_pro_500';
        return undefined; // Simulated mock Stripe mode
      }),
    };
    mockDb = {};
    service = new StripeService(
      mockConfig as unknown as ConfigService<any, true>,
      mockDb as any,
    );
  });

  it('holds funds in escrow calculating 97% farmer payout and 3% platform fee', async () => {
    const res = await service.holdInEscrow('crop-123', 'buyer-456', 45000);

    expect(res.status).toBe('HELD_IN_ESCROW');
    expect(res.amountKes).toBe(45000);
    expect(res.farmerPayoutKes).toBe(43650); // 97% of 45,000
    expect(res.platformFeeKes).toBe(1350);   // 3% of 45,000
    expect(res.isMocked).toBe(true);
    expect(res.paymentIntentId).toMatch(/^pi_mock_escrow_/);
  });

  it('releases escrow funds upon physical delivery confirmation', async () => {
    const res = await service.releaseEscrowToFarmer(
      'crop-123',
      'acct_farmer_stripe',
      50000,
    );

    expect(res.status).toBe('RELEASED_TO_FARMER');
    expect(res.farmerPayoutKes).toBe(48500); // 97%
    expect(res.platformFeeKes).toBe(1500);   // 3%
    expect(res.isMocked).toBe(true);
    expect(res.transferId).toMatch(/^tr_mock_payout_/);
  });

  it('creates $500/mo SaaS subscription checkout URL', async () => {
    const res = await service.createSaaSSubscriptionCheckout(
      'user-1',
      'buyer@sokoyield.market',
      'http://localhost:3000/dashboard',
    );

    expect(res.isMocked).toBe(true);
    expect(res.checkoutUrl).toContain('session_id=mock_sub_session_');
  });
});
