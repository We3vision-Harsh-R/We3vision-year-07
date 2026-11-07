"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { SmartLink } from "@/components/site/smart-link";

// The Portfolio page of Home 2: category chips (with the number of projects) and the projects as a masonry of tall and short cards, like a board of
// pins. Every card opens the project page of the site (/portfolio/slug). Only real projects (Admin > Projects) are shown.
export type Pin = { id: string; slug: string; title: string; category: string; summary: string; cover: string };

const OTHER = "Other";
const HEIGHTS = [300, 380, 340, 420, 320, 360]; // image heights in px, repeated, so the columns are uneven like a board

export function Home2Portfolio({ projects }: { projects: Pin[] }) {
  const [cat, setCat] = useState("All");
  const cats = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of projects) {
      const c = p.category.trim() || OTHER;
      m.set(c, (m.get(c) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);
  const list = cat === "All" ? projects : projects.filter((p) => (p.category.trim() || OTHER) === cat);

  if (projects.length === 0) {
    return (
      <p className="hb2-pf-empty" data-r>
        The projects will show here as soon as they are published in the admin panel.
      </p>
    );
  }
  return (
    <>
      <div className="hb2-pf-chips" role="group" aria-label="Filter projects by category">
        {[["All", projects.length] as const, ...cats].map(([c, n]) => (
          <button key={c} type="button" className="hb2-pf-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
            <b>{n}</b>
          </button>
        ))}
      </div>
      <div className="hb2-pf-board" key={cat}>
        {list.map((p, i) => (
          <SmartLink key={p.id} href={`/portfolio/${p.slug}`} className="hb2-pf-pin" style={{ "--h": `${HEIGHTS[i % HEIGHTS.length]}px`, "--i": i % 9 } as CSSProperties}>
            <span className="hb2-pf-img">
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt={p.title} loading="lazy" decoding="async" />
              ) : (
                <i aria-hidden>{p.title.slice(0, 1)}</i>
              )}
            </span>
            <span className="hb2-pf-cap">
              {p.category && <small>{p.category}</small>}
              <strong>{p.title}</strong>
              {p.summary && <span>{p.summary}</span>}
            </span>
          </SmartLink>
        ))}
      </div>
    </>
  );
}
