"use client";

import "@/styles/fest.css";
import "@/styles/fest-places.css";
import "@/styles/diwali.css";
import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { DIWALI_ITEM } from "../home-diwali";
import { DiyaShape, Rangoli } from "./fest-art";

// A LITTLE HOME IN THE FOOTER (Admin > Fest, "Places": "Family at home in the footer"): a thin strip between the link columns and the big company name
// where a small family lives through Diwali: on the left a mandir with the family at the puja (the father with folded hands, the mother with the aarti
// thali, the child ringing the bell), then the grandparents at ease (grandfather with his tea, grandmother threading marigolds) and, on the right,
// the children with a sparkler and an anar and a cat. Flat little drawings in the style of the people of the home street, nothing takes a click.
//
// IT ONLY TAKES THE ROOM THERE IS: the strip is a size container. Wide (1100 px and more) it shows everybody; from 760 px the mandir, the family at the
// puja, the grandfather and one child; from 480 px only the mandir and the family at the puja; narrower it is not drawn at all (no height). It never
// pushes the footer taller than its own drawing (about 150 px) and never covers a link.
// The strip is put into <div class="ft-home-slot"> that footer.tsx leaves empty between the columns and the name. Styles: fest-places.css (.fh-*).

const SKIN = "#e8b48a";
const SKIN2 = "#c98d62";
const HAIR = "#2b1d16";
const DARK = "#3a2c28";

/** the mandir: a small temple with a lit niche, a garland, two diyas and a bell that swings */
function Mandir() {
  return (
    <svg viewBox="0 0 96 114" width="96" height="114" aria-hidden className="fh-mandir">
      <defs>
        <radialGradient id="fh-niche">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="48" cy="68" rx="40" ry="34" fill="url(#fh-niche)" opacity="0.5" className="fh-glow" />
      <rect x="4" y="100" width="88" height="10" rx="3" fill="#7c2d12" />
      <rect x="9" y="93" width="78" height="9" rx="2" fill="#9a3412" />
      <rect x="15" y="48" width="66" height="47" rx="3" fill="#b45309" />
      <path d="M29 95V64Q29 50 48 50Q67 50 67 64V95Z" fill="#3b1606" />
      <circle cx="48" cy="72" r="10" fill="#fbbf24" />
      <circle cx="48" cy="72" r="6" fill="#fde68a" />
      <path d="M38 85Q48 78 58 85Q48 90 38 85Z" fill="#ec4899" />
      <rect x="15" y="48" width="8" height="47" fill="#d97706" />
      <rect x="73" y="48" width="8" height="47" fill="#d97706" />
      <path d="M10 48L48 14L86 48Z" fill="#ea580c" />
      <path d="M22 48L48 22L74 48Z" fill="#f97316" />
      <path d="M36 32L48 20L60 32Z" fill="#fb923c" />
      <path d="M46 14h4l1 6h-6z" fill="#fde047" />
      <circle cx="48" cy="11" r="2.6" fill="#fde047" />
      <path d="M48 8V1l8 2.6L48 6" fill="#dc2626" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={19 + i * 8.6} cy={49 + Math.sin((i / 7) * Math.PI) * 5} r="2.6" fill={i % 2 ? "#f97316" : "#facc15"} />
      ))}
      <g className="fh-bell">
        <path d="M76 52V58" stroke="#78350f" strokeWidth="1.2" />
        <path d="M71 70Q71 59 76 59Q81 59 81 70Z" fill="#fbbf24" />
        <circle cx="76" cy="71" r="1.6" fill="#92400e" />
        <path d="M76 59V47" stroke="#78350f" strokeWidth="1" opacity="0" />
      </g>
      <g className="fh-flame" style={{ "--k": 0 } as CSSProperties}>
        <path d="M22 93Q20 87 22 82Q25 86 22 93Z" fill="#fde047" />
      </g>
      <g className="fh-flame" style={{ "--k": 1 } as CSSProperties}>
        <path d="M74 93Q72 87 74 82Q77 86 74 93Z" fill="#fde047" />
      </g>
      <path className="fh-smoke" d="M48 44Q44 38 48 32Q52 26 48 20" stroke="#fef3c7" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** the father: white kurta, hands folded in a namaste, facing the mandir (on the left) */
