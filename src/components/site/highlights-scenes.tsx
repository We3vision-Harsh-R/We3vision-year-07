"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { AVATAR_SIZE } from "./avatar";

/* "At a glance": every number lives in a little cartoon scene of its own (founded = an office going up with a flag, years = a
   birthday party, team = a crowd of colleagues, offices = two buildings and a paper plane between them). The scenes are drawn
   in theme colours (the --gl-* variables in globals.css) and start playing when the card comes into view. */

type KidProps = {
  x: number; // where the feet stand
  y: number;
  s?: number;
  tone?: number; // shirt hue offset (354 = the colour of the theme itself)
  mode?: "idle" | "wave" | "up";
  hat?: boolean;
  delay?: number;
  pop?: boolean;
};

// the drawings of the guide (public/avatar): which view, and where the top of the head is (for the party hat)
const POSE = {
  idle: { view: "front", hx: 0.5, hy: 0.035 },
  wave: { view: "present", hx: 0.4, hy: 0.06 },
  up: { view: "point", hx: 0.44, hy: 0.02 },
} as const;

/** The little guide of the site (the cartoon, front view); its shirt follows the colour of the theme. */
function Kid({ x, y, s = 1, tone = 354, mode = "idle", hat = false, delay = 0, pop = false }: KidProps) {
  const p = POSE[mode];
  const [vw, vh] = AVATAR_SIZE[p.view];
  const h = 54 * s;
  const w = (h * vw) / vh;
  const x0 = x - w / 2;
  const y0 = y - h;
  const hatX = x0 + w * p.hx;
  const hatY = y0 + h * p.hy;
  return (
    <g>
      <ellipse cx={x} cy={y - 1} rx={w * 0.42} ry={3.2 * s} fill="rgba(0,0,0,0.4)" />
      <g className={pop ? "gl-pop" : undefined} style={{ "--d": `${delay}s` } as CSSProperties}>
        <g className="gl-kid" data-m={mode} style={{ "--d": `${delay}s` } as CSSProperties}>
          <g className="gl-hop">
            <svg x={x0} y={y0} width={w} height={h} viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMax meet" style={{ "--tone": tone } as CSSProperties}>
              <use href={`/avatar/${p.view}.svg#a`} />
            </svg>
            {hat && (
              <g transform={`translate(${hatX.toFixed(1)} ${hatY.toFixed(1)}) scale(${s})`}>
                <path d="M-6 2 0 -13 6 2z" fill="var(--gl-a)" stroke="var(--gl-e)" strokeWidth="0.6" />
                <circle cx="0" cy="-13.4" r="2" fill="var(--gl-w)" />
              </g>
            )}
          </g>
        </g>
      </g>
    </g>
  );
}

function Sky() {
  const stars: [number, number, number][] = [
    [26, 30, 0], [70, 14, 1.1], [118, 40, 0.5], [206, 20, 1.7], [268, 38, 0.9], [296, 16, 0.3], [40, 96, 1.4], [292, 98, 0.7],
  ];
  return (
    <>
      <ellipse cx="160" cy="166" rx="146" ry="14" fill="var(--gl-d)" opacity="0.75" />
      <ellipse cx="160" cy="165" rx="146" ry="14" fill="none" stroke="var(--gl-a)" strokeOpacity="0.16" />
      {stars.map(([cx, cy, d], i) => (
        <circle key={i} className="gl-star" cx={cx} cy={cy} r="1.3" fill="#fff" style={{ "--d": `${d}s` } as CSSProperties} />
      ))}
    </>
  );
}

/** 2019: an office goes up and a flag is raised on it */
function Founded() {
  const win = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <Sky />
      <g className="gl-rise" style={{ "--d": "0.15s" } as CSSProperties}>
        <rect x="190" y="78" width="72" height="84" rx="5" fill="var(--gl-d)" stroke="var(--gl-a)" strokeOpacity="0.4" />
        <rect x="184" y="72" width="84" height="9" rx="3.5" fill="var(--gl-b)" />
        {win.map((k) => (
          <rect key={k} className="gl-win" x={200 + (k % 3) * 20} y={90 + Math.floor(k / 3) * 22} width="11" height="12" rx="2.5" fill="var(--gl-w)" style={{ "--d": `${0.9 + k * 0.22}s` } as CSSProperties} />
        ))}
        <rect x="216" y="138" width="20" height="24" rx="4" fill="var(--gl-e)" />
        <circle cx="231" cy="151" r="1.2" fill="var(--gl-w)" />
      </g>
      <g className="gl-flagpole" style={{ "--d": "0.9s" } as CSSProperties}>
        <path d="M226 72V34" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" />
        <path className="gl-flag" d="M227 35q13-7 26 0t0 14q-13 7-26 0z" fill="var(--gl-a)" />
        <circle cx="226" cy="33" r="2" fill="var(--gl-w)" />
      </g>
      <Kid x={118} y={162} s={1.3} tone={354} mode="wave" delay={0.1} />
      <g className="gl-grass" fill="var(--gl-g)" opacity="0.7">
        <path d="M74 162c1-7 3-10 5-12-.4 5 .4 8 1.4 12zM84 162c0-6 2-9 4-11 .2 4 .6 7 1 11z" />
        <path d="M156 162c1-6 3-9 5-11-.4 4 .2 7 1.2 11zM292 162c1-7 3-10 5-12-.4 5 .4 8 1.4 12z" />
      </g>
    </>
  );
}

