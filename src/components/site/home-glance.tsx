"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Fact = { value: string; label: string };
type Badge = { label: string; image: string };

// "AT A GLANCE" of the home page (owner's reference: a dark panel with glass number tiles in rows that run sideways, the last row fading away).
// The facts come from the CMS (Admin > Pages > Home > At a glance). Every number counts up once when the panel comes on the screen (a CSS integer
// property, see styles/home-intro.css), the rows run sideways only while the panel is on the screen, and nothing moves with "reduce motion".

/** "300+" -> prefix "", number 300, suffix "+"; a value without a number stays as it is */
function split(v: string) {
  const m = /^(\D*)(\d+)(\D*)$/.exec(v.trim());
  return m ? { pre: m[1], n: Number(m[2]), post: m[3] } : null;
}

function Tile({ f, hidden }: { f: Fact; hidden?: boolean }) {
  const s = split(f.value);
  return (
    <li className="hgn-tile" aria-hidden={hidden || undefined}>
      {s ? (
        <>
          <b className="hgn-num" style={{ "--to": s.n } as CSSProperties}>
            {s.pre}
            <u />
            {s.post}
          </b>
          <span className="sr-only">{f.value}</span>
        </>
      ) : (
        <b className="hgn-num hgn-txt">{f.value}</b>
      )}
      <em>{f.label}</em>
    </li>
  );
}

export function HomeGlance({ chip, facts, badges }: { chip: string; facts: Fact[]; badges: Badge[] }) {
  const root = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [counted, setCounted] = useState(false);
  const logos = badges.filter((b) => b.image);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setSeen(e.isIntersecting);
        if (e.isIntersecting) setCounted(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // three rows: the same tiles in another order, so the rows do not look the same; every row is shown twice side by side for the endless run
  const list = facts.slice(0, 6);
  const rot = (k: number) => list.map((_, i) => list[(i + k) % list.length]);
  const rows = [list, rot(2), rot(4)];

  return (
    <section ref={root} className="hgn" data-play={seen} data-count={counted} aria-label={chip || "At a glance"}>
      <div className="hgn-card">
        <header className="hgn-head">
          {chip && <p className="hgn-chip">{chip}</p>}
          <h2>
            Seven years of work, <span>in numbers</span>
          </h2>
        </header>

        <div className="hgn-rows">
          {rows.map((r, ri) => (
            <div key={ri} className={`hgn-row is-${ri}`}>
              <ul className="hgn-track">
                {[0, 1].map((copy) =>
                  r.map((f, i) => <Tile key={`${copy}-${i}`} f={f} hidden={ri > 0 || copy > 0} />),
                )}
              </ul>
            </div>
          ))}
        </div>

        {logos.length > 0 && (
          <div className="hgn-rec">
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
    </section>
  );
}
