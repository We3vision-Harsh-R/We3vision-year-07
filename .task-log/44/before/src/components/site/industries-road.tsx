"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { IndustryIcon } from "./icons";
import { Box, LANE_BOT, LANE_TOP, PH, PW, Piece, Vehicle, district, kindOf } from "./city-scene";
import type { Road } from "./modern/map-variants";
import type { ReactNode } from "react";
import { CameraTuner, type Cam } from "./camera-tuner";

// The industries city of the service pages. It is the same city as the one on the home page (industries-city.tsx, the districts and the
// buildings come from city-scene.tsx, the look from the .cm-* styles) but the car does not drive round a ring road: it drives straight
// ahead from one district to the next one, and never turns back. Every page gets a road of its own (straight, a soft wave, or a road that
// steps down) and its own point of view, so the pages are not copies of each other. The districts are the industries of the page.
// On a desktop the stage is pinned and the scroll drives the car; a tablet, a phone and visitors who prefer less motion get a clear list.

type Item = { name: string; description: string };

const S = 340; // the distance between two districts along the road (they stand on both sides of it, one after the other)
const Y0 = (LANE_TOP + LANE_BOT) / 2; // the road
const OUT = 28; // our lane; the oncoming traffic has the other one
const RX = 58; // the tilt of the camera (degrees from looking straight down)
// The camera tuner (camera-tuner.tsx) is switched off for now: set this to true to bring it back (it shows with ?cam in the address). It is meant
// to move into the editor of the admin panel later; the values given to the component are the camera that every visitor gets.
const TUNER = false;
const CAM_KEY = "we3.camera.industries.v1"; // where the camera tuner keeps its values (this browser only)
const CAM_EVENT = "we3-camera";
const subscribeCam = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(CAM_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CAM_EVENT, cb);
  };
};
const readCam = () => {
  try {
    return window.localStorage.getItem(CAM_KEY) ?? "";
  } catch {
    return "";
  }
};
const FAR = 4200; // an infinite road runs this far beyond the first and the last district (the haze and the blur hide the end)
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** how far the road is from the straight line at a place of the road (u = number of districts from the first one) */
const bend = (road: Road, u: number) => {
  if (road === "wave") return 70 * Math.sin((u * 2 * Math.PI) / 5);
  if (road === "stairs") return [0, 1, 2, 3, 4].reduce((a, k) => a + 110 * smooth((u - (1.5 + 3.5 * k)) / 2.2), 0);
  return 0;
};

