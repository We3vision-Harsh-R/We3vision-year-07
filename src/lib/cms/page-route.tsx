import type { Metadata } from "next";
import { PageSections } from "@/components/site/sections";
import { PAGES, type PageSlug } from "./pages";
import { getPublishedPage, getSiteSettings } from "./queries";

// Shared by the route files of the editable pages, so each route file only says which page it shows.

export async function pageMetadata(slug: PageSlug): Promise<Metadata> {
  const [page, site] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  const path = PAGES[slug].path;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: site.legalName || site.name, title: page.title, description: page.description },
    twitter: { card: "summary_large_image", title: page.title, description: page.description },
  };
}

export async function renderPage(slug: PageSlug) {
  const [page, site] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  return <PageSections sections={page.content.sections} site={site} />;
}
