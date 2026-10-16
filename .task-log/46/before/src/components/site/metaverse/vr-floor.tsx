"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GOV_PROJECTS, GOV_TITLE, type GovProject } from "@/lib/cms/content/gov-projects";
import { GlowEdge } from "../glow-edge";
import { METAVERSE_BOARDS } from "../timeline-boards";
import { Corner } from "../timeline-office";
import { PersonTop } from "../timeline-art";
import { GovOutside } from "./vr-gov";

// The office of the metaverse team, seen from above, drawn exactly like the office of 2027 on the About page (same floor, walls, people,
// walking colleagues and the same size of every person): it comes out of the black where the headset scene ends. A line comes in through
// the door and Rutvi (a girl, the same figure as the founders of the timeline) walks in along it. The heading is written on the floor:
// each line appears as she walks over it, so the whole text is there when she has crossed it. Then the four teams of the metaverse (AR, VR,
// XR, MR) appear in the four corners: first their names, then their desks, boards and people. Rutvi sits down at her desk and from time to
// time somebody of a team walks over to her, talks for a moment and goes back to the corner (the other colleagues walk about but never under
// her or her desk). The whole office always fits the screen (see measure()). Pointing at a team (tap on a phone) blurs the rest of the
// office and opens a card that says what the team builds and in which industries that service is possible.
// Then she gets up, walks round her desk and out of the door at the bottom, the view follows her down onto the courtyard outside (vr-gov.tsx)
// where the two government projects of the company stand (NRIDA on the left, MOC on the right): she walks to the one, then to the other,
// and stops between them. Colours follow the visitor's theme (.of-* and .vfo-* in globals.css).

export type FloorCabin = { code: string; name: string; text: string; industries?: string };

