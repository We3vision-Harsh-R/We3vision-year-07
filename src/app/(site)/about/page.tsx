import type { Metadata } from "next";
import { PageSections } from "@/components/site/sections";
import { getPublishedPage, getSiteSettings } from "@/lib/cms/queries";

// Served from cache. Admin "Publish" refreshes it instantly; the timer is a safety net.
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getPublishedPage("about"), getSiteSettings()]);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/about" },
    openGraph: { type: "website", url: "/about", siteName: site.legalName || site.name, title: page.title, description: page.description },
    twitter: { card: "summary_large_image", title: page.title, description: page.description },
  };
}

export default async function AboutPage() {
  const [page, site] = await Promise.all([getPublishedPage("about"), getSiteSettings()]);
  return <PageSections sections={page.content.sections} site={site} />;
}
