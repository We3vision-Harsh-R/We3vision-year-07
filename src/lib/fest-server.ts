import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db, hasDb } from "@/lib/db";
import { DEFAULT_FEST, type FestConfig, cleanFest } from "@/lib/fest";

// The festival themes are kept in table Setting, key "fest" (no migration). Read by the laptop site layout and by Admin > Fest.
const KEY = "fest";

export async function getFestConfig(): Promise<FestConfig> {
  if (!hasDb) return DEFAULT_FEST;
  try {
    const row = await db.setting.findUnique({ where: { key: KEY } });
    return row ? cleanFest(row.value) : DEFAULT_FEST;
  } catch {
    // the festival is decoration: if the database cannot be read the site simply shows its normal theme
    return DEFAULT_FEST;
  }
}

export async function saveFestConfig(cfg: FestConfig) {
  const value = cleanFest(cfg) as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
}
