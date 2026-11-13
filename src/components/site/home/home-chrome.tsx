import type { ReactNode } from "react";
import { SmartLink } from "@/components/site/smart-link";
import { getSiteSettings } from "@/lib/cms/queries";
import { TopLink } from "@/components/site/footer-word";
import { HomeFx } from "./home-fx";
import { SERVICES } from "./home-svc-data";

// The frame of every page in the home design: the page root (.hb2, with the scroll life of home-fx), the footer and the bottom menu. The site footer is hidden on these pages
// by home.css (body:has(.hb2)); the site menu (floating nav) stays as it is.

function line(t: string) {
  const mail = t.includes("@") && !t.includes(" ");
  const tel = /^\+?[\d\s]{8,}$/.test(t);
  if (mail) return <a href={`mailto:${t}`}>{t}</a>;
  if (tel) return <a href={`tel:${t.replace(/\s/g, "")}`}>{t}</a>;
  return <span>{t}</span>;
}

// the small icons of the social links (drawn with strokes, the colour follows the text)
const SOCIAL_ICON: Record<string, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10.5V16M8 7.8v.1M12 16v-5.5M12 12.8c0-1.5 1-2.3 2.2-2.3 1.3 0 2 .8 2 2.4V16" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.9v.1" />
    </svg>
  ),
};

export async function HomeFooter() {
  const site = await getSiteSettings();
  const head = site.contactCards[0];
  const germany = site.contactCards.find((c) => /germany/i.test(c.title));
  // the first +91 phone number of the contact cards goes under the e-mail of the head office
  const phone = site.contactCards.flatMap((c) => c.lines.split("\n")).find((t) => /^\+91[\d\s]{8,}$/.test(t.trim()));
  return (
    <footer className="hb2-f" data-pause-off>
      <span className="hb2-f-beam" aria-hidden />
      <div className="hb2-wrap">
        <div className="hb2-f-top">
          <div className="hb2-f-brand">
            <p className="hb2-f-name">
              We3<em>vision</em>
            </p>
            <p className="hb2-f-tag">Web, AI &amp; Metaverse studio in Surat, India. Websites, apps, brands and immersive work for businesses everywhere.</p>
            {site.social.length > 0 && (
              <p className="hb2-f-soc">
                {site.social.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {SOCIAL_ICON[s.label.toLowerCase()]}
                    {s.label}
                  </a>
                ))}
              </p>
            )}
          </div>
          <nav className="hb2-f-col" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.key}>
                  <SmartLink href={s.href}>
                    {s.em} {s.rest}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="hb2-f-col" aria-label="Company">
            <h3>Company</h3>
            <ul>
              <li>
                <SmartLink href="/services">Our services</SmartLink>
              </li>
              <li>
                <SmartLink href="/portfolio">Portfolio</SmartLink>
              </li>
              <li>
                <SmartLink href="/contact">Contact us</SmartLink>
              </li>
              <li>
                <SmartLink href="/about">About</SmartLink>
              </li>
              <li>
                <SmartLink href="/team">Our team</SmartLink>
              </li>
              <li>
                <SmartLink href="/blog">Blog</SmartLink>
              </li>
              <li>
                <SmartLink href="/careers">Careers</SmartLink>
              </li>
            </ul>
          </nav>
          <div className="hb2-f-col">
            <h3>{head?.title ?? "Surat (Head Office)"}</h3>
            <p className="hb2-f-addr">
              {(head?.lines ?? "").split("\n").map((t) => (
                <span key={t}>{line(t)}</span>
              ))}
              {phone && !(head?.lines ?? "").includes(phone) && <span>{line(phone.trim())}</span>}
            </p>
            {germany && (
              <>
                <h3 className="hb2-f-h2">{germany.title}</h3>
                <p className="hb2-f-addr">
                  {germany.lines.split("\n").map((t) => (
                    <span key={t}>{line(t)}</span>
                  ))}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="hb2-f-bot">
          <span>{site.copyright}</span>
          <TopLink>
            <span className="hb2-f-up" aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
            <span className="hb2-f-uptx">Back to the top</span>
          </TopLink>
        </div>
      </div>
      <p className="hb2-f-big" aria-hidden>
        We3vision
      </p>
    </footer>
  );
}

export function HomeCta() {
  return (
    <section className="hb2-m-cta" aria-labelledby="hb2-tc" data-pause-off>
      <div className="hb2-wrap">
        <div className="hb2-m-cc">
          <div className="hb2-m-ct" data-r>
            <h2 id="hb2-tc">
              Ready to start <em>your project?</em>
            </h2>
            <p>Tell us about your idea and the We3vision team will get back to you. Web, AI, apps, VR and design: we are happy to help.</p>
            <SmartLink href="/contact" className="hb2-m-btn">
              Send a message
            </SmartLink>
          </div>
          <div className="hb2-m-grid" aria-hidden>
            <span className="hb2-m-beam hb2-m-bh" />
            <span className="hb2-m-beam hb2-m-bv" />
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} className={i === 4 ? "hb2-m-lit" : undefined}>
                {i === 4 && (
                  <svg viewBox="0 0 24 24">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                )}
              </i>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** the top of an inner page: a quiet arch, a label, a big title and one line */
export function HomePageHero({ label, children, line: text }: { label: string; children: ReactNode; line: string }) {
  return (
    <header className="hb2-pg-hero">
      <span className="hb2-pg-arch hb2-pg-a1" aria-hidden />
      <span className="hb2-pg-arch hb2-pg-a2" aria-hidden />
      <div className="hb2-wrap">
        <p className="hb2-pg-label">{label}</p>
        <h1>{children}</h1>
        <p className="hb2-pg-line">{text}</p>
      </div>
    </header>
  );
}

/** the root of an inner page */
export async function HomeShell({ children }: { children: ReactNode }) {
  return (
    <div className="hb2 hb2-pg">
      <HomeFx />
      {children}
      <HomeFooter />
    </div>
  );
}
