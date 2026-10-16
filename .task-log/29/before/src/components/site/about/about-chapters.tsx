"use client";

import { useEffect, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { PandaMini } from "./panda-mini";

// "Our story" of the About page, as text: the five chapters one under the other on a line that is drawn while you scroll (each one comes
// in when you reach it), and at the end a card where Pando, the panda of We3vision, says a few things one after the other. Light: an
// IntersectionObserver and one timer that only runs while the card is on the screen. The look is in globals.css (.ac-*).

type Chapter = { title: string; text: string };

const two = (n: number) => String(n).padStart(2, "0");

export function AboutChapters({ id, chip, heading, chapters, meet }: { id?: string; chip: string; heading: string; chapters: Chapter[]; meet: { chip: string; heading: string; text: string; tips: string[] } }) {
  const listRef = useRef<HTMLOListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) (e.target as HTMLElement).dataset.in = "true";
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.1 },
    );
    items.forEach((el) => io.observe(el));
    let raf = 0;
    const draw = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      list.style.setProperty("--p", Math.min(1, Math.max(0, (window.innerHeight * 0.62 - r.top) / Math.max(1, r.height))).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // the panda talks while its card is on the screen
  useEffect(() => {
    const card = cardRef.current;
    if (!card || meet.tips.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(() => setTip((t) => (t + 1) % meet.tips.length), 4200);
    });
    io.observe(card);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [meet.tips.length]);

  return (
    <section id={id || "story"} className="ac py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <div className="ac-grid">
          <header className="ac-head">
            <span className="md-chip">{chip}</span>
            <h2 className="text-vfade md-h2">{heading}</h2>
          </header>
          <ol ref={listRef} className="ac-list">
            {chapters.map((c, i) => (
              <li key={i} className="ac-item">
                <span className="ac-dot" aria-hidden />
                <span className="ac-no">{two(i + 1)}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div ref={cardRef} className="ac-meet bglow">
          <GlowEdge />
          <div className="ac-panda">
            <PandaMini />
            <p className="ac-bubble" key={tip} aria-live="polite">
              {meet.tips[tip] ?? ""}
            </p>
          </div>
          <div>
            <span className="md-chip">{meet.chip}</span>
            <h3 className="ac-meet-h">{meet.heading}</h3>
            <p className="ac-meet-p">{meet.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
