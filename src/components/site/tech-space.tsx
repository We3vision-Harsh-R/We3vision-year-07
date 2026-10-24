"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { techDetail } from "@/lib/cms/content/tech-details";
import { SmartLink } from "./smart-link";

type Pop = { cat: string; rect: { left: number; right: number; top: number; bottom: number }; sticky: boolean; y: number };

const RMIN = 100; // the first orbit (the smaller radius of its ellipse, px)

// The planets are not in a row on a spiral: every planet gets its own orbit, its own place on it and its own speed, like in a galaxy. It is
// "random" but always the same for the same technologies (the numbers come from the names, so the server and the browser agree).
const seedOf = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// The technologies of a service as a small solar system, all on ONE screen: the sun is we3vision.com, every group of technologies (front end,
// back end, databases...) is a planet on its own orbit, named after the group. The planets go round the sun. Hover (or tap, or focus with the
// keyboard) a planet and a pop-up opens next to it with the technologies inside that planet; pick one and you see what can be built with it,
// which kinds of business it suits and why we use it, while the page behind goes blurry. Only the colours of the brand are used. On a tablet
// or a phone the planets are a grid of cards (no orbits) and the pop-up is a sheet from the bottom. Nothing moves for visitors who prefer
// less motion.
export function TechSpace({ items }: { items: string[] }) {
  const groups = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const name of items) {
      const cat = techDetail(name)?.cat ?? "More tools";
      m.set(cat, [...(m.get(cat) ?? []), name]);
    }
    return [...m.entries()];
  }, [items]);
  const K = groups.length;
  // for every planet: which orbit (shuffled, so the sizes of the orbits do not follow the order), where it starts and how long a round takes
  const layout = useMemo(() => {
    const rand = rng(seedOf(groups.map(([c]) => c).join("|")));
    const shuffle = <T,>(list: T[]) => {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      return list;
    };
    const slots = shuffle(Array.from({ length: K }, (_, i) => i));
    // the places on the orbits: one in every slice of the circle (so that two planets do not start on top of each other), at a random point of it, shuffled
    const angles = shuffle(Array.from({ length: K }, (_, i) => Math.round(((i + 0.15 + rand() * 0.7) * 360) / K)));
    return groups.map((_, k) => ({
      f: K === 1 ? 0.5 : slots[k] / (K - 1),
      a0: angles[k],
      dur: Math.round(55 + rand() * 120), // seconds for one round: from about a minute to three minutes
    }));
  }, [groups, K]);

  const stageRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [pop, setPop] = useState<Pop | null>(null);
  const [sel, setSel] = useState("");
  const [pos, setPos] = useState<{ left: number; top: number; cx: number; cy: number; w: number; h: number } | null>(null);
  const timers = useRef<{ open: number; close: number }>({ open: 0, close: 0 });

  // the size of the orbits follows the size of the stage, so the whole system always fits on the screen (the orbits are wide ellipses)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      // a little smaller than the stage on every side: the planet labels and the pop-ups need room, and the whole system must stay inside the screen
      // the whole system is smaller than the room it has: even on a tall screen the orbits stay compact
      const ymax = Math.max(84, Math.min(h / 2 - 62, 190));
      // on a low screen the first orbit comes closer to the sun too, so the system keeps its shape and still fits
      const rmin = Math.min(RMIN, Math.max(70, ymax * 0.55));
      const asp = Math.max(1, Math.min(2.4, (w / 2 - 190) / ymax));
      stage.style.setProperty("--rymin", `${rmin.toFixed(0)}px`);
      stage.style.setProperty("--rymax", `${ymax.toFixed(0)}px`);
      stage.style.setProperty("--asp", asp.toFixed(3));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const openPop = useCallback(
    (cat: string, el: HTMLElement, sticky: boolean, delay: number) => {
      window.clearTimeout(timers.current.open);
      window.clearTimeout(timers.current.close);
      const go = () => {
        const r = el.getBoundingClientRect();
        const names = groups.find(([c]) => c === cat)?.[1] ?? [];
        setSel(names[0] ?? "");
        setPos(null);
        setPop({ cat, rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom }, sticky, y: window.scrollY });
      };
      if (delay) timers.current.open = window.setTimeout(go, delay);
      else go();
    },
    [groups],
  );
  const closePop = useCallback((delay = 0) => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
    if (delay) timers.current.close = window.setTimeout(() => setPop(null), delay);
    else setPop(null);
  }, []);
  useEffect(
    () => () => {
      window.clearTimeout(timers.current.open);
      window.clearTimeout(timers.current.close);
    },
    [],
  );

  // place the pop-up next to the planet (on the right if there is room, else on the left), kept inside the screen
  useLayoutEffect(() => {
    if (!pop || !popRef.current) return;
    const w = popRef.current.offsetWidth;
    const h = popRef.current.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 16;
    const r = pop.rect;
    let left = r.right + gap;
    if (left + w > vw - 12) left = r.left - gap - w;
    if (left < 12) left = Math.min(Math.max(12, r.left + (r.right - r.left) / 2 - w / 2), vw - w - 12);
    const top = Math.min(Math.max(12, r.top + (r.bottom - r.top) / 2 - h / 2), vh - h - 12);
    setPos({ left, top, cx: left + w / 2, cy: top + h / 2, w, h });
  }, [pop, sel]);

  useLayoutEffect(() => {
    const box = toolsRef.current;
    const on = box?.querySelector<HTMLElement>('button[data-on="true"]');
    if (!box || !on) return;
    box.style.setProperty("--tx", `${on.offsetLeft}px`);
    box.style.setProperty("--tw", `${on.offsetWidth}px`);
    if (on.offsetLeft + on.offsetWidth > box.scrollLeft + box.clientWidth || on.offsetLeft < box.scrollLeft) box.scrollLeft = Math.max(0, on.offsetLeft - 24);
  }, [pop, sel]);

  // close on Escape and when the page scrolls away
  useEffect(() => {
    if (!pop) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePop();
    const onScroll = () => Math.abs(window.scrollY - pop.y) > 40 && closePop();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pop, closePop]);

  const popNames = pop ? (groups.find(([c]) => c === pop.cat)?.[1] ?? []) : [];
  const d = sel ? techDetail(sel) : undefined;

  return (
    <div className="ts-wrap">
      <p className="ts-hint">
        <span aria-hidden>✦</span> Hover a planet to open the technologies inside it
      </p>
      <div ref={stageRef} className="ts-stage" data-pause={!!pop} data-pause-off>
        <div className="ts-system">
          {groups.map(([cat, names], k) => {
            const { f, a0, dur } = layout[k];
            const size = 34 + Math.min(names.length, 8) * 3;
            return (
              <div
                key={cat}
                className="ts-orbit"
                style={{ "--ry": `calc(var(--rymin, 128px) + (var(--rymax, 300px) - var(--rymin, 128px)) * ${f.toFixed(3)})`, "--a0": `${a0}deg`, animationDuration: `${dur}s` } as React.CSSProperties}
              >
                <button
                  type="button"
                  className="ts-planet"
                  data-ring={k % 2 === 0}
                  style={{ "--s": `${size}px`, "--l": 62 - k * 3 } as React.CSSProperties}
                  aria-haspopup="dialog"
                  aria-expanded={pop?.cat === cat}
                  aria-label={`${cat}: ${names.length} technologies`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && openPop(cat, e.currentTarget, false, 100)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && closePop(300)}
                  onClick={(e) => (pop?.cat === cat && pop.sticky ? closePop() : openPop(cat, e.currentTarget, true, 0))}
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && openPop(cat, e.currentTarget, false, 0)}
                  onBlur={() => closePop(200)}
                >
                  <i className="ts-sphere" aria-hidden />
                  <span className="ts-pl-name">
                    <b>{cat}</b>
                    <small>
                      {names.length} {names.length === 1 ? "tool" : "tools"}
                    </small>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="ts-sun" aria-hidden>
          <i />
          {/* the logo of the company (white mark) in the sun */}
          <Image src="/brand/logo-white.webp" alt="" width={600} height={468} className="ts-logo" unoptimized />
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            {/* the blur behind the pop-up: five layers, the blur is strongest right around the box and gets weaker the farther away you look */}
            <div
              className="tx-back"
              data-on={!!pop}
              data-sticky={!!pop?.sticky}
              style={
                pop
                  ? ({
                      "--bx": `${pos ? pos.cx : (pop.rect.left + pop.rect.right) / 2}px`,
                      "--by": `${pos ? pos.cy : (pop.rect.top + pop.rect.bottom) / 2}px`,
                      "--bw": `${pos ? pos.w / 2 : 120}px`,
                      "--bh": `${pos ? pos.h / 2 : 120}px`,
                    } as React.CSSProperties)
                  : undefined
              }
              onClick={() => closePop()}
              aria-hidden
            >
              <i />
              <i />
              <i />
              <i />
              <i />
              <b />
            </div>
            {pop && (
              // LOCKED: the design of this pop-up card was confirmed by the user. Do not change it without asking first.
              <div
                ref={popRef}
                className="tx-pop"
                role="dialog"
                aria-label={`${pop.cat}: the technologies inside`}
                style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: "hidden" }}
                onPointerEnter={() => window.clearTimeout(timers.current.close)}
                onPointerLeave={(e) => e.pointerType === "mouse" && !pop.sticky && closePop(300)}
              >
                <button type="button" className="tx-x" onClick={() => closePop()} aria-label="Close">
                  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                <header className="tx-head">
                  <span className="tx-orb" aria-hidden>
                    <i />
                  </span>
                  <div className="tx-ht">
                    <span className="tx-crumb">we3vision / stack / {pop.cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</span>
                    <h3>{pop.cat}</h3>
                    <p>
                      {popNames.length} {popNames.length === 1 ? "technology" : "technologies"} inside
                    </p>
                  </div>
                </header>
                <div ref={toolsRef} className="tx-tools" role="tablist" aria-label="Technologies">
                  <span className="tx-thumb" aria-hidden />
                  {popNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      aria-selected={sel === name}
                      data-on={sel === name}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setSel(name)}
                      onClick={() => setSel(name)}
                      onFocus={() => setSel(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <div className="tx-body">
                  <div key={sel} className="tx-detail" role="tabpanel">
                    <div className="tx-toolhead">
                      <h4>{sel}</h4>
                      <span>{d?.cat ?? "Technology"}</span>
                    </div>
                    {d ? (
                      <>
                        <p className="tx-tag">{d.tagline}</p>
                        <b className="tx-l">What you can build</b>
                        <ol className="tx-builds">
                          {d.builds.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ol>
                        <b className="tx-l">Great for</b>
                        <div className="tx-inds">
                          {d.industries.map((x) => (
                            <span key={x}>{x}</span>
                          ))}
                        </div>
                        <blockquote className="tx-why">
                          <b>Why we use it</b>
                          {d.why}
                        </blockquote>
                      </>
                    ) : (
                      <blockquote className="tx-why">
                        <b>Our take</b>We use {sel} where it fits your project. Tell us what you want to build and we will pick the right tools for it.
                      </blockquote>
                    )}
                  </div>
                </div>
                <footer className="tx-foot">
                  <SmartLink href="#contact" className="tx-cta" onClick={() => closePop()}>
                    Build with {sel}
                    <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </SmartLink>
                  <span>we3vision.com</span>
                </footer>
              </div>
            )}
          </>,
          document.body,
        )}
    </div>
  );
}
