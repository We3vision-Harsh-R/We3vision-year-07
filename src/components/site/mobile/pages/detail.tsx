import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogEntry } from "@/lib/blog";
import { getCareerSetup, getOpenJob } from "@/lib/careers";
import { getSiteSettings } from "@/lib/cms/queries";
import type { JobView } from "@/lib/careers-shared";
import { coverOf, getProjectBySlug } from "@/lib/projects";
import { AppScreen, Accordion, Button, Card, LeadForm, Pic, Points, Section, contactFrom } from "../app";
import { JobApplyForm } from "../app/job-apply";
import type { NavTab, OutlineItem } from "../app/nav-types";
import { APPS } from "../launcher-data";

// The mobile twins of the three "one item" pages: an article (/blog/<slug>), a project (/portfolio/<slug>) and a job (/careers/<slug>).
// Same words and pictures as the laptop pages (Admin > Blog, Projects, Careers): a new article, project or job added in the admin panel has its mobile page at once.

const day = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const base = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const ldJson = (o: unknown) => ({ __html: JSON.stringify(o).replace(/</g, "\\u003c") });

function Cta({ heading, intro }: { heading: string; intro: string }) {
  return (
    <Section id="contact" chip="Let's talk" title={heading} intro={intro}>
      <Card>
        <LeadForm />
      </Card>
    </Section>
  );
}

// ------------------------------------------------------------------------------------------------------------------ an article
export async function renderMobileBlogPost(slug: string) {
  const [post, site] = await Promise.all([getBlogEntry(slug), getSiteSettings()]);
  if (!post) notFound();
  const app = APPS.blog;
  const b = base();
  const hasFaq = post.faq.length > 0;
  const tabs: NavTab[] = [
    { id: null, label: "Article", icon: "blog" },
    ...(hasFaq ? [{ id: "faq", label: "FAQ", icon: "faq" as const }] : []),
    { id: "contact", label: "Contact", icon: "contact" },
  ];
  const outline: OutlineItem[] = [...(hasFaq ? [{ id: "faq", label: "Frequently asked questions" }] : []), { id: "contact", label: "Want to build something?" }];
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: post.title, description: post.summary, datePublished: post.date, image: post.image ? (post.image.startsWith("http") ? post.image : `${b}${post.image}`) : undefined, keywords: post.tags.join(", "), author: { "@type": "Organization", name: "We3vision Private Limited" }, publisher: { "@type": "Organization", name: "We3vision Private Limited" }, mainEntityOfPage: `${b}/blog/${post.slug}` },
      { "@type": "FAQPage", mainEntity: post.faq.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })) },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(json)} />
      <AppScreen title={post.title} subtitle={`${post.category} · ${post.dateLabel}`} glyph={app?.glyph} hue={app?.off} contact={contactFrom(site)} messageHref="#contact" nav={{ tabs, outline, currentHref: "/blog" }}>
        <article className="ma-sec">
          {post.summary && <p className="ma-lead">{post.summary}</p>}
          {post.image && <Pic src={post.image} alt={post.title} ratio="3 / 2" />}
          <div className="ma-prose ma-article">
            {post.blocks.map((blk, i) => ("h" in blk ? <h2 key={i} className="ma-h2">{blk.h}</h2> : "p" in blk ? <p key={i}>{blk.p}</p> : <Points key={i} items={blk.ul} />))}
          </div>
          {post.tags.length > 0 && (
            <ul className="ma-tags" aria-label="Topics">
              {post.tags.map((t) => (
                <li key={t}>#{t}</li>
              ))}
            </ul>
          )}
        </article>
        {hasFaq && (
          <Section id="faq" chip="FAQ" title="Frequently asked questions">
            <Accordion items={post.faq.map((q) => ({ title: q.question, body: <p>{q.answer}</p> }))} />
          </Section>
        )}
        <Cta heading={"Want To Build\nSomething?"} intro="Tell us about your project and the We3vision team will get back to you." />
        <div className="ma-actions">
          <Button href="/blog" variant="tinted" block>
            All articles
          </Button>
        </div>
      </AppScreen>
    </>
  );
}

export async function mobileBlogMetadata(slug: string): Promise<Metadata> {
  const post = await getBlogEntry(slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: `${post.title} | We3vision`,
    description: post.summary,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, siteName: "We3vision Private Limited", title: post.title, description: post.summary, publishedTime: post.date, images: post.image ? [post.image] : undefined },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
  };
}

