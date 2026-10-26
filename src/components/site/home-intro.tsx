import "@/styles/home-intro.css";
import Image from "next/image";
import type { CSSProperties } from "react";
import { SmartLink } from "./smart-link";

type Badge = { label: string; image: string };
type Fact = { value: string; label: string };

// THE FIRST SCREEN OF THE HOME PAGE (laptop / desktop), redesigned 2026-10-26 as an EDITORIAL page, not a template of cards and glows. Two sections:
//   1. the hero: on the left a small eyebrow, the real page heading (h1) in big tight type, two calls to action (one solid, one a plain underlined
//      link); on the right a huge "7" cut by the bottom edge, like a monument, with a year ruler beside it (one tick for every year since the
//      company was founded: 2019 ... now, drawn once, the last year lit) and the caption "Years of We3vision"
//   2. "At a glance" (below the hero): the facts as large numerals in a ruled table with hairlines, and the recognitions (Startup India, MSME,
//      from Admin > Settings > badges) as a quiet ledger beside it
// Same content as before (hero texts, facts of the "highlights" section, badges): nothing was added or invented. No canvas, no scroll pinning,
// nothing loops: the pieces rise once and the ruler draws once. Styles: src/styles/home-intro.css ("hi-" hero, "hy-" glance).

export function HomeIntro({
  title,
  above,
  mark,
  below,
  chip,
  facts,
  badges,
}: {
  title: string;
  above: string;
  mark: string;
  below: string;
  chip: string;
  facts: Fact[];
  badges: Badge[];
}) {
  // the years of the ruler: from the year the company was founded (a fact such as "2019 Founded in Surat") as many years as the big number says
  const founded = Number(facts.find((f) => /found/i.test(f.label))?.value);
  const span = Number(mark);
  const years = Number.isFinite(founded) && Number.isFinite(span) && span > 0 && span < 40 ? Array.from({ length: span + 1 }, (_, i) => founded + i) : [];
  const logos = badges.filter((b) => b.image);

  return (
    <>
      <section className="hi" aria-labelledby="hi-title">
        <div className="hi-copy">
          {above && (
            <p className="hi-eyebrow">
              <i aria-hidden />
              {above}
            </p>
          )}
          <h1 id="hi-title" className="hi-title">
            {title}
          </h1>
        </div>

        <div className="hi-base">
          <div className="hi-cta">
            <SmartLink href="/contact" className="hi-btn">
              <span>Start a project</span>
              <svg viewBox="0 0 24 24" aria-hidden width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </SmartLink>
            <SmartLink href="/portfolio" className="hi-link">
              See our work
            </SmartLink>
          </div>

          <div className="hi-track" aria-hidden>
            <p className="hi-years">
              <b>{mark}</b>
              <span>{below}</span>
            </p>
            {years.length > 0 && (
              <ol className="hi-line">
                {years.map((y, i) => (
                  <li key={y} data-last={i === years.length - 1} style={{ "--i": i } as CSSProperties}>
                    <i />
                    <span>{y}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      {(facts.length > 0 || logos.length > 0) && (
        <section className="hy" aria-label={chip || "At a glance"}>
          <div className="hy-in">
            <header className="hy-head">
              {chip && <p className="hy-chip">{chip}</p>}
              {logos.length > 0 && (
                <div className="hy-rec">
                  <p>Recognised by</p>
                  <ul>
                    {logos.map((b) => (
                      <li key={b.image} title={b.label}>
                        <Image src={b.image} alt={b.label} width={300} height={110} unoptimized />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </header>
            {facts.length > 0 && (
              <dl className="hy-facts">
                {facts.map((f, i) => (
                  <div key={i} style={{ "--i": i } as CSSProperties}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}
    </>
  );
}
