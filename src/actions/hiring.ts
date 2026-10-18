"use server";

import { revalidatePath } from "next/cache";
import { alertFailure } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteMeta, editMeta, entry } from "@/lib/hiring";
import { type AppMeta, INTERVIEW_MODES, TEMPLATES, type TimelineEntry, interviewLabel, isStage, stageOf } from "@/lib/hiring-shared";

// Careers > Applications (the hiring desk): every action checks the login, cleans what it gets and writes a line in the timeline of the
// application (who did what, when). The visitor's own answers are never changed here.

export type HireResult = { ok: true; meta?: AppMeta; status?: string; message?: string } | { ok: false; error: string };

const ID = /^[a-z0-9]{10,40}$/i;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (what: string, error: unknown): HireResult => {
  console.error(`${what} failed`, error);
  alertFailure(`${what} (admin)`, error, "warning");
  return { ok: false, error: "Could not save. Please try again." };
};

/** moves an application to another step of the pipeline */
export async function moveApplication(id: string, status: string): Promise<HireResult> {
  const admin = await requireAdmin();
  if (!ID.test(id) || !isStage(status)) return { ok: false, error: "Unknown step." };
  try {
    const before = await db.careerApplication.findUnique({ where: { id }, select: { status: true } });
    if (!before) return { ok: false, error: "This application was removed." };
    if (before.status === status) return { ok: true, status };
    await db.careerApplication.update({ where: { id }, data: { status } });
    const meta = await editMeta(id, (m) => ({ ...m, timeline: [entry(admin.name, "status", `${stageOf(before.status).label} → ${stageOf(status).label}`), ...m.timeline] }));
    revalidatePath("/admin", "layout");
    return { ok: true, meta, status };
  } catch (error) {
    return fail("Moving an application", error);
  }
}

/** rating, star, tags, the admin who looks after it */
export async function updateApplicationMeta(id: string, patch: { rating?: unknown; starred?: unknown; tags?: unknown; assignee?: unknown }): Promise<HireResult> {
  const admin = await requireAdmin();
  if (!ID.test(id)) return { ok: false, error: "Unknown application." };
  try {
    let assigneeName = "";
    if (typeof patch.assignee === "string" && patch.assignee) {
      if (!ID.test(patch.assignee)) return { ok: false, error: "Unknown user." };
      const u = await db.adminUser.findUnique({ where: { id: patch.assignee }, select: { name: true } });
      if (!u) return { ok: false, error: "Unknown user." };
      assigneeName = u.name;
    }
    const meta = await editMeta(id, (m) => {
      const next = { ...m };
      const log: TimelineEntry[] = [];
      if (patch.rating !== undefined) next.rating = Math.min(5, Math.max(0, Math.round(Number(patch.rating) || 0)));
      if (patch.starred !== undefined) next.starred = patch.starred === true;
      if (Array.isArray(patch.tags)) {
        const tags = [...new Set(patch.tags.map((t) => text(t, 30)).filter(Boolean))].slice(0, 12);
        const added = tags.filter((t) => !m.tags.includes(t));
        if (added.length) log.push(entry(admin.name, "tag", `Tag: ${added.join(", ")}`));
        next.tags = tags;
      }
      if (typeof patch.assignee === "string" && patch.assignee !== m.assignee) {
        next.assignee = patch.assignee;
        log.push(entry(admin.name, "assign", patch.assignee ? `Looked after by ${assigneeName}` : "Nobody looks after it now"));
      }
      return { ...next, timeline: [...log, ...m.timeline] };
    });
    return { ok: true, meta };
  } catch (error) {
    return fail("Saving an application", error);
  }
}

/** a note of HR (only seen in the admin panel) */
export async function addApplicationNote(id: string, note: unknown): Promise<HireResult> {
  const admin = await requireAdmin();
  const body = text(note, 2000);
  if (!ID.test(id)) return { ok: false, error: "Unknown application." };
  if (!body) return { ok: false, error: "Write the note first." };
  try {
    const meta = await editMeta(id, (m) => ({ ...m, timeline: [entry(admin.name, "note", body), ...m.timeline] }));
    return { ok: true, meta, message: "Note added." };
  } catch (error) {
    return fail("Adding a note", error);
  }
}

export async function deleteApplicationNote(id: string, entryId: string): Promise<HireResult> {
  await requireAdmin();
  if (!ID.test(id) || typeof entryId !== "string") return { ok: false, error: "Unknown note." };
  try {
    const meta = await editMeta(id, (m) => ({ ...m, timeline: m.timeline.filter((e) => !(e.id === entryId && e.kind === "note")) }));
    return { ok: true, meta };
  } catch (error) {
    return fail("Removing a note", error);
  }
}

