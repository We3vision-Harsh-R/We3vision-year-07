import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Home2Cta, Home2PageHero, Home2Shell } from "@/components/site/home2/home2-chrome";
import { Art, SERVICES } from "@/components/site/home2/home2-svc-data";
import { SmartLink } from "@/components/site/smart-link";
import { SHARE_IMAGE } from "@/lib/share-image";
import "@/styles/home-2.css";

// The Services page: the seven main services of We3vision, each with its animated picture, what we build and who it is for.
export const revalidate = 3600;

const TITLE = "Our Services | Web, AI, App, Metaverse, Branding, Software & CRM | We3vision";
const DESCRIPTION = "We3vision builds websites, AI solutions, mobile apps, metaverse experiences, brands, custom software and CRM systems for businesses everywhere, from Surat, India.";
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: { type: "website", url: "/services", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [SHARE_IMAGE.url] },
};

export default function ServicesPage() {
  return (
    <Home2Shell>
      <Home2PageHero label="Services" line="Seven services, one team in Surat. Pick one to see what we build and who it is for, or tell us about your idea.">
        <em>Everything we build,</em> in one place
      </Home2PageHero>

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

      <Home2Cta />
    </Home2Shell>
  );
}
