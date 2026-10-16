"use client";

import { useId, useState } from "react";
import { Cloud } from "../../../app";
import { Lines } from "../../../app/text";

// The interactive parts of the metaverse screen (no 3D): the four "cabins" (AR / VR / XR / MR), the device filter and the "which reality" quiz.
// All words come from the CMS (props); nothing is invented here.

type Cabin = { code: string; name: string; text: string; industries: string[] };

/** "Which team is for you?": the codes are the ornament buttons of a glass window, the panel shows the chosen cabin */
export function CabinPicker({ cabins, industriesTitle, ctaLabel }: { cabins: Cabin[]; industriesTitle: string; ctaLabel: string }) {
  const [on, setOn] = useState(0);
  const uid = useId();
  return (
    <div className="mp-vr-win">
      <div className="mp-vr-panel" role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t${on}`}>
        {cabins.map((c, i) => (
          <div key={c.code} hidden={on !== i} className="mp-vr-cabin">
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
        ))}
        {ctaLabel && (
          <a href="#contact" className="mp-vr-cta">
            {ctaLabel}
          </a>
        )}
      </div>
      <div className="mp-vr-orn" role="tablist">
        {cabins.map((c, i) => (
          <button key={c.code} type="button" role="tab" id={`${uid}-t${i}`} aria-selected={on === i} aria-controls={`${uid}-p`} className="mp-vr-orb" onClick={() => setOn(i)}>
            {c.code}
          </button>
        ))}
      </div>
    </div>
  );
}

type Device = { name: string; kind: string; realities: string; text: string; tags: string[] };

/** the devices as a sideways row of glass cards with a filter by AR / VR / XR / MR (tap again to clear) */
export function DeviceRow({ items, codes, ctaLabel }: { items: Device[]; codes: string[]; ctaLabel: string }) {
  const [f, setF] = useState<string | null>(null);
  const shown = items.filter((d) => !f || d.realities.split(/\s+/).includes(f));
  return (
    <div>
      <div className="mp-vr-filter" role="group">
        {codes.map((c) => (
          <button key={c} type="button" aria-pressed={f === c} className="mp-vr-chip" onClick={() => setF(f === c ? null : c)}>
            {c}
          </button>
        ))}
      </div>
      <ul className="mp-vr-devs">
        {shown.map((d) => (
          <li key={d.name} className="mp-vr-glass">
            <p className="mp-vr-code">{[d.kind, d.realities].filter(Boolean).join(" · ")}</p>
            <h3>{d.name}</h3>
            {d.text && <p className="mp-vr-p">{d.text}</p>}
            {d.tags.length > 0 && <Cloud items={d.tags} />}
            {ctaLabel && (
              <a href="#contact" className="mp-vr-cta is-plain">
                {ctaLabel}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Question = { question: string; options: { label: string; codes: string[] }[] };
type Result = { code: string; title: string; text: string; project: string };

/** the "which reality fits your idea" quiz: three questions, the realities of the chosen answers are counted, the most frequent one wins */
export function RealityQuiz({ questions, results, startLabel, restartLabel, ctaLabel }: { questions: Question[]; results: Result[]; startLabel: string; restartLabel: string; ctaLabel: string }) {
  const [step, setStep] = useState(-1);
  const [score, setScore] = useState<Record<string, number>>({});
  const done = step >= questions.length;
  const q = questions[step];
  const best = done ? [...results].sort((a, b) => (score[b.code] ?? 0) - (score[a.code] ?? 0))[0] : undefined;

  const pick = (codes: string[]) => {
    const next = { ...score };
    for (const c of codes) next[c] = (next[c] ?? 0) + 1;
    setScore(next);
    setStep(step + 1);
  };
  const reset = () => {
    setScore({});
    setStep(-1);
  };

  return (
    <div className="mp-vr-quiz" aria-live="polite">
      {step < 0 && (
        <button type="button" className="mp-vr-start" onClick={() => setStep(0)}>
          {startLabel}
        </button>
      )}
      {q && (
        <div className="mp-vr-q" key={step}>
          <div className="mp-vr-dots" aria-hidden="true">
            {questions.map((_, i) => (
              <i key={i} className={i <= step ? "is-on" : ""} />
            ))}
          </div>
          <h3>{q.question}</h3>
          <ul>
            {q.options.map((o, i) => (
              <li key={i}>
                <button type="button" className="mp-vr-opt" onClick={() => pick(o.codes)}>
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {best && (
        <div className="mp-vr-res">
          <p className="mp-vr-code">{best.code}</p>
          <h3>{best.title}</h3>
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
  );
}
