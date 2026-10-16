import { defineConfig } from "prisma/config";

// Prisma 7 does not read .env by itself.
try {
  process.loadEnvFile(".env");
} catch {
  // no .env file (e.g. variables come from the hosting panel)
}

// The Prisma CLI (migrate/generate) uses DIRECT_URL (Supabase direct connection).
// The running app uses DATABASE_URL (Supabase pooler) through the pg adapter in src/lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "" },
});
