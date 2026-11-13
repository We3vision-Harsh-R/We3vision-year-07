import { PAGES, type PageSlug } from "@/lib/cms/pages";
import { SERVICE_GROUPS } from "@/lib/site-menu";
import type { SiteSettings } from "@/lib/cms/settings";
import { breadcrumbNode, organizationNode, organizationRef, serviceNode, siteBase, webPageNode, websiteNode } from "@/lib/seo/schema";
import { JsonLd } from "./json-ld";

// Structured data of every inner page (BreadcrumbList + WebPage, and Service for the service pages). It helps Google understand the page and show
// it with a breadcrumb trail. The home page has its own (Organization, WebSite, Services, FAQ). All pieces share the @id of the company and the
// website (lib/seo/schema.ts), so a page, its service and the company are one connected description.

/** The kind of page: the lists are collections, the contact page is a ContactPage, the rest a plain WebPage. */
const PAGE_TYPE: Partial<Record<string, string>> = {
  about: "AboutPage",
  contact: "ContactPage",
  portfolio: "CollectionPage",
  blog: "CollectionPage",
  products: "CollectionPage",
  careers: "CollectionPage",
};

/** `site`: pass it on the pages that show the contact details, so the full company entity (offices, phone, e-mail) is part of the page data.
 *  `extra`: more nodes of the page (a list of projects ...); `mainEntityId`: the @id of what the page is mainly about. */
export function PageJsonLd({ slug, title, description, extra, site, mainEntityId }: { slug: PageSlug; title: string; description: string; extra?: Record<string, unknown>[]; site?: SiteSettings; mainEntityId?: string }) {
  const base = siteBase();
  const page = PAGES[slug];
  if (!page || page.path === "/") return null;
  const url = `${base}${page.path}`;
  const group = SERVICE_GROUPS.find((g) => g.items.some((i) => i.href === page.path));
  const isProduct = page.path.startsWith("/products/");
  // the crumbs only name real pages (the menu groups are not pages, so they are not in the trail)
  const crumbs = [
    { name: "Home", url: `${base}/` },
    ...(group ? [{ name: "Services", url: `${base}/services` }] : []),
    ...(isProduct ? [{ name: "Products", url: `${base}/products` }] : []),
    { name: page.title, url },
  ];
  const service = group ? serviceNode({ path: page.path, name: page.title, serviceType: group.label, description }) : null;
  return (
    <JsonLd
      graph={[
        site ? organizationNode(site) : organizationRef(),
        websiteNode(),
        breadcrumbNode(url, crumbs),
        webPageNode({ url, type: PAGE_TYPE[slug] ?? "WebPage", name: title, description, mainEntityId: service?.["@id"] ?? mainEntityId }),
        ...(service ? [service] : []),
        ...(extra ?? []),
      ]}
    />
  );
}
