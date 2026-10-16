"use client";

import { useEffect, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { SectionHead } from "../ui";

// The quiz of the Metaverse page: "which reality fits your idea?". A big glass card with three questions (every answer points to one or
// more of AR, VR, XR, MR), a progress line, and at the end the recommendation with a good first step and a button to the contact form with
// the answers already written in the message (the contact form listens to the "w3v-prefill" event). The look is in globals.css (.vq-*).

type Question = { question: string; options: string };
type Result = { code: string; title: string; text: string; project: string };

const parse = (t: string) =>
  (t || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [label, ...rest] = l.split("|");
      return { label: label.trim(), codes: rest.join("|").toUpperCase().split(/\s+/).filter(Boolean) };
    });

export function VrQuiz({
  id,
  chip,
  heading,
  intro,
  startLabel,
  restartLabel,
  ctaLabel,
  questions,
  results,
}: {
  id?: string;
  chip: string;
  heading: string;
  intro: string;
  startLabel: string;
  restartLabel: string;
  ctaLabel: string;
  questions: Question[];
  results: Result[];
}) {
  const qs = questions.map((q) => ({ question: q.question, options: parse(q.options) })).filter((q) => q.options.length > 0);
  const n = qs.length;
  const [step, setStep] = useState(-1); // -1 the start, 0..n-1 the questions, n the answer
  const [picks, setPicks] = useState<number[]>([]);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (qi: number, oi: number) => {
    const next = picks.slice(0, qi);
    next[qi] = oi;
    setPicks(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStep(qi + 1), 380);
  };

  // the answer: the reality with the most points (a tie between several is XR, the umbrella)
  const score: Record<string, number> = {};
  picks.forEach((oi, qi) => qs[qi]?.options[oi]?.codes.forEach((c) => (score[c] = (score[c] || 0) + 1)));
  const best = Math.max(0, ...Object.values(score));
  const winners = Object.keys(score).filter((c) => score[c] === best);
  const code = winners.length === 1 ? winners[0] : "XR";
  const result = results.find((r) => r.code.toUpperCase() === code) ?? results.find((r) => r.code.toUpperCase() === "XR") ?? results[0];

  const message = () =>
    `I tried the "${heading.replace(/\n/g, " ")}" quiz on the Metaverse page. ${qs.map((q, i) => `${q.question} ${q.options[picks[i]]?.label ?? "-"}.`).join(" ")} It points to ${result?.code ?? code}. I would like to discuss it.`;

  const progress = step < 0 ? 0 : Math.min(1, step / Math.max(1, n));

  return (
    <section id={id || "quiz"} className="vq px-4 py-24 sm:py-32" aria-label={heading.replace(/\n/g, " ")}>
      <SectionHead chip={chip} heading={heading} intro={intro} />
      <div className="vq-card bglow">
        <GlowEdge />
        <div className="vq-bar" aria-hidden>
          <i style={{ width: `${progress * 100}%` }} />
        </div>

        {step < 0 && (
          <div key="start" className="vq-pane vq-start">
            <div className="vq-codes" aria-hidden>
              {["AR", "VR", "XR", "MR"].map((c, i) => (
                <b key={c} style={{ "--i": i } as React.CSSProperties}>
                  {c}
                </b>
              ))}
            </div>
            <p>{n} questions, one answer.</p>
            <button type="button" className="vq-btn" onClick={() => setStep(0)}>
              {startLabel}
            </button>
          </div>
        )}

        {step >= 0 && step < n && (
          <div key={step} className="vq-pane">
            <p className="vq-count">
              {step + 1} / {n}
            </p>
            <h3 className="vq-q">{qs[step].question}</h3>
            <ul className="vq-opts">
              {qs[step].options.map((o, oi) => (
                <li key={oi}>
                  <button type="button" className="vq-opt" data-on={picks[step] === oi} onClick={() => pick(step, oi)}>
                    <b>{String.fromCharCode(65 + oi)}</b>
                    <span>{o.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            {step > 0 && (
              <button type="button" className="vq-back" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}
          </div>
        )}

        {step >= n && n > 0 && result && (
          <div key="result" className="vq-pane vq-result" aria-live="polite">
            <p className="vq-count">Our answer</p>
            <div className="vq-big" aria-hidden>
              {result.code}
            </div>
            <h3 className="vq-q">{result.title}</h3>
            <p className="vq-text">{result.text}</p>
            <p className="vq-first">{result.project}</p>
            <div className="vq-act">
              <a
                href="#contact"
                className="vq-btn"
                onClick={() => window.dispatchEvent(new CustomEvent("w3v-prefill", { detail: { message: message() } }))}
              >
                {ctaLabel}
                <svg viewBox="0 0 20 20" aria-hidden>
                  <path d="M4 10h11M11 5l5 5-5 5" />
                </svg>
              </a>
              <button
                type="button"
                className="vq-back"
                onClick={() => {
                  setPicks([]);
                  setStep(0);
                }}
              >
                {restartLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
