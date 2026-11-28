import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { HomeCta, HomePageHero, HomeShell } from "@/components/site/home/home-chrome";
import { ALL, GROUPS, JOURNEYS, nameOf } from "@/components/site/services/services-data";
import { JsonLd } from "@/components/site/json-ld";
import { SmartLink } from "@/components/site/smart-link";
import { breadcrumbNode, organizationRef, serviceNode, siteBase, webPageNode, websiteNode } from "@/lib/seo/schema";
import { SHARE_IMAGE } from "@/lib/share-image";
import "@/styles/home.css";
import "@/styles/services-map.css";

// The Services page: every service of We3vision in five groups (the groups of the big menu), what each one is, which services go well with it,
// and the usual combinations. The words are in components/site/services/services-data.ts; the look is styles/services-map.css (svx-).
export const revalidate = 3600;

const TITLE = "Our Services | Web, AI, Apps, Metaverse, Brand, E-commerce & Marketing | We3vision";
const DESCRIPTION = "Every service of We3vision in one place: web, apps, AI, CRM, metaverse, UI/UX, branding, e-commerce on Shopify and WordPress, SEO and marketing, from Surat, India.";
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: { type: "website", url: "/services", locale: "en_IN", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE.url] },
};

const no = (n: number) => String(n).padStart(2, "0");

export default function ServicesPage() {
  // structured data: the page, its trail, and the list of all services (same @id as on each service page)
  const base = siteBase();
  const url = `${base}/services`;
  const list = {
    "@type": "ItemList",
    "@id": `${url}#services`,
    name: "Services of We3vision",
    numberOfItems: ALL.length,
    itemListElement: ALL.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: serviceNode({ path: s.href, name: s.name }) })),
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
      <HomePageHero label="Services" line="Websites, apps, AI, brands, online stores and marketing. Pick a group to see what we do, or look at how the services work together.">
        <em>Every service,</em> one connected team
      </HomePageHero>

      <nav className="svx-nav" aria-label="Service groups">
        <div className="hb2-wrap">
          <ul>
            {GROUPS.map((g) => (
              <li key={g.key}>
                <a href={`#${g.key}`}>
                  {g.label} <span>{g.items.length}</span>
                </a>
                {/* hover (or keyboard focus) opens the list of the services of the group */}
                <div className="svx-dd">
                  <ul>
                    {g.items.map((s) => (
                      <li key={s.href}>
                        <SmartLink href={s.href}>{s.name}</SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li>
              <a href="#together">Together</a>
            </li>
          </ul>
        </div>
      </nav>

      {GROUPS.map((g, gi) => (
        <section key={g.key} id={g.key} className="svx-grp" aria-labelledby={`svx-h-${g.key}`}>
          <div className="hb2-wrap svx-grid">
            <header className="svx-side" data-r>
              <p className="svx-no">{no(gi + 1)}</p>
              <p className="hb2-m-k">{g.label}</p>
              <h2 id={`svx-h-${g.key}`}>
                <em>{g.em.split(" ")[0]}</em> {g.em.split(" ").slice(1).join(" ")}
              </h2>
              <p className="svx-lede">{g.text}</p>
            </header>
            <ul className="svx-cards">
              {g.items.map((s, i) => (
                <li key={s.href} className="svx-card" data-r style={{ "--d": `${(i % 2) * 90}ms` } as CSSProperties}>
                  <h3>
                    <SmartLink href={s.href}>{s.name}</SmartLink>
                  </h3>
                  <p>{s.line}</p>
                  <div className="svx-with">
                    <span>Goes well with</span>
                    <ul>
                      {s.pairs.map((p) => (
                        <li key={p}>
                          <SmartLink href={p}>{nameOf(p)}</SmartLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="svx-go" aria-hidden>
                    →
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section id="together" className="svx-grp svx-tg" aria-labelledby="svx-h-together">
        <div className="hb2-wrap">
          <header className="svx-head" data-r>
            <p className="hb2-m-k">Together</p>
            <h2 id="svx-h-together">
              <em>Better</em> when they work together
            </h2>
            <p className="svx-lede">Most projects use more than one service. These are the combinations we are asked for most, in the order we usually do them.</p>
          </header>
          <ul className="svx-jr">
            {JOURNEYS.map((j, i) => (
              <li key={j.key} className="svx-j" data-r style={{ "--d": `${(i % 2) * 90}ms` } as CSSProperties}>
                <h3>{j.title}</h3>
                <p>{j.text}</p>
                <ol>
                  {j.steps.map((s, n) => (
                    <li key={s}>
                      <span>{n + 1}</span>
                      <SmartLink href={s}>{nameOf(s)}</SmartLink>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeCta />
    </HomeShell>
  );
}
