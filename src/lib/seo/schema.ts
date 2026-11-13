import type { BlogEntry } from "@/lib/blog-shared";
import type { SiteSettings } from "@/lib/cms/settings";
import { siteBase } from "@/lib/seo-ping";

// SHARED STRUCTURED DATA (schema.org JSON-LD). One place that knows the company, so every page describes We3vision the same way and the pieces
// point at each other by @id (Organization <- WebSite <- WebPage <- Service / Article / FAQPage). Server only (it reads the site address).
// Rules: only facts that are on the website itself (footer contact cards, About page); nothing invented; no ratings, reviews or awards.
// The visible page must say the same as the data (Google's rule), so facts that the admin can edit (phones, e-mail, social links) are read from
// the site settings, and the two office addresses are only added while the footer still shows them.

export const ORG_NAME = "We3vision Private Limited";
export { siteBase };

/** "Founded in Surat, Gujarat" 2019: About page timeline and its SEO title ("Since 2019"). */
const FOUNDING_YEAR = "2019";

/** What the company works on (the service pages of the menu). Used for knowsAbout. */
const KNOWS_ABOUT = [
  "AI development and automation",
  "Web design and development",
  "Mobile app development",
  "Augmented reality (AR) and virtual reality (VR)",
  "Metaverse development",
  "Game development",
  "UI/UX design",
  "Brand and graphic design",
  "3D modeling and animation",
  "CRM and custom software development",
];

type Office = { label: string; street: string; locality: string; region?: string; postalCode: string; country: string; proof: string };
// the two offices of the footer contact cards (lib/cms/settings.ts); `proof` is a text that must still be in the cards for the office to be listed
const OFFICES: Office[] = [
  { label: "Head office, Surat", street: "We3vision House 1/936, Bhim Kachchhi Mohallo, Nanpura", locality: "Surat", region: "Gujarat", postalCode: "395001", country: "IN", proof: "395001" },
  { label: "Office, Marburg", street: "Zum Lahnberg 64", locality: "Marburg", postalCode: "35037", country: "DE", proof: "35037" },
];

export const orgId = (base: string) => `${base}/#organization`;
export const websiteId = (base: string) => `${base}/#website`;
export const orgRef = (base: string) => ({ "@id": orgId(base) });
export const AREA_SERVED = [{ "@type": "Country", name: "India" }, "Worldwide"];
export const logoUrl = (base: string) => `${base}/brand/logo-stacked.png`;

const postal = (o: Office) => ({
  "@type": "PostalAddress",
  streetAddress: o.street,
  addressLocality: o.locality,
  ...(o.region ? { addressRegion: o.region } : {}),
  postalCode: o.postalCode,
  addressCountry: o.country,
});

const isEmail = (l: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l);
const isPhone = (l: string) => /^\+?\d[\d\s().-]{6,}$/.test(l);

/** The company in one sentence (facts of the About and Home pages). */
export const COMPANY_DESCRIPTION =
  "We3vision Private Limited is a software and digital company in Surat, India, founded in 2019. It builds websites, mobile apps, AI solutions, AR/VR and metaverse experiences, games, UI/UX design, brand design, CRM and custom software for businesses in India and worldwide.";

/** The full company entity (home page and contact page). */
export function organizationNode(site: SiteSettings) {
  const base = siteBase();
  const cards = site.contactCards.map((c) => ({ title: c.title, lines: c.lines.split("\n").map((l) => l.trim()).filter(Boolean) }));
  const all = cards.flatMap((c) => c.lines);
  const cardText = all.join("\n");
  const email = all.find(isEmail);
  const phone = all.find(isPhone);
  const germany = cards.find((c) => /germany/i.test(c.title));
  const offices = OFFICES.filter((o) => cardText.includes(o.proof));
  const head = offices.find((o) => o.country === "IN");
  const contactPoints = [
    ...(email || phone ? [{ "@type": "ContactPoint", contactType: "sales", areaServed: "IN", url: `${base}/contact`, ...(phone ? { telephone: phone } : {}), ...(email ? { email } : {}) }] : []),
    ...(germany
      ? [{ "@type": "ContactPoint", contactType: "sales", areaServed: "DE", url: `${base}/contact`, ...(germany.lines.find(isPhone) ? { telephone: germany.lines.find(isPhone) } : {}), ...(germany.lines.find(isEmail) ? { email: germany.lines.find(isEmail) } : {}) }]
      : []),
  ];
  return {
    // ProfessionalService is a LocalBusiness (the head office is a real, verified address); "Organization" is kept so every reader finds the company
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId(base),
    name: site.legalName || ORG_NAME,
    alternateName: site.name,
    url: `${base}/`,
    logo: { "@type": "ImageObject", url: logoUrl(base) },
    image: logoUrl(base),
    description: COMPANY_DESCRIPTION,
    foundingDate: FOUNDING_YEAR,
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),
    address: head ? postal(head) : { "@type": "PostalAddress", addressLocality: "Surat", addressRegion: "Gujarat", addressCountry: "IN" },
    ...(offices.length ? { location: offices.map((o) => ({ "@type": "Place", name: o.label, address: postal(o) })) } : {}),
    areaServed: AREA_SERVED,
    knowsAbout: KNOWS_ABOUT,
    sameAs: site.social.map((s) => s.href).filter((href) => href.startsWith("http")),
    ...(contactPoints.length ? { contactPoint: contactPoints } : {}),
  };
}

