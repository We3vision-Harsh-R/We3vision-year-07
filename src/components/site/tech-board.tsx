"use client";

import { useMemo, useState } from "react";
import { techDetail } from "@/lib/cms/content/tech-details";

// THE TECHNOLOGY OF THE HOME PAGE (redesign 2026-11-04): a board you can play with. Across the top the groups (front end, back end, mobile, ...),
// under them one tile for every technology; choosing a group filters the tiles, pointing at (or tapping) a tile opens it on the right: what it is,
// what we build with it, which businesses it suits and why we use it. On a phone the tiles are two columns and the detail comes under them.
// The words are the ones of tech-details.ts: nothing is invented here. Theme colours only; tiles light up under the pointer and the card writes itself in.
const initials = (name: string) => {
  const w = name.replace(/\.js$/i, "").split(/[\s./&-]+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : name.slice(0, 2)).toUpperCase();
};

export function TechBoard({ items }: { items: string[] }) {
  const groups = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const name of items) {
      const cat = techDetail(name)?.cat ?? "More tools";
      m.set(cat, [...(m.get(cat) ?? []), name]);
    }
    return [...m.entries()];
  }, [items]);
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState(groups[0]?.[1][0] ?? "");
  const names = cat === "All" ? groups.flatMap(([, l]) => l) : (groups.find(([c]) => c === cat)?.[1] ?? []);
  const d = techDetail(sel);
  const chooseCat = (c: string) => {
    setCat(c);
    setSel((c === "All" ? groups[0]?.[1][0] : groups.find(([g]) => g === c)?.[1][0]) ?? "");
  };

  return (
    <div className="tb">
      <div className="tb-tabs" role="tablist" aria-label="Technology groups">
        <button type="button" role="tab" aria-selected={cat === "All"} data-on={cat === "All"} onClick={() => chooseCat("All")}>
          All
          <sup>{items.length}</sup>
        </button>
        {groups.map(([c, list]) => (
          <button key={c} type="button" role="tab" aria-selected={cat === c} data-on={cat === c} onClick={() => chooseCat(c)}>
            {c}
            <sup>{list.length}</sup>
          </button>
        ))}
      </div>
      <div className="tb-body">
        <ul
          className="tb-tiles"
          role="tablist"
          aria-label="Technologies"
          key={cat}
          onPointerMove={(e) => {
            const b = (e.target as HTMLElement).closest("button");
            if (!b) return;
            const r = b.getBoundingClientRect();
            b.style.setProperty("--mx", `${e.clientX - r.left}px`);
            b.style.setProperty("--my", `${e.clientY - r.top}px`);
          }}
        >
          {names.map((name, i) => (
            <li key={name} style={{ "--i": i } as React.CSSProperties}>
              <button type="button" role="tab" aria-selected={sel === name} data-on={sel === name} onPointerEnter={(e) => e.pointerType === "mouse" && setSel(name)} onClick={() => setSel(name)} onFocus={() => setSel(name)}>
                <i aria-hidden>{initials(name)}</i>
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ul>
        <article key={sel} className="tb-detail" role="tabpanel">
          <span className="tb-ghost" aria-hidden>
            {initials(sel)}
          </span>
          <p className="tb-cat">{d?.cat ?? cat}</p>
          <h3>{sel}</h3>
          {d ? (
            <>
              <p className="tb-tag">{d.tagline}</p>
              <b className="tb-l">What we build</b>
              <ul className="tb-builds">
                {d.builds.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <b className="tb-l">Great for</b>
              <p className="tb-inds">
                {d.industries.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </p>
              <p className="tb-why">{d.why}</p>
            </>
          ) : (
            <p className="tb-tag">We use {sel} where it fits your project. Tell us what you want to build and we will pick the right tools for it.</p>
          )}
        </article>
      </div>
    </div>
  );
}
