"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { THEME_EVENT } from "@/lib/theme";

// "Draw your rough idea": an ink brush paints behind the cursor on a canvas. The visitor sketches a small reference (a logo, a shape,
// anything), can save it as a picture and press "Send to our artist": the contact form below opens with a message. "Try a sample" draws
// one of several small sketches by itself so a visitor sees how it works.
// Everything is drawn with 2D canvas, no libraries. Colours come from the site theme (--th, --ts), so they follow a recoloured site.
// Points are stored in units of the canvas WIDTH (x / W, y / W), so a drawing keeps its proportions when the canvas is resized.

type Pt = [number, number, number]; // x, y (in widths), time in ms
type Stroke = { ink: number; size: number; pts: Pt[] };
type XY = [number, number];
type Theme = { th: number; ts: number };

const INKS = [
  { name: "Violet", o: 0, s: 100, l: 76 },
  { name: "Pink", o: 46, s: 92, l: 72 },
  { name: "Blue", o: -44, s: 90, l: 70 },
  { name: "Orange", o: 98, s: 95, l: 66 },
  { name: "Mint", o: -98, s: 80, l: 66 },
  { name: "White", o: 0, s: 0, l: 96 },
];
const SIZES = [
  { name: "Fine", w: 3 },
  { name: "Medium", w: 6 },
  { name: "Bold", w: 11 },
];
const TRAIL_MS = 700;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const readTheme = (): Theme => {
  const cs = getComputedStyle(document.documentElement);
  const th = parseFloat(cs.getPropertyValue("--th"));
  const ts = parseFloat(cs.getPropertyValue("--ts"));
  return { th: Number.isFinite(th) ? th : 284, ts: Number.isFinite(ts) ? ts : 1 };
};
const inkColor = (t: Theme, ink: number, a = 1, dl = 0) => {
  const i = INKS[ink] ?? INKS[0];
  return `hsl(${t.th + 354 + i.o} ${i.s * t.ts}% ${clamp(i.l + dl, 0, 100)}% / ${a})`;
};
const swatch = (i: number) => {
  const k = INKS[i];
  return `hsl(calc(var(--th) + ${354 + k.o}) calc(${k.s}% * var(--ts)) ${k.l}%)`;
};

/** The brush: the line gets thinner when the hand is fast and thicker when it is slow, tapers at both ends and bleeds a little. */
function drawSketch(ctx: CanvasRenderingContext2D, st: Stroke, W: number, th: Theme) {
  const n = st.pts.length;
  if (!n) return;
  const sc = clamp(W / 900, 0.7, 1.3);
  const base = SIZES[st.size].w * sc;
  const P = st.pts.map((p) => [p[0] * W, p[1] * W, p[2]]);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (n === 1) {
    ctx.fillStyle = inkColor(th, st.ink, 0.92);
    ctx.beginPath();
    ctx.arc(P[0][0], P[0][1], base * 0.6, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const ws: number[] = [base];
  let wp = base;
  for (let i = 1; i < n; i++) {
    const dt = Math.max(1, P[i][2] - P[i - 1][2]);
    const sp = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]) / dt;
    wp = wp * 0.75 + base * clamp(1.4 - sp * 0.7, 0.5, 1.4) * 0.25;
    const taper = 0.35 + 0.65 * Math.min(1, (i + 1) / 5, (n - i) / 5);
    ws.push(wp * taper);
  }
  const mid = (a: number, b: number) => [(P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2];
  for (const pass of [0, 1]) {
    ctx.strokeStyle = inkColor(th, st.ink, pass ? 0.92 : 0.1);
    for (let i = 1; i < n; i++) {
      const a = i === 1 ? [P[0][0], P[0][1]] : mid(i - 1, i);
      const b = i === n - 1 ? [P[i][0], P[i][1]] : mid(i, i + 1);
      ctx.lineWidth = pass ? ws[i] : ws[i] * 2.3 + 2;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo(P[i][0], P[i][1], b[0], b[1]);
      ctx.stroke();
    }
  }
  // a little grain of pigment next to the line
  ctx.fillStyle = inkColor(th, st.ink, 0.38, 6);
  for (let i = 2; i < n; i += 3) {
    const r = Math.sin(i * 12.9898) * 43758.5453;
    const f = r - Math.floor(r);
    const ang = f * Math.PI * 2;
    const d = ws[i] * (0.6 + f);
    ctx.beginPath();
    ctx.arc(P[i][0] + Math.cos(ang) * d, P[i][1] + Math.sin(ang) * d, 0.5 + f * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- the samples: small rough sketches that draw themselves. Drawn in units of a radius around the middle of the canvas. ----
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 40): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => {
    const a = a0 + ((a1 - a0) * k) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as XY;
  });
const bez = (p0: XY, c: XY, p1: XY, n = 16): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n;
    return [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]] as XY;
  });
