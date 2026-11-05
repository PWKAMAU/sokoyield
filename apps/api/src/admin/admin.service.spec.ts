import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminService } from './admin.service.js';

describe('AdminService', () => {
  let service: AdminService;
  let mockDb: any;
  let mockPgPool: any;
  let mockRedis: any;
  let mockKafka: any;
  let mockFintechService: any;
  let mockConfig: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      query: {
        cropDisputes: {
          findFirst: vi.fn(),
        },
        cropAssets: {
          findFirst: vi.fn(),
        },
      },
    };

    mockPgPool = {
      query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
    };

    mockRedis = {
      ping: vi.fn().mockResolvedValue('PONG'),
    };

    mockKafka = {};

    mockFintechService = {
      confirmDeliveryAndPayout: vi.fn().mockResolvedValue({ success: true }),
      getLiquiditySummary: vi.fn().mockResolvedValue({
        totalEscrowBalanceKes: 4500000,
        activeEscrowHoldsCount: 12,
        totalFarmerPayoutsReleasedKes: 18500000,
        totalPlatformFeesCollectedKes: 572164,
        recentTransactions: [],
      }),
    };

    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'KINDWISE_API_KEY') return 'test_kindwise_key';
        return undefined;
      }),
    };

    service = new AdminService(
      mockDb,
      mockPgPool,
      mockRedis,
      mockKafka as any,
      mockFintechService,
      mockConfig as unknown as ConfigService<any, true>,
    );
  });

  it('reports operational health metrics for all 6 integrated subsystems', async () => {
    const health = await service.getSystemHealthMetrics();

    expect(health.services).toHaveLength(6);
    expect(health.overallStatus).toBe('HEALTHY');

    const serviceNames = health.services.map((s) => s.service);
    expect(serviceNames).toContain('Kindwise Crop.health AI');
    expect(serviceNames).toContain('Agrio / Satellite Weather');
    expect(serviceNames).toContain('Twilio SMS Gateway');
    expect(serviceNames).toContain('PostgreSQL / TimescaleDB Ledger');
    expect(serviceNames).toContain('Redis Caching Layer');
    expect(serviceNames).toContain('Apache Kafka Event Bus');
  });

  it('retrieves liquidity monitor metrics from FintechService', async () => {
    const liquidity = await service.getLiquidityMonitor();

    expect(liquidity.totalEscrowBalanceKes).toBe(4500000);
    expect(liquidity.activeEscrowHoldsCount).toBe(12);
  });

  it('rules dispute in favor of farmer and triggers 97% escrow release', async () => {
    const mockDispute = {
      id: 'disp-1',
      cropAssetId: 'crop-1',
      buyerId: 'buyer-1',
      farmerId: 'farmer-1',
      status: 'OPEN',
    };

    const mockCrop = {
      id: 'crop-1',
      totalPriceKes: '50000.00',
    };

    mockDb.query.cropDisputes.findFirst.mockResolvedValueOnce(mockDispute);
    mockDb.query.cropAssets.findFirst.mockResolvedValueOnce(mockCrop);
    mockDb.returning.mockResolvedValueOnce([{ ...mockDispute, status: 'RESOLVED_FARMER_PAID' }]);

    const res = await service.resolveDispute('disp-1', {
      ruling: 'RELEASE_TO_FARMER',
      notes: 'AI proof-of-quality scan confirms grade A at dispatch.',
      adminId: 'admin-99',
    });

    expect(res.ruling).toBe('RELEASE_TO_FARMER');
    expect(mockFintechService.confirmDeliveryAndPayout).toHaveBeenCalled();
  });

  it('rules dispute in favor of buyer and issues full escrow refund', async () => {
    const mockDispute = {
      id: 'disp-2',
      cropAssetId: 'crop-2',
      buyerId: 'buyer-2',
      farmerId: 'farmer-2',
      status: 'OPEN',
    };

    const mockCrop = {
      id: 'crop-2',
      totalPriceKes: '30000.00',
      farmerId: 'farmer-2',
    };

    mockDb.query.cropDisputes.findFirst.mockResolvedValueOnce(mockDispute);
    mockDb.query.cropAssets.findFirst.mockResolvedValueOnce(mockCrop);
    mockDb.returning.mockResolvedValueOnce([{ ...mockDispute, status: 'RESOLVED_BUYER_REFUNDED' }]);

    const res = await service.resolveDispute('disp-2', {
      ruling: 'REFUND_BUYER',
      notes: 'Confirmed transit contamination.',
      adminId: 'admin-99',
    });

    expect(res.ruling).toBe('REFUND_BUYER');
    expect(mockDb.insert).toHaveBeenCalled(); // double-entry refund audit
  });
});
