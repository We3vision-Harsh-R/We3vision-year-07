import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectArticle } from "@/components/site/project-article";
import { PageSections } from "@/components/site/sections";
import { getSiteSettings } from "@/lib/cms/queries";
import { coverOf, getProjectBySlug } from "@/lib/projects";
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
    openGraph: { type: "article", url: path, siteName: "We3vision Private Limited", title: p.title, description, images: [coverOf(p) || SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: p.title, description, images: [coverOf(p) || SHARE_IMAGE.url] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProjectBySlug((await params).slug);
  if (!p) notFound();
  const site = await getSiteSettings();
  const cover = coverOf(p);
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          { "@type": "ListItem", position: 2, name: "Portfolio", item: `${base}/portfolio` },
          { "@type": "ListItem", position: 3, name: p.title, item: `${base}/portfolio/${p.slug}` },
        ],
      },
      {
        "@type": "CreativeWork",
        name: p.title,
        description: p.summary || undefined,
        url: `${base}/portfolio/${p.slug}`,
        image: cover ? (cover.startsWith("http") ? cover : `${base}${cover}`) : undefined,
        genre: p.category || undefined,
        creator: { "@type": "Organization", name: "We3vision Private Limited" },
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
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
