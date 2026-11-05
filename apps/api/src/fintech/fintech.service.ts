import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDb } from '../database/database.module.js';
import {
  cropAssets,
  escrowTransactions,
  userSubscriptions,
  type CropAsset,
} from '../database/schema.js';
import { StripeService } from './stripe.service.js';

@Injectable()
export class FintechService {
  private readonly logger = new Logger(FintechService.name);

  constructor(
    @Inject(DRIZZLE_DB) private readonly db: DrizzleDb,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * Holds buyer funds in platform escrow for a crop asset.
   */
  async depositIntoEscrow(
    cropId: string,
    buyerId: string,
  ): Promise<{ crop: CropAsset; escrowHold: any }> {
    const crop = await this.db.query.cropAssets.findFirst({
      where: eq(cropAssets.id, cropId),
    });

    if (!crop) {
      throw new NotFoundException(`Crop asset ${cropId} not found`);
    }

    if (crop.escrowStatus !== 'PENDING_DEPOSIT') {
      throw new BadRequestException(
        `Crop is not in PENDING_DEPOSIT state (current: ${crop.escrowStatus})`,
      );
    }

    const amountKes = Number(crop.totalPriceKes);
    const holdResult = await this.stripeService.holdInEscrow(
      cropId,
      buyerId,
      amountKes,
    );

    // Update crop state in relational ledger
    const [updatedCrop] = await this.db
      .update(cropAssets)
      .set({
        buyerId,
        escrowStatus: 'HELD_IN_ESCROW',
        escrowAmountKes: amountKes.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(cropAssets.id, cropId))
      .returning();

    // Record immutable double-entry escrow transaction
    await this.db.insert(escrowTransactions).values({
      cropAssetId: crop.id,
      payerId: buyerId,
      payeeId: crop.farmerId,
      amountKes: amountKes.toFixed(2),
      feeKes: holdResult.platformFeeKes.toFixed(2),
      status: 'HELD_IN_ESCROW',
      stripePaymentIntentId: holdResult.paymentIntentId,
      metadata: {
        action: 'DEPOSIT_HELD',
        farmerPayoutKes: holdResult.farmerPayoutKes,
        platformFeeKes: holdResult.platformFeeKes,
      },
    });

    this.logger.log(`Escrow hold created for crop ${cropId}: KES ${amountKes}`);
    return { crop: updatedCrop, escrowHold: holdResult };
  }

  /**
   * Confirms delivery and triggers manual payout (97% Farmer, 3% SokoYield).
   */
  async confirmDeliveryAndPayout(
    cropId: string,
    actor: { id: string; role: string },
  ): Promise<{ crop: CropAsset; payout: any }> {
    const crop = await this.db.query.cropAssets.findFirst({
      where: eq(cropAssets.id, cropId),
    });

    if (!crop) {
      throw new NotFoundException(`Crop asset ${cropId} not found`);
    }

    // Only buyer of the crop or admin can confirm physical delivery
    if (actor.role === 'BUYER' && crop.buyerId !== actor.id) {
      throw new ForbiddenException('Only the purchasing buyer or an admin can confirm delivery');
    }

    const amountKes = Number(crop.totalPriceKes);
    const payoutResult = await this.stripeService.releaseEscrowToFarmer(
      crop.id,
      crop.farmerId, // Farmer's account
      amountKes,
    );

    const [updatedCrop] = await this.db
      .update(cropAssets)
      .set({
        escrowStatus: 'RELEASED_TO_FARMER',
        updatedAt: new Date(),
      })
      .where(eq(cropAssets.id, cropId))
      .returning();

    // Log double-entry settlement in escrow audit ledger
    await this.db.insert(escrowTransactions).values({
      cropAssetId: crop.id,
      payerId: crop.buyerId ?? actor.id,
      payeeId: crop.farmerId,
      amountKes: payoutResult.farmerPayoutKes.toFixed(2),
      feeKes: payoutResult.platformFeeKes.toFixed(2),
      status: 'RELEASED_TO_FARMER',
      stripeTransferId: payoutResult.transferId,
      metadata: {
        action: 'DELIVERY_CONFIRMED_PAYOUT_RELEASED',
        confirmedBy: actor.id,
        role: actor.role,
      },
    });

    this.logger.log(
      `Delivery confirmed for ${cropId}. Released KES ${payoutResult.farmerPayoutKes} to farmer.`,
    );

    return { crop: updatedCrop, payout: payoutResult };
  }

  /**
   * SaaS Subscription Paywall check ($500/month for Buyer Terminal).
   */
  async checkBuyerSubscription(userId: string): Promise<{
    hasActiveSubscription: boolean;
    plan: string;
    monthlyPriceUsd: number;
    currentPeriodEnd?: Date;
  }> {
    const sub = await this.db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, userId),
    });