function Father() {
  return (
    <svg viewBox="0 0 44 84" width="44" height="84" aria-hidden>
      <rect x="13" y="56" width="7" height="26" rx="2.5" fill="#f5f0e6" />
      <rect x="22" y="56" width="7" height="26" rx="2.5" fill="#f5f0e6" />
      <path d="M8 34Q21 28 34 34L36 62H6Z" fill="#fef3c7" />
      <path d="M21 33V60" stroke="#e5d6a8" strokeWidth="1.2" />
      <path d="M10 38L14 48L19 44" stroke={SKIN2} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M32 38L26 48L20 44" stroke={SKIN2} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="19.5" cy="44" r="2.6" fill={SKIN2} />
      <circle cx="21" cy="23" r="8" fill={SKIN2} />
      <path d="M13 22Q13 14 21 14.5Q29 14 29 22Q26 17 21 17.5Q16 17 13 22Z" fill={HAIR} />
      <path d="M18 27Q21 29 24 27" stroke={HAIR} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="20" r="1.2" fill="#dc2626" />
    </svg>
  );
}

/** the mother: red saree, an aarti thali with a lit diya held out to the mandir */
function Mother() {
  return (
    <svg viewBox="0 0 52 84" width="52" height="84" aria-hidden>
      <path d="M17 40Q27 35 37 40L41 82H13Z" fill="#dc2626" />
      <path d="M13 79H41" stroke="#fde047" strokeWidth="2.4" />
      <path d="M33 39Q40 48 42 62L36 64Q34 50 31 42Z" fill="#b91c1c" />
      <path d="M20 44L12 49" stroke={SKIN} strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="9" cy="49.5" rx="8" ry="2.6" fill="#fbbf24" />
      <ellipse cx="9" cy="48.6" rx="5.6" ry="1.4" fill="#fde68a" />
      <g className="fh-flame fh-aarti" style={{ "--k": 2 } as CSSProperties}>
        <path d="M9 47Q6.4 42 9 37Q11.8 42 9 47Z" fill="#fde047" />
      </g>
      <circle cx="27" cy="29" r="7.6" fill={SKIN} />
      <path d="M19.5 28Q20 20 27 20.5Q34.5 20 34.5 28Q31 23.5 27 24Q22.5 24 19.5 28Z" fill={HAIR} />
      <circle cx="27" cy="26" r="0.9" fill="#dc2626" />
      <path d="M25 33Q27 34.6 29 33" stroke={HAIR} strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** the child: reaches up to ring the bell of the mandir */
function Child() {
  return (
    <svg viewBox="0 0 38 66" width="38" height="66" aria-hidden className="fh-child">
      <rect x="11" y="44" width="5" height="19" rx="2" fill={DARK} />
      <rect x="18" y="44" width="5" height="19" rx="2" fill={DARK} />
      <path d="M8 28Q17 23 26 28L28 48H6Z" fill="#16a34a" />
      <path d="M9 31L3 18" stroke={SKIN} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M25 31L28 41" stroke={SKIN} strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="17" cy="19" r="7" fill={SKIN} />
      <path d="M10 18Q10.5 11 17 11.5Q23.5 11 23.5 18Q21 14 17 14.5Q13 14 10 18Z" fill={HAIR} />
      <circle cx="14.6" cy="19.6" r="0.9" fill={HAIR} />
      <circle cx="19.4" cy="19.6" r="0.9" fill={HAIR} />
      <path d="M14.8 22.6Q17 24.4 19.2 22.6" stroke={HAIR} strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** the grandfather on a cushion with his tea (white hair, glasses) and a low table */
function Grandpa() {
  return (
    <svg viewBox="0 0 92 62" width="92" height="62" aria-hidden>
      <ellipse cx="30" cy="58" rx="26" ry="5" fill="#7c2d12" />
      <path d="M12 56Q14 48 22 47H38Q46 48 48 56Z" fill="#d97706" />
      <path d="M17 48Q16 34 28 31Q40 34 39 48Z" fill="#f5f0e6" />
      <path d="M36 38L50 40" stroke={SKIN2} strokeWidth="3.4" strokeLinecap="round" />
      <rect x="49" y="36" width="7" height="6" rx="1.4" fill="#f5f0e6" />
      <path d="M56 38Q60 38 56 42" stroke="#f5f0e6" strokeWidth="1.2" fill="none" />
      <path className="fh-steam" d="M52 33Q50 30 52 27M55 33Q53 30 55 27" stroke="#fef3c7" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="22" r="7.8" fill={SKIN2} />
      <path d="M20.5 20Q20 13 28 13Q36 13 35.5 20Q33 16.5 28 17Q23 16.5 20.5 20Z" fill="#e5e7eb" />
      <circle cx="25" cy="23" r="2.4" fill="none" stroke="#6b5e52" strokeWidth="0.8" />
      <circle cx="31.4" cy="23" r="2.4" fill="none" stroke="#6b5e52" strokeWidth="0.8" />
      <path d="M26 28Q28 29.4 30 28" stroke={HAIR} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <rect x="64" y="46" width="24" height="3" rx="1.5" fill="#92400e" />
      <rect x="67" y="49" width="2.6" height="10" fill="#78350f" />
      <rect x="82" y="49" width="2.6" height="10" fill="#78350f" />
      <circle cx="72" cy="43" r="3.2" fill="#fbbf24" />
      <circle cx="80" cy="43.5" r="2.6" fill="#f97316" />
    </svg>
  );
}

/** the grandmother on a mat, threading marigolds into a garland, a basket of flowers beside her */
function Grandma() {
  return (
    <svg viewBox="0 0 90 60" width="90" height="60" aria-hidden>
      <ellipse cx="38" cy="57" rx="34" ry="3.6" fill="#92400e" opacity="0.8" />
      <path d="M18 56Q20 46 30 44H46Q54 46 56 56Z" fill="#7e22ce" />
      <path d="M22 46Q22 32 36 30Q50 32 48 46Z" fill="#a855f7" />
      <path d="M44 40L58 46" stroke={SKIN} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M58 46Q66 50 72 46" stroke="#f97316" strokeWidth="2.4" fill="none" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={60 + i * 3} cy={47.5 + (i % 2) * 1.6} r="2" fill={i % 2 ? "#facc15" : "#f97316"} />
      ))}
      <circle cx="35" cy="21" r="7.4" fill={SKIN} />
      <path d="M27.6 20Q28 12.5 35 13Q42 12.5 42.4 20Q39 15.5 35 16Q31 15.5 27.6 20Z" fill="#d1d5db" />
      <path d="M27.6 20Q26 28 31 29" stroke="#a855f7" strokeWidth="2" fill="none" />
      <circle cx="35" cy="18.5" r="0.9" fill="#dc2626" />
      <path d="M33 25.4Q35 27 37 25.4" stroke={HAIR} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M62 56Q60 46 66 44H82Q88 46 86 56Z" fill="#b45309" />
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={66 + i * 3.2} cy={43.4 - (i % 2) * 1.4} r="2.6" fill={i % 2 ? "#f97316" : "#facc15"} />
      ))}
    </svg>
  );
}

