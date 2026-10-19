import { PAGES, type PageSlug } from "@/lib/cms/pages";
import { SERVICE_GROUPS } from "@/lib/site-menu";
import { siteBase } from "@/lib/seo-ping";

// Structured data of every inner page (BreadcrumbList + WebPage, and Service for the service pages). It helps Google understand the page and show
// it with a breadcrumb trail. The home page has its own (Organization, WebSite).

const ORG = { "@type": "Organization", name: "We3vision Private Limited", url: "" };

export function PageJsonLd({ slug, title, description }: { slug: PageSlug; title: string; description: string }) {
  const base = siteBase();
  const page = PAGES[slug];
  if (!page || page.path === "/") return null;
  const url = `${base}${page.path}`;
  const group = SERVICE_GROUPS.find((g) => g.items.some((i) => i.href === page.path));
  const isProduct = page.path.startsWith("/products/");
  const crumbs = [
    { name: "Home", url: `${base}/` },
    ...(group ? [{ name: "Services", url: `${base}/#services` }, { name: group.label, url: `${base}/#services` }] : []),
    ...(isProduct ? [{ name: "Products", url: `${base}/products` }] : []),
    { name: page.title, url },
  ];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
    },
    { "@type": slug === "about" ? "AboutPage" : "WebPage", "@id": `${url}#webpage`, url, name: title, description, isPartOf: { "@type": "WebSite", url: base || undefined, name: "We3vision" } },
  ];
  if (group) {
    graph.push({
      "@type": "Service",
      name: page.title,
      serviceType: group.label,
      description,
      url,
      areaServed: "Worldwide",
      provider: { ...ORG, url: base || undefined },
    });
  }
  const json = { "@context": "https://schema.org", "@graph": graph };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />;
}
