"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { IndustryIcon } from "./icons";

type Item = { name: string; description: string };

const ADVANCE_MS = 5200;

/**
 * Industries as a radar: the industries sit on a ring around a glowing centre, a soft sweep turns behind them, and the one
 * that is selected lights up its spoke and its text appears beside the radar. Pointing at (or tapping) an industry selects it;
 * when nobody touches it the selection moves on by itself every few seconds (with a small progress line).
 */
export function IndustriesOrbit({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, count]);

  if (count === 0) return null;
  const current = items[Math.min(active, count - 1)];

  return (
    <div
      className="orb-wrap"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="orb" role="tablist" aria-label="Industries">
        <span aria-hidden className="orb-ring" style={{ "--s": "100%" } as CSSProperties} />
        <span aria-hidden className="orb-ring" style={{ "--s": "78%" } as CSSProperties} />
        <span aria-hidden className="orb-ring" style={{ "--s": "36%" } as CSSProperties} />
        <span aria-hidden className="orb-sweep" />
        <span aria-hidden className="orb-cross orb-cross-h" />
        <span aria-hidden className="orb-cross orb-cross-v" />
        <span aria-hidden className="orb-dot" />

        {items.map((item, i) => {
          const angle = (i / count) * 360 - 90;
          const on = i === active;
          return (
            <span key={item.name + i} style={{ "--a": `${angle}deg` } as CSSProperties}>
              <span aria-hidden className="orb-spoke" data-on={on} />
              <button
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="orb-panel"
                id={`orb-tab-${i}`}
                data-on={on}
                data-flip={Math.sin((angle * Math.PI) / 180) > 0.4}
                className="orb-node"
                onPointerEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <IndustryIcon name={item.name} className="size-[22px]" />
                <span className="orb-label">{item.name}</span>
              </button>
            </span>
          );
        })}
      </div>

      <div key={active} id="orb-panel" role="tabpanel" aria-labelledby={`orb-tab-${active}`} className="orb-detail">
        <span className="orb-index">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <span className="orb-icon">
          <IndustryIcon name={current.name} className="size-8" />
        </span>
        <h3 className="orb-title">{current.name}</h3>
        <p className="orb-text">{current.description}</p>
        <span aria-hidden className="orb-progress" data-paused={paused || count < 2}>
          <i style={{ animationDuration: `${ADVANCE_MS}ms` }} />
        </span>
      </div>
    </div>
  );
}
