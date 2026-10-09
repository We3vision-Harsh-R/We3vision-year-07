"use client";

import { useEffect, useRef, useState } from "react";
import { PersonTop } from "../timeline-art";

// How we build a metaverse project, on a 3D floor like the process of the other service pages, but made for this page: the floor is the
// floor of the metaverse studio, the steps are round teleport pads on a winding road, and Rutvi (the girl of the office) walks the road
// while the page scrolls. At every pad she stops and turns to the visitor, a hologram stands up over the pad (an icon and the name of the
// step) and the panel on the right tells what happens in that step; then she walks on to the next pad. The part of the road she has
// walked is lit. The panel has dots to jump to a step. On a tablet, a phone and for visitors who prefer less motion there is no 3D: a plain
// list of the steps with a line down the side, and Rutvi walks down the line while you read. The look is in globals.css (.mp-*).

type Item = { title: string; text: string; points: string };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
const lines = (t: string) => (t || "").split("\n").map((l) => l.trim()).filter(Boolean);
const two = (n: number) => String(n).padStart(2, "0");

const STEP = 360; // distance between two pads on the floor (px in the floor plane)
const FLOOR_W = 1400;
const padX = (i: number) => (i % 2 ? 1 : -1) * (110 + ((i * 53) % 80));

/** one line icon for each step (a goal, a route, a floor plan, code and a cube, a headset that is checked, a rocket) */
function Icon({ k, className = "mp-ico" }: { k: number; className?: string }) {
  const i = k % 6;
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      {i === 0 && (
        <>
          <circle cx="22" cy="26" r="15" />
          <circle cx="22" cy="26" r="8" />
          <circle cx="22" cy="26" r="2" className="mp-fill" />
          <path d="M22 26L38 10M32 9h7v7" />
        </>
      )}
      {i === 1 && (
        <>
          <circle cx="11" cy="38" r="3" className="mp-fill" />
          <path d="M11 38C11 26 33 32 33 20" strokeDasharray="3 4" />
          <path d="M33 5a7 7 0 0 1 7 7c0 6-7 11-7 11s-7-5-7-11a7 7 0 0 1 7-7z" />
          <circle cx="33" cy="12" r="2.4" className="mp-fill" />
        </>
      )}
      {i === 2 && (
        <>
          <rect x="7" y="7" width="34" height="34" rx="3" />
          <path d="M7 24h15M27 7v17M27 32h14M22 24v17" />
          <circle cx="34" cy="16" r="2.2" className="mp-fill" />
        </>
      )}
      {i === 3 && (
        <>
          <path d="M24 12l10 6v12l-10 6-10-6V18z" />
          <path d="M24 12v12m0 0l10-6M24 24l-10-6" />
          <path d="M7 20l-4 4 4 4M41 20l4 4-4 4" />
        </>
      )}
      {i === 4 && (
        <>
          <rect x="7" y="9" width="34" height="17" rx="7" />
          <circle cx="17" cy="17.5" r="3.4" />
          <circle cx="31" cy="17.5" r="3.4" />
          <path d="M14 36l7 7 13-14" />
        </>
      )}
      {i === 5 && (
        <>
          <path d="M24 4c7 6 9 15 7 26H17C15 19 17 10 24 4z" />
          <circle cx="24" cy="18" r="3.4" />
          <path d="M18 26l-7 7M30 26l7 7M21 36l-3 8M27 36l3 8" />
        </>
      )}
    </svg>
  );
}

