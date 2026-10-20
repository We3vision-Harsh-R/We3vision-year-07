import "server-only";
import { db } from "@/lib/db";
import { CONTENT_TYPE_KEYS } from "../registry";
import { EMPTY_INSTRUCTIONS, INSTRUCTIONS_KEY, cleanInstructions, type StoredInstructions } from "../instructions";

// Reads and writes the owner's instructions (Admin > AI Instructions) in the table Setting. A database problem never stops the AI tools: they then
// simply get the built-in rules.

export async function getStoredInstructions(): Promise<StoredInstructions> {
  try {
    const row = await db.setting.findUnique({ where: { key: INSTRUCTIONS_KEY } });
    return row ? cleanInstructions(row.value, CONTENT_TYPE_KEYS) : EMPTY_INSTRUCTIONS;
  } catch {
    return EMPTY_INSTRUCTIONS;
  }
}

export async function saveStoredInstructions(input: unknown): Promise<StoredInstructions> {
  const value = cleanInstructions(input, CONTENT_TYPE_KEYS);
  await db.setting.upsert({ where: { key: INSTRUCTIONS_KEY }, create: { key: INSTRUCTIONS_KEY, value }, update: { value } });
  return value;
}
