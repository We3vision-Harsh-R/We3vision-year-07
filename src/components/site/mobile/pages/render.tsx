import type { Metadata } from "next";
import { PageJsonLd } from "@/components/site/page-jsonld";
import { getBlogEntries } from "@/lib/blog";
import { getOpenJobs } from "@/lib/careers";
import { PAGES, type PageSlug } from "@/lib/cms/pages";
import { getPublishedPage, getSiteSettings } from "@/lib/cms/queries";
import type { SectionType } from "@/lib/cms/sections";
import { getProjects } from "@/lib/projects";
import { AppScreen, contactFrom } from "../app";
import { APPS } from "../launcher-data";
import { outlineFor, tabsFor } from "./nav";
import { HERO_LIKE, MOBILE_SECTIONS, type AnyMobileSection } from "./sections";
import type { MobileData, MobileSection } from "./types";

// The mobile twin of renderPage() (src/lib/cms/page-route.tsx): the SAME CMS page (getPublishedPage), shown as an app screen. Nothing of the laptop
// components is imported here (only the tiny JSON-LD component), so a phone never receives laptop code.

/** Everything a mobile screen needs for a page: the CMS page, the site settings, the contact details and the data some sections show. */
export async function loadMobilePage(slug: PageSlug) {
  const [page, site] = await Promise.all([getPublishedPage(slug), getSiteSettings()]);
  const sections = page.content.sections;
  const has = (...t: SectionType[]) => sections.some((s) => t.includes(s.type));
  const extra: MobileData = {};
  const [projects, posts, jobs] = await Promise.all([
    has("projects") || sections.some((s) => s.type === "archGallery" && typeof s.data.group === "string" && s.data.group !== "") ? getProjects() : undefined,
    has("blogs") ? getBlogEntries() : undefined,
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
};

/** the launcher icon (glyph + colour) of a page: the page is the app that this icon opens */
const appOf = (slug: PageSlug) => Object.values(APPS).find((a) => a.href === PAGES[slug].path);

export async function renderMobilePage(slug: PageSlug, opts: RenderOptions = {}) {
  const { page, site, sections, extra, contact } = await loadMobilePage(slug);
  const app = appOf(slug);
  const first = sections[0]?.type;
  const hasForm = sections.some((s) => s.type === "contact" || s.type === "careerHelpDesk");
  return (
    <>
      <PageJsonLd slug={slug} title={page.title} description={page.description} />
      <AppScreen
        title={PAGES[slug].title}
        glyph={app?.glyph}
        hue={app?.off}
        titleIsH1={!(first && HERO_LIKE.has(first))}
        contact={contact}
        messageHref={hasForm ? "#contact" : "/contact"}
        nav={{ tabs: tabsFor(sections), outline: outlineFor(sections), currentHref: PAGES[slug].path }}
      >
        {sections.map((s, i) => {
          const Section = (opts.overrides?.[s.type] ?? MOBILE_SECTIONS[s.type]) as unknown as AnyMobileSection;
          return <Section key={s.id} data={s.data as never} site={site} contact={contact} id={s.id} index={i} page={slug} extra={extra} />;
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
