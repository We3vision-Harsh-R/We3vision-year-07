"use client";

import "@/styles/careers.css";


import { useEffect, useRef, useState } from "react";
import { getCareer, setCareer, useCareer } from "@/lib/career-store";
import { PersonTop } from "../timeline-art";

// The railway of the Careers page: ONE track that runs through the whole page, from above the first screen to the last section, in a few long,
// soft sweeps from one edge of the page to the other. It stays in the margins beside the content; where it has to go under a block (the board
// of the teams, the window of the help desk) it goes into a tunnel with a name. The tunnel starts well in front of the block, so that nobody
// is surprised: first a gate with a board that says the name, then a short open cut (the walls are cut across, so that it can be seen that the
// line goes down into the ground), then the roof. Nothing of the track or of the train is to be seen under the roof or under the block, and
// the train comes out of the gate on the other side. It is drawn on one layer
// behind the page (it is not in a box). On the way: the first station (the ticket office) with its platform, signals, a level crossing,
// a bridge over a stream, a little stop for every value of the company, mile posts, poles, trees, and Surat Junction at the end.
// The train (an engine at both ends and three coaches, seen from above, every car turns with the curve) does not exist until the visitor has chosen a city,
// a current status and a destination. Then it comes in from the top and stands at the platform. When the seat is booked it rides down the
// page with the scroll, smoothly; when the passenger details are sent the page rides to Surat Junction and the passenger gets out.
// The geometry is measured from the sections of the page: they only have to carry the markers that are listed in measure().
// The look is in globals.css (.rl-*). Laptop and desktop screens.

const STEP = 6; // px between two samples of the path
const COACH_L = 96;
const ENGINE_L = 118;
const CAR_W = 46;
const GAP = 6;
const COACHES = 3;
const CARS = COACHES + 2; // an engine at the front, the coaches, an engine at the back
const TRAIN_L = ENGINE_L * 2 + COACHES * (COACH_L + GAP) + GAP;
const LEAD = 200; // a tunnel starts this far in front of the block it goes under
const CUT = 64; // the open cut at its start (the walls are cut across)
const TAIL = 34; // and goes on this far after the block
// the names of the tunnels (Surat is the city of diamonds and of silk)
const TUNNEL_NAMES = [
  { name: "Diamond Tunnel", sub: "Surat, the diamond city" },
  { name: "Silk Route Tunnel", sub: "Surat, the silk city" },
  { name: "Idea Tunnel", sub: "Where good work begins" },
  { name: "Hello Tunnel", sub: "Say hi to our team" },
];
// the blocks of the page that the track must not run over or under: where it meets one, it goes through a tunnel
const COVER = ".rt-board, .rh-window, .rv-card, .cj-form, .cj-after, .cj-loc-block, .cj-station-card, #contact address";
// (and the lines of text of the headings: only where there is text, not the whole width of the block that holds it)
const COVER_TEXT = ".rv-head h2, .rv-head p, .cj-head h1, .cj-head p, .cj-dest-text h2, .cj-dest-text > p, #contact > :first-child h2, #contact > :first-child p";

type Sample = { xs: Float32Array; ys: Float32Array; as: Float32Array; n: number };
type Stop = { x: number; y: number; side: 1 | -1; label: string };
type Geo = {
  W: number;
  H: number;
  d: string;
  len: number;
  sample: Sample;
  x1: number;
  yHead1: number;
  x2: number;
  yHead2: number;
  sStop1: number;
  sEnd: number;
  stops: Stop[];
  crossing: { y: number; x: number } | null;
  river: { y: number; h: number } | null;
  signals: { s: number; side: 1 | -1 }[];
  poles: { s: number; side: 1 | -1 }[];
  miles: { s: number; label: string }[];
  trees: { x: number; y: number; r: number }[];
  /** the blocks that have a tunnel under them (the track and the train are not drawn there) */
  covers: { x: number; y: number; w: number; h: number; r: number }[];
  /** the tunnels: the line under the roof is not drawn, the roof is */
  tunnels: Tunnel[];
  /** where the line ends (it fades out there and a buffer stop stands at its end) */
  endY: number;
};
type Pt = { x: number; y: number; a: number };
type Tunnel = {
  name: string;
  sub: string;
  /** the open cut at the start, the roof, and the part of the line that is out of sight (as paths) */
  dCut: string;
  dRoof: string;
  dUnder: string;
  gateIn: Pt;
  gateOut: Pt;
  boardIn: { x: number; y: number };
  boardOut: { x: number; y: number };
  /** the train is out of sight between these two places of the line (px from the start of the line) */
  sA: number;
  sB: number;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function rel(el: Element | null, top0: number, scrollY: number) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + scrollY - top0, bottom: r.bottom + scrollY - top0, left: r.left, right: r.right, width: r.width, height: r.height };
}

/** a long, soft S-curve from (x1, y1) to (x2, y2) that leaves and arrives going straight down (the track never bends sharply) */
function curve(x1: number, y1: number, x2: number, y2: number) {
  const k = (y2 - y1) * 0.5;
  return `C${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`;
}

