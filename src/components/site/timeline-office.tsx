"use client";

import { Archivo } from "next/font/google";
import { useEffect, useRef } from "react";
import { BOARDS } from "./timeline-boards";
import { PersonTop } from "./timeline-art";

// The last screen of the timeline: the office of 2027, a full screen seen from above. The seven departments of the company (one
// per service) each have their own corner, all built the same way and lined up in two columns: a team that works at a long table,
// a wall board where somebody is presenting an idea (each board shows the work of its department and moves a little), and a few
// colleagues who sit round a small table in a meeting. In the middle: a huge bold year, the line of the timeline ends in a tiny
// white circle under it, the two founders sit down in their boss chairs, and the goal of the company is written in a card below.
// The office has walls on its edges (a doorway at the top where the line comes in), a café under the right column and people who
// come and go: some tables have one, two or three people, a few colleagues walk about and a few enjoy a coffee in the café.
// Everything is drawn from CSS (see .of-* in globals.css) in the colours of the visitor's theme.

const archivo = Archivo({ subsets: ["latin"], weight: "900", display: "swap" });

const ZW = 300; // the drawing of one corner is 300 x 226 px (scaled to the screen with --zs)
const ZH = 226;
const TEAM_HUES = [300, 340, 20, 60, 100, 200, 250]; // blazer colours of the seven teams (hue offsets from the theme)

type Zone = { side: "l" | "r"; top: number; team: number }; // top in % of the screen; team = index of the department
// wide screens: left column 4 corners, right column 3 corners (the café takes the fourth place of the right column)
const ZONES_WIDE: Zone[] = [
  { side: "l", top: 2.5, team: 0 }, { side: "l", top: 27, team: 1 }, { side: "l", top: 51.5, team: 2 }, { side: "l", top: 76, team: 3 },
  { side: "r", top: 2.5, team: 4 }, { side: "r", top: 27, team: 5 }, { side: "r", top: 51.5, team: 6 },
];
// phones: two columns, three rows of corners above the middle, the seventh one and the café under it
const ZONES_TALL: { left: string; top: number; team: number }[] = [
  { left: "2%", top: 0.8, team: 0 }, { left: "52%", top: 0.8, team: 1 },
  { left: "2%", top: 12.8, team: 2 }, { left: "52%", top: 12.8, team: 3 },
  { left: "2%", top: 24.8, team: 4 }, { left: "52%", top: 24.8, team: 5 },
  { left: "2%", top: 88.4, team: 6 },
];

// The office lives on its own, whatever the visitor scrolls: colleagues get up and walk from one place of the floor to another, at
// random, stop for a moment and go on. These are the places they walk to (in % of the screen; the aisles between the corners).
const WALKER_TONES = [40, 300, 100, 200, 340];
const PLACES_WIDE: [number, number][] = [
  [30, 8], [50, 8], [70, 8], [27.5, 20], [27.5, 45], [27.5, 70], [27.5, 90], [72.5, 20], [72.5, 45], [72.5, 68],
  [38, 35], [62, 35], [36, 62], [64, 62], [40, 92], [60, 92], [72.5, 80],
];
const PLACES_TALL: [number, number][] = [
  [20, 37], [50, 37], [80, 37], [14, 52], [86, 52], [30, 64], [70, 64], [20, 80], [50, 80], [80, 80],
];

/** One seated, standing or walking person of the office (the same little character as everywhere on the site). */
function Pp({ x, y, rot = 0, role, k, tone }: { x: number; y: number; rot?: number; role: "type" | "meet" | "talk" | "pres"; k: number; tone: number }) {
  return (
    <span
      className="of-pp"
      data-role={role}
      style={{ left: x, top: y, "--rot": `${rot}deg`, "--tone": tone + ((k * 17) % 40) - 20, "--d": `${((k * 0.37) % 1.6).toFixed(2)}s` } as React.CSSProperties}
    >
      <PersonTop seated={role !== "pres"} />
    </span>
  );
}

