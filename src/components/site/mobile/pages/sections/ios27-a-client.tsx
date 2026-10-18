"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

// The interactive parts of the shared iOS 27 sections (prefix "ma-ia-"). Every panel stays in the page (hidden ones use `hidden`), so search
// engines and screen readers still read all the words; the picker only chooses which one is on the screen.

const calm = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** a row of names (a segmented picker that scrolls sideways); the one you pick opens below it with a soft crossfade. Arrow keys move. */
export function IaPicker({ tabs, panels, label }: { tabs: string[]; panels: ReactNode[]; label: string }) {
  const [k, setK] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const uid = useId();
  const pick = (i: number, focus = false) => {
    const j = Math.max(0, Math.min(tabs.length - 1, i));
    setK(j);
    const b = row.current?.children[j] as HTMLElement | undefined;
    b?.scrollIntoView({ inline: "center", block: "nearest", behavior: calm() ? "auto" : "smooth" });
    if (focus) b?.focus({ preventScroll: true });
  };
  const key = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick(i - 1, true); }
    if (e.key === "Home") { e.preventDefault(); pick(0, true); }
    if (e.key === "End") { e.preventDefault(); pick(tabs.length - 1, true); }
  };
  return (
    <div className="ma-ia-pick">
      <div ref={row} className="ma-ia-tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button key={i} type="button" role="tab" id={`${uid}-t${i}`} aria-selected={i === k} aria-controls={`${uid}-p${i}`} tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : undefined} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
            {t}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={i} id={`${uid}-p${i}`} role="tabpanel" aria-labelledby={`${uid}-t${i}`} hidden={i !== k} className="ma-ia-panel">
          {p}
        </div>
      ))}
    </div>
  );
}

/** a two-part segmented control (iOS "Before | After"): every row swaps its words with a small crossfade */
export function IaSwap({ labels, rows }: { labels: [string, string]; rows: { a: ReactNode; b: ReactNode }[] }) {
  const [on, setOn] = useState(0);
  const uid = useId();
  const key = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); setOn((v) => 1 - v); }
  };
  return (
    <div className="ma-ia-swap" data-on={on}>
      <div className="ma-ia-seg" role="tablist" aria-label={`${labels[0]} / ${labels[1]}`}>
        <i aria-hidden="true" />
        {labels.map((l, i) => (
          <button key={i} type="button" role="tab" id={`${uid}-s${i}`} aria-selected={on === i} aria-controls={`${uid}-l`} tabIndex={on === i ? 0 : -1} onClick={() => setOn(i)} onKeyDown={key}>
            {l}
          </button>
        ))}
      </div>
      <ol id={`${uid}-l`} role="tabpanel" aria-labelledby={`${uid}-s${on}`} className="ma-ia-swapl">
        {rows.map((r, i) => (
          <li key={i}>
            <span className="ma-ia-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="ma-ia-sw">
              <span className="ma-ia-a" aria-hidden={on !== 0}>{r.a}</span>
              <span className="ma-ia-b" aria-hidden={on !== 1}>{r.b}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
