"use client";
/* eslint-disable @next/next/no-img-element -- article pictures are links from the admin panel (Blog), like the kit's <Pic> */

import { useRef, useState } from "react";
import { AppLink } from "../../../app/link";
import { openShare } from "../../../app/share-sheet";

/** the interactive parts of /blog (and the Share button of an article or a project) */

export type BlogStory = { key: string; title: string; category: string; image: string; href: string; summary?: string; date?: string };

const STEP = 8;

/**
 * Apple News "For You": a row of topics (a segmented picker that scrolls sideways, All first), the newest article of the topic as the top story
 * and the others as headline rows with a picture on the right. The list swaps with a soft crossfade; "Show more" adds eight at a time.
 */
export function BlogBrowser({ stories, topics = true, labels = { all: "All", more: "Show more articles", empty: "New articles will appear here soon." } }: { stories: BlogStory[]; topics?: boolean; labels?: { all: string; more: string; empty: string } }) {
  const cats = [labels.all, ...Array.from(new Set(stories.map((s) => s.category).filter((c) => c && c !== labels.all)))];
  const [k, setK] = useState(0);
  const [shown, setShown] = useState(STEP);
  const row = useRef<HTMLDivElement>(null);
  const all = k === 0;
  const cat = cats[k] ?? labels.all;
  const list = all ? stories : stories.filter((s) => s.category === cat);
  const [top, ...rest] = list;
  const more = rest.length - shown;
  const pick = (i: number, focus = false) => {
    const j = Math.max(0, Math.min(cats.length - 1, i));
    setK(j);
    setShown(STEP);
    const b = row.current?.children[j] as HTMLElement | undefined;
    b?.scrollIntoView({ inline: "center", block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (focus) b?.focus({ preventScroll: true });
  };
  const key = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick(i - 1, true); }
    if (e.key === "Home") { e.preventDefault(); pick(0, true); }
    if (e.key === "End") { e.preventDefault(); pick(cats.length - 1, true); }
  };
  if (stories.length === 0) return <p className="mp-blog-empty">{labels.empty}</p>;
  return (
    <div className="mp-blog-br">
      {topics && cats.length > 2 && (
        <div ref={row} className="mp-blog-tabs" role="tablist" aria-label="Topics">
          {cats.map((c, i) => (
            <button key={c} type="button" role="tab" id={`blog-t-${i}`} aria-selected={i === k} aria-controls="blog-panel" tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div key={cat} id="blog-panel" role={topics && cats.length > 2 ? "tabpanel" : undefined} aria-labelledby={topics && cats.length > 2 ? `blog-t-${k}` : undefined} className="mp-blog-panel">
        {top && (
          <AppLink href={top.href} className="mp-blog-top">
            <span className="mp-blog-pic">{top.image ? <img src={top.image} alt={top.title} loading="lazy" decoding="async" /> : null}</span>
            <span className="mp-blog-tb">
              {top.category && <span className="mp-blog-cat">{top.category}</span>}
              <span className="mp-blog-tt">{top.title}</span>
              {top.summary && <span className="mp-blog-sum">{top.summary}</span>}
              {top.date && <span className="mp-blog-date">{top.date}</span>}
            </span>
          </AppLink>
        )}
        {rest.length > 0 && (
          <ul className="mp-blog-list">
            {rest.slice(0, shown).map((s) => (
              <li key={s.key}>
                <AppLink href={s.href} className="mp-blog-row">
                  <span className="mp-blog-rb">
                    {s.category && all && <span className="mp-blog-cat">{s.category}</span>}
                    <span className="mp-blog-rt">{s.title}</span>
                    {s.date && <span className="mp-blog-date">{s.date}</span>}
                  </span>
                  <span className="mp-blog-th">{s.image ? <img src={s.image} alt="" loading="lazy" decoding="async" /> : null}</span>
                </AppLink>
              </li>
            ))}
          </ul>
        )}
        {more > 0 && (
          <button type="button" className="mp-blog-more" onClick={() => setShown((n) => n + STEP)}>
            {labels.more} <span>{more}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/** a round glass Share button: opens the iOS share sheet of the app (Messages, Mail, WhatsApp, Copy) for this page */
export function ShareButton({ title, glyph, off, label = "Share" }: { title: string; glyph?: string; off?: number; label?: string }) {
  return (
    <button type="button" className="mp-dt-share" onClick={() => openShare({ title, subtitle: window.location.host, url: window.location.href, glyph, off })}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
        <path d="M8 10.5H6.5A1.5 1.5 0 0 0 5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5H16" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
