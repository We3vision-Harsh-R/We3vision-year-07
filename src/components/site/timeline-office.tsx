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
// Everything is drawn from CSS (see .of-* in globals.css) in the colours of the visitor's theme.

const archivo = Archivo({ subsets: ["latin"], weight: "900", display: "swap" });

const ZW = 300; // the drawing of one corner is 300 x 226 px (scaled to the screen with --zs)
const ZH = 226;
const TEAM_HUES = [300, 340, 20, 60, 100, 200, 250]; // blazer colours of the seven teams (hue offsets from the theme)

type Zone = { side: "l" | "r"; top: number; team: number }; // top in % of the screen; team = index of the department
// wide screens: left column 4 corners, right column 3 corners and the lounge
const ZONES_WIDE: Zone[] = [
  { side: "l", top: 2.5, team: 0 }, { side: "l", top: 27, team: 1 }, { side: "l", top: 51.5, team: 2 }, { side: "l", top: 76, team: 3 },
  { side: "r", top: 2.5, team: 4 }, { side: "r", top: 27, team: 5 }, { side: "r", top: 51.5, team: 6 },
];
// phones: two columns, three rows of corners above the middle, the seventh one under it
const ZONES_TALL: { left: string; top: number; team: number }[] = [
  { left: "2%", top: 0.8, team: 0 }, { left: "52%", top: 0.8, team: 1 },
  { left: "2%", top: 12.8, team: 2 }, { left: "52%", top: 12.8, team: 3 },
  { left: "2%", top: 24.8, team: 4 }, { left: "52%", top: 24.8, team: 5 },
  { left: "calc(50% - 150px * var(--zs))", top: 88.4, team: 6 },
];

type Walker = { a: [number, number]; b: [number, number]; tone: number; delay: number; speed: number };
// colleagues walking over to somebody (positions in % of the screen; they stop, "talk", and walk back)
const WALKERS_WIDE: Walker[] = [
  { a: [27, 9], b: [73, 9], tone: 40, delay: 0, speed: 66 },
  { a: [77, 80], b: [77, 24], tone: 300, delay: 3, speed: 56 },
];
const WALKERS_TALL: Walker[] = [
  { a: [20, 40], b: [80, 40], tone: 40, delay: 0, speed: 54 },
  { a: [20, 80], b: [80, 80], tone: 300, delay: 3, speed: 52 },
];

/** One seated, standing or walking person of the office (the same little character as everywhere on the site). */
function Pp({ x, y, rot = 0, role, k, tone }: { x: number; y: number; rot?: number; role: "type" | "meet" | "talk" | "pres"; k: number; tone: number }) {
  return (
    <span
      className="of-pp"
      data-role={role}
      style={{ left: x, top: y, "--rot": `${rot}deg`, "--tone": tone + ((k * 17) % 40) - 20, "--d": `${((k * 0.37) % 1.6).toFixed(2)}s` } as React.CSSProperties}
    >
      <PersonTop hair={k % 4} seated={role !== "pres"} />
    </span>
  );
}

/** A corner of the office: the work table, the wall board and the meeting. */
function Corner({ team, name, style }: { team: number; name: string; style: React.CSSProperties }) {
  const Board = BOARDS[team % BOARDS.length];
  const tone = TEAM_HUES[team % TEAM_HUES.length];
  const b = team * 7;
  return (
    <div className="of-zone" style={{ ...style, "--zt": tone } as React.CSSProperties}>
      <span className="of-carpet" />
      <span className="of-label">{name}</span>
      <span className="of-board">
        <Board />
      </span>
      {/* the colleague at the board, explaining */}
      <Pp x={90} y={122} rot={180} role="pres" k={b + 1} tone={tone} />
      {/* the work table: four people at their laptops */}
      <span className="of-wt">
        <i className="of-lap" style={{ left: 14, top: 7 }} />
        <i className="of-lap" style={{ left: 88, top: 7 }} />
        <i className="of-lap" style={{ left: 14, top: 23 }} />
        <i className="of-lap" style={{ left: 88, top: 23 }} />
        <i className="of-mug" style={{ left: 66, top: 16 }} />
      </span>
      <Pp x={48} y={150} role="type" k={b + 2} tone={tone} />
      <Pp x={130} y={150} role="type" k={b + 3} tone={tone} />
      <Pp x={48} y={210} rot={180} role="type" k={b + 4} tone={tone} />
      <Pp x={130} y={210} rot={180} role="type" k={b + 5} tone={tone} />
      {/* the meeting round a small table */}
      <span className="of-mt">
        <i className="of-paper" />
        <i className="of-paper of-paper-b" />
      </span>
      <Pp x={232} y={108} role="meet" k={b + 6} tone={tone} />
      <Pp x={274} y={150} rot={90} role="talk" k={b + 7} tone={tone} />
      <Pp x={232} y={192} rot={180} role="meet" k={b + 8} tone={tone} />
      <Pp x={190} y={150} rot={-90} role="meet" k={b + 9} tone={tone} />
      <span className="of-say" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span className="of-zplant" aria-hidden />
    </div>
  );
}

