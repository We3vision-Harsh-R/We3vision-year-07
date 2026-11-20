"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { SmartLink } from "@/components/site/smart-link";
import type { HomeFaqItem } from "@/lib/seo/home-faq";
import "@/styles/gta-faq.css";

// GTA theme (task 158, gta-faq.css prefix gq-): the home FAQ as a game phone. A short list of the questions (like the contacts of a phone) and a phone
// that shows the chosen question as a chat: your question, "typing...", the answer, and a link to the page that explains it. Every answer is in the
// server HTML (the ones that are not shown have the `hidden` attribute), and the FAQPage data of the home page is unchanged (lib/seo/home-faq.ts).
export function HomeFaqPhone({ items }: { items: HomeFaqItem[] }) {
  const uid = useId();
  const [sel, setSel] = useState(0);
  const go = (n: number) => {
    setSel(n);
    document.getElementById(`${uid}-t${n}`)?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const last = items.length - 1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") go(i === last ? 0 : i + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(i === 0 ? last : i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(last);
    else return;
    e.preventDefault();
  };
  return (
    <>
      <div className="gq-list" role="tablist" aria-orientation="vertical" aria-label="Questions" data-r>
        {items.map((f, i) => (
          <button
            key={f.question}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={sel === i}
            aria-controls={`${uid}-p${i}`}
            tabIndex={sel === i ? 0 : -1}
            data-on={sel === i ? "" : undefined}
            title={f.question}
            className="gq-row"
            onClick={() => setSel(i)}
            onKeyDown={(e) => onKey(e, i)}>
            <span className="gq-n" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="gq-q">{f.question}</span>
          </button>
        ))}
      </div>
      <div className="gq-phone" data-r>
        <div className="gq-top" aria-hidden>
          <span>We3vision</span>
          <i className="gq-island" />
          <svg viewBox="0 0 22 14">
            <path d="M1 12V9M6 12V6M11 12V3M16 12V1" />
          </svg>
        </div>
        <div className="gq-head">
          <span className="gq-av" aria-hidden>
            W
          </span>
          <div>
            <p className="gq-name">We3vision</p>
            <p className="gq-sub">Answers in seconds</p>
          </div>
        </div>
        <div className="gq-scroll">
          {items.map((f, i) => (
            <div key={f.question} role="tabpanel" id={`${uid}-p${i}`} aria-labelledby={`${uid}-t${i}`} hidden={sel !== i} className="gq-thread">
              <p className="gq-b gq-me">{f.question}</p>
              <p className="gq-typing" aria-hidden>
                <i />
                <i />
                <i />
              </p>
              <p className="gq-b gq-them">{f.answer}</p>
              <SmartLink href={f.href} className="gq-more">
                {f.link} <span aria-hidden>→</span>
              </SmartLink>
            </div>
          ))}
        </div>
        <SmartLink href="/contact" className="gq-input">
          <span>Ask us something else</span>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </SmartLink>
      </div>
    </>
  );
}
