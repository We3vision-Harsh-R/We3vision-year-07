"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { LeadForm } from "../../../app";
import { PARTNER_WAYS, TOPICS } from "@/lib/contact-topics";

/** the interactive part of /contact: an iOS segmented control (a glass thumb slides under the picked segment) that switches how to reach us */
export function Segmented({ tabs, panels, label }: { tabs: string[]; panels: ReactNode[]; label: string }) {
  const [k, setK] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const n = tabs.length;
  const pick = (i: number, focus = false) => {
    const j = (i + n) % n;
    setK(j);
    if (focus) (row.current?.children[j + 1] as HTMLElement | undefined)?.focus();
  };
  const key = (e: KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick(i + 1, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick(i - 1, true); }
  };
  return (
    <div className="mp-con-pick">
      <div ref={row} className="mp-con-seg" role="tablist" aria-label={label} style={{ "--n": n, "--k": k } as CSSProperties}>
        <span className="mp-con-thumb" aria-hidden="true" />
        {tabs.map((t, i) => (
          <button key={t} type="button" role="tab" id={`con-t-${i}`} aria-selected={i === k} aria-controls={`con-p-${i}`} tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
            {t}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={i} id={`con-p-${i}`} role="tabpanel" aria-labelledby={`con-t-${i}`} hidden={i !== k} className="mp-con-panel">
          {p}
        </div>
      ))}
    </div>
  );
}

/** the topics of the Contact page on a phone (owner, 2026-11-27): a segmented control (Project / Partner / Job / Training / Details), each topic with its own form,
 *  and the Partner program under it; "Partner this way" opens the Partner form with that way ticked */
export function ContactTopics({ courses, details }: { courses: string[]; details: ReactNode }) {
  const [k, setK] = useState(0);
  const [ticked, setTicked] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const q = (new URLSearchParams(window.location.search).get("topic") ?? window.location.hash.replace("#", "")).toLowerCase();
    const i: Record<string, number> = { project: 0, partner: 1, "partner-program": 1, career: 2, careers: 2, job: 2, internship: 2, training: 3, details: 4 };
    if (i[q] !== undefined) setK(i[q]); // eslint-disable-line react-hooks/set-state-in-effect -- reads the address once after the page has loaded
  }, []);
  const tabs = ["Project", "Partner", "Job", "Training", "Details"];
  const n = tabs.length;
  const pick = (i: number, ways: string[] = [], scroll = false) => {
    setK(i);
    setTicked(ways);
    setRound((r) => r + 1);
    if (scroll) root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const key = (e: KeyboardEvent, i: number) => {
    const j = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i + n - 1) % n : -1;
    if (j < 0) return;
    e.preventDefault();
    pick(j);
    (row.current?.children[j + 1] as HTMLElement | undefined)?.focus();
  };
  const topic = TOPICS[k];
  return (
    <>
      <div className="mp-con-pick" ref={root}>
        <div ref={row} className="mp-con-seg" role="tablist" aria-label="What do you want to talk about?" style={{ "--n": n, "--k": k } as CSSProperties}>
          <span className="mp-con-thumb" aria-hidden="true" />
          {tabs.map((t, i) => (
            <button key={t} type="button" role="tab" id={`con-t-${i}`} aria-selected={i === k} aria-controls="con-p" tabIndex={i === k ? 0 : -1} className={i === k ? "is-on" : ""} onClick={() => pick(i)} onKeyDown={(e) => key(e, i)}>
              {t}
            </button>
          ))}
        </div>
        <div id="con-p" role="tabpanel" aria-labelledby={`con-t-${k}`} className="mp-con-panel">
          {topic ? (
            <>
              <h3 className="mp-con-th">{topic.title}</h3>
              <p className="mp-con-tt">{topic.text}</p>
              <div className="mp-con-tl">
                {topic.links.map((l) => (
                  <a key={l.href} href={l.href} className="ma-btn ma-btn-glass">
                    {l.label}
                  </a>
                ))}
              </div>
              <LeadForm key={`${topic.id}-${round}`} topic={topic} courses={courses} ticked={ticked} />
            </>
          ) : (
            details
          )}
        </div>
      </div>
      <section id="partner-program" className="ma-sec">
        <header className="ma-sec-head">
          <span className="ma-chip">Partner program</span>
          <h2 className="ma-h2">Grow with We3vision, in the way that suits you</h2>
          <p className="ma-intro">There is more than one way to work with us. Choose the one that fits your company and send us a request.</p>
        </header>
        <ul className="mp-con-ways">
          {PARTNER_WAYS.map((w) => (
            <li key={w.id} className="mp-con-way">
              <b>{w.title}</b>
              <span>{w.text}</span>
              <button type="button" className="ma-btn ma-btn-tinted" onClick={() => pick(1, [w.title], true)}>
                Partner this way
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
