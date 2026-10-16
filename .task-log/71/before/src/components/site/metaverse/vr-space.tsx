"use client";

import { useEffect, useRef, useState } from "react";
import { ARTS, SpaceBackground } from "./space-art";

// The second scene of the Metaverse page: the view inside the headset. It starts black (where the office ends), a random space fades in
// behind a soft blur and three glass windows float in front of it: the first one (left) comes to the middle, then the next one, then the
// last one (right), one after the other while the visitor scrolls. Each window shows a place where the metaverse is used, with a picture
// and a few words. The windows are plain DOM elements with a 3D transform: the scroll only changes position, depth, turn and opacity.
// Without motion (or on a tiny screen) the windows are simply one under the other.

export type SpaceWindow = {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  cards: { title: string; text: string }[];
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};

const ICON = [
  "M3 9l9-5 9 5-9 5-9-5zM7 12v4l5 3 5-3v-4",
  "M4 8h16l-1.5 11h-13L4 8zM9 8a3 3 0 016 0",
  "M12 3l2.6 5.4 5.9.9-4.3 4.2 1 5.9L12 16.6 6.8 19.4l1-5.9L3.5 9.3l5.9-.9L12 3z",
];

export function VrSpace({ windows }: { windows: SpaceWindow[] }) {
  const n = windows.length;
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const winRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLElement | null)[]>([]);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage || n < 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [n]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage || n < 1) return;
    if (!pinned) {
      winRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = "";
          el.style.opacity = "";
          el.dataset.on = "true";
        }
      });
      if (bgRef.current) bgRef.current.style.opacity = "1";
      if (blackRef.current) blackRef.current.style.opacity = "0";
      return;
    }
    let raf = 0;
    const place = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const dist = Math.max(1, r.height - window.innerHeight);
      const p = clamp(-r.top / dist);
      const W = stage.clientWidth;
      const narrow = W < 760;
      const panelW = Math.min(narrow ? W * 0.88 : 940, W * 0.84);
      const gap = panelW * (narrow ? 1.08 : 0.9);
      // from black into the space, then one window after the other
      const enter = smooth(p / 0.1);
      if (blackRef.current) blackRef.current.style.opacity = String(Math.max(1 - enter, smooth((p - 0.94) / 0.06)));
      if (bgRef.current) {
        bgRef.current.style.opacity = String(enter);
        bgRef.current.style.transform = `translate3d(${(-p * 3).toFixed(2)}%, 0, 0) scale(${(1.14 - p * 0.06).toFixed(3)})`;
      }
      const seg = n > 1 ? clamp((p - 0.1) / 0.84) * (n - 1) : 0;
      const i = Math.min(Math.max(0, n - 2), Math.floor(seg));
      const f = n < 2 ? 0 : i + smooth((seg - i - 0.26) / 0.48);
      winRefs.current.forEach((el, k) => {
        if (!el) return;
        const d = k - f;
        const a = Math.abs(d);
        const x = d * gap;
        const z = -Math.min(a, 2.2) * (narrow ? 160 : 280) - (1 - enter) * 340;
        const rot = clamp(d, -1.6, 1.6) * (narrow ? -16 : -24);
        const sc = 1 - Math.min(a, 1.6) * 0.07;
        const o = enter * (1 - Math.min(1, a) * 0.62) * (a > 2.1 ? 0 : 1);
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.opacity = o.toFixed(3);
        el.style.pointerEvents = a < 0.5 ? "auto" : "none";
        el.dataset.on = a < 0.55 ? "true" : "false";
      });
      dotRefs.current.forEach((el, k) => {
        if (el) el.dataset.on = String(Math.abs(k - f) < 0.5);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, pinned]);

  if (n < 1) return null;

  return (
    <section ref={trackRef} id="space" className="vs" data-pin={pinned} style={{ "--n": n } as React.CSSProperties} aria-label="Where the metaverse is used">
      <div ref={stageRef} className="vs-stage">
        <div ref={bgRef} className="vs-bg" aria-hidden>
          <SpaceBackground className="vs-bg-canvas" />
        </div>
        <div className="vs-haze" aria-hidden />
        <div className="vs-fade vs-fade-t" aria-hidden />
        <div className="vs-fade vs-fade-b" aria-hidden />

        <div className="vs-wins">
          {windows.map((w, i) => {
            const Art = ARTS[i % ARTS.length];
            return (
              <article
                key={i}
                ref={(el) => {
                  winRefs.current[i] = el;
                }}
                className="vs-win lg"
                data-on={i === 0}
              >
                <div className="vs-hero">
                  {w.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.image} alt="" className="vs-art" loading="lazy" />
                  ) : (
                    <Art />
                  )}
                  <div className="vs-shade" aria-hidden />
                  <div className="vs-hero-text">
                    <span className="vs-eyebrow">{w.eyebrow}</span>
                    <h2>{w.title}</h2>
                    <p>{w.text}</p>
                  </div>
                </div>
                <ul className="vs-cards">
                  {w.cards.map((c, k) => (
                    <li key={k} className="vs-card" style={{ "--k": k } as React.CSSProperties}>
                      <span className="vs-ic" aria-hidden>
                        <svg viewBox="0 0 24 24">
                          <path d={ICON[(i + k) % ICON.length]} />
                        </svg>
                      </span>
                      <div>
                        <h3>{c.title}</h3>
                        <p>{c.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <span className="vs-grab" aria-hidden />
              </article>
            );
          })}
        </div>

        <div className="vs-dots" aria-hidden>
          {windows.map((_, i) => (
            <i
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              data-on={i === 0}
            />
          ))}
        </div>
        <div ref={blackRef} className="vs-black" aria-hidden />
      </div>
    </section>
  );
}
