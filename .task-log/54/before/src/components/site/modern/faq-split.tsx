"use client";

import { useState } from "react";
import { GlowEdge } from "../glow-edge";
import { SplitHeading } from "./split-heading";

type Q = { question: string; answer: string };

const two = (n: number) => String(n).padStart(2, "0");

// The redesigned FAQ of the service pages: the heading and a "still have a question?" card stay on the left while the questions are read on
// the right, numbered, one open at a time. Also tells Google about the questions (FAQPage).
export function FaqSplit({ chip, heading, intro, items }: { chip: string; heading: string; intro?: string; items: Q[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };
  return (
    <div className="md md-faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />
      <aside className="md-faq-side">
        <span className="md-chip">{chip}</span>
        <SplitHeading text={heading} className="md-h2" />
        {intro && <p className="md-intro">{intro}</p>}
        <div className="md-faq-help bglow">
          <GlowEdge />
          <b>Still have a question?</b>
          <p>Tell us what you need and we will answer you ourselves.</p>
          <a href="#contact">Talk to us →</a>
        </div>
      </aside>

      <div className="md-faq-list">
        {items.map((q, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="md-faq-item" data-open={isOpen}>
              <h3>
                <button type="button" aria-expanded={isOpen} aria-controls={`mdfaq-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                  <i aria-hidden>{two(i + 1)}</i>
                  <span>{q.question}</span>
                  <svg viewBox="0 0 20 20" aria-hidden>
                    <path d="M3 10h14" />
                    <path d="M10 3v14" className="md-faq-v" />
                  </svg>
                </button>
              </h3>
              <div id={`mdfaq-${i}`} role="region" className="md-faq-a">
                <div>
                  <p>{q.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
