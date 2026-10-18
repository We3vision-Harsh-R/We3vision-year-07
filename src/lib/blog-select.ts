import type { BlogEntry } from "@/lib/blog-shared";

// Which articles a blog section shows, worked out the same way for the laptop and the phone (no server-only imports).
// The articles come from Admin > Blog; the section (Admin > Pages > Blog) only says which ones and how many.

/** about how long an article takes to read (200 words a minute) */
export function readMinutes(blocks: BlogEntry["blocks"]) {
  const words = blocks.reduce((n, b) => n + ("h" in b ? b.h : "p" in b ? b.p : b.ul.join(" ")).split(/\s+/).filter(Boolean).length, 0);
  return Math.max(1, Math.round(words / 200));
}

/** the article addresses written in a field: one per line, or the full link (https://…/blog/<address>) */
export function slugList(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim().replace(/^.*\/blog\//, "").replace(/[/?#].*$/, ""))
    .filter(Boolean);
}

/** the top story: the article with that address, or the newest one */
export function pickFeatured(entries: BlogEntry[], slug: string): BlogEntry | undefined {
  const want = slugList(slug)[0];
  return (want && entries.find((e) => e.slug === want)) || entries[0];
}

/** hand-picked articles in the written order; nothing written = the newest `fallback` */
export function pickList(entries: BlogEntry[], slugs: string, fallback = 4): BlogEntry[] {
  const want = slugList(slugs);
  if (!want.length) return entries.slice(0, fallback);
  return want.flatMap((s) => entries.find((e) => e.slug === s) ?? []);
}

/** the articles of the feed: only one topic (when written) and at most `limit` (when written) */
export function feedOf(entries: BlogEntry[], category: string, limit: string): BlogEntry[] {
  const cat = category.trim().toLowerCase();
  const list = cat ? entries.filter((e) => e.category.trim().toLowerCase() === cat) : entries;
  const n = Math.round(Number(limit));
  return n > 0 ? list.slice(0, n) : list;
}
