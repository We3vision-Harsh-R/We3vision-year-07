"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FaqJsonLd } from "../json-ld";
import { AiHead } from "./ai-page";
import "@/styles/ai-page.css";

// The moving parts of the AI page (owner, 2026-11-09): the eight steps as a staircase of pills with the awake step in a glass card, and the reasons
// as a slider graph with a glowing path through the chosen dots. Styles: .aip-* in styles/ai-page.css.

type Step = { title: string; text: string; points: string };

/** "How we build your AI": eight pills going down like stairs; one is awake at a time (every few seconds, or when the pointer rests on it) */
export function AiProcess({ chip, heading, intro, items }: { chip?: string; heading: string; intro?: string; items: Step[] }) {
  const [on, setOn] = useState(0);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (hold || !seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setOn((v) => (v + 1) % items.length), 5200);
    return () => clearInterval(t);
  }, [hold, seen, items.length]);

  const cur = items[on] ?? items[0];
  const n = items.length;
  return (
    <section id="process" className="aip aip-sec">
      <div className="aip-wrap">
        <AiHead chip={chip} heading={heading} intro={intro} />
        <div className="aip-pr" ref={root} data-pause-off data-hold={hold ? "" : undefined}>
          <i className="aip-gd aip-gd1" />
          <i className="aip-gd aip-gd2" />
          <i className="aip-gd aip-gd3" />
          {items.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={`aip-pill${i === on ? " on" : ""}${i < on ? " past" : ""}`}
              style={{ left: `${(i / (n - 1)) * 66}%`, top: 8 + i * 56 } as CSSProperties}
              onMouseEnter={() => {
                setOn(i);
                setHold(true);
              }}
              onMouseLeave={() => setHold(false)}
              onFocus={() => setOn(i)}>
              <em>{String(i + 1).padStart(2, "0")}</em>
              {s.title}
            </button>
          ))}
          <div className="aip-step" key={on}>
            <p className="aip-sk">
              Step {String(on + 1).padStart(2, "0")} <span>of {String(n).padStart(2, "0")}</span>
            </p>
            <h3>{cur.title}</h3>
            <p className="aip-d">{cur.text}</p>
            <ul>
              {cur.points.split("\n").map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <span className="aip-bar" />
          </div>
        </div>
      </div>
    </section>
  );
}

// the slider graph: where the chosen dot sits on each row (0 to 4) and the geometry of the picture (px)
const PICK = [3, 4, 1, 0, 2];
const SW = 560;
const RH = 96;
const sx = (k: number) => 40 + k * 120;
const sy = (r: number) => RH / 2 + r * RH;

/** "Why We3vision": every reason is a row of a slider; a soft light runs through the chosen dots, from the first reason to the last */
export function AiWhy({ chip, heading, intro, items }: { chip?: string; heading: string; intro?: string; items: { title: string; description: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rows = items.slice(0, 5);
  const pts = rows.map((_, r) => ({ x: sx(PICK[r % PICK.length]), y: sy(r) }));
  const path = pts.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `C ${pts[i - 1].x} ${pts[i - 1].y + RH / 2} ${p.x} ${p.y - RH / 2} ${p.x} ${p.y}`)).join(" ");
  return (
    <section id="advantages" className="aip aip-sec">
      <div className="aip-wrap">
        <AiHead chip={chip} heading={heading} intro={intro} />
        <div className="aip-why" ref={root} data-in={inView ? "" : undefined}>
          <ol className="aip-wl">
            {rows.map((r, i) => (
              <li key={r.title} style={{ height: RH }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {r.title}
              </li>
            ))}
          </ol>
          <svg className="aip-wg" viewBox={`0 0 ${SW} ${RH * rows.length}`} width={SW} height={RH * rows.length} fill="none" aria-hidden>
            <path className="aip-glow" d={path} pathLength="1" />
            {rows.map((_, r) => (
              <g key={r}>
                <line x1="24" x2={SW - 24} y1={sy(r)} y2={sy(r)} className="aip-tl" />
                {[0, 1, 2, 3, 4].map((k) => (
                  <circle key={k} cx={sx(k)} cy={sy(r)} r={k === PICK[r % PICK.length] ? 11 : 5} className={k === PICK[r % PICK.length] ? "aip-pk" : "aip-sd"} style={{ "--n": r } as CSSProperties} />
                ))}
              </g>
            ))}
          </svg>
          <ol className="aip-wr">
            {rows.map((r) => (
              <li key={r.title} style={{ height: RH }}>
                {r.description}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** the questions: the heading stays on the left, the questions are glass rows on the right; one answer open at a time (and Google is told about them) */
export function AiFaq({ chip, heading, intro, items }: { chip?: string; heading: string; intro?: string; items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="aip aip-sec">
      <FaqJsonLd items={items} />
      <div className="aip-wrap aip-faq">
        <div className="aip-faqh">
          <AiHead chip={chip} heading={heading} intro={intro} />
        </div>
        <div className="aip-qs">
          {items.map((q, i) => {
            const isOpen = open === i;
            return (
              <div key={q.question} className={`aip-q${isOpen ? " open" : ""}`}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`aip-q${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {q.question}
                    <b aria-hidden />
                  </button>
                </h3>
                <div id={`aip-q${i}`} role="region" className="aip-qa">
                  <div>
                    <p>{q.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
