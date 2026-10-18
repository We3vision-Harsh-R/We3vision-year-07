"use client";
/* eslint-disable @next/next/no-img-element -- project pictures are uploads / links from the admin panel (Projects), like the kit's <Pic> */

import { useState } from "react";
import { AppLink } from "../../../app/link";

/** the interactive part of /portfolio: Photos albums that filter the grid */

export type PfItem = { id: string; slug: string; title: string; category: string; cover: string };

const STEP = 12;

function Photo({ p, big }: { p: PfItem; big?: boolean }) {
  return (
    <AppLink href={"/portfolio/" + p.slug} className={big ? "mp-pf-ph is-big" : "mp-pf-ph"}>
      {p.cover ? <img src={p.cover} alt={p.title} loading="lazy" decoding="async" /> : <span className="mp-pf-ph-l" aria-hidden="true">{p.title.trim().charAt(0).toUpperCase()}</span>}
      <span className="mp-pf-cap">
        <span className="mp-pf-ct">{p.title}</span>
        {big && p.category && <span className="mp-pf-cc">{p.category}</span>}
      </span>
    </AppLink>
  );
}

/**
 * Apple Photos: a row of albums (All first, then one per category, with a cover and a count) works as a filter; the grid below shows the
 * album you pick (edge to edge, thin gaps, the first picture large) and swaps with a soft crossfade. "Show more" adds twelve at a time.
 */
export function PortfolioBrowser({ items }: { items: PfItem[] }) {
  const albums: { name: string; list: PfItem[] }[] = [{ name: "All", list: items }];
  for (const p of items) {
    if (!p.category) continue;
    const a = albums.find((x) => x.name === p.category) ?? albums[albums.push({ name: p.category, list: [] }) - 1];
    a.list.push(p);
  }
  const [k, setK] = useState(0);
  const [shown, setShown] = useState(STEP);
  const cur = albums[k] ?? albums[0];
  const list = cur.list.slice(0, shown);
  const more = cur.list.length - list.length;
  const pick = (i: number) => {
    setK(i);
    setShown(STEP);
  };
  return (
    <div className="mp-pf-br">
      {albums.length > 2 && (
        <ul className="mp-pf-albums" aria-label="Albums">
          {albums.map((a, i) => (
            <li key={a.name}>
              <button type="button" className={i === k ? "mp-pf-album is-on" : "mp-pf-album"} aria-pressed={i === k} onClick={() => pick(i)}>
                <span className="mp-pf-ac">{a.list[0]?.cover ? <img src={a.list[0].cover} alt="" loading="lazy" decoding="async" /> : <span aria-hidden="true">{a.name.charAt(0).toUpperCase()}</span>}</span>
                <span className="mp-pf-an">{a.name}</span>
                <span className="mp-pf-aq">{a.list.length}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div key={cur.name} className="mp-pf-panel" aria-live="polite">
        {albums.length > 2 && <p className="mp-pf-gh">{cur.name === "All" ? "All projects" : cur.name}</p>}
        <div className="mp-pf-grid">
          {list.map((p, i) => (
            <Photo key={p.id} p={p} big={i === 0 && cur.list.length > 2} />
          ))}
        </div>
        {more > 0 && (
          <button type="button" className="mp-pf-more" onClick={() => setShown((n) => n + STEP)}>
            Show more projects <span>{more}</span>
          </button>
        )}
      </div>
    </div>
  );
}
