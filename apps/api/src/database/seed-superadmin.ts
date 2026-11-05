import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { users } from './schema.js';

const { Pool } = pg;

export async function seedSuperAdminManual(): Promise<void> {
  const host = process.env.POSTGRES_HOST ?? 'localhost';
  const port = Number(process.env.POSTGRES_PORT ?? 5432);
  const database = process.env.POSTGRES_DB ?? 'sokoyield';
  const user = process.env.POSTGRES_USER ?? 'sokoyield';
  const password = process.env.POSTGRES_PASSWORD ?? 'sokoyield_dev_password';

  console.log(`Connecting to Postgres at ${host}:${port}/${database}...`);
  const pool = new Pool({ host, port, database, user, password });
  const db = drizzle(pool);

  const adminEmail = 'pitakamau18@gmail.com';
  const rawPassword = 'Approx@22';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(users)
        .set({
          role: 'ADMIN',
          passwordHash,
          fullName: 'Peter Kamau (Superadmin)',
          updatedAt: new Date(),
        })
        .where(eq(users.email, adminEmail));
      console.log(`[SUCCESS] Superadmin synced: ${adminEmail} (role: ADMIN, password: ${rawPassword})`);
    } else {
      await db.insert(users).values({
        role: 'ADMIN',
        email: adminEmail,
        phone: '+254119348818',
        passwordHash,
        fullName: 'Peter Kamau (Superadmin)',
        county: 'Nakuru County',
      });
      console.log(`[SUCCESS] Superadmin created: ${adminEmail} (role: ADMIN, password: ${rawPassword})`);
    }
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed-superadmin.ts')) {
  seedSuperAdminManual()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[ERROR] Failed to seed superadmin:', err);
      process.exit(1);
    });
}
