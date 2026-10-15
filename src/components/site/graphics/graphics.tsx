"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SmartLink } from "../smart-link";
import { oneLine, storyParts, type TechData } from "../tech/data";
import { BrushTown, TOWN_W, kindOf, slotX } from "./brush-town";
import { Learn } from "./learn";

// GRAPHIC DESIGN page ("gfx-"): an art world built like the tools of a designer. The first screen is a workspace like Adobe Illustrator (toolbar,
// white artboard, layers, swatches, a pen that really draws); the cursor of the page is the Pen tool; the services are artboards; the process is a
// path drawn with the pen (anchor points and handles); the industries are a town that is drawn and then coloured while you scroll; and a lesson
// explains what graphic design is. Lines are wobbled by an SVG filter so that they look hand-made. Colours follow the theme picker.
// (Adobe, Illustrator, Photoshop and InDesign are named only because we work with these programs; the interface is our own drawing.)

const KEYWORDS = [
  "Logo design", "Brand identity design", "Brand guidelines", "Business card design", "Letterhead and stationery", "Social media post design", "Instagram carousel design",
  "Banner and poster design", "Flyer design", "Brochure design", "Catalogue design", "Company profile design", "Packaging design", "Label and sticker design", "Pouch and box design",
  "Illustration", "Vector art", "Icon design", "Infographic design", "Pitch deck design", "Presentation design", "Menu design", "Book cover design", "T-shirt and merchandise design",
  "Photo editing", "Photo retouching", "Background removal", "Ad creatives", "E-commerce banners", "Print-ready artwork", "Website UI design", "Mobile app UI design",
];

/* ------------------------------------------------------------------------------------------------------------------------------------ helpers */

function Wobble() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="gfx-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
        </filter>
      </defs>
    </svg>
  );
}

function Underline() {
  return (
    <svg className="gfx-ul" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M4 14 C40 4, 70 20, 110 10 S190 4, 226 13 S280 8, 296 6" />
    </svg>
  );
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** how far a block has been scrolled through: 0 when its top is at 70% of the screen, 1 when its bottom is at 40% */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.7;
      const end = window.innerHeight * 0.4;
      setP(Math.max(0, Math.min(1, (start - r.top) / Math.max(1, r.height + start - end))));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return [ref, p] as const;
}

const Head = ({ chip, title, intro }: { chip: string; title: string; intro?: string }) => (
  <header className="gfx-head">
    <p className="gfx-chip">{chip}</p>
    <h2>{title}</h2>
    {intro && <p className="gfx-intro">{intro}</p>}
  </header>
);

/* ------------------------------------------------------------------------------------------------------------------------------------ the entrance */

