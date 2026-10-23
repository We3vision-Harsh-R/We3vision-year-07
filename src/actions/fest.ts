"use server";

import { revalidatePath } from "next/cache";
import { alertFailure } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { cleanFest } from "@/lib/fest";
import { saveFestConfig } from "@/lib/fest-server";
import type { ActionResult } from "./types";

/** Admin > Fest: saves the festival themes; every page of the laptop website shows the change at once */
export async function saveFest(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  try {
    await saveFestConfig(cleanFest(input));
    revalidatePath("/", "layout");
    return { ok: true, message: "Saved. The website shows the festival theme now." };
  } catch (error) {
    console.error("saveFest failed", error);
    alertFailure("Saving the festival themes (admin)", error, "warning");
    return { ok: false, error: "Could not save. Please try again." };
  }
}