    if (sub && sub.status === 'ACTIVE') {
      return {
        hasActiveSubscription: true,
        plan: sub.planName,
        monthlyPriceUsd: 500,
        currentPeriodEnd: sub.currentPeriodEnd ?? undefined,
      };
    }

    return {
      hasActiveSubscription: false,
      plan: 'FREE_TIER',
      monthlyPriceUsd: 0,
    };
  }

  /**
   * Activates or simulated-unlocks the $500/month SaaS subscription.
   */
  async activateSubscription(
    userId: string,
    stripeSubscriptionId?: string,
  ): Promise<typeof userSubscriptions.$inferSelect> {
    const existing = await this.db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, userId),
    });

    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (existing) {
      const [updated] = await this.db
        .update(userSubscriptions)
        .set({
          status: 'ACTIVE',
          stripeSubscriptionId: stripeSubscriptionId ?? existing.stripeSubscriptionId ?? `sub_mock_${Date.now()}`,
          currentPeriodEnd: periodEnd,
          updatedAt: new Date(),
        })
        .where(eq(userSubscriptions.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.db
      .insert(userSubscriptions)
      .values({
        userId,
        status: 'ACTIVE',
        stripeSubscriptionId: stripeSubscriptionId ?? `sub_mock_${Date.now()}`,
        planName: 'BUYER_SAAS_PRO_500',
        monthlyAmountUsd: '500.00',
        currentPeriodEnd: periodEnd,
      })
      .returning();

    return created;
  }

  /**
   * Admin Control Room liquidity & escrow monitor.
   */
  async getLiquiditySummary(): Promise<{
    totalEscrowBalanceKes: number;
    activeEscrowHoldsCount: number;
    totalFarmerPayoutsReleasedKes: number;
    totalPlatformFeesCollectedKes: number;
    recentTransactions: typeof escrowTransactions.$inferSelect[];
  }> {
    const allCrops = await this.db.select().from(cropAssets);
    const txs = await this.db
      .select()
      .from(escrowTransactions)
      .orderBy(desc(escrowTransactions.createdAt))
      .limit(20);

    let totalEscrowBalanceKes = 0;
    let activeEscrowHoldsCount = 0;
    let totalFarmerPayoutsReleasedKes = 0;
    let totalPlatformFeesCollectedKes = 0;

    for (const crop of allCrops) {
      if (crop.escrowStatus === 'HELD_IN_ESCROW' || crop.escrowStatus === 'DELIVERED_PENDING_CONFIRMATION') {
        totalEscrowBalanceKes += Number(crop.totalPriceKes);
        activeEscrowHoldsCount++;
      } else if (crop.escrowStatus === 'RELEASED_TO_FARMER') {
        totalFarmerPayoutsReleasedKes += Number(crop.farmerPayoutKes ?? 0);
        totalPlatformFeesCollectedKes += Number(crop.platformFeeKes ?? 0);
      }
    }

    return {
      totalEscrowBalanceKes: Number(totalEscrowBalanceKes.toFixed(2)),
      activeEscrowHoldsCount,
      totalFarmerPayoutsReleasedKes: Number(totalFarmerPayoutsReleasedKes.toFixed(2)),
      totalPlatformFeesCollectedKes: Number(totalPlatformFeesCollectedKes.toFixed(2)),
      recentTransactions: txs,
    };
  }
}
