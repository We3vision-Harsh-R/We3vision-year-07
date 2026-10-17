import { APPS, GROUP, SCREEN_APPS, PRESETS, WIDGETS, FONTS, type FontId } from "./launcher-data";

// What the visitor keeps on the Home and Services screens: which apps, folders and widgets, in which order, and the wallpaper.
// It lives in the browser (localStorage). Nothing here touches the server.

export type Kind = "app" | "folder" | "widget" | "ghost";
/** one thing on a screen. A "ghost" is the empty place that opens while something is being dragged (`of` = the size it keeps free). */
export type Item = { k: Kind; id: string; of?: Exclude<Kind, "ghost">; /** the cell the visitor put it on (free placement); without it the item flows into the first free place */ x?: number; y?: number };
export type Page = { title?: string; items: Item[] };
export type Wall = { kind: "preset"; id: string } | { kind: "photo"; src: string };
/** how the icons look (like iOS: Default, Dark, Clear, Tinted); `hue` = the tint, in degrees away from the theme colour */
export type IconStyle = "default" | "dark" | "clear" | "tint";
export type Icons = { style: IconStyle; hue: number };
export const ICON_STYLES: IconStyle[] = ["default", "dark", "clear", "tint"];
export type Saved = { v: 3; pages: Page[]; wall: Wall; icons: Icons; font: FontId };

/** the size of each kind, in grid cells */
export const SIZE = { app: { w: 1, h: 1 }, folder: { w: 2, h: 2 }, widget: { w: 2, h: 2 } } as const;
const WIDE = new Set(WIDGETS.filter((w) => w.wide).map((w) => w.id));
/** the size of an item in grid cells (a wide widget is a whole row on a phone) */
export const sizeOf = (it: Item): { w: number; h: number } => {
  const k = it.k === "ghost" ? it.of ?? "app" : it.k;
  return k === "widget" && WIDE.has(it.id as never) ? { w: 4, h: 2 } : SIZE[k];
};
export const same = (a: Item, b: Item) => a.k === b.k && a.id === b.id;

export const MAX_PAGES = 4;
const KEY = "we3.launcher.v4";

export function defaultSaved(): Saved {
  return {
    v: 3,
    wall: { kind: "preset", id: "aurora" },
    icons: { style: "default", hue: 0 },
    font: "poppins",
    pages: [
      { items: [{ k: "widget", id: "clock" }, { k: "widget", id: "pitch" }, ...SCREEN_APPS[0].map((id): Item => ({ k: "app", id })), { k: "widget", id: "contact" }, { k: "widget", id: "years" }] },
      { items: [{ k: "widget", id: "message" }, ...SCREEN_APPS[1].map((id): Item => ({ k: "app", id }))] },
      { items: SCREEN_APPS[2].map((id): Item => ({ k: "app", id })) },
    ],
  };
}

const valid = (it: unknown): it is Item => {
  if (typeof it !== "object" || it === null) return false;
  const { k, id } = it as Item;
  if (k === "app") return typeof id === "string" && id in APPS;
  if (k === "folder") return typeof id === "string" && id in GROUP;
  if (k === "widget") return WIDGETS.some((w) => w.id === id);
  return false;
};