// who sits where: every table has one, two or three people (1 = somebody sits there), nobody at the board in some corners
const SEATS: { work: number[]; meet: number[]; board: boolean }[] = [
  { work: [1, 1, 1, 0], meet: [1, 0, 0, 1], board: true },
  { work: [1, 0, 0, 1], meet: [0, 1, 0, 0], board: false },
  { work: [1, 1, 0, 1], meet: [1, 1, 0, 1], board: true },
  { work: [0, 1, 1, 0], meet: [1, 0, 1, 0], board: false },
  { work: [1, 0, 0, 0], meet: [1, 1, 1, 0], board: true },
  { work: [1, 0, 1, 1], meet: [0, 0, 1, 0], board: true },
  { work: [0, 1, 0, 0], meet: [1, 1, 0, 0], board: false },
];
const WORK_SEATS = [
  { x: 48, y: 150, rot: 0, lx: 14, ly: 7 },
  { x: 130, y: 150, rot: 0, lx: 88, ly: 7 },
  { x: 48, y: 210, rot: 180, lx: 14, ly: 23 },
  { x: 130, y: 210, rot: 180, lx: 88, ly: 23 },
];
const MEET_SEATS = [
  { x: 232, y: 108, rot: 0 },
  { x: 274, y: 150, rot: 90 },
  { x: 232, y: 192, rot: 180 },
  { x: 190, y: 150, rot: -90 },
];

function Chair({ x, y }: { x: number; y: number }) {
  return <i className="of-chair" style={{ left: x, top: y }} />;
}

/** A corner of the office: the work table, the wall board and the meeting. */
export function Corner({ team, name, order, style, board }: { team: number; name: string; order: number; style: React.CSSProperties; board?: () => React.ReactElement }) {
  const Board = board ?? BOARDS[team % BOARDS.length];
  const tone = TEAM_HUES[team % TEAM_HUES.length];
  const seats = SEATS[team % SEATS.length];
  const b = team * 11;
  const talker = seats.meet[1] ? 1 : seats.meet.findIndex((m) => m);
  return (
    <div className="of-zone" style={{ ...style, "--zt": tone, "--zi": order } as React.CSSProperties}>
      <span className="of-carpet" />
      <span className="of-label">{name}</span>
      <span className="of-board">
        <Board />
      </span>
      {/* the colleague at the board, explaining (not in every corner) */}
      {seats.board && <Pp x={90} y={122} rot={180} role="pres" k={b + 1} tone={tone} />}
      {/* the work table: one to three people at their laptops, the other chairs are empty */}
      {WORK_SEATS.map((w, i) => (
        <Chair key={"wc" + i} x={w.x} y={w.y + (w.rot ? -2 : 2)} />
      ))}
      <span className="of-wt">
        {WORK_SEATS.map((w, i) => (seats.work[i] ? <i key={i} className="of-lap" style={{ left: w.lx, top: w.ly }} /> : null))}
        <i className="of-mug" style={{ left: 66, top: 16 }} />
      </span>
      {WORK_SEATS.map((w, i) => (seats.work[i] ? <Pp key={"w" + i} x={w.x} y={w.y} rot={w.rot} role="type" k={b + 2 + i} tone={tone} /> : null))}
      {/* the meeting round a small table: one to three people */}
      {MEET_SEATS.map((m, i) => (
        <Chair key={"mc" + i} x={m.x} y={m.y} />
      ))}
      <span className="of-mt">
        <i className="of-paper" />
        <i className="of-paper of-paper-b" />
      </span>
      {MEET_SEATS.map((m, i) => (seats.meet[i] ? <Pp key={"m" + i} x={m.x} y={m.y} rot={m.rot} role={i === talker ? "talk" : "meet"} k={b + 7 + i} tone={tone} /> : null))}
      {seats.meet.filter(Boolean).length > 1 && (
        <span className="of-say" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      )}
      <span className="of-zplant" aria-hidden />
    </div>
  );
}

/** The café under the right column: a counter with a barista, small tables with one or two people, a sofa and somebody in the queue. */
function Cafe({ order, style }: { order: number; style: React.CSSProperties }) {
  const tone = 30;
  return (
    <div className="of-zone of-cafe" style={{ ...style, "--zt": tone, "--zi": order } as React.CSSProperties}>
      <span className="cf-floor" />
      <span className="of-label">Café</span>
      <span className="cf-bar">
        <i className="cf-mach" />
        <i className="cf-cup" style={{ left: 66 }} />
        <i className="cf-cup" style={{ left: 82 }} />
        <i className="cf-cake" />
      </span>
      <Pp x={150} y={32} rot={0} role="pres" k={201} tone={tone} />
      <Pp x={216} y={84} rot={180} role="pres" k={202} tone={tone + 70} />
      {/* small round tables */}
      <i className="cf-table" style={{ left: 58, top: 124 }}>
        <b className="of-cup" style={{ left: 3, top: 3 }} />
        <b className="of-cup" style={{ left: 17, top: 14 }} />
      </i>
      <Chair x={34} y={124} />
      <Chair x={82} y={124} />
      <Pp x={34} y={124} rot={90} role="talk" k={203} tone={tone + 120} />
      <Pp x={82} y={124} rot={-90} role="meet" k={204} tone={tone + 200} />
      <i className="cf-table" style={{ left: 150, top: 124 }}>
        <b className="of-cup" style={{ left: 10, top: 4 }} />
      </i>
      <Chair x={150} y={150} />
      <Pp x={150} y={150} rot={180} role="meet" k={205} tone={tone + 160} />
      <i className="cf-table" style={{ left: 242, top: 124 }}>
        <b className="of-cup" style={{ left: 4, top: 12 }} />
        <b className="of-cup" style={{ left: 16, top: 4 }} />
      </i>
      <Chair x={218} y={124} />
      <Chair x={266} y={124} />
      <Pp x={218} y={124} rot={90} role="meet" k={206} tone={tone + 40} />
      <Pp x={266} y={124} rot={-90} role="talk" k={207} tone={tone + 260} />
      {/* a sofa along the bottom with three friends */}
      <span className="cf-sofa" />
      <Pp x={96} y={196} rot={180} role="meet" k={208} tone={tone + 100} />
      <Pp x={150} y={196} rot={180} role="talk" k={209} tone={tone + 300} />
      <Pp x={204} y={196} rot={180} role="meet" k={210} tone={tone + 20} />
      <i className="cf-plant" aria-hidden />
    </div>
  );
}

