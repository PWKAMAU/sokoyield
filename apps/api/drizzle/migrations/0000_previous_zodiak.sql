CREATE TYPE "public"."ai_grade" AS ENUM('PENDING_SCAN', 'GRADE_A', 'GRADE_B', 'GRADE_C', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."escrow_status" AS ENUM('PENDING_DEPOSIT', 'HELD_IN_ESCROW', 'DELIVERED_PENDING_CONFIRMATION', 'RELEASED_TO_FARMER', 'DISPUTED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('FARMER', 'BUYER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "crop_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farmer_id" uuid NOT NULL,
	"crop_name" varchar(100) NOT NULL,
	"quantity_kg" numeric(10, 2) NOT NULL,
	"unit_price_kes" numeric(10, 2) NOT NULL,
	"total_price_kes" numeric(12, 2) NOT NULL,
	"ai_grade" "ai_grade" DEFAULT 'PENDING_SCAN' NOT NULL,
	"ai_confidence" numeric(5, 4),
	"ai_diagnosis" jsonb,
	"photo_url" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"gps_polygon" jsonb NOT NULL,
	"escrow_status" "escrow_status" DEFAULT 'PENDING_DEPOSIT' NOT NULL,
	"buyer_id" uuid,
	"escrow_amount_kes" numeric(12, 2),
	"farmer_payout_kes" numeric(12, 2),
	"platform_fee_kes" numeric(12, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escrow_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crop_asset_id" uuid NOT NULL,
	"payer_id" uuid NOT NULL,
	"payee_id" uuid NOT NULL,
	"amount_kes" numeric(12, 2) NOT NULL,
	"fee_kes" numeric(12, 2) NOT NULL,
	"status" "escrow_status" NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"stripe_transfer_id" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "user_role" DEFAULT 'FARMER' NOT NULL,
	"phone" varchar(32),
	"email" varchar(255),
	"password_hash" text NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"county" varchar(100) DEFAULT 'Nakuru County',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "crop_assets" ADD CONSTRAINT "crop_assets_farmer_id_users_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crop_assets" ADD CONSTRAINT "crop_assets_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_crop_asset_id_crop_assets_id_fk" FOREIGN KEY ("crop_asset_id") REFERENCES "public"."crop_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_payer_id_users_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_payee_id_users_id_fk" FOREIGN KEY ("payee_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;