/** The art studio opens: a pen draws a curve with anchor points, then the coloured curtains rise. Pure CSS, it is in the page from the first byte. */
function Curtain() {
  return (
    <div className="gfx-curtain" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}
      <div className="gfx-curtain-c">
        <svg viewBox="0 0 640 220">
          <g className="gfx-cu-h">
            <path d="M60 170 L150 30 M340 150 L260 36 M340 150 L420 220 M600 120 L520 214" />
            {[[150, 30], [260, 36], [420, 220], [520, 214]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" />)}
          </g>
          <path className="gfx-cu-p" pathLength="1" d="M60 170 C 150 30, 260 36, 340 150 S 520 214, 600 120" />
          {[[60, 170], [340, 150], [600, 120]].map(([x, y], i) => <rect key={x} className="gfx-cu-a" style={{ "--d": `${0.15 + i * 0.35}s` } as React.CSSProperties} x={x - 6} y={y - 6} width="12" height="12" />)}
        </svg>
        <p>Welcome to the world of art</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------------ the workspace (hero) */

type Tool = "pen" | "brush" | "eraser";
const TOOL_ICONS: { id: string; label: string; d: string; live?: Tool }[] = [
  { id: "select", label: "Selection", d: "M6 3 V19 L10.5 14.5 L13.5 21 L16 19.8 L13 13.5 H19 Z" },
  { id: "pen", label: "Pen", live: "pen", d: "M5 20 L9 9 L15 5 L19 9 L15 15 Z M9 9 L14 14" },
  { id: "brush", label: "Brush", live: "brush", d: "M5 19 C8 19 9 17 9 15 L16 8 L18 10 L11 17 C11 19 9 21 5 21 Z" },
  { id: "eraser", label: "Eraser", live: "eraser", d: "M4 15 L12 7 L19 14 L14 19 H8 Z M10 19 H20" },
  { id: "type", label: "Type", d: "M5 5 H19 M12 5 V19 M9 19 H15" },
  { id: "shape", label: "Shape", d: "M5 6 H19 V18 H5 Z" },
  { id: "zoom", label: "Zoom", d: "M10 4 a6 6 0 1 0 .1 0 Z M15 15 L20 20" },
];
const SW = [354, 326, 24, 127, 212, 72, 300];

function Workspace({ d }: { d: TechData }) {
  const heading = d.hero.heading.split("\n");
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(4);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [drew, setDrew] = useState(false);
  const [ref, seen] = useInView<HTMLElement>();
  const cv = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hist = useRef<ImageData[]>([]);

  const ctx = () => cv.current?.getContext("2d") ?? null;
  const pos = (e: React.PointerEvent) => {
    const r = cv.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * cv.current!.width, y: ((e.clientY - r.top) / r.height) * cv.current!.height };
  };
  const hue = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--th")) || 284;
  const sat = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ts")) || 1;
  const stroke = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const c = ctx();
    if (!c) return;
    c.lineCap = "round";
    c.lineJoin = "round";
    if (tool === "eraser") {
      c.globalCompositeOperation = "destination-out";
      c.lineWidth = size * 5;
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      c.globalCompositeOperation = "source-over";
      return;
    }
    const base = color === 7 ? "hsl(0 0% 12%" : `hsl(${hue() + SW[color]} ${Math.round(85 * sat())}% 50%`;
    if (tool === "pen") {
      for (let k = 0; k < 3; k++) {
        c.strokeStyle = `${base} / ${k === 0 ? 0.95 : 0.35})`;
        c.lineWidth = Math.max(1, size - k * 1.1);
        const j = (Math.random() - 0.5) * (k ? 1.4 : 0.4);
        c.beginPath(); c.moveTo(a.x + j, a.y + j); c.lineTo(b.x + j, b.y + j); c.stroke();
      }
    } else {
      for (let k = 0; k < 4; k++) {
        c.strokeStyle = `${base} / 0.22)`;
        c.lineWidth = size * 3 - k * (size * 0.6);
        c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      }
    }
  };
  const down = (e: React.PointerEvent) => {
    const c = ctx();
    if (!c || !cv.current) return;
    cv.current.setPointerCapture(e.pointerId);
    hist.current.push(c.getImageData(0, 0, cv.current.width, cv.current.height));
    if (hist.current.length > 20) hist.current.shift();
    last.current = pos(e);
    stroke(last.current, last.current);
    setDrew(true);
  };
  const move = (e: React.PointerEvent) => {
    if (!last.current) return;
    const p = pos(e);
    stroke(last.current, p);
    last.current = p;
  };
  const up = () => { last.current = null; };
  const clear = () => { const c = ctx(); if (c && cv.current) { hist.current.push(c.getImageData(0, 0, cv.current.width, cv.current.height)); c.clearRect(0, 0, cv.current.width, cv.current.height); } };
  const undo = () => { const c = ctx(); const h = hist.current.pop(); if (c && h) c.putImageData(h, 0, 0); };
  const flip = (id: string) => setHidden((s) => { const x = new Set(s); if (x.has(id)) x.delete(id); else x.add(id); return x; });
  const LAYERS = [["heading", "Heading"], ["text", "Text"], ["buttons", "Buttons"], ["pad", "Sketch pad"]] as const;

  return (
    <section className="gfx-ws" ref={ref} data-seen={seen}>
      <div className="gfx-ws-menu" aria-hidden="true">
        <b><svg viewBox="0 0 24 24"><path d="M5 20 L9 9 L15 5 L19 9 L15 15 Z M9 9 L14 14" /></svg></b>
        {["File", "Edit", "Object", "Type", "Select", "Effect", "View"].map((m) => <span key={m}>{m}</span>)}
        <em>graphic-design-we3vision.ai @ 100% (RGB/Preview)</em>
      </div>
      <div className="gfx-ws-body">
        <div className="gfx-toolbar" role="toolbar" aria-label="Tools" aria-orientation="vertical">
          {TOOL_ICONS.map((t) =>
            t.live ? (
              <button key={t.id} type="button" className={tool === t.live ? "is-on" : ""} aria-label={t.label} aria-pressed={tool === t.live} title={t.label} onClick={() => setTool(t.live as Tool)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.d} /></svg>
              </button>
            ) : (
              <span key={t.id} className="is-dim" aria-hidden="true" title={t.label}><svg viewBox="0 0 24 24"><path d={t.d} /></svg></span>
            ),
          )}
        </div>

        <div className="gfx-ws-stage">
          <p className="gfx-ab-label">Artboard 1 · Graphic design services</p>
          <div className="gfx-artboard" data-hide={[...hidden].join(" ")}>
            <div className="gfx-ab-t">
              <p className="gfx-chip gfx-ab-chip">{d.hero.chip}</p>
              <div className="gfx-sel gfx-l-heading">
                <i className="gfx-hd gfx-hd-a" /><i className="gfx-hd gfx-hd-b" /><i className="gfx-hd gfx-hd-c" /><i className="gfx-hd gfx-hd-d" /><i className="gfx-hd gfx-hd-e" /><i className="gfx-hd gfx-hd-f" />
                <h1>
                  <span>{heading[0]}</span>
                  {heading.slice(1).length > 0 && <span className="gfx-h1b">{heading.slice(1).join(" ")}<Underline /></span>}
                </h1>
              </div>
              <p className="gfx-lead gfx-l-text">{d.hero.text}</p>
              <div className="gfx-cta gfx-l-buttons">
                <SmartLink href={d.hero.primaryHref} className="gfx-btn">{d.hero.primaryLabel}</SmartLink>
                <SmartLink href={d.hero.secondaryHref} className="gfx-btn gfx-btn-g">{d.hero.secondaryLabel}</SmartLink>
              </div>
            </div>
            <div className="gfx-pad gfx-l-pad">
              <div className="gfx-paper">
                <svg className="gfx-sketch" viewBox="0 0 400 260" aria-hidden="true" data-hidden={drew}>
                  <g filter="url(#gfx-wobble)">
                    <path pathLength="1" d="M200 40 L214 82 L260 84 L224 112 L238 156 L200 130 L162 156 L176 112 L140 84 L186 82 Z" />
                    <path pathLength="1" d="M60 210 C110 180, 150 236, 210 206 S320 190, 346 214" />
                    <path pathLength="1" d="M300 60 C330 50, 350 70, 340 96 M338 96 l-3 -16 m3 16 l15 -6" />
                  </g>
                </svg>
                <canvas ref={cv} width={800} height={520} className="gfx-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Drawing area: draw with the mouse or your finger" />
                <p className="gfx-pad-hint" data-hidden={drew}><span>Pick a tool and draw here</span></p>
              </div>
              <div className="gfx-pad-actions">
                <button type="button" onClick={undo}>Undo</button>
                <button type="button" onClick={clear}>Clear canvas</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="gfx-panels" aria-label="Panels">
          <div className="gfx-panel">
            <h3>Layers</h3>
            <ul>
              {LAYERS.map(([id, name]) => (
                <li key={id} className={hidden.has(id) ? "is-off" : ""}>
                  <button type="button" onClick={() => flip(id)} aria-pressed={!hidden.has(id)} aria-label={`${hidden.has(id) ? "Show" : "Hide"} layer ${name}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="gfx-panel">
            <h3>Swatches</h3>
            <div className="gfx-swatches" role="group" aria-label="Colours">
              {[...SW, 7].map((o, i) => <button key={i} type="button" className={color === i ? "is-on" : ""} style={{ "--o": o } as React.CSSProperties} data-ink={i === 7} aria-label={`Colour ${i + 1}`} onClick={() => { setColor(i); if (tool === "eraser") setTool("pen"); }} />)}
            </div>
          </div>
          <div className="gfx-panel">
            <h3>Stroke</h3>
            <label className="gfx-weight">Weight<input type="range" min="2" max="14" value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))} /><b>{size} pt</b></label>
          </div>
        </aside>
      </div>
      <div className="gfx-ws-status" aria-hidden="true"><span>Pen tool</span><span>100%</span><span>Artboard 1 of 1</span></div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------------ doodles */

const DOODLES: string[][] = [
  ["M16 24 H104 Q108 24 108 28 V96 Q108 100 104 100 H16 Q12 100 12 96 V28 Q12 24 16 24 Z", "M12 42 H108", "M26 33 h.1 M36 33 h.1", "M26 54 h34 v34 h-34 Z", "M70 58 H96 M70 70 H90 M70 82 H96"],
  ["M30 44 H90 L98 100 H22 Z", "M44 44 C44 18 76 18 76 44", "M46 70 Q60 84 74 70"],
  ["M60 24 a36 36 0 1 0 .1 0 Z", "M60 34 L74 64 L60 92 L46 64 Z", "M60 62 h.1", "M60 92 V106"],
  ["M26 52 L76 28 V94 L26 72 Z", "M26 52 H12 V72 H26", "M40 74 L46 98 H58 L54 84", "M88 46 Q100 62 88 78", "M96 36 Q114 62 96 88"],
  ["M16 24 H104 V88 H16 Z", "M34 76 V58", "M50 76 V46", "M66 76 V64", "M82 76 V40", "M60 88 V104", "M44 106 H76"],
  ["M18 18 H56 V56 H18 Z", "M86 18 a18 18 0 1 0 .1 0 Z", "M18 104 L36 70 L56 104 Z", "M66 70 H106 V104 H66 Z"],
  ["M20 90 L50 30 L80 90 Z", "M34 66 H66", "M84 40 H104 M84 54 H100 M84 68 H104"],
  ["M30 100 C20 60 40 24 70 24 C96 24 104 54 90 74 C80 88 84 100 62 100 Z", "M54 50 h.1 M76 48 h.1", "M52 72 Q66 82 80 70"],
];

function Doodle({ n, on }: { n: number; on: boolean }) {
  const d = DOODLES[n % DOODLES.length];
  return (
    <svg className={`gfx-doodle ${on ? "is-on" : ""}`} viewBox="0 0 120 120" aria-hidden="true">
      <g filter="url(#gfx-wobble)">{d.map((p, i) => <path key={i} pathLength="1" d={p} style={{ "--k": i } as React.CSSProperties} />)}</g>
    </svg>
  );
}

function ArtboardCard({ c, n }: { c: TechData["services"]["cards"][number]; n: number }) {
  const [ref, seen] = useInView<HTMLElement>();
  return (
    <article ref={ref} className="gfx-ab" style={{ "--o": (n * 38) % 120 } as React.CSSProperties}>
      <p className="gfx-ab-name"><span>Artboard {n + 1}</span> {oneLine(c.title)}</p>
      <div className="gfx-ab-frame">
        <i className="gfx-hd gfx-hd-a" /><i className="gfx-hd gfx-hd-c" /><i className="gfx-hd gfx-hd-d" /><i className="gfx-hd gfx-hd-f" />
        <Doodle n={n} on={seen} />
        <h3>{oneLine(c.title)}</h3>
        <p>{c.description}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------------ process: a path drawn with the pen */

function Process({ process }: { process: NonNullable<TechData["process"]> }) {
  const [ref, p] = useScrollProgress<HTMLOListElement>();
  const n = process.items.length;
  return (
    <ol className="gfx-path" ref={ref} style={{ "--p": p } as React.CSSProperties}>
      <div className="gfx-path-line" aria-hidden="true">
        <svg viewBox="0 0 20 1000" preserveAspectRatio="none"><g filter="url(#gfx-wobble)"><path d="M10 0 V1000" className="is-base" /><path d="M10 0 V1000" className="is-draw" pathLength="1" /></g></svg>
        <span className="gfx-pencil" style={{ top: `${p * 100}%` }}>
          <svg viewBox="0 0 28 28"><path d="M3 25 L9 11 L16 8 L20 12 L17 19 Z" /><path d="M16 8 L22 2 L26 6 L20 12" /><path d="M3 25 L12.5 14.5" /></svg>
        </span>
      </div>
      {process.items.map((s, i) => {
        const reached = p * (n + 0.4) > i + 0.25;
        return (
          <li key={s.title} className={`${i % 2 ? "is-r" : "is-l"} ${reached ? "is-on" : ""}`}>
            <span className="gfx-node"><b>{i + 1}</b></span>
            <div className="gfx-step">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.points.length > 0 && <ul>{s.points.map((x) => <li key={x}>{x}</li>)}</ul>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------------ tools */

function Tubes({ items }: { items: string[] }) {
  const [hot, setHot] = useState<number | null>(null);
  return (
    <div className="gfx-tubes">
      <ul>
        {items.map((t, i) => (
          <li key={t} style={{ "--o": (i * 41) % 150, "--i": i } as React.CSSProperties}>
            <button type="button" className={hot === i ? "is-on" : ""} onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)} onMouseLeave={() => setHot(null)} onBlur={() => setHot(null)}>
              <span className="gfx-tube" aria-hidden="true"><i /></span>
              <b>{t}</b>
            </button>
          </li>
        ))}
      </ul>
      <div className="gfx-palette" aria-hidden="true">
        <svg viewBox="0 0 220 170"><g filter="url(#gfx-wobble)"><path d="M110 12 C46 8 10 50 14 92 C18 138 62 158 98 150 C120 146 112 124 128 118 C150 110 176 132 196 112 C226 82 190 18 110 12 Z" /><circle cx="150" cy="108" r="10" className="hole" /></g></svg>
        {items.map((t, i) => <span key={t} className={`gfx-dab ${hot === i ? "is-on" : ""}`} style={{ "--o": (i * 41) % 150, left: `${22 + (i % 4) * 17}%`, top: `${26 + Math.floor(i / 4) * 24}%` } as React.CSSProperties} />)}
        <p>{hot === null ? "Hover a tube" : items[hot]}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------------ industries: drawn and coloured while you scroll */

type LenisLike = { scrollTo: (y: number, o?: { duration?: number }) => void };

function Town({ ind }: { ind: NonNullable<TechData["industries"]> }) {
  const items = ind.items.slice(0, 9);
  const n = items.length;
  const outer = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const names = items.map((x) => x.name).join("|");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const kinds = useMemo(() => items.map((x, i) => kindOf(x.name, i)), [names]);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = outer.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight))));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const INK_END = 0.8; // the drawing is finished at 80% of the scroll
  const ink = Math.max(0, Math.min(1, p / INK_END));
  const col = Math.max(0, Math.min(1, (p - 0.12) / 0.88));
  const frac = (i: number) => (slotX(i, n) + TOWN_W / 2) / TOWN_W;
  const drawn = (i: number) => ink > frac(i) + 0.06;
  const derived = Math.max(0, Math.min(n - 1, items.findIndex((_, i) => !drawn(i)) === -1 ? n - 1 : Math.max(0, items.findIndex((_, i) => !drawn(i)) - 1)));
  const done = p >= 0.9;
  const sel = done ? (pick ?? n - 1) : derived;
  const cur = items[sel];

  const go = (i: number) => {
    if (done) { setPick(i); return; }
    const el = outer.current;
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top + ((frac(i) + 0.08) * INK_END) * (el.offsetHeight - window.innerHeight);
    const l = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (l) l.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="gfx-town-pin" ref={outer}>
      <div className="gfx-town-in" style={{ "--ink": `${ink * 106}%`, "--col": `${col * 126}%` } as React.CSSProperties}>
        <p className="gfx-ab-label">Artboard 2 · Industries · 1200 × 560 px</p>
        <div className="gfx-board">
          <div className="gfx-layer gfx-layer-col"><BrushTown kinds={kinds} layer="color" /></div>
          <div className="gfx-layer gfx-layer-ink"><BrushTown kinds={kinds} layer="ink" /></div>
          <span className="gfx-penmark" aria-hidden="true" style={{ left: `${Math.min(100, ink * 100)}%`, top: `${50 + Math.sin(ink * 38) * 22}%`, opacity: ink > 0.01 && ink < 0.99 ? 1 : 0 }}>
            <svg viewBox="0 0 28 28"><path d="M3 25 L9 11 L16 8 L20 12 L17 19 Z" /><path d="M16 8 L22 2 L26 6 L20 12" /></svg>
          </span>
          <div className="gfx-spots">
            {items.map((x, i) => (
              <button key={x.name} type="button" className={`${sel === i ? "is-on" : ""} ${drawn(i) ? "is-drawn" : ""}`} style={{ left: `${frac(i) * 100}%` }} onClick={() => go(i)} aria-pressed={sel === i} aria-label={x.name}>
                <span>{x.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="gfx-note" key={sel}>
          <span className="gfx-tape" aria-hidden="true" />
          <small>{String(sel + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</small>
          <h3>{cur.name}</h3>
          <p>{cur.description}</p>
          <div className="gfx-note-nav">
            <button type="button" onClick={() => go((sel + n - 1) % n)} aria-label="Previous industry">←</button>
            <button type="button" onClick={() => go((sel + 1) % n)} aria-label="Next industry">→</button>
          </div>
        </div>
        <p className="gfx-scrollhint" data-hidden={p > 0.05}>Scroll: the town gets drawn, then painted</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------------ faq */

function Bubbles({ faq }: { faq: TechData["faq"] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="gfx-faq">
      {faq.map((f, i) => (
        <div key={f.question} className={`gfx-qa ${open === i ? "is-on" : ""}`}>
          <button type="button" className="gfx-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{f.question}</button>
          {open === i && <p className="gfx-a">{f.answer}</p>}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------------ page */

export function GraphicsPage({ d }: { d: TechData }) {
  const parts = storyParts(d.story);
  // the cursor of this page is the Pen tool (see the .cu-pen rules in globals.css)
  useEffect(() => {
    document.documentElement.classList.add("cursor-pen");
    return () => document.documentElement.classList.remove("cursor-pen");
  }, []);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <div className="gfx">
      <Wobble />
      <Curtain />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />

      <Workspace d={d} />

      <section className="gfx-sec gfx-story">
        <div className="gfx-page">
          <span className="gfx-tape gfx-tape-l" aria-hidden="true" />
          <span className="gfx-tape gfx-tape-r" aria-hidden="true" />
          {parts.map((p, n) => (
            <p key={n} className={n === 0 ? "gfx-big" : "gfx-small"}>{p.map((x, k) => (x.em ? <mark key={k}>{x.text}</mark> : <span key={k}>{x.text}</span>))}</p>
          ))}
        </div>
      </section>

      <section className="gfx-sec gfx-sec-wide" id="learn">
        <Head chip="Learn graphic design" title="What Is Graphic Design?" intro="Five short lessons with small toys to play with. No experience needed: after five minutes you will know what a graphic designer really does." />
        <Learn />
      </section>

      <section id="services" className="gfx-sec">
        <Head chip="What we design" title={oneLine(d.services.heading)} intro={d.services.intro} />
        <div className="gfx-abs">{d.services.cards.map((c, i) => <ArtboardCard key={c.title} c={c} n={i} />)}</div>
      </section>

      <section className="gfx-sec">
        <Head chip="Everything we design" title="From Logo Design To Packaging, Print And Social Media" intro="If it needs a picture, a layout or a brand look, our graphic designers can create it." />
        <ul className="gfx-kw">
          {KEYWORDS.map((k, i) => <li key={k} style={{ "--o": (i * 29) % 150 } as React.CSSProperties}>{k}</li>)}
        </ul>
      </section>

      {d.process && (
        <section className="gfx-sec">
          <Head chip="Sketch to final" title={oneLine(d.process.heading)} intro={d.process.intro} />
          <Process process={d.process} />
        </section>
      )}

      <section className="gfx-sec">
        <Head chip="Our software" title={oneLine(d.tools.heading)} intro="Adobe Illustrator, Photoshop and InDesign for artwork and print, Figma and others for interfaces." />
        <Tubes items={d.tools.items} />
      </section>

      {d.industries && (
        <section className="gfx-sec gfx-sec-wide gfx-sec-town">
          <Head chip="Drawn for every industry" title={oneLine(d.industries.heading)} intro={d.industries.intro} />
          <Town ind={d.industries} />
        </section>
      )}

      <section className="gfx-sec">
        <Head chip="Why us" title={oneLine(d.why.heading)} intro={d.why.intro} />
        <ul className="gfx-notes">
          {d.why.items.map((w, i) => (
            <li key={w.title} style={{ "--r": `${[-2.2, 1.6, -1, 2.4, -1.8, 1.2][i % 6]}deg`, "--o": (i * 47) % 140 } as React.CSSProperties}>
              <span className="gfx-pin" aria-hidden="true" />
              <h3>{w.title}</h3>
              <p>{w.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="gfx-sec">
        <Head chip="Ask us" title="Graphic Design Questions We Often Hear" />
        <Bubbles faq={d.faq} />
      </section>

      <section className="gfx-sec">
        <Head chip="More to explore" title="Pictures From The Same Studio" />
        <ul className="gfx-frames">
          {d.related.map((r, i) => (
            <li key={r.href} style={{ "--r": `${[-2, 1.6, -1.2, 2][i % 4]}deg`, "--d": `${i * 0.4}s`, "--o": (i * 55) % 150 } as React.CSSProperties}>
              <SmartLink href={r.href}>
                <span className="gfx-nail" aria-hidden="true" />
                <i aria-hidden="true" />
                <b>{oneLine(r.title)}</b>
                <span>{r.description}</span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
