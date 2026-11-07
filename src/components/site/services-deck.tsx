"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ICONS } from "./icons";
import { ACCENTS, oneLine, parseSubs, type ServiceCard } from "./service-data";
import { SmartLink } from "./smart-link";

// THE SERVICES OF THE HOME PAGE (redesign 2026-11-04). One screen that stays: on the left the list of the services as big numbered lines, on the
// right a stage with what the chosen service is (summary, the things we build inside it, a button to its page). On a laptop the screen is pinned
// and the page scroll walks down the list, one service per part of the scroll, so a visitor stays here and sees all seven; hovering or clicking a
// line chooses it too. On a phone and a tablet nothing is pinned: the lines are an accordion, a tap opens the service under its line.
// Theme colours only. Without motion (reduced motion) nothing is pinned and nothing slides.
const stamp = () => Date.now();
const pad = (n: number) => String(n).padStart(2, "0");
const PART = 0.7; // screens of scroll for one service

export function ServicesDeck({ cards }: { cards: ServiceCard[] }) {
  const n = cards.length;
  const [at, setAt] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const manual = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || n < 2) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const read = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const p = Math.min(1, Math.max(0, -r.top / dist));
      barRef.current?.style.setProperty("--p", p.toFixed(3));
      if (stamp() < manual.current) return; // a click is being scrolled to: do not fight it
      setAt(Math.min(n - 1, Math.floor(p * n)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  const pick = (i: number) => {
    setAt(i);
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || !window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return;
    const dist = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const y = track.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / n) * dist;
    manual.current = stamp() + 1300;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (n === 0) return null;
  const card = cards[at] ?? cards[0];
  const subs = parseSubs(card.subs);
  const Icon = ICONS[at % ICONS.length];

  return (
    <section className="sd" aria-labelledby="sd-title" style={{ "--n": n, "--part": PART } as CSSProperties}>
      <div ref={trackRef} className="sd-track">
        <div ref={stickyRef} className="sd-sticky">
          <header className="sd-head">
            <span className="sd-chip">What we do</span>
            <h2 id="sd-title">
              Seven services,
              <br />
              <span>one team.</span>
            </h2>
          </header>

          <div className="sd-body">
            <ol className="sd-list">
              {cards.map((c, i) => {
                const subsI = parseSubs(c.subs);
                return (
                  <li key={i} className="sd-row" data-on={at === i} style={{ "--ac": ACCENTS[i % ACCENTS.length] } as CSSProperties}>
                    <button type="button" className="sd-btn" aria-expanded={at === i} onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === "mouse" && at !== i && setAt(i)}>
                      <i>{pad(i + 1)}</i>
                      <span>{oneLine(c.title)}</span>
                    </button>
                    {/* phone and tablet: the service opens under its line */}
                    <div className="sd-m">
                      {c.summary && <p>{c.summary}</p>}
                      {subsI.length > 0 && (
                        <ul>
                          {subsI.map((s, j) => (
                            <li key={j}>{s.name}</li>
                          ))}
                        </ul>
                      )}
                      {c.href && (
                        <SmartLink href={c.href} className="sd-go">
                          <span>Explore {oneLine(c.title)}</span>
                          <b aria-hidden>→</b>
                        </SmartLink>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* laptop: the stage of the chosen service */}
            <div className="sd-stage" style={{ "--ac": ACCENTS[at % ACCENTS.length] } as CSSProperties}>
              <div key={at} className="sd-card">
                <div className="sd-top">
                  <span className="sd-ico" aria-hidden>
                    <Icon className="size-6" />
                  </span>
                  <span className="sd-no" aria-hidden>
                    {pad(at + 1)}
                  </span>
                </div>
                <h3>{oneLine(card.title)}</h3>
                {card.summary && <p className="sd-sum">{card.summary}</p>}
                {subs.length > 0 && (
                  <ul className="sd-subs">
                    {subs.map((s, j) => (
                      <li key={j} style={{ "--d": `${j * 70}ms` } as CSSProperties}>
                        <b>{s.name}</b>
                        {s.desc && <span>{s.desc}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {card.href && (
                  <SmartLink href={card.href} className="sd-go">
                    <span>Explore {oneLine(card.title)}</span>
                    <b aria-hidden>→</b>
                  </SmartLink>
                )}
              </div>
              <span ref={barRef} className="sd-bar" aria-hidden>
                <i />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
