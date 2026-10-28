"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ICONS } from "./icons";
import { ACCENTS, oneLine, parseSubs, type ServiceCard } from "./service-data";
import { SmartLink } from "./smart-link";

// PHONE AND TABLET (below 1024px, owner 2026-10-29: "every section designed for the phone, as little scroll as possible"): the services of the
// home page as one row of cards that you swipe sideways (CSS scroll snap, no script for the movement). The whole card opens the page of the
// service. The counter and the dots follow the swipe; a tap on a dot brings that card in. The laptop keeps the scene of hero-scene.tsx; the
// CSS (styles/home-mobile.css, prefix hm-) shows one or the other, so nothing here runs on a laptop screen.
const pad = (n: number) => String(n).padStart(2, "0");

export function ServicesRail({ cards }: { cards: ServiceCard[] }) {
  const rowRef = useRef<HTMLOListElement>(null);
  const [at, setAt] = useState(0);
  const n = cards.length;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const first = row.firstElementChild as HTMLElement | null;
      if (!first) return;
      const step = first.offsetWidth + (parseFloat(getComputedStyle(row).columnGap) || 0);
      const end = row.scrollLeft >= row.scrollWidth - row.clientWidth - 4;
      setAt(end ? n - 1 : Math.max(0, Math.min(n - 1, Math.round(row.scrollLeft / step))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      row.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  const show = (i: number) => {
    const card = rowRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  if (n === 0) return null;
  return (
    <section className="hm-rail" aria-labelledby="hm-rail-t">
      <header className="hm-rail-head">
        <h2 id="hm-rail-t">Our services</h2>
        <p className="hm-rail-count" aria-hidden>
          <b>{pad(at + 1)}</b> / {pad(n)}
        </p>
      </header>
      <ol ref={rowRef} className="hm-rail-row">
        {cards.map((card, i) => {
          const Icon = ICONS[i % ICONS.length];
          const subs = parseSubs(card.subs);
          const title = oneLine(card.title);
          return (
            <li key={i} className="hm-card" style={{ "--ac": ACCENTS[i % ACCENTS.length] } as CSSProperties}>
              <span className="hm-card-ico" aria-hidden>
                <Icon className="size-5" />
              </span>
              <h3 className="hm-card-t">{title}</h3>
              {card.summary && <p className="hm-card-p">{card.summary}</p>}
              {subs.length > 0 && (
                <ul className="hm-card-subs">
                  {subs.map((s, j) => (
                    <li key={j}>{s.name}</li>
                  ))}
                </ul>
              )}
              {card.href && (
                <SmartLink href={card.href} className="hm-card-go">
                  <span>Explore {title}</span>
                  <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </SmartLink>
              )}
            </li>
          );
        })}
      </ol>
      <div className="hm-dots" aria-label="Choose a service">
        {cards.map((card, i) => (
          <button key={i} type="button" className="hm-dot" aria-current={at === i} aria-label={`Show ${oneLine(card.title)}`} onClick={() => show(i)} />
        ))}
      </div>
    </section>
  );
}
