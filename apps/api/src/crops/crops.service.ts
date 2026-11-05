import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../database/database.module.js';
import {
  cropAssets,
  escrowTransactions,
  type AiGrade,
  type CropAsset,
  type EscrowStatus,
  type UserRole,
} from '../database/schema.js';
import type {
  CreateCropDto,
  UpdateAiGradeDto,
  UpdateEscrowStatusDto,
} from './dto/crop.dto.js';

@Injectable()
export class CropsService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  /**
   * Records a harvested crop asset with GPS Polygon, AI Grade, Timestamp, and Escrow Status.
   * Automatically calculates the 97% Farmer payout and 3% SokoYield platform fee.
   */
  async createCrop(farmerId: string, dto: CreateCropDto): Promise<CropAsset> {
    const totalPrice = Number((dto.quantityKg * dto.unitPriceKes).toFixed(2));
    const farmerPayout = Number((totalPrice * 0.97).toFixed(2));
    const platformFee = Number((totalPrice * 0.03).toFixed(2));

    const [crop] = await this.db
      .insert(cropAssets)
      .values({
        farmerId,
        cropName: dto.cropName,
        quantityKg: dto.quantityKg.toFixed(2),
        unitPriceKes: dto.unitPriceKes.toFixed(2),
        totalPriceKes: totalPrice.toFixed(2),
        aiGrade: (dto.aiGrade ?? 'PENDING_SCAN') as AiGrade,
        photoUrl: dto.photoUrl ?? null,
        timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
        gpsPolygon: dto.gpsPolygon,
        escrowStatus: 'PENDING_DEPOSIT',
        farmerPayoutKes: farmerPayout.toFixed(2),
        platformFeeKes: platformFee.toFixed(2),
      })
      .returning();

    return crop;
  }

  /**
   * Retrieves crops according to Role-Based Access Control:
   * - Farmers only see their own harvests
   * - Buyers see market-ready available crops
   * - Admins see all crops across all counties
   */
  async findAll(user: { id: string; role: UserRole }): Promise<CropAsset[]> {
    if (user.role === 'FARMER') {
      return this.db
        .select()
        .from(cropAssets)
        .where(eq(cropAssets.farmerId, user.id))
        .orderBy(desc(cropAssets.createdAt));
    }

    if (user.role === 'BUYER') {
      // Buyers can view all crops that are listed for trade
      return this.db
        .select()
        .from(cropAssets)
        .orderBy(desc(cropAssets.createdAt));
    }

    // ADMIN sees all crops
    return this.db
      .select()
      .from(cropAssets)
      .orderBy(desc(cropAssets.createdAt));
  }

  /**
   * Retrieves a single crop asset by ID.
   */
  async findById(id: string, user: { id: string; role: UserRole }): Promise<CropAsset> {
    const [crop] = await this.db
      .select()
      .from(cropAssets)
      .where(eq(cropAssets.id, id))
      .limit(1);

    if (!crop) {
      throw new NotFoundException(`Crop asset with ID "${id}" not found`);
    }

    if (user.role === 'FARMER' && crop.farmerId !== user.id) {
      throw new ForbiddenException('Farmers can only view their own crop assets');
    }

    return crop;
  }

  /**
   * Transitions escrow state and logs an immutable transaction audit record.
   */
  async updateEscrowStatus(
    id: string,
    dto: UpdateEscrowStatusDto,
    user: { id: string; role: UserRole },
  ): Promise<CropAsset> {
    const crop = await this.findById(id, user);

    const buyerId = dto.buyerId ?? crop.buyerId ?? (user.role === 'BUYER' ? user.id : null);

    const [updatedCrop] = await this.db
      .update(cropAssets)
      .set({
        escrowStatus: dto.escrowStatus as EscrowStatus,
        buyerId,
        escrowAmountKes: crop.totalPriceKes,
        updatedAt: new Date(),
      })
      .where(eq(cropAssets.id, id))
      .returning();

    // Log to immutable escrow transactions ledger if transitioning to escrow or payout
    if (buyerId && (dto.escrowStatus === 'HELD_IN_ESCROW' || dto.escrowStatus === 'RELEASED_TO_FARMER')) {
      await this.db.insert(escrowTransactions).values({
        cropAssetId: crop.id,
        payerId: buyerId,
        payeeId: crop.farmerId,
        amountKes: crop.totalPriceKes,
        feeKes: crop.platformFeeKes ?? '0.00',
        status: dto.escrowStatus as EscrowStatus,
        metadata: {
          transitionedBy: user.id,
          role: user.role,
        },
      });
    }

    return updatedCrop;
  }

  /**
   * Updates AI diagnostic grading results (used by Plantix / Kindwise AI pipeline).
   */
  async updateAiGrade(id: string, dto: UpdateAiGradeDto): Promise<CropAsset> {
    const [updatedCrop] = await this.db
      .update(cropAssets)
      .set({
        aiGrade: dto.aiGrade as AiGrade,
        aiConfidence: dto.aiConfidence !== undefined ? dto.aiConfidence.toFixed(4) : null,
        aiDiagnosis: dto.aiDiagnosis ?? null,
        updatedAt: new Date(),
      })
      .where(eq(cropAssets.id, id))
      .returning();

    if (!updatedCrop) {
      throw new NotFoundException(`Crop asset with ID "${id}" not found`);
    }

    return updatedCrop;
  }
}
