"use client";

import { useRef, useState } from "react";

// The "Meet the designer" section of the UI/UX page (the "guide" section with the scene "figma"): a small Figma on a whole screen. There is a
// layers panel, a canvas with a frame that holds a landing page and a properties panel. A click selects a layer (on the canvas or in the list),
// a drag moves it, the eye hides it, the swatches change its colour, "Wireframe / Final design" turns the frame from grey boxes to the finished
// design, "Prototype" shows the flow and two cursors of colleagues move on the canvas. No cartoon guide. The look is in globals.css (.fg-*).

type Kind = "bar" | "logo" | "title" | "text" | "button" | "image" | "card";
type El = { id: string; label: string; kind: Kind; x: number; y: number; w: number; h: number; r: number; hue: number };

const FRAME = { w: 520, h: 330 };
const ELEMENTS: El[] = [
  { id: "nav", label: "Navbar", kind: "bar", x: 0, y: 0, w: 520, h: 42, r: 0, hue: 0 },
  { id: "logo", label: "Logo", kind: "logo", x: 18, y: 12, w: 74, h: 18, r: 6, hue: 0 },
  { id: "title", label: "Heading", kind: "title", x: 36, y: 72, w: 232, h: 66, r: 0, hue: 0 },
  { id: "sub", label: "Body text", kind: "text", x: 36, y: 148, w: 206, h: 36, r: 0, hue: 0 },
  { id: "cta", label: "Button / Primary", kind: "button", x: 36, y: 200, w: 116, h: 38, r: 19, hue: 0 },
  { id: "hero", label: "Hero image", kind: "image", x: 300, y: 64, w: 188, h: 160, r: 16, hue: 28 },
  { id: "c1", label: "Card 1", kind: "card", x: 36, y: 252, w: 140, h: 58, r: 12, hue: 0 },
  { id: "c2", label: "Card 2", kind: "card", x: 190, y: 252, w: 140, h: 58, r: 12, hue: -24 },
  { id: "c3", label: "Card 3", kind: "card", x: 344, y: 252, w: 140, h: 58, r: 12, hue: 44 },
];
const SWATCHES = [0, 28, -24, 44, -48];
const TOOLS = [
  { id: "move", name: "Move", d: "M5 3l12 7-5 1.5L9.5 17z" },
  { id: "frame", name: "Frame", d: "M7 3v14M13 3v14M3 7h14M3 13h14" },
  { id: "rect", name: "Rectangle", d: "M4 5h12v10H4z" },
  { id: "pen", name: "Pen", d: "M4 16l1-4 8-8 3 3-8 8z" },
  { id: "text", name: "Text", d: "M5 5h10M10 5v11" },
  { id: "hand", name: "Hand", d: "M7 10V5.5a1.2 1.2 0 012.4 0V10m0-5a1.2 1.2 0 012.4 0V10m0-3a1.2 1.2 0 012.4 0v5c0 3-2 5-5 5S6 15 5 12" },
];

const fillOf = (hue: number, l = 62, a = 1) => `hsl(calc(var(--th) + 354 + ${hue}) calc(92% * var(--ts)) ${l}% / ${a})`;

