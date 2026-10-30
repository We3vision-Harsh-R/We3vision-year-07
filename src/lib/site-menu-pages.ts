// SERVER ONLY (import it from server components and route files, never from a "use client" file): it reads every page of lib/cms/pages.ts.
import { PAGES } from "@/lib/cms/pages";
import { EXPLORE_LINKS, PRODUCT_LINKS, SERVICE_GROUPS, type MenuLink } from "@/lib/site-menu";

/**
 * Every page of the website that is not in the lists above. The sitemaps show them as "More Pages", so a page that is added to lib/cms/pages.ts
 * appears there at once, without anybody editing this file (projects, articles and jobs from the admin panel are added by the sitemap pages).
 */
export function unlistedPages(): MenuLink[] {
  const listed = new Set<string>(["/", "/sitemap", ...SERVICE_GROUPS.flatMap((g) => g.items), ...PRODUCT_LINKS, ...EXPLORE_LINKS].map((l) => (typeof l === "string" ? l : l.href.split("#")[0] || "/")));
  return Object.values(PAGES)
    .filter((p) => !listed.has(p.path))
    .map((p) => ({ label: p.title, href: p.path }));
}
