"use client";

import "@/styles/home-cele.css";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import { DIWALI_ITEM, type DiwaliKind } from "../home-diwali";

// THE HOME CELEBRATION (owner, 2026-11-06): the first day, HAPPY DHANTERAS. One click on the hero of the home page blurs the hero away and the whole
// window becomes one night scene (nothing else of the website is visible, the page is locked and no other piece of the website runs under it):
//   top      today's date and "Happy Dhanteras"
//   middle   the story of the day told in four pictures that follow each other (the churning of the ocean and Dhanvantari with the pot of amrit;
//            Maa Lakshmi and the coins; the lamp and the gold that stopped Yama; the diya at the door tonight), each with a short line
//   bottom   a house being decorated (a man on a ladder hangs lights), a woman making a rangoli, children with crackers and a man who lights rockets
//            that burst over the roofs, all on a floor that runs away in perspective
// Everything is plain SVG + CSS (no library, no canvas, no network); the scene is its own chunk that is fetched only after the click.
// Styles: src/styles/home-cele.css (prefix "hc-"). The next days (Kali Chaudas, Diwali, Bhai Bij ...) will be added here as more scenes.

const W = 1600;
const H = 900;
const stamp = () => Date.now();

const CHAPTERS = [
  { t: "The ocean of milk", p: "Gods and demons churned the ocean for amrit. On this day Lord Dhanvantari rose from the waves with the golden pot in his hands." },
  { t: "Maa Lakshmi comes home", p: "She visits the homes that are clean and bright. We buy gold, silver and new utensils to welcome her, and keep the door open for her." },
  { t: "The lamp that stopped Yama", p: "A prince was fated to die of a snake bite. His wife heaped her gold at the door and lit lamps all around. Dazzled by the light, Yama left." },
  { t: "Light a diya tonight", p: "So at dusk we light a diya at the door. It is called Yama Deepam. One small flame keeps the home safe all year." },
] as const;

const SKIN = "#c58a5c";
const SKIN2 = "#a8714a";
const HAIR = "#1d1420";