type Props = {
  heading: string;
  hint: string;
  name: string;
  tipTitle?: string;
  tipText?: string;
  industriesTitle?: string;
  ctaLabel?: string;
  govTitle?: string;
  projects?: GovProject[];
  cabins: FloorCabin[];
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ZW = 300; // one corner is drawn on a 300 x 226 canvas (scaled with --zs)
const ZH = 226;
const CREW = [2, 0, 5, 4]; // which team of the office drawing each corner uses (seats, colour of the blazers)

// where the story is told along the scroll (0..1 of the pinned section)
const T = {
  black: 0.06, // out of the black into the office
  walk: [0.06, 0.27], // Rutvi walks in and sits down
  chips: 0.18, // the names of the four corners, one after the other
  zones: 0.24, // what is in the corners
  leave: [0.48, 0.6], // she gets up, goes round her desk and out of the door, the view follows her down
  cam: [0.53, 0.6],
  toA: [0.6, 0.64], // to the first project (left)
  infoA: 0.635,
  toB: [0.69, 0.73], // to the second project (right)
  infoB: 0.735,
  toC: [0.79, 0.82], // and to the middle between the two
  back: [0.88, 0.98], // then back through the door into the office, to her desk; the next section follows right after
};

// corners: top in % of the screen; reading order AR, VR (top row), XR, MR (bottom row)
const WIDE: { side: "l" | "r"; top: number; row: number }[] = [
  { side: "l", top: 9, row: 0 },
  { side: "r", top: 9, row: 0 },
  { side: "l", top: 54, row: 1 },
  { side: "r", top: 54, row: 1 },
];
const TALL: { left: string; top: number; side: "l" | "r" }[] = [
  { left: "2%", top: 5.5, side: "l" },
  { left: "52%", top: 5.5, side: "r" },
  { left: "2%", top: 22.5, side: "l" },
  { left: "52%", top: 22.5, side: "r" },
];

// colleagues who walk about at random: the aisles on the left and on the right of the middle column (never the middle: that is where
// Rutvi walks and where her desk stands), in % of the screen
const WALKER_TONES = [40, 300, 100, 200, 340];
const PLACES_WIDE: [number, number][] = [
  [34, 10], [38, 36], [36, 66], [34, 92], [16, 47],
  [66, 10], [62, 36], [64, 66], [66, 92], [84, 47],
];
const PLACES_TALL: [number, number][] = [
  [14, 40], [86, 40], [14, 66], [86, 66], [30, 88], [70, 88],
];
const VISITOR_TONES = [20, 250, 60, 160];

// industries shown when the admin has not written any for a team
const INDUSTRIES: Record<string, string> = {
  AR: "Retail & e-commerce\nReal estate\nFurniture & interiors\nEducation\nHealthcare\nTourism & hospitality",
  VR: "Real estate\nEducation & training\nGaming & entertainment\nManufacturing\nHealthcare\nEvents & exhibitions",
  XR: "Retail & fashion\nAutomotive\nEducation\nHealthcare\nCorporate & HR\nMedia & events",
  MR: "Architecture & construction\nManufacturing\nHealthcare\nEngineering & design\nAutomotive\nCorporate teams",
};

type Walker = { init: boolean; x: number; y: number; tx: number; ty: number; wait: number; cur: number; tgt: number; speed: number; ph: number; o: number };
type Pt = { x: number; y: number };

export function VrFloor({ heading, hint, name, tipTitle, tipText, industriesTitle, ctaLabel, govTitle, projects, cabins }: Props) {
  const trackRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const rutviRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(-1); // the team that is pointed at
  const [shown, setShown] = useState(0); // the team that the card shows (stays while the card fades out)
  const closeT = useRef(0);
  const pType = useRef("mouse");

  const openAt = useCallback((i: number) => {
    window.clearTimeout(closeT.current);
    setShown(i);
    setOpen(i);
  }, []);
  const closeSoon = useCallback((ms = 220) => {
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => setOpen(-1), ms);
  }, []);
  const keep = useCallback(() => window.clearTimeout(closeT.current), []);

  useEffect(() => () => window.clearTimeout(closeT.current), []);

  // the card closes with Escape and when the page is scrolled; the blur is centred on the card
  useEffect(() => {
    if (open < 0) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(-1);
    const y0 = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - y0) > 60 && setOpen(-1);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(() => {
      const root = rootRef.current;
      const pop = popRef.current;
      if (!root || !pop) return;
      const rr = root.getBoundingClientRect();
      const pr = pop.getBoundingClientRect();
      root.style.setProperty("--bx", `${(pr.left - rr.left + pr.width / 2).toFixed(0)}px`);
      root.style.setProperty("--by", `${(pr.top - rr.top + pr.height / 2).toFixed(0)}px`);
      root.style.setProperty("--br", `${(Math.max(rr.width, rr.height) * 0.8).toFixed(0)}px`);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  useEffect(() => {
    const track = trackRef.current;
    const world = worldRef.current;
    const root = rootRef.current; // the office
    const rutvi = rutviRef.current;
    if (!track || !world || !root || !rutvi) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 1;
    let H = 1;
    let U = 1;
    let ZS = 1;
    let OH = 1; // height of the courtyard outside
    let tall = false;
    let visible = true;
    let raf = 0;
    let frameRaf = 0;
    let last = 0;
    let lastX = 0;
    let lastY = 0;
    let idleT = 0;
    let objs = 0; // how much of the office has appeared (0..1)
    let seated = false;
    let settled = "idle";
    const lineEls = Array.from(root.querySelectorAll<HTMLElement>(".vfo-title span"));
    let lineTop: number[] = [];
    let lineH: number[] = [];
    const zoneEls = Array.from(root.querySelectorAll<HTMLElement>(".of-zone"));
    const hitEls = Array.from(root.querySelectorAll<HTMLElement>(".vfo-hit"));
    const tipEl = root.querySelector<HTMLElement>(".vfo-tip");
    const outEl = world.querySelector<HTMLElement>(".vfo-out");
    const padEls = Array.from(world.querySelectorAll<HTMLElement>(".vfo-pad"));
    const embEls = Array.from(world.querySelectorAll<HTMLElement>(".vfo-emblem"));
    const moreEls = Array.from(world.querySelectorAll<HTMLElement>(".vfo-more"));
    // where the courtyard things stand (in the coordinates of the world: the top left corner of the office is 0,0)
    let pads: { l: number; t: number; r: number; b: number }[] = [];
    let embY: number[] = [];
    const randoms = Array.from(root.querySelectorAll<HTMLElement>("[data-walker]:not([data-visitor])"));
    const visitors = Array.from(root.querySelectorAll<HTMLElement>("[data-visitor]"));
    const mk = (): Walker => ({ init: false, x: 0, y: 0, tx: 0, ty: 0, wait: 0, cur: 0, tgt: 0, speed: 60, ph: 0, o: 0 });
    const rState = randoms.map(mk);
    const vState = visitors.map(mk);

    // where Rutvi sits (the middle column of the office, from the door down to under her desk) is not for the colleagues who walk about
    const cxy = () => ({ cx: W / 2, cy: H * (tall ? 0.62 : 0.58) });
    const hitsMiddle = (x0: number, y0: number, x1: number, y1: number) => {
      const { cx, cy } = cxy();
      const half = 110 * U;
      const bx0 = cx - half;
      const bx1 = cx + half;
      const by1 = cy + 135 * U;
      // does the segment (x0,y0)-(x1,y1) touch the box x: bx0..bx1, y: -inf..by1 ?
      let t0 = 0;
      let t1 = 1;
      const dx = x1 - x0;
      const dy = y1 - y0;
      const clip = (p: number, q: number) => {
        if (p === 0) return q >= 0;
        const r = q / p;
        if (p < 0) {
          if (r > t1) return false;
          if (r > t0) t0 = r;
        } else {
          if (r < t0) return false;
          if (r < t1) t1 = r;
        }
        return true;
      };
      return clip(-dx, x0 - bx0) && clip(dx, bx1 - x0) && clip(dy, by1 - y0) && clip(-dy, y0 + 1000);
    };

    // the unit of the drawing follows the size of the screen, whatever it is (a phone, a laptop, a huge monitor, a zoomed page)
    const measure = () => {
      const r = root.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const kx = r.width / W;
      const ky = r.height / H;
      // (the first real size, after a start in a hidden tab: nobody has a place yet)
      if (W <= 1) [...rState, ...vState].forEach((s) => (s.init = false));
      else if (Math.abs(kx - 1) > 0.001 || Math.abs(ky - 1) > 0.001) {
        [...rState, ...vState].forEach((s) => {
          s.x *= kx;
          s.tx *= kx;
          s.y *= ky;
          s.ty *= ky;
        });
      }
      W = r.width;
      H = r.height;
      tall = W / H < 0.9;
      U = Math.min(6, Math.max(tall ? 0.58 : 0.62, Math.min(W / 1440, H / 900) * (tall ? 1.8 : 1)));
      world.style.setProperty("--u", U.toFixed(3));
      // the four corners are big: two in a column on a wide screen, two by two on a phone
      ZS = tall ? Math.min((0.46 * W) / ZW, (0.14 * H) / ZH) : Math.min((0.26 * W) / ZW, (0.37 * H) / ZH);
      world.style.setProperty("--zs", ZS.toFixed(3));
      const layout = tall ? "tall" : "wide";
      world.dataset.layout = layout;
      root.dataset.layout = layout;
      // the lines of the heading: where each one stands (Rutvi uncovers it when she walks over it)
      const h2 = root.querySelector<HTMLElement>(".vfo-title");
      if (h2) {
        const base = h2.getBoundingClientRect().top - r.top;
        lineTop = lineEls.map((el) => base + el.offsetTop);
        lineH = lineEls.map((el) => el.offsetHeight);
      }
      // the courtyard: where the two projects stand and where their badges are
      const wr = world.getBoundingClientRect();
      pads = padEls.map((el) => {
        const b = el.getBoundingClientRect();
        return { l: b.left - wr.left, t: b.top - wr.top, r: b.right - wr.left, b: b.bottom - wr.top };
      });
      embY = embEls.map((el) => {
        const b = el.getBoundingClientRect();
        return (b.top + b.bottom) / 2 - wr.top;
      });
      OH = outEl ? outEl.offsetHeight : H;
    };

    // a point along a line of points (t: 0..1 of its length), and the way it is going (degrees; 0 = down)
    const along = (pts: Pt[], t: number) => {
      const lens: number[] = [];
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        lens.push(l);
        total += l;
      }
      let d = clamp(t) * total;
      for (let i = 0; i < lens.length; i++) {
        if (d <= lens[i] || i === lens.length - 1) {
          const k = lens[i] ? clamp(d / lens[i]) : 0;
          const a = pts[i];
          const b = pts[i + 1];
          return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), ang: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90 };
        }
        d -= lens[i];
      }
      return { x: pts[0].x, y: pts[0].y, ang: 0 };
    };
    const dir = (a: Pt, b: Pt) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90;

    // the story, along the scroll
    const update = () => {
      frameRaf = 0;
      const r = track.getBoundingClientRect();
      const dist = Math.max(1, r.height - window.innerHeight);
      const p = clamp(-r.top / dist);
      const { cx, cy } = cxy();
      if (blackRef.current) blackRef.current.style.opacity = String(1 - ease(p / T.black));
      if (hintRef.current) hintRef.current.style.opacity = String(1 - ease((p - 0.06) / 0.06));

      // where she is: in from the door, at her desk, round the desk and out of the door, to the first project, to the second, in between
      const s = clamp((p - T.walk[0]) / (T.walk[1] - T.walk[0]));
      const sat = (s >= 1 && p < T.leave[0]) || p >= T.back[1];
      seated = sat;
      const yIn = lerp(-0.06 * H, cy, ease(s));
      const door: Pt = { x: cx, y: H - 30 * U };
      const out: Pt = { x: cx, y: H + 70 * U };
      const spotA: Pt = tall ? { x: (pads[0]?.r ?? W) - 40, y: embY[0] ?? H + 100 } : { x: (pads[0]?.r ?? 0.4 * W) + 0.045 * W, y: embY[0] ?? H + 100 };
      const spotB: Pt = tall ? { x: (pads[1]?.r ?? W) - 40, y: embY[1] ?? H + 600 } : { x: (pads[1]?.l ?? 0.6 * W) - 0.045 * W, y: embY[1] ?? H + 100 };
      const spotC: Pt = tall
        ? { x: W / 2, y: pads[0] && pads[1] ? (pads[0].b + pads[1].t) / 2 : H + 400 }
        : { x: W / 2, y: pads[0] ? (pads[0].t + pads[0].b) / 2 : H + 300 };
      let x = cx;
      let y = yIn;
      let rot = 0;
      if (p < T.leave[0]) {
        rot = 0;
      } else if (p < T.leave[1]) {
        const pts: Pt[] = [{ x: cx, y: cy }, { x: cx + 100 * U, y: cy + 6 * U }, { x: cx + 100 * U, y: H - 30 * U }, door, out];
        const a = along(pts, ease((p - T.leave[0]) / (T.leave[1] - T.leave[0])));
        x = a.x;
        y = a.y;
        rot = a.ang;
      } else if (p >= T.back[0]) {
        // back into the office, to her desk
        const pts: Pt[] = [spotC, out, door, { x: cx + 100 * U, y: H - 30 * U }, { x: cx + 100 * U, y: cy + 6 * U }, { x: cx, y: cy }];
        const a = along(pts, ease((p - T.back[0]) / (T.back[1] - T.back[0])));
        x = a.x;
        y = a.y;
        rot = p >= T.back[1] ? 0 : a.ang;
      } else {
        const stops = [out, spotA, spotB, spotC];
        const wins = [T.toA, T.toB, T.toC];
        const hold = [0, tall ? 90 : 90, tall ? 90 : -90, 0]; // which way she looks when she stands at a stop
        let k = -1;
        wins.forEach((w, i) => p >= w[0] && (k = i));
        if (k < 0) {
          x = out.x;
          y = out.y;
        } else {
          const w = wins[k];
          if (p >= w[1]) {
            x = stops[k + 1].x;
            y = stops[k + 1].y;
            rot = hold[k + 1];
          } else {
            const t = ease((p - w[0]) / (w[1] - w[0]));
            x = lerp(stops[k].x, stops[k + 1].x, t);
            y = lerp(stops[k].y, stops[k + 1].y, t);
            rot = dir(stops[k], stops[k + 1]);
          }
        }
      }
      const moving = Math.hypot(x - lastX, y - lastY) > 0.35 && p > T.walk[0] + 0.001;
      lastX = x;
      lastY = y;
      const pose = sat ? "sit" : moving ? "walk" : "idle";
      settled = sat ? "sit" : "idle";
      rutvi.style.visibility = "visible";
      rutvi.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      rutvi.style.setProperty("--rot", `${rot.toFixed(1)}deg`);
      if (rutvi.dataset.pose !== pose) rutvi.dataset.pose = pose;
      const tag = x > W * 0.55 ? "l" : "r";
      if (rutvi.dataset.tag !== tag) rutvi.dataset.tag = tag;
      // seated, she waves at her colleagues for a moment
      const wv = sat && p > 0.29 && p < 0.44 ? "true" : "false";
      if (rutvi.dataset.wave !== wv) rutvi.dataset.wave = wv;

      // the view: it stays on the office, then follows her out of the door and down onto the courtyard
      const camAt = (keys: [number, number][]) => {
        let cam = keys[0][1];
        for (let i = 1; i < keys.length; i++) {
          if (p >= keys[i][0]) cam = keys[i][1];
          else {
            cam = lerp(keys[i - 1][1], keys[i][1], ease((p - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
            break;
          }
        }
        return cam;
      };
      const maxCam = Math.max(0, OH);
      let camY: number;
      if (tall) {
        const c1 = clamp((pads[0]?.t ?? H) - 0.015 * H, 0, maxCam);
        const c2 = clamp((pads[1]?.t ?? H) - 0.015 * H, 0, maxCam);
        const cf = clamp(pads[0] && pads[1] ? (pads[0].b + pads[1].t) / 2 - 0.5 * H : c2, 0, maxCam);
        camY = camAt([[0, 0], [T.cam[0], 0], [T.cam[1], c1], [T.toB[0], c1], [T.toB[1], c2], [T.toC[0], c2], [T.toC[1], cf], [1, cf]]);
      } else {
        const cOut = H;
        const cEnd = H + Math.max(0, OH - H);
        camY = camAt([[0, 0], [T.cam[0], 0], [T.cam[1], cOut], [T.toC[0], cOut], [T.toC[1], cEnd], [1, cEnd]]);
      }
      if (p >= T.back[0]) {
        // on the way back the view comes up with her and ends on the office
        camY = lerp(camY, clamp(y - 0.55 * H, 0, maxCam), ease((p - T.back[0]) / 0.03));
        camY = lerp(camY, 0, ease((p - (T.back[1] - 0.04)) / 0.04));
      }
      world.style.transform = camY > 0.5 ? `translate3d(0, ${(-camY).toFixed(1)}px, 0)` : "";

      // the heading: each line comes out of a blur when she walks over it
      lineEls.forEach((el, i) => {
        const v = ease((yIn - (lineTop[i] - lineH[i] * 0.2)) / (lineH[i] * 1.05));
        el.style.opacity = v.toFixed(3);
        el.style.transform = v < 0.999 ? `translateY(${((1 - v) * 22).toFixed(1)}px)` : "";
        el.style.filter = v < 0.999 ? `blur(${((1 - v) * 12).toFixed(1)}px)` : "";
      });
      // the corners: first their names, then the desks, the boards and the people
      hitEls.forEach((el, k) => {
        const i = k % 4;
        const v = ease((p - (T.chips + 0.025 * i)) / 0.05);
        const chip = el.firstElementChild as HTMLElement | null;
        if (chip) {
          chip.style.opacity = v.toFixed(3);
          chip.style.translate = v < 0.999 ? `0 ${((1 - v) * 8).toFixed(1)}px` : "";
        }
        el.dataset.ready = String(v > 0.95 && p > T.zones + 0.035 * i - 0.04);
      });
      zoneEls.forEach((el, k) => {
        const i = k % 4;
        const v = ease((p - (T.zones + 0.035 * i)) / 0.09);
        el.style.opacity = v.toFixed(3);
        el.style.translate = v < 0.999 ? `0 ${((1 - v) * 18).toFixed(1)}px` : "";
        el.style.filter = v < 0.999 ? `blur(${((1 - v) * 9).toFixed(1)}px)` : "";
      });
      if (tipEl) {
        const v = Math.min(1, ease((p - 0.21) / 0.08) * (1 - ease((p - 0.46) / 0.04)) + ease((p - 0.95) / 0.03));
        tipEl.style.opacity = v.toFixed(3);
        tipEl.style.translate = v < 0.999 ? `0 ${((1 - v) * 14).toFixed(1)}px` : "";
      }
      objs = ease((p - 0.36) / 0.06);
      // the facts of the two projects come in, one line after the other, when she gets to them
      moreEls.forEach((el, i) => {
        const dv = ease((p - (i === 0 ? T.infoA : T.infoB)) / 0.05);
        const kids = Array.from(el.children) as HTMLElement[];
        kids.forEach((kid, k) => {
          const v = ease(dv * (kids.length + 0.8) - k);
          kid.style.opacity = v.toFixed(3);
          kid.style.translate = v < 0.999 ? `0 ${((1 - v) * 14).toFixed(1)}px` : "";
        });
      });
      padEls.forEach((el, i) => {
        const here = i === 0 ? p >= T.infoA - 0.01 : p >= T.infoB - 0.01;
        if (el.dataset.here !== String(here)) el.dataset.here = String(here);
      });

      window.clearTimeout(idleT);
      idleT = window.setTimeout(() => {
        if (rutvi.dataset.pose === "walk") rutvi.dataset.pose = settled;
      }, 150);
    };
    const onScroll = () => {
      if (!frameRaf) frameRaf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    // the colleagues: some walk from one place of the floor to another at random, stop for a moment and go on; four (one of each team) walk
    // over to Rutvi now and then, stand by her for a moment and walk back to their corner
    const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
    const home = (i: number) => {
      if (tall) {
        const z = TALL[i];
        return { x: (parseFloat(z.left) / 100) * W + 150 * ZS, y: (z.top / 100) * H + ZH * ZS + 14 };
      }
      const z = WIDE[i];
      return { x: z.side === "l" ? 0.035 * W + ZW * ZS + 16 : 0.965 * W - ZW * ZS - 16, y: (z.top / 100) * H + 150 * ZS };
    };
    const spot = (i: number) => {
      const { cx, cy } = cxy();
      const side = (tall ? TALL[i].side : WIDE[i].side) === "l" ? -1 : 1;
      const row = tall ? (i < 2 ? 0 : 1) : WIDE[i].row;
      // beside her chair (never under her or her desk), the one of the lower row a step further away
      const x = side < 0 ? cx - (row ? 100 : 60) * U : cx + 23 * U + (row ? 140 : 100);
      return { x, y: cy + (row ? 30 : -6) * U, face: side < 0 ? -90 : 90 };
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!visible || W <= 1) return;
      const scale = Math.min(5, Math.max(0.6, W / 1440));
      const places = tall ? PLACES_TALL : PLACES_WIDE;
      const count = tall ? 3 : randoms.length;
      const pick = (s: Walker) => {
        let ok = false;
        for (let n = 0; n < 16 && !ok; n++) {
          const q = places[Math.floor(Math.random() * places.length)];
          const tx = (q[0] / 100) * W;
          const ty = (q[1] / 100) * H;
          if (Math.hypot(tx - s.x, ty - s.y) < 0.16 * W || hitsMiddle(s.x, s.y, tx, ty)) continue;
          s.tx = tx;
          s.ty = ty;
          ok = true;
        }
        if (!ok) {
          s.tx = s.x;
          s.ty = s.y;
          s.wait = 1.2;
        }
        s.speed = rnd(50, 68) * scale;
      };
      // moves a figure one step towards its target; returns true while it walks
      const walk = (s: Walker, speed: number) => {
        const dx = s.tx - s.x;
        const dy = s.ty - s.y;
        const d = Math.hypot(dx, dy);
        const step = speed * dt;
        if (d <= step) {
          s.x = s.tx;
          s.y = s.ty;
          return false;
        }
        s.x += (dx / d) * step;
        s.y += (dy / d) * step;
        s.tgt = (Math.atan2(dy, dx) * 180) / Math.PI - 90; // the figure faces down at 0 degrees
        return true;
      };
      const show = (el: HTMLElement, s: Walker, mv: boolean) => {
        const diff = ((s.tgt - s.cur + 540) % 360) - 180;
        s.cur += diff * Math.min(1, dt * 5);
        el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
        el.dataset.pose = mv ? "walk" : "idle";
        (el.firstElementChild as HTMLElement).style.transform = `rotate(${s.cur.toFixed(1)}deg)`;
      };

      randoms.forEach((el, i) => {
        const s = rState[i];
        if (i >= count) {
          el.style.display = "none";
          s.init = false;
          return;
        }
        if (!s.init) {
          const q = places[(i * 3 + 1) % places.length];
          s.x = (q[0] / 100) * W;
          s.y = (q[1] / 100) * H;
          s.wait = rnd(0, 4);
          s.init = true;
          pick(s);
        }
        el.style.display = "";
        let mv = false;
        if (s.wait > 0) s.wait -= dt;
        else if (walk(s, s.speed)) mv = true;
        else {
          s.wait = rnd(1.5, 6);
          pick(s);
        }
        show(el, s, mv);
        el.style.opacity = objs.toFixed(3);
      });

      visitors.forEach((el, i) => {
        const s = vState[i];
        if (tall && i < 2) {
          el.style.display = "none";
          s.init = false;
          return;
        }
        el.style.display = "";
        const h = home(i);
        if (!s.init) {
          s.x = h.x;
          s.y = h.y;
          s.tx = h.x;
          s.ty = h.y;
          s.ph = 0;
          s.wait = 3 + i * 3.2 + rnd(0, 3);
          s.init = true;
        }
        const sp = spot(i);
        let mv = false;
        if (s.ph === 0) {
          // at home (not to be seen); when Rutvi is seated and the office is there, somebody gets up and goes to her
          s.o = Math.max(0, s.o - dt * 3);
          s.x = h.x;
          s.y = h.y;
          if (seated && objs > 0.95) s.wait -= dt;
          if (s.wait <= 0) {
            s.ph = 1;
            s.tx = sp.x;
            s.ty = sp.y;
            s.tgt = (Math.atan2(sp.y - s.y, sp.x - s.x) * 180) / Math.PI - 90;
            s.cur = s.tgt;
          }
        } else if (s.ph === 1) {
          s.o = Math.min(1, s.o + dt * 3);
          s.tx = sp.x;
          s.ty = sp.y;
          mv = walk(s, 70 * scale);
          if (!mv) {
            s.ph = 2;
            s.wait = rnd(3.2, 5.5);
            s.tgt = sp.face;
          }
        } else if (s.ph === 2) {
          // a short talk with her, face to face
          s.tgt = sp.face;
          s.wait -= dt;
          if (s.wait <= 0) {
            s.ph = 3;
            s.tx = h.x;
            s.ty = h.y;
          }
        } else {
          s.tx = h.x;
          s.ty = h.y;
          mv = walk(s, 70 * scale);
          if (!mv) {
            s.ph = 0;
            s.wait = rnd(7, 15);
          } else {
            const left = Math.hypot(s.tx - s.x, s.ty - s.y);
            s.o = Math.min(1, left / 40);
          }
        }
        show(el, s, mv);
        el.style.opacity = (objs * s.o).toFixed(3);
      });
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);
    if (outEl) ro.observe(outEl);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(root);
    document.fonts.ready.then(onResize, onResize);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      if (frameRaf) cancelAnimationFrame(frameRaf);
      window.clearTimeout(idleT);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const lines = heading.split("\n").map((l) => l.trim()).filter(Boolean);
  const SCALE = "scale(var(--zs))";
  const cur = cabins[clamp(shown, 0, Math.max(0, cabins.length - 1))];
  const curIndustries = (cur?.industries?.trim() ? cur.industries : INDUSTRIES[cur?.code ?? ""] || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const curZone = WIDE[shown] ?? WIDE[0];
  const gov = projects && projects.length ? projects : GOV_PROJECTS;

  const hit = (i: number, style: React.CSSProperties) => {
    const c = cabins[i];
    if (!c) return null;
    return (
      <button
        key={i}
        type="button"
        className="vfo-hit"
        data-on={open === i}
        data-ready="false"
        style={style}
        aria-label={`${c.code}: ${c.name}`}
        aria-expanded={open === i}
        onPointerDown={(e) => (pType.current = e.pointerType)}
        onKeyDown={() => (pType.current = "key")}
        onPointerEnter={(e) => e.pointerType === "mouse" && openAt(i)}
        onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
        onFocus={() => pType.current === "key" && openAt(i)}
        onBlur={() => closeSoon(120)}
        onClick={() => (pType.current === "mouse" ? openAt(i) : open === i ? setOpen(-1) : openAt(i))}
      >
        <span className="vfo-chip">
          <b>{c.code}</b>
          <span>{c.name}</span>
        </span>
      </button>
    );
  };

  return (
    <section ref={trackRef} id="floor" className="vfo" aria-label={heading.replace(/\n/g, " ")}>
      <div className="tl-stage">
        <div ref={worldRef} className="vfo-world" data-layout="wide">
          <div ref={rootRef} className="of vfo-of" data-layout="wide" data-open={open >= 0}>
            <div className="of-walls" aria-hidden>
              <span className="of-wall of-wall-t of-wall-t1" />
              <span className="of-wall of-wall-t of-wall-t2" />
              <span className="of-wall of-wall-l" />
              <span className="of-wall of-wall-r" />
              <span className="of-wall of-wall-b vfo-wb1" />
              <span className="of-wall of-wall-b vfo-wb2" />
              <span className="of-door" />
              <span className="of-door vfo-door-b" />
            </div>
            <div className="of-decor" aria-hidden>
              <span className="of-plant" style={{ left: "31.5%", top: "6%" }} />
              <span className="of-plant" style={{ left: "68.5%", top: "6%" }} />
              <span className="of-plant" style={{ left: "31.5%", top: "95%" }} />
              <span className="of-plant" style={{ left: "68.5%", top: "95%" }} />
            </div>

            {/* the four teams */}
            <div className="of-wide-only">
              {WIDE.map((z, i) =>
                cabins[i] ? (
                  <Corner
                    key={i}
                    team={CREW[i % CREW.length]}
                    name=""
                    order={i}
                    board={METAVERSE_BOARDS[i % METAVERSE_BOARDS.length]}
                    style={{ top: `${z.top}%`, left: z.side === "l" ? "3.5%" : "calc(96.5% - 300px * var(--zs))", transform: SCALE }}
                  />
                ) : null,
              )}
            </div>
            <div className="of-tall-only">
              {TALL.map((z, i) =>
                cabins[i] ? (
                  <Corner
                    key={i}
                    team={CREW[i % CREW.length]}
                    name=""
                    order={i}
                    board={METAVERSE_BOARDS[i % METAVERSE_BOARDS.length]}
                    style={{ top: `${z.top}%`, left: z.left, transform: SCALE }}
                  />
                ) : null,
              )}
            </div>

            {WALKER_TONES.map((tone, i) => (
              <div key={i} data-walker="" className="of-walker" style={{ "--tone": tone } as React.CSSProperties}>
                <div className="of-walker-in">
                  <PersonTop />
                </div>
              </div>
            ))}
            {VISITOR_TONES.map((tone, i) => (
              <div key={"v" + i} data-walker="" data-visitor={i} className="of-walker" style={{ "--tone": tone } as React.CSSProperties}>
                <div className="of-walker-in">
                  <PersonTop />
                </div>
              </div>
            ))}

            {/* the end of the line: a tiny white circle, her chair and her desk */}
            <span className="of-line" aria-hidden />
            <span className="of-end" aria-hidden />
            <span className="of-chair-b vfo-chair" aria-hidden />
            <span className="of-boss-desk vfo-desk" aria-hidden>
              <i className="of-mon" />
              <i className="of-mon of-mon-b" />
              <i className="of-bplant" />
            </span>

            {/* the heading on the floor and the card under her desk */}
            <div className="of-center">
              <h2 className="of-year vfo-title">
                {lines.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </h2>
              <div className="of-goal vfo-tip">
                <h3>{tipTitle}</h3>
                <p>{tipText}</p>
              </div>
            </div>
            <div ref={hintRef} className="vfo-hint" aria-hidden>
              <span>{hint}</span>
              <svg viewBox="0 0 40 36" aria-hidden>
                <path d="M6 5l14 11L34 5M6 20l14 11 14-11" />
              </svg>
            </div>

            {/* the hot spots of the four corners (their names are written above them) */}
            <div className="of-wide-only">
              {WIDE.map((z, i) => hit(i, { top: `${z.top}%`, left: z.side === "l" ? "3.5%" : "calc(96.5% - 300px * var(--zs))" }))}
            </div>
            <div className="of-tall-only">{TALL.map((z, i) => hit(i, { top: `${z.top}%`, left: z.left }))}</div>

            {/* the rest of the office goes out of focus (the card is the only sharp thing): strongest round the card, weaker towards the edges */}
            <div className="vfo-blur" aria-hidden onPointerDown={() => setOpen(-1)}>
              {[1.9, 2.5, 3.1, 3.7, 4.3, 5].map((b, i) => (
                <i key={i} style={{ "--k": i + 1, "--b": b } as React.CSSProperties} />
              ))}
            </div>

            {/* what the team builds and who it is for */}
            <div
              ref={popRef}
              className="vfo-pop bglow"
              data-open={open >= 0}
              data-side={curZone.side}
              data-row={curZone.row}
              role="status"
              onPointerEnter={keep}
              onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
            >
              <GlowEdge />
              <span className="vfo-pop-gap" aria-hidden />
              {cur && (
                <div key={shown} className="vfo-pop-in">
                  <div className="vfo-pop-head">
                    <b>{cur.code}</b>
                    <h3>{cur.name}</h3>
                  </div>
                  <p>{cur.text}</p>
                  {curIndustries.length > 0 && (
                    <>
                      <p className="vfo-pop-lead">{industriesTitle}</p>
                      <ul>
                        {curIndustries.map((t, k) => (
                          <li key={k}>{t}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <a href="#contact" className="vfo-pop-cta" onClick={() => setOpen(-1)}>
                    {ctaLabel || "Talk to us"}
                    <svg viewBox="0 0 20 20" aria-hidden>
                      <path d="M4 10h11M11 5l5 5-5 5" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* outside the office: the courtyard with the two government projects */}
          <GovOutside title={govTitle || GOV_TITLE} projects={gov} />

          {/* Rutvi: the same figure as the founders of the timeline; she lives in the world (not in the office) so that she can walk out of it */}
          <div ref={rutviRef} className="tl-p of-sp vfo-rutvi" data-tag="r" data-pose="idle" data-face="down" data-wave="false" style={{ "--tone": 340 } as React.CSSProperties}>
            <span className="tl-tag">{name}</span>
            <PersonTop girl />
          </div>
        </div>
        <div ref={blackRef} className="vfo-black" aria-hidden />
      </div>
      <span className="sr-only">{`${heading.replace(/\n/g, " ")}. ${name} sits at her desk. ${cabins.map((c) => `${c.code}: ${c.name}. ${c.text}`).join(" ")} ${govTitle || GOV_TITLE}: ${gov.map((g) => `${g.org}, ${g.orgFull}: ${g.title}, ${g.period}. ${g.text}`).join(" ")}`}</span>
    </section>
  );
}
