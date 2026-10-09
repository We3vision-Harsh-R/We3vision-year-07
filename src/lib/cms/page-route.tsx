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

/** The pages that have the redesigned sections. Home, About, Metaverse and Brand Design keep the earlier ones. */
const PAGE_LIST_SLUGS = ["portfolio","blog","contact","careers","headless-cms","custom-wordpress","shopify","custom-woocommerce","shopify-app","wordpress-plugin"];
const MODERN: PageSlug[] = ["ai", "webdev", "mobile", "ui-ux-design", "crm", "animation", "3d-modeling", "graphics", "seo", "team", ...PAGE_LIST_SLUGS] as PageSlug[];
export const skinOf = (slug: string): "classic" | "modern" => ((MODERN as string[]).includes(slug) ? "modern" : "classic");

export async function renderPage(slug: PageSlug) {
  const [page, site] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  return <PageSections sections={page.content.sections} site={site} skin={skinOf(slug)} page={slug} />;
}
