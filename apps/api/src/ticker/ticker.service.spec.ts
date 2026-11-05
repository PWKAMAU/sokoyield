import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TickerService } from './ticker.service.js';

describe('TickerService', () => {
  let service: TickerService;
  let mockDb: any;
  let mockGateway: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([
        {
          id: 'tick-1',
          commodity: 'Maize',
          priceKes: '3200.00',
          changePct: '+2.10',
          volumeBags: 1200,
          marketLocation: 'Nakuru Central Market',
          time: new Date(),
        },
      ]),
    };

    mockGateway = {
      broadcastPriceUpdate: vi.fn(),
    };

    service = new TickerService(mockDb, mockGateway);
  });

  it('seeds baseline commodity prices and broadcasts ticks', async () => {
    await service.seedInitialPrices();
    const prices = await service.getLatestPrices();

    expect(prices.length).toBeGreaterThan(0);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('generates price fluctuations and streams via WebSockets', async () => {
    await service.generatePriceFluctuations();

    expect(mockGateway.broadcastPriceUpdate).toHaveBeenCalled();
  });
});