export function VrProcess({ id, chip, heading, intro, items }: { id?: string; chip: string; heading: string; intro: string; items: Item[] }) {
  const n = items.length;
  const rootRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const rutviRef = useRef<HTMLDivElement>(null); // on the floor
  const railRutviRef = useRef<HTMLDivElement>(null); // on the line of the list
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const segRefs = useRef<(SVGPathElement | null)[]>([]);
  const onRefs = useRef<(SVGPathElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const jump = useRef<(k: number) => void>(() => {});

  // the floor: a road through the pads (all in floor coordinates)
  const H = (n + 1) * STEP + 700;
  const pts = items.map((_, i) => ({ x: FLOOR_W / 2 + padX(i), y: H - 460 - i * STEP }));
  const segD = (i: number) => `M ${pts[i].x} ${pts[i].y} C ${pts[i].x} ${pts[i].y - STEP / 2} ${pts[i + 1].x} ${pts[i + 1].y + STEP / 2} ${pts[i + 1].x} ${pts[i + 1].y}`;
  const first = pts[0];
  const lastPt = pts[n - 1];
  const roadD = n
    ? `M ${FLOOR_W / 2} ${H + 200} C ${FLOOR_W / 2} ${H - 40} ${first.x} ${first.y + 200} ${first.x} ${first.y}` +
      pts
        .slice(1)
        .map((p, k) => ` C ${pts[k].x} ${pts[k].y - STEP / 2} ${p.x} ${p.y + STEP / 2} ${p.x} ${p.y}`)
        .join("") +
      ` C ${lastPt.x} ${lastPt.y - 220} ${FLOOR_W / 2} ${lastPt.y - 300} ${FLOOR_W / 2} ${lastPt.y - 700}`
    : "";

  useEffect(() => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    const rail = railRef.current;
    const rutvi = rutviRef.current;
    const railRutvi = railRutviRef.current;
    if (!root || !sticky || !rail || !rutvi || !railRutvi || n < 2) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let frameRaf = 0;
    let target = 0;
    let cur = -1;
    let lastT = 0;
    let lastIdx = -1;
    let lastX = 0;
    let lastY = 0;
    let idleT = 0;
    let lens: number[] = [];
    let railPts: { x: number; y: number }[] = [];

    const settle = (el: HTMLElement) => {
      window.clearTimeout(idleT);
      idleT = window.setTimeout(() => {
        if (el.dataset.pose === "walk") el.dataset.pose = "idle";
      }, 150);
    };
    const put = (el: HTMLElement, x: number, y: number, rot: number, moving: boolean, scale = 1) => {
      el.style.visibility = "visible";
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale})`;
      el.style.setProperty("--rot", `${rot.toFixed(1)}deg`);
      const pose = moving ? "walk" : "idle";
      if (el.dataset.pose !== pose) el.dataset.pose = pose;
      settle(el);
    };

    // ---- the floor: the scroll walks Rutvi along the road, the camera follows her ----
    const frame3d = (now: number) => {
      frameRaf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000 || 0.016));
      lastT = now;
      if (cur < 0) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 8));
      if (Math.abs(target - cur) < 0.0006) cur = target;
      sticky.style.setProperty("--f", cur.toFixed(4));
      const k = Math.min(n - 2, Math.max(0, Math.floor(cur)));
      const frac = clamp(cur - k);
      const seg = segRefs.current[k];
      if (seg && lens[k]) {
        const L = lens[k] * frac;
        const p = seg.getPointAtLength(L);
        const a = seg.getPointAtLength(Math.max(0, L - 3));
        const b = seg.getPointAtLength(Math.min(lens[k], L + 3));
        const moving = frac > 0.004 && frac < 0.996;
        // she looks the way she walks (away from us, up the floor); at a pad she turns round to the visitor
        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90;
        const turn = smooth(Math.min(frac, 1 - frac) / 0.12);
        put(rutvi, p.x, p.y, moving ? ang * turn : 0, moving || Math.hypot(p.x - lastX, p.y - lastY) > 0.5, 2.3);
        lastX = p.x;
        lastY = p.y;
      }
      for (let i = 0; i < n - 1; i++) {
        const on = onRefs.current[i];
        if (!on || !lens[i]) continue;
        const f = cur >= i + 1 ? 1 : cur <= i ? 0 : cur - i;
        on.style.strokeDashoffset = `${(lens[i] * (1 - f)).toFixed(1)}`;
      }
      const idx = Math.round(cur);
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
      if (cur !== target) frameRaf = requestAnimationFrame(frame3d);
    };
    const on3dScroll = () => {
      const r = root.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const p = clamp((top - r.top) / dist);
      const seg = p * (n - 1);
      const i = Math.min(n - 2, Math.floor(seg));
      // every step holds for a while at its pad: the walk to the next one happens in the middle of its part of the scroll
      target = p >= 1 ? n - 1 : i + smooth((seg - i - 0.3) / 0.4);
      if (!frameRaf) {
        lastT = performance.now();
        frameRaf = requestAnimationFrame(frame3d);
      }
    };

    // ---- the list: Rutvi walks down the line at the side while the list is read ----
    const measureList = () => {
      const mr = rail.getBoundingClientRect();
      railPts = itemRefs.current.map((el) => {
        const pad = el?.querySelector<HTMLElement>(".mp-pad");
        const r = pad?.getBoundingClientRect();
        return r ? { x: r.left - mr.left + r.width / 2, y: r.top - mr.top + r.height / 2 } : { x: 30, y: 30 };
      });
    };
    const onListScroll = () => {
      if (!railPts.length) return;
      const mr = rail.getBoundingClientRect();
      const f0 = railPts[0];
      const l0 = railPts[n - 1];
      const y = clamp(window.innerHeight * 0.55 - mr.top, f0.y, l0.y);
      const moving = Math.abs(y - lastY) > 0.4;
      lastY = y;
      put(railRutvi, f0.x, y, 0, moving);
      rail.style.setProperty("--prog", `${(y - f0.y).toFixed(1)}px`);
      let a = 0;
      railPts.forEach((p, i) => {
        if (p.y <= y + 8) a = i;
      });
      setActive((prev) => (prev === a ? prev : a));
    };

    const run = () => {
      const is3d = mq.matches;
      root.dataset.mode = is3d ? "3d" : "list";
      lens = segRefs.current.map((s) => s?.getTotalLength() ?? 0);
      segRefs.current.forEach((s, i) => {
        const on = onRefs.current[i];
        if (s && on) {
          on.setAttribute("d", s.getAttribute("d") ?? "");
          on.style.strokeDasharray = `${lens[i]}`;
        }
      });
      if (is3d) on3dScroll();
      else {
        measureList();
        onListScroll();
      }
    };
    const onScroll = () => {
      if (mq.matches) on3dScroll();
      else if (!raf) raf = requestAnimationFrame(() => ((raf = 0), onListScroll()));
    };
    const onResize = () => {
      run();
    };

    jump.current = (kk: number) => {
      const to = Math.min(n - 1, Math.max(0, kk));
      if (!mq.matches) {
        itemRefs.current[to]?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const dist = Math.max(1, root.offsetHeight - sticky.offsetHeight);
      const y = root.getBoundingClientRect().top + window.scrollY - top + (to / (n - 1)) * dist;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    };

    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(rail);
    document.fonts.ready.then(onResize, onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (frameRaf) cancelAnimationFrame(frameRaf);
      window.clearTimeout(idleT);
    };
  }, [n]);

  if (n < 1) return null;
  const cur = items[Math.min(active, n - 1)];
  const flatHeading = heading.replace(/\n/g, " ");
  const stateOf = (i: number) => (i < active ? "past" : i === active ? "active" : i === active + 1 ? "next" : "far");

  return (
    <section id={id || "process"} ref={rootRef} className="mp" data-mode="list" style={{ "--n": n } as React.CSSProperties} aria-label={flatHeading}>
      {/* the steps as a list: the real content (shown on a tablet and a phone, read by screen readers on a desktop) */}
      <div className="mp-listwrap">
        <header className="mp-head">
          <span className="mp-chip">{chip}</span>
          <h2>{flatHeading}</h2>
          {intro && <p>{intro}</p>}
        </header>
        <div ref={railRef} className="mp-rail">
          <ol>
            {items.map((it, i) => (
            <li
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="mp-item"
              data-on={active === i}
              data-done={i < active}
            >
              <span className="mp-pad">
                <Icon k={i} />
                <b>{two(i + 1)}</b>
              </span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
              <ul>
                {lines(it.points).map((t, k) => (
                  <li key={k}>{t}</li>
                ))}
              </ul>
            </li>
            ))}
          </ol>
          <div ref={railRutviRef} className="tl-p of-sp mp-rutvi-list" data-pose="idle" data-face="down" data-wave="false" aria-hidden style={{ "--tone": 340 } as React.CSSProperties}>
            <PersonTop girl />
          </div>
        </div>
      </div>

      {/* the 3D floor (desktop): decoration and the walk; the panel tells the step */}
      <div ref={stickyRef} className="mp-sticky">
        <div className="mp-stage">
          <div className="mp-horizon" aria-hidden />
          <div className="mp-scene" aria-hidden>
            <div className="mp-world" style={{ width: FLOOR_W, height: H, marginLeft: -FLOOR_W / 2 }}>
              <div className="mp-grid" />
              <svg className="mp-svg" width={FLOOR_W} height={H} viewBox={`0 0 ${FLOOR_W} ${H}`}>
                <path d={roadD} className="mp-road" />
                <path d={roadD} className="mp-dash" />
                {Array.from({ length: n - 1 }, (_, i) => (
                  <g key={i}>
                    <path
                      d={segD(i)}
                      ref={(el) => {
                        segRefs.current[i] = el;
                      }}
                      className="mp-seg"
                    />
                    <path
                      d={segD(i)}
                      ref={(el) => {
                        onRefs.current[i] = el;
                      }}
                      className="mp-seg-on"
                    />
                  </g>
                ))}
              </svg>
              {items.map((s, i) => (
                <div key={i} className="mp-padf" data-s={stateOf(i)} style={{ left: pts[i].x - 115, top: pts[i].y - 115 }}>
                  <span className="mp-ring" />
                  <span className="mp-no">{two(i + 1)}</span>
                  <div className="mp-holo">
                    <Icon k={i} className="mp-hico" />
                    <small>Step {two(i + 1)}</small>
                    <b>{s.title}</b>
                  </div>
                </div>
              ))}
              <div ref={rutviRef} className="tl-p of-sp mp-rutvi" data-pose="idle" data-face="down" data-wave="false" style={{ "--tone": 340 } as React.CSSProperties}>
                <PersonTop girl />
              </div>
            </div>
          </div>

          <div className="mp-ui">
            <header className="mp-uihead">
              <span className="mp-chip">{chip}</span>
              <h2>{flatHeading}</h2>
            </header>
            <div className="mp-panel">
              <div key={active} className="mp-p-in">
                <p className="mp-step">
                  Step {active + 1} of {n}
                </p>
                <h3>{cur.title}</h3>
                <p className="mp-text">{cur.text}</p>
                {lines(cur.points).length > 0 && (
                  <ul>
                    {lines(cur.points).map((t, k) => (
                      <li key={k}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mp-dots" role="group" aria-label="Go to a step">
                {items.map((it, i) => (
                  <button key={i} type="button" data-on={i === active} data-done={i < active} aria-label={`${two(i + 1)} ${it.title}`} onClick={() => jump.current(i)} tabIndex={-1}>
                    <i>{two(i + 1)}</i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