/** 7 years: a birthday party */
function Years() {
  const candles = [0, 1, 2, 3, 4, 5, 6];
  const conf = [
    [58, 0.0, 0], [96, 0.6, 1], [140, 1.1, 2], [182, 0.3, 3], [224, 0.9, 4], [262, 0.2, 5], [118, 1.5, 6], [244, 1.3, 7], [76, 1.8, 8], [206, 1.7, 9],
  ];
  return (
    <>
      <Sky />
      {conf.map(([cx, d, k]) => (
        <rect key={k} className="gl-conf" x={cx} y="0" width="5" height="8" rx="1.5" fill={`hsl(calc(var(--th) + ${[354, 40, 76, 190, 300][k % 5]}) calc(85% * var(--ts)) 70%)`} style={{ "--d": `${d}s`, "--r": `${(k % 2 ? 1 : -1) * (40 + k * 12)}deg` } as CSSProperties} />
      ))}
      <g className="gl-rise" style={{ "--d": "0.1s" } as CSSProperties}>
        <rect x="108" y="126" width="104" height="36" rx="7" fill="var(--gl-b)" />
        <path d="M108 133q8 8 16 0t16 0 16 0 16 0 16 0 16 0 8 6V126q0-6-6-6H114q-6 0-6 6z" fill="var(--gl-a)" />
        <rect x="126" y="98" width="68" height="29" rx="6" fill="var(--gl-d)" stroke="var(--gl-a)" strokeOpacity="0.45" />
        <path d="M126 106q8 8 17 0t17 0 17 0 17 0v-4q0-4-5-4h-58q-5 0-5 4z" fill="var(--gl-w)" opacity="0.85" />
        <circle cx="160" cy="146" r="6" fill="var(--gl-w)" opacity="0.85" />
      </g>
      {candles.map((k) => {
        const cx = 135 + k * 8.4;
        return (
          <g key={k} className="gl-candle" style={{ "--d": `${0.8 + k * 0.1}s` } as CSSProperties}>
            <rect x={cx - 1.5} y="84" width="3" height="14" rx="1.2" fill="#fff" opacity="0.9" />
            <ellipse className="gl-flame" cx={cx} cy="80" rx="2.6" ry="4.4" fill="#ffd27a" style={{ "--d": `${k * 0.17}s` } as CSSProperties} />
          </g>
        );
      })}
      <Kid x={60} y={162} s={1.25} tone={20} mode="up" hat delay={0.2} />
      <Kid x={262} y={162} s={1.25} tone={200} mode="up" hat delay={0.55} />
    </>
  );
}

/** 11–50: a crowd of colleagues */
function Team() {
  const back: [number, number][] = [[62, 20], [122, 300], [198, 200], [258, 60]];
  const front: [number, number][] = [[92, 354], [160, 250], [228, 100]];
  return (
    <>
      <Sky />
      {back.map(([x, tone], i) => (
        <Kid key={`b${i}`} x={x} y={132} s={0.82} tone={tone} mode={i % 2 ? "wave" : "up"} pop delay={0.1 + i * 0.13} />
      ))}
      {front.map(([x, tone], i) => (
        <Kid key={`f${i}`} x={x} y={163} s={1.12} tone={tone} mode={i === 1 ? "up" : "wave"} pop delay={0.6 + i * 0.15} />
      ))}
    </>
  );
}

