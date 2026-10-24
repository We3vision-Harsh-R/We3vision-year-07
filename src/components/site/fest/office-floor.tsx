"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PersonTop } from "../timeline-art";

// THE FLOOR OF AN OFFICE IN DIWALI (part of office-fest.tsx): rangolis lie on the floor at random places, and colleagues walk over to a free place
// and draw a NEW one: they walk round the pattern with a bowl of coloured powder while it grows from the dots and the ring to the petals and the
// middle (a CSS drawing of 9 seconds), then they stand a moment and walk to the next place. A floor never holds more than MAX rangolis: when a new one
// is finished the oldest fades away. The layer lies on the floor (under the tables and the people), takes no click and stops while it is off the screen.
// Everything is sized with the unit of the office (--p, the same as the people), so it fits every office. Styles: styles/fest-office.css (.fo-rg, .fo-mk).

/** a place on the floor in % of its width and height */
export type Spot = [number, number];

const MAX = 6;
const START = 3;
/** seconds the pattern needs to be drawn (the CSS animation of .fo-rg-p is this long) */
const DRAW = 9;
const TONES = [40, 300, 100, 200, 340];
const DIAM = 74; // the width of a rangoli in units of the office (a person is 21 wide); the same number is in fest-office.css (.fo-rg)

type Rg = { id: number; spot: number; hue: number; rot: number; fresh: boolean; fading: boolean };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** the pattern, drawn bit by bit: every piece has its own delay (--t), so one drawing of DRAW seconds builds it from the outside to the middle */
function Pattern() {
  const petals = (r: number, n: number, c: string, w: number, h: number, t0: number, gap: number) =>
    Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`rotate(${(360 / n) * i} 60 60)`}>
        <ellipse className="fo-rg-p" cx="60" cy={60 - r} rx={w} ry={h} fill={c} style={{ "--t": `${(t0 + i * gap).toFixed(2)}s` } as CSSProperties} />
      </g>
    ));
  return (
    <svg viewBox="0 0 120 120" aria-hidden>
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * 6.2832;
        return <circle key={i} className="fo-rg-d" cx={60 + Math.cos(a) * 56} cy={60 + Math.sin(a) * 56} r={i % 3 === 0 ? 1.7 : 1.1} fill="#fde68a" style={{ "--t": `${(i * 0.05).toFixed(2)}s` } as CSSProperties} />;
      })}
      <circle className="fo-rg-ring" cx="60" cy="60" r="52" fill="none" stroke="#fb923c" strokeWidth="1.6" pathLength="1" style={{ "--t": "1.6s" } as CSSProperties} />
      {petals(40, 16, "#f97316", 6, 12, 2.4, 0.12)}
      {petals(26, 12, "#ec4899", 5.6, 10.5, 4.5, 0.13)}
      {petals(15, 8, "#facc15", 4.6, 8, 6.1, 0.14)}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 45 + 22.5} 60 60)`}>
          <path className="fo-rg-p" d="M60 38Q64 46 60 52Q56 46 60 38Z" fill="#16a34a" style={{ "--t": `${(7.3 + i * 0.1).toFixed(2)}s` } as CSSProperties} />
        </g>
      ))}
      <circle className="fo-rg-p" cx="60" cy="60" r="8" fill="#dc2626" style={{ "--t": "8.2s" } as CSSProperties} />
      <circle className="fo-rg-p" cx="60" cy="60" r="4.5" fill="#fef3c7" style={{ "--t": "8.5s" } as CSSProperties} />
    </svg>
  );
}

export function OfficeFloor({ spots }: { spots: Spot[] }) {
  const root = useRef<HTMLDivElement>(null);
  const makers = useRef<(HTMLDivElement | null)[]>([]);
  const [rgs, setRgs] = useState<Rg[]>([]);

  useEffect(() => {
    const floor = root.current?.parentElement;
    if (!root.current || !floor || spots.length < 8) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dead = false;
    let visible = true;
    let ids = 1;
    const timers = new Set<number>();
    const list: Rg[] = [];
    const walking = new Set<number>(); // the places somebody is on the way to
    const commit = () => setRgs([...list]);
    const wait = (s: number) =>
      new Promise<void>((res) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          res();
        }, s * 1000);
        timers.add(t);
      });
    /** a pause that does not run while the office is off the screen */
    const pause = async (s: number) => {
      let left = s;
      while (left > 0 && !dead) {
        await wait(Math.min(left, 0.5));
        if (visible) left -= 0.5;
      }
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(floor);

    /** a place with no rangoli on it and nobody on the way to it */
    const free = () => {
      const used = new Set<number>([...walking, ...list.map((r) => r.spot)]);
      const open = spots.map((_, i) => i).filter((i) => !used.has(i));
      return open.length ? open[Math.floor(Math.random() * open.length)] : -1;
    };
    const add = (spot: number, fresh: boolean) => {
      list.push({ id: ids++, spot, hue: Math.round(rnd(-40, 40)), rot: Math.round(rnd(0, 360)), fresh, fading: false });
      const alive = list.filter((r) => !r.fading);
      if (alive.length > MAX) {
        const gone = alive[0];
        gone.fading = true;
        timers.add(
          window.setTimeout(() => {
            const at = list.indexOf(gone);
            if (at >= 0) list.splice(at, 1);
            if (!dead) commit();
          }, 2300),
        );
      }
      commit();
    };

    // the rangolis that are already there
    for (let n = 0; n < START; n++) {
      const i = free();
      if (i >= 0) add(i, false);
    }
    if (reduce) return () => io.disconnect();

    const run = async (m: HTMLDivElement, startAt: number, lap: number) => {
      const inner = m.firstElementChild as HTMLElement;
      let cx = spots[startAt][0];
      let cy = Math.min(96, spots[startAt][1] + 6);
      m.style.left = `${cx}%`;
      m.style.top = `${cy}%`;
      m.style.visibility = "visible";
      /** goes to a place in % of the floor in `secs`, facing the way it goes */
      const go = (x: number, y: number, secs: number) => {
        const W = floor.clientWidth || 1;
        const H = floor.clientHeight || 1;
        const face = (Math.atan2(((y - cy) * H) / 100, ((x - cx) * W) / 100) * 180) / Math.PI - 90; // the figure faces down at 0 degrees
        m.style.transitionDuration = `${secs.toFixed(2)}s`;
        m.style.left = `${x}%`;
        m.style.top = `${y}%`;
        inner.style.transform = `rotate(${face.toFixed(0)}deg)`;
        cx = x;
        cy = y;
      };
      await pause(lap);
      while (!dead) {
        const i = free();
        if (i < 0) {
          await pause(4);
          continue;
        }
        walking.add(i);
        const [sx, sy] = spots[i];
        const W = floor.clientWidth || 1;
        const H = floor.clientHeight || 1;
        const u = parseFloat(getComputedStyle(floor).getPropertyValue("--u")) || 1;
        const ringX = ((DIAM * 0.5 + 14) * u * 100) / W; // how far from the middle of the rangoli he walks round it
        const ringY = ((DIAM * 0.5 + 14) * u * 100) / H;
        // 1. walk to the place (the walking feet are on while he moves)
        const dist = Math.hypot(((sx - cx) * W) / 100, ((sy + ringY - cy) * H) / 100);
        const secs = Math.max(1.4, dist / (62 * u));
        m.dataset.pose = "walk";
        go(sx, sy + ringY, secs);
        await pause(secs);
        if (dead) return;
        // 2. he draws: the pattern grows and he walks round it with the bowl, one lap
        add(i, true);
        walking.delete(i);
        const steps = 12;
        for (let k = 1; k <= steps; k++) {
          const ang = Math.PI / 2 - (k / steps) * Math.PI * 2; // clockwise, starting below it
          go(sx + Math.cos(ang) * ringX, sy + Math.sin(ang) * ringY, DRAW / steps);
          await pause(DRAW / steps);
          if (dead) return;
        }
        // 3. he is done: stands and looks, then rests a little
        m.dataset.pose = "idle";
        inner.style.transform = "rotate(0deg)";
        await pause(rnd(2.5, 6));
      }
    };

    // the two colleagues start at two places that are far apart
    makers.current.forEach((m, k) => {
      if (m) void run(m, k === 0 ? 0 : spots.length - 1, 1.2 + k * 6);
    });
    return () => {
      dead = true;
      timers.forEach((t) => window.clearTimeout(t));
      io.disconnect();
    };
  }, [spots]);

  return (
    <div ref={root} className="fo-fl" aria-hidden data-pause-off>
      {rgs.map((r) => (
        <i
          key={r.id}
          className="fo-rg"
          data-fresh={r.fresh}
          data-fading={r.fading}
          style={{ left: `${spots[r.spot][0]}%`, top: `${spots[r.spot][1]}%`, "--h": `${r.hue}deg`, "--r": `${r.rot}deg` } as CSSProperties}
        >
          <Pattern />
          {r.fresh && !r.fading && (
            <>
              <u className="fo-bowl" />
              <u className="fo-bowl fo-bowl-b" />
            </>
          )}
        </i>
      ))}
      {[0, 1].map((k) => (
        <div
          key={k}
          ref={(el) => {
            makers.current[k] = el;
          }}
          className="of-walker fo-mk"
          data-pose="idle"
          style={{ "--tone": TONES[(k * 2 + 1) % TONES.length] } as CSSProperties}
        >
          <div className="of-walker-in">
            <PersonTop girl={k === 1} />
          </div>
        </div>
      ))}
    </div>
  );
}
