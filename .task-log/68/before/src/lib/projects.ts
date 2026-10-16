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

/** The published projects in the order of the admin panel (every group; the sections pick their own). */
export async function getProjects(): Promise<ProjectView[]> {
  if (!hasDb) return [];
  const rows = await db.project.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return rows.map(toView);
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | null> {
  if (!hasDb) return null;
  const row = await db.project.findFirst({ where: { slug, published: true } });
  return row ? toView(row) : null;
}

/** The cover of a project: the cover, or else its first picture. */
export const coverOf = (p: Pick<ProjectView, "cover" | "images">) => p.cover || p.images[0] || "";
