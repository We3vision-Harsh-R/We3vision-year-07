"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { IcChevron, IcChevronLeft } from "../../../app/icons";
import { useCalm } from "../../../app/use-calm";

/** centre a capsule in its sideways row without moving the page up or down (scrollIntoView could jump the page while you read) */
function centre(row: HTMLElement | null, j: number, smooth: boolean) {
  const b = row?.children[j] as HTMLElement | undefined;
  if (!row || !b) return;
  row.scrollTo({ left: b.offsetLeft - (row.clientWidth - b.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" });
}

/** the interactive parts of /software-development-services: pick a service, pick an industry */

/** a row of service names (a segmented picker that scrolls sideways); the one you pick opens below it with a soft crossfade */
export function ServicePicker({ tabs, panels, label }: { tabs: string[]; panels: ReactNode[]; label: string }) {
  const [k, setK] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const pick = (i: number, focus = false) => {
    const j = Math.max(0, Math.min(tabs.length - 1, i));
    setK(j);
    centre(row.current, j, !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (focus) (row.current?.children[j] as HTMLElement | undefined)?.focus({ preventScroll: true });
  };
  const key = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick(i - 1, true); }
  };
  return (
    <div className="mp-sw-pick">
      <div ref={row} className="mp-sw-tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button key={t} type="button" role="tab" id={`sw-t-${i}`} aria-selected={i === k} aria-controls="sw-panel" tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
            {t}
          </button>
        ))}
      </div>
      <div key={k} id="sw-panel" role="tabpanel" aria-labelledby={`sw-t-${k}`} className="mp-sw-panel">
        {panels[k]}
      </div>
    </div>
  );
}

/**
 * "Software for every industry": pick an industry and a small app of that kind builds itself on a glass phone (a header, then a dashboard, a grid or a
 * list, depending on the industry; only shapes, no figures), with the name, one line of text and a button to talk about it. It moves on by itself
 * once round while it is on the screen and stops as soon as you touch it.
 */
export function IndustryStage({ items }: { items: { name: string; description: string }[] }) {
  const calm = useCalm();
  const box = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  const [touched, setTouched] = useState(false);
  const n = items.length;
  const go = (i: number, focus = false) => {
    const j = (i + n) % n;
    setTouched(true);
    setK(j);
    centre(row.current, j, !calm);
    if (focus) (row.current?.children[j] as HTMLElement | undefined)?.focus({ preventScroll: true });
  };
  const key = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); }
  };
  useEffect(() => {
    const el = box.current;
    if (!el || calm || touched || n < 2) return;
    let t = 0;
    let seen = false;
    let laps = 0;
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; }, { threshold: 0.6 });
    io.observe(el);
    t = window.setInterval(() => {
      if (!seen) return;
      laps += 1;
      if (laps >= n) { window.clearInterval(t); return; }
      setK((cur) => {
        const j = (cur + 1) % n;
        centre(row.current, j, true);
        return j;
      });
    }, 4200);
    return () => { io.disconnect(); window.clearInterval(t); };
  }, [calm, touched, n]);
  const it = items[k];
  const v = k % 3;
  return (
    <div ref={box} className="mp-sw-ind" style={{ "--o": k * 47 } as CSSProperties}>
      <div ref={row} className="mp-sw-tabs" role="tablist" aria-label="Industries">
        {items.map((x, i) => (
          <button key={x.name} type="button" role="tab" aria-selected={i === k} tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => go(i)} onKeyDown={(e) => key(e, i)}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="mp-sw-phone" aria-hidden="true">
        <div className="mp-sw-bar">
          <i />
          <span key={k}>{it.name}</span>
        </div>
        <div key={k} className={`mp-sw-screen is-v${v}`}>
          {v === 0 && (
            <>
              <div className="mp-sw-stats">
                {[0, 1, 2].map((s) => (<b key={s} style={{ "--i": s } as CSSProperties}><i /><u /></b>))}
              </div>
              <div className="mp-sw-chart">
                {[46, 70, 38, 86, 60, 94, 72].map((h, s) => (<em key={s} style={{ "--h": h + "%", "--i": s } as CSSProperties} />))}
              </div>
            </>
          )}
          {v === 1 && (
            <div className="mp-sw-grid">
              {Array.from({ length: 6 }, (_, s) => (<b key={s} style={{ "--i": s } as CSSProperties}><i /><u /></b>))}
            </div>
          )}
          {v === 2 && (
            <div className="mp-sw-list">
              {Array.from({ length: 4 }, (_, s) => (<p key={s} style={{ "--i": s } as CSSProperties}><i /><span><u /><u /></span><s /></p>))}
            </div>
          )}
        </div>
      </div>
      <div key={"t" + k} className="mp-sw-ind-t">
        <h3>{it.name}</h3>
        <p>{it.description}</p>
        <a href="#contact" className="ma-btn ma-btn-md ma-btn-fill">Talk about it</a>
      </div>
      <div className="mp-sw-ind-n" aria-hidden="true">
        <button type="button" tabIndex={-1} onClick={() => go(k - 1)} aria-label="Previous industry"><IcChevronLeft /></button>
        <span>{k + 1} / {n}</span>
        <button type="button" tabIndex={-1} onClick={() => go(k + 1)} aria-label="Next industry"><IcChevron /></button>
      </div>
    </div>
  );
}
