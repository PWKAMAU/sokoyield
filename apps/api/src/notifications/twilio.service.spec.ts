import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TwilioService } from './twilio.service.js';

describe('TwilioService', () => {
  let service: TwilioService;
  let mockConfig: any;

  beforeEach(() => {
    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'EMERGENCY_ALERT_RECIPIENT') return '+254119348818';
        return undefined; // mock SMS mode
      }),
    };
    service = new TwilioService(mockConfig as unknown as ConfigService<any, true>);
  });

  it('dispatches mock emergency SMS to +254119348818 without crashing when credentials are not configured', async () => {
    const res = await service.sendEmergencyAlert(
      'Desert Locust warning in Nakuru County & heavy rain forecast.',
    );

    expect(res.success).toBe(true);
    expect(res.mocked).toBe(true);
    expect(res.recipient).toBe('+254119348818');
    expect(res.messageId).toMatch(/^mock-sms-/);
  });

  it('allows overriding the recipient number for specific farmers', async () => {
    const res = await service.sendEmergencyAlert(
      'Test Alert',
      '+254700000000',
    );

    expect(res.recipient).toBe('+254700000000');
    expect(res.mocked).toBe(true);
  });
});