// a figure of the street (home-diwali.tsx) put on the floor: x / y in % of the stage (y = the feet), w = width in % of the stage width
function Fig({ kind, x, y, w }: { kind: DiwaliKind; x: number; y: number; w: number }) {
  const Item = DIWALI_ITEM[kind];
  return (
    <div className="hc-fig" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${w}cqw` } as CSSProperties}>
      <Item />
    </div>
  );
}

function Stars() {
  return (
    <g>
      {Array.from({ length: 80 }, (_, i) => (
        <circle key={i} className="hc-star" cx={(i * 379 + 83) % W} cy={(i * 211 + 40) % 560} r={0.8 + ((i * 7) % 5) * 0.35} style={{ "--d": `${(i * 0.37) % 4}s` } as CSSProperties} />
      ))}
    </g>
  );
}

function Skyline() {
  // far roofs and a temple spire, dark against the glow of the horizon
  return (
    <g className="hc-l1" fill="#1a0f2e">
      <path d="M0 780V690L60 690L60 650L120 650L120 700L200 700L200 660L240 640L280 660L280 710L360 710L360 670L420 670L420 720L520 720L520 690L580 690L580 740L700 740L700 700L760 700V780Z" />
      <path d="M900 780V720L960 720L960 690L1010 690L1010 730L1090 730L1090 700L1130 700V780Z" />
      <path d="M1580 780V700L1520 700L1520 660L1480 660V780Z" />
      <path d="M1230 780V640L1250 600L1262 560L1274 600L1294 640V780Z" opacity="0.55" />
    </g>
  );
}

// ---- the story ----
// a wavy surface: count waves of the given width, from x0, at height y, closed down to the bottom of the picture
const wave = (x0: number, w: number, count: number, y: number) => `M${x0} ${y}q${w / 2}-22 ${w} 0${`t${w} 0`.repeat(count - 1)}V560H${x0}Z`;

function Ocean() {
  return (
    <g className="hc-ch" style={{ "--cd": "0s" } as CSSProperties}>
      <defs>
        <radialGradient id="hc-mg">
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="hc-om" maskUnits="userSpaceOnUse" x="380" y="230" width="840" height="330">
          <rect x="380" y="230" width="840" height="330" fill="url(#hc-mg)" />
        </mask>
        <radialGradient id="hc-halo">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#f59e0b" stopOpacity="0.28" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g mask="url(#hc-om)">
        <circle cx="800" cy="360" r="170" fill="url(#hc-halo)" className="hc-pulse" />
        <g className="hc-rise">
          {/* Dhanvantari: blue-green skin, a crown, the golden pot of amrit in the raised hand */}
          <path d="M768 470Q770 392 800 388Q830 392 832 470Z" fill="#fbbf24" />
          <path d="M772 396Q800 380 828 396L834 440Q800 450 766 440Z" fill="#5aa6c8" />
          <path d="M772 402Q745 380 728 336" stroke="#5aa6c8" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M828 402Q858 400 874 372" stroke="#5aa6c8" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="800" cy="364" r="22" fill="#5aa6c8" />
          <path d="M780 352L786 330L794 346L800 326L806 346L814 330L820 352Z" fill="#fbbf24" />
          <circle cx="793" cy="366" r="2" fill={HAIR} />
          <circle cx="807" cy="366" r="2" fill={HAIR} />
          <path d="M794 374Q800 379 806 374" stroke={HAIR} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M728 336m-16 0a16 16 0 0132 0v14q0 16-16 16t-16-16z" fill="#f59e0b" />
          <rect x="722" y="312" width="12" height="9" rx="2" fill="#b45309" />
          <ellipse cx="874" cy="366" rx="13" ry="8" fill="#fef3c7" />
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} className="hc-amrit" cx={716 + i * 7} cy="318" r="2.6" fill="#fde68a" style={{ "--d": `${i * 0.45}s` } as CSSProperties} />
        ))}
        <g className="hc-wave hc-w1">
          <path d={wave(300, 60, 18, 470)} fill="#2b5fa8" opacity="0.85" />
        </g>
        <g className="hc-wave hc-w2">
          <path d={wave(260, 70, 16, 500)} fill="#1e3f7e" />
        </g>
      </g>
    </g>
  );
}

function Lakshmi() {
  const petals = Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx="800" cy="452" rx="20" ry="52" fill={i % 2 ? "#fb7185" : "#f9a8d4"} transform={`rotate(${-80 + i * 20} 800 500)`} opacity="0.96" />);
  return (
    <g className="hc-ch" style={{ "--cd": "9s" } as CSSProperties}>
      <circle cx="800" cy="370" r="170" fill="url(#hc-halo)" className="hc-pulse" />
      {petals}
      <g className="hc-rise">
        <path d="M770 470Q772 400 800 396Q828 400 830 470Z" fill="#dc2626" />
        <path d="M776 404Q800 392 824 404L828 440Q800 448 772 440Z" fill="#b91c1c" />
        <path d="M776 412Q750 428 738 452" stroke={SKIN} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M824 412Q850 428 862 452" stroke={SKIN} strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="800" cy="376" r="20" fill={SKIN} />
        <path d="M780 374Q780 354 800 354Q820 354 820 374Q812 362 800 364Q788 362 780 374Z" fill={HAIR} />
        <path d="M782 352L790 338L800 346L810 338L818 352Z" fill="#fbbf24" />
        <circle cx="800" cy="370" r="2" fill="#dc2626" />
      </g>
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} className="hc-coin" style={{ "--d": `${i * 0.28}s`, "--x": `${(i % 6) * 22 - 55}px` } as CSSProperties}>
          <circle cx={i < 6 ? 738 : 862} cy="455" r="9" fill="#fbbf24" />
          <circle cx={i < 6 ? 738 : 862} cy="455" r="5.4" fill="none" stroke="#b45309" strokeWidth="1.2" />
        </g>
      ))}
      <path d="M738 520q62 28 124 0l-10 30q-52 16-104 0z" fill="#f59e0b" />
    </g>
  );
}

function Yama() {
  return (
    <g className="hc-ch" style={{ "--cd": "18s" } as CSSProperties}>
      <circle cx="800" cy="400" r="190" fill="url(#hc-halo)" className="hc-pulse" />
      {/* the doorway, lit from inside */}
      <path d="M740 540V420Q740 350 800 350Q860 350 860 420V540Z" fill="#fef3c7" opacity="0.95" />
      <path d="M728 540V420Q728 338 800 338Q872 338 872 420V540" fill="none" stroke="#b45309" strokeWidth="12" />
      {/* the gold heaped at the door */}
      {Array.from({ length: 18 }, (_, i) => (
        <circle key={i} className="hc-gold" cx={730 + (i % 9) * 17 + (i > 8 ? 8 : 0)} cy={532 - (i > 8 ? 14 : 0)} r="9" fill={i % 3 ? "#fbbf24" : "#fde047"} stroke="#b45309" strokeWidth="1.2" style={{ "--d": `${(i % 6) * 0.3}s` } as CSSProperties} />
      ))}
      {[640, 690, 910, 960].map((x, i) => (
        <g key={x} transform={`translate(${x} 532)`}>
          <path d="M-14 0Q0 11 14 0Z" fill="#c2410c" />
          <path className="hc-fl" d="M0-2Q-7-12 0-22Q7-12 0-2Z" fill="#fde047" style={{ "--d": `${i * 0.2}s` } as CSSProperties} />
        </g>
      ))}
      {/* the wife singing and the prince, small in the light */}
      <circle cx="782" cy="470" r="9" fill={SKIN} />
      <path d="M770 520Q772 486 782 484Q792 486 794 520Z" fill="#dc2626" />
      <circle cx="818" cy="474" r="9" fill={SKIN2} />
      <path d="M806 520Q808 490 818 488Q828 490 830 520Z" fill="#15803d" />
      {[0, 1, 2].map((i) => (
        <text key={i} className="hc-note" x={850 + i * 16} y="430" fontSize="22" fill="#b45309" style={{ "--d": `${i * 0.8}s` } as CSSProperties}>
          ♪
        </text>
      ))}
      {/* Yama as a snake: comes in from the left, is dazzled and slides away */}
      <g className="hc-snake">
        <path d="M430 552q24-26 48 0t48 0t48 0t44-10" stroke="#3f6212" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M430 552q24-26 48 0t48 0t48 0t44-10" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="2 14" />
        <circle cx="622" cy="540" r="11" fill="#3f6212" />
        <circle cx="626" cy="536" r="2.6" fill="#fde047" />
      </g>
    </g>
  );
}

function Diyas() {
  return (
    <g className="hc-ch" style={{ "--cd": "27s" } as CSSProperties}>
      <path d="M540 520Q540 400 800 380Q1060 400 1060 520Z" fill="#7c2d12" opacity="0.25" />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i} transform={`translate(${560 + i * 80} 500)`}>
          <circle className="hc-glow" r="46" cy="-12" fill="url(#hc-halo)" style={{ "--d": `${i * 0.55}s` } as CSSProperties} />
          <path d="M-22 0Q0 22 22 0Z" fill="#c2410c" />
          <path d="M-22 0Q0 10 22 0" stroke="#fdba74" strokeWidth="1.6" fill="none" />
          <path className="hc-flame" d="M0-3Q-10-18 0-36Q10-18 0-3Z" fill="#fde047" style={{ "--d": `${i * 0.55}s` } as CSSProperties} />
          <path className="hc-flame" d="M0-4Q-5-14 0-24Q5-14 0-4Z" fill="#f97316" style={{ "--d": `${i * 0.55}s` } as CSSProperties} />
        </g>
      ))}
    </g>
  );
}

// ---- the house that is being decorated, and the people of the floor ----
function House() {
  const bulbs = Array.from({ length: 14 }, (_, i) => <circle key={i} className="hc-bulb" cx={1262 + i * 22} cy={455 + Math.sin(i / 2.2) * 5} r="4.6" style={{ "--d": `${(i % 5) * 0.4}s`, "--c": ["#fde047", "#fb923c", "#f87171", "#a3e635"][i % 4] } as CSSProperties} />);
  return (
    <g className="hc-l3">
      <rect x="1240" y="470" width="340" height="310" fill="#4a1d3a" />
      <rect x="1240" y="470" width="340" height="14" fill="#fbbf24" opacity="0.8" />
      <rect x="1226" y="452" width="368" height="24" rx="4" fill="#6b2a4a" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(${1250 + i * 46} 452)`}>
          <path d="M-9 0Q0 9 9 0Z" fill="#c2410c" />
          <path className="hc-fl" d="M0-2Q-5-9 0-16Q5-9 0-2Z" fill="#fde047" style={{ "--d": `${i * 0.23}s` } as CSSProperties} />
        </g>
      ))}
      {[1300, 1480].map((x) => (
        <g key={x}>
          <rect x={x - 34} y="530" width="68" height="84" rx="4" fill="#fde68a" className="hc-win" />
          <path d={`M${x} 530V614M${x - 34} 572H${x + 34}`} stroke="#7c2d12" strokeWidth="4" />
          <rect x={x - 38} y="526" width="76" height="92" rx="6" fill="none" stroke="#fbbf24" strokeWidth="5" />
        </g>
      ))}
      {/* the door with a toran of marigolds over it */}
      <path d="M1368 780V690Q1368 650 1410 650Q1452 650 1452 690V780Z" fill="#2a0f24" />
      <path d="M1368 780V690Q1368 650 1410 650Q1452 650 1452 690V780" fill="none" stroke="#fbbf24" strokeWidth="5" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <circle cx={1366 + i * 11.5} cy={656 + Math.sin((i / 8) * Math.PI) * 10} r="6" fill={i % 2 ? "#f97316" : "#fbbf24"} />
          <path d={`M${1366 + i * 11.5} ${660 + Math.sin((i / 8) * Math.PI) * 10}v14`} stroke="#16a34a" strokeWidth="2.4" />
        </g>
      ))}
      <path d="M1340 782h14M1466 782h14" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
      {bulbs}
    </g>
  );
}

