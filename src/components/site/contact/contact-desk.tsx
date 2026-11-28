"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HomeContact } from "@/components/site/home/home-contact";
import { PARTNER_WAYS, TOPICS, type TopicId } from "@/lib/contact-topics";

// The Contact page (owner, 2026-11-27): four topics (project, partner, internship and job, industry training), each with its own questions, and the
// Partner program section. A link such as /contact?topic=training (or #partner) opens the page on that topic.
const FROM_LINK: Record<string, TopicId> = { project: "project", partner: "partner", "partner-program": "partner", career: "career", careers: "career", job: "career", internship: "career", training: "training" };

export function ContactDesk({ courses }: { courses: string[] }) {
  const [id, setId] = useState<TopicId>("project");
  const [ticked, setTicked] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("topic") ?? window.location.hash.replace("#", "");
    const t = FROM_LINK[q.toLowerCase()];
    if (t) setId(t); // eslint-disable-line react-hooks/set-state-in-effect -- reads the address once after the page has loaded
  }, []);

  const topic = TOPICS.find((t) => t.id === id) ?? TOPICS[0];
  const pick = (next: TopicId, ways: string[] = [], scroll = false) => {
    setId(next);
    setTicked(ways);
    setRound((n) => n + 1);
    if (scroll) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="ctd" aria-label="Contact">
      <div className="hb2-wrap">
        <div className="ctd-card">
          <div className="ctd-tabs" role="tablist" aria-label="What do you want to talk about?">
            {TOPICS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={t.id === id} className="ctd-tab" onClick={() => pick(t.id)}>
                <span className="ctd-ic" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.icon} />
                  </svg>
                </span>
                <span className="ctd-tl">{t.label}</span>
                <span className="ctd-ts">{t.short}</span>
              </button>
            ))}
          </div>

          <div className="ctd-main" ref={panel}>
            <div className="ctd-side" key={topic.id}>
              <h2>{topic.title}</h2>
              <p>{topic.text}</p>
              <div className="ctd-links">
                {topic.links.map((l) =>
                  l.href.startsWith("#") ? (
                    <a key={l.href} href={l.href} className="ctd-link">
                      {l.label}
                    </a>
                  ) : (
                    <Link key={l.href} href={l.href} className="ctd-link">
                      {l.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div className="hb2-ct-panel ctd-form">
              <HomeContact key={`${topic.id}-${round}`} topic={topic} courses={courses} ticked={ticked} />
            </div>
          </div>
        </div>

        <section id="partner-program" className="ctd-pp" aria-labelledby="ctd-pp-t">
          <p className="ctd-kick">Partner program</p>
          <h2 id="ctd-pp-t">
            Grow with <em>We3vision</em>, in the way that suits you
          </h2>
          <p className="ctd-pp-sub">There is more than one way to work with us. Choose the one that fits your company and send us a request: we reply to every partner message.</p>
          <ul className="ctd-ways">
            {PARTNER_WAYS.map((w, i) => (
              <li key={w.id} className="ctd-way">
                <span className="ctd-wn">{String(i + 1).padStart(2, "0")}</span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                <button type="button" className="ctd-wb" onClick={() => pick("partner", [w.title], true)}>
                  Partner this way
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
