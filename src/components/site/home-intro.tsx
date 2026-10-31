import "@/styles/home-intro.css";
import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { HeroTilt } from "./lazy";
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
  const leadWords = words.slice(0, cut);
  const tailWords = words.slice(cut);
  // every word rises out of its own mask one after the other (hx-w / hx-wi in home-intro.css); the text of the h1 stays the same
  const rise = (list: string[], from: number) =>
    list.map((w, i) => (
      <Fragment key={from + i}>
        {i > 0 || from > 0 ? " " : null}
        <span className="hx-w">
          <span className="hx-wi" style={{ "--i": from + i } as CSSProperties}>
            {w}
          </span>
        </span>
      </Fragment>
    ));
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
                {rise(leadWords, 0)}
                {tailWords.length > 0 && <span className="hx-tail">{rise(tailWords, leadWords.length)}</span>}
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
              {/* the brand mark: the logo floats in the middle of rings that turn slowly, one dot on the outer ring for each of our services (laptop only) */}
              <div className="hx-mid" aria-hidden>
                <div className="hx-art" data-pause-off style={{ "--n": Math.max(services.length, 1) } as CSSProperties}>
                  <span className="hx-glow" />
                  <span className="hx-ring hx-ring-a">
                    {services.map((n, i) => (
                      <span key={n} className="hx-orb" style={{ "--i": i } as CSSProperties}>
                        <i className="hx-dot" />
                      </span>
                    ))}
                  </span>
                  <span className="hx-ring hx-ring-b" />
                  <span className="hx-ring hx-ring-c" />
                  <span className="hx-mark-pos">
                    <Image className="hx-mark" src="/brand/logo-mark.webp" alt="" width={480} height={395} unoptimized />
                  </span>
                </div>
                <HeroTilt />
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
