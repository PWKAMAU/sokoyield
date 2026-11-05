export type AiGrade = 'PENDING_SCAN' | 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'REJECTED';

export interface DiagnosisResult {
  healthy: boolean;
  diseaseDetected: boolean;
  diseaseName?: string;
  confidence: number;
  pathologyNotes?: string;
  suggestedGrade: AiGrade;
  provider: 'kindwise' | 'plantix' | 'mock';
  rawResponse?: Record<string, unknown>;
}

export interface CropAiProvider {
  readonly providerName: string;
  diagnose(
    imageBuffer: Buffer,
    mimeType: string,
    options?: {
      cropName?: string;
      latitude?: number;
      longitude?: number;
    },
  ): Promise<DiagnosisResult>;
}
