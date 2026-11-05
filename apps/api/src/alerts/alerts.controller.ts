import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator.js';
import { AlertsService, type AgroAlert } from './alerts.service.js';

@Controller('api/v1/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Public()
  @Get('active')
  async getActiveAlert(
    @Query('county') county: string = 'Nakuru County',
  ): Promise<{ alert: AgroAlert | null }> {
    const alert = await this.alertsService.getActiveAlert(county);
    return { alert };
  }

  @Public()
  @Post('simulate')
  async simulateAlert(
    @Body() body: { county?: string; message?: string },
  ): Promise<{ success: boolean; alert: AgroAlert }> {
    const alert = await this.alertsService.simulateEmergencyAlert(
      body.county ?? 'Nakuru County',
      body.message,
    );
    return { success: true, alert };
  }
}
