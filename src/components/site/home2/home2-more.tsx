import type { CSSProperties } from "react";
import { SmartLink } from "@/components/site/smart-link";
import { getSiteSettings } from "@/lib/cms/queries";
import { Home2Contact } from "./home2-contact";

// The sections of Home 2 after the services (prefix hb2-m in styles/home-2.css). All facts are the ones already on the site (Home page content):
// founded 2019 in Surat, 300+ projects, 7 core services, 7 industries, 6 technology platforms, the industries, the places, the tools.
// Motion is transform / opacity only; every animated block carries data-pause-off so it stops when it is off screen.

const STATS = [
  { v: "2019", l: "Founded in Surat" },
  { v: "7", l: "Core services" },
  { v: "7", l: "Industries served" },
  { v: "6", l: "Technology platforms" },
];

const STEPS = [
  { t: "Discover & understand", x: "We learn your goals, your audience and what the product must do, then plan a clear roadmap." },
  { t: "Design & prototype", x: "Brand-aligned interfaces and clickable prototypes, so ideas are tested early." },
  { t: "Build & test", x: "Clean front and back-end code, tested for speed, SEO, accessibility and security." },
  { t: "Launch & support", x: "Secure deployment, then monitoring and steady improvements for the long run." },
];

const INDUSTRIES = [
  { n: "E-commerce", x: "Fast and conversion-optimized online stores to help grow your sales.", c: 7 },
  { n: "Healthcare", x: "Secure and user-friendly portals for clinics, hospitals and health startups.", c: 5 },
  { n: "Real estate", x: "Listing platforms with filters, maps and booking, and VR walkthroughs of properties.", c: 4 },
  { n: "Education", x: "Online learning websites, course portals and student management systems.", c: 4 },
  { n: "Finance", x: "Web apps for banking, fintech and secure transaction platforms.", c: 4 },
  { n: "Construction & mining", x: "VR projects and immersive visualisation for construction and mining.", c: 5 },
  { n: "Travel & hospitality", x: "Booking systems, tour showcase websites and itinerary planners.", c: 7 },
];

const PLACES = ["Surat, India", "United States", "Canada", "United Kingdom", "Germany", "UAE", "Singapore", "Australia"];

const TECH = "React.js|Vue.js|Angular|Node.js|Laravel|PHP|WordPress|Shopify|Kotlin|Swift|Flutter|React Native|Python|TensorFlow|OpenAI|Unity|Unreal Engine|PostgreSQL|MongoDB|Docker".split("|");