function measure(root: HTMLElement): Geo | null {
  const main = root.parentElement;
  if (!main) return null;
  const scrollY = window.scrollY;
  const top0 = root.getBoundingClientRect().top + scrollY;
  const W = root.clientWidth;
  const H = Math.max(main.scrollHeight, main.getBoundingClientRect().height);
  const journey = rel(document.getElementById("top"), top0, scrollY);
  const slot1 = rel(main.querySelector(".cj-slot"), top0, scrollY);
  const adv = rel(document.getElementById("advantages"), top0, scrollY);
  const svc = rel(document.getElementById("services"), top0, scrollY);
  const ct = rel(document.getElementById("contact"), top0, scrollY);
  const dest = rel(document.getElementById("surat-junction"), top0, scrollY);
  const slot2 = rel(main.querySelector(".cj-dest-slot"), top0, scrollY);
  if (!journey || !slot1 || !dest || !slot2) return null;

  const x1 = Math.min(W - 60, slot1.left + slot1.width * 0.74);
  const x2 = Math.min(W - 60, slot2.left + slot2.width * 0.74);
  // (the engine stops inside the first screen, whatever the height of the ticket is)
  const yHead1 = slot1.top + Math.min(slot1.height, window.innerHeight - 70) * 0.8;
  // the office of the last station stands in one line with the heading of that section (the centre of the office is 767px above the
  // place where the train stops); the list of the jobs is in the text column, beside the platform and not inside it
  const destHead = rel(main.querySelector("#surat-junction h2"), top0, scrollY);
  const yHead2 = destHead && destHead.height > 0 ? destHead.top + destHead.height / 2 + 767 : slot2.top + slot2.height * 0.88;

  // the margins: the middle of the space beside the cards of the values (right) and beside the board of the teams (left)
  const advList = rel(main.querySelector("#advantages .rv-list"), top0, scrollY);
  const board = rel(main.querySelector("#services .rt-board"), top0, scrollY);
  const xR = advList ? clamp((advList.right + W) / 2, x1, W - 56) : x1;
  const xL = board ? Math.max(56, board.left / 2) : 80;

  // the line: down the first station, then in long soft sweeps through the sections, down to the last station
  const yA = yHead1 + 190;
  let d = `M${x1} -700 L${x1} ${yA}`;
  let cx = x1;
  let cy = yA;
  const sweep = (x: number, y: number) => {
    const yy = Math.max(y, cy + 160);
    d += ` ${curve(cx, cy, x, yy)}`;
    cx = x;
    cy = yy;
  };
  const hold = (y: number) => {
    const yy = Math.max(y, cy);
    d += ` L${cx} ${yy}`;
    cy = yy;
  };
  const legs: { top: number; bottom: number }[] = [];
  if (adv) {
    // beside the cards of the values: a drift to the right margin, then straight down it (the heading of the teams is on the left: the sweep to the left starts under the board)
    sweep(xR, adv.top + 180);
    hold(adv.bottom - 20);
    legs.push({ top: adv.top, bottom: adv.bottom });
  }
  if (svc) {
    // under the board of the teams, out at the left margin (the stream is crossed there, straight)
    sweep(xL, svc.bottom - 50);
    hold(svc.bottom + 110);
    legs.push({ top: svc.top, bottom: svc.bottom });
  }
  if (ct) legs.push({ top: ct.top, bottom: ct.bottom });
  // the help desk: the window of the conversation is a panel, the track goes under it like a tunnel (from the left margin to the right one)
  const win = rel(main.querySelector("#contact .rh-window"), top0, scrollY);
  if (win) sweep(xR, win.bottom + 60);
  // and down to the platform of Surat Junction
  const yEnd = Math.max(yHead2 - 640, cy + 300);
  sweep(x2, yEnd);
  // the line ends beside the list of the jobs: it fades away and a buffer stop stands at its end
  const endY = Math.max(clamp(yHead2 + 560, yHead2 + 220, Math.max(yHead2 + 220, H - 70)), yEnd + 200);
  d += ` L${x2} ${endY}`;

  // measure the line (a path in a hidden svg)
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  svg.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
  document.body.appendChild(svg);
  const len = path.getTotalLength();
  const n = Math.ceil(len / STEP) + 1;
  const xs = new Float32Array(n);
  const ys = new Float32Array(n);
  const as = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = path.getPointAtLength(Math.min(len, i * STEP));
    xs[i] = p.x;
    ys[i] = p.y;
  }
  svg.remove();
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(n - 1, i + 1);
    as[i] = Math.atan2(ys[b] - ys[a], xs[b] - xs[a]);
  }
  const sample: Sample = { xs, ys, as, n };
  const sOfY = (y: number) => {
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (ys[m] < y) lo = m + 1;
      else hi = m;
    }
    return lo * STEP;
  };

  // a little stop for every value of the company (the markers [data-stop] in the sections)
  const stops: Stop[] = [];
  main.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
    const r = rel(el, top0, scrollY);
    if (!r) return;
    const y = r.top + r.height / 2;
    const i = clamp(Math.round(sOfY(y) / STEP), 0, n - 1);
    const x = xs[i];
    // (only where the track is beside the content: under a card there is nothing to be seen)
    const gw = W * 0.14;
    if (x > gw + 30 && x < W - gw - 30) return;
    stops.push({ x, y, side: x < W / 2 ? 1 : -1, label: el.dataset.stop ?? "" });
  });

  // a level crossing in the middle of the first section after the journey, a stream under a bridge in the gap after the second one
  let crossing: Geo["crossing"] = null;
  if (adv) {
    const y = adv.top + 420;
    crossing = { y, x: xs[clamp(Math.round(sOfY(y) / STEP), 0, n - 1)] };
  }
  let river: Geo["river"] = null;
  if (svc && ct) river = { y: (svc.bottom + ct.top) / 2 - 40, h: 80 };

  const sStop1 = sOfY(yHead1);
  const sEnd = sOfY(yHead2);
  const signals: Geo["signals"] = [];
  const poles: Geo["poles"] = [];
  const miles: Geo["miles"] = [];
  const total = Math.max(1, Math.floor((sEnd - sStop1) / 1000));
  for (let s = 140; s < len - 200; s += 230) poles.push({ s, side: Math.floor(s / 230) % 2 === 0 ? 1 : -1 });
  for (let k = 0; k <= total; k++) miles.push({ s: sStop1 + 260 + k * 900, label: `SURAT ${Math.max(1, total - k + 1) * 12} KM` });
  signals.push({ s: sStop1 - TRAIN_L - 120, side: 1 });
  for (const l of legs) signals.push({ s: sOfY(l.top + 16), side: 1 });
  const trees: Geo["trees"] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let y = 300; y < H - 100; y += 150 + rnd() * 160) {
    const i = clamp(Math.round(sOfY(y) / STEP), 0, n - 1);
    const px = xs[i];
    const dir = rnd() > 0.5 ? 1 : -1;
    const x = px + dir * (46 + rnd() * 34);
    const gw = W * 0.14;
    if (x > 14 && x < W - 14 && (x < gw || x > W - gw)) trees.push({ x, y: y + rnd() * 40, r: 8 + rnd() * 9 });
  }

  // the tunnels: every block that the line goes into becomes a tunnel with a name, a gate in front of it and a gate after it
  const covers: Geo["covers"] = [];
  const tunnels: Tunnel[] = [];
  const blocks: { el: HTMLElement; r: ReturnType<typeof rel> }[] = [];
  main.querySelectorAll<HTMLElement>(COVER).forEach((el) => blocks.push({ el, r: rel(el, top0, scrollY) }));
  main.querySelectorAll<HTMLElement>(COVER_TEXT).forEach((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const tb = range.getBoundingClientRect();
    blocks.push({ el, r: { top: tb.top + scrollY - top0, bottom: tb.bottom + scrollY - top0, left: tb.left, right: tb.right, width: tb.width, height: tb.height } });
  });
  const poly = (i0: number, i1: number) => {
    let out = `M${xs[i0].toFixed(1)} ${ys[i0].toFixed(1)}`;
    for (let i = i0 + 1; i <= i1; i++) out += `L${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`;
    return out;
  };
  const pt = (i: number): Pt => ({ x: xs[i], y: ys[i], a: as[i] });
  const runs: { i0: number; i1: number; el: HTMLElement }[] = [];
  blocks.forEach(({ el, r }) => {
    if (!r || r.width < 40 || r.height < 30) return;
    let run = -1;
    for (let i = 0; i <= n; i++) {
      const inside = i < n && xs[i] > r.left - 8 && xs[i] < r.right + 8 && ys[i] > r.top - 8 && ys[i] < r.bottom + 8;
      if (inside && run < 0) run = i;
      if (!inside && run >= 0) {
        if (i - run >= 3) {
          runs.push({ i0: run, i1: i - 1, el });
          covers.push({ x: r.left, y: r.top, w: r.width, h: r.height, r: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0 });
        }
        run = -1;
      }
    }
  });
  // (blocks that touch each other make one tunnel, not two)
  runs.sort((p1, p2) => p1.i0 - p2.i0);
  for (let k = runs.length - 1; k > 0; k--) {
    if (runs[k].i0 <= runs[k - 1].i1 + 12) {
      runs[k - 1].i1 = Math.max(runs[k - 1].i1, runs[k].i1);
      runs.splice(k, 1);
    }
  }
  // (a board with the name of the tunnel stands beside each gate, on the side where there is room for it)
  const BW = 250;
  const BH = 54;
  const boardAt = (g: Pt) => {
    const nx = -Math.sin(g.a);
    const ny = Math.cos(g.a);
    const ext = Math.abs(nx) * (BW / 2) + Math.abs(ny) * (BH / 2);
    const place = (side: number) => ({ x: g.x + nx * side * (50 + 12 + ext), y: g.y + ny * side * (50 + 12 + ext) });
    const free = (c: { x: number; y: number }) =>
      c.x - BW / 2 > 8 &&
      c.x + BW / 2 < W - 8 &&
      !blocks.some(({ r }) => r && r.width > 0 && c.x + BW / 2 > r.left && c.x - BW / 2 < r.right && c.y + BH / 2 > r.top && c.y - BH / 2 < r.bottom);
    const first = place(1);
    const second = place(-1);
    // (toward the middle of the page first)
    const prefer = Math.abs(first.x - W / 2) < Math.abs(second.x - W / 2) ? [first, second] : [second, first];
    return prefer.find(free) ?? prefer[0];
  };
  runs.forEach((run, k) => {
    const iF = Math.max(0, run.i0 - Math.round(LEAD / STEP));
    const iC = Math.min(run.i0, iF + Math.round(CUT / STEP));
    const iX = Math.min(n - 1, run.i1 + Math.round(TAIL / STEP));
    const names = run.el.closest(".rt-board") ? TUNNEL_NAMES[0] : run.el.closest(".rh-window") ? TUNNEL_NAMES[1] : TUNNEL_NAMES[2 + (k % 2)];
    const gateIn = pt(iF);
    const gateOut = pt(iX);
    tunnels.push({
      name: names.name,
      sub: names.sub,
      dCut: poly(iF, iC),
      dRoof: poly(iC, iX),
      dUnder: poly(iC, iX),
      gateIn,
      gateOut,
      boardIn: boardAt(gateIn),
      boardOut: boardAt(gateOut),
      sA: iC * STEP,
      sB: iX * STEP,
    });
  });

  return { W, H, d, len, sample, x1, yHead1, x2, yHead2, sStop1, sEnd, stops, crossing, river, signals, poles, miles, trees, covers, tunnels, endY };
}