function Ladder() {
  return (
    <g>
      <path d="M1176 782L1218 470M1206 782L1248 470" stroke="#8b5a2b" strokeWidth="6" strokeLinecap="round" />
      {Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        const y = 782 - t * 312;
        const x = 1176 + t * 42;
        return <path key={i} d={`M${x} ${y}H${x + 30}`} stroke="#a16207" strokeWidth="5" strokeLinecap="round" />;
      })}
      {/* the man on the ladder, hanging a string of lights (his arm swings up and down) */}
      <g transform="translate(1214 540)">
        <rect x="-8" y="52" width="6" height="26" rx="2" fill="#f5f0e6" transform="rotate(-6)" />
        <rect x="2" y="52" width="6" height="26" rx="2" fill="#f5f0e6" transform="rotate(8)" />
        <path d="M-15 8Q0 0 15 8L18 58H-18Z" fill="#ea580c" />
        <path d="M0 8V58" stroke="#fde68a" strokeWidth="1.4" opacity="0.8" />
        <g className="hc-arm">
          <path d="M12 12L30 -14" stroke={SKIN2} strokeWidth="6" strokeLinecap="round" />
          <path d="M30 -14Q54 -6 70 -22Q86 -8 100 -20" stroke="#3b2f2a" strokeWidth="1.8" fill="none" />
          {[44, 62, 80, 98].map((x, i) => (
            <circle key={x} className="hc-bulb" cx={x} cy={[-8, -20, -12, -20][i]} r="4" style={{ "--d": `${i * 0.3}s`, "--c": ["#fde047", "#fb923c", "#f87171", "#a3e635"][i] } as CSSProperties} />
          ))}
        </g>
        <path d="M-12 14L-24 28" stroke={SKIN2} strokeWidth="6" strokeLinecap="round" />
        <circle cx="0" cy="-8" r="13" fill={SKIN2} />
        <path d="M-13-9Q-13-22 0-21Q13-22 13-9Q8-15 0-14Q-8-15-13-9Z" fill={HAIR} />
        <circle cx="-4" cy="-7" r="1.4" fill={HAIR} />
        <circle cx="4" cy="-7" r="1.4" fill={HAIR} />
        <path d="M-4 0Q0 4 4 0" stroke={HAIR} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Floor() {
  const lines = Array.from({ length: 17 }, (_, i) => -900 + i * 220);
  return (
    <g>
      <defs>
        <linearGradient id="hc-fl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1830" />
          <stop offset="1" stopColor="#12081a" />
        </linearGradient>
        <clipPath id="hc-flc">
          <rect x="0" y="780" width={W} height="120" />
        </clipPath>
      </defs>
      <rect x="0" y="780" width={W} height="120" fill="url(#hc-fl)" />
      <g clipPath="url(#hc-flc)" stroke="#fbbf24" strokeOpacity="0.1" strokeWidth="1.4">
        {lines.map((x) => (
          <path key={x} d={`M800 720L${x} 900`} />
        ))}
        {[792, 806, 826, 856].map((y) => (
          <path key={y} d={`M0 ${y}H${W}`} />
        ))}
      </g>
      <rect x="0" y="778" width={W} height="4" fill="#fbbf24" opacity="0.22" />
    </g>
  );
}

