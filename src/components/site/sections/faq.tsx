"use client";

import { useState } from "react";
import { Reveal } from "../reveal";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/** Frequently asked questions: one answer open at a time, opening smoothly. Also tells Google about the questions (FAQPage). */
export const Faq: SectionComponent<"faq"> = ({ data }) => {
  const [open, setOpen] = useState<number | null>(0);
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };
  return (
    <section id="faq" className="py-24 sm:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />
      <div className="mx-auto w-full max-w-[860px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <Reveal delay={80} className="mt-14 divide-y divide-violet/10 border-y border-violet/10">
          {data.items.map((q, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-[-0.01em] text-violet transition-colors hover:text-white"
                  >
                    {q.question}
                    <span aria-hidden className="relative size-5 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                      <span className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className={`pb-7 pr-10 text-base leading-[1.7] text-orchid transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>{q.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};
