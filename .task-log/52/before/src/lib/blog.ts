import "server-only";
import { db, hasDb } from "@/lib/db";
import { POSTS } from "@/lib/blog-posts";
import { dateLabel, tileOf, type BlogEntry, type FaqItem, parseContent } from "@/lib/blog-shared";

// The articles of the blog (Blog in the admin panel). Without a database (fresh checkout, build) the built-in articles of src/lib/blog-posts.ts are
// shown; with a database the admin panel decides. A database error is thrown, so the last good cached page stays online.

const BUILT_IN_TILE: Record<string, BlogEntry["tile"]> = {
  "what-is-uiux-design-and-why-does-it-matter-for-businesses": "portrait",
  "how-ai-can-automate-business-processes": "landscape",
};

const builtIn = (): BlogEntry[] =>
  POSTS.map((p, i) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    category: p.category,
    summary: p.summary,
    image: p.image,
    tile: BUILT_IN_TILE[p.slug] ?? "portrait",
    date: p.date,
    dateLabel: p.dateLabel,
    tags: p.tags,
    blocks: p.blocks,
    faq: p.faq,
    sortOrder: i + 1,
    published: true,
  }));

const asStrings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const asFaq = (v: unknown): FaqItem[] =>
  Array.isArray(v)
    ? v.flatMap((x) => {
        const o = x as { question?: unknown; answer?: unknown };
        return typeof o?.question === "string" && typeof o?.answer === "string" ? [{ question: o.question, answer: o.answer }] : [];
      })
    : [];

type Row = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  cover: string;
  tile: string;
  content: string;
  tags: unknown;
  faq: unknown;
  publishedAt: Date;
  sortOrder: number;
  published: boolean;
};
export const rowToEntry = (r: Row): BlogEntry => {
  const date = r.publishedAt.toISOString().slice(0, 10);
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    summary: r.summary,
    image: r.cover,
    tile: tileOf(r.tile),
    date,
    dateLabel: dateLabel(date),
    tags: asStrings(r.tags),
    blocks: parseContent(r.content),
    faq: asFaq(r.faq),
    sortOrder: r.sortOrder,
    published: r.published,
  };
};

/** The published articles in the order of the Blog page (position first, then the newest). */
export async function getBlogEntries(): Promise<BlogEntry[]> {
  if (!hasDb) return builtIn();
  const rows = await db.blogPost.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }] });
  return rows.map(rowToEntry);
}

export async function getBlogEntry(slug: string): Promise<BlogEntry | null> {
  if (!hasDb) return builtIn().find((p) => p.slug === slug) ?? null;
  const row = await db.blogPost.findFirst({ where: { slug, published: true } });
  return row ? rowToEntry(row) : null;
}
