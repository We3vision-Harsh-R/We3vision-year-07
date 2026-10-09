import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Img } from "@/components/site/img";
import { PageSections } from "@/components/site/sections";
import { getSiteSettings } from "@/lib/cms/queries";
import { coverOf, getProjectBySlug } from "@/lib/projects";

// One project of the portfolio (added in the admin panel under Projects). Served from cache; saving the project refreshes it.
export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProjectBySlug((await params).slug);
  if (!p) return {};
  const path = `/portfolio/${p.slug}`;
  const description = p.summary || `${p.title}: a project by We3vision.`;
  return {
    title: `${p.title} | Portfolio | We3vision`,
    description,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, siteName: "We3vision Private Limited", title: p.title, description, images: coverOf(p) ? [coverOf(p)] : undefined },
    twitter: { card: "summary_large_image", title: p.title, description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProjectBySlug((await params).slug);
  if (!p) notFound();
  const site = await getSiteSettings();
  const paragraphs = p.content.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  const cover = coverOf(p);
  const gallery = p.images.filter((u) => u !== cover);
  return (
    <>
      <article className="bp">
        <header className="bp-head">
          <Link href="/portfolio" className="bp-back">
            ← All projects
          </Link>
          {p.category && <span className="bp-chip">{p.category}</span>}
          <h1 className="bp-h1">{p.title}</h1>
          {p.summary && <p className="bp-lead">{p.summary}</p>}
          {cover && <Img src={cover} alt={p.title} className="bp-cover" />}
        </header>
        {paragraphs.length > 0 && (
          <div className="bp-body">
            {paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        )}
        {gallery.length > 0 && (
          <div className="bp-gallery">
            {gallery.map((u, i) => (
              <Img key={`${u}-${i}`} src={u} alt={`${p.title}, picture ${i + 1}`} className="bp-pic" />
            ))}
          </div>
        )}
      </article>
      <PageSections
        sections={[{ id: "contact", type: "contact", data: { chip: "Let's talk", heading: "Want Something\nLike This?", text: "Tell us about your project and the We3vision team will get back to you.", buttonLabel: "Send a message" } }]}
        site={site}
        skin="modern"
        page="portfolio"
      />
    </>
  );
}
