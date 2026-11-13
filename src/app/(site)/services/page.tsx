import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { HomeCta, HomePageHero, HomeShell } from "@/components/site/home/home-chrome";
import { Art, SERVICES } from "@/components/site/home/home-svc-data";
import { JsonLd } from "@/components/site/json-ld";
import { SmartLink } from "@/components/site/smart-link";
import { breadcrumbNode, organizationRef, serviceNode, siteBase, webPageNode, websiteNode } from "@/lib/seo/schema";
import { SHARE_IMAGE } from "@/lib/share-image";
import "@/styles/home.css";

// The Services page: the seven main services of We3vision, each with its animated picture, what we build and who it is for.
export const revalidate = 3600;

const TITLE = "Our Services | Web, AI, Apps, Metaverse, Brand & CRM | We3vision";
const DESCRIPTION = "We3vision builds websites, AI solutions, mobile apps, metaverse experiences, brands, custom software and CRM for businesses everywhere, from Surat, India.";
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: { type: "website", url: "/services", locale: "en_IN", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE.url] },
};

export default function ServicesPage() {
  // structured data: the page, its trail, and the list of the seven services (same @id as on the home page and on each service page)
  const base = siteBase();
  const url = `${base}/services`;
  const list = {
    "@type": "ItemList",
    "@id": `${url}#services`,
    name: "Services of We3vision",
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: serviceNode({ path: s.href, name: `${s.em} ${s.rest}`.trim() }) })),
  };
  return (
    <HomeShell>
      <JsonLd
        graph={[
          organizationRef(),
          websiteNode(),
          breadcrumbNode(url, [{ name: "Home", url: `${base}/` }, { name: "Services", url }]),
          webPageNode({ url, type: "CollectionPage", name: TITLE, description: DESCRIPTION, mainEntityId: list["@id"] }),
          list,
        ]}
      />
      <HomePageHero label="Services" line="Seven services, one team in Surat. Pick one to see what we build and who it is for, or tell us about your idea.">
        <em>Everything we build,</em> in one place
      </HomePageHero>

      <section className="hb2-sv hb2-pg-svs" data-live="">
        <div className="hb2-wrap">
          {SERVICES.map((s, i) => (
            <article key={s.key} id={s.key} className={`hb2-pg-svc${i % 2 ? " hb2-pg-flip" : ""}`} data-pause-off>
              <div className={`hb2-pg-art hb2-sv-${s.key}`} data-r>
                <span className="hb2-pg-no">{String(i + 1).padStart(2, "0")}</span>
                <div className="hb2-sv-art" aria-hidden>
                  <Art k={s.key} />
                </div>
              </div>
              <div className="hb2-pg-tx" data-r style={{ "--d": "120ms" } as CSSProperties}>
                <p className="hb2-m-k">{s.kick}</p>
                <h2>
                  <em>{s.em}</em> {s.rest}
                </h2>
                <p className="hb2-pg-over">{s.over}</p>
                <div className="hb2-pg-two">
                  <div>
                    <h3>What we build</h3>
                    <ul>
                      {s.builds.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Good for</h3>
                    <ul>
                      {s.fit.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <SmartLink href={s.href} className="hb2-m-btn">
                  Explore {s.em} {s.rest}
                </SmartLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HomeCta />
    </HomeShell>
  );
}
