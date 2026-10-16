"use client";

import { useEffect, useRef, useState } from "react";

// The box of the SEO page (the "guide" section with the scene "serp"): a search results page with your website at the bottom of the list. Five
// improvements can be switched on (page title, speed, content, backlinks, mobile): every one lifts your website one place, the score ring fills
// and the traffic grows. It runs by itself while it is on the screen and stops as soon as the visitor touches it. No cartoon guide. The look is in
// globals.css (.sl-*).

const STEPS = [
  { name: "Page title & meta", hint: "Titles that match what people type" },
  { name: "Fast loading", hint: "Core Web Vitals in the green" },
  { name: "Helpful content", hint: "Pages that answer the question" },
  { name: "Quality backlinks", hint: "Trusted sites link to you" },
  { name: "Mobile friendly", hint: "Great on every phone" },
];
const RIVALS = [
  { name: "Competitor A", url: "competitor-a.com", text: "A long list of services and a contact form." },
  { name: "Competitor B", url: "competitor-b.com", text: "Prices, plans and a blog that is rarely updated." },
  { name: "Competitor C", url: "competitor-c.com", text: "About us, our team and our story." },
  { name: "Competitor D", url: "competitor-d.com", text: "Welcome to our website. Call us today." },
  { name: "Competitor E", url: "competitor-e.com", text: "Home page. Latest news and offers." },
];
const ROW = 76;

export function SeoLab() {
  const [done, setDone] = useState<boolean[]>([false, false, false, false, false]);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const n = done.filter(Boolean).length;
  const rank = 6 - n;
  const score = n * 20;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // by itself: one improvement after the other, then it starts again
  useEffect(() => {
    if (!auto || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(
      () => {
        setDone((d) => {
          const i = d.indexOf(false);
          if (i === -1) return [false, false, false, false, false];
          const next = [...d];
          next[i] = true;
          return next;
        });
      },
      n === 5 ? 3400 : 1700,
    );
    return () => window.clearTimeout(t);
  }, [auto, inView, n]);

  // the order of the results: your website at its rank, the others in their order round it
  const order: { key: string; you: boolean; r: (typeof RIVALS)[number] | null }[] = [];
  let ri = 0;
  for (let i = 0; i < 6; i++) {
    if (i === rank - 1) order.push({ key: "you", you: true, r: null });
    else order.push({ key: RIVALS[ri].name, you: false, r: RIVALS[ri++] });
  }

  const C = 2 * Math.PI * 34;
  return (
    <div ref={rootRef} className="sl" data-rank={rank}>
      <div className="sl-bar">
        <span className="sl-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="sl-q">
          <svg viewBox="0 0 20 20" aria-hidden>
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M13 13l4 4" />
          </svg>
          best company near you
        </span>
      </div>

      <div className="sl-main">
        <div className="sl-results">
          <p className="sl-count">About 12,400,000 results · your website is #{rank}</p>
          <ul className="sl-list" style={{ height: ROW * 6 }}>
            {order.map((o, i) => (
              <li key={o.key} className="sl-row" data-you={o.you} style={{ transform: `translateY(${i * ROW}px)` }}>
                <span className="sl-pos">{i + 1}</span>
                <span className="sl-fav" aria-hidden>
                  {o.you ? "W" : "C"}
                </span>
                <span className="sl-txt">
                  <small>{o.you ? "we3vision.com" : o.r?.url}</small>
                  <b>{o.you ? "Your website · the best answer for this search" : `${o.r?.name} | Services`}</b>
                  <i>{o.you ? "Fast, helpful and trusted: this is the page people were looking for." : o.r?.text}</i>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="sl-side" aria-label="What makes a website climb">
          <div className="sl-score">
            <svg viewBox="0 0 80 80" aria-hidden>
              <circle className="sl-ring-bg" cx="40" cy="40" r="34" />
              <circle className="sl-ring" cx="40" cy="40" r="34" strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} />
            </svg>
            <b>{score}</b>
            <span>SEO score</span>
          </div>
          <div className="sl-traffic" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} data-on={n > i} style={{ height: `${28 + i * 16}%` }} />
            ))}
          </div>
          <ul className="sl-steps">
            {STEPS.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  data-on={done[i]}
                  aria-pressed={done[i]}
                  onClick={() => {
                    setAuto(false);
                    setDone((d) => d.map((v, k) => (k === i ? !v : v)));
                  }}
                >
                  <i aria-hidden />
                  <span>
                    <b>{s.name}</b>
                    <small>{s.hint}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
