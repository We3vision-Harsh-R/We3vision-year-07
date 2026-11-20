"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/gta-route.css";

// GTA theme (task 160, gta-route.css prefix mr-): under the words of the home contact section, a small city map with a route "Jason -> Lucia". The four
// checkpoints on the route (named after places of the GTA map: Vice City, Leonida Keys, Grassrivers, Port Gellhorn) are the four fields of the form (Name, Email, Phone, Project): every field that is filled in correctly lights its checkpoint and
// the message (an envelope) drives on to it. While the form is sent the envelope speeds up to the last turn, and when the message is sent it arrives at
// Lucia ("Delivered"). The form (home-contact.tsx) tells this map what is going on with the window event "w3v-lead" ({ done, stage }). Own drawing, theme
// colours only. Decoration: aria-hidden (the form announces its own result).
const W = 520;
const H = 196;
const PTS: [number, number][] = [
  [40, 176],
  [40, 130],
  [230, 130],
  [230, 80],
  [430, 80],
  [430, 30],
  [480, 30],
];
const SEG = PTS.slice(1).map((p, i) => Math.hypot(p[0] - PTS[i][0], p[1] - PTS[i][1]));
const CUM = SEG.reduce<number[]>((a, s) => [...a, a[a.length - 1] + s], [0]);
const TOTAL = CUM[CUM.length - 1];
// the point at a distance along the route
const at = (d: number): [number, number] => {
  const c = Math.min(TOTAL, Math.max(0, d));
  let i = 1;
  while (i < CUM.length - 1 && c > CUM[i]) i++;
  const t = (c - CUM[i - 1]) / SEG[i - 1];
  return [PTS[i - 1][0] + (PTS[i][0] - PTS[i - 1][0]) * t, PTS[i - 1][1] + (PTS[i][1] - PTS[i - 1][1]) * t];
};
const CP = [
  { d: 96, label: "Vice City", dx: 0, dy: 24 },
  { d: 236, label: "Leonida Keys", dx: 0, dy: 24 },
  { d: 356, label: "Grassrivers", dx: 0, dy: -14 },
  { d: 486, label: "Port Gellhorn", dx: -6, dy: 25 },
];
const STOPS = [0, ...CP.map((c) => c.d)]; // where the envelope waits after 0, 1 ... 4 fields
const SENDING = 540;
const ROUTE = `M${PTS.map((p) => p.join(" ")).join("L")}`;
// the roads and the blocks between them
const VX = [40, 130, 230, 330, 430, 480];
const HY = [30, 80, 130, 176];
const XS = [0, ...VX, W];
const YS = [0, ...HY, H];
const BLOCKS: { x: number; y: number; w: number; h: number; k: number }[] = [];
XS.slice(1).forEach((x1, i) => {
  YS.slice(1).forEach((y1, j) => {
    const x0 = XS[i] + (i === 0 ? 4 : 10);
    const y0 = YS[j] + (j === 0 ? 4 : 10);
    const w = x1 - x0 - (i === XS.length - 2 ? 4 : 10);
    const h = y1 - y0 - (j === YS.length - 2 ? 4 : 10);
    if (w > 16 && h > 16) BLOCKS.push({ x: x0, y: y0, w, h, k: (i * 7 + j * 3) % 4 });
  });
});

type Stage = "typing" | "sending" | "sent" | "fail";
const SAY = (n: number, s: Stage) => (s === "sent" ? "Delivered. Lucia got your message." : s === "sending" ? "Sending your message…" : s === "fail" ? "Not delivered. Check the form." : n === 0 ? "Fill the form to start the drive." : n === 4 ? "Route ready. Press send." : `Route locked: ${n} of 4 stops reached.`);

export function HomeMessageRoute() {
  const [n, setN] = useState(0);
  const [stage, setStage] = useState<Stage>("typing");
  const doneRef = useRef<SVGPathElement>(null);
  const envRef = useRef<SVGGElement>(null);
  const goal = useRef(0);
  const kickRef = useRef<() => void>(() => {});
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0;
    let raf = 0;
    const paint = () => {
      const [x, y] = at(cur);
      doneRef.current?.style.setProperty("stroke-dasharray", `${cur.toFixed(1)} ${TOTAL + 20}`);
      envRef.current?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    };
    const tick = () => {
      raf = 0;
      cur += (goal.current - cur) * 0.07;
      if (Math.abs(goal.current - cur) < 0.4) cur = goal.current;
      paint();
      if (cur !== goal.current) raf = requestAnimationFrame(tick);
    };
    kickRef.current = () => {
      if (reduce) {
        cur = goal.current;
        paint();
      } else if (!raf) raf = requestAnimationFrame(tick);
    };
    paint();
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ done: number; stage: Stage }>).detail;
      if (!d) return;
      setN(d.done);
      setStage(d.stage);
      goal.current = d.stage === "sent" ? TOTAL : d.stage === "sending" ? SENDING : STOPS[Math.min(4, Math.max(0, d.done))];
      kickRef.current();
    };
    window.addEventListener("w3v-lead", on);
    return () => {
      window.removeEventListener("w3v-lead", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const [lx, ly] = PTS[PTS.length - 1];
  return (
    <div className="mr" data-stage={stage} data-pause-off aria-hidden>
      <div className="mr-bar">
        <span className="mr-k">Message route</span>
        <span className="mr-say">{SAY(n, stage)}</span>
      </div>
      <svg className="mr-map" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <clipPath id="mr-clip">
            <rect width={W} height={H} />
          </clipPath>
        </defs>
        <g clipPath="url(#mr-clip)">
          <rect className="mr-ground" width={W} height={H} />
          {BLOCKS.map((b, i) => (
            <rect key={i} className={`mr-block mr-b${b.k}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="5" />
          ))}
          <path className="mr-water" d={`M330 ${H} Q380 150 ${W} 140 V${H} Z`} />
          {VX.map((x) => (
            <path key={`v${x}`} className="mr-road" d={`M${x} 0V${H}`} />
          ))}
          {HY.map((y) => (
            <path key={`h${y}`} className="mr-road" d={`M0 ${y}H${W}`} />
          ))}
          {/* the route: dotted road ahead, lit road behind the envelope */}
          <path className="mr-ahead" d={ROUTE} />
          <path ref={doneRef} className="mr-done" d={ROUTE} />
          {CP.map((c, i) => {
            const [x, y] = at(c.d);
            return (
              <g key={c.label} className="mr-cp" data-on={n > i || stage === "sent" || stage === "sending" ? "" : undefined} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <circle r="8" />
                <text x={c.dx} y={c.dy} textAnchor="middle">
                  {c.label}
                </text>
              </g>
            );
          })}
          <g className="mr-you" transform={`translate(${PTS[0][0]} ${PTS[0][1]})`}>
            <path d="M0 -9 L7 8 L0 4 L-7 8Z" />
            <text x="14" y="6">
              Jason
            </text>
          </g>
          <g className="mr-lucia" transform={`translate(${lx} ${ly})`}>
            <circle className="mr-ping" r="12" />
            <circle className="mr-ping mr-ping2" r="12" />
            <path className="mr-dia" d="M0 -11 L11 0 L0 11 L-11 0Z" />
            <text x="-20" y="5" textAnchor="end">
              Lucia
            </text>
          </g>
          {/* the message: an envelope that drives along the route */}
          <g ref={envRef} className="mr-env">
            <g className="mr-env-in">
              <rect x="-14" y="-10" width="28" height="20" rx="5" />
              <path d="M-9 -4 L0 3 L9 -4" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
