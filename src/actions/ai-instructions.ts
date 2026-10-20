"use server";

import { revalidatePath } from "next/cache";
import { alertFailure, alertLater } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TYPES } from "@/lib/ai-content/registry";
import { INSTRUCTION_LIMITS, type StoredInstructions } from "@/lib/ai-content/instructions";
import { saveStoredInstructions } from "@/lib/ai-content/server/instructions-store";
import type { ActionResult } from "./types";

// Admin > AI Instructions: what the AI tools are told. Every action first checks that the admin is logged in; the text is cleaned and cut to its
// limits again on the server (see lib/ai-content/instructions.ts).

export type InstructionsForm = {
  general?: unknown;
  /** per content type key: the extra rules (text) and the "ask first" list (one item on every line) */
  types?: Record<string, { extra?: unknown; askFirst?: unknown } | undefined>;
};

export async function saveAiInstructions(input: InstructionsForm): Promise<ActionResult> {
  const admin = await requireAdmin();
  const general = typeof input?.general === "string" ? input.general : "";
  if (general.length > INSTRUCTION_LIMITS.general) return { ok: false, error: `The general instructions are too long (${general.length}, at most ${INSTRUCTION_LIMITS.general} characters).` };

  const stored: StoredInstructions = { general, types: {} };
  for (const def of CONTENT_TYPES) {
    const t = input?.types?.[def.key];
    if (!t) continue;
    const extra = typeof t.extra === "string" ? t.extra : "";
    if (extra.length > INSTRUCTION_LIMITS.extra) return { ok: false, error: `The extra instructions for "${def.label}" are too long (${extra.length}, at most ${INSTRUCTION_LIMITS.extra} characters).` };
    const lines = (typeof t.askFirst === "string" ? t.askFirst : "").split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length > INSTRUCTION_LIMITS.askFirstItems) return { ok: false, error: `"${def.label}": at most ${INSTRUCTION_LIMITS.askFirstItems} points in the list of information to ask for.` };
    if (lines.some((l) => l.length > INSTRUCTION_LIMITS.askFirstEach)) return { ok: false, error: `"${def.label}": a point of the list is longer than ${INSTRUCTION_LIMITS.askFirstEach} characters.` };
    // the same list as the built-in one is not stored: the built-in list then keeps following the code
    const sameAsDefault = lines.length === def.askFirst.length && lines.every((l, i) => l === def.askFirst[i]);
    stored.types[def.key] = { extra, ...(sameAsDefault ? {} : { askFirst: lines }) };
  }
  try {
    await saveStoredInstructions(stored);
    alertLater({ level: "info", kind: "ai", title: "AI instructions changed", detail: `By ${admin.email}` });
    revalidatePath("/admin/ai-instructions");
    return { ok: true, message: "Saved. AI tools get these instructions from their next request." };
  } catch (error) {
    console.error("saveAiInstructions failed", error);
    alertFailure("Saving the AI instructions (admin)", error, "warning");
    return { ok: false, error: "Could not save. Please try again." };
  }
}
