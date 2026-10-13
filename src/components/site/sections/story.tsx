import { IconTile } from "../icons";
import { Reveal } from "../reveal";
import { Rich, paragraphs } from "../ui";
import { variantOf } from "../modern/variant-table";
import type { SectionComponent } from "./shared";

// The text section "about this service", in four different looks, so that the pages of the site do not all have the same block:
//  duo    two glass cards side by side, one paragraph in each, with a number and an icon
//  lead   the first paragraph as one large statement, the others in columns under it
//  rail   rows: a big outline number and a small title on the left, the paragraph on the right
//  chips  the highlighted phrases as a row of chips ("key ideas"), then the paragraphs in two columns
//  stack  the paragraphs as steps of a staircase, every one a little further to the right
//  quote  the first paragraph as a pull quote on the left, the others as numbered notes on the right
//  line   a vertical line with the paragraphs on both sides of it, like a timeline
// The service pages have their look from the table in modern/variant-table.ts (no two the same); the other pages have one by LOOK or by their
// address. The look is in globals.css (.sy-*, .vy-*).
type Look = "duo" | "lead" | "rail" | "chips" | "stack" | "quote" | "line";
const BY_NUMBER: Look[] = ["duo", "lead", "rail", "chips", "stack", "quote", "line"];

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
  const v = variantOf(page, "story");
  const look = v !== null ? (BY_NUMBER[v] ?? "duo") : lookOf(page);
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

        {look === "stack" && (
          <Reveal className="vy-stack">
            {paras.map((p, i) => (
              <article key={i} className="vy-st" style={{ "--i": i } as React.CSSProperties}>
                <span className="vy-st-no" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="sy-p">
                  <Rich text={p} />
                </p>
              </article>
            ))}
          </Reveal>
        )}

        {look === "quote" && (
          <Reveal className="vy-quote">
            <blockquote className="vy-q-main">
              <span className="vy-q-mark" aria-hidden>
                “
              </span>
              <p>
                <Rich text={paras[0] ?? ""} />
              </p>
              <cite>We3vision</cite>
            </blockquote>
            {paras.length > 1 && (
              <ol className="vy-q-notes">
                {paras.slice(1).map((p, i) => (
                  <li key={i}>
                    <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                    <p className="sy-p">
                      <Rich text={p} />
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Reveal>
        )}

        {look === "line" && (
          <Reveal className="vy-line">
            {paras.map((p, i) => (
              <div key={i} className="vy-ln" data-side={i % 2 === 0 ? "l" : "r"}>
                <span className="vy-ln-dot" aria-hidden />
                <div className="vy-ln-card">
                  <span className="vy-ln-no">{TITLES[i % TITLES.length]}</span>
                  <p className="sy-p">
                    <Rich text={p} />
                  </p>
                </div>
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
