import "@/styles/diwali.css";
import type { CSSProperties } from "react";

// DIWALI on the little street of the home page (home-street.tsx): people celebrating on the street (a boy with a sparkler, a woman with a
// thali of diyas, a child covering the ears in front of an anar, a couple with sparklers, a chakri spinning), a rangoli at every service stop,
// string lights (toran) from lamp to lamp, small diyas along the kerb and fireworks in the sky above the street. Flat inline SVG like the rest
// of the street; every movement is CSS (transform / opacity), styles in src/styles/diwali.css ("dw-"). It is shown only while Diwali is on for
// the home page in Admin > Fest (html[data-fest="diwali"]); otherwise the street keeps its trees, benches and flowers.

const SKIN = "#c58a5c";
const SKIN2 = "#a8714a";
const HAIR = "#1d1420";
const DARK = "#2a2232";

/** sparks around a point (the tip of a sparkler, the mouth of an anar): place them with left / top in % of the drawing */
function Sparks({ x, y, kind = "star" }: { x: number; y: number; kind?: "star" | "fountain" | "wheel" }) {
  return (
    <span className={`dw-sparks is-${kind}`} style={{ left: `${x}%`, top: `${y}%` } as CSSProperties}>
      {Array.from({ length: kind === "fountain" ? 12 : 8 }, (_, i) => (
        <i key={i} style={{ "--k": i } as CSSProperties} />
      ))}
    </span>
  );
}

/** a boy in a saffron kurta holding a sparkler (phuljhadi) */
function SparklerKid() {
  return (
    <span className="dw-fig">
      <svg viewBox="0 0 44 72" width="44" height="72" aria-hidden>
        <rect x="16" y="52" width="4.5" height="18" rx="2" fill={DARK} />
        <rect x="22" y="52" width="4.5" height="18" rx="2" fill={DARK} />
        <path d="M12 32Q21 27 30 32L32 56H10Z" fill="#f59e0b" />
        <path d="M21 31V55" stroke="#fde68a" strokeWidth="1.2" opacity="0.8" />
        <path d="M13 36L9 48" stroke={SKIN} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M29 35L36 27" stroke={SKIN} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M36 27L40 12" stroke="#6b5e52" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="21" cy="22" r="7.5" fill={SKIN} />
        <path d="M13.5 21Q14 13 21 13.5Q28.5 13 28.5 21Q25 16.5 21 17Q16.5 17 13.5 21Z" fill={HAIR} />
        <circle cx="18.5" cy="22.5" r="0.9" fill={HAIR} />
        <circle cx="23.5" cy="22.5" r="0.9" fill={HAIR} />
        <path d="M18.5 26Q21 28 23.5 26" stroke={HAIR} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </svg>
      <Sparks x={91} y={16} />
    </span>
  );
}

/** a woman in a red saree carrying a thali with diyas */
function DiyaLady() {
  return (
    <span className="dw-fig">
      <svg viewBox="0 0 48 82" width="48" height="82" aria-hidden>
        <path d="M14 38Q24 33 34 38L38 80H10Z" fill="#b91c1c" />
        <path d="M10 78H38" stroke="#fbbf24" strokeWidth="2.4" />
        <path d="M30 37Q36 50 33 66" stroke="#fbbf24" strokeWidth="1.6" fill="none" />
        <path d="M27 36Q35 44 37 60L31 62Q30 48 26 40Z" fill="#dc2626" />
        <path d="M15 42Q17 47 21 47" stroke={SKIN2} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M33 42Q31 47 27 47" stroke={SKIN2} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        {/* the thali */}
        <ellipse cx="24" cy="47" rx="10" ry="2.6" fill="#d4a017" />
        <ellipse cx="24" cy="46.3" rx="8.5" ry="1.8" fill="#fcd34d" />
        <path d="M19 45.5Q20.5 47 22 45.5Z" fill="#b45309" />
        <path d="M26 45.5Q27.5 47 29 45.5Z" fill="#b45309" />
        <circle cx="24" cy="27" r="7.5" fill={SKIN2} />
        <path d="M16.5 26Q17 18 24 18.5Q31.5 18 31.5 26Q28 21.5 24 22Q19.5 22 16.5 26Z" fill={HAIR} />
        <circle cx="30.5" cy="20" r="3.6" fill={HAIR} />
        <circle cx="24" cy="24" r="0.9" fill="#dc2626" />
        <circle cx="21.5" cy="27.5" r="0.8" fill={HAIR} />
        <circle cx="26.5" cy="27.5" r="0.8" fill={HAIR} />
        <path d="M22 30.5Q24 32 26 30.5" stroke={HAIR} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </svg>
      <i className="dw-flame is-sm" style={{ left: "42%", top: "52%" } as CSSProperties} />
      <i className="dw-flame is-sm" style={{ left: "57%", top: "52%" } as CSSProperties} />
    </span>
  );
}

