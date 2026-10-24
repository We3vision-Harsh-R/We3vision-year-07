"use client";

import "@/styles/diwali.css";
import "@/styles/fest-road.css";
import { memo, type CSSProperties } from "react";
import { Box, PH, PW, district, type Kind } from "../city-scene";
import { DIWALI_ITEM } from "../home-diwali";
import { Rangoli, SkyLantern } from "./fest-art";
import { useFest } from "./use-fest";

// THE ROAD OF THE INDUSTRIES IN DIWALI (Admin > Fest, "Industries road"): ten decorations that live INSIDE the 3D world of the road
// (industries-road.tsx puts <RoadFest/> into .cm-world and <CarFest/> into the car), so they stand on the road, along it and over the city in the
// same 3D space as the districts and move with the camera. Every piece is switched on its own:
//   ind-lights    strings of bulbs from lamp post to lamp post on both sides of the road, chasing one after the other
//   ind-lamps     a flame on every lamp post and a warm pool of light on the road under it
//   ind-toran     marigold gates with bunting across the road, one between every two districts
//   ind-rangoli   a rangoli painted on the road at every district
//   ind-sparklers a boy and a couple waving sparklers beside the road
//   ind-anar      a child at an anar fountain, a woman with diyas and a spinning chakri beside the road
//   ind-rockets   a rocket climbs above every district and bursts
//   ind-roofs     small diyas on the roofs (and warm windows, see fest.css)
//   ind-car       the car wears fairy lights and a toran and throws sparks
//   ind-lanterns  sky lanterns rise between the districts
// Things that must face the screen (people, flames, bursts, lanterns) are turned back against the camera (rotateZ(-ang) rotateX(-rx)), the same trick
// as the names of the districts. The look is in src/styles/fest-road.css ("rf-"). Nothing here can be clicked.

type Pad = { x: number; y: number; top: boolean; kind: Kind };
type Pt = { x: number; y: number };

const hash = (i: number, salt = 0) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const COLORS = ["#f97316", "#dc2626", "#16a34a", "#fbbf24", "#ec4899"];

