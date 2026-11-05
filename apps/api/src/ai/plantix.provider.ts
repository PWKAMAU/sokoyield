import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import type { CropAiProvider, DiagnosisResult, AiGrade } from './crop-ai.interface.js';

interface PlantixDiagnosisItem {
  disease_id?: string;
  disease_name?: string;
  confidence?: number;
  symptoms?: string[];
  treatment?: {
    biological?: string[];
    chemical?: string[];
  };
}

interface PlantixAnalysisResponse {
  diagnosis?: PlantixDiagnosisItem[];
  crop?: string;
  healthy?: boolean;
}

@Injectable()
export class PlantixProvider implements CropAiProvider {
  readonly providerName = 'plantix';
  private readonly logger = new Logger(PlantixProvider.name);

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
    const apiKey = this.config.get('PLANTIX_API_KEY', { infer: true });
    const apiUrl = this.config.get('PLANTIX_API_URL', { infer: true });

    if (!apiKey) {
      this.logger.warn(
        `[MOCK PLANTIX] PLANTIX_API_KEY is not configured. Running fallback simulation for ${options?.cropName ?? 'harvest'}.`,
      );
      return this.simulateDiagnosis(options?.cropName);
    }

    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
      formData.append('image', blob, 'crop_sample.jpg');

      if (options?.cropName) {
        formData.append('crop_id', options.cropName.toLowerCase());
      }
      if (options?.latitude !== undefined && options?.longitude !== undefined) {
        formData.append('lat', options.latitude.toString());
        formData.append('lng', options.longitude.toString());
      }
      formData.append('language', 'en');

      const response = await fetch(`${apiUrl}/image_analysis`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Plantix API error (${response.status}): ${errorText}`);
        return this.simulateDiagnosis(options?.cropName);
      }

      const data = (await response.json()) as PlantixAnalysisResponse;
      return this.mapPlantixResponse(data, options?.cropName);
    } catch (err) {
      this.logger.error(`Plantix request failed: ${(err as Error).message}. Falling back to simulation.`);
      return this.simulateDiagnosis(options?.cropName);
    }
  }

  private mapPlantixResponse(
    data: PlantixAnalysisResponse,
    cropName?: string,
  ): DiagnosisResult {
    const isHealthy = data.healthy ?? true;
    const topDiagnosis = data.diagnosis?.[0];
    const confidence = topDiagnosis?.confidence ?? 0.90;

    let suggestedGrade: AiGrade = 'GRADE_A';
    let diseaseDetected = false;
    let pathologyNotes = `Plantix verified healthy ${cropName ?? 'crop'}.`;

    if (!isHealthy || (topDiagnosis && confidence > 0.20)) {
      diseaseDetected = true;
      const dName = topDiagnosis?.disease_name ?? 'Foliar Pathogen';

      if (confidence >= 0.80) {
        suggestedGrade = 'REJECTED';
        pathologyNotes = `Severe ${dName} infestation (confidence ${Math.round(confidence * 100)}%).`;
      } else if (confidence >= 0.40) {
        suggestedGrade = 'GRADE_C';
        pathologyNotes = `Moderate ${dName} detected (${Math.round(confidence * 100)}%).`;
      } else {
        suggestedGrade = 'GRADE_B';
        pathologyNotes = `Mild ${dName} traces (${Math.round(confidence * 100)}%).`;
      }
    }

    return {
      healthy: !diseaseDetected,
      diseaseDetected,
      diseaseName: diseaseDetected ? topDiagnosis?.disease_name : undefined,
      confidence,
      pathologyNotes,
      suggestedGrade,
      provider: 'plantix',
      rawResponse: data as unknown as Record<string, unknown>,
    };
  }

  private simulateDiagnosis(cropName?: string): DiagnosisResult {
    return {
      healthy: true,
      diseaseDetected: false,
      confidence: 0.95,
      pathologyNotes: `Simulated Plantix validation for ${cropName ?? 'produce'}: No signs of foliar blight.`,
      suggestedGrade: 'GRADE_A',
      provider: 'mock',
    };
  }
}
