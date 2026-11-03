import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "@/actions/types";
import { db, hasDb } from "@/lib/db";

// THE CONTENT VERSION AND THE LOCK (owner, 2026-11-03).
//  - the content of the website has ONE version number: it goes up by one every time something that visitors see is published in the admin panel
//    (a page, the site settings, a blog article, a project, the team). It is kept in table Setting, key "content-lock" (no migration).
//  - the open pages of the website ask only this small number (/api/content-version, every 15 seconds), never the content itself; when it is
//    not the number the page was built with, the page loads the new content once (components/site/content-watch.tsx)
//  - "Lock editor" (a button like Publish, in the top bar of the admin panel) freezes the editor: the content is final, nothing can be published, and
//    the website stops asking even the number every 15 seconds. "Unlock editor" opens the editor again.
const KEY = "content-lock";

export type ContentState = { v: number; locked: boolean; at: string };
const START: ContentState = { v: 1, locked: false, at: "" };

function clean(raw: unknown): ContentState {
  const o = (raw && typeof raw === "object" ? raw : {}) as Partial<ContentState>;
  return { v: Number.isInteger(o.v) && (o.v as number) > 0 ? (o.v as number) : 1, locked: o.locked === true, at: typeof o.at === "string" ? o.at : "" };
}

// the open pages ask often: one copy of the row in memory for a few seconds (every change here replaces it at once)
let copy: { t: number; s: ContentState } | null = null;

export async function getContentState(maxAgeMs = 3000): Promise<ContentState> {
  if (!hasDb) return START;
  if (copy && Date.now() - copy.t < maxAgeMs) return copy.s;
  try {
    const row = await db.setting.findUnique({ where: { key: KEY } });
    const s = row ? clean(row.value) : START;
    copy = { t: Date.now(), s };
    return s;
  } catch {
    return copy?.s ?? START;
  }
}

async function write(s: ContentState) {
  const value = s as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
  copy = { t: Date.now(), s };
}

/** call after something that visitors see was published (never throws: a failed bump must not undo a publish) */
export async function bumpContentVersion() {
  if (!hasDb) return;
  try {
    const s = await getContentState(0);
    await write({ ...s, v: s.v + 1, at: new Date().toISOString() });
  } catch (error) {
    console.error("bumpContentVersion failed", error);
  }
}

export async function setEditorLocked(locked: boolean) {
  const s = await getContentState(0);
  await write({ ...s, locked, at: new Date().toISOString() });
}

/** the first line of every action that changes visitor content: a locked editor gives this answer instead of saving */
export async function editorLocked(): Promise<(ActionResult & { ok: false }) | null> {
  const s = await getContentState(0);
  return s.locked ? { ok: false, error: "The editor is locked. Press Unlock editor at the top of the admin panel, then try again." } : null;
}
