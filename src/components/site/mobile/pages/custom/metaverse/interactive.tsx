"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Cloud } from "../../../app";
import { Lines } from "../../../app/text";

// The interactive parts of the metaverse screen (no 3D): the four "cabins" (AR / VR / XR / MR), the device filter and the "which reality" quiz.
// All words come from the CMS (props); nothing is invented here. Keyboard: arrows / Home / End on the tabs and the filter.

/** arrow-key focus move inside a row of buttons (roving), returns the new index or -1 */
function arrowMove(e: KeyboardEvent<HTMLElement>, i: number, n: number) {
  const k = e.key;
  const to = k === "ArrowRight" || k === "ArrowDown" ? (i + 1) % n : k === "ArrowLeft" || k === "ArrowUp" ? (i - 1 + n) % n : k === "Home" ? 0 : k === "End" ? n - 1 : -1;
  if (to < 0) return -1;
  e.preventDefault();
  const btns = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
  btns?.[to]?.focus();
  return to;
}

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Cabin = { code: string; name: string; text: string; industries: string[] };

/** "Which team is for you?": a visionOS window with its ornament (the codes) floating on the bottom edge; the panel crossfades */
export function CabinPicker({ cabins, industriesTitle, ctaLabel }: { cabins: Cabin[]; industriesTitle: string; ctaLabel: string }) {
  const [on, setOn] = useState(0);
  const uid = useId();
  const c = cabins[on] ?? cabins[0];
  return (
    <div className="mp-vr-win ma-rvx">
      <div className="mp-vr-panel mp-vr-glass mp-vr-blur" role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t${on}`}>
        <div className="mp-vr-cabin" key={on}>
          <p className="mp-vr-code">{c.code}</p>
          <h3>
            <Lines text={c.name} />
          </h3>
          {c.text && <p className="mp-vr-p">{c.text}</p>}
          {c.industries.length > 0 && (
            <>
              {industriesTitle && <p className="mp-vr-lab">{industriesTitle}</p>}
              <Cloud items={c.industries} />
            </>
          )}
        </div>
        {ctaLabel && (
          <a href="#contact" className="mp-vr-cta">
            {ctaLabel}
          </a>
        )}
      </div>
      <div className="mp-vr-orn mp-vr-blur" role="tablist" aria-orientation="horizontal">
        {cabins.map((x, i) => (
          <button
            key={x.code}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={on === i}
            aria-controls={`${uid}-p`}
            tabIndex={on === i ? 0 : -1}
            className="mp-vr-orb"
            onClick={() => setOn(i)}
            onKeyDown={(e) => {
              const to = arrowMove(e, i, cabins.length);
              if (to >= 0) setOn(to);
            }}
          >
            {x.code}
          </button>
        ))}
      </div>
    </div>
  );
}

type Device = { name: string; kind: string; realities: string; text: string; tags: string[] };

/** the devices as a sideways row of glass windows with a segmented filter by AR / VR / XR / MR (tap again to clear) */
export function DeviceRow({ items, codes }: { items: Device[]; codes: string[] }) {
  const [f, setF] = useState<string | null>(null);
  const shown = items.filter((d) => !f || d.realities.split(/\s+/).includes(f));
  const choose = (c: string) => setF(f === c ? null : c);
  return (
    <div className="mp-vr-devbox">
      {codes.length > 1 && (
        <div className="mp-vr-seg mp-vr-blur ma-rvx" role="group">
          {codes.map((c) => (
            <button key={c} type="button" aria-pressed={f === c} className="mp-vr-segb" onClick={() => choose(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <ul className="mp-vr-devs" key={f ?? "all"}>
        {shown.map((d) => (
          <li key={d.name} className="mp-vr-glass mp-vr-dev">
            <p className="mp-vr-code">{[d.kind, d.realities].filter(Boolean).join(" · ")}</p>
            <h3>{d.name}</h3>
            {d.text && <p className="mp-vr-p">{d.text}</p>}
            {d.tags.length > 0 && <Cloud items={d.tags} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Question = { question: string; options: { label: string; codes: string[] }[] };
type Result = { code: string; title: string; text: string; project: string };

/** the "which reality fits your idea" quiz: three questions, the realities of the chosen answers are counted, the most frequent one wins.
 *  A tapped answer shows a check for a moment, then the next card crossfades in and takes the focus. */
export function RealityQuiz({ questions, results, startLabel, restartLabel, ctaLabel }: { questions: Question[]; results: Result[]; startLabel: string; restartLabel: string; ctaLabel: string }) {
  const [step, setStep] = useState(-1);
  const [score, setScore] = useState<Record<string, number>>({});
  const [picked, setPicked] = useState<number | null>(null);
  const head = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const done = step >= questions.length;
  const q = questions[step];
  const best = done ? [...results].sort((a, b) => (score[b.code] ?? 0) - (score[a.code] ?? 0))[0] : undefined;

  useEffect(() => {
    if (moved.current) head.current?.focus({ preventScroll: true });
  }, [step]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const go = (s: number) => {
    moved.current = true;
    setPicked(null);
    setStep(s);
  };
  const pick = (i: number, codes: string[]) => {
    if (picked !== null) return;
    const next = { ...score };
    for (const c of codes) next[c] = (next[c] ?? 0) + 1;
    setScore(next);
    setPicked(i);
    timer.current = window.setTimeout(() => go(step + 1), reduced() ? 0 : 260);
  };
  const reset = () => {
    setScore({});
    go(-1);
  };

  return (
    <div className="mp-vr-quiz mp-vr-blur ma-rvx">
      <div aria-live="polite">
        {step < 0 && (
          <div className="mp-vr-qintro">
            <span className="mp-vr-qorb" aria-hidden="true">
              {results.map((r) => (
                <i key={r.code}>{r.code}</i>
              ))}
            </span>
            <button type="button" className="mp-vr-start" onClick={() => go(0)}>
              {startLabel}
            </button>
          </div>
        )}
        {q && (
          <div className="mp-vr-q" key={step}>
            <div className="mp-vr-dots" aria-hidden="true">
              {questions.map((_, i) => (
                <i key={i} className={i === step ? "is-on" : i < step ? "is-done" : ""} />
              ))}
            </div>
            <h3 ref={head} tabIndex={-1}>
              {q.question}
            </h3>
            <ul className="mp-vr-opts">
              {q.options.map((o, i) => (
                <li key={i}>
                  <button type="button" className="mp-vr-opt" aria-pressed={picked === i} onClick={() => pick(i, o.codes)}>
                    <span>{o.label}</span>
                    <i className="mp-vr-tick" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {best && (
          <div className="mp-vr-res">
            <span className="mp-vr-rcode" aria-hidden="true">
              {best.code}
            </span>
            <h3 ref={head} tabIndex={-1}>
              {best.title}
            </h3>
            {best.text && <p className="mp-vr-p">{best.text}</p>}
            {best.project && <p className="mp-vr-proj">{best.project}</p>}
            <div className="mp-vr-btns">
              {ctaLabel && (
                <a href="#contact" className="mp-vr-cta">
                  {ctaLabel}
                </a>
              )}
              <button type="button" className="mp-vr-again" onClick={reset}>
                {restartLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