/** 2 offices: Surat and Germany, with a paper plane between them */
function Offices() {
  const arc = "M72 96Q160 4 248 90";
  return (
    <>
      <Sky />
      <path className="gl-arc" d={arc} fill="none" stroke="var(--gl-a)" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 7" />
      <g className="gl-rise" style={{ "--d": "0.1s" } as CSSProperties}>
        {/* the left one, with a dome */}
        <rect x="40" y="104" width="64" height="58" rx="4" fill="var(--gl-d)" stroke="var(--gl-a)" strokeOpacity="0.4" />
        <path d="M46 104a26 26 0 0 1 52 0z" fill="var(--gl-b)" />
        <rect x="70.6" y="72" width="2.8" height="8" fill="var(--gl-w)" />
        {[0, 1, 2].map((k) => (
          <rect key={k} className="gl-win" x={50 + k * 17} y="116" width="9" height="11" rx="2.5" fill="var(--gl-w)" style={{ "--d": `${0.8 + k * 0.25}s` } as CSSProperties} />
        ))}
        <rect x="64" y="140" width="16" height="22" rx="3.5" fill="var(--gl-e)" />
      </g>
      <g className="gl-rise" style={{ "--d": "0.35s" } as CSSProperties}>
        {/* the right one, with a pointed roof */}
        <rect x="216" y="94" width="64" height="68" rx="4" fill="var(--gl-d)" stroke="var(--gl-a)" strokeOpacity="0.4" />
        <path d="M210 96 248 66l38 30z" fill="var(--gl-b)" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} className="gl-win" x={225 + (k % 2) * 28} y={108 + Math.floor(k / 2) * 20} width="10" height="11" rx="2.5" fill="var(--gl-w)" style={{ "--d": `${1 + k * 0.22}s` } as CSSProperties} />
        ))}
        <rect x="240" y="140" width="16" height="22" rx="3.5" fill="var(--gl-e)" />
      </g>
      <g className="gl-pin" style={{ "--d": "1.2s" } as CSSProperties}>
        <path d="M72 62c-6 0-10 4-10 9 0 7 10 13 10 13s10-6 10-13c0-5-4-9-10-9z" fill="var(--gl-a)" />
        <text x="72" y="74" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--gl-e)">IN</text>
      </g>
      <g className="gl-pin" style={{ "--d": "1.45s" } as CSSProperties}>
        <path d="M248 36c-6 0-10 4-10 9 0 7 10 13 10 13s10-6 10-13c0-5-4-9-10-9z" fill="var(--gl-a)" />
        <text x="248" y="48" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--gl-e)">DE</text>
      </g>
      <g className="gl-plane">
        <path d="M-9 -4 9 0-9 4-5 0z" fill="#fff" />
        <path d="M-5 0 9 0-9 4z" fill="var(--gl-a)" opacity="0.75" />
        <animateMotion dur="4.4s" repeatCount="indefinite" path={arc} rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
      </g>
      <Kid x={128} y={162} s={1} tone={354} mode="wave" delay={0.2} />
      <Kid x={192} y={162} s={1} tone={40} mode="wave" delay={0.4} />
    </>
  );
}

const SCENES: (() => ReactNode)[] = [Founded, Years, Team, Offices];

export function GlanceCard({ index, value, label, className }: { index: number; value: string; label: string; className: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const inRef = useRef(false);
  const Scene = SCENES[index % SCENES.length];

  // the scene plays the moment the card is a little way in view (and stays in its end state afterwards)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.dataset.in = "true";
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting) && !inRef.current) {
          inRef.current = true;
          el.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the number counts up in step with the scene
  useEffect(() => {
    const el = rootRef.current;
    const v = valueRef.current;
    if (!el || !v || !/^\d+$/.test(value) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let stop = false;
    const mo = new MutationObserver(() => {
      if (el.dataset.in !== "true") return;
      mo.disconnect();
      const end = parseInt(value, 10);
      const from = end > 500 ? end - 24 : 0;
      const t0 = performance.now();
      const tick = (now: number) => {
        if (stop) return;
        const p = Math.min(1, (now - t0) / 1500);
        v.textContent = String(Math.round(from + (end - from) * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    mo.observe(el, { attributes: true, attributeFilter: ["data-in"] });
    return () => {
      stop = true;
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={rootRef} className={`gl ${className}`} data-in="false">
      <svg className="gl-svg" viewBox="0 0 320 190" role="img" aria-hidden="true">
        <Scene />
      </svg>
      <p ref={valueRef} className="text-vfade pb-2 text-[3.6rem] font-semibold leading-none tracking-[-0.05em] sm:text-[5.4rem] md:text-[6.6rem] lg:text-[4.6rem] xl:text-[5rem]">
        {value}
      </p>
      <p className="mt-2 text-base font-medium text-violet sm:text-2xl lg:text-xl">{label}</p>
    </div>
  );
}
