import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { ACCESS_SETTING_KEY, cleanGrants, type Grants } from "@/lib/admin-grants";

// Reads and writes the screen rights of the team member (see lib/admin-grants.ts for the shape and the rules).

/** The rights of the team member. A failed read gives nobody any right (it never opens a door by mistake). */
export async function readGrants(): Promise<Grants> {
  try {
    const row = await db.setting.findUnique({ where: { key: ACCESS_SETTING_KEY } });
    return cleanGrants(row?.value);
  } catch (error) {
    console.error("readGrants failed", error);
    return {};
  }
}

export async function saveGrants(grants: Grants): Promise<void> {
  const value = { grants: cleanGrants({ grants }) } as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({ where: { key: ACCESS_SETTING_KEY }, create: { key: ACCESS_SETTING_KEY, value }, update: { value } });
}
