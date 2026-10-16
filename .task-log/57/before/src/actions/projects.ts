"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { isSafeHref } from "@/lib/cms/fields";
import { PROJECT_GROUPS } from "@/lib/project-groups";
import type { ActionResult } from "./types";

// The portfolio projects (Projects in the admin panel). Every action first checks that the admin is logged in, and cleans the input.

export type ProjectInput = {
  title?: unknown;
  category?: unknown;
  summary?: unknown;
  content?: unknown;
  cover?: unknown;
  images?: unknown;
  group?: unknown;
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

function clean(input: ProjectInput) {
  const title = text(input.title, 120);
  if (!title) throw new Error("Please write the name of the project.");
  const images = (Array.isArray(input.images) ? input.images : []).map(link).filter(Boolean).slice(0, 30);
  const group = PROJECT_GROUPS.some((g) => g.value === input.group) ? (input.group as string) : "brand";
  return {
    title,
    category: text(input.category, 60),
    summary: text(input.summary, 200),
    content: text(input.content, 8000, false),
    cover: link(input.cover),
    images: images as unknown as Prisma.InputJsonValue,
    group,
    published: input.published !== false,
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "project";

async function freeSlug(title: string, ignoreId?: string) {
  const base = slugify(title);
  for (let n = 1; n < 200; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const hit = await db.project.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === ignoreId) return slug;
  }
  return `${base}-${Date.now()}`;
}

/** Everything that shows projects must be built again (the pages are kept ready for speed). */
function refresh() {
  revalidatePath("/", "layout");
}

export async function createProject(input: ProjectInput): Promise<ActionResult & { id?: string }> {
  await requireAdmin();
  try {
    const data = clean(input);
    const last = await db.project.aggregate({ where: { group: data.group }, _max: { sortOrder: true } });
    const row = await db.project.create({ data: { ...data, slug: await freeSlug(data.title), sortOrder: (last._max.sortOrder ?? 0) + 1 }, select: { id: true } });
    refresh();
    return { ok: true, message: "Project added.", id: row.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error && error.message.startsWith("Please") ? error.message : "Could not save the project. Please try again." };
  }
}

export async function updateProject(id: string, input: ProjectInput): Promise<ActionResult> {
  await requireAdmin();
  try {
    const data = clean(input);
    const old = await db.project.findUnique({ where: { id }, select: { title: true, slug: true } });
    if (!old) return { ok: false, error: "This project does not exist any more." };
    // the address of the project page only changes when the name changes
    const slug = old.title === data.title ? old.slug : await freeSlug(data.title, id);
    await db.project.update({ where: { id }, data: { ...data, slug } });
    refresh();
    return { ok: true, message: "Saved. The website is updated." };
  } catch (error) {
    return { ok: false, error: error instanceof Error && error.message.startsWith("Please") ? error.message : "Could not save the project. Please try again." };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.project.delete({ where: { id } });
    refresh();
    return { ok: true, message: "Project deleted." };
  } catch {
    return { ok: false, error: "Could not delete the project." };
  }
}

/** Moves a project one place up or down inside its group (the order of the slider and of the Portfolio page). */
export async function moveProject(id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireAdmin();
  try {
    const me = await db.project.findUnique({ where: { id }, select: { group: true } });
    if (!me) return { ok: false, error: "This project does not exist any more." };
    const list = await db.project.findMany({ where: { group: me.group }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true } });
    const i = list.findIndex((p) => p.id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= list.length) return { ok: true, message: "" };
    [list[i], list[j]] = [list[j], list[i]];
    await db.$transaction(list.map((p, n) => db.project.update({ where: { id: p.id }, data: { sortOrder: n + 1 } })));
    refresh();
    return { ok: true, message: "Moved." };
  } catch {
    return { ok: false, error: "Could not move the project." };
  }
}

export async function setProjectPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.project.update({ where: { id }, data: { published } });
    refresh();
    return { ok: true, message: published ? "Shown on the website." : "Hidden from the website." };
  } catch {
    return { ok: false, error: "Could not change the project." };
  }
}
