"use server";

import { alertFailure } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { cleanPresence } from "@/lib/presence";
import { savePresenceConfig } from "@/lib/presence-server";
import type { ActionResult } from "./types";

/** Admin > Visitors: saves the live cursor settings; the open pages pick them up within a few seconds */
export async function savePresence(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  try {
    await savePresenceConfig(cleanPresence(input));
    return { ok: true, message: "Saved. The website uses it now." };
  } catch (error) {
    console.error("savePresence failed", error);
    alertFailure("Saving the visitor settings (admin)", error, "warning");
    return { ok: false, error: "Could not save. Please try again." };
  }
}
