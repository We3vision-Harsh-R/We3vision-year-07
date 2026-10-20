"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { alertFailure } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifySearchEngines } from "@/lib/seo-ping";
import { getContentType, validateDraft } from "@/lib/ai-content/registry";
import { PUBLISHERS } from "@/lib/ai-content/server/publish";
import type { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "./types";

// Admin > AI Submissions: what the admin can do with a draft an AI tool sent. Every action first checks that the admin is logged in, checks
// the draft again with the registry (the data is never trusted), and writes an entry in the audit log of the submission.
// Approving uses the SAME save actions as the Blog and Careers forms (see lib/ai-content/server/publish.ts).

const refresh = (id: string) => {
  revalidatePath("/admin/ai-submissions");
  revalidatePath(`/admin/ai-submissions/${id}`);
};

const errorLines = (errors: { field: string; message: string }[]) => errors.map((e) => `${e.field}: ${e.message}`).join(" · ");

/**
 * "publish": Approve & Publish, the item is live at once. "draft": the item is saved hidden in the normal admin list (Blog / Careers), where it can
 * be opened and published later; the submission is then closed.
 */
export async function approveSubmission(id: string, mode: "publish" | "draft"): Promise<ActionResult & { slug?: string }> {
  const admin = await requireAdmin();
  const sub = await db.contentSubmission.findUnique({ where: { id } });
  if (!sub) return { ok: false, error: "This submission does not exist any more." };
  if (sub.status !== "pending_review") return { ok: false, error: "This submission was already handled." };
  const def = getContentType(sub.contentType);
  if (!def) return { ok: false, error: `Unknown content type "${sub.contentType}".` };
  const checked = validateDraft(def, sub.data);
  if (!checked.ok) return { ok: false, error: `The draft has problems. Press Edit and fix them: ${errorLines(checked.errors)}` };

  // hold it: a second click (or a second admin) cannot publish the same draft again
  const held = await db.contentSubmission.updateMany({ where: { id, status: "pending_review" }, data: { status: "publishing" } });
  if (held.count !== 1) return { ok: false, error: "This submission was already handled." };
  try {
    const publish = mode === "publish";
    const result = await PUBLISHERS[def.key as keyof typeof PUBLISHERS](def.toAdminInput(checked.data, publish));
    if (!result.ok) {
      await db.contentSubmission.update({ where: { id }, data: { status: "pending_review" } });
      return { ok: false, error: result.error };
    }
    await db.contentSubmission.update({
      where: { id },
      data: {
        status: publish ? "approved" : "draft",
        entityId: result.id,
        entitySlug: result.slug,
        reviewedBy: admin.email,
        reviewedAt: new Date(),
        rejectReason: "",
        events: { create: { action: publish ? "approved" : "saved_draft", actor: `admin: ${admin.email}`, note: publish ? `Live at ${def.livePath(result.slug)}` : "Saved hidden in the normal list" } },
      },
    });
    if (publish) after(() => notifySearchEngines([def.livePath(result.slug), def.listPath]));
    refresh(id);
    return { ok: true, slug: result.slug, message: publish ? `Approved. It is live now at ${def.livePath(result.slug)}.` : "Saved as a hidden draft in the normal list. Open it there to publish it later." };
  } catch (error) {
    console.error("approveSubmission failed", error);
    alertFailure("Approving an AI submission (admin)", error, "warning");
    await db.contentSubmission.update({ where: { id }, data: { status: "pending_review" } }).catch(() => undefined);
    return { ok: false, error: "Could not publish. Nothing was changed. Please try again." };
  }
}

/** The submission is kept with the reason and is never shown on the website. */
export async function rejectSubmission(id: string, reason: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const why = (typeof reason === "string" ? reason : "").replace(/[\u0000-\u001F]+/g, " ").trim().slice(0, 500);
  if (why.length < 3) return { ok: false, error: "Please write a short reason (the AI tool can read it)." };
  try {
    const done = await db.contentSubmission.updateMany({ where: { id, status: "pending_review" }, data: { status: "rejected", rejectReason: why, reviewedBy: admin.email, reviewedAt: new Date() } });
    if (done.count !== 1) return { ok: false, error: "This submission was already handled." };
    await db.submissionEvent.create({ data: { submissionId: id, action: "rejected", actor: `admin: ${admin.email}`, note: why } });
    refresh(id);
    return { ok: true, message: "Rejected. It is kept with your reason and is never shown on the website." };
  } catch (error) {
    console.error("rejectSubmission failed", error);
    return { ok: false, error: "Could not reject. Please try again." };
  }
}

/** The "Edit" screen: the normal admin form saves into the submission (not into the live list). The draft is checked with the registry first. */
export async function saveSubmissionEdit(id: string, values: Record<string, unknown>): Promise<ActionResult> {
  const admin = await requireAdmin();
  const sub = await db.contentSubmission.findUnique({ where: { id }, select: { contentType: true, status: true } });
  if (!sub) return { ok: false, error: "This submission does not exist any more." };
  if (sub.status !== "pending_review") return { ok: false, error: "Only a submission that is waiting can be edited." };
  const def = getContentType(sub.contentType);
  if (!def) return { ok: false, error: `Unknown content type "${sub.contentType}".` };
  const checked = validateDraft(def, def.fromFormValues(values && typeof values === "object" ? values : {}));
  if (!checked.ok) return { ok: false, error: errorLines(checked.errors) };
  try {
    const done = await db.contentSubmission.updateMany({
      where: { id, status: "pending_review" },
      data: { data: checked.data as Prisma.InputJsonValue, title: String(checked.data[def.titleField] ?? "").slice(0, 200) },
    });
    if (done.count !== 1) return { ok: false, error: "This submission was already handled." };
    await db.submissionEvent.create({ data: { submissionId: id, action: "edited", actor: `admin: ${admin.email}`, note: "Edited in the admin form" } });
    refresh(id);
    return { ok: true, message: "Saved. Go back to the submission to approve it." };
  } catch (error) {
    console.error("saveSubmissionEdit failed", error);
    alertFailure("Editing an AI submission (admin)", error, "warning");
    return { ok: false, error: "Could not save. Please try again." };
  }
}
