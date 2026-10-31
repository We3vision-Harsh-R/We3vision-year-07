"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Fact = { value: string; label: string };
type Badge = { label: string; image: string };

// "AT A GLANCE" of the home page: two flat (2D) rows of frosted glass tiles that drift sideways.
//   top row     the numbers of the company: the facts of the CMS (Admin > Pages > Home > At a glance) + three more true facts from the Team page
//   bottom row  the years 2019-2026 (the journey of the About page)
// A tile shows only its big number / year. What it means (the label, the milestone) is hidden until the cursor is on the tile: then the row stops, the
// tile glows and the text slides in. The numbers count up once when the panel comes on the screen (a CSS integer property, see home-intro.css).
// Nothing moves with "reduce motion". Content is only what the site already says elsewhere.

const MORE: Fact[] = [
  { value: "2", label: "Offices: Surat and Marburg" },
  { value: "6", label: "Departments, one team" },
  { value: "2", label: "Government VR projects" },
];
const YEARS: Fact[] = [
  { value: "2019", label: "Founded in Surat, Gujarat, with a vision to deliver innovative and customer-focused IT solutions." },
  { value: "2020", label: "Expanded core services to web and app design and development." },
  { value: "2021", label: "Introduced AR and VR solutions, stepping into immersive technology." },
  { value: "2022", label: "Launched metaverse solutions and grew a specialized team." },
  { value: "2023", label: "Scaled AR/VR pilots and boosted UI/UX with new prototypes." },
  { value: "2024", label: "Delivered diverse VR projects in construction, real estate and mining." },
  { value: "2025", label: "Focused on metaverse, game development, graphic design and animation." },
  { value: "2026", label: "Started building our own SaaS product, expanding our solutions into scalable software." },
];

/** "300+" -> prefix "", number 300, suffix "+"; a value without a number stays as it is */
function split(v: string) {
  const m = /^(\D*)(\d+)(\D*)$/.exec(v.trim());
  return m ? { pre: m[1], n: Number(m[2]), post: m[3] } : null;
}

function Tile({ f, kind, hidden }: { f: Fact; kind: "num" | "yr"; hidden?: boolean }) {
  const s = kind === "num" ? split(f.value) : null;
  return (
    <li className={`hgn-tile is-${kind}`} aria-hidden={hidden || undefined}>
      <b className="hgn-num" style={s ? ({ "--to": s.n } as CSSProperties) : undefined}>
        {s ? (
          <>
            {s.pre}
            <u />
            {s.post}
          </>
        ) : (
          f.value
        )}
      </b>
      {s && <span className="sr-only">{f.value}</span>}
      <em>{f.label}</em>
      <i className="hgn-glow" aria-hidden />
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

  const nums = [...facts.slice(0, 6), ...MORE];

  return (
    <section ref={root} className="hgn" data-play={seen} data-count={counted} aria-label={chip || "At a glance"}>
      <div className="hgn-card">
        <header className="hgn-head">
          {chip && <p className="hgn-chip">{chip}</p>}
          <h2>
            Our numbers, <span>our journey since 2019</span>
          </h2>
        </header>

        <div className="hgn-rows">
          <div className="hgn-row is-0">
            <ul className="hgn-track">
              {[0, 1].map((copy) => nums.map((f, i) => <Tile key={`${copy}-${i}`} f={f} kind="num" hidden={copy > 0} />))}
            </ul>
          </div>
          <div className="hgn-row is-1">
            <ul className="hgn-track">
              {[0, 1].map((copy) => YEARS.map((f, i) => <Tile key={`${copy}-${i}`} f={f} kind="yr" hidden={copy > 0} />))}
            </ul>
          </div>
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
