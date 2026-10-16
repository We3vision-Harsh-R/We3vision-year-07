import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/** False when DATABASE_URL is missing (fresh checkout, CI build): the site then renders its built-in demo content. */
export const hasDb = Boolean(process.env.DATABASE_URL);

const globalForDb = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // Small pool: Hostinger + Supabase pooler have limited connections.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5 });
  return new PrismaClient({ adapter });
}

export const db = globalForDb.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForDb.prisma = db;
