"use client";

import "@/styles/animation.css";

import { useEffect, useRef, useState } from "react";

// The box of the Animation page (the "guide" section with the scene "aftereffects"): a small After Effects: the composition with a bouncing ball
// (squash and stretch, a shadow, the path it flies), the layers with their keyframes on a timeline and a playhead that can be dragged. It plays by
// itself; a drag on the timeline scrubs the frames. No cartoon guide here. The look is in globals.css (.ae-*).

const FPS = 24;
const FRAMES = 120; // five seconds
const KEYS = [0, 20, 40, 60, 80, 100]; // in % of the timeline
const HOPS = 3;

type Layer = { n: number; name: string; kind: string; keys: number[]; span: [number, number] };
const LAYERS: Layer[] = [
  { n: 1, name: "Ball", kind: "shape", keys: KEYS, span: [0, 100] },
  { n: 2, name: "Shadow", kind: "shape", keys: [0, 33, 66, 100], span: [0, 100] },
  { n: 3, name: "Camera", kind: "camera", keys: [0, 100], span: [0, 100] },
  { n: 4, name: "Backdrop", kind: "solid", keys: [], span: [0, 100] },
];

const code = (t: number) => {
  const f = Math.round((t / 100) * (FRAMES - 1));
  const s = Math.floor(f / FPS);
  return `0:00:${String(s).padStart(2, "0")}:${String(f % FPS).padStart(2, "0")}`;
};

/** where the ball is at a moment of the timeline (the composition is 480 x 270) */
function ball(t: number) {
  const hop = Math.abs(Math.sin((t / 100) * Math.PI * HOPS));
  return { x: 70 + (t / 100) * 340, y: 206 - hop * 112, hop };
}

export function AfterEffects() {
  const [t, setT] = useState(8);
  const [play, setPlay] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  useEffect(() => {
    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setT((v) => (v + 0.9) % 100), 40);
    return () => window.clearInterval(id);
  }, [play]);

  const at = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return;
    setT(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  const { x, y, hop } = ball(t);
  const sq = 1 - hop; // squashed when it touches the ground
  const path = Array.from({ length: 61 }, (_, i) => {
    const p = ball((i / 60) * 100);
    return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${(p.y).toFixed(1)}`;
  }).join("");

  return (
    <div className="ae" data-play={play}>
      <div className="ae-bar">
        <span className="ae-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="ae-logo" aria-hidden>
          Ae
        </span>
        <span className="ae-file">Bounce_Final.aep</span>
        <span className="ae-fps">{FPS} fps</span>
      </div>

      <div className="ae-main">
        <div className="ae-view">
          <div className="ae-view-top">
            <span>Composition · Bounce</span>
            <span>100% · Full</span>
          </div>
          <svg viewBox="0 0 480 270" className="ae-comp" aria-hidden>
            <defs>
              <linearGradient id="ae-bg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" className="ae-s-bg1" />
                <stop offset="1" className="ae-s-bg2" />
              </linearGradient>
              <radialGradient id="ae-ball" cx="38%" cy="32%" r="70%">
                <stop offset="0" className="ae-s-b1" />
                <stop offset="0.55" className="ae-s-b2" />
                <stop offset="1" className="ae-s-b3" />
              </radialGradient>
            </defs>
            <rect width="480" height="270" fill="url(#ae-bg)" />
            {/* the title safe and the action safe margins, the ground */}
            <rect className="ae-safe" x="24" y="14" width="432" height="242" />
            <rect className="ae-safe" x="48" y="27" width="384" height="216" />
            <path className="ae-ground" d="M0 226H480" />
            <path className="ae-path" d={path} />
            {KEYS.map((k) => {
              const p = ball(k);
              return <rect key={k} className="ae-kf" x={p.x - 3.5} y={p.y - 3.5} width="7" height="7" transform={`rotate(45 ${p.x} ${p.y})`} />;
            })}
            <ellipse cx={x} cy="228" rx={16 + (1 - hop) * 8} ry={3.6} fill="#000" opacity={0.25 + (1 - hop) * 0.25} />
            <ellipse cx={x} cy={y} rx={17 + sq * 6} ry={17 - sq * 5} fill="url(#ae-ball)" />
            <ellipse cx={x - 5} cy={y - 6 - sq * 0} rx="5" ry="3.4" fill="#fff" opacity="0.55" />
            {/* the handles of the selected layer */}
            <rect className="ae-sel" x={x - 24} y={y - 24} width="48" height="48" />
            {[[-24, -24], [24, -24], [-24, 24], [24, 24]].map(([dx, dy]) => (
              <rect key={`${dx}${dy}`} className="ae-handle" x={x + dx - 3} y={y + dy - 3} width="6" height="6" />
            ))}
          </svg>
        </div>

        <ul className="ae-layers" aria-label="Layers">
          <li className="ae-layers-head">
            <span>Layers</span>
          </li>
          {LAYERS.map((l) => (
            <li key={l.n} className="ae-layer" data-on={l.n === 1}>
              <i className="ae-eye" aria-hidden />
              <i className="ae-label" data-k={l.kind} aria-hidden />
              <b>{l.n}</b>
              <span>{l.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="ae-time">
        <div className="ae-time-bar">
          <button type="button" className="ae-btn" aria-label="Go to the first frame" onClick={() => setT(0)}>
            <span className="ae-i-first" aria-hidden />
          </button>
          <button type="button" className="ae-btn ae-btn-play" aria-label={play ? "Pause" : "Play"} onClick={() => setPlay((p) => !p)}>
            <span className={play ? "ae-i-pause" : "ae-i-play"} aria-hidden />
          </button>
          <b className="ae-code" aria-live="off">
            {code(t)}
          </b>
          <span className="ae-hint">Drag the timeline to scrub the frames</span>
        </div>

        <div className="ae-tl">
          <div className="ae-tl-names" aria-hidden>
            <span className="ae-tl-sp" />
            {LAYERS.map((l) => (
              <span key={l.n} className="ae-tl-name">
                {l.n} · {l.name}
              </span>
            ))}
          </div>
          <div
            ref={trackRef}
            className="ae-tl-track"
            role="slider"
            tabIndex={0}
            aria-label="Timeline"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(t)}
            aria-valuetext={code(t)}
            onPointerDown={(e) => {
              drag.current = true;
              setPlay(false);
              e.currentTarget.setPointerCapture(e.pointerId);
              at(e.clientX);
            }}
            onPointerMove={(e) => drag.current && at(e.clientX)}
            onPointerUp={() => (drag.current = false)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setT((v) => Math.min(100, v + 100 / FRAMES));
              else if (e.key === "ArrowLeft") setT((v) => Math.max(0, v - 100 / FRAMES));
              else if (e.key === " ") setPlay((p) => !p);
              else return;
              e.preventDefault();
            }}
          >
            <div className="ae-ruler" aria-hidden>
              {[0, 1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ left: `${(s / 5) * 100}%` }}>
                  {s}s
                </span>
              ))}
            </div>
            {LAYERS.map((l) => (
              <div key={l.n} className="ae-row" aria-hidden>
                <span className="ae-bar-l" data-k={l.kind} style={{ left: `${l.span[0]}%`, width: `${l.span[1] - l.span[0]}%` }} />
                {l.keys.map((k) => (
                  <i key={k} className="ae-key" data-hit={Math.abs(k - t) < 2.2} style={{ left: `${k}%` }} />
                ))}
              </div>
            ))}
            <span className="ae-head" style={{ left: `${t}%` }} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
