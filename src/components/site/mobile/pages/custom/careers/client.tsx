"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/** the interactive part of /careers: filter the open jobs by team (a sideways row of capsules), the list crossfades to the picked team */
export function JobBoard({ jobs, allLabel }: { jobs: { id: string; team: string; row: ReactNode }[]; allLabel: string }) {
  const teams = [allLabel, ...Array.from(new Set(jobs.map((j) => j.team).filter(Boolean)))];
  const [k, setK] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const pick = (i: number, focus = false) => {
    const j = Math.max(0, Math.min(teams.length - 1, i));
    setK(j);
    const b = row.current?.children[j] as HTMLElement | undefined;
    b?.scrollIntoView({ inline: "center", block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (focus) b?.focus({ preventScroll: true });
  };
  const key = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick(i - 1, true); }
    if (e.key === "Home") { e.preventDefault(); pick(0, true); }
    if (e.key === "End") { e.preventDefault(); pick(teams.length - 1, true); }
  };
  const shown = k === 0 ? jobs : jobs.filter((j) => j.team === teams[k]);
  return (
    <div className="mp-car-jobs">
      {teams.length > 2 && (
        <div ref={row} className="mp-car-seg" role="tablist" aria-label="Filter jobs by team">
          {teams.map((t, i) => (
            <button key={t} type="button" role="tab" id={`car-t-${i}`} aria-selected={i === k} aria-controls="car-board" tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
              {t}
            </button>
          ))}
        </div>
      )}
      <ul key={k} id="car-board" role={teams.length > 2 ? "tabpanel" : undefined} aria-labelledby={teams.length > 2 ? `car-t-${k}` : undefined} className="mp-car-board">
        {shown.map((j) => (
          <li key={j.id}>{j.row}</li>
        ))}
      </ul>
    </div>
  );
}
