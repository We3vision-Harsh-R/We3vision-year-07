"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

/** the interactive part of /contact: an iOS segmented control (a glass thumb slides under the picked segment) that switches how to reach us */
export function Segmented({ tabs, panels, label }: { tabs: string[]; panels: ReactNode[]; label: string }) {
  const [k, setK] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const n = tabs.length;
  const pick = (i: number, focus = false) => {
    const j = (i + n) % n;
    setK(j);
    if (focus) (row.current?.children[j + 1] as HTMLElement | undefined)?.focus();
  };
  const key = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick(i - 1, true); }
  };
  return (
    <div className="mp-con-pick">
      <div ref={row} className="mp-con-seg" role="tablist" aria-label={label} style={{ "--n": n, "--k": k } as CSSProperties}>
        <span className="mp-con-thumb" aria-hidden="true" />
        {tabs.map((t, i) => (
          <button key={t} type="button" role="tab" id={`con-t-${i}`} aria-selected={i === k} aria-controls={`con-p-${i}`} tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
            {t}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={i} id={`con-p-${i}`} role="tabpanel" aria-labelledby={`con-t-${i}`} hidden={i !== k} className="mp-con-panel">
          {p}
        </div>
      ))}
    </div>
  );
}
