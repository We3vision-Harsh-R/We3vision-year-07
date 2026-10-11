"use client";

import { useEffect, useRef, useState } from "react";
import { FlowIcon } from "../flow-icons";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

const TICK = 750; // how fast the story of the run goes (ms per step)
const STEPS_DEFAULT = ["Reads the message", "Checks your CRM and documents", "Decides what to do", "Does the work"];

/**
 * "How AI works for you" as one small run of an AI agent, played over and over: something happens (a customer e-mail arrives) -> the agent reads it, looks
 * into your tools, decides and acts (its steps tick one after the other, the tools it uses light up) -> the results appear one by one, each with a
 * check mark and the seconds it took, and a line says that nobody had to touch it. Then it starts again. It plays only while it is on the screen (one
 * timer, only the state of a few cells changes); without JavaScript, or with less motion, the finished run is shown. The look is in globals.css (.fa-*).
 */
export const Flow: SectionComponent<"flow"> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(-1); // -1: not started (a quiet picture), 0.. the step of the story, 999: the finished run

  const stepsFromData = (data.steps ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  const steps = (stepsFromData.length ? stepsFromData : STEPS_DEFAULT).slice(0, 5);
  const tools = data.sources.slice(0, 6);
  const results = data.actions.slice(0, 6);
  const n = steps.length;
  const loop = 2 + n + results.length + 5; // the whole story, with a rest at the end

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setT(999), 0); // (the finished run)
      return () => window.clearTimeout(id);
    }
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(timer);
        if (e.isIntersecting) {
          setT((v) => (v < 0 || v > loop ? 0 : v));
          timer = window.setInterval(() => setT((v) => (v + 1 >= loop ? 0 : v + 1)), TICK);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [loop]);

  const triggered = t >= 1;
  const stepAt = (i: number) => (t < 2 + i ? "wait" : t === 2 + i ? "run" : "done");
  const working = t >= 2 && t < 2 + n;
  const finished = t >= 2 + n;
  const toolOn = (k: number) => t >= 3 + k && t < loop - 1;
  const toolNow = (k: number) => working && t >= 3 && (t - 3) % Math.max(tools.length, 1) === k;
  const resultOn = (j: number) => t >= 2 + n + j && t < loop - 1;
  const allDone = t >= 2 + n + results.length && t < loop - 1;

  return (
    <section id="ai-flow" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1240px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <div ref={ref} className="fa" data-run={t >= 0}>
          <div className="fa-grid">
            {/* 1. something happens */}
            <article className="fa-card fa-trigger" data-on={triggered}>
              <p className="fa-tag">
                <FlowIcon name="bolt" className="size-[16px]" />
                {data.triggerLabel || "Something happens"}
              </p>
              <div className="fa-mail">
                <span className="fa-av" aria-hidden>
                  <FlowIcon name="mail" className="size-[18px]" />
                </span>
                <div>
                  <b>Customer</b>
                  <span>just now</span>
                </div>
              </div>
              <p className="fa-mail-t">{data.triggerText || "A new customer e-mail arrives"}</p>
              <p className="fa-listen">
                <i aria-hidden />
                {triggered ? "Received" : "Listening"}
              </p>
            </article>

            <span className="fa-link" data-on={triggered} aria-hidden />

            {/* 2. the agent */}
            <article className="fa-card fa-agent" data-state={finished ? "done" : working ? "work" : "idle"}>
              <header className="fa-agent-h">
                <span className="fa-orb" aria-hidden />
                <div>
                  <b>{data.coreLabel}</b>
                  <small>AI agent</small>
                </div>
                <span className="fa-status">{finished ? "Done" : working ? "Working" : "Ready"}</span>
              </header>
              <ol className="fa-steps">
                {steps.map((s, i) => (
                  <li key={i} data-s={stepAt(i)}>
                    <span className="fa-tick" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="fa-bar" aria-hidden>
                <span style={{ transform: `scaleX(${finished ? 1 : working ? (t - 2) / n : 0})` }} />
              </div>
              <div className="fa-tools">
                <p>
                  {data.sourcesLabel}
                  {data.sourcesNote && <span> · {data.sourcesNote}</span>}
                </p>
                <ul>
                  {tools.map((tool, k) => (
                    <li key={k} data-on={toolOn(k)} data-now={toolNow(k)}>
                      <FlowIcon name={tool.icon} className="size-[16px]" />
                      {tool.label}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <span className="fa-link" data-on={finished} aria-hidden />

            {/* 3. what it did */}
            <article className="fa-card fa-results" data-done={allDone}>
              <p className="fa-tag">
                <FlowIcon name="spark" className="size-[16px]" />
                {data.actionsLabel}
                {data.actionsNote && <span> · {data.actionsNote}</span>}
              </p>
              <ul>
                {results.map((r, j) => (
                  <li key={j} data-on={resultOn(j)}>
                    <span className="fa-ok" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span className="fa-r-t">{r.label}</span>
                    <em>{(0.6 + j * 0.7).toFixed(1)}s</em>
                  </li>
                ))}
              </ul>
              <p className="fa-run" data-on={allDone}>
                {data.runNote || "All done in seconds. Nobody had to touch it."}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