/** plans the interview (or removes it with at = ""); a new interview moves the application to "Interview" */
export async function scheduleInterview(id: string, input: { at?: unknown; mode?: unknown; place?: unknown; with?: unknown }): Promise<HireResult> {
  const admin = await requireAdmin();
  if (!ID.test(id)) return { ok: false, error: "Unknown application." };
  const at = typeof input.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input.at) ? input.at : "";
  const mode = INTERVIEW_MODES.find((m) => m === input.mode) ?? INTERVIEW_MODES[0];
  const place = text(input.place, 300);
  const who = text(input.with, 80);
  if (typeof input.at === "string" && input.at && !at) return { ok: false, error: "Choose the day and the time." };
  try {
    const app = await db.careerApplication.findUnique({ where: { id }, select: { status: true } });
    if (!app) return { ok: false, error: "This application was removed." };
    let status = app.status;
    const early = ["new", "contacted", "shortlisted", "hold"].includes(app.status);
    if (at && early) {
      status = "interview";
      await db.careerApplication.update({ where: { id }, data: { status } });
    }
    const meta = await editMeta(id, (m) => ({
      ...m,
      interview: at ? { at, mode, place, with: who } : null,
      timeline: [
        entry(admin.name, "interview", at ? `Interview ${interviewLabel(at)} · ${mode}${place ? ` · ${place}` : ""}${who ? ` · with ${who}` : ""}` : "Interview cancelled"),
        ...(at && early ? [entry(admin.name, "status", `${stageOf(app.status).label} → Interview`)] : []),
        ...m.timeline,
      ],
    }));
    revalidatePath("/admin", "layout");
    return { ok: true, meta, status, message: at ? "Interview saved." : "Interview removed." };
  } catch (error) {
    return fail("Planning an interview", error);
  }
}

/** writes in the timeline that a message was prepared (the message itself is sent from HR's own WhatsApp or e-mail) */
export async function logApplicationMessage(id: string, templateId: string, channel: "WhatsApp" | "E-mail"): Promise<HireResult> {
  const admin = await requireAdmin();
  const t = TEMPLATES.find((x) => x.id === templateId);
  if (!ID.test(id) || (channel !== "WhatsApp" && channel !== "E-mail")) return { ok: false, error: "Unknown message." };
  try {
    const meta = await editMeta(id, (m) => ({ ...m, timeline: [entry(admin.name, "message", `${channel}: ${t ? t.label : "own message"}`), ...m.timeline] }));
    return { ok: true, meta };
  } catch (error) {
    return fail("Saving a message", error);
  }
}

/** the same change for many applications at once: a step, a tag, or remove them */
export async function bulkApplications(ids: unknown, op: { status?: unknown; tag?: unknown; remove?: unknown }): Promise<HireResult & { count?: number }> {
  const admin = await requireAdmin();
  const list = Array.isArray(ids) ? [...new Set(ids.filter((x): x is string => typeof x === "string" && ID.test(x)))].slice(0, 300) : [];
  if (!list.length) return { ok: false, error: "Choose at least one application." };
  try {
    if (op.remove === true) {
      const res = await db.careerApplication.deleteMany({ where: { id: { in: list } } });
      await deleteMeta(list);
      revalidatePath("/admin", "layout");
      return { ok: true, count: res.count, message: `${res.count} removed.` };
    }
    if (isStage(op.status)) {
      const status = op.status;
      const rows = await db.careerApplication.findMany({ where: { id: { in: list } }, select: { id: true, status: true } });
      await db.careerApplication.updateMany({ where: { id: { in: list } }, data: { status } });
      for (const r of rows) if (r.status !== status) await editMeta(r.id, (m) => ({ ...m, timeline: [entry(admin.name, "status", `${stageOf(r.status).label} → ${stageOf(status).label}`), ...m.timeline] }));
      revalidatePath("/admin", "layout");
      return { ok: true, count: rows.length, status, message: `${rows.length} moved to ${stageOf(status).label}.` };
    }
    const tag = text(op.tag, 30);
    if (tag) {
      for (const id of list) await editMeta(id, (m) => (m.tags.includes(tag) ? m : { ...m, tags: [...m.tags, tag], timeline: [entry(admin.name, "tag", `Tag: ${tag}`), ...m.timeline] }));
      return { ok: true, count: list.length, message: `Tag "${tag}" added to ${list.length}.` };
    }
    return { ok: false, error: "Nothing to change." };
  } catch (error) {
    return fail("Changing many applications", error);
  }
}

/** removes one application and what HR kept on it */
export async function removeApplication(id: string): Promise<HireResult> {
  await requireAdmin();
  if (!ID.test(id)) return { ok: false, error: "Unknown application." };
  try {
    await db.careerApplication.delete({ where: { id } });
    await deleteMeta([id]);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Removed." };
  } catch (error) {
    return fail("Removing an application", error);
  }
}