export function FigmaStudio({ chip, heading, text }: { chip: string; heading: string; text: string }) {
  const [final, setFinal] = useState(false);
  const [tab, setTab] = useState<"design" | "prototype">("design");
  const [tool, setTool] = useState("move");
  const [sel, setSel] = useState("cta");
  const [off, setOff] = useState<Record<string, { x: number; y: number }>>({});
  const [hue, setHue] = useState<Record<string, number>>({});
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: string; px: number; py: number; ox: number; oy: number } | null>(null);

  const el = (id: string) => ELEMENTS.find((e) => e.id === id) ?? ELEMENTS[0];
  const pos = (e: El) => ({ x: e.x + (off[e.id]?.x ?? 0), y: e.y + (off[e.id]?.y ?? 0) });
  const hueOf = (e: El) => hue[e.id] ?? e.hue;
  const cur = el(sel);
  const cp = pos(cur);

  const onDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSel(id);
    if (tool !== "move" && tool !== "hand") setTool("move");
    if (id === "nav") return;
    drag.current = { id, px: e.clientX, py: e.clientY, ox: off[id]?.x ?? 0, oy: off[id]?.y ?? 0 };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const svg = svgRef.current;
    if (!d || !svg) return;
    const k = FRAME.w / svg.getBoundingClientRect().width;
    const base = el(d.id);
    const nx = Math.min(FRAME.w - base.w - base.x, Math.max(-base.x, d.ox + (e.clientX - d.px) * k));
    const ny = Math.min(FRAME.h - base.h - base.y, Math.max(-base.y, d.oy + (e.clientY - d.py) * k));
    setOff((o) => ({ ...o, [d.id]: { x: nx, y: ny } }));
  };
  const onUp = () => {
    drag.current = null;
  };

  const draw = (e: El) => {
    const p = pos(e);
    const h = hueOf(e);
    const g = (children: React.ReactNode) => (
      <g key={e.id} className="fg-el" data-sel={sel === e.id} data-hide={!!hidden[e.id]} transform={`translate(${p.x} ${p.y})`} onPointerDown={(ev) => onDown(ev, e.id)}>
        {children}
        <rect className="fg-hit" width={e.w} height={e.h} />
      </g>
    );
    if (e.kind === "bar")
      return g(<rect className={final ? "fg-bar-f" : "fg-w-box"} width={e.w} height={e.h} />);
    if (e.kind === "logo")
      return g(
        final ? (
          <>
            <circle cx="9" cy="9" r="8" fill={fillOf(h, 66)} />
            <text x="24" y="14" className="fg-t fg-t-logo">
              Studio
            </text>
          </>
        ) : (
          <rect className="fg-w-box" width={e.w} height={e.h} rx={e.r} />
        ),
      );
    if (e.kind === "title")
      return g(
        final ? (
          <>
            <text x="0" y="26" className="fg-t fg-t-h">
              Design that
            </text>
            <text x="0" y="58" className="fg-t fg-t-h" style={{ fill: fillOf(h, 76) }}>
              people love
            </text>
          </>
        ) : (
          <>
            <rect className="fg-w-line" width="206" height="14" rx="4" />
            <rect className="fg-w-line" y="26" width="150" height="14" rx="4" />
          </>
        ),
      );
    if (e.kind === "text")
      return g(
        final ? (
          <>
            <text x="0" y="12" className="fg-t fg-t-p">
              Wireframes, prototypes and
            </text>
            <text x="0" y="30" className="fg-t fg-t-p">
              pixels, tested with people.
            </text>
          </>
        ) : (
          <>
            <rect className="fg-w-line" width="190" height="8" rx="4" />
            <rect className="fg-w-line" y="16" width="160" height="8" rx="4" />
          </>
        ),
      );
    if (e.kind === "button")
      return g(
        final ? (
          <>
            <rect width={e.w} height={e.h} rx={e.r} fill={fillOf(h, 74)} />
            <text x={e.w / 2} y={e.h / 2 + 5} textAnchor="middle" className="fg-t fg-t-b">
              Get started
            </text>
          </>
        ) : (
          <>
            <rect className="fg-w-box" width={e.w} height={e.h} rx={e.r} />
            <rect className="fg-w-line" x="26" y="15" width="64" height="8" rx="4" />
          </>
        ),
      );
    if (e.kind === "image")
      return g(
        final ? (
          <>
            <rect width={e.w} height={e.h} rx={e.r} fill={fillOf(h, 50, 0.9)} />
            <circle cx={e.w * 0.68} cy={e.h * 0.34} r="30" fill={fillOf(h + 20, 78, 0.95)} />
            <path d={`M0 ${e.h - 46}Q${e.w * 0.3} ${e.h - 86} ${e.w * 0.58} ${e.h - 50}T${e.w} ${e.h - 56}V${e.h - e.r}Q${e.w} ${e.h} ${e.w - e.r} ${e.h}H${e.r}Q0 ${e.h} 0 ${e.h - e.r}Z`} fill={fillOf(h - 20, 36, 0.95)} />
          </>
        ) : (
          <>
            <rect className="fg-w-box" width={e.w} height={e.h} rx={e.r} />
            <path className="fg-w-x" d={`M0 0L${e.w} ${e.h}M${e.w} 0L0 ${e.h}`} />
          </>
        ),
      );
    // card
    return g(
      final ? (
        <>
          <rect width={e.w} height={e.h} rx={e.r} className="fg-card-f" />
          <circle cx="22" cy={e.h / 2} r="11" fill={fillOf(h, 70)} />
          <text x="42" y={e.h / 2 - 2} className="fg-t fg-t-c">
            Feature
          </text>
          <rect x="42" y={e.h / 2 + 8} width="62" height="6" rx="3" fill={fillOf(h, 80, 0.45)} />
        </>
      ) : (
        <>
          <rect className="fg-w-box" width={e.w} height={e.h} rx={e.r} />
          <rect className="fg-w-line" x="14" y="16" width="26" height="26" rx="13" />
          <rect className="fg-w-line" x="50" y="20" width="70" height="8" rx="4" />
          <rect className="fg-w-line" x="50" y="34" width="46" height="8" rx="4" />
        </>
      ),
    );
  };

  return (
    <section id="guide" className="fg-section">
      <div className="fg-in">
        <div className="fg-head">
          {chip && <span className="cj-chip">{chip}</span>}
          <h2>{heading.replace(/\n/g, " ")}</h2>
          {text && <p>{text}</p>}
        </div>

        <div className="fg-win" data-final={final}>
          <div className="fg-top">
            <span className="fg-menu" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className="fg-file">
              Landing page <small>· Draft</small>
            </span>
            <div className="fg-seg" role="group" aria-label="Fidelity">
              <button type="button" data-on={!final} onClick={() => setFinal(false)}>
                Wireframe
              </button>
              <button type="button" data-on={final} onClick={() => setFinal(true)}>
                Final design
              </button>
            </div>
            <span className="fg-who" aria-hidden>
              <i>HC</i>
              <i>RV</i>
            </span>
            <button type="button" className="fg-share">
              Share
            </button>
          </div>

          <div className="fg-body">
            <aside className="fg-layers" aria-label="Layers">
              <p className="fg-p-h">Layers</p>
              <ul>
                {ELEMENTS.map((e) => (
                  <li key={e.id}>
                    <button type="button" className="fg-layer" data-on={sel === e.id} onClick={() => setSel(e.id)}>
                      <i className="fg-ic" data-k={e.kind} aria-hidden />
                      <span>{e.label}</span>
                    </button>
                    <button type="button" className="fg-eye" data-off={!!hidden[e.id]} aria-label={`${hidden[e.id] ? "Show" : "Hide"} ${e.label}`} onClick={() => setHidden((h) => ({ ...h, [e.id]: !h[e.id] }))} />
                  </li>
                ))}
              </ul>
            </aside>

            <div className="fg-canvas" data-tool={tool} onPointerDown={() => setSel("")}>
              <span className="fg-cur fg-cur-a" aria-hidden>
                <b>Harsh</b>
              </span>
              <span className="fg-cur fg-cur-b" aria-hidden>
                <b>Riya</b>
              </span>
              <p className="fg-frame-name">Landing · Desktop</p>
              <svg ref={svgRef} className="fg-frame" viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} role="img" aria-label="The landing page frame" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
                <rect className="fg-frame-bg" width={FRAME.w} height={FRAME.h} />
                {ELEMENTS.map(draw)}
                {tab === "prototype" && (
                  <g className="fg-flow" pointerEvents="none">
                    <path d={`M${pos(el("cta")).x + 116} ${pos(el("cta")).y + 19}C 200 ${pos(el("cta")).y + 19}, 250 190, 300 ${pos(el("hero")).y + 80}`} />
                    <circle cx={pos(el("cta")).x + 116} cy={pos(el("cta")).y + 19} r="4" />
                    <path className="fg-flow-head" d={`M292 ${pos(el("hero")).y + 72}l10 8-10 8`} />
                  </g>
                )}
                {cur && sel && !hidden[sel] && (
                  <g pointerEvents="none" transform={`translate(${cp.x} ${cp.y})`}>
                    <rect className="fg-sel" width={cur.w} height={cur.h} />
                    {[[0, 0], [cur.w, 0], [0, cur.h], [cur.w, cur.h]].map(([hx, hy]) => (
                      <rect key={`${hx}-${hy}`} className="fg-handle" x={hx - 4} y={hy - 4} width="8" height="8" />
                    ))}
                    <g transform={`translate(0 ${cur.h + 10})`}>
                      <rect className="fg-dim" x={cur.w / 2 - 34} width="68" height="18" rx="5" />
                      <text className="fg-dim-t" x={cur.w / 2} y="13" textAnchor="middle">
                        {Math.round(cur.w)} × {Math.round(cur.h)}
                      </text>
                    </g>
                  </g>
                )}
              </svg>

              <div className="fg-tools" role="toolbar" aria-label="Tools">
                {TOOLS.map((t) => (
                  <button key={t.id} type="button" data-on={tool === t.id} aria-label={t.name} title={t.name} onClick={() => setTool(t.id)}>
                    <svg viewBox="0 0 20 20" aria-hidden>
                      <path d={t.d} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <aside className="fg-props" aria-label="Properties">
              <div className="fg-tabs" role="tablist">
                <button type="button" role="tab" aria-selected={tab === "design"} data-on={tab === "design"} onClick={() => setTab("design")}>
                  Design
                </button>
                <button type="button" role="tab" aria-selected={tab === "prototype"} data-on={tab === "prototype"} onClick={() => setTab("prototype")}>
                  Prototype
                </button>
              </div>
              {tab === "design" ? (
                sel ? (
                  <div className="fg-pbody">
                    <p className="fg-p-name">{cur.label}</p>
                    <dl className="fg-grid">
                      <div>
                        <dt>X</dt>
                        <dd>{Math.round(cp.x)}</dd>
                      </div>
                      <div>
                        <dt>Y</dt>
                        <dd>{Math.round(cp.y)}</dd>
                      </div>
                      <div>
                        <dt>W</dt>
                        <dd>{cur.w}</dd>
                      </div>
                      <div>
                        <dt>H</dt>
                        <dd>{cur.h}</dd>
                      </div>
                      <div>
                        <dt>R</dt>
                        <dd>{cur.r}</dd>
                      </div>
                    </dl>
                    <p className="fg-p-h">Fill</p>
                    <div className="fg-sw">
                      {SWATCHES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-label={`Colour ${s}`}
                          data-on={hueOf(cur) === s}
                          style={{ background: fillOf(s, 66) }}
                          onClick={() => {
                            setHue((h) => ({ ...h, [cur.id]: s }));
                            setFinal(true);
                          }}
                        />
                      ))}
                    </div>
                    <p className="fg-p-h">Layer</p>
                    <p className="fg-p-t">{cur.kind === "title" || cur.kind === "text" ? "Poppins · Semibold" : "Auto layout · Fill"}</p>
                  </div>
                ) : (
                  <div className="fg-pbody">
                    <p className="fg-p-t">Select a layer on the canvas or in the list to see its properties. Drag it to move it.</p>
                  </div>
                )
              ) : (
                <div className="fg-pbody">
                  <p className="fg-p-name">Flow 1</p>
                  <p className="fg-p-t">On click · Get started → Navigate to Pricing</p>
                  <p className="fg-p-h">Animation</p>
                  <p className="fg-p-t">Smart animate · Ease out · 300 ms</p>
                </div>
              )}
            </aside>
          </div>
        </div>
        <p className="fg-hint">Click a layer, drag it, change its colour, switch from wireframe to the final design.</p>
      </div>
    </section>
  );
}
