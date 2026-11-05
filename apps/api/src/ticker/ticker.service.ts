import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../database/database.module.js';
import {
  commodityPrices,
  type CommodityPrice,
} from '../database/schema.js';
import { TickerGateway } from './ticker.gateway.js';

interface BaselineCommodity {
  name: string;
  basePriceKes: number;
  unit: string;
}

const BASELINE_COMMODITIES: BaselineCommodity[] = [
  { name: 'Maize', basePriceKes: 3200, unit: '90kg bag' },
  { name: 'Potatoes', basePriceKes: 2800, unit: '50kg bag' },
  { name: 'Beans', basePriceKes: 6400, unit: '90kg bag' },
  { name: 'Wheat', basePriceKes: 4100, unit: '90kg bag' },
  { name: 'Sorghum', basePriceKes: 3600, unit: '90kg bag' },
];

@Injectable()
export class TickerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TickerService.name);
  private currentPrices = new Map<string, CommodityPrice>();

  constructor(
    @Inject(DRIZZLE_DB) private readonly db: DrizzleDb,
    private readonly tickerGateway: TickerGateway,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedInitialPrices();
  }

  /**
   * Initializes initial market price points for Kenya agricultural exchanges (Nakuru Central Market).
   */
  async seedInitialPrices(): Promise<void> {
    try {
      for (const item of BASELINE_COMMODITIES) {
        const existing = await this.db
          .select()
          .from(commodityPrices)
          .where(eq(commodityPrices.commodity, item.name))
          .orderBy(desc(commodityPrices.time))
          .limit(1);

        if (existing.length === 0) {
          const [inserted] = await this.db
            .insert(commodityPrices)
            .values({
              commodity: item.name,
              priceKes: item.basePriceKes.toFixed(2),
              changePct: '0.00',
              volumeBags: 1200,
              marketLocation: 'Nakuru Central Market',
            })
            .returning();

          if (inserted) {
            this.currentPrices.set(item.name, inserted);
          }
        } else {
          this.currentPrices.set(item.name, existing[0]);
        }
      }
      this.logger.log('Trading ticker seeded with baseline agricultural prices');
    } catch (err) {
      this.logger.warn(`Could not seed ticker prices: ${(err as Error).message}`);
    }
  }

  /**
   * Simulates high-frequency market price fluctuations every 10 seconds.
   * Inserts into TimescaleDB and streams via WebSockets.
   */
  @Cron('*/10 * * * * *')
  async generatePriceFluctuations(): Promise<void> {
    for (const item of BASELINE_COMMODITIES) {
      const current = this.currentPrices.get(item.name);
      const currentPrice = current ? Number(current.priceKes) : item.basePriceKes;

      // Realistic random fluctuation between -1.8% and +2.0%
      const deltaPercent = Number(((Math.random() * 3.8) - 1.8).toFixed(2));
      const newPrice = Math.max(100, Math.round(currentPrice * (1 + deltaPercent / 100)));
      const volume = Math.floor(200 + Math.random() * 2500);

      try {
        const [tick] = await this.db
          .insert(commodityPrices)
          .values({
            commodity: item.name,
            priceKes: newPrice.toFixed(2),
            changePct: deltaPercent.toFixed(2),
            volumeBags: volume,
            marketLocation: 'Nakuru Central Market',
          })
          .returning();

        if (tick) {
          this.currentPrices.set(item.name, tick);
          // Broadcast to connected Next.js buyer terminals over WebSockets
          this.tickerGateway.broadcastPriceUpdate(tick);
        }
      } catch {
        // Fallback in-memory update if DB is offline
        const simulatedTick: CommodityPrice = {
          id: `tick-${Date.now()}`,
          time: new Date(),
          commodity: item.name,
          priceKes: newPrice.toFixed(2),
          changePct: deltaPercent.toFixed(2),
          volumeBags: volume,
          marketLocation: 'Nakuru Central Market',
        };
        this.currentPrices.set(item.name, simulatedTick);
        this.tickerGateway.broadcastPriceUpdate(simulatedTick);
      }
    }
  }

  /**
   * Returns current latest price snapshot for all tracked commodities.
   */
  async getLatestPrices(): Promise<CommodityPrice[]> {
    if (this.currentPrices.size > 0) {
      return Array.from(this.currentPrices.values());
    }

    try {
      const list = await this.db
        .select()
        .from(commodityPrices)
        .orderBy(desc(commodityPrices.time))
        .limit(10);
      return list;
    } catch {
      return BASELINE_COMMODITIES.map((c, i) => ({
        id: `mock-price-${i}`,
        time: new Date(),
        commodity: c.name,
        priceKes: c.basePriceKes.toFixed(2),
        changePct: '+1.50',
        volumeBags: 1500,
        marketLocation: 'Nakuru Central Market',
      }));
    }
  }

  /**
   * Retrieves historical time-series data for charting.
   */
  async getPriceHistory(commodity: string, limit = 50): Promise<CommodityPrice[]> {
    try {
      return await this.db
        .select()
        .from(commodityPrices)
        .where(eq(commodityPrices.commodity, commodity))
        .orderBy(desc(commodityPrices.time))
        .limit(limit);
    } catch {
      return [];
    }
  }
}
