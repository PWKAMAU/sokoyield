-- Seed default Superadmin for SokoYield platform
INSERT INTO "users" (
  "id",
  "role",
  "email",
  "phone",
  "password_hash",
  "full_name",
  "county",
  "created_at",
  "updated_at"
)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'ADMIN',
  'pitakamau18@gmail.com',
  '+254119348818',
  '$2b$10$qtHYihT8DWqqBaIeQsLpsemu8o1gBqjqrxO8SyJCLlIIVZdQBcQXS', -- Approx@22
  'Peter Kamau (Superadmin)',
  'Nakuru County',
  NOW(),
  NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "role" = 'ADMIN',
  "password_hash" = EXCLUDED."password_hash",
  "full_name" = EXCLUDED."full_name",
  "updated_at" = NOW();
