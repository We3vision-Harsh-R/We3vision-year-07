"use client";

import "@/styles/modern-base.css";
import "@/styles/modern-tools.css";

import { useMemo, useState } from "react";
import { techDetail } from "@/lib/cms/content/tech-details";
import { GlowEdge } from "../glow-edge";
import { VHead, two, useCycle } from "./variant-kit";

// "Tools & technologies" in seven more designs (the first one is the planets in tech-space.tsx), one for every service page. All of them show
// the same things: the groups of technologies and for every technology the line, what you can build with it and why we use it
// (src/lib/cms/content/tech-details.ts). The look is in globals.css (.vt-*).

type P = { chip: string; heading: string; intro?: string; items: string[] };
type Group = [string, string[]];

const groupOf = (items: string[]): Group[] => {
  const m = new Map<string, string[]>();
  for (const n of items) {
    const c = techDetail(n)?.cat ?? "More tools";
    m.set(c, [...(m.get(c) ?? []), n]);
  }
  return [...m.entries()];
};
/** the "symbol" of a technology, like in a periodic table: Next.js -> Ne, Node Express -> Nx */
const sym = (n: string) => {
  const w = n.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const s = w.length > 1 ? w[0][0] + w[1][0] : (w[0] ?? n).slice(0, 2);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
const FALLBACK = (n: string) => `We use ${n} where it fits your project.`;

/** what you can build, who it is for and why we use it */
function Facts({ name, full = true }: { name: string; full?: boolean }) {
  const d = techDetail(name);
  if (!d) return <p className="vt-tag">{FALLBACK(name)} Tell us what you want to build and we will pick the right tools for it.</p>;
  return (
    <>
      <p className="vt-tag">{d.tagline}</p>
      <div className="vt-facts">
        <div>
          <b>What you can build</b>
          <ul>
            {d.builds.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        {full && (
          <div>
            <b>Great for</b>
            <div className="vt-inds">
              {d.industries.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {full && (
        <p className="vt-why">
          <b>Why we use it</b>
          {d.why}
        </p>
      )}
    </>
  );
}

/** 1: the groups are tabs, the technologies of the open group are cards */
function Tabs({ chip, heading, intro, items }: P) {
  const groups = useMemo(() => groupOf(items), [items]);
  const [g, setG] = useState(0);
  const names = groups[g]?.[1] ?? [];
  return (
    <div className="md vt vt-tabs">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vt-tb-cats" role="tablist" aria-label={chip}>
        {groups.map(([c, n], i) => (
          <button key={c} type="button" role="tab" aria-selected={i === g} data-on={i === g} data-c={i % 6} onClick={() => setG(i)}>
            {c}
            <small>{n.length}</small>
          </button>
        ))}
      </div>
      <ul key={g} className="vt-tb-grid" data-c={g % 6} role="tabpanel">
        {names.map((n, i) => {
          const d = techDetail(n);
          return (
            <li key={n} style={{ "--i": i } as React.CSSProperties}>
              <article className="vt-tb-card bglow">
                <GlowEdge />
                <span className="vt-sym">{sym(n)}</span>
                <h3>{n}</h3>
                <p>{d?.tagline ?? FALLBACK(n)}</p>
                {d && (
                  <ul>
                    {d.builds.slice(0, 3).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 2: a shelf for every group: its technologies move slowly past (and stop when the mouse is on the shelf) */
function Shelves({ chip, heading, intro, items }: P) {
  const groups = useMemo(() => groupOf(items), [items]);
  return (
    <div className="md vt vt-shelves">
      <VHead chip={chip} heading={heading} intro={intro} />
      <div className="vt-sh-rows">
        {groups.map(([c, names], k) => {
          const copies = Math.max(3, Math.ceil(9 / names.length));
          return (
            <div key={c} className="vt-sh-row" data-c={k % 6} data-rev={k % 2 === 1}>
              <span className="vt-sh-cat">
                <b>{c}</b>
                <small>
                  {names.length} {names.length === 1 ? "tool" : "tools"}
                </small>
              </span>
              <div className="vt-sh-view">
                <ul className="vt-sh-track" style={{ "--c": copies } as React.CSSProperties}>
                  {Array.from({ length: copies }).flatMap((_, r) =>
                    names.map((n) => (
                      <li key={r + n} aria-hidden={r > 0}>
                        <div className="vt-sh-pill">
                          <span className="vt-sym">{sym(n)}</span>
                          <span>
                            <b>{n}</b>
                            <small>{techDetail(n)?.tagline ?? ""}</small>
                          </span>
                        </div>
                      </li>
                    )),
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 3: a row for every group that opens and shows its technologies, one by one with the line of each */
function Accordion({ chip, heading, intro, items }: P) {
  const groups = useMemo(() => groupOf(items), [items]);
  const [open, setOpen] = useState(0);
  return (
    <div className="md vt vt-acc">
      <aside>
        <VHead chip={chip} heading={heading} intro={intro} />
      </aside>
      <div className="vt-ac-list">
        {groups.map(([c, names], i) => (
          <div key={c} className="vt-ac-item" data-open={open === i} data-c={i % 6}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{two(i + 1)}</span>
              <b>{c}</b>
              <em>
                {names.length} {names.length === 1 ? "tool" : "tools"}
              </em>
              <i aria-hidden />
            </button>
            <div className="vt-ac-body">
              <ul className="vt-ac-in">
                {names.map((n) => (
                  <li key={n}>
                    <b>{n}</b>
                    <span>{techDetail(n)?.tagline ?? FALLBACK(n)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 4: a card for every group with all of its technologies as chips; the line of the one under the mouse shows in the card */
function Matrix({ chip, heading, intro, items }: P) {
  const groups = useMemo(() => groupOf(items), [items]);
  const [hov, setHov] = useState<Record<string, string>>({});
  return (
    <div className="md vt vt-matrix">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vt-mx-grid">
        {groups.map(([c, names], k) => {
          const on = hov[c] ?? names[0];
          return (
            <article key={c} className="vt-mx-card" data-c={k % 6}>
              <header>
                <span>{two(k + 1)}</span>
                <h3>{c}</h3>
              </header>
              <div className="vt-mx-chips">
                {names.map((n) => (
                  <button key={n} type="button" data-on={n === on} onMouseEnter={() => setHov((h) => ({ ...h, [c]: n }))} onFocus={() => setHov((h) => ({ ...h, [c]: n }))} onClick={() => setHov((h) => ({ ...h, [c]: n }))}>
                    {n}
                  </button>
                ))}
              </div>
              <p key={on}>
                <b>{on}</b>
                {techDetail(on)?.tagline ?? FALLBACK(on)}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/** 5: all technologies in a list on the left, the one that is on is explained in a large panel (it goes on by itself, until you pick one) */
function Detail({ chip, heading, intro, items }: P) {
  const groups = useMemo(() => groupOf(items), [items]);
  const flat = groups.flatMap(([, n]) => n);
  const { active, pick, ref } = useCycle(flat.length, 6000);
  const name = flat[active];
  const d = techDetail(name);
  let idx = -1;
  return (
    <div ref={ref} className="md vt vt-detail">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vt-dt-grid">
        <div className="vt-dt-list">
          {groups.map(([c, names]) => (
            <div key={c}>
              <h4>{c}</h4>
              <ul>
                {names.map((n) => {
                  const i = ++idx;
                  return (
                    <li key={n}>
                      <button type="button" data-on={i === active} onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)}>
                        {n}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div key={active} className="vt-dt-panel bglow">
          <GlowEdge />
          <div className="vt-dt-top">
            <span className="vt-sym">{sym(name)}</span>
            <div>
              <h3>{name}</h3>
              <small>{d?.cat ?? "Technology"}</small>
            </div>
          </div>
          <Facts name={name} />
        </div>
      </div>
    </div>
  );
}

/** 6: the stack as a diagram: every group is a layer, the layers step down like the parts of a building */
function Layers({ chip, heading, intro, items }: P) {
  const groups = useMemo(() => groupOf(items), [items]);
  const [on, setOn] = useState<string | null>(null);
  return (
    <div className="md vt vt-layers">
      <VHead chip={chip} heading={heading} intro={intro} />
      <div className="vt-ly-stack" data-has={on !== null}>
        {groups.map(([c, names], k) => (
          <div
            key={c}
            className="vt-ly"
            data-c={k % 6}
            data-on={on === c}
            style={{ "--k": k } as React.CSSProperties}
            onMouseEnter={() => setOn(c)}
            onMouseLeave={() => setOn(null)}
          >
            <span className="vt-ly-no">{two(k + 1)}</span>
            <h3>{c}</h3>
            <ul>
              {names.map((n) => (
                <li key={n}>
                  <b>{n}</b>
                  <small>{techDetail(n)?.tagline ?? ""}</small>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 7: a table of the technologies, every one with its "symbol"; the group of the legend that is hovered lights up, the tile you pick opens below */
function Periodic({ chip, heading, intro, items }: P) {
  const groups = useMemo(() => groupOf(items), [items]);
  const flat = groups.flatMap(([c, n], k) => n.map((name) => ({ name, c, k })));
  const [sel, setSel] = useState(0);
  const [cat, setCat] = useState<string | null>(null);
  const cur = flat[Math.min(sel, flat.length - 1)];
  return (
    <div className="md vt vt-pt">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <ul className="vt-pt-legend">
        {groups.map(([c], k) => (
          <li key={c}>
            <button type="button" data-c={k % 6} data-on={cat === c} onMouseEnter={() => setCat(c)} onMouseLeave={() => setCat(null)} onFocus={() => setCat(c)} onBlur={() => setCat(null)}>
              <i aria-hidden />
              {c}
            </button>
          </li>
        ))}
      </ul>
      <ul className="vt-pt-grid" data-has={cat !== null}>
        {flat.map((t, i) => (
          <li key={t.name}>
            <button
              type="button"
              className="vt-pt-tile"
              data-c={t.k % 6}
              data-on={i === sel}
              data-dim={cat !== null && cat !== t.c}
              onClick={() => setSel(i)}
              onMouseEnter={() => setSel(i)}
              onFocus={() => setSel(i)}
            >
              <em>{two(i + 1)}</em>
              <span className="vt-pt-sym">{sym(t.name)}</span>
              <b>{t.name}</b>
            </button>
          </li>
        ))}
      </ul>
      {cur && (
        <div key={cur.name} className="vt-pt-bar" data-c={cur.k % 6}>
          <div className="vt-pt-bar-h">
            <span className="vt-sym">{sym(cur.name)}</span>
            <div>
              <h3>{cur.name}</h3>
              <small>{cur.c}</small>
            </div>
          </div>
          <div className="vt-pt-bar-b">
            <Facts name={cur.name} full={false} />
          </div>
        </div>
      )}
    </div>
  );
}

/** the design of the page: 1..7 (0 is the planets, tech-space.tsx) */
export function ToolsVariant({ variant, ...p }: P & { variant: number }) {
  if (p.items.length === 0) return null;
  switch (variant) {
    case 1:
      return <Tabs {...p} />;
    case 2:
      return <Shelves {...p} />;
    case 3:
      return <Accordion {...p} />;
    case 4:
      return <Matrix {...p} />;
    case 5:
      return <Detail {...p} />;
    case 6:
      return <Layers {...p} />;
    default:
      return <Periodic {...p} />;
  }
}