/** a cat that sits and watches the sparklers */
function Cat() {
  return (
    <svg viewBox="0 0 34 32" width="34" height="32" aria-hidden>
      <path d="M8 30Q4 24 8 17Q12 12 18 12Q26 12 28 22Q29 28 24 30Z" fill="#6b5e52" />
      <path className="fh-tail" d="M26 28Q34 26 31 19" stroke="#6b5e52" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="11" r="6.2" fill="#6b5e52" />
      <path d="M7 7L8.4 2L12 5ZM17 7L15.6 2L12 5Z" fill="#6b5e52" />
      <circle cx="10" cy="11" r="1" fill="#fde047" />
      <circle cx="14.2" cy="11" r="1" fill="#fde047" />
    </svg>
  );
}

const Boy = DIWALI_ITEM.sparkler;
const Girl = DIWALI_ITEM.anar;

export function FooterHome() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setHost(document.querySelector<HTMLElement>(".ft-home-slot")), 0);
    return () => window.clearTimeout(t);
  }, []);
  if (!host) return null;
  return createPortal(
    <div className="fh" aria-hidden>
      <i className="fh-floor" />
      <div className="fh-g fh-puja">
        <i className="fh-p fh-mandir-w">
          <Mandir />
        </i>
        <i className="fh-p">
          <Father />
        </i>
        <i className="fh-p">
          <Mother />
        </i>
        <i className="fh-p fh-hop" style={{ "--k": 1 } as CSSProperties}>
          <Child />
        </i>
      </div>
      <div className="fh-g fh-home" data-t="2">
        <i className="fh-p">
          <Grandpa />
        </i>
        <i className="fh-p fh-rg" data-t="3">
          <Rangoli size={64} />
        </i>
        <i className="fh-p" data-t="3">
          <Grandma />
        </i>
      </div>
      <div className="fh-g fh-kids" data-t="2">
        <i className="fh-p fh-hop" style={{ "--k": 2 } as CSSProperties}>
          <Boy />
        </i>
        <i className="fh-p fh-hop" data-t="3" style={{ "--k": 3 } as CSSProperties}>
          <Girl />
        </i>
        <i className="fh-p" data-t="3">
          <Cat />
        </i>
      </div>
      {[6, 24, 52, 70, 90].map((x, i) => (
        <i key={i} className="fh-diya" style={{ left: `${x}%`, "--k": i } as CSSProperties}>
          <DiyaShape w={11} />
          <b />
        </i>
      ))}
    </div>,
    host,
  );
}
