import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AlertsService } from './alerts.service.js';

describe('AlertsService', () => {
  let service: AlertsService;
  let mockRedis: any;
  let mockKafka: any;
  let mockTwilio: any;
  let mockConfig: any;

  beforeEach(() => {
    mockRedis = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue('OK'),
    };

    mockKafka = {
      emitAgroAlertIssued: vi.fn().mockResolvedValue(true),
    };

    mockTwilio = {
      sendEmergencyAlert: vi.fn().mockResolvedValue({
        success: true,
        recipient: '+254119348818',
        mocked: true,
      }),
    };

    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'AGRIO_API_URL') return 'https://api.agrio.app/v1';
        return undefined;
      }),
    };

    service = new AlertsService(
      mockConfig as unknown as ConfigService<any, true>,
      mockRedis,
      mockKafka,
      mockTwilio,
    );
  });

  it('retrieves default prototype alert for Nakuru County', async () => {
    const alert = await service.getActiveAlert('Nakuru County');
    expect(alert).not.toBeNull();
    expect(alert?.title).toBe('PEST & WEATHER ALERT');
    expect(alert?.message).toContain('Desert Locust');
    expect(alert?.county).toBe('Nakuru County');
  });

  it('dispatches emergency alert via Kafka and Twilio SMS', async () => {
    const alert = await service.simulateEmergencyAlert(
      'Nakuru County',
      'Flash flood warning along Lake Nakuru catchment.',
    );

    expect(alert.county).toBe('Nakuru County');
    expect(mockKafka.emitAgroAlertIssued).toHaveBeenCalled();
    expect(mockTwilio.sendEmergencyAlert).toHaveBeenCalledWith(
      expect.stringContaining('Flash flood warning'),
    );
    expect(mockRedis.set).toHaveBeenCalled();
  });
});
