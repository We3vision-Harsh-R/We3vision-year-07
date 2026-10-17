import type { Metadata } from "next";
import { getBlogEntries } from "@/lib/blog";
import { getOpenJobs } from "@/lib/careers";
import { getProjects } from "@/lib/projects";
import { EXPLORE_LINKS, PRODUCT_LINKS, SERVICE_GROUPS, unlistedPages, type MenuLink } from "@/lib/site-menu";
import { SmartLink } from "@/components/site/smart-link";

// The sitemap of the website for people (the XML one for search engines is /sitemap.xml). It lists every service, product and page, and the
// projects, articles and jobs that are published at the moment.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Sitemap | All Pages of We3vision",
  description: "Every page of the We3vision website in one place: services, products, portfolio, blog, careers and company pages.",
  alternates: { canonical: "/sitemap" },
  openGraph: { type: "website", url: "/sitemap", title: "Sitemap | All Pages of We3vision", description: "Every page of the We3vision website in one place." },
};

type Group = { title: string; items: MenuLink[] };

export default async function SitemapPage() {
  const [projects, posts, jobs] = await Promise.all([getProjects().catch(() => []), getBlogEntries().catch(() => []), getOpenJobs().catch(() => [])]);
  const groups: Group[] = [
    ...SERVICE_GROUPS.map((g) => ({ title: g.label, items: g.items })),
    { title: "Our Products", items: PRODUCT_LINKS },
    { title: "Explore", items: EXPLORE_LINKS },
    ...(unlistedPages().length ? [{ title: "More Pages", items: unlistedPages() }] : []),
    ...(projects.length ? [{ title: "Portfolio", items: projects.map((p) => ({ label: p.title, href: `/portfolio/${p.slug}` })) }] : []),
    ...(posts.length ? [{ title: "Blog", items: posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}` })) }] : []),
    ...(jobs.length ? [{ title: "Open Positions", items: jobs.map((j) => ({ label: j.title, href: `/careers/${j.slug}` })) }] : []),
  ];
  return (
    <section className="smp">
      <header className="smp-head">
        <p className="smp-chip">Sitemap</p>
        <h1>Every Page Of<br />We3vision</h1>
        <p>Find a service, a product or any other page quickly. Search engines can use the <a href="/sitemap.xml">XML sitemap</a>.</p>
      </header>
      <div className="smp-grid">
        {groups.map((g, i) => (
          <nav key={g.title} className="smp-group" aria-label={g.title}>
            <h2><i>{String(i + 1).padStart(2, "0")}</i>{g.title}<span>{g.items.length}</span></h2>
            <ul>
              {g.items.map((l) => (
                <li key={g.title + l.href + l.label}><SmartLink href={l.href}>{l.label}</SmartLink></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </section>
  );
}
