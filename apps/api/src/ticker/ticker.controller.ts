import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator.js';
import { TickerService } from './ticker.service.js';

@Controller('api/v1/ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Public()
  @Get('latest')
  async getLatestPrices() {
    const prices = await this.tickerService.getLatestPrices();
    return { prices };
  }

  @Public()
  @Get('history')
  async getPriceHistory(
    @Query('commodity') commodity: string = 'Maize',
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? Math.min(Number(limit), 200) : 50;
    const history = await this.tickerService.getPriceHistory(commodity, parsedLimit);
    return { commodity, history };
  }
}
