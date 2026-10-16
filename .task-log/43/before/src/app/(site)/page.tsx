import type { Metadata } from "next";
import { PageSections } from "@/components/site/sections";
import { getPublishedPage, getSiteSettings } from "@/lib/cms/queries";

// Served from cache. Admin "Publish" refreshes it instantly; the timer is a safety net
// (e.g. if the server restarted or the first build ran without a database).
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getPublishedPage("home"), getSiteSettings()]);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: "/", siteName: site.legalName || site.name, title: page.title, description: page.description },
    twitter: { card: "summary_large_image", title: page.title, description: page.description },
  };
}

export default async function HomePage() {
  const [page, site] = await Promise.all([getPublishedPage("home"), getSiteSettings()]);
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

  // Structured data (helps Google show the company correctly). Built from the admin-managed content.
  const services = page.content.sections.find((s) => s.type === "hero")?.data.cards as { title: string }[] | undefined;
  const lines = site.contactCards.flatMap((c) => c.lines.split("\n").map((l) => l.trim()));
  const email = lines.find((l) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l));
  const phone = lines.find((l) => /^\+?\d[\d\s().-]{6,}$/.test(l));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: site.legalName || site.name,
        alternateName: site.name,
        url: `${base}/`,
        description: page.description,
        sameAs: site.social.map((s) => s.href).filter((href) => href.startsWith("http")),
        address: { "@type": "PostalAddress", addressLocality: "Surat", addressRegion: "Gujarat", addressCountry: "IN" },
        contactPoint: email || phone ? [{ "@type": "ContactPoint", contactType: "sales", ...(phone ? { telephone: phone } : {}), ...(email ? { email } : {}) }] : undefined,
      },
      { "@type": "WebSite", "@id": `${base}/#website`, url: `${base}/`, name: site.legalName || site.name, publisher: { "@id": `${base}/#organization` } },
      ...(services ?? []).map((s) => ({
        "@type": "Service",
        name: s.title.replace(/\s+/g, " ").trim(),
        provider: { "@id": `${base}/#organization` },
        areaServed: "IN",
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageSections sections={page.content.sections} site={site} page="home" />
    </>
  );
}
