// One field definition drives THREE things: the admin form, server-side sanitising, and empty values for "add item".

export type Field =
  | { kind: "text"; key: string; label: string; max?: number; hint?: string }
  | { kind: "textarea"; key: string; label: string; max?: number; hint?: string }
  | { kind: "url"; key: string; label: string; hint?: string }
  | { kind: "image"; key: string; label: string; hint?: string } // a picture: a link, or /media/<id> of a picture uploaded in the admin panel
  | { kind: "group"; key: string; label: string; fields: Field[] }
  | { kind: "list"; key: string; label: string; itemLabel: string; fields: Field[]; max?: number };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Only relative paths, #anchors, http(s), mailto and tel links. Blocks javascript: and friends. */
export function isSafeHref(value: string) {
  return value === "" || /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(value);
}

function clamp(value: unknown, max: number, singleLine: boolean) {
  let s = typeof value === "string" ? value : "";
  if (singleLine) s = s.replace(/[\r\n]+/g, " ");
  return s.trim().slice(0, max);
}

/** Turns untrusted input into well-formed data for `fields` (right types, lengths, safe links, no unknown keys). */
export function normalize(fields: readonly Field[], input: unknown): Record<string, unknown> {
  const src = isRecord(input) ? input : {};
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = src[f.key];
    switch (f.kind) {
      case "text":
        out[f.key] = clamp(v, f.max ?? 200, true);
        break;
      case "textarea":
        out[f.key] = clamp(v, f.max ?? 2000, false);
        break;
      case "image":
      case "url": {
        const s = clamp(v, 500, true);
        out[f.key] = isSafeHref(s) ? s : "";
        break;
      }
      case "group":
        out[f.key] = normalize(f.fields, v);
        break;
      case "list":
        out[f.key] = (Array.isArray(v) ? v : []).slice(0, f.max ?? 12).map((item) => normalize(f.fields, item));
        break;
    }
  }
  return out;
}

/** Blank value for a new list item / new section. */
export function emptyValue(fields: readonly Field[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    out[f.key] = f.kind === "list" ? [] : f.kind === "group" ? emptyValue(f.fields) : "";
  }
  return out;
}