function RangoliFloor() {
  const petals = (n: number, r: number, rx: number, ry: number, c: string, at: number) =>
    Array.from({ length: n }, (_, i) => (
      <g key={`${r}-${i}`} transform={`rotate(${(360 / n) * i})`}>
        <ellipse className="hc-pop" cx="0" cy={-r} rx={rx} ry={ry} fill={c} style={{ "--d": `${at + i * 0.18}s` } as CSSProperties} />
      </g>
    ));
  return (
    <g transform="translate(760 836) scale(1 0.26)">
      {[190, 150, 110].map((r, i) => (
        <circle key={r} className="hc-draw" pathLength={1} r={r} fill="none" stroke={["#fde68a", "#f97316", "#fbbf24"][i]} strokeWidth="5" strokeDasharray="1" style={{ "--d": `${i * 1.4}s` } as CSSProperties} />
      ))}
      {petals(16, 150, 16, 34, "#f97316", 3)}
      {petals(12, 100, 14, 28, "#facc15", 6)}
      {petals(8, 56, 12, 22, "#dc2626", 8.5)}
      <circle className="hc-pop" r="20" fill="#16a34a" style={{ "--d": "10s" } as CSSProperties} />
      <circle className="hc-pop" r="11" fill="#fef3c7" style={{ "--d": "10.4s" } as CSSProperties} />
    </g>
  );
}