/** an anar (flower pot) shooting a fountain of sparks, and a little girl covering her ears */
function Anar() {
  return (
    <span className="dw-fig is-wide">
      <svg viewBox="0 0 70 64" width="70" height="64" aria-hidden>
        {/* the girl */}
        <rect x="48" y="48" width="4" height="14" rx="2" fill={DARK} />
        <rect x="54" y="48" width="4" height="14" rx="2" fill={DARK} />
        <path d="M45 30Q53 26 61 30L63 52H43Z" fill="#16a34a" />
        <path d="M44 52H62" stroke="#fde047" strokeWidth="2" />
        <path d="M46 31Q43 24 46 20" stroke={SKIN} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M60 31Q63 24 60 20" stroke={SKIN} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <circle cx="53" cy="21" r="6.8" fill={SKIN} />
        <path d="M46 21Q46 13 53 13.5Q60 13 60 21Q57 16.5 53 17Q49 16.5 46 21Z" fill={HAIR} />
        <path d="M50 23Q51 22 52 23M54 23Q55 22 56 23" stroke={HAIR} strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <circle cx="53" cy="26" r="1.2" fill={HAIR} />
        {/* the anar */}
        <path d="M14 62L19 44H23L28 62Z" fill="#dc2626" />
        <path d="M16 56H26M17.5 50H24.5" stroke="#fde68a" strokeWidth="1.2" />
        <rect x="18.5" y="42" width="5" height="3" rx="1" fill="#7c2d12" />
      </svg>
      <Sparks x={30} y={64} kind="fountain" />
    </span>
  );
}

/** a couple waving sparklers */
function Couple() {
  return (
    <span className="dw-fig is-wide">
      <svg viewBox="0 0 76 82" width="76" height="82" aria-hidden>
        {/* the man in a green kurta */}
        <rect x="14" y="58" width="5" height="22" rx="2" fill="#f5f0e6" />
        <rect x="21" y="58" width="5" height="22" rx="2" fill="#f5f0e6" />
        <path d="M9 34Q20 28 31 34L33 62H7Z" fill="#15803d" />
        <path d="M20 33V60" stroke="#fde68a" strokeWidth="1.2" opacity="0.8" />
        <path d="M10 38L4 22" stroke={SKIN2} strokeWidth="3.6" strokeLinecap="round" />
        <path d="M4 22L2 8" stroke="#6b5e52" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M30 38L34 50" stroke={SKIN2} strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="20" cy="23" r="8" fill={SKIN2} />
        <path d="M12 22Q12 14 20 14.5Q28 14 28 22Q25 17 20 17.5Q15 17 12 22Z" fill={HAIR} />
        <path d="M17 28.5Q20 30.5 23 28.5" stroke={HAIR} strokeWidth="0.9" fill="none" strokeLinecap="round" />
        {/* the woman in an orange saree */}
        <path d="M43 40Q53 35 63 40L67 80H39Z" fill="#ea580c" />
        <path d="M39 78H67" stroke="#fde047" strokeWidth="2.4" />
        <path d="M57 39Q64 48 66 62L60 64Q58 50 55 42Z" fill="#f97316" />
        <path d="M62 44L70 28" stroke={SKIN} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M70 28L74 14" stroke="#6b5e52" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M44 44L36 50" stroke={SKIN} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="53" cy="29" r="7.5" fill={SKIN} />
        <path d="M45.5 28Q46 20 53 20.5Q60.5 20 60.5 28Q57 23.5 53 24Q48.5 24 45.5 28Z" fill={HAIR} />
        <circle cx="53" cy="26" r="0.9" fill="#dc2626" />
        <path d="M51 32.5Q53 34 55 32.5" stroke={HAIR} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </svg>
      <Sparks x={3} y={10} />
      <Sparks x={97} y={17} />
    </span>
  );
}