/** straight edges with a few points on each, so the pen speed stays even */
const poly = (pts: XY[], per = 7): XY[] => {
  const out: XY[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    for (let j = 0; j < per; j++) out.push([pts[i][0] + ((pts[i + 1][0] - pts[i][0]) * j) / per, pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * j) / per]);
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const wave = (x0: number, x1: number, y: number, amp: number, waves = 3, n = 30): XY[] =>
  Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n;
    return [x0 + (x1 - x0) * t, y + Math.sin(t * Math.PI * 2 * waves) * amp] as XY;
  });
const rough = (a: number) => 1 + 0.03 * Math.sin(a * 2.1) + 0.018 * Math.sin(a * 5.3 + 1);

type Def = { ink: number; size: number; path: XY[] };
const SAMPLES: (() => Def[])[] = [
  // a rough circle with a star and a wavy underline
  () => {
    const V: XY[] = [];
    for (let k = 0; k < 10; k++) {
      const ang = (k / 10) * Math.PI * 2 - Math.PI / 2;
      const rad = k % 2 ? 0.3 : 0.64;
      V.push([rad * Math.cos(ang), rad * Math.sin(ang)]);
    }
    V.push(V[0]);
    return [
      {
        ink: 0,
        size: 1,
        path: Array.from({ length: 66 }, (_, k) => {
          const a = (k / 64) * Math.PI * 2 * 1.05 - Math.PI / 2;
          return [rough(a) * Math.cos(a), rough(a) * Math.sin(a)] as XY;
        }),
      },
      { ink: 1, size: 0, path: poly(V, 7) },
      { ink: 2, size: 1, path: wave(-0.9, 0.9, 1.34, 0.05) },
    ];
  },
  // a leaf with a stem and veins
  () => [
    { ink: 4, size: 1, path: [...bez([0, 0.9], [-1.05, 0.1], [0, -0.95]), ...bez([0, -0.95], [1.05, 0.1], [0, 0.9])] },
    { ink: 0, size: 0, path: poly([[0, 1.25], [0, 0.9], [0, -0.55]], 8) },
    { ink: 0, size: 0, path: poly([[0, 0.3], [-0.42, -0.02]], 6) },
    { ink: 0, size: 0, path: poly([[0, -0.05], [0.4, -0.34]], 6) },
    { ink: 1, size: 1, path: wave(-0.7, 0.7, 1.5, 0.04, 2, 22) },
  ],
  // a shield with a lightning bolt
  () => [
    {
      ink: 2,
      size: 1,
      path: [...bez([-0.8, -0.65], [0, -1.15], [0.8, -0.65], 14), ...poly([[0.8, -0.65], [0.8, 0.12]], 6), ...bez([0.8, 0.12], [0.7, 0.62], [0, 1], 12), ...bez([0, 1], [-0.7, 0.62], [-0.8, 0.12], 12), ...poly([[-0.8, 0.12], [-0.8, -0.65]], 6)],
    },
    { ink: 3, size: 1, path: poly([[0.14, -0.6], [-0.34, 0.12], [-0.02, 0.12], [-0.16, 0.68], [0.36, -0.1], [0.04, -0.1], [0.14, -0.6]], 6) },
  ],
  // a little house
  () => [
    { ink: 0, size: 1, path: poly([[-0.95, -0.08], [0, -0.9], [0.95, -0.08]], 12) },
    { ink: 0, size: 1, path: poly([[-0.68, -0.14], [-0.68, 0.85], [0.68, 0.85], [0.68, -0.14]], 9) },
    { ink: 3, size: 1, path: poly([[-0.17, 0.85], [-0.17, 0.3], [0.17, 0.3], [0.17, 0.85]], 6) },
    { ink: 1, size: 0, path: poly([[0.45, -0.56], [0.45, -0.86], [0.7, -0.86], [0.7, -0.36]], 6) },
    { ink: 4, size: 1, path: wave(-1.1, 1.1, 1.05, 0.03, 4, 34) },
  ],
  // a rocket with a flame
  () => [
    { ink: 1, size: 1, path: [...bez([0, -1], [0.62, -0.5], [0.38, 0.42], 18), ...poly([[0.38, 0.42], [-0.38, 0.42]], 8), ...bez([-0.38, 0.42], [-0.62, -0.5], [0, -1], 18)] },
    { ink: 0, size: 1, path: arc(0, -0.2, 0.17, 0.17, 0, Math.PI * 2, 24) },
    { ink: 0, size: 1, path: poly([[0.38, 0.1], [0.7, 0.56], [0.38, 0.42]], 6) },
    { ink: 0, size: 1, path: poly([[-0.38, 0.1], [-0.7, 0.56], [-0.38, 0.42]], 6) },
    { ink: 3, size: 2, path: poly([[-0.2, 0.5], [0, 1.1], [0.2, 0.5]], 7) },
  ],
  // a sun above two mountains
  () => [
    { ink: 3, size: 1, path: arc(0.4, -0.5, 0.3, 0.3, 0, Math.PI * 2, 28) },
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
      const a = (k / 8) * Math.PI * 2;
      return { ink: 3, size: 0, path: poly([[0.4 + Math.cos(a) * 0.42, -0.5 + Math.sin(a) * 0.42], [0.4 + Math.cos(a) * 0.58, -0.5 + Math.sin(a) * 0.58]], 3) };
    }),
    { ink: 2, size: 1, path: poly([[-1, 0.8], [-0.45, -0.1], [-0.05, 0.5], [0.3, 0.1], [1, 0.8]], 10) },
    { ink: 0, size: 0, path: poly([[-1.1, 0.8], [1.1, 0.8]], 14) },
  ],
  // a coffee cup with steam
  () => [
    { ink: 0, size: 1, path: [...poly([[-0.62, -0.1], [-0.52, 0.72]], 6), ...bez([-0.52, 0.72], [0, 1.02], [0.52, 0.72], 14), ...poly([[0.52, 0.72], [0.62, -0.1], [-0.62, -0.1]], 6)] },
    { ink: 0, size: 1, path: bez([0.62, 0.05], [1.12, 0.1], [0.55, 0.62], 14) },
    { ink: 1, size: 0, path: bez([-0.25, -0.35], [-0.5, -0.6], [-0.2, -0.95], 14) },
    { ink: 1, size: 0, path: bez([0.1, -0.35], [-0.15, -0.6], [0.15, -0.95], 14) },
    { ink: 1, size: 0, path: bez([0.42, -0.35], [0.17, -0.6], [0.47, -0.95], 14) },
    { ink: 4, size: 1, path: wave(-0.95, 0.95, 1.2, 0.03, 3, 26) },
  ],
];