function RangoliMaker() {
  return (
    <g transform="translate(935 845)">
      <ellipse cx="0" cy="2" rx="46" ry="7" fill="#000" opacity="0.28" />
      <path d="M-30 -8Q-34 -50 -8 -78L18 -66Q10 -44 6 -8Z" fill="#b91c1c" />
      <path d="M-34 -4H10" stroke="#fbbf24" strokeWidth="3.4" />
      <path d="M-26 -22Q-40 -10 -44 -4" stroke="#7c1d1d" strokeWidth="7" strokeLinecap="round" fill="none" />
      <g className="hc-pour">
        <path d="M2 -66Q-22 -50 -50 -22" stroke={SKIN2} strokeWidth="6" strokeLinecap="round" fill="none" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} className="hc-dust" cx="-52" cy="-20" r="2.4" fill={["#f97316", "#facc15", "#dc2626", "#16a34a"][i]} style={{ "--d": `${i * 0.25}s` } as CSSProperties} />
        ))}
      </g>
      <circle cx="0" cy="-86" r="13" fill={SKIN2} />
      <path d="M-13 -88Q-13 -102 0 -101Q13 -102 13 -88Q8 -95 0 -94Q-8 -95 -13 -88Z" fill={HAIR} />
      <circle cx="9" cy="-100" r="6" fill={HAIR} />
      <circle cx="-4" cy="-86" r="1.3" fill={HAIR} />
      <circle cx="4" cy="-86" r="1.3" fill={HAIR} />
      <circle cx="0" cy="-92" r="1.3" fill="#dc2626" />
    </g>
  );
}