function at(sm: Sample, s: number) {
  const f = clamp(s / STEP, 0, sm.n - 1);
  const i = Math.floor(f);
  const j = Math.min(sm.n - 1, i + 1);
  const t = f - i;
  return { x: sm.xs[i] + (sm.xs[j] - sm.xs[i]) * t, y: sm.ys[i] + (sm.ys[j] - sm.ys[i]) * t, a: sm.as[i] + (sm.as[j] - sm.as[i]) * t };
}
const sOfYFast = (sm: Sample, y: number) => {
  let lo = 0;
  let hi = sm.n - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (sm.ys[m] < y) lo = m + 1;
    else hi = m;
  }
  return lo * STEP;
};

// ---------------------------------------------------------------------------------------------------------------------------------
// the pieces
// ---------------------------------------------------------------------------------------------------------------------------------

function Coach({ first }: { first: boolean }) {
  const L = COACH_L;
  const w = CAR_W / 2;
  return (
    <>
      <rect className="rl-bogie" x={-L / 2 + 9} y={-w - 1} width="22" height={CAR_W + 2} rx="4" />
      <rect className="rl-bogie" x={L / 2 - 31} y={-w - 1} width="22" height={CAR_W + 2} rx="4" />
      {/* the rubber between this car and the one in front of it */}
      <rect className="rl-bellow" x={L / 2 - 2} y={-w + 9} width={GAP + 4} height={CAR_W - 18} rx="2" />
      <rect className="rl-coach" x={-L / 2} y={-w} width={L} height={CAR_W} rx="10" />
      <path className="rl-stripe" d={`M${-L / 2 + 8} ${-w + 4.5}H${L / 2 - 8}M${-L / 2 + 8} ${w - 4.5}H${L / 2 - 8}`} />
      <rect className="rl-roof" x={-L / 2 + 6} y={-w + 8} width={L - 12} height={CAR_W - 16} rx="7" data-open={first} />
      {first ? (
        // the first coach has its roof off: the seats can be seen
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect className="rl-seat" x={-L / 2 + 14 + i * 20} y={-w + 10} width="12" height="10" rx="3" />
              <rect className="rl-seat" x={-L / 2 + 14 + i * 20} y={w - 20} width="12" height="10" rx="3" />
            </g>
          ))}
          <rect className="rl-aisle" x={-L / 2 + 8} y="-3" width={L - 16} height="6" rx="3" />
        </g>
      ) : (
        <g>
          <rect className="rl-ac" x={-L / 2 + 8} y="-8" width="13" height="16" rx="4" />
          <rect className="rl-ac" x={L / 2 - 21} y="-8" width="13" height="16" rx="4" />
          <path className="rl-rib" d={`M${-L / 2 + 12} -8V8M${-L / 2 + 17} -8V8M${L / 2 - 17} -8V8M${L / 2 - 12} -8V8`} />
          <text className="rl-livery" x="0" y="3" textAnchor="middle">
            WE3VISION
          </text>
        </g>
      )}
      <path className="rl-win" d={`M${-L / 2 + 10} ${-w + 2.5}H${L / 2 - 10}M${-L / 2 + 10} ${w - 2.5}H${L / 2 - 10}`} />
      <rect className="rl-door" x="-4" y={-w - 1} width="8" height="3.5" rx="1.5" />
      <rect className="rl-door" x="-4" y={w - 2.5} width="8" height="3.5" rx="1.5" />
    </>
  );
}

