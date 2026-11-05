import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../database/database.module.js';
import { cropAssets } from '../database/schema.js';
import { KafkaService } from '../kafka/kafka.module.js';
import type { DiagnosisResult } from './crop-ai.interface.js';
import { KindwiseProvider } from './kindwise.provider.js';
import { PlantixProvider } from './plantix.provider.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject(DRIZZLE_DB) private readonly db: DrizzleDb,
    private readonly kindwiseProvider: KindwiseProvider,
    private readonly plantixProvider: PlantixProvider,
    private readonly kafka: KafkaService,
  ) {}

  /**
   * Primary AI Grading routine.
   * Invokes Kindwise Crop.health as primary provider (with Plantix pluggable fallback),
   * updates the relational ledger in PostgreSQL, and emits Kafka completion event.
   */
  async processCropGrading(
    cropId: string,
    imageBuffer: Buffer,
    mimeType: string,
    options?: {
      cropName?: string;
      latitude?: number;
      longitude?: number;
      preferredProvider?: 'kindwise' | 'plantix';
      photoUrl?: string;
    },
  ): Promise<{ crop: typeof cropAssets.$inferSelect; diagnosis: DiagnosisResult }> {
    const existing = await this.db.query.cropAssets.findFirst({
      where: eq(cropAssets.id, cropId),
    });

    if (!existing) {
      throw new NotFoundException(`Crop asset ${cropId} not found`);
    }

    const provider =
      options?.preferredProvider === 'plantix'
        ? this.plantixProvider
        : this.kindwiseProvider;

    this.logger.log(
      `Grading crop ${cropId} (${options?.cropName ?? existing.cropName}) using provider: ${provider.providerName}`,
    );

    const diagnosis = await provider.diagnose(imageBuffer, mimeType, {
      cropName: options?.cropName ?? existing.cropName,
      latitude: options?.latitude,
      longitude: options?.longitude,
    });

    // Write verified grade, confidence, and pathology notes to PostgreSQL
    const [updated] = await this.db
      .update(cropAssets)
      .set({
        aiGrade: diagnosis.suggestedGrade,
        aiConfidence: diagnosis.confidence.toFixed(4),
        aiDiagnosis: {
          diseaseDetected: diagnosis.diseaseDetected,
          diseaseName: diagnosis.diseaseName,
          pathologyNotes: diagnosis.pathologyNotes,
          qualityCertUrl: options?.photoUrl ?? existing.photoUrl ?? undefined,
        },
        photoUrl: options?.photoUrl ?? existing.photoUrl,
        updatedAt: new Date(),
      })
      .where(eq(cropAssets.id, cropId))
      .returning();

    // Broadcast completion to Kafka topic: crop.grade.completed
    await this.kafka.emitCropGradeCompleted({
      cropId,
      aiGrade: diagnosis.suggestedGrade,
      confidence: diagnosis.confidence,
      healthy: diagnosis.healthy,
      diseaseName: diagnosis.diseaseName,
      pathologyNotes: diagnosis.pathologyNotes,
      provider: diagnosis.provider,
      timestamp: new Date().toISOString(),
    });

    return { crop: updated, diagnosis };
  }
}
