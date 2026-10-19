import "server-only";
import { db, hasDb } from "@/lib/db";

// The portfolio projects of the admin panel (Projects). Read rules like the pages: without a database nothing is returned (the sections then
// show the photos that are written in their own content); a database error is thrown, so that the last good cached page stays online.

export type ProjectView = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  cover: string;
  images: string[];
  group: string;
};

const asImages = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

type Row = { id: string; slug: string; title: string; category: string; summary: string; content: string; cover: string; images: unknown; group: string };
const toView = (r: Row): ProjectView => ({ id: r.id, slug: r.slug, title: r.title, category: r.category, summary: r.summary, content: r.content, cover: r.cover, images: asImages(r.images), group: r.group });

// A project that still has the text or the name of the template ("A short description of the project: ..." or "Project 28") is not finished: the public
// site (list, project page, sitemap, brand gallery) does not show it until real text is written in Admin > Projects. The admin panel still lists it.
export const isPlaceholderProject = (p: Pick<ProjectView, "title" | "summary">) => /^a short description of the project/i.test(p.summary.trim()) || /^project\s*\d+$/i.test(p.title.trim());

/** The published projects in the order of the admin panel (every group; the sections pick their own). */
export async function getProjects(): Promise<ProjectView[]> {
  if (!hasDb) return [];
  const rows = await db.project.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return rows.map(toView).filter((p) => !isPlaceholderProject(p));
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | null> {
  if (!hasDb) return null;
  const row = await db.project.findFirst({ where: { slug, published: true } });
  const view = row ? toView(row) : null;
  return view && !isPlaceholderProject(view) ? view : null;
}

/** The cover of a project: the cover, or else its first picture. */
export const coverOf = (p: Pick<ProjectView, "cover" | "images">) => p.cover || p.images[0] || "";
