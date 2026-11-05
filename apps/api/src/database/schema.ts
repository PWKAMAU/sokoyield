import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Role-Based Access Control (RBAC) separating Farmers, Buyers, and Admins.
 */
export const userRoleEnum = pgEnum('user_role', ['FARMER', 'BUYER', 'ADMIN']);

/**
 * AI Quality Grading levels from Plantix / Kindwise agronomy models.
 */
export const aiGradeEnum = pgEnum('ai_grade', [
  'PENDING_SCAN',
  'GRADE_A',
  'GRADE_B',
  'GRADE_C',
  'REJECTED',
]);

/**
 * Escrow States for agricultural transactions (Escrow Wallet -> Delivery -> Payout).
 */
export const escrowStatusEnum = pgEnum('escrow_status', [
  'PENDING_DEPOSIT',
  'HELD_IN_ESCROW',
  'DELIVERED_PENDING_CONFIRMATION',
  'RELEASED_TO_FARMER',
  'DISPUTED',
  'REFUNDED',
]);

/**
 * Core User table supporting Farmers (phone-first), Buyers, and Admins (email-first).
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  role: userRoleEnum('role').notNull().default('FARMER'),
  phone: varchar('phone', { length: 32 }).unique(),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  county: varchar('county', { length: 100 }).default('Nakuru County'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * GeoJSON Polygon schema structure for the farm boundary.
 */
export interface GpsPolygon {
  type: 'Polygon';
  coordinates: [number, number][][]; // Array of LinearRing coordinate arrays [lng, lat]
  properties?: Record<string, unknown>;
}

/**
 * Crop Asset Relational Ledger.
 * Every harvested crop records Farmer ID, AI_Grade, Timestamp, GPS_Polygon, and Escrow_Status.
 */
export const cropAssets = pgTable('crop_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  farmerId: uuid('farmer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  cropName: varchar('crop_name', { length: 100 }).notNull(),
  quantityKg: numeric('quantity_kg', { precision: 10, scale: 2 }).notNull(),
  unitPriceKes: numeric('unit_price_kes', { precision: 10, scale: 2 }).notNull(),
  totalPriceKes: numeric('total_price_kes', { precision: 12, scale: 2 }).notNull(),
  
  // Dual-mode AI verification fields
  aiGrade: aiGradeEnum('ai_grade').notNull().default('PENDING_SCAN'),
  aiConfidence: numeric('ai_confidence', { precision: 5, scale: 4 }),
  aiDiagnosis: jsonb('ai_diagnosis').$type<{
    diseaseDetected?: boolean;
    diseaseName?: string;
    pathologyNotes?: string;
    qualityCertUrl?: string;
  }>(),
  photoUrl: text('photo_url'),
  
  // Mandatory harvest/scan timestamp & GeoJSON farm plot polygon
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  gpsPolygon: jsonb('gps_polygon').$type<GpsPolygon>().notNull(),
  
  // Escrow & Settlement state
  escrowStatus: escrowStatusEnum('escrow_status').notNull().default('PENDING_DEPOSIT'),
  buyerId: uuid('buyer_id').references(() => users.id, { onDelete: 'set null' }),
  escrowAmountKes: numeric('escrow_amount_kes', { precision: 12, scale: 2 }),
  farmerPayoutKes: numeric('farmer_payout_kes', { precision: 12, scale: 2 }), // 97% of total
  platformFeeKes: numeric('platform_fee_kes', { precision: 12, scale: 2 }),   // 3% of total
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Escrow Transactions Ledger - Immutable audit record for payouts and disputes.
 */
export const escrowTransactions = pgTable('escrow_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  cropAssetId: uuid('crop_asset_id')
    .notNull()
    .references(() => cropAssets.id, { onDelete: 'cascade' }),
  payerId: uuid('payer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  payeeId: uuid('payee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  amountKes: numeric('amount_kes', { precision: 12, scale: 2 }).notNull(),
  feeKes: numeric('fee_kes', { precision: 12, scale: 2 }).notNull(),
  status: escrowStatusEnum('status').notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeTransferId: varchar('stripe_transfer_id', { length: 255 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  farmedCrops: many(cropAssets, { relationName: 'farmerCrops' }),
  purchasedCrops: many(cropAssets, { relationName: 'buyerCrops' }),
}));

export const cropAssetsRelations = relations(cropAssets, ({ one, many }) => ({
  farmer: one(users, {
    fields: [cropAssets.farmerId],
    references: [users.id],
    relationName: 'farmerCrops',
  }),
  buyer: one(users, {
    fields: [cropAssets.buyerId],
    references: [users.id],
    relationName: 'buyerCrops',
  }),
  escrowTransactions: many(escrowTransactions),
}));

export const escrowTransactionsRelations = relations(escrowTransactions, ({ one }) => ({
  cropAsset: one(cropAssets, {
    fields: [escrowTransactions.cropAssetId],
    references: [cropAssets.id],
  }),
  payer: one(users, {
    fields: [escrowTransactions.payerId],
    references: [users.id],
  }),
  payee: one(users, {
    fields: [escrowTransactions.payeeId],
    references: [users.id],
  }),
}));

/**
 * TimescaleDB Time-Series Ticker table for live commodity price fluctuations.
 * Stores hyper-frequency pricing, percentage shifts, volumes, and market hubs (e.g. Nakuru Central Market).
 */
export const commodityPrices = pgTable('commodity_prices', {
  id: uuid('id').defaultRandom().primaryKey(),
  time: timestamp('time', { withTimezone: true }).defaultNow().notNull(),
  commodity: varchar('commodity', { length: 50 }).notNull(), // Maize, Potatoes, Beans
  priceKes: numeric('price_kes', { precision: 10, scale: 2 }).notNull(),
  changePct: numeric('change_pct', { precision: 5, scale: 2 }).notNull(),
  volumeBags: integer('volume_bags').notNull().default(0),
  marketLocation: varchar('market_location', { length: 100 }).notNull().default('Nakuru Central Market'),
});

/**
 * Stripe Billing subscriptions for Buyer SaaS Terminal ($500/month paywall).
 */
export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('INACTIVE'), // ACTIVE, INACTIVE, TRIALING
  planName: varchar('plan_name', { length: 100 }).notNull().default('BUYER_SAAS_PRO_500'),
  monthlyAmountUsd: numeric('monthly_amount_usd', { precision: 10, scale: 2 }).notNull().default('500.00'),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CropAsset = typeof cropAssets.$inferSelect;
export type NewCropAsset = typeof cropAssets.$inferInsert;
export type EscrowTransaction = typeof escrowTransactions.$inferSelect;
export type NewEscrowTransaction = typeof escrowTransactions.$inferInsert;
export type CommodityPrice = typeof commodityPrices.$inferSelect;
export type NewCommodityPrice = typeof commodityPrices.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type AiGrade = (typeof aiGradeEnum.enumValues)[number];
export type EscrowStatus = (typeof escrowStatusEnum.enumValues)[number];
