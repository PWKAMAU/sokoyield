import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import type { CropAiProvider, DiagnosisResult, AiGrade } from './crop-ai.interface.js';

interface KindwiseIdentificationResponse {
  result?: {
    is_plant?: {
      binary: boolean;
      probability: number;
    };
    is_healthy?: {
      binary: boolean;
      probability: number;
    };
    disease?: {
      suggestions?: Array<{
        name: string;
        probability: number;
        scientific_name?: string;
        details?: {
          description?: string;
          treatment?: Record<string, unknown>;
        };
      }>;
    };
  };
}

@Injectable()
export class KindwiseProvider implements CropAiProvider {
  readonly providerName = 'kindwise';
  private readonly logger = new Logger(KindwiseProvider.name);

  constructor(private readonly config: ConfigService<Env, true>) {}

  async diagnose(
    imageBuffer: Buffer,
    mimeType: string,
    options?: {
      cropName?: string;
      latitude?: number;
      longitude?: number;
    },
  ): Promise<DiagnosisResult> {
    const apiKey = this.config.get('KINDWISE_API_KEY', { infer: true });
    const apiUrl = this.config.get('KINDWISE_API_URL', { infer: true });

    if (!apiKey) {
      this.logger.warn(
        `[MOCK KINDWISE] KINDWISE_API_KEY is not configured. Executing deterministic crop health simulation for ${options?.cropName ?? 'harvest'}.`,
      );
      return this.simulateDiagnosis(options?.cropName);
    }

    try {
      const base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
      const payload: Record<string, unknown> = {
        images: [base64Image],
        similar_images: false,
      };

      if (options?.latitude !== undefined && options?.longitude !== undefined) {
        payload.latitude = options.latitude;
        payload.longitude = options.longitude;
      }

      const response = await fetch(`${apiUrl}/identification`, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Kindwise API error (${response.status}): ${errorText}`);
        return this.simulateDiagnosis(options?.cropName);
      }

      const data = (await response.json()) as KindwiseIdentificationResponse;
      return this.mapKindwiseResponse(data, options?.cropName);
    } catch (err) {
      this.logger.error(`Kindwise request failed: ${(err as Error).message}. Falling back to simulation.`);
      return this.simulateDiagnosis(options?.cropName);
    }
  }

  private mapKindwiseResponse(
    data: KindwiseIdentificationResponse,
    cropName?: string,
  ): DiagnosisResult {
    const isHealthy = data.result?.is_healthy?.binary ?? true;
    const healthProb = data.result?.is_healthy?.probability ?? 0.92;
    const topDisease = data.result?.disease?.suggestions?.[0];
    const diseaseProb = topDisease?.probability ?? (1 - healthProb);

    let suggestedGrade: AiGrade = 'GRADE_A';
    let diseaseDetected = false;
    let pathologyNotes = `Verified healthy ${cropName ?? 'crop'} with ${Math.round(healthProb * 100)}% vigor rating.`;

    if (!isHealthy || diseaseProb > 0.15) {
      diseaseDetected = true;
      const dName = topDisease?.name ?? 'Mild Foliar Leaf Spot';

      if (diseaseProb >= 0.75) {
        suggestedGrade = 'REJECTED';
        pathologyNotes = `Severe ${dName} infestation (confidence ${Math.round(diseaseProb * 100)}%). Produce rejected for export/trading.`;
      } else if (diseaseProb >= 0.40) {
        suggestedGrade = 'GRADE_C';
        pathologyNotes = `Moderate ${dName} detected (${Math.round(diseaseProb * 100)}%). Downgraded to Grade C industrial processing.`;
      } else {
        suggestedGrade = 'GRADE_B';
        pathologyNotes = `Minor ${dName} traces (${Math.round(diseaseProb * 100)}%). Approved as standard Grade B commercial harvest.`;
      }
    }

    return {
      healthy: !diseaseDetected,
      diseaseDetected,
      diseaseName: diseaseDetected ? topDisease?.name : undefined,
      confidence: healthProb,
      pathologyNotes,
      suggestedGrade,
      provider: 'kindwise',
      rawResponse: data as unknown as Record<string, unknown>,
    };
  }

  private simulateDiagnosis(cropName?: string): DiagnosisResult {
    const isBlighted = cropName?.toLowerCase().includes('blight') ?? false;

    if (isBlighted) {
      return {
        healthy: false,
        diseaseDetected: true,
        diseaseName: 'Early Blight (Alternaria solani)',
        confidence: 0.88,
        pathologyNotes: 'Deterministic simulation: Early Blight concentric ring lesions observed.',
        suggestedGrade: 'GRADE_C',
        provider: 'mock',
      };
    }

    return {
      healthy: true,
      diseaseDetected: false,
      confidence: 0.965,
      pathologyNotes: 'Deterministic simulation: High vigor, uniform coloring, no visible foliar lesions.',
      suggestedGrade: 'GRADE_A',
      provider: 'mock',
    };
  }
}
