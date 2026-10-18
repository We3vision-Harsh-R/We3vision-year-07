"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

/** the interactive parts of /crm (styles: (m)/m/crm/page.css, "mp-crm-") */

const calmNow = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type CrmKind = { title: string; description: string; fit: string; problems: string[]; outcomes: string[]; href: string };

/**
 * "CRM systems for every team": a row of CRM kinds (a scrolling segmented picker); the one you pick opens below with a crossfade.
 * Inside it a two-way switch flips the list between the problems it solves and what you get (open circles become ticked ones).
 */
export function CrmPicker({ items, label }: { items: CrmKind[]; label: string }) {
  const [k, setK] = useState(0);
  const [after, setAfter] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const n = items.length;
  const pick = (i: number, focus = false) => {
    const j = (i + n) % n;
    setK(j);
    const b = row.current?.children[j] as HTMLElement | undefined;
    b?.scrollIntoView({ inline: "center", block: "nearest", behavior: calmNow() ? "auto" : "smooth" });
    if (focus) b?.focus({ preventScroll: true });
  };
  const key = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick(i - 1, true); }
  };
  const it = items[k];
  const hasBoth = it.problems.length > 0 && it.outcomes.length > 0;
  const showAfter = hasBoth ? after : it.problems.length === 0;
  const list = showAfter ? it.outcomes : it.problems;
  return (
    <div className="mp-crm-pick">
      <div ref={row} className="mp-crm-tabs" role="tablist" aria-label={label}>
        {items.map((x, i) => (
          <button key={x.title} type="button" role="tab" id={`crm-t-${i}`} aria-selected={i === k} aria-controls="crm-panel" tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
            {x.title}
          </button>
        ))}
      </div>
      <div key={k} id="crm-panel" role="tabpanel" aria-labelledby={`crm-t-${k}`} className="mp-crm-panel">
        <h3>{it.title}</h3>
        {it.description && <p className="mp-crm-lead">{it.description}</p>}
        {it.fit && (
          <p className="mp-crm-fit">
            <span>Right for you when</span>
            {it.fit}
          </p>
        )}
        {hasBoth && (
          <div className="mp-crm-seg" role="radiogroup" aria-label="Show">
            <button type="button" role="radio" aria-checked={!after} className={!after ? "is-on" : ""} onClick={() => setAfter(false)}>
              Problems it solves
            </button>
            <button type="button" role="radio" aria-checked={after} className={after ? "is-on" : ""} onClick={() => setAfter(true)}>
              What you get
            </button>
            <i aria-hidden="true" style={{ "--x": after ? 1 : 0 } as CSSProperties} />
          </div>
        )}
        {list.length > 0 && (
          <ul key={String(showAfter)} className={"mp-crm-chk" + (showAfter ? " is-done" : "")}>
            {list.map((p, i) => (
              <li key={p} style={{ "--i": i } as CSSProperties}>
                <span className="mp-crm-ring" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export type CrmStep = { title: string; text: string; points: string[] };

/**
 * "How we build your CRM" as a pipeline you tap through: a track of numbered stages (the line fills up to the current one),
 * one glass stage card below it, and Back / Next. Arrow keys move along the track.
 */
export function CrmPipeline({ steps, label }: { steps: CrmStep[]; label: string }) {
  const [k, setK] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const n = steps.length;
  const go = (i: number, focus = false) => {
    const j = Math.max(0, Math.min(n - 1, i));
    setK(j);
    const b = row.current?.querySelectorAll("button")[j] as HTMLElement | undefined;
    b?.scrollIntoView({ inline: "center", block: "nearest", behavior: calmNow() ? "auto" : "smooth" });
    if (focus) b?.focus({ preventScroll: true });
  };
  const key = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); }
  };
  const s = steps[k];
  return (
    <div className="mp-crm-pipe" style={{ "--p": n > 1 ? k / (n - 1) : 1 } as CSSProperties}>
      <div ref={row} className="mp-crm-track" role="tablist" aria-label={label}>
        <span className="mp-crm-rail" aria-hidden="true"><i /></span>
        {steps.map((x, i) => (
          <button key={x.title} type="button" role="tab" aria-selected={i === k} aria-label={`${i + 1}. ${x.title}`} tabIndex={i === k ? 0 : -1} className={(i === k ? "is-on" : "") + (i < k ? " is-past" : "")} onClick={() => go(i)} onKeyDown={(e) => key(e, i)}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mp-crm-stage" role="tabpanel" aria-live="polite">
        <div key={k} className="mp-crm-stage-in">
          <p className="mp-crm-n">
            Step {k + 1} of {n}
          </p>
          <h3>{s.title}</h3>
          {s.text && <p className="mp-crm-st">{s.text}</p>}
          {s.points.length > 0 && (
            <ul className="mp-crm-sub">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mp-crm-nav">
          <button type="button" className="ma-btn ma-btn-glass" onClick={() => go(k - 1)} disabled={k === 0}>
            Back
          </button>
          <button type="button" className="ma-btn ma-btn-fill" onClick={() => go(k + 1)} disabled={k === n - 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
