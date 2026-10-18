"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";

/** the interactive parts of /seo: climb the search results by switching on the services, and pick an industry to see its search result */

type Svc = { title: string; text: string; more: ReactNode };

/**
 * The toy of the marketing pages, made to fit ONE screen: a small stage on top (search results, an ad, or a shop front) and the services as switches in
 * two columns under it. Every switch you turn on adds to the stage (SEO: the website climbs one place; Meta: the ad card gets built piece by piece;
 * Physical: the shop front gets its sign, banner, poster, box ...) and fills the bar. The sentence of the service you touched appears under the stage.
 * Every service and all its words are in the page as text (the long details are in a list under the toy).
 */
export type Kind = "serp" | "ad" | "shop";
const PIECES = 7;

export function Climb({ items, kind, you, now, bar }: { items: Svc[]; kind: Kind; you: string; now: string; bar: string }) {
  const n = items.length;
  const [on, setOn] = useState<boolean[]>(() => items.map(() => false));
  const k = on.filter(Boolean).length;
  const pos = n + 1 - k;
  const shown = Math.ceil((k * PIECES) / n);
  const rows = n + 1;
  const flip = (i: number) => { setOn((o) => o.map((v, j) => (j === i ? !v : v))); };
  return (
    <div className="mp-seo-climb" style={{ "--dl": n > 6 ? 1 : 2 } as CSSProperties}>
      <div className="mp-seo-head" aria-live="polite">
        {kind === "serp" ? <p className="mp-seo-rank"><span>{now}</span><b key={pos}>#{pos}</b></p> : <p className="mp-seo-rank"><span>{now}</span><b key={k}>{k}/{n}</b></p>}
        <div className="mp-seo-bar" role="img" aria-label={`${bar}: ${k} / ${n}`}><i style={{ "--k": k / n } as CSSProperties} /></div>
      </div>

      {kind === "serp" && (
        <div className="mp-seo-serp" style={{ "--rows": rows } as CSSProperties} aria-hidden="true">
          {Array.from({ length: rows }, (_, r) => {
            const mine = r === 0;
            const place = mine ? pos : r < pos ? r : r + 1;
            return (
              <div key={r} className={`mp-seo-row${mine ? " is-me" : ""}`} style={{ "--y": place - 1, "--w": 54 + ((r * 17) % 36) } as CSSProperties}>
                <em>{place}</em>
                <span>{mine ? <b>{you}</b> : <u className="t" />}</span>
              </div>
            );
          })}
        </div>
      )}

      {kind === "ad" && (
        <div className="mp-mk-ad" aria-hidden="true">
          <div className={`mp-mk-p mp-mk-ad-h${shown >= 1 ? " is-on" : ""}`}><i /><span><u /><u /></span></div>
          <div className={`mp-mk-p mp-mk-ad-img${shown >= 2 ? " is-on" : ""}`} />
          <div className={`mp-mk-p mp-mk-ad-t${shown >= 3 ? " is-on" : ""}`}><u /></div>
          <div className={`mp-mk-p mp-mk-ad-t${shown >= 4 ? " is-on" : ""}`}><u className="s" /></div>
          <div className={`mp-mk-p mp-mk-ad-cta${shown >= 5 ? " is-on" : ""}`}><s /></div>
          <div className={`mp-mk-p mp-mk-ad-re${shown >= 6 ? " is-on" : ""}`}><i /><i /><i /></div>
          <div className={`mp-mk-p mp-mk-ad-au${shown >= 7 ? " is-on" : ""}`}><i /><i /><i /></div>
        </div>
      )}

      {kind === "shop" && (
        <div className="mp-mk-shop" aria-hidden="true">
          <div className={`mp-mk-p mp-mk-sign${shown >= 1 ? " is-on" : ""}`}><u /></div>
          <div className={`mp-mk-p mp-mk-awn${shown >= 2 ? " is-on" : ""}`}><i /><i /><i /><i /><i /></div>
          <div className="mp-mk-wall">
            <div className={`mp-mk-p mp-mk-poster${shown >= 3 ? " is-on" : ""}`}><u /><u /></div>
            <div className="mp-mk-win" />
            <div className="mp-mk-door" />
            <div className={`mp-mk-p mp-mk-stand${shown >= 4 ? " is-on" : ""}`}><u /></div>
          </div>
          <div className={`mp-mk-p mp-mk-box${shown >= 5 ? " is-on" : ""}`} />
          <div className={`mp-mk-p mp-mk-flag${shown >= 6 ? " is-on" : ""}`} />
          <div className={`mp-mk-p mp-mk-van${shown >= 7 ? " is-on" : ""}`}><i /><i /></div>
        </div>
      )}

      <ul className="mp-seo-list">
        {items.map((s, i) => (
          <li key={i} className="ma-rvx" style={{ "--rv-d": `${i * 50}ms` } as CSSProperties}>
            <div className="mp-seo-sw-r">
              <span>
                <b>{s.title}</b>
                <small>{s.text}</small>
              </span>
              <button type="button" role="switch" aria-checked={on[i]} aria-label={s.title} onClick={() => flip(i)}>
                <i aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ul className="mp-seo-det">
        {items.map((s, i) =>
          s.more ? (
            <li key={i}>
              <details className="mp-seo-moreof">
                <summary>
                  <span>{s.title}</span>
                  <i aria-hidden="true" />
                </summary>
                {s.more}
              </details>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}

/** Pick an industry: its search result appears (title = the industry, text = the line from the page) */
export function SeoIndustries({ items, plain }: { items: { name: string; description: string }[]; plain?: boolean }) {
  const [k, setK] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const n = items.length;
  const go = (i: number, focus = false) => {
    const j = (i + n) % n;
    setK(j);
    const b = row.current?.children[j] as HTMLElement | undefined;
    b?.scrollIntoView({ inline: "center", block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (focus) b?.focus({ preventScroll: true });
  };
  const it = items[k];
  return (
    <div className="mp-seo-ind">
      <div ref={row} className="mp-seo-tabs" role="tablist" aria-label="Industries">
        {items.map((x, i) => (
          <button key={x.name} type="button" role="tab" aria-selected={i === k} tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => go(i)} onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); } if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); } }}>
            {x.name}
          </button>
        ))}
      </div>
      <div key={k} className="mp-seo-snip" role="tabpanel">
        {!plain && <p className="mp-seo-url"><i aria-hidden="true" />we3vision.com</p>}
        <h3>{it.name}</h3>
        <p>{it.description}</p>
      </div>
      <ul className="ma-sr">
        {items.map((x) => (
          <li key={x.name}>{x.name}: {x.description}</li>
        ))}
      </ul>
    </div>
  );
}