/** a chakri spinning on the street and a boy clapping */
function Chakri() {
  return (
    <span className="dw-fig is-wide">
      <svg viewBox="0 0 64 66" width="64" height="66" aria-hidden>
        <rect x="40" y="48" width="4.5" height="16" rx="2" fill={DARK} />
        <rect x="46" y="48" width="4.5" height="16" rx="2" fill={DARK} />
        <path d="M37 29Q45 25 53 29L55 52H35Z" fill="#0ea5e9" />
        <path d="M45 28V51" stroke="#e0f2fe" strokeWidth="1.1" opacity="0.8" />
        <path d="M38 33L42 24M52 33L48 24" stroke={SKIN} strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="45" cy="19" r="7" fill={SKIN} />
        <path d="M38 18Q38.5 11 45 11.5Q52 11 52 18Q48.5 14 45 14.5Q41 14 38 18Z" fill={HAIR} />
        <path d="M42 20Q43 19 44 20M46 20Q47 19 48 20" stroke={HAIR} strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M42.5 23Q45 25.5 47.5 23" stroke={HAIR} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </svg>
      <span className="dw-chakri" style={{ left: "22%", top: "88%" } as CSSProperties}>
        <i />
        <Sparks x={50} y={50} kind="wheel" />
      </span>
    </span>
  );
}

export const DIWALI_KINDS = ["sparkler", "lady", "anar", "couple", "chakri"] as const;
export type DiwaliKind = (typeof DIWALI_KINDS)[number];
export const DIWALI_ITEM: Record<DiwaliKind, () => React.JSX.Element> = { sparkler: SparklerKid, lady: DiyaLady, anar: Anar, couple: Couple, chakri: Chakri };

/** a small clay diya with a flickering flame */
function Diya({ k }: { k: number }) {
  return (
    <i className="dw-diya" style={{ "--k": k } as CSSProperties}>
      <svg viewBox="0 0 22 10" width="22" height="10" aria-hidden>
        <path d="M1 3Q11 12 21 3Z" fill="#c2410c" />
        <path d="M1 3Q11 7 21 3" stroke="#fdba74" strokeWidth="1" fill="none" />
        <path d="M17 3.4L21.5 1.5" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <i className="dw-flame" />
    </i>
  );
}

/** a round rangoli lying on the street (seen in perspective like the pavement) */
function Rangoli() {
  const petals = (r: number, n: number, c: string, w: number, h: number) =>
    Array.from({ length: n }, (_, i) => <ellipse key={i} cx="40" cy={40 - r} rx={w} ry={h} fill={c} transform={`rotate(${(360 / n) * i} 40 40)`} />);
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden>
      <circle cx="40" cy="40" r="37" fill="none" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="2 4" />
      <g className="dw-rg-a">{petals(27, 12, "#f97316", 5, 9)}</g>
      <g className="dw-rg-b">{petals(17, 8, "#facc15", 4.5, 8)}</g>
      <circle cx="40" cy="40" r="10" fill="#16a34a" />
      <circle cx="40" cy="40" r="6.5" fill="#fef3c7" />
      <circle cx="40" cy="40" r="3" fill="#dc2626" />
    </svg>
  );
}

/** the string of lights between two lamp posts (the wire sags; the bulbs twinkle one after the other) */
function Toran({ j }: { j: number }) {
  const bulbs = Array.from({ length: 9 }, (_, k) => (k + 1) / 10);
  return (
    <i className="dw-toran" style={{ "--a": j } as CSSProperties}>
      <svg viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0Q50 30 100 0" fill="none" stroke="#3b2f2a" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((t, k) => (
        <b key={k} style={{ left: `${t * 100}%`, top: `${((60 * t * (1 - t)) / 22) * 100}%`, "--k": k + j * 3 } as CSSProperties} />
      ))}
    </i>
  );
}

/** a firework: a rocket goes up, then bursts into rays */
function Burst({ k }: { k: number }) {
  return (
    <i className="dw-burst" style={{ "--k": k } as CSSProperties}>
      <b className="dw-trail" />
      <b className="dw-rays">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} style={{ "--r": i } as CSSProperties} />
        ))}
      </b>
    </i>
  );
}

/** everything of Diwali that is not a person: rangolis, toran lights, diyas along the kerb, fireworks */
export function DiwaliLayer({ n }: { n: number }) {
  return (
    <i className="dw-layer">
      <i className="dw-sky">
        {Array.from({ length: 6 }, (_, k) => (
          <Burst key={k} k={k} />
        ))}
      </i>
      {Array.from({ length: Math.max(0, n - 1) }, (_, j) => (
        <Toran key={j} j={j} />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className="dw-rangoli" style={{ "--a": i } as CSSProperties}>
          <Rangoli />
        </i>
      ))}
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className="dw-diyas" style={{ "--a": i } as CSSProperties}>
          <Diya k={i * 3} />
          <Diya k={i * 3 + 1} />
          <Diya k={i * 3 + 2} />
        </i>
      ))}
    </i>
  );
}
