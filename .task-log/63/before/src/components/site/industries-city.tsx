"use client";

// LOCKED: confirmed by the user (the city of the industries section). Do not change it without asking first.

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IndustryIcon } from "./icons";
import { Box, CITY_R, LANE_BOT, LANE_TOP, PH, PITCH, PW, Piece, Vehicle, district, kindOf } from "./city-scene";

type Item = { name: string; description: string };

const OUT = 28; // the lane of our car is the outer half of the ring road, the oncoming traffic has the inner half
const LEAD = 150; // the camera starts to turn a little before the car reaches the turn
const RX = 58;
const RZ = -34;
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

// "Industries we serve" as a small city on a 3D map. A ring road runs round the city, every industry has its own district with the buildings,
// vehicles and details of that industry, and a car drives from district to district while the page scrolls: it stops in every district and
// the text of that industry is shown next to the map. On a desktop the stage is pinned and the scroll drives the car; the list of the
// industries on the left (click to drive there) and the buttons of the panel do the same. On a tablet, a phone and for visitors who prefer
// less motion there is a clear list of the industries. The real content is the list (the 3D map is decoration).
export function IndustriesCity({ items }: { items: Item[] }) {
  const n = items.length;
  const uid = useId();
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const angRef = useRef(RZ);
  const applyRef = useRef<() => void>(() => {});

  // the map: columns of pads along the road, the lower row goes the other way round (the car drives clockwise)
  const geo = useMemo(() => {
    const cols = Math.max(1, Math.ceil(n / 2));
    const c0 = PW / 2;
    const cL = (cols - 1) * PITCH + PW / 2;
    const rOut = CITY_R + OUT;
    const topLen = cL - c0;
    const arc = Math.PI * rOut;
    const total = 2 * topLen + 2 * arc;
    const ring = (off: number) => `M ${c0} ${LANE_TOP - off} H ${cL} A ${CITY_R + off} ${CITY_R + off} 0 0 1 ${cL} ${LANE_BOT + off} H ${c0} A ${CITY_R + off} ${CITY_R + off} 0 0 1 ${c0} ${LANE_TOP - off} Z`;
    const pr = (LANE_BOT - LANE_TOP) / 2 - 78;
    const isle = `M ${c0} ${LANE_TOP + 78} H ${cL} A ${pr} ${pr} 0 0 1 ${cL} ${LANE_BOT - 78} H ${c0} A ${pr} ${pr} 0 0 1 ${c0} ${LANE_TOP + 78} Z`;
    const pads = items.map((it, i) => {
      const top = i < cols;
      const col = top ? i : cols - 1 - (i - cols);
      const x = col * PITCH;
      const y = top ? 0 : LANE_BOT + 80;
      const stop = top ? col * PITCH : topLen + arc + (cL - (col * PITCH + PW / 2));
      return { x, y, top, kind: kindOf(it.name), stop };
    });
    const car = `M ${c0} ${LANE_TOP - OUT} H ${cL} A ${rOut} ${rOut} 0 0 1 ${cL} ${LANE_BOT + OUT} H ${c0} A ${rOut} ${rOut} 0 0 1 ${c0} ${LANE_TOP - OUT} Z`;
    const mid = ring(0);
    const edgeOut = ring(56);
    const edgeIn = ring(-56);
    const rIn = CITY_R - OUT;
    const oncoming = `M ${cL} ${LANE_TOP + OUT} H ${c0} A ${rIn} ${rIn} 0 0 0 ${c0} ${LANE_BOT - OUT} H ${cL} A ${rIn} ${rIn} 0 0 0 ${cL} ${LANE_TOP + OUT} Z`;
    return { cols, c0, cL, total, arc, topLen, pads, car, mid, edgeOut, edgeIn, isle, oncoming, width: cols * PITCH };
  }, [items, n]);

  // the car and the camera follow the scroll with a soft glide
  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const world = worldRef.current;
    const car = carRef.current;
    const path = pathRef.current;
    if (!track || !sticky || !world || !car || !path || n < 1) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let target = 0;
    let cur = -1;
    let lastT = 0;
    let last = -1;
    let lastAng = 9999;
    // the signs turn back, so that they always face the screen (the list is read again when districts are drawn in full)
    const applySigns = () => {
      const t = `rotateZ(${(-angRef.current).toFixed(2)}deg) rotateX(${-RX}deg) translate(-50%, -100%)`;
      world.querySelectorAll<HTMLElement>(".cm-sign span").forEach((sp) => (sp.style.transform = t));
    };
    applyRef.current = applySigns;
    const camAngle = (d: number) => {
      // the camera has turned right round when the car comes out of the turn
      const w = geo.arc + LEAD;
      return RZ + 180 * smooth((d - (geo.topLen - LEAD)) / w) + 180 * smooth((d - (2 * geo.topLen + geo.arc - LEAD)) / w);
    };
    const place = (fIn: number) => {
      const f = Math.min(n - 1, Math.max(0, Number.isFinite(fIn) ? fIn : 0));
      const i = Math.min(n - 1, Math.floor(f));
      const j = Math.min(n - 1, i + 1);
      const d = geo.pads[i].stop + (geo.pads[j].stop - geo.pads[i].stop) * (j === i ? 0 : f - i);
      const len = geo.total;
      const p = path.getPointAtLength(((d % len) + len) % len);
      const q = path.getPointAtLength((((d + 3) % len) + len) % len);
      const a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      car.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${a.toFixed(1)}deg)`;
      const ang = camAngle(d);
      world.style.transform = `scale(1.1) rotateX(${RX}deg) rotateZ(${ang.toFixed(2)}deg) translate(${(-p.x).toFixed(1)}px, ${(-p.y).toFixed(1)}px)`;
      angRef.current = ang;
      if (Math.abs(ang - lastAng) > 0.05) {
        lastAng = ang;
        applySigns();
      }
      // the side lights of the car blink while it takes a turn
      const turning = (d > geo.topLen - 50 && d < geo.topLen + geo.arc + 10) || d > 2 * geo.topLen + geo.arc - 50;
      car.dataset.turn = turning ? "r" : "";
      if (barRef.current) barRef.current.style.transform = `scaleY(${n > 1 ? (f / (n - 1)).toFixed(4) : 0})`;
      const idx = Math.round(f);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000 || 0.016));
      lastT = now;
      if (cur < 0) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 2.6));
      if (Math.abs(target - cur) < 0.0006) cur = target;
      place(cur);
      if (cur !== target) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const p = Math.min(1, Math.max(0, (top - r.top) / dist));
      const seg = p * (n - 1);
      const i = Math.min(Math.max(0, n - 2), Math.floor(seg));
      // every district holds the car for a short while, the drive to the next one takes most of its part of the scroll (slow and steady)
      target = n < 2 ? 0 : p >= 1 ? n - 1 : i + smooth((seg - i - 0.12) / 0.76);
      if (!raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    place(0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [geo, n]);

  // new signs (a district that gets drawn in full) are turned at once
  useLayoutEffect(() => {
    applyRef.current();
  }, [active]);

  // everything that moves in the city stops while the city is not on the screen
  useEffect(() => {
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!sticky || !track) return;
    const io = new IntersectionObserver(([e]) => sticky.setAttribute("data-live", String(e.isIntersecting)), { rootMargin: "100px" });
    io.observe(track);
    return () => io.disconnect();
  }, []);

  // jump to a district: scroll the page to the place where the car stops there
  const goTo = (i: number) => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || n < 2) return;
    const to = Math.min(n - 1, Math.max(0, i));
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const dist = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const y = track.getBoundingClientRect().top + window.scrollY - top + (to / (n - 1)) * dist;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (n === 0) return null;
  const cur = items[Math.min(active, n - 1)];
  const LAMPS = Array.from({ length: geo.cols * 5 }, (_, i) => 40 + i * 128);

  return (
    <div ref={trackRef} className="cm-track" data-pin={n > 1} style={{ "--n": n } as React.CSSProperties}>
      {/* the real content: a list (the only thing shown on a tablet and a phone) */}
      <ol className="cm-list">
        {items.map((it, i) => (
          <li key={i}>
            <span className="cm-l-ico">
              <IndustryIcon name={it.name} className="size-7" />
            </span>
            <div>
              <h3>{it.name}</h3>
              <p>{it.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div ref={stickyRef} className="cm-sticky" data-live="false" aria-hidden>
        <div className="cm-stage">
          <div className="cm-sky" />
          <i className="cm-fade cm-fade-t" />
          <i className="cm-fade cm-fade-b" />
          <div className="cm-scene">
            <div ref={worldRef} className="cm-world">
              {/* the ground, the roads and the park in the middle */}
              <div className="cm-ground" style={{ width: geo.width + 3200, left: -1600 }} />
              <svg className="cm-roads" width="1" height="1">
                <path d={geo.isle} className="cm-isle" />
                <path ref={pathRef} d={geo.car} className="cm-measure" />
                <path d={geo.mid} className="cm-walk" />
                <path d={geo.mid} className="cm-road" />
                <path d={geo.edgeOut} className="cm-edge" />
                <path d={geo.edgeIn} className="cm-edge" />
                <path d={geo.mid} className="cm-dash" />
              </svg>
              <i className="cm-fountain" style={{ left: (geo.c0 + geo.cL) / 2 - 36, top: (LANE_TOP + LANE_BOT) / 2 - 36 }} />
              {Array.from({ length: geo.cols * 4 }, (_, i) => (
                <div key={i} className="cm-at" style={{ left: geo.c0 - 70 + i * 150, top: LANE_TOP + 112 + (i % 2) * 40 }}>
                  <Box x={-2} y={-2} w={4} d={4} h={6} l={16} />
                  <Box x={-9} y={-9} w={18} d={18} h={12} l={40} z={6} />
                  <Box x={-5} y={-5} w={10} d={10} h={10} l={50} z={18} />
                </div>
              ))}
              {LAMPS.map((x) => (
                <div key={x} className="cm-at" style={{ left: x, top: 440 }}>
                  <Box x={-2} y={-2} w={4} d={4} h={34} l={44} />
                  <Box x={-5} y={-5} w={10} d={10} h={5} l={96} z={34} />
                </div>
              ))}
              {LAMPS.map((x) => (
                <div key={`b${x}`} className="cm-at" style={{ left: x, top: LANE_BOT + 60 }}>
                  <Box x={-2} y={-2} w={4} d={4} h={34} l={44} />
                  <Box x={-5} y={-5} w={10} d={10} h={5} l={96} z={34} />
                </div>
              ))}

              {/* the districts */}
              {items.map((it, i) => {
                const p = geo.pads[i];
                const on = i === active;
                return (
                  <div key={i} className="cm-pad" data-on={on}>
                    <Box x={p.x} y={p.y} w={PW} d={PH} h={8} l={on ? 30 : 22} />
                    <i className="cm-ring" style={{ left: p.x, top: p.y, width: PW, height: PH }} />
                    {district(p.kind).map((d, k) => (
                      <Piece key={k} it={d} ox={p.x} oy={p.y} flip={!p.top} lite={Math.abs(i - active) > 1} />
                    ))}
                    <div className="cm-sign cm-name" data-on={on} style={{ left: p.x + PW / 2, top: p.y + (p.top ? 8 : PH - 8), transform: "translateZ(300px)" }}>
                      <span>{it.name}</span>
                    </div>
                  </div>
                );
              })}

              {/* the traffic on the other lane, and our car */}
              {[0, 1, 2].map((k) => (
                <div
                  key={k}
                  className="cm-ambient"
                  style={{ offsetPath: `path("${geo.oncoming}")`, animationDuration: `${Math.max(24, geo.total / 26)}s`, animationDelay: `${-k * (geo.total / 78)}s` } as React.CSSProperties}
                >
                  <Vehicle v={k === 1 ? "bus" : "sedan"} />
                </div>
              ))}
              <div ref={carRef} className="cm-car" data-turn="">
                <i className="cm-glow" />
                <Vehicle v="car" />
              </div>
            </div>
          </div>

          <div className="cm-ui">
            {/* the districts (click to drive there) */}
            <nav className="cm-rail" aria-label="Industries">
              <span className="cm-rail-bar">
                <span ref={barRef} />
              </span>
              <ol>
                {items.map((it, i) => (
                  <li key={i}>
                    <button type="button" data-on={i === active} data-done={i < active} onClick={() => goTo(i)} aria-controls={`${uid}-panel`} tabIndex={-1}>
                      <IndustryIcon name={it.name} className="size-[18px]" />
                      <span>{it.name}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            {/* the reading panel */}
            <div id={`${uid}-panel`} className="cm-panel card-glass">
              <div key={active} className="cm-p-in">
                <p className="cm-p-top">
                  <span>
                    District {active + 1} of {n}
                  </span>
                </p>
                <div className="cm-p-ico">
                  <IndustryIcon name={cur.name} className="size-8" />
                </div>
                <h3>{cur.name}</h3>
                <p className="cm-p-text">{cur.description}</p>
              </div>
              <div className="cm-p-nav">
                <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous district" tabIndex={-1}>
                  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                </button>
                <span>Scroll or use the arrows</span>
                <button type="button" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label="Next district" tabIndex={-1}>
                  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
