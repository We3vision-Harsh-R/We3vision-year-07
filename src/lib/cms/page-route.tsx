import type { Metadata } from "next";
import { PageSections } from "@/components/site/sections";
import { TechPage, isTechPage } from "@/components/site/tech";
import { PageJsonLd } from "@/components/site/page-jsonld";
import { PAGES, type PageSlug } from "./pages";
import { getPublishedPage, getSiteSettings } from "./queries";
import { SHARE_IMAGE } from "@/lib/share-image";

// Shared by the route files of the editable pages, so each route file only says which page it shows.

export async function pageMetadata(slug: PageSlug): Promise<Metadata> {
  const [page, site] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  const path = PAGES[slug].path;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: site.legalName || site.name, title: page.title, description: page.description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [SHARE_IMAGE.url] },
  };
}

/** The pages that have the redesigned sections. Home, About, Metaverse and Brand Design keep the earlier ones. */
const PAGE_LIST_SLUGS = ["portfolio","blog","contact","careers","headless-cms","custom-wordpress","shopify","custom-woocommerce","shopify-app","wordpress-plugin","shopify-plugin","software","brand-development","brand-kit","brand-video","zero-to-n","meta-marketing","physical-marketing","products","webugmate","wejobs","wethink","wepresent"];
const MODERN: PageSlug[] = ["ai", "webdev", "mobile", "ui-ux-design", "crm", "animation", "3d-modeling", "graphics", "seo", "team", ...PAGE_LIST_SLUGS] as PageSlug[];
export const skinOf = (slug: string): "classic" | "modern" => ((MODERN as string[]).includes(slug) ? "modern" : "classic");

export async function renderPage(slug: PageSlug) {
  const [page, site] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  const jsonLd = <PageJsonLd slug={slug} title={page.title} description={page.description} />;
  if (isTechPage(slug)) return <>{jsonLd}<TechPage slug={slug} sections={page.content.sections} site={site} /></>;
  return <>{jsonLd}<PageSections sections={page.content.sections} site={site} skin={skinOf(slug)} page={slug} /></>;
}