/** Small copy of the company (same @id), put in the graph of every other page so the page data stands on its own. */
export function organizationRef(site?: SiteSettings) {
  const base = siteBase();
  return { "@type": "Organization", "@id": orgId(base), name: site?.legalName || ORG_NAME, url: `${base}/`, logo: { "@type": "ImageObject", url: logoUrl(base) } };
}

export function websiteNode(site?: SiteSettings) {
  const base = siteBase();
  return { "@type": "WebSite", "@id": websiteId(base), url: `${base}/`, name: site?.legalName || ORG_NAME, alternateName: site?.name || "We3vision", inLanguage: "en", publisher: orgRef(base) };
}

export type Crumb = { name: string; url: string };
export function breadcrumbNode(pageUrl: string, crumbs: Crumb[]) {
  return { "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb`, itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })) };
}

export function webPageNode(o: { url: string; type?: string; name: string; description?: string; mainEntityId?: string; breadcrumb?: boolean; extra?: Record<string, unknown> }) {
  const base = siteBase();
  return {
    "@type": o.type ?? "WebPage",
    "@id": `${o.url}#webpage`,
    url: o.url,
    name: o.name,
    ...(o.description ? { description: o.description } : {}),
    inLanguage: "en",
    isPartOf: { "@id": websiteId(base) },
    about: orgRef(base),
    ...(o.breadcrumb === false ? {} : { breadcrumb: { "@id": `${o.url}#breadcrumb` } }),
    ...(o.mainEntityId ? { mainEntity: { "@id": o.mainEntityId } } : {}),
    ...(o.extra ?? {}),
  };
}

/** A service of the company. The @id is the same on the home page and on the service page. */
export function serviceNode(o: { path: string; name: string; description?: string; serviceType?: string }) {
  const base = siteBase();
  const url = `${base}${o.path}`;
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: o.name,
    url,
    ...(o.serviceType ? { serviceType: o.serviceType } : {}),
    ...(o.description ? { description: o.description } : {}),
    provider: orgRef(base),
    areaServed: AREA_SERVED,
  };
}

export type FaqItem = { question: string; answer: string };
export const faqNode = (items: FaqItem[], url?: string) => ({
  "@type": "FAQPage",
  ...(url ? { "@id": `${url}#faq` } : {}),
  mainEntity: items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
});

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Article page of the blog (desktop and phone use this one): breadcrumb, article and its questions. */
export function articleGraph(post: BlogEntry, site?: SiteSettings) {
  const base = siteBase();
  const url = `${base}/blog/${post.slug}`;
  const image = post.image ? (post.image.startsWith("http") ? post.image : `${base}${post.image}`) : undefined;
  const text = post.blocks.map((b) => ("h" in b ? b.h : "p" in b ? b.p : b.ul.join(" "))).join(" ");
  return [
    organizationRef(site),
    websiteNode(site),
    breadcrumbNode(url, [
      { name: "Home", url: `${base}/` },
      { name: "Blog", url: `${base}/blog` },
      { name: post.title, url },
    ]),
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      inLanguage: "en",
      ...(image ? { image: [image] } : {}),
      articleSection: post.category || undefined,
      keywords: post.tags.join(", ") || undefined,
      wordCount: words(text),
      author: { "@type": "Organization", "@id": orgId(base), name: site?.legalName || ORG_NAME },
      publisher: orgRef(base),
      isPartOf: { "@id": websiteId(base) },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage`, url },
    },
    ...(post.faq.length ? [faqNode(post.faq, url)] : []),
  ];
}
