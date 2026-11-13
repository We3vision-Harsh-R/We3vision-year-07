import type { MetadataRoute } from "next";
import { getBlogEntries } from "@/lib/blog";
import { getOpenJobs } from "@/lib/careers";
import { getPageStatuses } from "@/lib/cms/queries";
import { PAGES } from "@/lib/cms/pages";
import { getProjects } from "@/lib/projects";
import { TRAINING_LINKS } from "@/lib/site-menu";

// The XML sitemap for search engines: every public page, project, article and open job. Google reads it again and again, so a new or changed page
// is found quickly. Pages that are not published (drafts, hidden articles) are not listed; /admin, /preview, the phone copies (/m/...) and the
// noindex pages are never listed (one address per page: the canonical one).
// <lastmod> is only written when it is TRUE: the day a page was published in the admin panel, the date of an article, the day a job was posted.
// A made-up "modified today" on every address teaches Google to ignore the dates of this site, so the pages without a known date have none.
export const revalidate = 3600;

const KEY_PAGES = new Set(["/", "/about", "/portfolio", "/contact", "/products"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, jobs, status] = await Promise.all([
    getProjects().catch(() => []),
    getBlogEntries().catch(() => []),
    getOpenJobs().catch(() => []),
    getPageStatuses().catch(() => ({}) as Record<string, { publishedAt: Date | null }>),
  ]);
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1010").replace(/\/$/, "");
  const pages: MetadataRoute.Sitemap = Object.entries(PAGES).map(([slug, page]) => {
    const published = status[slug]?.publishedAt;
    return {
      url: `${base}${page.path === "/" ? "" : page.path}` || base,
      ...(published ? { lastModified: published } : {}),
      changeFrequency: page.path === "/blog" || page.path === "/portfolio" ? ("weekly" as const) : ("monthly" as const),
      priority: page.path === "/" ? 1 : KEY_PAGES.has(page.path) ? 0.9 : 0.8,
    };
  });
  return [
    ...pages,
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.9 },
    ...TRAINING_LINKS.map((t) => ({ url: `${base}${t.href}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/sitemap`, changeFrequency: "weekly", priority: 0.4 },
    ...projects.map((p) => ({ url: `${base}/portfolio/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...jobs.map((j) => ({ url: `${base}/careers/${j.slug}`, lastModified: j.postedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
