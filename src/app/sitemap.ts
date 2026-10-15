import type { MetadataRoute } from "next";
import { getBlogEntries } from "@/lib/blog";
import { getOpenJobs } from "@/lib/careers";
import { getPageStatuses } from "@/lib/cms/queries";
import { PAGES } from "@/lib/cms/pages";
import { getProjects } from "@/lib/projects";

// The XML sitemap for search engines: every page, project, article and open job, each with its last change date. Google reads it again and again,
// so a new or changed page is found quickly. Pages that are not published (drafts, hidden articles) are not listed.
export const revalidate = 3600;

const KEY_PAGES = new Set(["/", "/about", "/portfolio", "/contact", "/products"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, jobs, status] = await Promise.all([
    getProjects().catch(() => []),
    getBlogEntries().catch(() => []),
    getOpenJobs().catch(() => []),
    getPageStatuses().catch(() => ({}) as Record<string, { publishedAt: Date | null }>),
  ]);
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();
  const pages: MetadataRoute.Sitemap = Object.entries(PAGES).map(([slug, page]) => ({
    url: `${base}${page.path === "/" ? "" : page.path}` || base,
    lastModified: status[slug]?.publishedAt ?? now,
    changeFrequency: page.path === "/blog" || page.path === "/portfolio" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : KEY_PAGES.has(page.path) ? 0.9 : 0.8,
  }));
  return [
    ...pages,
    { url: `${base}/sitemap`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    ...projects.map((p) => ({ url: `${base}/portfolio/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...jobs.map((j) => ({ url: `${base}/careers/${j.slug}`, lastModified: j.postedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
