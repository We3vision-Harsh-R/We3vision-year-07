import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectArticle } from "@/components/site/project-article";
import { PageSections } from "@/components/site/sections";
import { JsonLd } from "@/components/site/json-ld";
import { getSiteSettings } from "@/lib/cms/queries";
import { coverOf, getProjectBySlug } from "@/lib/projects";
import { breadcrumbNode, orgRef, organizationRef, siteBase, websiteId, websiteNode } from "@/lib/seo/schema";
import { SHARE_IMAGE } from "@/lib/share-image";

// One project of the portfolio (added in the admin panel under Projects). Served from cache; saving the project refreshes it.
export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProjectBySlug((await params).slug);
  if (!p) return {};
  const path = `/portfolio/${p.slug}`;
  const description = p.summary || `${p.title}: a project by We3vision.`;
  return {
    title: `${p.title} | Portfolio | We3vision`.length <= 60 ? `${p.title} | Portfolio | We3vision` : `${p.title} | We3vision`,
    description,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, siteName: "We3vision Private Limited", locale: "en_IN", title: p.title, description, images: [coverOf(p) || SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: p.title, description, images: [coverOf(p) || SHARE_IMAGE.url] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProjectBySlug((await params).slug);
  if (!p) notFound();
  const site = await getSiteSettings();
  const cover = coverOf(p);
  const base = siteBase();
  const url = `${base}/portfolio/${p.slug}`;
  const image = cover ? (cover.startsWith("http") ? cover : `${base}${cover}`) : undefined;
  // structured data: the trail, the page and the project (the company is the creator, by @id)
  const ld = [
    organizationRef(site),
    websiteNode(site),
    breadcrumbNode(url, [
      { name: "Home", url: `${base}/` },
      { name: "Portfolio", url: `${base}/portfolio` },
      { name: p.title, url },
    ]),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: p.title,
      inLanguage: "en",
      isPartOf: { "@id": websiteId(base) },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: { "@id": `${url}#project` },
      ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: image } } : {}),
    },
    {
      "@type": "CreativeWork",
      "@id": `${url}#project`,
      name: p.title,
      description: p.summary || undefined,
      url,
      image,
      genre: p.category || undefined,
      inLanguage: "en",
      creator: orgRef(base),
      mainEntityOfPage: { "@id": `${url}#webpage` },
    },
  ];
  return (
    <>
      <JsonLd graph={ld} />
      <ProjectArticle p={p} />
      <PageSections
        sections={[{ id: "contact", type: "contact", data: { chip: "Let's talk", heading: "Want Something\nLike This?", text: "Tell us about your project and the We3vision team will get back to you.", buttonLabel: "Send a message" } }]}
        site={site}
        skin="modern"
        page="portfolio"
      />
    </>
  );
}
