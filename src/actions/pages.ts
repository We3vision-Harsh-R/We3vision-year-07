"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { PAGES, isPageSlug, normalizeContent, type PageContent } from "@/lib/cms/pages";
import type { ActionResult } from "./types";

const MAX_VERSIONS = 10;

const toJson = (content: PageContent) => content as unknown as Prisma.InputJsonValue;

type PagePayload = { seoTitle?: unknown; seoDescription?: unknown; content?: unknown };

function parse(slug: string, payload: PagePayload) {
  if (!isPageSlug(slug)) throw new Error("Unknown page");
  return {
    slug,
    seoTitle: typeof payload.seoTitle === "string" ? payload.seoTitle.trim().slice(0, 120) : "",
    seoDescription: typeof payload.seoDescription === "string" ? payload.seoDescription.trim().slice(0, 300) : "",
    content: normalizeContent(payload.content),
  };
}

/** Saves the work-in-progress version. Visitors do NOT see this until it is published. */
export async function saveDraft(slug: string, payload: PagePayload): Promise<ActionResult> {
  await requireAdmin();
  try {
    const { content, seoTitle, seoDescription, ...rest } = parse(slug, payload);
    await db.page.upsert({
      where: { slug: rest.slug },
      create: { slug: rest.slug, title: PAGES[rest.slug].title, seoTitle, seoDescription, draft: toJson(content) },
      update: { seoTitle, seoDescription, draft: toJson(content) },
    });
    return { ok: true, message: "Draft saved. Visitors will not see it until you publish." };
  } catch (error) {
    console.error("saveDraft failed", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

/** Saves and makes the content live. Also keeps a version snapshot so it can be restored. */
export async function publish(slug: string, payload: PagePayload): Promise<ActionResult> {
  await requireAdmin();
  try {
    const { content, seoTitle, seoDescription, ...rest } = parse(slug, payload);
    await db.$transaction(async (tx) => {
      const page = await tx.page.upsert({
        where: { slug: rest.slug },
        create: { slug: rest.slug, title: PAGES[rest.slug].title, seoTitle, seoDescription, draft: toJson(content), published: toJson(content), publishedAt: new Date() },
        update: { seoTitle, seoDescription, draft: toJson(content), published: toJson(content), publishedAt: new Date() },
      });
      await tx.pageVersion.create({ data: { pageId: page.id, content: toJson(content) } });
      const old = await tx.pageVersion.findMany({
        where: { pageId: page.id },
        orderBy: { createdAt: "desc" },
        skip: MAX_VERSIONS,
        select: { id: true },
      });
      if (old.length) await tx.pageVersion.deleteMany({ where: { id: { in: old.map((v) => v.id) } } });
    });
    revalidatePath(PAGES[rest.slug].path);
    return { ok: true, message: "Published. The live website is updated." };
  } catch (error) {
    console.error("publish failed", error);
    return { ok: false, error: "Could not publish. Nothing was changed on the live site." };
  }
}

/** Throws away unpublished changes (draft goes back to what is live). */
export async function discardDraft(slug: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isPageSlug(slug)) return { ok: false, error: "Unknown page" };
  try {
    const page = await db.page.findUnique({ where: { slug }, select: { published: true } });
    if (page) await db.page.update({ where: { slug }, data: { draft: page.published ?? Prisma.DbNull } });
    return { ok: true, message: "Changes discarded." };
  } catch (error) {
    console.error("discardDraft failed", error);
    return { ok: false, error: "Could not discard changes." };
  }
}

/** Form action: loads an old published version into the draft (does NOT publish it). */
export async function restoreVersion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("versionId") ?? "");
  const version = await db.pageVersion.findUnique({ where: { id }, include: { page: { select: { slug: true } } } });
  if (!version) redirect("/admin/pages");
  await db.page.update({ where: { id: version.pageId }, data: { draft: version.content ?? undefined } });
  redirect(`/admin/pages/${version.page.slug}?restored=${Date.now()}`);
}