export function IndustriesRoad({
  items,
  road,
  ang: angP,
  zoom: zoomP = 1.1,
  rx: rxP = RX,
  infinite = false,
  dof = false,
  breathe = 0,
  signs = 0,
  lens = 2500,
  x = 50,
  y = 71,
  blur = 1,
  head,
}: {
  items: Item[];
  road: Road;
  ang: number;
  zoom?: number;
  rx?: number;
  infinite?: boolean;
  dof?: boolean;
  /** the camera breathes: it pulls back by this much while the car drives from one district to the next and comes in again when it stops */
  breathe?: number;
  /** the names of the districts keep this size on the screen whatever the zoom (0 = they zoom with the city) */
  signs?: number;
  /** the camera of the bird's-eye version: the lens (px, big = a long lens), where the car stands (% from the left / from the top), the strength of the blur */
  lens?: number;
  x?: number;
  y?: number;
  blur?: number;
  /** the title of the section: it stays on the screen while the city is pinned (see .cm-head) */
  head?: ReactNode;
}) {
  const n = items.length;
  const uid = useId();
  const [active, setActive] = useState(0);
  // the camera (on the home page it can be set by hand with the tuner: add ?cam to the address; the values are kept in this browser)
  const base = useMemo<Cam>(() => ({ zoom: zoomP, pitch: 90 - rxP, ang: angP, lens, x, y, blur }), [zoomP, rxP, angP, lens, x, y, blur]);
  const saved = useSyncExternalStore(subscribeCam, readCam, () => ""); // what this browser has kept (nothing on the server)
  const tune = useSyncExternalStore(
    () => () => {},
    () => TUNER && window.location.search.includes("cam"),
    () => false,
  );
  const [moved, setMoved] = useState<Cam | null>(null); // the value of this visit (also when the browser cannot keep anything)
  const cam = useMemo<Cam>(() => {
    if (!dof || !TUNER) return base;
    if (moved) return moved;
    try {
      return saved ? { ...base, ...JSON.parse(saved) } : base;
    } catch {
      return base;
    }
  }, [dof, moved, saved, base]);
  const moveCam = (c: Cam) => {
    setMoved(c);
    try {
      window.localStorage.setItem(CAM_KEY, JSON.stringify(c));
      window.dispatchEvent(new Event(CAM_EVENT));
    } catch {
      /* the values are only not kept */
    }
  };
  const zoom = cam.zoom;
  const rx = 90 - cam.pitch;
  const ang = cam.ang;
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const applyRef = useRef<() => void>(() => {});

  const geo = useMemo(() => {
    const x0 = PW / 2; // the first stop
    const xs = (i: number) => x0 + i * S;
    const ext = infinite ? FAR : 700;
    const xA = xs(0) - ext;
    const xB = xs(n - 1) + ext;
    const yAt = (x: number) => Y0 + bend(road, (x - x0) / S);
    // a road as a polyline (every 24 px), seen from the side: dy moves it to a lane
    const line = (dy: number, from: number, to: number, back = false) => {
      const pts: { x: number; y: number }[] = [];
      for (let x = from; x <= to; x += 24) pts.push({ x, y: yAt(x) + dy });
      pts.push({ x: to, y: yAt(to) + dy });
      if (back) pts.reverse();
      return pts;
    };
    const d = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const car = line(OUT, xA, xB);
    const dist = (pts: { x: number; y: number }[], x: number) => {
      let t = 0;
      for (let i = 1; i < pts.length && pts[i].x <= x; i++) t += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      return t;
    };
    // the districts: on one side of the road, then on the other, ...
    const gap = road === "straight" ? 80 : 140;
    const pads = items.map((it, i) => {
      const top = i % 2 === 0;
      const dy = yAt(xs(i)) - Y0;
      return { x: xs(i) - PW / 2, y: top ? Y0 - gap - PH + dy : Y0 + gap + dy, top, kind: kindOf(it.name), stop: dist(car, xs(i)) };
    });
    // the lamps stand along the whole road; on an infinite road only as far as the eye can see (further away they are hidden by the haze)
    const lampFrom = infinite ? xs(0) - 1900 : xA;
    const lampTo = infinite ? xs(n - 1) + 1900 : xB;
    const gapL = infinite ? 150 : 128;
    const lamps = Array.from({ length: Math.ceil((lampTo - lampFrom) / gapL) }, (_, i) => lampFrom + 40 + i * gapL);
    return {
      pads,
      total: dist(car, xB),
      mid: d(line(0, xA, xB)),
      edgeOut: d(line(56, xA, xB)),
      edgeIn: d(line(-56, xA, xB)),
      car: d(car),
      oncoming: d(line(-OUT, xA, xB, true)),
      lamps: lamps.map((x) => ({ x, y: yAt(x) })),
      width: xB - xA,
      xA,
    };
  }, [items, n, road, infinite]);

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
    // the signs turn back, so that they always face the screen
    const applySigns = () => {
      const t = `rotateZ(${(-ang).toFixed(2)}deg) rotateX(${-rx}deg) translate(-50%, -100%) scale(var(--zs, 1))`;
      world.querySelectorAll<HTMLElement>(".cm-sign span").forEach((sp) => (sp.style.transform = t));
    };
    applyRef.current = applySigns;
    const place = (fIn: number) => {
      const f = Math.min(n - 1, Math.max(0, Number.isFinite(fIn) ? fIn : 0));
      const i = Math.min(n - 1, Math.floor(f));
      const j = Math.min(n - 1, i + 1);
      const dd = geo.pads[i].stop + (geo.pads[j].stop - geo.pads[i].stop) * (j === i ? 0 : f - i);
      const p = path.getPointAtLength(Math.min(geo.total, Math.max(0, dd)));
      const q = path.getPointAtLength(Math.min(geo.total, Math.max(0, dd) + 3));
      const a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      car.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${a.toFixed(1)}deg)`;
      // the zoom: nearest at a district, furthest half way between two districts (a soft dolly, only a scale)
      const z = zoom + breathe * (0.35 - Math.sin(Math.PI * (f - Math.floor(f))));
      if (signs > 0) world.style.setProperty("--zs", (signs / z).toFixed(3));
      world.style.transform = `scale(${z.toFixed(3)}) rotateX(${rx}deg) rotateZ(${ang}deg) translate(${(-p.x).toFixed(1)}px, ${(-(p.y - OUT)).toFixed(1)}px)`;
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
  }, [geo, n, ang, zoom, rx, breathe, signs]);

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

  return (
    <div
      ref={trackRef}
      className={dof ? "cm-track cm-bird" : "cm-track"}
      data-pin={n > 1}
      style={{ "--n": n, ...(dof ? { "--cam-p": `${cam.lens}px`, "--cam-x": `${cam.x}%`, "--cam-y": `${cam.y}%`, "--cam-blur": cam.blur } : {}) } as React.CSSProperties}
    >
      {head && <div className="cm-head">{head}</div>}
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
          {/* the distance is out of focus: layers of blur, the strongest at the top (the far end of the road), none close to the camera */}
          {dof && (
            <div className="cm-dof" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </div>
          )}
          <div className="cm-scene">
            <div ref={worldRef} className="cm-world">
              {/* the ground and the road */}
              <div className="cm-ground" style={{ width: geo.width + 3200, left: geo.xA - 1600 }} />
              <svg className="cm-roads" width="1" height="1">
                <path ref={pathRef} d={geo.car} className="cm-measure" />
                <path d={geo.mid} className="cm-walk" />
                <path d={geo.mid} className="cm-road" />
                <path d={geo.edgeOut} className="cm-edge" />
                <path d={geo.edgeIn} className="cm-edge" />
                <path d={geo.mid} className="cm-dash" />
              </svg>
              {geo.lamps.map((l) => (
                <div key={l.x} className="cm-at" style={{ left: l.x, top: l.y - 60 }}>
                  <Box x={-2} y={-2} w={4} d={4} h={34} l={44} />
                  <Box x={-5} y={-5} w={10} d={10} h={5} l={96} z={34} />
                </div>
              ))}
              {geo.lamps.map((l) => (
                <div key={`b${l.x}`} className="cm-at" style={{ left: l.x + 64, top: l.y + 60 }}>
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
      {tune && <CameraTuner cam={cam} onChange={moveCam} onReset={() => moveCam(base)} />}
    </div>
  );
}
