import "server-only";
import { db } from "@/lib/db";

// A read of a Careers job must never take a page down because the live database is one small step behind the code: the column "training" of
// CareerRole (the "Industry training available" tag) was added to the code before its migration (prisma/migrations/20261127000000_career_training)
// was applied. When a read fails for that reason, the same column is added once (additive, IF NOT EXISTS: nothing is changed or removed) and the
// read is tried again. If it still fails, the original error is thrown as before (the alert shows it).
const TRAINING = /training|does not exist|Unknown field|column/i;

export async function healedCareerRead<T>(read: () => Promise<T>): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (!TRAINING.test(error instanceof Error ? error.message : String(error))) throw error;
    try {
      await db.$executeRawUnsafe('ALTER TABLE "CareerRole" ADD COLUMN IF NOT EXISTS "training" BOOLEAN NOT NULL DEFAULT false');
    } catch {
      throw error;
    }
    return read();
  }
}

/** one more try for a read that failed for a moment (a dropped connection): the page keeps working instead of showing an error */
export async function retryOnce<T>(read: () => Promise<T>): Promise<T> {
  try {
    return await read();
  } catch {
    await new Promise((r) => setTimeout(r, 300));
    return read();
  }
}
