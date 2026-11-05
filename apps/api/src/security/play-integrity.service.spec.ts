import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayIntegrityService } from './play-integrity.service.js';

describe('PlayIntegrityService', () => {
  let service: PlayIntegrityService;
  let mockConfig: any;

  beforeEach(() => {
    mockConfig = {
      get: vi.fn(),
    };
    service = new PlayIntegrityService(mockConfig as unknown as ConfigService<any, true>);
  });

  it('validates a verified physical device token successfully', async () => {
    const verdict = await service.verifyIntegrityToken('sokoyield_test_token_verified_device');

    expect(verdict.isValid).toBe(true);
    expect(verdict.isEmulator).toBe(false);
    expect(verdict.appLicensingVerdict).toBe('LICENSED');
    expect(verdict.deviceRecognitionVerdict).toContain('MEETS_DEVICE_INTEGRITY');
  });

  it('detects unverified emulator device and marks verdict as invalid', async () => {
    const verdict = await service.verifyIntegrityToken('sokoyield_test_token_emulator');

    expect(verdict.isValid).toBe(false);
    expect(verdict.isEmulator).toBe(true);
    expect(verdict.deviceRecognitionVerdict).toContain('EMULATOR_DETECTED');
    expect(verdict.errorMessage).toContain('Unverified emulator detected');
  });

  it('rejects spoofed uploads with UnauthorizedException on assertion failure', async () => {
    await expect(
      service.assertDeviceIntegrity('sokoyield_test_token_emulator'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
