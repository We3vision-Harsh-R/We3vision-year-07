import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db, hasDb } from "@/lib/db";
import { DEFAULT_PRESENCE, VISITOR_KEY, cleanPresence, type OtherCursor, type PresenceConfig, type VisitorRow } from "@/lib/presence";

const KEY = "presence";

export async function getPresenceConfig(): Promise<PresenceConfig> {
  if (!hasDb) return DEFAULT_PRESENCE;
  try {
    const row = await db.setting.findUnique({ where: { key: KEY } });
    return row ? cleanPresence(row.value) : DEFAULT_PRESENCE;
  } catch {
    return DEFAULT_PRESENCE;
  }
}

// the open pages ask every fraction of a second: a copy that is a few seconds old keeps the database quiet; a save replaces it at once
let copy: { at: number; cfg: PresenceConfig } | null = null;
export async function getPresenceConfigLive(maxAgeMs = 5000): Promise<PresenceConfig> {
  if (copy && Date.now() - copy.at < maxAgeMs) return copy.cfg;
  const cfg = await getPresenceConfig();
  copy = { at: Date.now(), cfg };
  return cfg;
}

export async function savePresenceConfig(input: unknown) {
  const clean = cleanPresence(input);
  const value = clean as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
  copy = { at: Date.now(), cfg: clean };
}

// ---- who is on the site right now (memory of this server process: it is a live picture, not a record) --------------------------------------
type Live = { id: string; name: string; path: string; x: number; y: number; moved: boolean; joined: number; seen: number };
const g = globalThis as unknown as { __presence?: Map<string, Live> };
const live = (g.__presence ??= new Map<string, Live>());
const GONE_MS = 8000;

function prune(now: number) {
  for (const [id, v] of live) if (now - v.seen > GONE_MS) live.delete(id);
}

export function liveCount(): number {
  prune(Date.now());
  return live.size;
}

/** a visitor's page reports its pointer; the answer is the cursors of the others on the same page: the first to come in first, at most `max` */
export function reportAndList(me: { id: string; name: string; path: string; x: number | null; y: number | null }, max: number): OtherCursor[] {
  const now = Date.now();
  const prev = live.get(me.id);
  const moved = me.x !== null && me.y !== null;
  live.set(me.id, {
    id: me.id,
    name: me.name,
    path: me.path,
    x: moved ? (me.x as number) : (prev?.x ?? 0),
    y: moved ? (me.y as number) : (prev?.y ?? 0),
    moved: moved || !!prev?.moved,
    joined: prev?.joined ?? now,
    seen: now,
  });
  prune(now);
  return [...live.values()]
    .filter((v) => v.id !== me.id && v.path === me.path && v.moved)
    .sort((a, b) => a.joined - b.joined)
    .slice(0, max)
    .map((v) => ({ id: v.id, name: v.name, x: v.x, y: v.y }));
}

// ---- the visitor log ------------------------------------------------------------------------------------------------------------------------
type Stored = Omit<VisitorRow, "id">;

export async function logVisit(id: string, name: string, device: string, path: string, newTab: boolean) {
  if (!hasDb) return;
  try {
    const key = VISITOR_KEY + id;
    const now = new Date().toISOString();
    const row = await db.setting.findUnique({ where: { key } });
    const old = row?.value as Stored | null | undefined;
    const value: Stored = {
      name: name || old?.name || "",
      first: old?.first ?? now,
      last: now,
      visits: (old?.visits ?? 0) + (newTab || !old ? 1 : 0),
      device,
      path,
    };
    const json = value as unknown as Prisma.InputJsonValue;
    await db.setting.upsert({ where: { key }, update: { value: json }, create: { key, value: json } });
  } catch (error) {
    console.error("logVisit failed", error);
  }
}

export async function listVisitors(limit = 300): Promise<VisitorRow[]> {
  if (!hasDb) return [];
  try {
    const rows = await db.setting.findMany({ where: { key: { startsWith: VISITOR_KEY } }, orderBy: { updatedAt: "desc" }, take: limit });
    return rows.map((r) => ({ id: r.key.slice(VISITOR_KEY.length), ...(r.value as Stored) }));
  } catch {
    return [];
  }
}
