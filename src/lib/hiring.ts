import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { type AppMeta, EMPTY_META, type TimelineEntry, cleanMeta } from "@/lib/hiring-shared";

// What HR keeps on an application besides the visitor's own answers (rating, tags, star, who looks after it, the interview, the timeline
// of every step and note). One row per application in the table Setting, key "hire:<application id>", so no new column (no migration)
// is needed. An application without a row simply has nothing yet.

const key = (id: string) => `hire:${id}`;

export async function readAllMeta(): Promise<Map<string, AppMeta>> {
  const rows = await db.setting.findMany({ where: { key: { startsWith: "hire:" } } });
  return new Map(rows.map((r) => [r.key.slice(5), cleanMeta(r.value)]));
}

export async function readMeta(id: string): Promise<AppMeta> {
  const row = await db.setting.findUnique({ where: { key: key(id) } });
  return row ? cleanMeta(row.value) : { ...EMPTY_META, tags: [], timeline: [] };
}

/** reads, changes and writes the facts of one application; returns what was saved */
export async function editMeta(id: string, fn: (m: AppMeta) => AppMeta): Promise<AppMeta> {
  const next = cleanMeta(fn(await readMeta(id)));
  const value = next as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({ where: { key: key(id) }, update: { value }, create: { key: key(id), value } });
  return next;
}

export async function deleteMeta(ids: string[]) {
  if (ids.length) await db.setting.deleteMany({ where: { key: { in: ids.map(key) } } });
}

export function entry(by: string, kind: TimelineEntry["kind"], text: string): TimelineEntry {
  return { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), by, kind, text: text.slice(0, 2000) };
}
