import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FintechService } from './fintech.service.js';

describe('FintechService', () => {
  let service: FintechService;
  let mockDb: any;
  let mockStripeService: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      query: {
        cropAssets: {
          findFirst: vi.fn(),
        },
        userSubscriptions: {
          findFirst: vi.fn(),
        },
      },
    };

    mockStripeService = {
      holdInEscrow: vi.fn().mockResolvedValue({
        paymentIntentId: 'pi_mock_123',
        status: 'HELD_IN_ESCROW',
        amountKes: 10000,
        farmerPayoutKes: 9700,
        platformFeeKes: 300,
        isMocked: true,
      }),
      releaseEscrowToFarmer: vi.fn().mockResolvedValue({
        transferId: 'tr_mock_456',
        status: 'RELEASED_TO_FARMER',
        farmerPayoutKes: 9700,
        platformFeeKes: 300,
        isMocked: true,
      }),
    };

    service = new FintechService(mockDb, mockStripeService);
  });

  it('holds funds in escrow when crop is PENDING_DEPOSIT', async () => {
    const mockCrop = {
      id: 'crop-1',
      farmerId: 'farmer-1',
      totalPriceKes: '10000.00',
      escrowStatus: 'PENDING_DEPOSIT',
    };

    mockDb.query.cropAssets.findFirst.mockResolvedValueOnce(mockCrop);
    mockDb.returning.mockResolvedValueOnce([{ ...mockCrop, escrowStatus: 'HELD_IN_ESCROW' }]);

    const res = await service.depositIntoEscrow('crop-1', 'buyer-1');

    expect(res.crop.escrowStatus).toBe('HELD_IN_ESCROW');
    expect(mockStripeService.holdInEscrow).toHaveBeenCalledWith('crop-1', 'buyer-1', 10000);
    expect(mockDb.insert).toHaveBeenCalled(); // double-entry ledger entry
  });

  it('throws BadRequestException if crop is already in escrow', async () => {
    mockDb.query.cropAssets.findFirst.mockResolvedValueOnce({
      id: 'crop-1',
      escrowStatus: 'HELD_IN_ESCROW',
    });

    await expect(service.depositIntoEscrow('crop-1', 'buyer-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('confirms delivery and releases funds to farmer', async () => {
    const mockCrop = {
      id: 'crop-1',
      farmerId: 'farmer-1',
      buyerId: 'buyer-1',
      totalPriceKes: '10000.00',
      escrowStatus: 'HELD_IN_ESCROW',
    };

    mockDb.query.cropAssets.findFirst.mockResolvedValueOnce(mockCrop);
    mockDb.returning.mockResolvedValueOnce([{ ...mockCrop, escrowStatus: 'RELEASED_TO_FARMER' }]);

    const res = await service.confirmDeliveryAndPayout('crop-1', {
      id: 'buyer-1',
      role: 'BUYER',
    });

    expect(res.crop.escrowStatus).toBe('RELEASED_TO_FARMER');
    expect(mockStripeService.releaseEscrowToFarmer).toHaveBeenCalled();
  });

  it('checks buyer $500/mo subscription status', async () => {
    mockDb.query.userSubscriptions.findFirst.mockResolvedValueOnce({
      status: 'ACTIVE',
      planName: 'BUYER_SAAS_PRO_500',
    });

    const status = await service.checkBuyerSubscription('buyer-1');
    expect(status.hasActiveSubscription).toBe(true);
    expect(status.monthlyPriceUsd).toBe(500);
  });
});