export async function Home2More() {
  const site = await getSiteSettings();
  // the e-mail and the first phone number of the contact cards (Admin > Settings)
  const all = site.contactCards.flatMap((c) => c.lines.split("\n").map((l) => l.trim()));
  const lines = [all.find((l) => /^[^\s@]+@[^\s@]+$/.test(l)), all.find((l) => /^\+?[\d\s]{8,}$/.test(l))].filter((l): l is string => !!l);
  return (
    <>
      {/* ---- a huge number on a soft colour field */}
      <section className="hb2-m-big" aria-label="Projects since 2019" data-pause-off>
        <div className="hb2-wrap">
          <div className="hb2-m-field" data-r>
            <span className="hb2-m-blob hb2-m-b1" />
            <span className="hb2-m-blob hb2-m-b2" />
            <span className="hb2-m-blob hb2-m-b3" />
            <span className="hb2-m-fl">We3vision</span>
            <span className="hb2-m-fr">Since 2019</span>
            <strong className="hb2-m-num" aria-hidden>
              300+
            </strong>
            <p className="hb2-m-cap">
              <span className="sr-only">300+ </span>successful projects: websites, apps, AI and immersive work, built from our office in Surat, India for clients around the world.
            </p>
          </div>
        </div>
      </section>

      {/* ---- the numbers, divided by hairlines */}
      <section className="hb2-m-stats" aria-label="We3vision in numbers">
        <div className="hb2-wrap">
          <ul>
            {STATS.map((s, i) => (
              <li key={s.l} data-r style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <b>{s.v}</b>
                <span>{s.l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- the process: four glowing steps on one line of light */}
      <section className="hb2-m-pro" aria-labelledby="hb2-t4" data-pause-off>
        <div className="hb2-wrap">
          <p className="hb2-label">Process</p>
          <h2 id="hb2-t4" className="hb2-m-h" data-r>
            From the first idea to launch, <em>step by step</em>
          </h2>
          <div className="hb2-m-steps">
            <span className="hb2-m-rail" aria-hidden>
              <i />
            </span>
            {STEPS.map((s, i) => (
              <div key={s.t} className="hb2-m-step" data-r style={{ "--d": `${i * 110}ms`, "--i": i } as CSSProperties}>
                <span className="hb2-m-node" aria-hidden>
                  {i + 1}
                </span>
                <h3>{s.t}</h3>
                <p>{s.x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- industries as a bento */}
      <section className="hb2-m-ind" id="industries" aria-labelledby="hb2-t5">
        <div className="hb2-wrap">
          <p className="hb2-label">Industries</p>
          <h2 id="hb2-t5" className="hb2-m-h" data-r>
            <em>Built for</em> every industry
          </h2>
          <div className="hb2-m-bento">
            {INDUSTRIES.map((x, i) => (
              <article key={x.n} className="hb2-m-bc" data-r style={{ gridColumn: `span ${x.c}`, "--d": `${(i % 3) * 90}ms`, "--g": (i * 47) % 100 } as CSSProperties}>
                <span className="hb2-m-bn">{String(i + 1).padStart(2, "0")}</span>
                <h3>{x.n}</h3>
                <p>{x.x}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the world: one wide glass card with two lines of places */}
      <section className="hb2-m-world" id="reach" aria-labelledby="hb2-t6" data-pause-off>
        <div className="hb2-wrap">
          <div className="hb2-m-wc" data-r>
            <div className="hb2-m-wt">
              <p className="hb2-m-k">Global reach</p>
              <h2 id="hb2-t6">
                From Surat <em>to the world</em>
              </h2>
              <p>We have worked with clients from many countries. Wherever you are, our team builds websites, apps, AI and immersive experiences for you.</p>
              <SmartLink href="/contact" className="hb2-m-btn">
                Start your project
              </SmartLink>
            </div>
            <div className="hb2-m-wm" aria-hidden>
              {[0, 1].map((r) => (
                <div key={r} className="hb2-m-row" data-rev={r ? "" : undefined}>
                  <div className="hb2-m-track">
                    {[...PLACES, ...PLACES].map((p, i) => (
                      <span key={`${p}${i}`} className="hb2-m-chip">
                        <i />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- the tools, on a violet panel with a floating orb */}
      <section className="hb2-m-tech" id="tools" aria-labelledby="hb2-t7" data-pause-off>
        <div className="hb2-wrap">
          <div className="hb2-m-tp" data-r>
            <div className="hb2-m-tt">
              <p className="hb2-m-k">Tools &amp; technologies</p>
              <h2 id="hb2-t7">
                The technology <em>behind our work</em>
              </h2>
              <ul>
                {TECH.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="hb2-m-orb" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      {/* ---- the contact section: the words on the left, the form on the right (the same form and rules as the Contact page) */}
      <section className="hb2-m-ctc" id="contact" aria-labelledby="hb2-t8">
        <div className="hb2-wrap hb2-m-ctg">
          <div className="hb2-m-ct" data-r>
            <p className="hb2-m-k">Let&apos;s talk</p>
            <h2 id="hb2-t8">
              Ready to start <em>your project?</em>
            </h2>
            <p>Tell us about your idea and the We3vision team will get back to you. Web, AI, apps, VR and design: we are happy to help.</p>
            <ul className="hb2-m-cl">
              {lines.map((t) => (
                <li key={t}>{t.includes("@") ? <a href={`mailto:${t}`}>{t}</a> : <a href={`tel:${t.replace(/\s/g, "")}`}>{t}</a>}</li>
              ))}
            </ul>
            <SmartLink href="/contact" className="hb2-m-btn">
              All contact details
            </SmartLink>
          </div>
          <div className="hb2-ct-panel" data-r style={{ "--d": "120ms" } as CSSProperties}>
            <h2>
              Send us a <em>message</em>
            </h2>
            <Home2Contact />
          </div>
        </div>
      </section>
    </>
  );
}