/** the engine: one at each end of the train; the one at the back is turned round, so its nose points backwards */
function Engine({ rear }: { rear: boolean }) {
  const L = ENGINE_L;
  const w = CAR_W / 2;
  const body = `M${-L / 2} ${-w + 8}Q${-L / 2} ${-w} ${-L / 2 + 10} ${-w}H${L / 2 - 36}Q${L / 2 - 12} ${-w + 1} ${L / 2 - 3} -11Q${L / 2 + 2} 0 ${L / 2 - 3} 11Q${L / 2 - 12} ${w - 1} ${L / 2 - 36} ${w}H${-L / 2 + 10}Q${-L / 2} ${w} ${-L / 2} ${w - 8}Z`;
  const roof = `M${-L / 2 + 9} ${-w + 7}H${L / 2 - 42}Q${L / 2 - 24} ${-w + 8} ${L / 2 - 16} -9Q${L / 2 - 12} 0 ${L / 2 - 16} 9Q${L / 2 - 24} ${w - 8} ${L / 2 - 42} ${w - 7}H${-L / 2 + 9}Q${-L / 2 + 5} ${w - 7} ${-L / 2 + 5} ${w - 12}V${-w + 12}Q${-L / 2 + 5} ${-w + 7} ${-L / 2 + 9} ${-w + 7}Z`;
  return (
    <g transform={rear ? "rotate(180)" : undefined}>
      {!rear && <path className="rl-beam" d={`M${L / 2 - 2} -13L${L / 2 + 170} -64V64L${L / 2 - 2} 13Z`} />}
      <rect className="rl-bogie" x={-L / 2 + 9} y={-w - 1} width="26" height={CAR_W + 2} rx="4" />
      <rect className="rl-bogie" x={L / 2 - 45} y={-w - 1} width="26" height={CAR_W + 2} rx="4" />
      {rear && <rect className="rl-bellow" x={-L / 2 - GAP - 2} y={-w + 9} width={GAP + 4} height={CAR_W - 18} rx="2" />}
      <path className="rl-engine" d={body} />
      <path className="rl-engine-roof" d={roof} />
      <path className="rl-stripe" d={`M${-L / 2 + 8} ${-w + 4}H${L / 2 - 40}M${-L / 2 + 8} ${w - 4}H${L / 2 - 40}`} />
      {/* the windscreen with its shine */}
      <path className="rl-glass" d={`M${L / 2 - 44} ${-w + 8}L${L / 2 - 16} -9Q${L / 2 - 11} 0 ${L / 2 - 16} 9L${L / 2 - 44} ${w - 8}Z`} />
      <path className="rl-glass-hi" d={`M${L / 2 - 40} ${-w + 11}L${L / 2 - 22} -8`} />
      {/* the pantograph on the roof, with the little spark at its head */}
      <path className="rl-pan" d={`M${-L / 2 + 10} -11L${-L / 2 + 22} 0L${-L / 2 + 10} 11M${-L / 2 + 22} -11L${-L / 2 + 10} 0L${-L / 2 + 22} 11M${-L / 2 + 24} -13V13`} />
      <circle className="rl-spark" cx={-L / 2 + 24} cy="0" r="3" />
      {/* the lamps: white at the front, red at the back */}
      <circle className={rear ? "rl-tail" : "rl-lamp"} cx={L / 2 - 3} cy="-8.5" r="3.4" />
      <circle className={rear ? "rl-tail" : "rl-lamp"} cx={L / 2 - 3} cy="8.5" r="3.4" />
    </g>
  );
}

/** the name of the train on the roof of an engine: it stays upright, whatever the direction of the track is */
function Plate() {
  return (
    <>
      <rect className="rl-plate" x="-22" y="-12" width="44" height="24" rx="7" />
      <text className="rl-plate-t" x="0" y="5" textAnchor="middle">
        W3V
      </text>
    </>
  );
}

