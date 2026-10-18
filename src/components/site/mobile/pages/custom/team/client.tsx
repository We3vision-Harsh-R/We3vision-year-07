"use client";

import { useState, type CSSProperties } from "react";

/** the interactive part of /team: scrub the hand-offs of a project like the iOS slider */

/** "How a project moves through the team": drag the glass knob (or tap a number, or use the arrow keys) and the step crossfades in below */
export function RelayScrubber({ steps, label }: { steps: { stage: string; who: string; text: string }[]; label: string }) {
  const [k, setK] = useState(0);
  const n = steps.length;
  if (n === 0) return null;
  const s = steps[k];
  const pct = n > 1 ? (k / (n - 1)) * 100 : 0;
  return (
    <div className="mp-team-scrub" style={{ "--p": `${pct}%` } as CSSProperties}>
      <div className="mp-team-track">
        <input type="range" min={0} max={Math.max(0, n - 1)} step={1} value={k} onChange={(e) => setK(Number(e.target.value))} aria-label={label} aria-valuetext={`${k + 1} / ${n}: ${s.stage}`} />
      </div>
      <div className="mp-team-ticks" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {steps.map((x, i) => (
          <button key={i} type="button" tabIndex={-1} aria-hidden="true" className={i === k ? "is-on" : i < k ? "is-past" : undefined} onClick={() => setK(i)}>
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <div key={k} className="mp-team-step" aria-live="polite">
        <h3>{s.stage}</h3>
        {s.who && <p className="mp-team-by">{s.who}</p>}
        {s.text && <p className="mp-team-tx">{s.text}</p>}
      </div>
    </div>
  );
}
