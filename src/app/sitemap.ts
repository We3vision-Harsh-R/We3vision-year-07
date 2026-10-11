import type { MetadataRoute } from "next";
import { getBlogEntries } from "@/lib/blog";
import { PAGES } from "@/lib/cms/pages";
import { getProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects().catch(() => []);
  const posts = await getBlogEntries().catch(() => []);
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return [
    ...Object.values(PAGES).map((page) => ({ url: `${base}${page.path}` })),
    ...projects.map((p) => ({ url: `${base}/portfolio/${p.slug}` })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.date })),
  ];
}
