"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { isSafeHref } from "@/lib/cms/fields";
import { parseFaq, parseTags, tileOf } from "@/lib/blog-shared";
import type { ActionResult } from "./types";

// The articles of the blog (Blog in the admin panel). Every action first checks that the admin is logged in, and cleans the input.

export type BlogInput = {
  title?: unknown;
  category?: unknown;
  summary?: unknown;
  cover?: unknown;
  tile?: unknown;
  content?: unknown;
  tags?: unknown;
  faq?: unknown;
  date?: unknown;
  position?: unknown;
  published?: unknown;
};

const text = (v: unknown, max: number, line = true) => {
  let s = typeof v === "string" ? v : "";
  if (line) s = s.replace(/[\r\n]+/g, " ");
  return s.trim().slice(0, max);
};
const link = (v: unknown) => {
  const s = text(v, 500);
  return isSafeHref(s) ? s : "";
};

function clean(input: BlogInput) {
  const title = text(input.title, 140);
  if (!title) throw new Error("Please write the title of the article.");
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(input.date ?? "")) ? new Date(`${input.date}T00:00:00.000Z`) : new Date();
  const faq = parseFaq(text(input.faq, 6000, false)).slice(0, 12);
  return {
    title,
    category: text(input.category, 40),
    summary: text(input.summary, 300),
    cover: link(input.cover),
    tile: tileOf(input.tile),
    content: text(input.content, 60000, false),
    tags: parseTags(text(input.tags, 600, false)) as unknown as Prisma.InputJsonValue,
    faq: faq as unknown as Prisma.InputJsonValue,
    publishedAt: Number.isNaN(date.getTime()) ? new Date() : date,
    published: input.published !== false,
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "article";

async function freeSlug(title: string, ignoreId?: string) {
  const base = slugify(title);
  for (let n = 1; n < 200; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const hit = await db.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === ignoreId) return slug;
  }
  return `${base}-${Date.now()}`;
}

/** The Blog page, the articles and the sitemap must be built again (the pages are kept ready for speed). */
function refresh() {
  revalidatePath("/", "layout");
}

/** Puts an article at a place of the list (1 = first) and numbers the whole list again. */
async function place(id: string, position: number) {
  const list = await db.blogPost.findMany({ orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }], select: { id: true } });
  const ids = list.map((p) => p.id).filter((x) => x !== id);
  const at = Math.min(Math.max(Math.round(position) - 1, 0), ids.length);
  ids.splice(at, 0, id);
  await db.$transaction(ids.map((x, n) => db.blogPost.update({ where: { id: x }, data: { sortOrder: n + 1 } })));
}

const asPosition = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 1 ? n : null;
};

const fail = (error: unknown): ActionResult => ({
  ok: false,
  error: error instanceof Error && error.message.startsWith("Please") ? error.message : "Could not save the article. Please try again.",
});

export async function createBlogPost(input: BlogInput): Promise<ActionResult & { id?: string }> {
  await requireAdmin();
  try {
    const data = clean(input);
    const last = await db.blogPost.aggregate({ _max: { sortOrder: true } });
    const row = await db.blogPost.create({ data: { ...data, slug: await freeSlug(data.title), sortOrder: (last._max.sortOrder ?? 0) + 1 }, select: { id: true } });
    const position = asPosition(input.position);
    if (position) await place(row.id, position);
    refresh();
    return { ok: true, message: "Article added.", id: row.id };
  } catch (error) {
    return fail(error);
  }
}

export async function updateBlogPost(id: string, input: BlogInput): Promise<ActionResult> {
  await requireAdmin();
  try {
    const data = clean(input);
    const old = await db.blogPost.findUnique({ where: { id }, select: { title: true, slug: true } });
    if (!old) return { ok: false, error: "This article does not exist any more." };
    // the address of the article only changes when the title changes
    const slug = old.title === data.title ? old.slug : await freeSlug(data.title, id);
    await db.blogPost.update({ where: { id }, data: { ...data, slug } });
    const position = asPosition(input.position);
    if (position) await place(id, position);
    refresh();
    return { ok: true, message: "Saved. The website is updated." };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.blogPost.delete({ where: { id } });
    refresh();
    return { ok: true, message: "Article deleted." };
  } catch {
    return { ok: false, error: "Could not delete the article." };
  }
}

/** Moves an article one place up or down in the list of the Blog page. */
export async function moveBlogPost(id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireAdmin();
  try {
    const list = await db.blogPost.findMany({ orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }], select: { id: true } });
    const i = list.findIndex((p) => p.id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= list.length) return { ok: true, message: "" };
    [list[i], list[j]] = [list[j], list[i]];
    await db.$transaction(list.map((p, n) => db.blogPost.update({ where: { id: p.id }, data: { sortOrder: n + 1 } })));
    refresh();
    return { ok: true, message: "Moved." };
  } catch {
    return { ok: false, error: "Could not move the article." };
  }
}

export async function setBlogPostPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.blogPost.update({ where: { id }, data: { published } });
    refresh();
    return { ok: true, message: published ? "Shown on the website." : "Hidden from the website." };
  } catch {
    return { ok: false, error: "Could not change the article." };
  }
}