// ------------------------------------------------------------------------------------------------------------------ a project
export async function renderMobileProject(slug: string) {
  const [p, site] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!p) notFound();
  const app = APPS.portfolio;
  const b = base();
  const text = p.content.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  const cover = coverOf(p);
  const gallery = p.images.filter((u) => u !== cover);
  const tabs: NavTab[] = [
    { id: null, label: "Project", icon: "work" },
    ...(gallery.length ? [{ id: "gallery", label: "Gallery", icon: "services" as const }] : []),
    { id: "contact", label: "Contact", icon: "contact" },
  ];
  const outline: OutlineItem[] = [...(gallery.length ? [{ id: "gallery", label: "Pictures" }] : []), { id: "contact", label: "Want something like this?" }];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${b}/` }, { "@type": "ListItem", position: 2, name: "Portfolio", item: `${b}/portfolio` }, { "@type": "ListItem", position: 3, name: p.title, item: `${b}/portfolio/${p.slug}` }] },
      { "@type": "CreativeWork", name: p.title, description: p.summary || undefined, url: `${b}/portfolio/${p.slug}`, image: cover ? (cover.startsWith("http") ? cover : `${b}${cover}`) : undefined, genre: p.category || undefined, creator: { "@type": "Organization", name: "We3vision Private Limited" } },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <AppScreen title={p.title} subtitle={p.category || undefined} glyph={app?.glyph} hue={app?.off} contact={contactFrom(site)} messageHref="#contact" nav={{ tabs, outline, currentHref: "/portfolio" }}>
        <article className="ma-sec">
          {p.summary && <p className="ma-lead">{p.summary}</p>}
          {cover && <Pic src={cover} alt={p.title} ratio="3 / 2" />}
          {text.length > 0 && (
            <div className="ma-prose ma-article">
              {text.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          )}
        </article>
        {gallery.length > 0 && (
          <Section id="gallery" chip="Gallery" title="More Pictures">
            <div className="ma-stack">
              {gallery.map((u, i) => (
                <Pic key={`${u}-${i}`} src={u} alt={`${p.title}, picture ${i + 1}`} ratio="3 / 2" />
              ))}
            </div>
          </Section>
        )}
        <Cta heading={"Want Something\nLike This?"} intro="Tell us about your project and the We3vision team will get back to you." />
        <div className="ma-actions">
          <Button href="/portfolio" variant="tinted" block>
            All projects
          </Button>
        </div>
      </AppScreen>
    </>
  );
}

export async function mobileProjectMetadata(slug: string): Promise<Metadata> {
  const p = await getProjectBySlug(slug);
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

// ------------------------------------------------------------------------------------------------------------------ a job
const EMPLOYMENT: Record<string, string> = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Internship: "INTERN", Contract: "CONTRACTOR" };

export async function renderMobileJob(slug: string) {
  const [job, site] = await Promise.all([getOpenJob(slug), getSiteSettings()]);
  if (!job) notFound();
  const { questions } = await getCareerSetup();
  const app = APPS.careers;
  const facts = [job.workType, job.workMode, job.location, job.experience, job.openings > 1 ? `${job.openings} openings` : "1 opening"].filter(Boolean);
  const intro = job.description.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  const blocks: { id: string; title: string; items: string[] }[] = [
    { id: "do", title: "What you will do", items: job.responsibilities },
    { id: "look", title: "What we look for", items: job.requirements },
    { id: "get", title: "What you get", items: job.perks },
  ].filter((x) => x.items.length > 0);
  const tabs: NavTab[] = [
    { id: null, label: "Role", icon: "work" },
    ...(blocks.length ? [{ id: blocks[0].id, label: "Details", icon: "process" as const }] : []),
    { id: "apply", label: "Apply", icon: "contact" },
  ];
  const outline: OutlineItem[] = [...blocks.map((x) => ({ id: x.id, label: x.title })), { id: "apply", label: "Apply for this position" }];
  const ld = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.description, ...job.responsibilities, ...job.requirements].filter(Boolean).join("\n\n"),
    datePosted: job.postedAt.slice(0, 10),
    ...(job.closesAt ? { validThrough: job.closesAt } : {}),
    employmentType: EMPLOYMENT[job.workType] ?? "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "We3vision Private Limited" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <AppScreen title={job.title} subtitle={job.team ? `Position · ${job.team}` : "Position"} glyph={app?.glyph} hue={app?.off} contact={contactFrom(site)} messageHref="#apply" nav={{ tabs, outline, currentHref: "/careers" }}>
        <section className="ma-sec">
          {job.summary && <p className="ma-lead">{job.summary}</p>}
          <ul className="ma-tags" aria-label="Facts">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="ma-meta">
            {job.postedLabel}
            {job.closesAt ? ` · Last day to apply: ${day(job.closesAt)}` : ""}
          </p>
          <div className="ma-actions">
            <Button href="#apply" block>
              Apply for this position
            </Button>
          </div>
          {intro.length > 0 && (
            <div className="ma-prose ma-article">
              {intro.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          )}
        </section>
        {blocks.map((x) => (
          <Section key={x.id} id={x.id} title={x.title}>
            <Card>
              <Points items={x.items} />
            </Card>
          </Section>
        ))}
        <Section id="apply" chip="Apply" title="Apply For This Position" intro="Everything in one go. We use your details only to talk to you about this job.">
          <JobApplyForm roleId={job.id} roleTitle={job.title} questions={questions} />
        </Section>
        <div className="ma-actions">
          <Button href="/careers" variant="tinted" block>
            All open positions
          </Button>
        </div>
      </AppScreen>
    </>
  );
}

export async function mobileJobMetadata(slug: string): Promise<Metadata> {
  const job: JobView | null = await getOpenJob(slug);
  if (!job) return { title: "Position not found | We3vision", robots: { index: false } };
  const path = `/careers/${job.slug}`;
  const raw = job.summary || `${job.title} at We3vision in ${job.location}. Read about the role and apply.`;
  const description = raw.length >= 70 ? raw : `${raw} Join We3vision Private Limited and apply online.`;
  return {
    title: `${job.title}: Job in ${job.location} | We3vision`,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: "We3vision Private Limited", title: `${job.title} at We3vision`, description },
    twitter: { card: "summary", title: `${job.title} at We3vision`, description },
  };
}
