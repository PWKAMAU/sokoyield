import { z } from 'zod';

/**
 * Strongly-typed, fail-fast environment validation.
 * The API refuses to boot if required infrastructure settings are missing.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_CORS_ORIGINS: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  KAFKA_BROKERS: z.string().min(1).default('localhost:9092'),
  KAFKA_CLIENT_ID: z.string().min(1).default('sokoyield-api'),
  JWT_SECRET: z.string().min(8).default('sokoyield_super_secret_jwt_key_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Phase 4: AI Quality Grading (Kindwise primary, Plantix adapter)
  KINDWISE_API_KEY: z.string().optional(),
  KINDWISE_API_URL: z.string().url().default('https://crop.kindwise.com/api/v1'),
  PLANTIX_API_KEY: z.string().optional(),
  PLANTIX_API_URL: z.string().url().default('https://api.plantix.net/v2'),

  // Phase 4: Weather & Pest Satellite Alerts (Agrio / Open-Meteo fallback)
  AGRIO_API_KEY: z.string().optional(),
  AGRIO_API_URL: z.string().url().default('https://api.agrio.app/v1'),

  // Phase 4: Twilio Rural Emergency SMS (Authorized test parameter: +254119348818)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  EMERGENCY_ALERT_RECIPIENT: z.string().default('+254119348818'),

  // Storage for uploaded crop photos
  STORAGE_UPLOAD_DIR: z.string().default('./uploads'),

  // Phase 5: Fintech, Stripe Connect (Escrow Holds) & Stripe Billing ($500/mo SaaS)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_SAAS_PRICE_ID: z.string().default('price_buyer_saas_pro_500'),
  STRIPE_CONNECT_PLATFORM_ACCOUNT_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}
