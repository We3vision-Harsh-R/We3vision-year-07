"use client";

import "@/styles/fest.css";
import "@/styles/fest-office.css";
import { useEffect, useRef, type CSSProperties } from "react";
import { Diya, Kandil, Rangoli, SkyLantern, ToranGarland } from "./fest-art";
import { useFest } from "./use-fest";

// THE OFFICES IN DIWALI (Admin > Fest, "Places": "About page office" and "Team page office"): one overlay that both offices put as the last child of
// their `.of` floor (timeline-office.tsx for the About page, modern/team-office.tsx for the Team page). It lies over everything that is in the office
// (tables, people, walkers) and takes no click, so the cards of the team still open. It is built in three depths, like the top layer of the site:
//   far   (blurred, a little faded)  fireworks bursting over the top wall, sky lanterns that drift up
//   mid   (a little blurred)         the toran over the top wall, kandils that swing, strings of bulbs along the side walls
//   near  (sharp, the biggest)       rangolis in the corners of the floor, a line of diyas, sparks that rise
// The layers lean against the mouse a little (--mx / --my, set on the floor while the mouse moves over it), the far layer the least.
// Styles: src/styles/fest-office.css (.fo-*).

const FIREWORKS = [
  // (at the sides: the title and the numbers of the office are in the middle)
  { x: 10, y: 14, h: "#fbbf24", d: 0 },
  { x: 90, y: 10, h: "#f472b6", d: -3.4 },
  { x: 21, y: 5, h: "#fb923c", d: -6.3 },
  { x: 79, y: 17, h: "#a3e635", d: -1.8 },
];
const LANTERNS = [
  { x: 9, y: 78, t: 30, d: -4 },
  { x: 29, y: 64, t: 38, d: -17 },
  { x: 71, y: 82, t: 34, d: -9 },
  { x: 91, y: 60, t: 42, d: -26 },
  { x: 50, y: 90, t: 46, d: -31 },
];
const KANDILS = [
  { x: 8, w: 52, d: -1 },
  { x: 92, w: 52, d: -2.4 },
];

export function OfficeFest({ effect }: { effect: "about" | "team" }) {
  const fest = useFest();
  const on = fest?.has(effect) ?? false;
  const ref = useRef<HTMLDivElement>(null);

  // the layers lean against the mouse while it is over the floor
  useEffect(() => {
    const el = ref.current;
    const floor = el?.parentElement;
    if (!on || !el || !floor || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", nx.toFixed(3));
      el.style.setProperty("--my", ny.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      const r = floor.getBoundingClientRect();
      nx = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
      ny = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    floor.addEventListener("pointermove", move, { passive: true });
    return () => {
      floor.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={ref} className="fo" aria-hidden data-pause-off>
      {/* far: blurred */}
      <div className="fo-d" data-z="0">
        {FIREWORKS.map((f, i) => (
          <i key={i} className="fo-fw fo-it" style={{ left: `${f.x}%`, top: `${f.y}%`, "--h": f.h, "--d": `${f.d}s` } as CSSProperties}>
            <b />
            {Array.from({ length: 16 }, (_, r) => (
              <u key={r} style={{ "--a": `${r * 22.5}deg` } as CSSProperties} />
            ))}
          </i>
        ))}
        {LANTERNS.map((l, i) => (
          <i key={i} className="fo-lant fo-it" style={{ left: `${l.x}%`, top: `${l.y}%`, "--t": `${l.t}s`, "--d": `${l.d}s` } as CSSProperties}>
            <SkyLantern />
          </i>
        ))}
      </div>

      {/* mid: a little blurred */}
      <div className="fo-d" data-z="1">
        <i className="fo-toran fo-it">
          <ToranGarland scallops={20} seg={130} sag={22} bulbSize={3} />
        </i>
        {KANDILS.map((k, i) => (
          <i key={i} className="fo-kandil fo-it" style={{ left: `${k.x}%`, width: k.w, "--d": `${k.d}s` } as CSSProperties}>
            <u />
            <Kandil />
          </i>
        ))}
        <i className="fo-side fo-it is-l" />
        <i className="fo-side fo-it is-l is-b" />
        <i className="fo-side fo-it is-r" />
        <i className="fo-side fo-it is-r is-b" />
      </div>

      {/* near: sharp */}
      <div className="fo-d" data-z="2">
        <i className="fo-rangoli fo-it is-bl">
          <Rangoli size={230} />
        </i>
        <i className="fo-rangoli fo-it is-br">
          <Rangoli size={190} hue={-26} />
        </i>
        <div className="fo-diyas fo-it">
          {Array.from({ length: 9 }, (_, i) => (
            <Diya key={i} k={i} w={26} />
          ))}
        </div>
        {Array.from({ length: 16 }, (_, i) => (
          <s key={i} className="fo-ember fo-it" style={{ left: `${(i * 37 + 8) % 96}%`, top: `${30 + ((i * 53) % 66)}%`, "--t": `${5 + ((i * 7) % 6)}s`, "--d": `${-((i * 13) % 10)}s`, "--i": i } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}
