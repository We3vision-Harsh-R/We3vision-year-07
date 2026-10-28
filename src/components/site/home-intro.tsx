import "@/styles/home-intro.css";
import Image from "next/image";
import type { CSSProperties } from "react";
import { SmartLink } from "./smart-link";

type Badge = { label: string; image: string };
type Fact = { value: string; label: string };

// THE FIRST SCREEN OF THE HOME PAGE (laptop / desktop / phone), redesigned 2026-10-27 after the reference the owner gave (beximco-consulting.webflow.io):
// one big rounded dark panel; top left the heading (its last words softer), top right one sentence and two pill buttons; bottom left three
// services as a small list, bottom right the recognitions (Startup India, MSME). Under it "At a glance" (facts). Styles: src/styles/home-intro.css
// ("hx-" hero, "hy-" glance). Same content as before: nothing invented.

export function HomeIntro({
  title,
  above,
  mark,
  below,
  chip,
  facts,
  badges,
  services = [],
}: {
  title: string;
  above: string;
  mark: string;
  below: string;
  chip: string;
  facts: Fact[];
  badges: Badge[];
  services?: string[];
}) {
  // the heading: the last three words are shown softer
  const words = title.trim().split(/\s+/);
  const cut = words.length > 4 ? words.length - 3 : words.length;
  const lead = words.slice(0, cut).join(" ");
  const tail = words.slice(cut).join(" ");
  // the sentence beside the buttons: about the company, from the page "About us"
  const text = "Since 2019 we have been at the forefront of digital innovation, delivering cutting-edge solutions that empower businesses and individuals alike.";
  const logos = badges.filter((b) => b.image);

  return (
    <>
      <section className="hx" aria-labelledby="hx-title">
        <div className="hx-panel">
          <div className="hx-top">
            <div className="hx-head">
              {above && mark && (
                <p className="hx-tag">
                  {above} {mark} {below}
                </p>
              )}
              <h1 id="hx-title" className="hx-title">
                {lead}
                {tail && <span> {tail}</span>}
              </h1>
            </div>
            <div className="hx-side">
              <p className="hx-text">{text}</p>
              <div className="hx-cta">
                <SmartLink href="/contact" className="hx-btn hx-btn-solid">
                  Start a project
                </SmartLink>
                <SmartLink href="/portfolio" className="hx-btn hx-btn-soft">
                  See our work
                </SmartLink>
              </div>
            </div>
          </div>

          <div className="hx-bottom">
            {services.length > 0 ? (
              <ul className="hx-list">
                {services.slice(0, 3).map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : (
              <span />
            )}
            {logos.length > 0 && (
              <div className="hx-rec">
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
          </div>
        </div>
      </section>

      {facts.length > 0 && (
        <section className="hy" aria-label={chip || "At a glance"}>
          <div className="hy-in">
            <header className="hy-head">
              {chip && <p className="hy-chip">{chip}</p>}
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
