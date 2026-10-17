import type { Metadata } from "next";
import { getBlogEntries } from "@/lib/blog";
import { getOpenJobs } from "@/lib/careers";
import { getSiteSettings } from "@/lib/cms/queries";
import { getProjects } from "@/lib/projects";
import { EXPLORE_LINKS, PRODUCT_LINKS, SERVICE_GROUPS, unlistedPages } from "@/lib/site-menu";
import { AppScreen, Card, GroupedList, ListRow, Section, contactFrom } from "../app";
import { APPS } from "../launcher-data";

// The mobile twin of the Sitemap page (src/app/(site)/sitemap/page.tsx): the same groups of links, as grouped lists.
export const mobileSitemapMetadata: Metadata = {
  title: "Sitemap | All Pages of We3vision",
  description: "Every page of the We3vision website in one place: services, products, portfolio, blog, careers and company pages.",
  alternates: { canonical: "/sitemap" },
  openGraph: { type: "website", url: "/sitemap", title: "Sitemap | All Pages of We3vision", description: "Every page of the We3vision website in one place." },
};

export async function renderMobileSitemap() {
  const [site, projects, posts, jobs] = await Promise.all([getSiteSettings(), getProjects().catch(() => []), getBlogEntries().catch(() => []), getOpenJobs().catch(() => [])]);
  const groups = [
    ...SERVICE_GROUPS.map((g) => ({ title: g.label, items: g.items })),
    { title: "Our Products", items: PRODUCT_LINKS },
    { title: "Explore", items: EXPLORE_LINKS },
    ...(unlistedPages().length ? [{ title: "More Pages", items: unlistedPages() }] : []),
    ...(projects.length ? [{ title: "Portfolio", items: projects.map((p) => ({ label: p.title, href: "/portfolio/" + p.slug })) }] : []),
    ...(posts.length ? [{ title: "Blog", items: posts.map((p) => ({ label: p.title, href: "/blog/" + p.slug })) }] : []),
    ...(jobs.length ? [{ title: "Open Positions", items: jobs.map((j) => ({ label: j.title, href: "/careers/" + j.slug })) }] : []),
  ];
  const app = APPS.about;
  return (
    <AppScreen title="Sitemap" glyph={app?.glyph} hue={app?.off} contact={contactFrom(site)} messageHref="/contact" nav={{ tabs: [{ id: null, label: "Sitemap", icon: "overview" }], outline: [], currentHref: "/sitemap" }}>
      <Section chip="Sitemap" title={"Every Page Of\nWe3vision"} intro="Find a service, a product or any other page quickly.">
        <div className="ma-stack">
          {groups.map((g) => (
            <GroupedList key={g.title} header={g.title}>
              {g.items.map((l) => (
                <ListRow key={g.title + l.href + l.label} title={l.label} href={l.href} />
              ))}
            </GroupedList>
          ))}
        </div>
        <div className="ma-gap">
          <Card>
            <p>Search engines can use the XML sitemap at /sitemap.xml.</p>
          </Card>
        </div>
      </Section>
    </AppScreen>
  );
}
