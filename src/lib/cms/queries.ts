import "server-only";
import { db, hasDb } from "@/lib/db";
import { PAGES, type PageSlug } from "./pages";
import type { PageContent } from "./page-types";
import { SITE_DEFAULTS, normalizeSite, type SiteSettings } from "./settings";

// The text of every page of the website is in the code (src/lib/cms/content/*, shown through src/lib/cms/pages.ts): there is no text editor for it in the
// admin panel any more, so a page never reads its text from the database. Blog articles, projects, jobs, the team, the site settings (menu, footer,
// contact details) and the festival still come from the database and keep their own editors in the admin panel.
// (The Page / PageVersion tables are still in the database schema, unused: nothing was deleted from the database.)

export type PageView = { title: string; description: string; content: PageContent };

export async function getPublishedPage(slug: PageSlug): Promise<PageView> {
  const def = PAGES[slug];
  return { title: def.defaultSeo.title, description: def.defaultSeo.description, content: def.defaultContent };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasDb) return SITE_DEFAULTS;
  const row = await db.setting.findUnique({ where: { key: "site" } });
  return row ? normalizeSite(row.value) : SITE_DEFAULTS;
}

