"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { normalizeSite } from "@/lib/cms/settings";
import type { ActionResult } from "./types";

export async function saveSiteSettings(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  try {
    const value = normalizeSite(input);
    await db.setting.upsert({ where: { key: "site" }, create: { key: "site", value: value as unknown as Prisma.InputJsonValue }, update: { value: value as unknown as Prisma.InputJsonValue } });
    revalidatePath("/", "layout"); // header + footer appear on every page
    return { ok: true, message: "Settings saved. The live website is updated." };
  } catch (error) {
    console.error("saveSiteSettings failed", error);
    return { ok: false, error: "Could not save settings. Please try again." };
  }
}