/** the gate of a tunnel: a stone beam across the line with a lamp at each end */
function Gate({ p }: { p: Pt }) {
  const Wd = 104;
  return (
    <g transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${((p.a * 180) / Math.PI).toFixed(1)})`}>
      <rect className="rl-gt-sh" x="-5" y={-Wd / 2 + 6} width="22" height={Wd} rx="9" />
      <rect className="rl-gt" x="-9" y={-Wd / 2} width="18" height={Wd} rx="9" />
      <rect className="rl-gt-top" x="-5" y={-Wd / 2 + 5} width="10" height={Wd - 10} rx="5" />
      <circle className="rl-glow" cx="0" cy={-Wd / 2 + 4} r="22" />
      <circle className="rl-glow" cx="0" cy={Wd / 2 - 4} r="22" />
      <circle className="rl-lampost" cx="0" cy={-Wd / 2 + 4} r="4" />
      <circle className="rl-lampost" cx="0" cy={Wd / 2 - 4} r="4" />
    </g>
  );
}

/** the buffer stop at the end of the line: a stout bar with hazard stripes, two posts, two lamps and a sign */
function BufferStop({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <rect className="rl-bs-sh" x="-46" y="-2" width="96" height="30" rx="8" />
      <rect className="rl-bs-post" x="-48" y="-14" width="14" height="38" rx="5" />
      <rect className="rl-bs-post" x="34" y="-14" width="14" height="38" rx="5" />
      <rect className="rl-bs-bar" x="-44" y="-4" width="88" height="16" rx="5" />
      <rect className="rl-bs-bar-ln" x="-44" y="-4" width="88" height="16" rx="5" />
      <circle className="rl-glow" cx="-41" cy="-14" r="20" />
      <circle className="rl-glow" cx="41" cy="-14" r="20" />
      <circle className="rl-lampost" cx="-41" cy="-14" r="4.5" />
      <circle className="rl-lampost" cx="41" cy="-14" r="4.5" />
      <rect className="rl-bs-plate" x="-30" y="18" width="60" height="22" rx="6" />
      <text className="rl-bs-t" x="0" y="34" textAnchor="middle">
        STOP
      </text>
    </g>
  );
}

/** the board that says the name of the tunnel */
function Board({ x, y, name, sub }: { x: number; y: number; name: string; sub: string }) {
  const w = 250;
  const h = 54;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <rect className="rl-bd-sh" x={-w / 2 + 3} y={-h / 2 + 6} width={w} height={h} rx="13" />
      <rect className="rl-bd" x={-w / 2} y={-h / 2} width={w} height={h} rx="13" />
      <path className="rl-bd-ic" d={`M${-w / 2 + 14} 11V-3Q${-w / 2 + 14} -12 ${-w / 2 + 23} -12Q${-w / 2 + 32} -12 ${-w / 2 + 32} -3V11`} />
      <path className="rl-bd-ic2" d={`M${-w / 2 + 14} 11H${-w / 2 + 32}`} />
      <text className="rl-bd-t" x={-w / 2 + 44} y="-3">
        {name}
      </text>
      <text className="rl-bd-s" x={-w / 2 + 44} y="15">
        {sub}
      </text>
    </g>
  );
}

function Platform({ x, yHead, kind }: { x: number; yHead: number; kind: "start" | "end" }) {
  // the platform is on the left of the track (the side where the passenger waits)
  const edge = x - 36; // the edge next to the track
  const w = 210;
  const left = edge - w;
  const top = yHead - 660;
  const h = 800;
  const roofTop = yHead - 590;
  const roofH = 500;
  const waiting = kind === "start" ? [[left + 52, yHead - 250], [left + 66, yHead - 236], [left + 104, yHead - 380], [left + 134, yHead - 150], [left + 148, yHead - 168]] : [];
  return (
    <g>
      {/* the floor: tiles, a shadow on the ground round it, tactile paving and the yellow line at the edge */}
      <rect className="rl-plat-shadow" x={left - 6} y={top - 4} width={w + 12} height={h + 12} rx="16" />
      <rect className="rl-plat" x={left} y={top} width={w} height={h} rx="12" />
      <rect x={left} y={top} width={w} height={h} rx="12" fill="url(#rl-tile)" />
      <rect x={edge - 34} y={top} width="26" height={h} fill="url(#rl-dots)" />
      <rect className="rl-plat-edge" x={edge - 7} y={top} width="6" height={h} />
      <rect className="rl-plat-lip" x={edge - 1} y={top} width="3" height={h} />

      {/* the roof: glass between steel beams, a shadow under it, posts, the lamps hang from it */}
      <g className="rl-canopy">
        <rect className="rl-roof-sh" x={left + 18} y={roofTop + 14} width={w - 62} height={roofH} rx="10" />
        <rect className="rl-roof-glass" x={left + 14} y={roofTop} width={w - 62} height={roofH} rx="10" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={left + 14} x2={left + 14 + w - 62} y1={roofTop + (i * roofH) / 9} y2={roofTop + (i * roofH) / 9} />
        ))}
        <line x1={left + 14 + (w - 62) / 2} x2={left + 14 + (w - 62) / 2} y1={roofTop} y2={roofTop + roofH} />
      </g>
      {[0, 3, 6, 9].flatMap((i) => [left + 14, left + 14 + w - 62].map((px) => <circle key={`${px}-${i}`} className="rl-post" cx={px} cy={roofTop + (i * roofH) / 9} r="5.5" />))}
      {[0, 1, 2, 3].map((i) => {
        const y = roofTop + 60 + i * 130;
        return (
          <g key={i}>
            <circle className="rl-glow" cx={left + 14 + (w - 62) / 2} cy={y} r="46" />
            <circle className="rl-lampost" cx={left + 14 + (w - 62) / 2} cy={y} r="4.5" />
          </g>
        );
      })}

      {/* furniture: benches, a ticket machine, a kiosk with an awning, bins, planters, the timetable, a clock, the route map */}
      {[yHead - 420, yHead - 320, yHead - 220].map((y) => (
        <g key={y}>
          <rect className="rl-bench" x={left + 38} y={y} width="66" height="17" rx="5" />
          {[0, 1, 2, 3].map((k) => (
            <line key={k} className="rl-bench-slat" x1={left + 38 + 8 + k * 16} x2={left + 38 + 8 + k * 16} y1={y + 2} y2={y + 15} />
          ))}
          <rect className="rl-bench-back" x={left + 38} y={y - 5} width="66" height="5" rx="2" />
        </g>
      ))}
      <g>
        <rect className="rl-kiosk" x={left + 20} y={yHead - 150} width="54" height="44" rx="8" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} className={i % 2 ? "rl-awn-a" : "rl-awn-b"} x={left + 20 + i * 9} y={yHead - 150} width="9" height="14" />
        ))}
        <rect className="rl-machine" x={left + 86} y={yHead - 150} width="26" height="44" rx="6" />
        <rect className="rl-machine-screen" x={left + 91} y={yHead - 143} width="16" height="12" rx="2" />
      </g>
      <circle className="rl-bin" cx={left + 128} cy={yHead - 120} r="7" />
      <circle className="rl-bin" cx={left + 128} cy={yHead - 380} r="7" />
      {[yHead - 500, yHead - 60].map((y) => (
        <g key={y}>
          <circle className="rl-pot" cx={left + 150} cy={y} r="13" />
          <circle className="rl-pot-leaf" cx={left + 150} cy={y} r="9" />
        </g>
      ))}
      <g>
        <circle className="rl-clock" cx={left + 54} cy={yHead - 520} r="21" />
        {Array.from({ length: 12 }, (_, i) => {
          const ang = (i / 12) * Math.PI * 2;
          return <line key={i} className="rl-clock-tick" x1={left + 54 + Math.cos(ang) * 16} y1={yHead - 520 + Math.sin(ang) * 16} x2={left + 54 + Math.cos(ang) * 19} y2={yHead - 520 + Math.sin(ang) * 19} />;
        })}
        <path className="rl-clock-hand" d={`M${left + 54} ${yHead - 520}V${yHead - 534}M${left + 54} ${yHead - 520}L${left + 64} ${yHead - 514}`} />
      </g>
      <g>
        <rect className="rl-board" x={left + 84} y={yHead - 546} width="52" height="52" rx="6" />
        <path className="rl-board-lines" d={`M${left + 92} ${yHead - 530}H${left + 128}M${left + 92} ${yHead - 518}H${left + 120}M${left + 92} ${yHead - 506}H${left + 126}`} />
      </g>
      <path className="rl-map" d={`M${left + 28} ${yHead - 38}Q${left + 58} ${yHead - 62} ${left + 96} ${yHead - 38}T${left + 164} ${yHead - 44}`} />

      {/* people waiting (seen from above: shoulders and a head) */}
      {waiting.map(([px, py], i) => (
        <g key={i}>
          <ellipse className="rl-person-sh" cx={px} cy={py} rx="9" ry="6" />
          <circle className={i % 2 ? "rl-person-a" : "rl-person-b"} cx={px} cy={py} r="4.8" />
        </g>
      ))}

      {/* the name of the platform */}
      <g>
        <rect className="rl-sign" x={left + 16} y={yHead + 38} width={w - 60} height="44" rx="9" />
        <circle className="rl-sign-n" cx={left + 40} cy={yHead + 60} r="14" />
        <text className="rl-sign-num" x={left + 40} y={yHead + 65} textAnchor="middle">
          {kind === "start" ? "1" : "S"}
        </text>
        <text className="rl-sign-t" x={left + 62} y={yHead + 65}>
          {kind === "start" ? "CAREERS" : "SURAT JN"}
        </text>
      </g>

      {/* a footbridge over the track, above the place where the train comes in (only at the first station) */}
      <g className="rl-bridge" display={kind === "start" ? undefined : "none"}>
        <rect className="rl-bridge-sh" x={left + 28} y={yHead - 650 + 10} width={w + 130} height="26" rx="4" />
        <rect className="rl-bridge-deck" x={left + 24} y={yHead - 650} width={w + 130} height="26" rx="4" />
        <line x1={left + 24} x2={left + 24 + w + 130} y1={yHead - 650 + 5} y2={yHead - 650 + 5} />
        <line x1={left + 24} x2={left + 24 + w + 130} y1={yHead - 650 + 21} y2={yHead - 650 + 21} />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={left + 24 + i * ((w + 130) / 13)} x2={left + 24 + i * ((w + 130) / 13)} y1={yHead - 650 + 5} y2={yHead - 650 + 21} />
        ))}
      </g>
    </g>
  );
}

function Signal({ x, y, a, side, green }: { x: number; y: number; a: number; side: 1 | -1; green: boolean }) {
  // a signal beside the track: a post with two lamps (it turns green when the train is called)
  const dx = Math.sin(a) * -1 * side * 40;
  const dy = Math.cos(a) * side * 40;
  return (
    <g transform={`translate(${x + dx} ${y + dy})`}>
      <rect className="rl-sig-post" x="-3" y="-3" width="6" height="26" rx="3" />
      <rect className="rl-sig-head" x="-7" y="-14" width="14" height="22" rx="5" />
      <circle className="rl-sig-lamp" data-on={!green} data-c="r" cx="0" cy="-8" r="3.4" />
      <circle className="rl-sig-lamp" data-on={green} data-c="g" cx="0" cy="1" r="3.4" />
    </g>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------

export function CareerRailway() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const career = useCareer();
  const trainRef = useRef<SVGGElement>(null);
  const carRefs = useRef<(SVGGElement | null)[]>([]);
  const plateRefs = useRef<(SVGGElement | null)[]>([]);
  const avRef = useRef<HTMLDivElement>(null);
  const youRef = useRef<HTMLSpanElement>(null);
  const geoRef = useRef<Geo | null>(null);

  // measure the page (and again when it changes size)
  useEffect(() => {
    const root = rootRef.current;
    const main = root?.parentElement;
    if (!root || !main) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      root.style.height = `${main.scrollHeight}px`;
      const g = measure(root);
      geoRef.current = g;
      setGeo(g);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    queue();
    const ro = new ResizeObserver(queue);
    ro.observe(main);
    window.addEventListener("resize", queue);
    document.fonts?.ready.then(queue);
    const late = window.setTimeout(queue, 1200); // (images and sections that come in late)
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", queue);
      window.clearTimeout(late);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // the animation: the train, the coaches on the curve, the passenger
  useEffect(() => {
    if (!geo) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let sCur = -TRAIN_L - 400; // out of the page, above
    let prevS = sCur;
    let speed = 0; // px/s, smoothed
    let motion = "stopped";
    let seat = 0; // 0 = on the platform .. 1 = sits in the coach
    let exit = 0; // 0 = sits .. 1 = at the door of the office
    const sm = geo.sample;
    const top0 = rootRef.current ? rootRef.current.getBoundingClientRect().top + window.scrollY : 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const c = getCareer();
      // where the nose of the train wants to be
      let target = -TRAIN_L - 400;
      if (c.summoned) {
        target = geo.sStop1;
        // (when the visitor goes on without a booked seat the train leaves without the passenger)
        if (c.stage !== "idle" || c.away) {
          const centreY = window.scrollY + window.innerHeight * 0.55 - top0;
          target = clamp(sOfYFast(sm, centreY) + 90, geo.sStop1, geo.sEnd);
        }
      }
      const k = reduce ? 1 : 1 - Math.exp(-dt * (c.stage === "departing" || c.stage === "arriving" ? 3.2 : 4.4));
      sCur += (target - sCur) * k;

      // how fast the train goes: the sway, the lamps and the doors follow it
      if (dt > 0) speed += (Math.abs(sCur - prevS) / dt - speed) * 0.12;
      prevS = sCur;
      const m = speed > 14 ? "moving" : "stopped";
      if (m !== motion) {
        motion = m;
        trainRef.current?.setAttribute("data-motion", m);
      }
      const sway = Math.min(1, speed / 240) * 0.8;

      // the cars: the engine first, the coaches behind it, the engine at the back, every one turned with the line
      const cars: { x: number; y: number; a: number }[] = [];
      for (let i = 0; i < CARS; i++) {
        const centre =
          i === 0
            ? sCur - ENGINE_L / 2
            : i <= COACHES
              ? sCur - ENGINE_L - GAP - (i - 1) * (COACH_L + GAP) - COACH_L / 2
              : sCur - ENGINE_L - GAP - COACHES * (COACH_L + GAP) - ENGINE_L / 2;
        const p = at(sm, centre);
        cars.push(p);
        const wob = Math.sin(now / 85 + i * 1.9) * sway;
        const cx = p.x - Math.sin(p.a) * wob;
        const cy = p.y + Math.cos(p.a) * wob;
        const g = carRefs.current[i];
        if (g) g.setAttribute("transform", `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${((p.a * 180) / Math.PI).toFixed(2)})`);
        // the name on the engines stays upright
        const pl = plateRefs.current[i === 0 ? 0 : i === CARS - 1 ? 1 : -1];
        if (i === 0 || i === CARS - 1) pl?.setAttribute("transform", `translate(${cx.toFixed(1)} ${cy.toFixed(1)})`);
      }

      // the passenger
      const av = avRef.current;
      if (av) {
        const car1 = cars[1];
        const cosA = Math.cos(car1.a);
        const sinA = Math.sin(car1.a);
        const local = (lx: number, ly: number) => ({ x: car1.x + lx * cosA - ly * sinA, y: car1.y + lx * sinA + ly * cosA });
        const platX = geo.x1 - 36 - 90;
        const start = { x: platX - 20, y: geo.yHead1 + 10 };
        const stopCar1 = at(sm, geo.sStop1 - ENGINE_L - GAP - COACH_L / 2);
        const door = { x: stopCar1.x - CAR_W / 2 - 22, y: stopCar1.y };
        const t = clamp(c.step / Math.max(1, c.steps), 0, 1);
        const walk = { x: start.x + (door.x - start.x) * t, y: start.y + (door.y - start.y) * t };
        const seatPos = local(-6, -9);
        const wantSeat = c.stage === "booked" || c.stage === "departing" || c.stage === "arriving" ? 1 : 0;
        seat += (wantSeat - seat) * (reduce ? 1 : 1 - Math.exp(-dt * 3));
        const wantExit = c.stage === "arrived" ? 1 : 0;
        exit += (wantExit - exit) * (reduce ? 1 : 1 - Math.exp(-dt * 0.9));
        // the door of the last station and the office there
        const endCar1 = at(sm, geo.sEnd - ENGINE_L - GAP - COACH_L / 2);
        const platDoor = { x: endCar1.x - CAR_W / 2 - 24, y: endCar1.y };
        const office = { x: geo.x2 - 246 + 106, y: geo.yHead2 - 660 - 14 };
        let px = walk.x + (seatPos.x - walk.x) * seat;
        let py = walk.y + (seatPos.y - walk.y) * seat;
        let moving = Math.abs(t - 0) > 0 && seat < 0.98 && !(c.away && c.stage === "idle");
        let rot = (Math.atan2(door.y - start.y, door.x - start.x) * 180) / Math.PI - 90;
        if (seat > 0.98) rot = (car1.a * 180) / Math.PI - 90 + 180;
        if (exit > 0.001) {
          const e = exit;
          const first = clamp(e / 0.4, 0, 1);
          const second = clamp((e - 0.4) / 0.6, 0, 1);
          const mid = { x: seatPos.x + (platDoor.x - seatPos.x) * first, y: seatPos.y + (platDoor.y - seatPos.y) * first };
          px = mid.x + (office.x - mid.x) * second;
          py = mid.y + (office.y - mid.y) * second;
          moving = e < 0.98;
          rot = (Math.atan2(office.y - platDoor.y, office.x - platDoor.x) * 180) / Math.PI - 90;
        }
        // (inside a tunnel nothing is seen: the passenger is with the train)
        const sCar = sCur - ENGINE_L - GAP - COACH_L / 2;
        const hidden = (seat > 0.6 && geo.tunnels.some((tn) => sCar > tn.sA && sCar < tn.sB)) || geo.covers.some((c2) => px > c2.x + 2 && px < c2.x + c2.w - 2 && py > c2.y + 2 && py < c2.y + c2.h - 2);
        const visible = (c.passenger || c.stage !== "idle") && !hidden;
        av.style.opacity = visible ? "1" : "0";
        av.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
        av.dataset.pose = moving ? "walk" : "idle";
        const inner = av.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `rotate(${rot.toFixed(1)}deg)`;
        // inside the coach the passenger is under the roof only while it is on the train
        av.dataset.inside = String(seat > 0.6 && exit < 0.05);
        if (youRef.current) youRef.current.style.opacity = seat > 0.9 && exit < 0.05 ? "0" : "1";
      }

      // the stages that follow the train
      if ((c.stage === "departing" || c.stage === "booked") && sCur > geo.sEnd - 900 && c.stage === "departing") setCareer({ stage: "arriving" });
      if ((c.stage === "arriving" || c.stage === "departing") && sCur > geo.sEnd - 6) setCareer({ stage: "arrived" });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [geo]);

  const summoned = career.summoned;

  return (
    <div ref={rootRef} className="rl" aria-hidden>
      {geo && (
        <>
          <svg width={geo.W} height={geo.H} viewBox={`0 0 ${geo.W} ${geo.H}`} className="rl-svg">
            <defs>
              <pattern id="rl-tile" width="26" height="26" patternUnits="userSpaceOnUse">
                <path d="M26 0H0V26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
              <pattern id="rl-dots" width="9" height="9" patternUnits="userSpaceOnUse">
                <circle cx="4.5" cy="4.5" r="1.6" fill="rgba(255,255,255,0.22)" />
              </pattern>
              <radialGradient id="rl-glow-g">
                <stop offset="0" className="rl-lite" stopOpacity="0.5" />
                <stop offset="1" className="rl-lite" stopOpacity="0" />
              </radialGradient>
              <mask id="rl-cover" maskUnits="userSpaceOnUse" x="0" y="0" width={geo.W} height={geo.H}>
                <rect x="0" y="0" width={geo.W} height={geo.H} fill="#fff" />
                {geo.covers.map((c, i) => (
                  <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} rx={c.r} fill="#000" />
                ))}
              </mask>
              {/* the line and the train are not seen under the roof of a tunnel */}
              <mask id="rl-under" maskUnits="userSpaceOnUse" x="0" y="0" width={geo.W} height={geo.H}>
                <rect x="0" y="0" width={geo.W} height={geo.H} fill="#fff" />
                {geo.tunnels.map((t, i) => (
                  <path key={i} d={t.dUnder} fill="none" stroke="#000" strokeWidth="76" strokeLinecap="butt" strokeLinejoin="round" />
                ))}
              </mask>
              <linearGradient id="rl-fade-g" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={geo.endY - 300} y2={geo.endY - 30}>
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#000" />
              </linearGradient>
              <mask id="rl-fade" maskUnits="userSpaceOnUse" x="0" y="0" width={geo.W} height={geo.H}>
                <rect x="0" y="0" width={geo.W} height={geo.H} fill="url(#rl-fade-g)" />
              </mask>
              <pattern id="rl-hazard" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="14" height="14" className="rl-hz-a" />
                <rect width="7" height="14" className="rl-hz-b" />
              </pattern>
              <pattern id="rl-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="9" height="9" className="rl-hatch-bg" />
                <line x1="0" y1="0" x2="0" y2="9" className="rl-hatch-ln" />
              </pattern>
              <linearGradient id="rl-beam-g" x1="0" x2="1">
                <stop offset="0" className="rl-lite" stopOpacity="0.5" />
                <stop offset="1" className="rl-lite" stopOpacity="0" />
              </linearGradient>
            </defs>

            <g mask={geo.covers.length ? "url(#rl-cover)" : undefined}>
            <g mask={geo.tunnels.length ? "url(#rl-under)" : undefined}>
            {/* the stream and the bridge */}
            {geo.river && (
              <g>
                <rect className="rl-river" x="0" y={geo.river.y} width={geo.W} height={geo.river.h} />
                <path className="rl-ripple" d={`M0 ${geo.river.y + 22}Q${geo.W * 0.1} ${geo.river.y + 10} ${geo.W * 0.2} ${geo.river.y + 22}T${geo.W * 0.4} ${geo.river.y + 22}T${geo.W * 0.6} ${geo.river.y + 22}T${geo.W * 0.8} ${geo.river.y + 22}T${geo.W} ${geo.river.y + 22}M0 ${geo.river.y + 54}Q${geo.W * 0.1} ${geo.river.y + 42} ${geo.W * 0.2} ${geo.river.y + 54}T${geo.W * 0.4} ${geo.river.y + 54}T${geo.W * 0.6} ${geo.river.y + 54}T${geo.W * 0.8} ${geo.river.y + 54}T${geo.W} ${geo.river.y + 54}`} />
              </g>
            )}

            {/* the level crossing: a road that crosses the line, with the barriers */}
            {geo.crossing && (
              <g>
                <rect className="rl-road" x={geo.crossing.x < geo.W / 2 ? 0 : geo.crossing.x - 130} y={geo.crossing.y - 24} width={geo.crossing.x < geo.W / 2 ? geo.crossing.x + 130 : geo.W - geo.crossing.x + 130} height="48" />
                <path className="rl-road-line" d={geo.crossing.x < geo.W / 2 ? `M0 ${geo.crossing.y}H${geo.crossing.x - 40}M${geo.crossing.x + 40} ${geo.crossing.y}H${geo.crossing.x + 130}` : `M${geo.crossing.x - 130} ${geo.crossing.y}H${geo.crossing.x - 40}M${geo.crossing.x + 40} ${geo.crossing.y}H${geo.W}`} />
                <rect className="rl-barrier" x={geo.crossing.x - 76} y={geo.crossing.y - 34} width="46" height="6" rx="3" />
                <rect className="rl-barrier" x={geo.crossing.x + 30} y={geo.crossing.y + 28} width="46" height="6" rx="3" />
                <circle className="rl-sig-lamp" data-on="true" data-c="r" cx={geo.crossing.x - 80} cy={geo.crossing.y - 31} r="3.5" />
                <circle className="rl-sig-lamp" data-on="true" data-c="r" cx={geo.crossing.x + 80} cy={geo.crossing.y + 31} r="3.5" />
              </g>
            )}

            {/* trees */}
            {geo.trees.map((t, i) => (
              <g key={i}>
                <circle className="rl-tree-sh" cx={t.x + 3} cy={t.y + 4} r={t.r} />
                <circle className="rl-tree" cx={t.x} cy={t.y} r={t.r} />
                <circle className="rl-tree-hi" cx={t.x - t.r * 0.3} cy={t.y - t.r * 0.3} r={t.r * 0.45} />
              </g>
            ))}

            {/* the open cut at the start of a tunnel: walls that are cut across (hatched, as on a drawing of a section), the floor between them */}
            {geo.tunnels.map((t, i) => (
              <g key={`cut-${i}`}>
                <path d={t.dCut} className="rl-cut-wall" />
                <path d={t.dCut} className="rl-cut-hatch" />
                <path d={t.dCut} className="rl-cut-floor" />
              </g>
            ))}

            {/* the track: stones, sleepers, the two rails */}
            <g mask="url(#rl-fade)">
              <path d={geo.d} className="rl-ballast" />
              <path d={geo.d} className="rl-sleepers" />
              <path d={geo.d} className="rl-railbed" />
              <path d={geo.d} className="rl-railgap" />
            </g>
            <BufferStop x={geo.x2} y={geo.endY - 140} />

            {/* the stations */}
            <Platform x={geo.x1} yHead={geo.yHead1} kind="start" />
            <Platform x={geo.x2} yHead={geo.yHead2} kind="end" />
            <g className="rl-office">
              <rect className="rl-office-sh" x={geo.x2 - 246 + 10} y={geo.yHead2 - 660 - 190} width="204" height="182" rx="16" />
              <rect className="rl-office-body" x={geo.x2 - 246 + 4} y={geo.yHead2 - 660 - 198} width="204" height="182" rx="16" />
              <path className="rl-office-roof" d={`M${geo.x2 - 246 + 16} ${geo.yHead2 - 660 - 170}H${geo.x2 - 246 + 196}M${geo.x2 - 246 + 16} ${geo.yHead2 - 660 - 140}H${geo.x2 - 246 + 196}M${geo.x2 - 246 + 16} ${geo.yHead2 - 660 - 50}H${geo.x2 - 246 + 196}M${geo.x2 - 246 + 16} ${geo.yHead2 - 660 - 20}H${geo.x2 - 246 + 196}`} />
              <text className="rl-office-t" x={geo.x2 - 246 + 106} y={geo.yHead2 - 660 - 96} textAnchor="middle">
                WE3VISION
              </text>
              <text className="rl-office-s" x={geo.x2 - 246 + 106} y={geo.yHead2 - 660 - 72} textAnchor="middle">
                HEAD OFFICE
              </text>
              <rect className="rl-office-door" x={geo.x2 - 246 + 76} y={geo.yHead2 - 660 - 24} width="60" height="10" rx="5" />
            </g>

            {/* a little stop for every value */}
            {geo.stops.map((s, i) => (
              <g key={i} transform={`translate(${s.x} ${s.y})`}>
                <rect className="rl-stub" x={s.side === 1 ? 24 : -24 - 54} y="-48" width="54" height="96" rx="10" />
                <rect className="rl-stub-edge" x={s.side === 1 ? 24 : -24 - 5} y="-48" width="5" height="96" />
                <circle className="rl-glow" cx={s.side === 1 ? 52 : -52} cy="-30" r="22" />
                <circle className="rl-lampost" cx={s.side === 1 ? 52 : -52} cy="-30" r="3.5" />
                <rect className="rl-bench" x={s.side === 1 ? 36 : -36 - 28} y="6" width="28" height="12" rx="4" />
              </g>
            ))}

            {/* poles, mile posts, signals */}
            {geo.poles.map((p, i) => {
              const q = at(geo.sample, p.s);
              const dx = -Math.sin(q.a) * p.side * 34;
              const dy = Math.cos(q.a) * p.side * 34;
              return (
                <g key={i} transform={`translate(${q.x + dx} ${q.y + dy}) rotate(${(q.a * 180) / Math.PI})`}>
                  <rect className="rl-pole" x="-1.5" y="-9" width="3" height="18" />
                  <rect className="rl-pole" x="-6" y="-1.5" width="12" height="3" />
                </g>
              );
            })}
            {geo.miles.map((m, i) => {
              const q = at(geo.sample, m.s);
              const out = q.x < geo.W / 2 ? -1 : 1;
              return (
                <g key={i} transform={`translate(${clamp(q.x + out * 72, 62, geo.W - 62)} ${q.y})`}>
                  <rect className="rl-mile" x="-52" y="-13" width="104" height="26" rx="7" />
                  <text className="rl-mile-t" x="0" y="4.5" textAnchor="middle">
                    {m.label}
                  </text>
                </g>
              );
            })}
            {geo.signals.map((s, i) => {
              const q = at(geo.sample, s.s);
              return <Signal key={i} x={q.x} y={q.y} a={q.a} side={s.side} green={summoned} />;
            })}

            {/* the train: nothing at all until the visitor has chosen */}
            <g ref={trainRef} className="rl-train" data-on={summoned} data-motion="stopped">
              {Array.from({ length: CARS }, (_, i) => (
                <g
                  key={i}
                  ref={(el) => {
                    carRefs.current[i] = el;
                  }}
                >
                  {i === 0 || i === CARS - 1 ? <Engine rear={i !== 0} /> : <Coach first={i === 1} />}
                </g>
              ))}
              {[0, 1].map((i) => (
                <g
                  key={`plate-${i}`}
                  ref={(el) => {
                    plateRefs.current[i] = el;
                  }}
                >
                  <Plate />
                </g>
              ))}
            </g>

            </g>

            {/* the tunnels: the roof (over the train, so that it goes under it), the gates and the boards with the names */}
            {geo.tunnels.map((t, i) => (
              <g key={`tn-${i}`}>
                <path d={t.dRoof} className="rl-tn-sh" />
                <path d={t.dRoof} className="rl-tn-edge" />
                <path d={t.dRoof} className="rl-tn-body" />
                <path d={t.dRoof} className="rl-tn-ribs" />
                <path d={t.dRoof} className="rl-tn-ridge" />
                <Gate p={t.gateIn} />
                <Gate p={t.gateOut} />
                <Board x={t.boardIn.x} y={t.boardIn.y} name={t.name} sub={t.sub} />
                <Board x={t.boardOut.x} y={t.boardOut.y} name={t.name} sub={t.sub} />
              </g>
            ))}
            </g>
          </svg>

          {/* where the page rides to when the ticket is sent: a little above the platform of Surat Junction */}
          <span id="surat-station" aria-hidden className="rl-mark" style={{ top: Math.max(0, geo.yHead2 - 560) }} />

          {/* the passenger: "You" */}
          <div ref={avRef} className="of-walker rl-av" style={{ "--tone": 352, opacity: 0 } as React.CSSProperties}>
            <div className="of-walker-in">
              <PersonTop seated={career.stage !== "idle"} />
            </div>
            <span ref={youRef} className="rl-you">
              You
            </span>
          </div>
        </>
      )}
    </div>
  );
}