export function loadSaved(): Saved {
  const base = defaultSaved();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const s = JSON.parse(raw) as Partial<Saved>;
    if (s.v !== 3 || !Array.isArray(s.pages)) return base;
    const seen = new Set<string>();
    const pages: Page[] = [];
    for (const p of s.pages.slice(0, MAX_PAGES)) {
      const items = (Array.isArray(p?.items) ? p.items : []).filter(valid).filter((it) => {
        const key = `${it.k}:${it.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).map((it): Item => (Number.isInteger(it.x) && Number.isInteger(it.y) && (it.x as number) >= 0 && (it.y as number) >= 0 && (it.x as number) < 12 && (it.y as number) < 40 ? { k: it.k, id: it.id, x: it.x, y: it.y } : { k: it.k, id: it.id }));
      pages.push({ title: typeof p?.title === "string" ? p.title.slice(0, 24) : undefined, items });
    }
    if (!pages.length) return base;
    const w = s.wall;
    const wall: Wall =
      w && w.kind === "photo" && typeof w.src === "string" && w.src.startsWith("data:image/") ? { kind: "photo", src: w.src }
      : w && w.kind === "preset" && PRESETS.some((p) => p.id === w.id) ? { kind: "preset", id: w.id }
      : base.wall;
    const i = s.icons;
    const icons: Icons = i && ICON_STYLES.includes(i.style) && typeof i.hue === "number" ? { style: i.style, hue: Math.max(-180, Math.min(180, Math.round(i.hue))) } : base.icons;
    const font: FontId = FONTS.some((x) => x.id === s.font) ? (s.font as FontId) : "poppins";
    return { v: 3, pages, wall, icons, font };
  } catch {
    return base;
  }
}

/** saves; returns false when the browser refuses (private mode, or a picture that is too big) */
export function persist(s: Saved): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function resetSaved(): Saved {
  try { window.localStorage.removeItem(KEY); } catch { /* nothing to do */ }
  return defaultSaved();
}

// ---------------------------------------------------------------- the grid
export type Slot = { x: number; y: number; w: number; h: number; item: Item };

/**
 * puts the items on a grid of `cols` columns. An item that has its own cell (x, y: the visitor put it there) stands exactly there when the cell is
 * free; every other item goes, in order, into the first free place. Two items never share a cell. The slots come back in the order of `items`.
 */
export function pack(items: Item[], cols: number): Slot[] {
  const used = new Set<number>();
  const at = (x: number, y: number) => y * 16 + x;
  const free = (x: number, y: number, w: number, h: number) => {
    if (x < 0 || y < 0 || x + w > cols) return false;
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) if (used.has(at(x + dx, y + dy))) return false;
    return true;
  };
  const mark = (x: number, y: number, w: number, h: number) => { for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) used.add(at(x + dx, y + dy)); };
  const out: (Slot | undefined)[] = items.map(() => undefined);
  // 1) the items that stand on their own cell
  items.forEach((item, i) => {
    if (item.x === undefined || item.y === undefined) return;
    const { w, h } = sizeOf(item);
    if (!free(item.x, item.y, w, h)) return;
    mark(item.x, item.y, w, h);
    out[i] = { x: item.x, y: item.y, w, h, item };
  });
  // 2) the others flow into the first free place
  items.forEach((item, i) => {
    if (out[i]) return;
    const { w, h } = sizeOf(item);
    for (let y = 0; y < 60; y++) {
      for (let x = 0; x + w <= cols; x++) {
        if (!free(x, y, w, h)) continue;
        mark(x, y, w, h);
        out[i] = { x, y, w, h, item };
        return;
      }
    }
  });
  return out.filter((s): s is Slot => !!s);
}

/** the free cell nearest to (tx, ty) where an item of w x h cells fits on a screen of `rows` rows (null when the screen is full) */
export function freeNear(slots: Slot[], cols: number, rows: number, w: number, h: number, tx: number, ty: number): { x: number; y: number } | null {
  const used = new Set<number>();
  for (const s of slots) for (let dy = 0; dy < s.h; dy++) for (let dx = 0; dx < s.w; dx++) used.add((s.y + dy) * 16 + s.x + dx);
  let best: { x: number; y: number; d: number } | null = null;
  for (let y = 0; y + h <= rows; y++) {
    for (let x = 0; x + w <= cols; x++) {
      let ok = true;
      for (let dy = 0; dy < h && ok; dy++) for (let dx = 0; dx < w && ok; dx++) if (used.has((y + dy) * 16 + x + dx)) ok = false;
      if (!ok) continue;
      const d = (x - tx) ** 2 + (y - ty) ** 2;
      if (!best || d < best.d) best = { x, y, d };
    }
  }
  return best ? { x: best.x, y: best.y } : null;
}

/** gives every item of a screen its own cell, as it stands now (so that moving one item moves no other) */
export const freeze = (items: Item[], cols: number): Item[] => pack(items, cols).map((s) => ({ ...s.item, x: s.x, y: s.y }));
const rowsUsed = (slots: Slot[]) => slots.reduce((m, s) => Math.max(m, s.y + s.h), 0);

/** a screen holds only `rows` rows: what does not fit moves to the front of the next screen (a new one is made when needed) */
export function fit(pages: Page[], cols: number, rows: number): Page[] {
  const out: Page[] = [];
  let carry: Item[] = [];
  for (let i = 0; (i < pages.length || carry.length) && out.length < MAX_PAGES; i++) {
    const src = pages[i];
    const queue = [...carry, ...(src?.items ?? [])];
    carry = [];
    const keep: Item[] = [];
    for (let j = 0; j < queue.length; j++) {
      if (keep.length && rowsUsed(pack([...keep, queue[j]], cols)) > rows) { carry = queue.slice(j).map((it) => ({ k: it.k, id: it.id, ...(it.of ? { of: it.of } : {}) })); break; }
      keep.push(queue[j]);
    }
    out.push({ title: src?.title, items: keep });
  }
  return out;
}

/** removes empty screens (there is always at least one) */
export const prune = (pages: Page[]): Page[] => {
  const out = pages.filter((p) => p.items.length);
  return out.length ? out : [{ items: [] }];
};

export const onHome = (pages: Page[], it: Item) => pages.some((p) => p.items.some((x) => same(x, it)));
export const without = (pages: Page[], it: Item): Page[] => pages.map((p) => ({ ...p, items: p.items.filter((x) => !same(x, it)) }));
/** adds to the end of the first screen that has room */
export function added(pages: Page[], it: Item, cols: number, rows: number): Page[] {
  const next = without(pages, it).map((p) => ({ ...p, items: [...p.items] }));
  const last = next.findIndex((p) => rowsUsed(pack([...p.items, it], cols)) <= rows);
  if (last >= 0) next[last].items.push(it);
  else next.push({ items: [it] });
  return fit(next, cols, rows);
}

