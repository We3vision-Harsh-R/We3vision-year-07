import type { CSSProperties } from "react";
import { ContactDesk } from "@/components/site/contact/contact-desk";
import { getCourses } from "@/lib/training-server";
import { ContactHero } from "@/components/site/contact/contact-hero";
import { HomeShell } from "@/components/site/home/home-chrome";
import { PageJsonLd } from "@/components/site/page-jsonld";
import { getPublishedPage, getSiteSettings } from "@/lib/cms/queries";
import { pageMetadata } from "@/lib/cms/page-route";
import { orgId, siteBase } from "@/lib/seo/schema";
import "@/styles/home.css";

// Contact Us page: the contact cards of Admin > Settings and the contact form. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("contact");

function Line({ t }: { t: string }) {
  if (t.includes("@") && !t.includes(" ")) return <a href={`mailto:${t}`}>{t}</a>;
  if (/^\+?[\d\s]{8,}$/.test(t)) return <a href={`tel:${t.replace(/\s/g, "")}`}>{t}</a>;
  return <span>{t}</span>;
}

export default async function PageContact() {
  const [site, page, courses] = await Promise.all([getSiteSettings(), getPublishedPage("contact"), getCourses().catch(() => [])]);
  return (
    <HomeShell>
      <PageJsonLd slug="contact" title={page.title} description={page.description} site={site} mainEntityId={orgId(siteBase())} />
      <ContactHero site={site} />
      <ContactDesk courses={courses.filter((c) => c.show).map((c) => c.name)} />
      <section className="hb2-ct" aria-label="Our offices">
        <div className="hb2-wrap">
          <div className="hb2-ct-cards ctd-offices">
            {site.contactCards.map((c, i) => (
              <article key={c.title} className="hb2-ct-card" data-r style={{ "--d": `${i * 100}ms` } as CSSProperties}>
                <h2>{c.title}</h2>
                <p>
                  {c.lines.split("\n").map((t) => (
                    <Line key={t} t={t} />
                  ))}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </HomeShell>
  );
}
