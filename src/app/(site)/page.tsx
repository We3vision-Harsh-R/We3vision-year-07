import type { Metadata } from "next";
import { HomeMain } from "@/components/site/home/home-main";
import { SERVICES } from "@/components/site/home/home-svc-data";
import { JsonLd } from "@/components/site/json-ld";
import { PAGES } from "@/lib/cms/pages";
import { getPublishedPage, getSiteSettings } from "@/lib/cms/queries";
import { faqNode, organizationNode, serviceNode, siteBase, webPageNode, websiteNode } from "@/lib/seo/schema";
import { homeFaq } from "@/lib/seo/home-faq";
import { SHARE_IMAGE } from "@/lib/share-image";

// Served from cache. Admin "Publish" refreshes it instantly; the timer is a safety net
// (e.g. if the server restarted or the first build ran without a database).
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getPublishedPage("home"), getSiteSettings()]);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: "/", siteName: site.legalName || site.name, locale: "en_IN", title: page.title, description: page.description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [SHARE_IMAGE.url] },
  };
}

export default async function HomePage() {
  const [page, site] = await Promise.all([getPublishedPage("home"), getSiteSettings()]);
  const base = siteBase();

  // Structured data (helps Google and AI assistants describe the company correctly): the company (lib/seo/schema.ts), the website, this page,
  // the seven services of the home page (same @id as on their own pages) and the FAQ that is shown on this page (lib/seo/home-faq.ts).
  const titleOf = (path: string) => Object.values(PAGES).find((p) => p.path === path)?.title;
  const jsonLd = [
    organizationNode(site),
    websiteNode(site),
    webPageNode({ url: `${base}/`, name: page.title, description: page.description, breadcrumb: false, extra: { primaryImageOfPage: { "@type": "ImageObject", url: `${base}${SHARE_IMAGE.url}` } } }),
    ...SERVICES.map((s) => serviceNode({ path: s.href, name: titleOf(s.href) ?? `${s.em} ${s.rest}`.trim() })),
    faqNode(homeFaq(site), `${base}/`),
  ];

  return (
    <>
      <JsonLd graph={jsonLd} />
      <HomeMain />
    </>
  );
}
