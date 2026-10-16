"use client";

import "@/styles/modern-base.css";
import "@/styles/modern-faq.css";


import { useState } from "react";
import { GlowEdge } from "../glow-edge";
import { Reveal } from "../reveal";
import { VHead, two, useCycle } from "./variant-kit";

// The questions in six more designs (the first one is faq-split.tsx), one for every service page. All of them tell Google about the questions
// (FAQPage). The look is in globals.css (.vf-*).

type Q = { question: string; answer: string };
type P = { chip: string; heading: string; intro?: string; items: Q[] };

function Json({ items }: { items: Q[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />;
}

/** 1: a stack of wide bars, one open at a time */
function Stack({ chip, heading, intro, items }: P) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="md vf vf-stack">
      <Json items={items} />
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vf-sk-list">
        {items.map((q, i) => (
          <div key={i} className="vf-sk-item" data-open={open === i}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              <span>{two(i + 1)}</span>
              <b>{q.question}</b>
              <i aria-hidden />
            </button>
            <div className="vf-sk-body">
              <p>{q.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 2: every question is a card and every answer is open, in two columns */
function Cards({ chip, heading, intro, items }: P) {
  return (
    <div className="md vf vf-cards">
      <Json items={items} />
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vf-cd-grid">
        {items.map((q, i) => (
          <Reveal key={i} delay={(i % 2) * 70}>
            <article className="vf-cd bglow">
              <GlowEdge />
              <span className="vf-cd-q" aria-hidden>
                Q
              </span>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** 3: a chat: the visitor picks a question and the answer is written back, with the three dots of someone who is typing */
function Chat({ chip, heading, intro, items }: P) {
  const { active, pick, ref } = useCycle(items.length, 7200);
  const q = items[active];
  return (
    <div ref={ref} className="md vf vf-chat">
      <Json items={items} />
      <VHead chip={chip} heading={heading} intro={intro} />
      <div className="vf-ch-grid">
        <ul className="vf-ch-list" role="tablist" aria-label={chip}>
          {items.map((it, i) => (
            <li key={i}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                data-on={i === active}
                onClick={() => pick(i)}
              >
                {it.question}
              </button>
            </li>
          ))}
        </ul>
        <div className="vf-ch-win" role="tabpanel">
          <div className="vf-ch-top" aria-hidden>
            <i />
            <b>We3vision</b>
            <small>usually answers at once</small>
          </div>
          <div key={active} className="vf-ch-body">
            <p className="vf-ch-msg vf-ch-you">{q.question}</p>
            {/* the three dots of someone who is writing show for a moment, then the answer comes in (both are in CSS) */}
            <p className="vf-ch-msg vf-ch-bot vf-ch-dots" aria-hidden>
              <i />
              <i />
              <i />
            </p>
            <p className="vf-ch-msg vf-ch-bot vf-ch-ans">{q.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 4: the questions in a list, the answer of the open one as a large panel */
function TabsFaq({ chip, heading, intro, items }: P) {
  const { active, pick, ref } = useCycle(items.length, 8000);
  const q = items[active];
  return (
    <div ref={ref} className="md vf vf-tabs">
      <Json items={items} />
      <div className="vf-tb-list">
        <VHead chip={chip} heading={heading} intro={intro} />
        <ol role="tablist" aria-label={chip}>
          {items.map((it, i) => (
            <li key={i}>
              <button type="button" role="tab" aria-selected={i === active} data-on={i === active} onClick={() => pick(i)}>
                {it.question}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div key={active} className="vf-tb-panel bglow" role="tabpanel">
        <GlowEdge />
        <span className="vf-tb-mark" aria-hidden>
          “
        </span>
        <span className="vf-tb-no">
          {two(active + 1)} / {two(items.length)}
        </span>
        <h3>{q.question}</h3>
        <p>{q.answer}</p>
      </div>
    </div>
  );
}

/** 5: cards that turn over: the question in front, the answer behind */
function Flip({ chip, heading, intro, items }: P) {
  const [on, setOn] = useState<Record<number, boolean>>({});
  return (
    <div className="md vf vf-flip">
      <Json items={items} />
      <VHead chip={chip} heading={heading} intro={intro} center />
      <p className="vf-fl-hint">Tap a card to turn it over</p>
      <ul className="vf-fl-grid">
        {items.map((q, i) => (
          <li key={i}>
            <button type="button" aria-pressed={!!on[i]} data-flip={!!on[i]} onClick={() => setOn((o) => ({ ...o, [i]: !o[i] }))}>
              <span className="vf-fl-in">
                <span className="vf-fl-face vf-fl-front">
                  <em>{two(i + 1)}</em>
                  <b>{q.question}</b>
                </span>
                <span className="vf-fl-face vf-fl-back">
                  <small>Answer</small>
                  <span>{q.answer}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 6: like a magazine: the number, the question and the answer in three columns, all of it open */
function Editorial({ chip, heading, intro, items }: P) {
  return (
    <div className="md vf vf-ed">
      <Json items={items} />
      <VHead chip={chip} heading={heading} intro={intro} />
      <div className="vf-ed-list">
        {items.map((q, i) => (
          <Reveal key={i} delay={40}>
            <div className="vf-ed-row">
              <span aria-hidden>{two(i + 1)}</span>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** the design of the page: 1..6 (0 is faq-split.tsx) */
export function FaqVariant({ variant, ...p }: P & { variant: number }) {
  if (p.items.length === 0) return null;
  switch (variant) {
    case 1:
      return <Stack {...p} />;
    case 2:
      return <Cards {...p} />;
    case 3:
      return <Chat {...p} />;
    case 4:
      return <TabsFaq {...p} />;
    case 5:
      return <Flip {...p} />;
    default:
      return <Editorial {...p} />;
  }
}
