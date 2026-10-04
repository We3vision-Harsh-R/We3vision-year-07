import "server-only";
import { db, hasDb } from "@/lib/db";
import { PAGES, normalizeContent, type PageContent, type PageSlug } from "./pages";
import { SITE_DEFAULTS, normalizeSite, type SiteSettings } from "./settings";

// Read rules (important for production safety):
//  * No DATABASE_URL (local/CI build)  -> built-in demo content.
//  * Row not found                      -> built-in demo content (nothing published yet).
//  * Database error                     -> THROW. Next.js then keeps serving the last good cached page instead of
//    replacing real content with demo content during a temporary outage.

export type PageView = { title: string; description: string; content: PageContent };

export async function getPublishedPage(slug: PageSlug): Promise<PageView> {
  const def = PAGES[slug];
  const fallback: PageView = { title: def.defaultSeo.title, description: def.defaultSeo.description, content: def.defaultContent };
  if (!hasDb) return fallback;
  const row = await db.page.findUnique({ where: { slug }, select: { seoTitle: true, seoDescription: true, published: true } });
  if (!row?.published) return fallback;
  return {
    title: row.seoTitle || fallback.title,
    description: row.seoDescription || fallback.description,
    content: normalizeContent(row.published),
  };
}

/** What the editor shows: draft if there is one, otherwise published, otherwise the demo content. */
export async function getDraftPage(slug: PageSlug) {
  const defaultContent: PageContent = PAGES[slug].defaultContent;
  const empty = {
    seoTitle: "",
    seoDescription: "",
    content: defaultContent,
    hasDraftChanges: false,
    publishedAt: null as Date | null,
    isPublished: false,
    versions: [] as { id: string; createdAt: Date }[],
  };
  if (!hasDb) return empty;
  const row = await db.page.findUnique({
    where: { slug },
    include: { versions: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, createdAt: true } } },
  });
  if (!row) return empty;
  const published = row.published ? normalizeContent(row.published) : null;
  const draft = row.draft ? normalizeContent(row.draft) : null;
  return {
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    content: draft ?? published ?? defaultContent,
    hasDraftChanges: draft !== null && JSON.stringify(draft) !== JSON.stringify(published ?? defaultContent),
    publishedAt: row.publishedAt,
    isPublished: published !== null,
    versions: row.versions,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasDb) return SITE_DEFAULTS;
  const row = await db.setting.findUnique({ where: { key: "site" } });
  return row ? normalizeSite(row.value) : SITE_DEFAULTS;
}

export type PageStatus = "demo" | "published" | "changes";

/** Status of every page for the admin lists: still demo content / live / live with unpublished edits. */
export async function getPageStatuses(): Promise<Record<string, { status: PageStatus; publishedAt: Date | null }>> {
  const out: Record<string, { status: PageStatus; publishedAt: Date | null }> = {};
  for (const slug of Object.keys(PAGES)) out[slug] = { status: "demo", publishedAt: null };
  if (!hasDb) return out;
  const rows = await db.page.findMany({ select: { slug: true, draft: true, published: true, publishedAt: true } });
  for (const row of rows) {
    if (!out[row.slug] || !row.published) continue;
    const changed = row.draft !== null && JSON.stringify(normalizeContent(row.draft)) !== JSON.stringify(normalizeContent(row.published));
    out[row.slug] = { status: changed ? "changes" : "published", publishedAt: row.publishedAt };
  }
  return out;
}
