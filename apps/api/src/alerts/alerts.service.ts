import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Redis } from 'ioredis';
import type { Env } from '../config/env.schema.js';
import { KafkaService } from '../kafka/kafka.module.js';
import { TwilioService } from '../notifications/twilio.service.js';
import { REDIS_CLIENT } from '../redis/redis.module.js';

export interface AgroAlert {
  id: string;
  county: string;
  alertType: 'PEST_WARNING' | 'WEATHER_EXTREME' | 'DISEASE_OUTBREAK';
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  issuedAt: string;
  expiresAt: string;
}

@Injectable()
export class AlertsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AlertsService.name);

  // Nakuru County, Kenya epicenter
  private readonly nakuruCoordinates = {
    latitude: -0.3031,
    longitude: 36.08,
  };

  constructor(
    private readonly config: ConfigService<Env, true>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly kafka: KafkaService,
    private readonly twilio: TwilioService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Initialize default alert for Nakuru County matching prototype design banner
    await this.seedDefaultNakuruAlert();
  }

  /**
   * Seed the default alert seen in the prototype design:
   * "PEST & WEATHER ALERT: Desert Locust warning in Nakuru County & heavy rain forecast."
   */
  async seedDefaultNakuruAlert(): Promise<void> {
    try {
      const existing = await this.getActiveAlert('Nakuru County');
      if (!existing) {
        const defaultAlert: AgroAlert = {
          id: 'nakuru-alert-prototype',
          county: 'Nakuru County',
          alertType: 'PEST_WARNING',
          title: 'PEST & WEATHER ALERT',
          message: 'Desert Locust warning in Nakuru County & heavy rain forecast.',
          severity: 'CRITICAL',
          coordinates: this.nakuruCoordinates,
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };

        await this.cacheAlert(defaultAlert);
        this.logger.log('Seeded prototype Nakuru County pest & weather alert');
      }
    } catch (err) {
      this.logger.warn(`Could not seed initial alert in Redis: ${(err as Error).message}`);
    }
  }

  /**
   * Scheduled cron job running every 30 minutes.
   * Checks satellite weather and pest alerts for Nakuru County.
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async monitorNakuruWeatherAndPests(): Promise<void> {
    this.logger.log('Running scheduled agro weather & pest surveillance for Nakuru County...');

    try {
      // 1. Check Redis cache first to prevent excessive 3rd party API billing
      const cacheKey = 'weather:nakuru:cached_reading';
      let weatherData: any = null;

      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          weatherData = JSON.parse(cached);
          this.logger.debug('Retrieved Nakuru weather reading from Redis cache');
        }
      } catch {
        // Redis connection optional in tests
      }

      if (!weatherData) {
        weatherData = await this.fetchSatelliteWeatherData(
          this.nakuruCoordinates.latitude,
          this.nakuruCoordinates.longitude,
        );

        try {
          // Cache weather for 15 minutes (900 seconds)
          await this.redis.set(cacheKey, JSON.stringify(weatherData), 'EX', 900);
        } catch {
          // Redis write non-fatal
        }
      }

      // 2. Evaluate alert conditions (precipitation > 20mm or simulated pest condition)
      if (weatherData.precipitationMm > 20 || weatherData.pestAlertPresent) {
        const alert: AgroAlert = {
          id: `alert-nakuru-${Date.now()}`,
          county: 'Nakuru County',
          alertType: weatherData.pestAlertPresent ? 'PEST_WARNING' : 'WEATHER_EXTREME',
          title: 'PEST & WEATHER ALERT',
          message: `Heavy rainfall forecast (${weatherData.precipitationMm} mm) in Nakuru County. Protect harvested crops.`,
          severity: 'CRITICAL',
          coordinates: this.nakuruCoordinates,
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        };

        await this.dispatchAlert(alert);
      }
    } catch (err) {
      this.logger.error(`Agro surveillance check failed: ${(err as Error).message}`);
    }
  }

  /**
   * Fetches weather data using Open-Meteo / Agrio API fallback.
   */
  private async fetchSatelliteWeatherData(lat: number, lon: number): Promise<{
    temperatureC: number;
    precipitationMm: number;
    pestAlertPresent: boolean;
  }> {
    const agrioKey = this.config.get('AGRIO_API_KEY', { infer: true });

    if (agrioKey) {
      // Production Agrio satellite call
      try {
        const url = `${this.config.get('AGRIO_API_URL', { infer: true })}/satellite/alerts?lat=${lat}&lon=${lon}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${agrioKey}` } });
        if (res.ok) {
          const json = await res.json() as any;
          return {
            temperatureC: json.temperature ?? 22,
            precipitationMm: json.precipitation ?? 5,
            pestAlertPresent: json.pestWarning ?? false,
          };
        }
      } catch (err) {
        this.logger.warn(`Agrio API request failed, falling back to satellite weather: ${(err as Error).message}`);
      }
    }

    // Open-Meteo free high-accuracy global weather API
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json() as any;
        return {
          temperatureC: json.current?.temperature_2m ?? 21.5,
          precipitationMm: json.current?.precipitation ?? 0,
          pestAlertPresent: false,
        };
      }
    } catch (err) {
      this.logger.warn(`Open-Meteo weather fetch failed: ${(err as Error).message}`);
    }

    // Fallback baseline for Nakuru
    return {
      temperatureC: 22.0,
      precipitationMm: 2.5,
      pestAlertPresent: false,
    };
  }

  /**
   * Dispatches alert across all platform channels:
   * 1. Redis active alert cache (powers mobile banner)
   * 2. Kafka topic: alerts.agro.issued
   * 3. Twilio SMS to authorized contact number +254119348818
   */
  async dispatchAlert(alert: AgroAlert): Promise<void> {
    this.logger.log(`Dispatching agro alert: [${alert.title}] ${alert.message}`);

    // 1. Cache in Redis for mobile banner consumption
    await this.cacheAlert(alert);

    // 2. Publish to Kafka topic
    await this.kafka.emitAgroAlertIssued({
      id: alert.id,
      county: alert.county,
      alertType: alert.alertType,
      title: alert.title,
      message: alert.message,
      severity: alert.severity,
      coordinates: alert.coordinates,
      timestamp: alert.issuedAt,
    });

    // 3. Dispatch Twilio SMS to authorized test parameter: +254119348818
    const smsText = `${alert.title}: ${alert.message} Nakuru County. SokoYield Advisory.`;
    await this.twilio.sendEmergencyAlert(smsText);
  }

  async cacheAlert(alert: AgroAlert): Promise<void> {
    try {
      const key = `alert:${alert.county.toLowerCase().replace(/\s+/g, '_')}:active`;
      await this.redis.set(key, JSON.stringify(alert), 'EX', 86400); // 24 hours
    } catch (err) {
      this.logger.warn(`Failed caching alert in Redis: ${(err as Error).message}`);
    }
  }

  async getActiveAlert(county: string): Promise<AgroAlert | null> {
    try {
      const key = `alert:${county.toLowerCase().replace(/\s+/g, '_')}:active`;
      const data = await this.redis.get(key);
      if (data) {
        return JSON.parse(data) as AgroAlert;
      }
    } catch {
      // Redis optional
    }

    // Return prototype default if matching Nakuru
    if (county.toLowerCase().includes('nakuru')) {
      return {
        id: 'nakuru-alert-prototype',
        county: 'Nakuru County',
        alertType: 'PEST_WARNING',
        title: 'PEST & WEATHER ALERT',
        message: 'Desert Locust warning in Nakuru County & heavy rain forecast.',
        severity: 'CRITICAL',
        coordinates: this.nakuruCoordinates,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    return null;
  }

  /**
   * Testing endpoint: simulates and dispatches an emergency alert
   * triggers Twilio SMS and Kafka broadcast for verification.
   */
  async simulateEmergencyAlert(
    county: string = 'Nakuru County',
    customMessage?: string,
  ): Promise<AgroAlert> {
    const alert: AgroAlert = {
      id: `sim-alert-${Date.now()}`,
      county,
      alertType: 'PEST_WARNING',
      title: 'PEST & WEATHER ALERT',
      message:
        customMessage ?? 'Desert Locust warning in Nakuru County & heavy rain forecast.',
      severity: 'CRITICAL',
      coordinates: this.nakuruCoordinates,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    await this.dispatchAlert(alert);
    return alert;
  }
}
