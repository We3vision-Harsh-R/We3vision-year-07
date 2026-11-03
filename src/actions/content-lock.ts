"use server";

import { revalidatePath } from "next/cache";
import { alertFailure } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { setEditorLocked } from "@/lib/content-version";
import type { ActionResult } from "./types";

/** Admin top bar: Lock editor / Unlock editor. Locked = the content is final and the website stops asking for changes. */
export async function setEditorLock(locked: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await setEditorLocked(locked === true);
    revalidatePath("/admin", "layout");
    return { ok: true, message: locked ? "Editor locked. The content is final." : "Editor unlocked. You can edit and publish again." };
  } catch (error) {
    console.error("setEditorLock failed", error);
    alertFailure("Locking the editor (admin)", error, "warning");
    return { ok: false, error: "Could not change the lock. Please try again." };
  }
}
