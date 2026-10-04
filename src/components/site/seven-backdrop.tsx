"use client";

import { useEffect, useRef } from "react";
import { clamp } from "./anim-utils";

// Page background: a giant "7W" monogram. A very thick glowing "7" runs along the top and its stem drops to the
// bottom-left; right where the bar and the stem meet there is a round junction node (rings, ticks, crosshair) and from
// that node a bold "W" continues to the right, so the 7 and the W read as one connected mark.
// Style: thick tubes with a double border, a soft violet glow inside, a blueprint frame, fine dots, grain and thin
// lights that keep flowing along the strokes. Pure SVG/CSS; it fades down after the first screen.

const T7 = 250; // thickness of the 7
const TW = 175; // thickness of the W
const NODE = { x: 650, y: 290 };
const P7 = `M20 ${NODE.y}H${NODE.x}L340 880`; // top bar, then the stem down-left
const PW = `M${NODE.x} ${NODE.y}L870 810L1070 450L1270 810L1470 ${NODE.y}`; // the W, starting at the node

function Tube({ id, t }: { id: string; t: number }) {
  return (
    <>
      <use href={`#${id}`} stroke="#8a3cf0" strokeWidth={t + 110} opacity=".3" filter="url(#mono-blur-xl)" />
      <use href={`#${id}`} stroke="rgba(211,135,255,0.62)" strokeWidth={t + 14} />
      <use href={`#${id}`} stroke="#0f0419" strokeWidth={t} />
      <use href={`#${id}`} stroke="rgba(255,255,255,0.17)" strokeWidth={t - 26} />
      <use href={`#${id}`} stroke="#12051f" strokeWidth={t - 30} />
      <g mask={`url(#mask-${id})`}>
        <use href={`#${id}`} stroke="url(#mono-glow)" strokeWidth={t - 44} filter="url(#mono-blur-md)" opacity=".9" />
        <use href={`#${id}`} stroke="#e3b6ff" strokeWidth="28" filter="url(#mono-blur-md)" opacity=".32" />
      </g>
      <use href={`#${id}`} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
    </>
  );
}

export function SevenBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  // fade the backdrop down while scrolling past the first screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.opacity = String(0.95 - 0.72 * clamp(window.scrollY / (window.innerHeight * 0.9)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const svgProps = { viewBox: "0 0 1600 1000", preserveAspectRatio: "xMidYMid slice", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", className: "absolute inset-0 size-full" } as const;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      <div className="animate-drift absolute inset-0">
        {/* the monogram (static: blurs are expensive to redraw, so nothing inside this layer animates) */}
        <svg {...svgProps}>
          <defs>
            <path id="p7" d={P7} />
            <path id="pw" d={PW} />
            <filter id="mono-blur-xl" filterUnits="userSpaceOnUse" x="-600" y="-600" width="2800" height="2200">
              <feGaussianBlur stdDeviation="64" />
            </filter>
            <filter id="mono-blur-md" filterUnits="userSpaceOnUse" x="-600" y="-600" width="2800" height="2200">
              <feGaussianBlur stdDeviation="28" />
            </filter>
            <linearGradient id="mono-glow" gradientUnits="userSpaceOnUse" x1="0" y1="250" x2="1600" y2="850">
              <stop offset="0" stopColor="#4f1fa8" />
              <stop offset="0.35" stopColor="#8a44e6" />
              <stop offset="0.7" stopColor="#6a2fd0" />
              <stop offset="1" stopColor="#2a0e58" />
            </linearGradient>
            <radialGradient id="node-core" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#f6e6ff" />
              <stop offset="0.35" stopColor="#c58bff" />
              <stop offset="1" stopColor="#5a24b8" />
            </radialGradient>
            <mask id="mask-p7" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000">
              <use href="#p7" stroke="#fff" strokeWidth={T7 - 34} />
            </mask>
            <mask id="mask-pw" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000">
              <use href="#pw" stroke="#fff" strokeWidth={TW - 34} />
            </mask>
          </defs>

          <Tube id="p7" t={T7} />
          <Tube id="pw" t={TW} />

          {/* junction node where the 7 turns into the W */}
          <g transform={`translate(${NODE.x} ${NODE.y})`}>
            <circle r="230" fill="#8a3cf0" opacity=".28" filter="url(#mono-blur-xl)" />
            <circle r="182" fill="#0f0419" stroke="rgba(211,135,255,0.65)" strokeWidth="4" />
            <circle r="168" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            <circle r="140" stroke="rgba(211,135,255,0.55)" strokeWidth="10" strokeDasharray="2 17" />
            <circle r="108" fill="#12051f" stroke="rgba(211,135,255,0.7)" strokeWidth="3" />
            <circle r="78" fill="url(#mono-glow)" opacity=".9" />
            <circle r="52" fill="url(#node-core)" />
            <circle r="52" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <circle r="14" fill="#fff" />
          </g>
        </svg>

        {/* thin lights flowing along the strokes and through the node (light layer: no blur, cheap to animate) */}
        <svg {...svgProps}>
          <use href="#p7" stroke="#f1d8ff" strokeWidth="3" strokeDasharray="3 60 140 60" className="flow-line" opacity=".9" />
          <use href="#pw" stroke="#f1d8ff" strokeWidth="3" strokeDasharray="3 60 140 60" className="flow-line flow-line-slow" opacity=".9" />
          <path d={`M0 ${NODE.y}H1600M${NODE.x} 0V1000`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {[-300, 300].map((d) => (
            <rect key={d} x={NODE.x + d - 4} y={NODE.y - 4} width="8" height="8" fill="rgba(255,255,255,0.4)" />
          ))}
          {[-300, 300].map((d) => (
            <rect key={"v" + d} x={NODE.x - 4} y={NODE.y + d - 4} width="8" height="8" fill="rgba(255,255,255,0.4)" />
          ))}
        </svg>
      </div>

      {/* breathing glow */}
      <div className="animate-glow absolute left-1/2 top-1/2 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(150,70,230,0.26),transparent)]" />

      {/* blueprint frame, centre line and corner squares */}
      <div className="absolute inset-x-[7%] inset-y-[9%] border border-white/[0.1]" />
      <div className="absolute inset-y-[9%] left-1/2 w-px bg-white/[0.07]" />
      <span className="absolute left-[7%] top-[9%] size-[7px] -translate-x-1/2 -translate-y-1/2 bg-white/30" />
      <span className="absolute right-[7%] top-[9%] size-[7px] translate-x-1/2 -translate-y-1/2 bg-white/30" />
      <span className="absolute bottom-[9%] left-[7%] size-[7px] -translate-x-1/2 translate-y-1/2 bg-white/30" />
      <span className="absolute bottom-[9%] right-[7%] size-[7px] translate-x-1/2 translate-y-1/2 bg-white/30" />

      {/* thin shimmering lines (like the sparkle lines of the template) */}
      <span className="shimmer-line absolute left-[7%] top-0 h-40 w-[2px]" />
      <span className="shimmer-line shimmer-slow absolute right-[7%] top-0 h-56 w-[2px]" />
      <span className="shimmer-line shimmer-late absolute left-[17%] top-0 h-24 w-[2px]" />

      {/* fine dots + film grain + dark edges */}
      <div className="bg-dots absolute inset-0 opacity-60" />
      <div className="bg-grain absolute inset-0 opacity-[0.1] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(8,2,14,0.85))]" />
    </div>
  );
}
