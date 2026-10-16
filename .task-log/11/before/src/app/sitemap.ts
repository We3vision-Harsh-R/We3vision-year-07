import type { MetadataRoute } from "next";
import { PAGES } from "@/lib/cms/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return Object.values(PAGES).map((page) => ({ url: `${base}${page.path}` }));
}
