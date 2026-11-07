// VISITORS AND LIVE CURSORS (owner, 2026-11-02). Shared by the site, the API and Admin > Visitors.
//  - a first-time visitor is asked for a name only (components/site/name-ask.tsx); the name is the label of their cursor
//  - everybody on the laptop site sees the cursors (with names) of the other visitors who are on the same page right now; Admin > Visitors sets
//    the largest number of cursors shown: the visitors who came in first are shown first
//  - the visitor log (who opened the site, when, with which device) is one Setting row per visitor, key "visitor:<id>"

export type PresenceConfig = {
  /** the live cursors of other visitors */
  cursors: boolean;
  /** the largest number of other visitors' cursors one visitor sees (0-50) */
  max: number;
  /** ask a first-time visitor for a name */
  askName: boolean;
};

/** 20 visitors see each other's cursors (owner 2026-11-07); the admin can change it (0-50) */
export const DEFAULT_PRESENCE: PresenceConfig = { cursors: true, max: 20, askName: true };
/** a setting saved before 2026-11-07 has no `v`: its "5" was only the old default, so it moves to the new default */
const OLD_DEFAULT_MAX = 5;
export const MAX_CURSORS = 50;

export function cleanPresence(input: unknown): PresenceConfig {
  const o = (input && typeof input === "object" ? input : {}) as Partial<Record<keyof PresenceConfig, unknown>>;
  const n = Math.round(Number(o.max));
  const legacy = (o as { v?: unknown }).v !== 2 && n === OLD_DEFAULT_MAX;
  return {
    cursors: typeof o.cursors === "boolean" ? o.cursors : DEFAULT_PRESENCE.cursors,
    max: legacy ? DEFAULT_PRESENCE.max : Number.isFinite(n) ? Math.min(MAX_CURSORS, Math.max(0, n)) : DEFAULT_PRESENCE.max,
    askName: typeof o.askName === "boolean" ? o.askName : DEFAULT_PRESENCE.askName,
  };
}

/** what the API sends to every open page about one other visitor */
export type OtherCursor = { id: string; name: string; x: number; y: number };

export type VisitorRow = {
  id: string;
  name: string;
  /** ISO times */
  first: string;
  last: string;
  visits: number;
  device: string;
  path: string;
};

export const VISITOR_KEY = "visitor:";
export const NAME_KEY = "w3v-name";
export const VID_KEY = "w3v-vid";

export function cleanName(v: unknown): string {
  return String(v ?? "")
    .replace(/[\u0000-\u001f<>]/g, "")
    .trim()
    .slice(0, 16);
}

/** "Chrome on Windows" from the user agent; no more than that is kept about a device */
export function deviceOf(ua: string): string {
  const os = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Other";
  const br = /Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\/|CriOS/.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Browser";
  return `${br} on ${os}`;
}
