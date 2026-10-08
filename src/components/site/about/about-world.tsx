"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { THEME_EVENT } from "@/lib/theme";
import { SmartLink } from "../smart-link";
import type { World } from "./world";

// The top of the About page as one 3D story. A tall track with a sticky full-screen stage: the 3D world (world.ts) is behind, the words are
// in front. At the start the heading of the page, then five chapters (one per station of the island: the office, the year, Surat, the
// services, the mission) and at the end Pando the panda says hello (click it, move the mouse, it looks at you).
// The 3D part is loaded after the page; the words are in the page from the start. Without WebGL or with reduced motion the chapters are
// simply one under the other.

export type AboutChapter = { title: string; text: string };
export type AboutHero = { chip: string; heading: string; text: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
export type AboutMeet = { chip: string; heading: string; text: string; tips: string[] };

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const themeNow = () => {
  const cs = getComputedStyle(document.documentElement);
  const th = parseFloat(cs.getPropertyValue("--th"));
  const ts = parseFloat(cs.getPropertyValue("--ts"));
  return { hue: Number.isFinite(th) ? th : 284, sat: Number.isFinite(ts) ? ts : 1 };
};

export function AboutWorld({ hero, chapters, meet }: { hero: AboutHero; chapters: AboutChapter[]; meet: AboutMeet }) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const meetRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLElement | null)[]>([]);
  const worldRef = useRef<World | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "flat">("loading");
  const [tip, setTip] = useState(0);
  const [talking, setTalking] = useState(false);
  const tipCount = Math.max(1, meet.tips.length);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!track || !stage || !canvas) return;
    let disposed = false;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let world: World | null = null;
    const mobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    const cleanups: (() => void)[] = [];

    const overlays = (f: number) => {
      const heroO = 1 - clamp((f - 0.15) / 0.35);
      if (heroRef.current) {
        heroRef.current.style.opacity = heroO.toFixed(3);
        heroRef.current.style.transform = `translateY(${((1 - heroO) * -26).toFixed(1)}px)`;
        heroRef.current.style.pointerEvents = heroO > 0.5 ? "auto" : "none";
      }
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - f * 5));
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = f - (i + 1);
        const o = clamp(1 - Math.abs(d) * 2.2);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${(d * -34).toFixed(1)}px)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
      const lastF = chapters.length + 1;
      const meetO = clamp((f - (lastF - 0.55)) / 0.45);
      if (meetRef.current) {
        meetRef.current.style.opacity = meetO.toFixed(3);
        meetRef.current.style.transform = `translateY(${((1 - meetO) * 30).toFixed(1)}px)`;
        meetRef.current.style.pointerEvents = meetO > 0.5 ? "auto" : "none";
      }
      dotRefs.current.forEach((el, i) => {
        if (el) el.dataset.on = String(Math.round(f) === i);
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!world || !visible || document.hidden) {
        last = now;
        return;
      }
      const dt = now - last;
      last = now;
      const r = track.getBoundingClientRect();
      const dist = Math.max(1, r.height - window.innerHeight);
      world.setProgress(clamp(-r.top / dist));
      world.render(dt);
      overlays(world.f);
    };

    (async () => {
      try {
        // visitors who prefer less motion get the words one under the other (no 3D)
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) throw new Error("reduced motion");
        const mod = await import("./world");
        if (disposed) return;
        const t = themeNow();
        const w = mod.createWorld(canvas, { mobile, hue: t.hue, sat: t.sat });
        world = w;
        worldRef.current = w;
        if (process.env.NODE_ENV !== "production") (window as unknown as { __aw?: World }).__aw = w;
        const fit = () => {
          const b = stage.getBoundingClientRect();
          w.resize(Math.max(2, Math.round(b.width)), Math.max(2, Math.round(b.height)));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(stage);
        const onTheme = () => {
          const n = themeNow();
          w.setTint(n.hue, n.sat);
        };
        window.addEventListener(THEME_EVENT, onTheme);
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
        io.observe(track);
        const onMove = (e: PointerEvent) => {
          const b = stage.getBoundingClientRect();
          w.setPointer((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => {
          ro.disconnect();
          io.disconnect();
          window.removeEventListener(THEME_EVENT, onTheme);
          window.removeEventListener("pointermove", onMove);
          w.dispose();
        });
        const rr = track.getBoundingClientRect();
        w.setProgress(clamp(-rr.top / Math.max(1, rr.height - window.innerHeight)), true);
        for (let i = 0; i < 30; i++) w.render(16);
        overlays(w.f);
        setState("ready");
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } catch {
        if (!disposed) setState("flat");
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      worldRef.current = null;
    };
  }, [chapters.length]);

  // the panda says one tip after the other while the visitor is with it
  useEffect(() => {
    if (state !== "ready") return;
    const id = window.setInterval(() => {
      const w = worldRef.current;
      if (!w || w.chapter < chapters.length + 1) return;
      setTip((n) => (n + 1) % tipCount);
      setTalking(true);
      window.setTimeout(() => setTalking(false), 1400);
    }, 6500);
    return () => window.clearInterval(id);
  }, [state, chapters.length, tipCount]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const w = worldRef.current;
      const stage = stageRef.current;
      if (!w || !stage) return;
      const b = stage.getBoundingClientRect();
      if (w.click((e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height)) {
        setTip((n) => (n + 1) % tipCount);
        setTalking(true);
        window.setTimeout(() => setTalking(false), 1400);
      }
    },
    [tipCount],
  );

  // a click on a dot or on a button goes to that part of the story
  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const dist = Math.max(1, track.offsetHeight - window.innerHeight);
      const y = track.getBoundingClientRect().top + window.scrollY + (i / (chapters.length + 1)) * dist;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.5 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [chapters.length],
  );

  return (
    <section ref={trackRef} id="top" className="aw" data-state={state} style={{ "--n": chapters.length } as React.CSSProperties} aria-label="About We3vision">
      <div ref={stageRef} className="aw-stage" onClick={onClick}>
        <canvas ref={canvasRef} className="aw-canvas" aria-hidden />
        <div className="aw-vignette" aria-hidden />

        <div ref={heroRef} className="aw-hero">
          <span className="aw-chip">{hero.chip}</span>
          <h1>{hero.heading}</h1>
          <p>{hero.text}</p>
          <div className="aw-btns">
            <button type="button" className="btn-primary aw-btn" onClick={() => goTo(1)}>
              {hero.primaryLabel}
            </button>
            <SmartLink href={hero.secondaryHref} className="aw-btn aw-btn-ghost">
              {hero.secondaryLabel}
            </SmartLink>
          </div>
        </div>

        <div className="aw-cards">
          {chapters.map((c, i) => (
            <article
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="aw-card"
            >
              <span className="aw-no">{String(i + 1).padStart(2, "0")}</span>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
            </article>
          ))}
        </div>

        <div ref={meetRef} className="aw-meet">
          <span className="aw-chip">{meet.chip}</span>
          <h2>{meet.heading}</h2>
          <p>{meet.text}</p>
          <p className="aw-bubble" role="status" aria-live="polite" key={tip} data-talk={talking}>
            {meet.tips[tip] ?? ""}
          </p>
          <span className="aw-click">Click Pando, move your mouse and say hello</span>
        </div>

        <div className="aw-dots" aria-hidden>
          {Array.from({ length: chapters.length + 2 }, (_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              data-on={i === 0}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
            />
          ))}
        </div>
        <div ref={hintRef} className="aw-hint" aria-hidden>
          <span>Scroll to meet Pando</span>
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
