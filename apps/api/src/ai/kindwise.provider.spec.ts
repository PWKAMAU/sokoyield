import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KindwiseProvider } from './kindwise.provider.js';

describe('KindwiseProvider', () => {
  let provider: KindwiseProvider;
  let mockConfig: any;

  beforeEach(() => {
    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'KINDWISE_API_URL') return 'https://crop.kindwise.com/api/v1';
        return undefined; // no API key -> fallback simulation
      }),
    };
    provider = new KindwiseProvider(mockConfig as unknown as ConfigService<any, true>);
  });

  it('runs deterministic simulation when API key is missing and returns GRADE_A for healthy produce', async () => {
    const dummyBuffer = Buffer.from('fake-image-bytes');
    const result = await provider.diagnose(dummyBuffer, 'image/jpeg', {
      cropName: 'Maize',
      latitude: -0.3031,
      longitude: 36.08,
    });

    expect(result.healthy).toBe(true);
    expect(result.suggestedGrade).toBe('GRADE_A');
    expect(result.confidence).toBeGreaterThan(0.9);
    expect(result.provider).toBe('mock');
  });

  it('downgrades produce to GRADE_C when blight symptoms are identified in crop name simulation', async () => {
    const dummyBuffer = Buffer.from('fake-image-bytes');
    const result = await provider.diagnose(dummyBuffer, 'image/jpeg', {
      cropName: 'Potato with Early Blight',
      latitude: -0.3031,
      longitude: 36.08,
    });

    expect(result.healthy).toBe(false);
    expect(result.diseaseDetected).toBe(true);
    expect(result.suggestedGrade).toBe('GRADE_C');
    expect(result.diseaseName).toContain('Early Blight');
  });
});