export function OfficeStage({ teams, finalYear, goalTitle, goalText, names }: { teams: string[]; finalYear: string; goalTitle: string; goalText: string; names: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // the unit of the drawing follows the size of the screen; the walkers walk
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
    const state = walkers.map((_, i) => ({ t: -(WALKERS_WIDE[i]?.delay ?? 0), rot: 0 }));

    const measure = () => {
      const r = root.getBoundingClientRect();
      W = r.width || 1;
      H = r.height || 1;
      tall = W / H < 0.9;
      const u = Math.min(1.25, Math.max(tall ? 0.58 : 0.62, Math.min(W / 1440, H / 900) * (tall ? 1.8 : 1)));
      root.style.setProperty("--u", u.toFixed(3));
      // the size of a corner: it must fit its column
      const zs = tall ? Math.min((0.42 * W) / ZW, (0.1 * H) / ZH) : Math.min((0.23 * W) / ZW, (0.2 * H) / ZH);
      root.style.setProperty("--zs", zs.toFixed(3));
      root.dataset.layout = tall ? "tall" : "wide";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!visible) return;
      const list = tall ? WALKERS_TALL : WALKERS_WIDE;
      walkers.forEach((el, i) => {
        const w = list[i];
        const s = state[i];
        if (!w) {
          el.style.display = "none";
          return;
        }
        el.style.display = "";
        const ax = (w.a[0] / 100) * W, ay = (w.a[1] / 100) * H, bx = (w.b[0] / 100) * W, by = (w.b[1] / 100) * H;
        const dist = Math.hypot(bx - ax, by - ay) || 1;
        const walkT = dist / (w.speed * Math.min(1.2, Math.max(0.6, W / 1440)));
        const PAUSE = 3;
        s.t += dt;
        // wait at a, walk to b, wait at b, walk back
        const cycle = PAUSE + walkT + PAUSE + walkT;
        const tt = s.t < 0 ? 0 : s.t % cycle;
        let f = 0;
        let moving = false;
        if (s.t < 0 || tt < PAUSE) f = 0;
        else if (tt < PAUSE + walkT) {
          f = (tt - PAUSE) / walkT;
          moving = true;
        } else if (tt < PAUSE + walkT + PAUSE) f = 1;
        else {
          f = 1 - (tt - 2 * PAUSE - walkT) / walkT;
          moving = true;
        }
        const x = ax + (bx - ax) * f;
        const y = ay + (by - ay) * f;
        if (moving) {
          const dir = tt < PAUSE + walkT ? 1 : -1;
          s.rot = (Math.atan2((by - ay) * dir, (bx - ax) * dir) * 180) / Math.PI - 90; // the figure faces down at 0 degrees
        }
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        el.dataset.pose = moving ? "walk" : "idle";
        (el.firstElementChild as HTMLElement).style.transform = `rotate(${s.rot.toFixed(0)}deg)`;
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(root);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const label = (t: number) => teams[t] || "";
  const SCALE = "scale(var(--zs))";

  return (
    <div ref={rootRef} className="of" data-layout="wide">
      <div className="of-decor" aria-hidden>
        <span className="of-win" style={{ left: "27%", width: "14%" }} />
        <span className="of-win" style={{ left: "59%", width: "14%" }} />
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
            style={{ top: `${z.top}%`, left: z.side === "l" ? "3.5%" : "calc(96.5% - 300px * var(--zs))", transform: SCALE }}
          />
        ))}
      </div>
      <div className="of-tall-only">
        {ZONES_TALL.map((z, i) => (
          <Corner key={i} team={z.team} name={label(z.team)} style={{ top: `${z.top}%`, left: z.left, transform: SCALE }} />
        ))}
      </div>

      {WALKERS_WIDE.map((w, i) => (
        <div key={i} data-walker="" className="of-walker" style={{ "--tone": w.tone } as React.CSSProperties}>
          <div className="of-walker-in">
            <PersonTop hair={(i + 1) % 4} />
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
      <div data-sp="a" className="tl-p of-sp" data-pose="idle" data-face="down" data-wave="false" style={{ "--tone": 352 } as React.CSSProperties}>
        <span className="tl-tag">{names[0]}</span>
        <PersonTop />
      </div>
      <div data-sp="b" className="tl-p of-sp" data-pose="idle" data-face="down" data-wave="false" style={{ "--tone": 20 } as React.CSSProperties}>
        <span className="tl-tag">{names[1]}</span>
        <PersonTop hair={1} />
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
