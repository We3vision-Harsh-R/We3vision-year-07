import { IconTile } from "../icons";
import { Reveal } from "../reveal";
import { Rich, paragraphs } from "../ui";
import type { SectionComponent } from "./shared";

// The text section "about this service", in four different looks, so that the pages of the site do not all have the same block:
//  duo    two glass cards side by side, one paragraph in each, with a number and an icon
//  lead   the first paragraph as one large statement, the others in columns under it
//  rail   rows: a big outline number and a small title on the left, the paragraph on the right
//  chips  the highlighted phrases as a row of chips ("key ideas"), then the paragraphs in two columns
// Every page has its own look (see LOOK), the other pages get one by their address. The look is in globals.css (.sy-*).
type Look = "duo" | "lead" | "rail" | "chips";

const LOOK: Record<string, Look> = {
  ai: "chips",
  webdev: "duo",
  mobile: "lead",
  seo: "rail",
  crm: "duo",
  animation: "lead",
  "3d-modeling": "rail",
  graphics: "chips",
  "ui-ux-design": "lead",
  "headless-CMS-devlopment-services": "rail",
  "custom-wordpress-devlopment-services": "duo",
  "shopify-development-services": "chips",
  "custom-woocommerce-devlopment": "lead",
  "shopify-app-development-services": "duo",
  "wordpress-plugin-development-company": "rail",
};
const ORDER: Look[] = ["duo", "lead", "rail", "chips"];
const lookOf = (page?: string): Look => (page && LOOK[page]) || ORDER[[...(page ?? "")].reduce((n, ch) => n + ch.charCodeAt(0), 0) % ORDER.length];
const TITLES = ["The idea", "What we build", "Why it matters", "How it works"];

/** the highlighted phrases of the text (the *starred* ones), without doubles */
const keyPhrases = (paras: string[]) =>
  [...new Set(paras.flatMap((p) => [...p.matchAll(/\*([^*]+)\*/g)].map((m) => m[1].trim())))].slice(0, 8);

export const Story: SectionComponent<"story"> = ({ data, page }) => {
  const paras = paragraphs(data.body);
  const look = lookOf(page);
  const phrases = keyPhrases(paras);

  return (
    <section id="about" className="sy py-24 sm:py-32" data-look={look}>
      <div className="sy-wrap">
        {look === "duo" && (
          <Reveal>
            <div className="sy-duo" data-n={Math.min(paras.length, 2)}>
              {paras.map((p, i) => (
                <article key={i} className="sy-card">
                  <div className="sy-card-top">
                    <IconTile index={i + 1} large />
                    <span className="sy-no">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="sy-p">
                    <Rich text={p} />
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        )}

        {look === "lead" && (
          <Reveal className="sy-lead-wrap">
            <p className="sy-lead">
              <Rich text={paras[0] ?? ""} />
            </p>
            {paras.length > 1 && (
              <div className="sy-cols">
                {paras.slice(1).map((p, i) => (
                  <p key={i} className="sy-p">
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            )}
          </Reveal>
        )}

        {look === "rail" && (
          <Reveal className="sy-rail">
            {paras.map((p, i) => (
              <div key={i} className="sy-row">
                <div className="sy-row-l">
                  <span className="sy-big" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="sy-title">{TITLES[i % TITLES.length]}</span>
                </div>
                <p className="sy-p">
                  <Rich text={p} />
                </p>
              </div>
            ))}
          </Reveal>
        )}

        {look === "chips" && (
          <Reveal className="sy-chips-wrap">
            {phrases.length > 0 && (
              <ul className="sy-chips" aria-label="Key ideas">
                {phrases.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            <div className="sy-cols">
              {paras.map((p, i) => (
                <p key={i} className="sy-p">
                  <Rich text={p} />
                </p>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};