/** the bulbs of one string between two lamp posts: a sagging curve with five bulbs */
function Strand({ a, b, k0, z }: { a: Pt; b: Pt; k0: number; z: number }) {
  const L = Math.hypot(b.x - a.x, b.y - a.y);
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  const sag = 16;
  const pts = [1, 2, 3, 4, 5].map((i) => {
    const t = i / 6;
    return { x: L * t, y: (1 - t) * (1 - t) * 2 + 2 * (1 - t) * t * (2 + sag * 2) + t * t * 2 };
  });
  return (
    <div className="rf-strand" style={{ left: a.x, top: a.y, width: L, height: sag + 8, transform: `translateZ(${z}px) rotateZ(${ang.toFixed(2)}deg) rotateX(-90deg)` }}>
      <svg viewBox={`0 0 ${L} ${sag + 8}`} width={L} height={sag + 8} aria-hidden>
        <path d={`M0 2Q${L / 2} ${2 + sag * 2} ${L} 2`} fill="none" stroke="#3b2f2a" strokeWidth="1" />
        {pts.map((p, i) => (
          <g key={i} className="rf-b" style={{ "--k": k0 + i } as CSSProperties}>
            <circle cx={p.x} cy={p.y + 2} r="6" className="rf-bg" />
            <circle cx={p.x} cy={p.y + 2} r="2.6" className="rf-bc" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** a gate across the road: two poles and a swag of marigolds and bunting */
function Gate({ x, y, z }: { x: number; y: number; z: number }) {
  const W = 156;
  const H = 46;
  const flags = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 0.7) / 9.4;
    return { x: W * t, y: (1 - t) * (1 - t) * 3 + 2 * (1 - t) * t * 38 + t * t * 3, c: COLORS[i % COLORS.length] };
  });
  return (
    <>
      <div className="cm-at" style={{ left: x, top: y - 78 }}>
        <Box x={-2} y={-2} w={4} d={4} h={76} l={42} />
      </div>
      <div className="cm-at" style={{ left: x, top: y + 78 }}>
        <Box x={-2} y={-2} w={4} d={4} h={76} l={42} />
      </div>
      <div className="rf-strand" style={{ left: x, top: y - 78, width: W, height: H, transform: `translateZ(${z}px) rotateZ(90deg) rotateX(-90deg)` }}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden>
          <path d={`M0 3Q${W / 2} 40 ${W} 3`} fill="none" stroke="#3b2f2a" strokeWidth="1.2" />
          {flags.map((f, i) => (
            <path key={i} d={`M${f.x - 6} ${f.y}h12l-6 14z`} fill={f.c} />
          ))}
          {[0, W].map((cx) => (
            <g key={cx} transform={`translate(${cx} 6)`}>
              {Array.from({ length: 6 }, (_, i) => (
                <ellipse key={i} cx="0" cy="-5" rx="3.4" ry="5" fill={i % 2 ? "#f59e0b" : "#fb923c"} transform={`rotate(${i * 60})`} />
              ))}
              <circle r="3" fill="#fde047" />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}

// memo: the road re-renders every time the district changes while the car drives, the decorations only when their own inputs change
export const RoadFest = memo(function RoadFest({
  fx,
  pads,
  lamps,
  yAt,
  ang,
  rx,
  from,
  to,
}: {
  fx: ReadonlySet<string>;
  pads: Pad[];
  lamps: Pt[];
  yAt: (x: number) => number;
  ang: number;
  rx: number;
  /** the part of the road that is decorated (the first and last district with a margin) */
  from: number;
  to: number;
}) {
  const on = (k: string) => fx.has(k);
  const face = `rotateZ(${-ang}deg) rotateX(${-rx}deg)`;
  const S = pads.length > 1 ? pads[1].x - pads[0].x : 340;

  // lamp posts of both sides inside the decorated part (the same places as the posts in industries-road.tsx)
  const sideA = lamps.filter((l) => l.x >= from && l.x <= to).map((l) => ({ x: l.x, y: l.y - 60 }));
  const sideB = lamps.filter((l) => l.x + 64 >= from && l.x + 64 <= to).map((l) => ({ x: l.x + 64, y: l.y + 60 }));

  return (
    <>
      {on("ind-lights") &&
        [sideA, sideB].flatMap((side, s) =>
          side.slice(0, -1).map((a, i) => <Strand key={`s${s}${i}`} a={a} b={side[i + 1]} k0={i * 5 + s * 3} z={38} />),
        )}

      {on("ind-lamps") &&
        [...sideA, ...sideB].map((l, i) => (
          <div key={`l${i}`} className="cm-at" style={{ left: l.x, top: l.y }}>
            <i className="rf-pool" />
            <i className="rf-flame" style={{ transform: `translateZ(43px) ${face} translate(-50%, -100%)`, "--k": i } as CSSProperties} />
          </div>
        ))}

      {on("ind-toran") &&
        pads.slice(0, -1).map((p, i) =>
          i % 2 === 0 ? <Gate key={`g${i}`} x={p.x + PW / 2 + S / 2} y={yAt(p.x + PW / 2 + S / 2)} z={74} /> : null,
        )}

      {on("ind-rangoli") &&
        pads.map((p, i) => {
          const x = p.x + PW / 2 + 70;
          return (
            <div key={`r${i}`} className="cm-at" style={{ left: x, top: yAt(x) }}>
              <i className="rf-rangoli">
                <Rangoli size={88} hue={((i * 47) % 90) - 30} />
              </i>
            </div>
          );
        })}

      {(on("ind-sparklers") || on("ind-anar")) &&
        pads.map((p, i) => {
          const sign = p.top ? -1 : 1; // the pad is on this side of the road: the people stand on its pavement
          const figs: { k: keyof typeof DIWALI_ITEM; dx: number }[] = [];
          if (on("ind-sparklers")) figs.push({ k: i % 2 ? "couple" : "sparkler", dx: 0.2 }, { k: i % 2 ? "sparkler" : "couple", dx: 0.74 });
          if (on("ind-anar")) figs.push({ k: (["anar", "lady", "chakri"] as const)[i % 3], dx: 0.47 });
          return figs.map((f, j) => {
            const Fig = DIWALI_ITEM[f.k];
            const x = p.x + PW * f.dx + hash(i, j) * 30;
            return (
              <div key={`p${i}${j}`} className="cm-at" style={{ left: x, top: yAt(x) + sign * (70 + hash(j, i) * 8) }}>
                <div className="rf-fig" style={{ transform: `translateZ(2px) ${face} scale(0.46) translate(-50%, -100%)` }}>
                  <Fig />
                </div>
              </div>
            );
          });
        })}

      {on("ind-rockets") &&
        pads.map((p, i) => {
          const x = p.x + PW * (0.25 + hash(i, 4) * 0.5);
          const y = p.top ? p.y + 36 : p.y + PH - 36;
          return (
            <div key={`k${i}`} className="cm-at" style={{ left: x, top: y }}>
              <div className="rf-rk" style={{ "--d": `${-hash(i, 9) * 9}s` } as CSSProperties}>
                <div className="rf-rk-b" style={{ transform: `${face} translate(-50%, -50%)` }}>
                  <i className="rf-trail" />
                  <b className="rf-burst" style={{ "--h": COLORS[i % COLORS.length] } as CSSProperties}>
                    {Array.from({ length: 14 }, (_, r) => (
                      <u key={r} style={{ "--a": `${r * (360 / 14)}deg` } as CSSProperties} />
                    ))}
                  </b>
                </div>
              </div>
            </div>
          );
        })}

      {on("ind-roofs") &&
        pads.map((p, i) => {
          const roofs = district(p.kind)
            .filter((it): it is Extract<ReturnType<typeof district>[number], { k: "box" }> => it.k === "box" && it.w * it.d >= 2600 && it.h >= 30)
            .slice(0, 3);
          return roofs.flatMap((b, j) => {
            const wy = p.top ? p.y + b.y + b.d / 2 : p.y + PH - b.y - b.d + b.d / 2;
            const wx = p.x + b.x + b.w / 2;
            const z = (b.z ?? 0) + b.h + 1;
            return [-1, 1].map((s) => (
              <div key={`f${i}${j}${s}`} className="cm-at" style={{ left: wx + s * Math.min(b.w, 90) * 0.32, top: wy + s * Math.min(b.d, 60) * 0.2, transform: `translateZ(${z}px)` }}>
                <i className="rf-roofdiya" />
                <i className="rf-flame is-roof" style={{ transform: `translateZ(2px) ${face} translate(-50%, -100%)`, "--k": i + j + s } as CSSProperties} />
              </div>
            ));
          });
        })}

      {on("ind-lanterns") &&
        Array.from({ length: Math.max(6, pads.length + 2) }, (_, i) => {
          const x = from + hash(i, 5) * (to - from);
          return (
            <div key={`n${i}`} className="cm-at" style={{ left: x, top: yAt(x) + (hash(i, 6) - 0.5) * 520 }}>
              <div className="rf-lant" style={{ "--t": `${22 + hash(i, 7) * 14}s`, "--d": `${-hash(i, 8) * 30}s` } as CSSProperties}>
                <div className="rf-lant-b" style={{ transform: `${face} scale(0.85) translate(-50%, -100%)` }}>
                  <SkyLantern />
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
});

/** the festive car: fairy lights, a toran along its sides and sparks behind it (drawn inside the car, so it turns with it) */
export function CarFest() {
  const fest = useFest();
  if (!fest?.has("ind-car")) return null;
  const bulbs: [number, number, number][] = [
    [-26, -11, 8],
    [-26, 11, 8],
    [26, -11, 8],
    [26, 11, 8],
    [-12, -10, 23],
    [-12, 10, 23],
    [13, -10, 23],
    [13, 10, 23],
  ];
  return (
    <>
      {bulbs.map(([x, y, z], i) => (
        <i key={i} className="rf-cb" style={{ left: x, top: y, transform: `translateZ(${z}px)`, "--k": i } as CSSProperties} />
      ))}
      {[-12, 12].map((y) => (
        <div key={y} className="rf-strand" style={{ left: -27, top: y, width: 54, height: 9, transform: "translateZ(21px) rotateX(-90deg)" }}>
          <svg viewBox="0 0 54 9" width="54" height="9" aria-hidden>
            <path d="M0 1Q27 11 54 1" fill="none" stroke="#3b2f2a" strokeWidth="0.8" />
            {[1, 2, 3, 4, 5].map((t) => (
              <circle key={t} cx={(54 * t) / 6} cy={1 + 4.6 * (1 - Math.abs(t - 3) / 3) * 1.6} r="1.5" className="rf-bc" style={{ "--k": t } as CSSProperties} />
            ))}
          </svg>
        </div>
      ))}
      <b className="rf-sparks">
        {Array.from({ length: 9 }, (_, i) => (
          <s key={i} style={{ "--i": i, "--dy": `${(hash(i, 3) - 0.5) * 22}px` } as CSSProperties} />
        ))}
      </b>
    </>
  );
}
