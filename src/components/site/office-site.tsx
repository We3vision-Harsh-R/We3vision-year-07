"use client";

import { useEffect, useState, type CSSProperties } from "react";

// The website that the guide builds on the big screen of the office (office-builder.tsx): always the same design with ten sections (a header
// and nine sections) made only of boxes, pictures, text lines and small animations, with the brand name of the visitor in it. It is laid out
// for a 1280 px wide window (.ws-* in globals.css); the screen scales it. Clicking a section remixes it (data-v 0 / 1 / 2).

export const SECTION_NAMES = ["Header", "Hero", "Logos", "Services", "About", "Numbers", "Process", "Gallery", "Reviews", "Contact"];

const Line = ({ w = "100%" }: { w?: string }) => <i className="ws-line" style={{ width: w }} />;

function Count({ to, run, suffix = "" }: { to: number; run: boolean; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return (
    <>
      {n.toLocaleString()}
      {suffix}
    </>
  );
}

export function BuiltSite({
  brand,
  shown,
  variants,
  onRemix,
  mode,
}: {
  brand: string;
  shown: number;
  variants: number[];
  onRemix: (i: number) => void;
  mode: "light" | "dark";
}) {
  const name = brand.trim() || "Your Brand";
  const initial = name.charAt(0).toUpperCase();
  const sec = (i: number, cls: string, children: React.ReactNode) => (
    <section
      key={i}
      className={`ws-sec ${cls}`}
      data-sec={i}
      data-v={variants[i]}
      data-shown={i < shown}
      data-name={SECTION_NAMES[i]}
      onClick={() => i < shown && onRemix(i)}
    >
      <span className="ws-tag">
        {SECTION_NAMES[i]} · click to remix
      </span>
      {children}
    </section>
  );
  return (
    <div className="ws" data-mode={mode} data-empty={shown === 0}>
      {sec(
        0,
        "ws-nav",
        <>
          <a className="ws-logo">
            <i>{initial}</i>
            <b>{name}</b>
          </a>
          <nav>
            {["Services", "About", "Work", "Contact"].map((t) => (
              <a key={t}>{t}</a>
            ))}
          </nav>
          <button type="button" className="ws-btn ws-btn-sm">
            Get started
          </button>
        </>,
      )}
      {sec(
        1,
        "ws-hero",
        <>
          <div className="ws-hero-text">
            <span className="ws-badge">
              <i /> Now open for new projects
            </span>
            <h1>
              Welcome to <em>{name}</em>
            </h1>
            <div className="ws-lines">
              <Line w="92%" />
              <Line w="78%" />
              <Line w="55%" />
            </div>
            <div className="ws-row">
              <button type="button" className="ws-btn">
                Start a project
              </button>
              <button type="button" className="ws-btn ws-btn-ghost">
                See our work
              </button>
            </div>
            <div className="ws-proof">
              {[0, 1, 2, 3].map((k) => (
                <i key={k} style={{ "--k": k } as CSSProperties} />
              ))}
              <span>
                <b>4.9</b> from happy customers
              </span>
            </div>
          </div>
          <div className="ws-hero-art" aria-hidden>
            <div className="ws-blob" />
            <div className="ws-card ws-c1">
              <i />
              <Line w="70%" />
              <Line w="45%" />
            </div>
            <div className="ws-card ws-c2">
              <b>+128%</b>
              <Line w="60%" />
            </div>
            <div className="ws-phone">
              <i />
              <div />
              <div />
              <div />
            </div>
          </div>
        </>,
      )}
      {sec(
        2,
        "ws-logos",
        <>
          <p>Trusted by teams everywhere</p>
          <div className="ws-marquee">
            <div>
              {[0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5].map((k, j) => (
                <span key={j} data-k={k}>
                  <i />
                  <Line w="52px" />
                </span>
              ))}
            </div>
          </div>
        </>,
      )}
      {sec(
        3,
        "ws-services",
        <>
          <header>
            <span className="ws-eyebrow">Our services</span>
            <h2>
              Everything {name} <em>can do</em> for you
            </h2>
          </header>
          <div className="ws-grid3">
            {["Strategy", "Design", "Growth"].map((t, k) => (
              <article key={t} className="ws-box" style={{ "--k": k } as CSSProperties}>
                <i className="ws-ico" data-k={k} />
                <h3>{t}</h3>
                <Line />
                <Line w="86%" />
                <Line w="62%" />
                <span className="ws-more">Learn more →</span>
              </article>
            ))}
          </div>
        </>,
      )}
      {sec(
        4,
        "ws-about",
        <>
          <div className="ws-pic" aria-hidden>
            <span className="ws-sun" />
            <svg viewBox="0 0 400 220" preserveAspectRatio="none">
              <path d="M0 220V150Q60 90 120 140T250 110T400 150V220Z" />
              <path d="M0 220V180Q80 130 160 170T320 150T400 180V220Z" />
            </svg>
            <span className="ws-pic-badge">
              <b>10+</b> years
            </span>
          </div>
          <div className="ws-about-text">
            <span className="ws-eyebrow">About us</span>
            <h2>
              The story behind <em>{name}</em>
            </h2>
            <Line />
            <Line w="94%" />
            <Line w="70%" />
            <ul>
              {["Friendly experts", "Fast delivery", "Fair prices"].map((t) => (
                <li key={t}>
                  <i />
                  {t}
                </li>
              ))}
            </ul>
            <button type="button" className="ws-btn">
              Meet the team
            </button>
          </div>
        </>,
      )}
      {sec(
        5,
        "ws-stats",
        <>
          {[
            [1200, "+", "Projects"],
            [86, "", "Clients"],
            [14, "", "Awards"],
            [99, "%", "Happy"],
          ].map(([n, suffix, label]) => (
            <div key={label as string} className="ws-stat">
              <b>
                <Count to={n as number} run={5 < shown} suffix={suffix as string} />
              </b>
              <span>{label}</span>
            </div>
          ))}
        </>,
      )}
      {sec(
        6,
        "ws-process",
        <>
          <header>
            <span className="ws-eyebrow">How it works</span>
            <h2>
              Four steps with <em>{name}</em>
            </h2>
          </header>
          <ol>
            {["Talk", "Plan", "Build", "Launch"].map((t, k) => (
              <li key={t} style={{ "--k": k } as CSSProperties}>
                <i>{k + 1}</i>
                <h3>{t}</h3>
                <Line w="90%" />
                <Line w="64%" />
              </li>
            ))}
          </ol>
        </>,
      )}
      {sec(
        7,
        "ws-gallery",
        <>
          <header>
            <span className="ws-eyebrow">Our work</span>
            <h2>
              Recent projects from <em>{name}</em>
            </h2>
          </header>
          <div className="ws-tiles">
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <figure key={k} data-k={k}>
                <span className="ws-tile-art" />
                <figcaption>
                  <Line w="60%" />
                </figcaption>
              </figure>
            ))}
          </div>
        </>,
      )}
      {sec(
        8,
        "ws-reviews",
        <>
          <header>
            <span className="ws-eyebrow">Kind words</span>
            <h2>
              People love <em>{name}</em>
            </h2>
          </header>
          <div className="ws-grid2">
            {[0, 1].map((k) => (
              <article key={k} className="ws-box">
                <div className="ws-stars">★★★★★</div>
                <Line />
                <Line w="92%" />
                <Line w="66%" />
                <footer>
                  <i data-k={k} />
                  <span>
                    <Line w="90px" />
                    <Line w="60px" />
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </>,
      )}
      {sec(
        9,
        "ws-contact",
        <>
          <div className="ws-banner">
            <h2>
              Ready to start with <em>{name}</em>?
            </h2>
            <Line w="46%" />
            <div className="ws-mail">
              <span>you@email.com</span>
              <button type="button" className="ws-btn">
                Say hello
              </button>
            </div>
          </div>
          <footer className="ws-foot">
            <div>
              <a className="ws-logo">
                <i>{initial}</i>
                <b>{name}</b>
              </a>
              <Line w="140px" />
              <Line w="100px" />
            </div>
            {[0, 1, 2].map((k) => (
              <div key={k}>
                <Line w="70px" />
                <Line w="90px" />
                <Line w="60px" />
                <Line w="80px" />
              </div>
            ))}
            <p>© {name}. All rights reserved.</p>
          </footer>
        </>,
      )}
    </div>
  );
}
