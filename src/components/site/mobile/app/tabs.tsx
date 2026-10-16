"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * Tabs: a row of capsules that scrolls sideways and one panel below. Every panel is in the page (the inactive ones are `hidden`),
 * so the text is always readable by search engines and screen readers. Arrow keys move between tabs.
 */
export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [on, setOn] = useState(0);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    const n = (next + tabs.length) % tabs.length;
    setOn(n);
    refs.current[n]?.focus();
  };

  return (
    <div>
      <div className="ma-tabbar" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.label + i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={on === i}
            aria-controls={`${uid}-p${i}`}
            tabIndex={on === i ? 0 : -1}
            className="ma-tab"
            onClick={() => setOn(i)}
            onKeyDown={(e) => move(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label + i} role="tabpanel" id={`${uid}-p${i}`} aria-labelledby={`${uid}-t${i}`} className="ma-tabpanel" hidden={on !== i}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
