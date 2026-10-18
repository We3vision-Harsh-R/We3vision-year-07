import { Fragment } from "react";
import type { Metadata } from "next";
import { PageJsonLd } from "@/components/site/page-jsonld";
import { getBlogEntries } from "@/lib/blog";
import { getOpenJobs } from "@/lib/careers";
import { PAGES, type PageSlug } from "@/lib/cms/pages";
import { getDraftPage, getPublishedPage, getSiteSettings } from "@/lib/cms/queries";
import type { SectionType } from "@/lib/cms/sections";
import { getProjects } from "@/lib/projects";
import { AppScreen, Collapse, contactFrom } from "../app";
import { APPS, GROUPS } from "../launcher-data";
import { outlineFor, tabsFor } from "./nav";
import { HERO_LIKE, MOBILE_SECTIONS, type AnyMobileSection } from "./sections";
import type { MobileData, MobileSection } from "./types";

// The mobile twin of renderPage() (src/lib/cms/page-route.tsx): the SAME CMS page (getPublishedPage), shown as an app screen. Nothing of the laptop
// components is imported here (only the tiny JSON-LD component), so a phone never receives laptop code.

/** Everything a mobile screen needs for a page: the CMS page, the site settings, the contact details and the data some sections show. */
export async function loadMobilePage(slug: PageSlug, draft = false) {
  const [page, site] = await Promise.all([draft ? draftView(slug) : getPublishedPage(slug), getSiteSettings()]);
  const sections = page.content.sections;
  const has = (...t: SectionType[]) => sections.some((s) => t.includes(s.type));
  const extra: MobileData = {};
  const [projects, posts, jobs] = await Promise.all([
    has("projects") || sections.some((s) => s.type === "archGallery" && typeof s.data.group === "string" && s.data.group !== "") ? getProjects() : undefined,
    has("blogs", "blogFeatured", "blogPicks") ? getBlogEntries() : undefined,
    has("careerOpenings") || sections.some((s) => s.type === "careerDestination" && s.data.jobsHeading) ? getOpenJobs() : undefined,
  ]);
  if (projects) extra.projects = projects;
  if (posts) extra.posts = posts;
  if (jobs) extra.jobs = jobs;
  return { page, site, sections, extra, contact: contactFrom(site) };
}

export type RenderOptions = {
  /** Show one section type differently on THIS page only (e.g. { faq: MyFaq }). Everything else keeps the default screens. */
  overrides?: { [T in SectionType]?: MobileSection<T> };
  /** section types that are always shown whole (no "Show more") on this page */
  keepOpen?: SectionType[];
  /** the unpublished draft instead of the live page (the preview of the admin panel; the route checks the login) */
  draft?: boolean;
};

/** the draft of a page in the shape of getPublishedPage() */
async function draftView(slug: PageSlug) {
  const d = await getDraftPage(slug);
  return { title: d.seoTitle || PAGES[slug].defaultSeo.title, description: d.seoDescription || PAGES[slug].defaultSeo.description, content: d.content };
}

/** the sections that are never collapsed: forms and the first card of a page */
const KEEP_OPEN: ReadonlySet<SectionType> = new Set<SectionType>(["contact", "careerHelpDesk", "pageHero", "wordHero", "aboutHero", "aboutWorld", "vrEntry", "blogFeatured", "ctaBand"]);

/** the launcher icon (glyph + colour) of a page: the page is the app that this icon opens */
const appOf = (slug: PageSlug) => Object.values(APPS).find((a) => a.href === PAGES[slug].path);

export async function renderMobilePage(slug: PageSlug, opts: RenderOptions = {}) {
  const { page, site, sections, extra, contact } = await loadMobilePage(slug, opts.draft);
  const app = appOf(slug);
  const first = sections[0]?.type;
  const hasForm = sections.some((s) => s.type === "contact" || s.type === "careerHelpDesk");
  return (
    <>
      <PageJsonLd slug={slug} title={page.title} description={page.description} />
      <AppScreen
        title={PAGES[slug].title}
        page={slug}
        kicker={app ? GROUPS.find((g) => g.id !== "sug" && g.id !== "new" && g.apps.includes(app.id))?.label : undefined}
        glyph={app?.glyph}
        hue={app?.off}
        titleIsH1={!(first && HERO_LIKE.has(first))}
        contact={contact}
        messageHref={hasForm ? "#contact" : "/contact"}
        nav={{ tabs: tabsFor(sections), outline: outlineFor(sections), currentHref: PAGES[slug].path }}
      >
        {sections.map((s, i) => {
          const Section = (opts.overrides?.[s.type] ?? MOBILE_SECTIONS[s.type]) as unknown as AnyMobileSection;
          const node = <Section data={s.data as never} site={site} contact={contact} id={s.id} index={i} page={slug} extra={extra} />;
          // the first section (the hero) and the forms are shown whole; every other tall section opens with "Show more"
          return i === 0 || KEEP_OPEN.has(s.type) || (opts.keepOpen?.includes(s.type) && s.id !== "related-services") ? <Fragment key={s.id}>{node}</Fragment> : <Collapse key={s.id}>{node}</Collapse>;
        })}
      </AppScreen>
    </>
  );
}

/** The metadata of a mobile page: the same title and description as the laptop page, and the LAPTOP address as the canonical one (one URL for Google; no noindex). */
export async function mobileMetadata(slug: PageSlug): Promise<Metadata> {
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