/** One sample placed in the middle of the canvas (units of the width), a little rough like a hand would draw it. */
function placeSample(def: Def[], aspect: number, seed: number): Stroke[] {
  const cy = aspect * 0.44;
  const r = Math.min(0.2, aspect * 0.3);
  return def.map((d, si) => ({
    ink: d.ink,
    size: d.size,
    pts: d.path.map((p, i) => [0.5 + p[0] * r + Math.sin(i * 1.7 + si + seed) * 0.0012, cy + p[1] * r + Math.cos(i * 1.3 + si * 2 + seed) * 0.0012, i * 14] as Pt),
  }));
}

export function SketchCanvas({ hint, sendLabel, saveLabel, sendMessage }: { hint: string; sendLabel: string; saveLabel: string; sendMessage: string }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const drawing = useRef(false);
  const trail = useRef<{ x: number; y: number; t: number }[]>([]);
  const size = useRef({ W: 0, H: 0, dpr: 1 });
  const queue = useRef<{ s: Stroke; i: number }[]>([]);
  const sampleT = useRef(0);
  const sampleNo = useRef(-1);
  const raf = useRef(0);
  const frame = useRef<() => void>(() => {});
  const inkRef = useRef(0);
  const sizeRef = useRef(1);
  const reduced = useRef(false);
  const [ink, setInk] = useState(0);
  const [sz, setSz] = useState(1);
  const [count, setCount] = useState(0);
  const [playing, setPlaying] = useState(false);

  const paint = useCallback(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const { W, H, dpr } = size.current;
    if (!W) return;
    const th = readTheme();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (const st of strokes.current) drawSketch(ctx, st, W, th);
    // the pigment trail behind the cursor
    const now = performance.now();
    trail.current = trail.current.filter((p) => now - p.t < TRAIL_MS);
    const tr = trail.current;
    if (tr.length > 1) {
      ctx.lineCap = "round";
      const base = SIZES[sizeRef.current].w * clamp(W / 900, 0.7, 1.3);
      for (let i = 1; i < tr.length; i++) {
        const age = clamp((now - tr[i].t) / TRAIL_MS, 0, 1);
        const a = Math.pow(1 - age, 1.6);
        ctx.strokeStyle = inkColor(th, inkRef.current, a * 0.5);
        ctx.lineWidth = base * 1.5 * (1 - age) + 1;
        ctx.beginPath();
        ctx.moveTo(tr[i - 1].x, tr[i - 1].y);
        ctx.lineTo(tr[i].x, tr[i].y);
        ctx.stroke();
      }
    }
  }, []);

  const loop = useCallback(() => {
    raf.current = 0;
    const now = performance.now();
    let again = false;
    // the sample draws itself (time based, so it takes the same time on a slow screen)
    if (queue.current.length) {
      const budget = clamp(Math.round((now - (sampleT.current || now)) / 7), 1, 40);
      sampleT.current = now;
      for (let n = 0; n < budget; n++) {
        const q = queue.current[0];
        if (!q) break;
        if (q.i === 0) strokes.current.push({ ink: q.s.ink, size: q.s.size, pts: [] });
        const cur = strokes.current[strokes.current.length - 1];
        cur.pts.push(q.s.pts[q.i]);
        q.i++;
        if (q.i >= q.s.pts.length) queue.current.shift();
      }
      if (!queue.current.length) {
        setPlaying(false);
        setCount(strokes.current.length);
      }
      again = true;
    }
    if (trail.current.length) again = true;
    paint();
    if (again) raf.current = requestAnimationFrame(() => frame.current());
  }, [paint]);

  useEffect(() => {
    frame.current = loop;
  }, [loop]);

  const wake = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(() => frame.current());
  }, []);

  // size of the canvas
  useEffect(() => {
    const board = boardRef.current;
    const cv = canvasRef.current;
    if (!board || !cv) return;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fit = () => {
      const r = board.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      size.current = { W: r.width, H: r.height, dpr };
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      wake();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(board);
    window.addEventListener(THEME_EVENT, wake);
    return () => {
      ro.disconnect();
      window.removeEventListener(THEME_EVENT, wake);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [wake]);

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (queue.current.length) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* drawing still works inside the canvas */
    }
    const { x, y } = pos(e);
    const W = size.current.W;
    drawing.current = true;
    trail.current = [];
    strokes.current.push({ ink: inkRef.current, size: sizeRef.current, pts: [[x / W, y / W, performance.now()]] });
    setCount(strokes.current.length);
    wake();
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = pos(e);
    const W = size.current.W;
    if (drawing.current) {
      const st = strokes.current[strokes.current.length - 1];
      const last = st.pts[st.pts.length - 1];
      if (Math.hypot(x - last[0] * W, y - last[1] * W) < 1.2) return;
      st.pts.push([x / W, y / W, performance.now()]);
      wake();
    } else if (e.pointerType === "mouse" && !reduced.current && !queue.current.length) {
      trail.current.push({ x, y, t: performance.now() });
      if (trail.current.length > 60) trail.current.shift();
      wake();
    }
  };
  const onUp = () => {
    drawing.current = false;
  };

  const undo = () => {
    strokes.current.pop();
    setCount(strokes.current.length);
    wake();
  };
  const clear = () => {
    strokes.current = [];
    queue.current = [];
    setCount(0);
    setPlaying(false);
    wake();
  };
  // every press draws the next sample
  const sample = () => {
    clear();
    sampleNo.current = (sampleNo.current + 1) % SAMPLES.length;
    const { W, H } = size.current;
    queue.current = placeSample(SAMPLES[sampleNo.current](), H / W, sampleNo.current).map((s) => ({ s, i: 0 }));
    sampleT.current = 0;
    setPlaying(true);
    wake();
  };

  const pickInk = (i: number) => {
    inkRef.current = i;
    setInk(i);
  };
  const pickSize = (i: number) => {
    sizeRef.current = i;
    setSz(i);
  };

  const save = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const out = document.createElement("canvas");
    out.width = cv.width;
    out.height = cv.height;
    const c = out.getContext("2d");
    if (!c) return;
    c.fillStyle = "#0b0614";
    c.fillRect(0, 0, out.width, out.height);
    c.drawImage(cv, 0, 0);
    out.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url;
      a.download = "we3vision-sketch.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, "image/png");
  };

  const send = () => {
    window.dispatchEvent(new CustomEvent("w3v-prefill", { detail: { message: sendMessage } }));
    const el = document.getElementById("contact");
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    const y = el.getBoundingClientRect().top + window.scrollY - 40;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const has = count > 0;

  return (
    <div className="sk-frame">
      <div ref={boardRef} className="sk-board" data-empty={!has && !playing}>
        <canvas
          ref={canvasRef}
          className="sk-canvas"
          role="img"
          aria-label="Drawing canvas: press and drag to draw your rough idea"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={() => {
            trail.current = [];
          }}
        />
        <span className="sk-tag" aria-hidden>
          Artboard · 01
        </span>
        <div className="sk-empty" aria-hidden>
          <svg viewBox="0 0 48 48" className="sk-pen">
            <path d="M8 40l3-11L33 7l8 8-22 22z" />
            <path d="M28 12l8 8" />
          </svg>
          <p>{hint}</p>
        </div>
      </div>

      <div className="sk-tools">
        <div className="sk-group" role="group" aria-label="Ink colour">
          {INKS.map((k, i) => (
            <button key={k.name} type="button" className="sk-ink" data-on={ink === i} aria-label={`${k.name} ink`} style={{ background: swatch(i) }} onClick={() => pickInk(i)} />
          ))}
        </div>
        <div className="sk-group" role="group" aria-label="Brush size">
          {SIZES.map((k, i) => (
            <button key={k.name} type="button" className="sk-chip" data-on={sz === i} onClick={() => pickSize(i)}>
              {k.name}
            </button>
          ))}
        </div>
        <div className="sk-group sk-group-end">
          <button type="button" className="sk-chip" disabled={!has || playing} onClick={undo}>
            Undo
          </button>
          <button type="button" className="sk-chip" disabled={!has && !playing} onClick={clear}>
            Clear
          </button>
          <button type="button" className="sk-chip" disabled={playing} onClick={sample}>
            Try a sample
          </button>
        </div>
      </div>

      <div className="sk-actions">
        <button type="button" className="btn-primary sk-btn" disabled={!has || playing} onClick={send}>
          {sendLabel} <span aria-hidden>→</span>
        </button>
        <button type="button" className="sk-btn sk-btn-ghost" disabled={!has || playing} onClick={save}>
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