export function OfficeStage({ teams, finalYear, goalTitle, goalText, names }: { teams: string[]; finalYear: string; goalTitle: string; goalText: string; names: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // the unit of the drawing follows the size of the screen; the walkers walk about at random (nothing here depends on the scroll)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 1;
    let H = 1;
    let tall = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    const walkers = Array.from(root.querySelectorAll<HTMLElement>("[data-walker]"));
    const state = walkers.map(() => ({ init: false, x: 0, y: 0, tx: 0, ty: 0, wait: 0, cur: 0, tgt: 0, speed: 60 }));

    const measure = () => {
      const r = root.getBoundingClientRect();
      // (a zero size is a half-laid-out page: wait for the next measure instead of drawing everything at 0.1 %)
      if (r.width < 2 || r.height < 2) return;
      const kx = r.width / W;
      const ky = r.height / H;
      // the colleagues who are walking keep their place on the floor when the window is resized or zoomed
      if (W > 1 && H > 1 && (Math.abs(kx - 1) > 0.001 || Math.abs(ky - 1) > 0.001)) {
        state.forEach((s) => {
          s.x *= kx;
          s.tx *= kx;
          s.y *= ky;
          s.ty *= ky;
        });
      }
      W = r.width;
      H = r.height;
      tall = W / H < 0.9;
      // the drawing grows with a huge screen (a big monitor, a zoomed-out page) as it does with a normal one: no ceiling
      const u = Math.min(6, Math.max(tall ? 0.58 : 0.62, Math.min(W / 1440, H / 900) * (tall ? 1.8 : 1)));
      root.style.setProperty("--u", u.toFixed(3));
      // the size of a corner: it must fit its column
      // (on a very wide, low screen the columns are far apart, so the corners may fill a little more of their column's height)
      const fill = W / H > 2 ? 0.225 : 0.2;
      const zs = tall ? Math.min((0.42 * W) / ZW, (0.1 * H) / ZH) : Math.min((0.23 * W) / ZW, (fill * H) / ZH);
      root.style.setProperty("--zs", zs.toFixed(3));
      root.dataset.layout = tall ? "tall" : "wide";
    };

    const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!visible) return;
      const places = tall ? PLACES_TALL : PLACES_WIDE;
      const count = tall ? 3 : walkers.length;
      const scale = Math.min(5, Math.max(0.6, W / 1440));
      const pick = (s: (typeof state)[number]) => {
        // somewhere else than where he stands
        let p = places[Math.floor(Math.random() * places.length)];
        for (let n = 0; n < 6 && Math.hypot((p[0] / 100) * W - s.x, (p[1] / 100) * H - s.y) < 0.18 * W; n++) p = places[Math.floor(Math.random() * places.length)];
        s.tx = (p[0] / 100) * W;
        s.ty = (p[1] / 100) * H;
        s.speed = rnd(50, 68) * scale;
      };
      walkers.forEach((el, i) => {
        const s = state[i];
        if (i >= count) {
          el.style.display = "none";
          s.init = false;
          return;
        }
        if (!s.init) {
          const p = places[Math.floor(Math.random() * places.length)];
          s.x = (p[0] / 100) * W;
          s.y = (p[1] / 100) * H;
          s.wait = rnd(0, 4);
          s.init = true;
          pick(s);
        }
        el.style.display = "";
        let moving = false;
        if (s.wait > 0) s.wait -= dt;
        else {
          const dx = s.tx - s.x;
          const dy = s.ty - s.y;
          const dist = Math.hypot(dx, dy);
          const step = s.speed * dt;
          if (dist <= step) {
            s.x = s.tx;
            s.y = s.ty;
            s.wait = rnd(1.5, 6);
            pick(s);
          } else {
            s.x += (dx / dist) * step;
            s.y += (dy / dist) * step;
            s.tgt = (Math.atan2(dy, dx) * 180) / Math.PI - 90; // the figure faces down at 0 degrees
            moving = true;
          }
        }
        // he turns smoothly to the way he walks
        const diff = ((s.tgt - s.cur + 540) % 360) - 180;
        s.cur += diff * Math.min(1, dt * 5);
        el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
        el.dataset.pose = moving ? "walk" : "idle";
        (el.firstElementChild as HTMLElement).style.transform = `rotate(${s.cur.toFixed(1)}deg)`;
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    // zooming the page or resizing the window must redraw the office at once, without a reload
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(root);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  const label = (t: number) => teams[t] || "";
  const SCALE = "scale(var(--zs))";

  return (
    <div ref={rootRef} className="of" data-layout="wide">
      <div className="of-walls" aria-hidden>
        <span className="of-wall of-wall-t of-wall-t1" />
        <span className="of-wall of-wall-t of-wall-t2" />
        <span className="of-wall of-wall-l" />
        <span className="of-wall of-wall-r" />
        <span className="of-wall of-wall-b" />
        <span className="of-door" />
      </div>
      <div className="of-decor" aria-hidden>
        <span className="of-plant" style={{ left: "24%", top: "6%" }} />
        <span className="of-plant" style={{ left: "76%", top: "6%" }} />
        <span className="of-plant of-plant-s" style={{ left: "24%", top: "50%" }} />
        <span className="of-plant of-plant-s" style={{ left: "76%", top: "50%" }} />
        <span className="of-plant" style={{ left: "24%", top: "95%" }} />
        <span className="of-plant" style={{ left: "76%", top: "95%" }} />
        <span className="of-cooler" style={{ left: "27%", top: "3.5%" }} />
        <span className="of-print" style={{ left: "73%", top: "4%" }} />
      </div>

      {/* the seven departments */}
      <div className="of-wide-only">
        {ZONES_WIDE.map((z, i) => (
          <Corner
            key={i}
            team={z.team}
            name={label(z.team)}
            order={i}
            style={{ top: `${z.top}%`, left: z.side === "l" ? "3.5%" : "calc(96.5% - 300px * var(--zs))", transform: SCALE }}
          />
        ))}
        <Cafe order={7} style={{ top: "76%", left: "calc(96.5% - 300px * var(--zs))", transform: SCALE }} />
      </div>
      <div className="of-tall-only">
        {ZONES_TALL.map((z, i) => (
          <Corner key={i} team={z.team} name={label(z.team)} order={i} style={{ top: `${z.top}%`, left: z.left, transform: SCALE }} />
        ))}
        <Cafe order={7} style={{ top: "88.4%", left: "52%", transform: SCALE }} />
      </div>

      {WALKER_TONES.map((tone, i) => (
        <div key={i} data-walker="" className="of-walker" style={{ "--tone": tone } as React.CSSProperties}>
          <div className="of-walker-in">
            <PersonTop />
          </div>
        </div>
      ))}

      {/* the end of the line: a tiny white circle, the two boss chairs next to it and the desk of the two founders */}
      <span className="of-line" aria-hidden />
      <span className="of-end" aria-hidden />
      <span className="of-chair-b of-chair-l" aria-hidden />
      <span className="of-chair-b of-chair-r" aria-hidden />
      <span className="of-boss-desk" aria-hidden>
        <i className="of-mon" />
        <i className="of-mon of-mon-b" />
        <i className="of-bplant" />
      </span>
      <div data-sp="a" className="tl-p of-sp" data-tag="l" data-pose="idle" data-face="down" data-wave="false" style={{ "--tone": 352 } as React.CSSProperties}>
        <span className="tl-tag">{names[0]}</span>
        <PersonTop />
      </div>
      <div data-sp="b" className="tl-p of-sp" data-tag="r" data-pose="idle" data-face="down" data-wave="false" style={{ "--tone": 20 } as React.CSSProperties}>
        <span className="tl-tag">{names[1]}</span>
        <PersonTop />
      </div>

      {/* the big year and the goal */}
      <div className="of-center">
        <p className={`of-year ${archivo.className}`}>{finalYear}</p>
        <div className="of-goal">
          <h3>{goalTitle}</h3>
          <p>{goalText}</p>
        </div>
      </div>
    </div>
  );
}