function RocketMan() {
  const rk = (x: number, top: number, delay: number, color: string) => (
    <g key={x}>
      <g className="hc-rk" style={{ "--h": `${top - 800}px`, "--d": `${delay}s` } as CSSProperties}>
        <path d={`M${x} 800v-26l6 8v18z`} fill="#dc2626" />
        <path d={`M${x - 6} 800v-26l6-12l6 12v26z`} fill="#fde68a" />
        <path d={`M${x} 806q-5 22 0 40q5-18 0-40z`} fill="#fb923c" opacity="0.9" />
      </g>
      <g className="hc-bu" style={{ "--d": `${delay}s` } as CSSProperties}>
        <g transform={`translate(${x + (x < 300 ? 60 : -40)} ${top})`}>
          <g className="hc-bu-i" style={{ "--d": `${delay}s` } as CSSProperties}>
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M0 -20V-64" stroke={color} strokeWidth="4" strokeLinecap="round" transform={`rotate(${(360 / 16) * i})`} />
            ))}
            {Array.from({ length: 16 }, (_, i) => (
              <circle key={i} cx="0" cy="-78" r="3" fill="#fff" transform={`rotate(${(360 / 16) * i + 11})`} />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
  return (
    <g>
      {rk(262, 250, 0, "#fde047")}
      {rk(250, 330, 3.2, "#f87171")}
      {rk(1040, 300, 1.6, "#a3e635")}
      <g transform="translate(150 850)">
        <ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity="0.28" />
        <rect x="-14" y="-40" width="9" height="40" rx="3" fill="#f5f0e6" />
        <rect x="-2" y="-40" width="9" height="40" rx="3" fill="#f5f0e6" />
        <path d="M-22 -92Q-2 -104 18 -92L22 -38H-26Z" fill="#0ea5e9" />
        <path d="M-2 -94V-40" stroke="#e0f2fe" strokeWidth="1.6" opacity="0.8" />
        <path d="M14 -84L50 -60" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
        <path d="M50 -60L92 -62" stroke="#6b5e52" strokeWidth="2.2" strokeLinecap="round" />
        <circle className="hc-ember" cx="93" cy="-62" r="3" fill="#fde047" />
        <path d="M-18 -84L-26 -60" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-2" cy="-112" r="15" fill={SKIN} />
        <path d="M-17 -113Q-17 -128 -2 -127Q13 -128 13 -113Q8 -120 -2 -119Q-12 -120 -17 -113Z" fill={HAIR} />
        <circle cx="-7" cy="-111" r="1.5" fill={HAIR} />
        <circle cx="3" cy="-111" r="1.5" fill={HAIR} />
        <path d="M-6 -104Q-2 -100 2 -104" stroke={HAIR} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function HomeCele({ onClose }: { onClose: () => void }) {
  const [date] = useState(() => new Date(stamp()).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);

  const done = useRef(false);
  const close = useRef(() => {});
  useEffect(() => {
    close.current = () => {
      if (done.current) return;
      done.current = true;
      setLeaving(true);
      timer.current = window.setTimeout(onClose, 650);
    };
  }, [onClose]);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      window.clearTimeout(timer.current);
    };
  }, []);

  // the far layers follow the mouse a little (the near ones more): a feeling of depth
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el || e.pointerType !== "mouse") return;
    el.style.setProperty("--px", String((e.clientX / window.innerWidth - 0.5) * 2));
    el.style.setProperty("--py", String((e.clientY / window.innerHeight - 0.5) * 2));
  };

  return createPortal(
    <div ref={rootRef} className="hc-root" data-leaving={leaving} role="dialog" aria-modal="true" aria-label="Happy Dhanteras" onPointerMove={onMove}>
      <div className="hc-veil" aria-hidden />
      <div className="hc-stage">
        <svg className="hc-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="hc-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a0820" />
              <stop offset="0.5" stopColor="#2a1240" />
              <stop offset="0.82" stopColor="#7a2a3e" />
              <stop offset="1" stopColor="#c2622a" />
            </linearGradient>
            <radialGradient id="hc-moon">
              <stop offset="0" stopColor="#fff7d6" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff7d6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#hc-sky)" />
          <g className="hc-l0">
            <Stars />
            <circle cx="1430" cy="150" r="110" fill="url(#hc-moon)" />
            <circle cx="1430" cy="150" r="38" fill="#fff4cf" />
            <circle cx="1418" cy="140" r="8" fill="#f1e2ad" opacity="0.7" />
          </g>
          <Skyline />
          <Ocean />
          <Lakshmi />
          <Yama />
          <Diyas />
          <House />
          <Floor />
          <RangoliFloor />
          <Ladder />
          <RocketMan />
          <RangoliMaker />
        </svg>
        {/* the people of the street (home-diwali.tsx) on the floor */}
        <Fig kind="couple" x={372} y={850} w={8.4} />
        <Fig kind="chakri" x={546} y={846} w={6.6} />
        <Fig kind="anar" x={1050} y={858} w={7.6} />
        <Fig kind="sparkler" x={1126} y={850} w={5.2} />
        <Fig kind="lady" x={1428} y={846} w={5.6} />
      </div>

      <header className="hc-top">
        <p className="hc-date">{date}</p>
        <h2 className="hc-title">
          Happy <span>Dhanteras</span>
        </h2>
      </header>

      <div className="hc-caps" aria-live="off">
        {CHAPTERS.map((c, i) => (
          <p key={c.t} className="hc-cap" style={{ "--cd": `${i * 9}s` } as CSSProperties}>
            <b>{c.t}</b>
            <span>{c.p}</span>
          </p>
        ))}
      </div>

      <button ref={closeRef} type="button" className="hc-close" onClick={() => close.current()}>
        <span aria-hidden>×</span> Back to the website
      </button>
    </div>,
    document.body,
  );
}
