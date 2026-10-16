// LOCKED: confirmed by the user (the city of the industries section). Do not change it without asking first.
import type { CSSProperties } from "react";

// The 3D city of the "Industries we serve" section (industries-city.tsx). Everything is made of boxes in CSS 3D (no images): a ring road with
// one district for every industry. Every district has the buildings, vehicles and little details of its own industry (schools, a college
// and a university for education, hospitals for healthcare, bank and office towers for finance, an airport with planes for travel,
// warehouses, trucks and drones for e-commerce...). Coordinates of a district are local (a pad of PW x PH, the road is at the bottom,
// y = PH); the pads of the lower row are mirrored so that their front always faces the road.

export const PW = 560;
export const PH = 420;
export const PITCH = 640;
export const LANE_TOP = 500;
export const LANE_BOT = 740;
export const CITY_R = 120;

export type Kind = "education" | "health" | "finance" | "estate" | "travel" | "shop" | "fun" | "factory" | "tech" | "creative" | "generic";

/** Which kind of district an industry gets, from its name. */
export function kindOf(name: string): Kind {
  const n = name.toLowerCase();
  if (/hospitality|travel|tourism|hotel/.test(n)) return "travel";
  if (/educat|school|learn|train|academy/.test(n)) return "education";
  if (/health|clinic|medical|beauty|care/.test(n)) return "health";
  if (/financ|bank|legal|insur/.test(n)) return "finance";
  if (/real estate|construct|architect|propert/.test(n)) return "estate";
  if (/commerce|retail|shop|store|logistic|on-demand|delivery/.test(n)) return "shop";
  if (/gaming|game|entertain|media|event|communit/.test(n)) return "fun";
  if (/manufactur|engineer|automotive|industr/.test(n)) return "factory";
  if (/tech|saas|software|startup|emerging/.test(n)) return "tech";
  if (/market|advertis|creative|brand/.test(n)) return "creative";
  return "generic";
}

type Item =
  | { k: "box"; x: number; y: number; w: number; d: number; h: number; l?: number; z?: number; win?: boolean; glass?: boolean; mark?: string }
  | { k: "flat"; x: number; y: number; w: number; d: number; l?: number; pat?: "lines" | "runway" | "water" | "road" | "yard" }
  | { k: "tree"; x: number; y: number; s?: number }
  | { k: "sign"; x: number; y: number; z: number; t: string }
  | { k: "veh"; v: "bus" | "truck" | "amb" | "sedan"; x: number; y: number; len?: number; dur?: number; delay?: number }
  | { k: "plane"; x: number; y: number }
  | { k: "drone"; x: number; y: number; r?: number; dur?: number; pkg?: boolean }
  | { k: "crane"; x: number; y: number }
  | { k: "stack"; x: number; y: number; h: number };

const box = (x: number, y: number, w: number, d: number, h: number, l = 30, o: Partial<Extract<Item, { k: "box" }>> = {}): Item => ({ k: "box", x, y, w, d, h, l, ...o });
const tree = (x: number, y: number, s = 1): Item => ({ k: "tree", x, y, s });
const sign = (x: number, y: number, z: number, t: string): Item => ({ k: "sign", x, y, z, t });
const flat = (x: number, y: number, w: number, d: number, l = 20, pat?: Extract<Item, { k: "flat" }>["pat"]): Item => ({ k: "flat", x, y, w, d, l, pat });

/** a row of trees */
const trees = (x0: number, y: number, n: number, gap: number, s = 1): Item[] => Array.from({ length: n }, (_, i) => tree(x0 + i * gap, y, s));
/** a stepped roof (a hip roof in low poly) on top of a box */
const roofed = (x: number, y: number, w: number, d: number, h: number, l: number, win = true): Item[] => [
  box(x, y, w, d, h, l, { win }),
  box(x + 6, y + 6, w - 12, d - 12, 8, l + 8, { z: h }),
  box(x + 14, y + 14, w - 28, d - 28, 8, l + 14, { z: h + 8 }),
];
const house = (x: number, y: number): Item[] => [...roofed(x, y, 70, 58, 34, 34), box(x + 28, y + 52, 14, 6, 20, 14)];
const tower = (x: number, y: number, w: number, d: number, h: number, l = 30): Item[] => [
  box(x, y, w, d, h, l, { win: true, glass: true }),
  box(x + w / 2 - 6, y + d / 2 - 6, 12, 12, 10, l + 14, { z: h }),
  box(x + w / 2 - 1.5, y + d / 2 - 1.5, 3, 3, 26, 70, { z: h + 10 }),
];

/** the items of the district of a kind (local coordinates, the road is at y = PH) */
export function district(kind: Kind): Item[] {
  switch (kind) {
    case "education":
      return [
        // the university: a U-shaped building around a dome
        box(36, 28, 90, 190, 60, 32, { win: true }),
        box(36, 28, 300, 66, 60, 32, { win: true }),
        box(246, 28, 90, 190, 60, 32, { win: true }),
        box(144, 62, 102, 70, 8, 44),
        box(158, 74, 74, 46, 22, 48, { z: 8 }),
        box(174, 86, 42, 22, 26, 54, { z: 30 }),
        box(190, 94, 10, 8, 14, 70, { z: 56 }),
        sign(190, 24, 110, "University"),
        // the college with its clock tower
        box(372, 40, 160, 110, 72, 34, { win: true }),
        box(392, 44, 36, 36, 130, 42, { win: true }),
        box(388, 40, 44, 44, 8, 60, { z: 130 }),
        box(404, 56, 12, 12, 16, 74, { z: 138 }),
        sign(450, 36, 140, "College"),
        // the school with its flag and playground
        ...roofed(36, 268, 210, 84, 34, 36),
        box(256, 276, 3, 3, 70, 60),
        box(259, 276, 18, 2, 11, 58, { z: 58 }),
        flat(36, 366, 150, 34, 24, "lines"),
        sign(140, 262, 52, "School"),
        // the library
        box(318, 252, 120, 76, 42, 34, { win: true }),
        box(330, 262, 96, 56, 8, 46, { z: 42 }),
        sign(380, 250, 62, "Library"),
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "bus", x: 300, y: 392, len: 230, dur: 14 },
        ...trees(20, 236, 3, 54, 1),
        ...trees(470, 190, 3, 28, 0.9),
        tree(470, 360),
        tree(520, 330),
      ];
    case "health":
      return [
        // the hospital with a red-cross sign and a helipad
        box(190, 30, 220, 130, 98, 50, { win: true, mark: "+" }),
        box(86, 64, 104, 92, 62, 46, { win: true, mark: "H" }),
        box(206, 46, 28, 20, 8, 66, { z: 98 }),
        box(360, 46, 28, 20, 8, 66, { z: 98 }),
        sign(300, 26, 118, "Hospital"),
        // the clinic and the laboratory
        box(430, 56, 100, 92, 46, 42, { win: true, mark: "+" }),
        sign(480, 52, 66, "Clinic"),
        box(436, 238, 96, 90, 56, 40, { win: true }),
        box(446, 248, 76, 70, 8, 52, { z: 56 }),
        sign(484, 234, 76, "Lab"),
        // the pharmacy
        ...roofed(40, 240, 100, 70, 32, 40),
        box(40, 240, 100, 6, 4, 70, { z: 32 }),
        sign(90, 236, 52, "Pharmacy"),
        // the ambulance bay
        flat(170, 236, 240, 92, 24, "lines"),
        { k: "veh", v: "amb", x: 230, y: 282, len: 150, dur: 6 },
        flat(0, 404, PW, 14, 26, "road"),
        ...trees(20, 196, 4, 48, 1),
        tree(520, 370),
        tree(470, 380),
        box(170, 346, 70, 30, 8, 30),
        box(260, 346, 70, 30, 8, 30),
      ];
    case "finance":
      return [
        // glass office towers
        ...tower(40, 34, 92, 92, 210, 30),
        ...tower(166, 58, 80, 80, 150, 34),
        ...tower(286, 28, 104, 104, 250, 28),
        ...tower(426, 66, 84, 84, 130, 36),
        sign(332, 24, 280, "Offices"),
        // the bank: a building with columns and a pediment
        box(36, 244, 210, 110, 50, 38, { win: true }),
        box(30, 238, 222, 8, 6, 60, { z: 50 }),
        ...Array.from({ length: 8 }, (_, i) => box(42 + i * 27, 342, 9, 9, 46, 64)),
        sign(140, 240, 70, "Bank"),
        // the stock-ticker billboard
        box(296, 252, 6, 6, 70, 40),
        box(280, 250, 120, 6, 40, 20, { z: 70 }),
        sign(340, 250, 120, "▲ STOCKS"),
        box(430, 250, 70, 56, 26, 40, { win: true }),
        sign(465, 246, 36, "ATM"),
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "sedan", x: 330, y: 392, len: 180, dur: 9 },
        ...trees(280, 360, 4, 40, 0.9),
        ...trees(36, 376, 3, 50, 0.9),
      ];
    case "estate":
      return [
        // apartment blocks
        box(330, 34, 104, 104, 134, 34, { win: true }),
        box(344, 48, 76, 76, 8, 48, { z: 134 }),
        box(456, 58, 80, 80, 104, 38, { win: true }),
        sign(380, 30, 154, "Apartments"),
        // a building under construction with a crane
        box(40, 40, 120, 90, 60, 20, { win: false }),
        box(40, 40, 8, 8, 100, 28),
        box(152, 40, 8, 8, 100, 28),
        box(40, 122, 8, 8, 100, 28),
        box(152, 122, 8, 8, 100, 28),
        box(40, 40, 120, 90, 4, 34, { z: 100 }),
        { k: "crane", x: 214, y: 70 },
        sign(100, 36, 124, "Under construction"),
        // houses
        ...house(40, 250),
        ...house(140, 250),
        ...house(240, 250),
        ...house(340, 262),
        ...house(440, 262),
        sign(130, 246, 66, "Homes"),
        flat(0, 404, PW, 14, 26, "road"),
        ...trees(36, 336, 5, 46, 0.9),
        ...trees(330, 340, 4, 44, 0.9),
      ];
    case "travel":
      return [
        // the runway with a plane that takes off
        flat(10, 20, 540, 52, 14, "runway"),
        { k: "plane", x: 40, y: 46 },
        // the airport terminal and the control tower
        box(30, 130, 300, 90, 40, 34, { win: true, glass: true }),
        box(30, 124, 300, 8, 6, 54, { z: 40 }),
        box(352, 124, 26, 26, 120, 40),
        box(340, 114, 50, 50, 18, 62, { win: true, z: 120 }),
        sign(180, 120, 62, "Airport"),
        // the hotel and the resort with a pool
        box(60, 262, 114, 92, 124, 40, { win: true }),
        box(70, 272, 94, 72, 8, 54, { z: 124 }),
        sign(116, 258, 144, "Hotel"),
        box(204, 280, 140, 80, 44, 36, { win: true }),
        flat(366, 300, 100, 66, 70, "water"),
        sign(416, 296, 20, "Pool"),
        // the bus station
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "bus", x: 120, y: 392, len: 300, dur: 12 },
        box(470, 330, 60, 24, 26, 34),
        box(466, 326, 68, 32, 4, 54, { z: 26 }),
        sign(500, 322, 40, "Bus"),
        tree(430, 376),
        tree(480, 376),
        tree(40, 376),
        tree(200, 376),
        ...trees(400, 100, 3, 40, 1),
      ];
    case "shop":
      return [
        // warehouses with loading doors
        box(30, 36, 250, 92, 64, 34),
        ...Array.from({ length: 5 }, (_, i) => box(46 + i * 46, 124, 30, 4, 34, 14)),
        box(30, 146, 250, 92, 64, 36),
        ...Array.from({ length: 5 }, (_, i) => box(46 + i * 46, 234, 30, 4, 34, 14)),
        sign(155, 32, 84, "Warehouse"),
        // the container yard
        ...Array.from({ length: 9 }, (_, i) => box(310 + (i % 3) * 58, 36 + Math.floor(i / 3) * 34, 50, 26, 18, 30 + (i % 4) * 7)),
        ...Array.from({ length: 6 }, (_, i) => box(310 + (i % 3) * 58, 36 + Math.floor(i / 3) * 34, 50, 26, 18, 36 + (i % 3) * 8, { z: 18 })),
        // the shop with a big cart on its roof
        box(310, 190, 220, 108, 56, 38, { win: true, glass: true }),
        box(330, 200, 180, 88, 8, 52, { z: 56 }),
        box(404, 226, 32, 26, 6, 60, { z: 64, mark: "🛒" }),
        sign(420, 186, 100, "Shop"),
        // trucks and drones
        flat(0, 252, 290, 70, 22, "yard"),
        { k: "veh", v: "truck", x: 60, y: 290, len: 180, dur: 8 },
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "truck", x: 400, y: 392, len: 140, dur: 7, delay: -3 },
        { k: "drone", x: 150, y: 170, r: 90, dur: 9, pkg: true },
        { k: "drone", x: 380, y: 140, r: 70, dur: 12, pkg: true },
        { k: "drone", x: 260, y: 300, r: 60, dur: 7 },
        ...Array.from({ length: 6 }, (_, i) => box(30 + i * 22, 340, 14, 12, 10 + (i % 3) * 3, 40)),
        tree(500, 350),
        tree(520, 380),
      ];
    case "fun":
      return [
        // the stadium: a ring of stands round a pitch
        box(30, 30, 250, 20, 56, 34),
        box(30, 190, 250, 20, 56, 34),
        box(30, 30, 20, 180, 56, 34),
        box(260, 30, 20, 180, 56, 34),
        flat(50, 50, 210, 140, 40, "lines"),
        ...Array.from({ length: 4 }, (_, i) => box(i % 2 ? 258 : 28, i < 2 ? 28 : 200, 4, 4, 86, 60)),
        sign(155, 26, 106, "Arena"),
        // the cinema and the big screen
        box(320, 40, 200, 100, 64, 36, { win: true }),
        box(336, 50, 168, 80, 14, 52, { z: 64 }),
        sign(420, 36, 100, "Cinema"),
        box(330, 190, 6, 6, 80, 40),
        box(500, 190, 6, 6, 80, 40),
        box(326, 188, 184, 8, 54, 66, { z: 40 }),
        sign(418, 186, 108, "LIVE"),
        // the game centre
        ...roofed(40, 262, 170, 80, 40, 38),
        sign(125, 258, 60, "Games"),
        box(240, 270, 70, 60, 30, 44, { win: true }),
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "bus", x: 330, y: 392, len: 180, dur: 11 },
        ...trees(330, 250, 3, 50, 1),
      ];
    case "factory":
      return [
        // the factory hall, chimneys with smoke and silos
        box(40, 60, 260, 130, 62, 32, { win: false }),
        ...Array.from({ length: 6 }, (_, i) => box(54 + i * 40, 50, 28, 16, 12, 44, { z: 62 })),
        box(330, 40, 28, 28, 130, 36),
        box(380, 54, 28, 28, 110, 36),
        { k: "stack", x: 344, y: 54, h: 130 },
        { k: "stack", x: 394, y: 68, h: 110 },
        box(440, 50, 46, 46, 90, 40),
        box(440, 110, 46, 46, 90, 40),
        sign(170, 56, 90, "Factory"),
        // the assembly line and the warehouse
        box(40, 240, 220, 84, 40, 36, { win: true }),
        flat(40, 334, 220, 20, 20, "yard"),
        box(300, 250, 120, 80, 46, 30),
        sign(360, 246, 66, "Plant"),
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "truck", x: 300, y: 392, len: 180, dur: 8 },
        ...trees(440, 250, 3, 30, 0.9),
      ];
    case "tech":
      return [
        // the data centre: long halls with rows of lights
        box(40, 40, 260, 70, 38, 28, { win: true }),
        box(40, 126, 260, 70, 38, 28, { win: true }),
        ...Array.from({ length: 12 }, (_, i) => box(50 + i * 21, 100, 10, 3, 5, 80, { z: 38 })),
        sign(170, 36, 58, "Data centre"),
        // glass office towers and a campus
        ...tower(340, 36, 96, 96, 190, 30),
        ...tower(456, 74, 74, 74, 120, 34),
        ...roofed(40, 250, 180, 86, 40, 34),
        sign(130, 246, 62, "Labs"),
        box(250, 262, 90, 70, 46, 36, { win: true, glass: true }),
        sign(295, 258, 66, "Cloud"),
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "sedan", x: 330, y: 392, len: 180, dur: 8 },
        ...trees(380, 250, 4, 38, 0.9),
        { k: "drone", x: 330, y: 210, r: 60, dur: 10 },
      ];
    case "creative":
      return [
        // billboards, a studio and a stage
        box(60, 40, 8, 8, 100, 38),
        box(130, 40, 8, 8, 100, 38),
        box(40, 36, 120, 8, 50, 62, { z: 100 }),
        sign(100, 34, 160, "Billboard"),
        box(260, 40, 8, 8, 120, 38),
        box(340, 40, 8, 8, 120, 38),
        box(250, 36, 110, 8, 56, 56, { z: 120 }),
        box(420, 40, 100, 90, 56, 34, { win: true }),
        sign(470, 36, 76, "Studio"),
        box(40, 250, 200, 110, 20, 30),
        box(40, 250, 200, 14, 70, 40),
        box(60, 266, 12, 12, 8, 80, { z: 20 }),
        box(208, 266, 12, 12, 8, 80, { z: 20 }),
        sign(140, 246, 80, "Stage"),
        ...roofed(280, 260, 150, 90, 40, 36),
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "bus", x: 330, y: 392, len: 170, dur: 10 },
        ...trees(450, 270, 3, 32, 1),
      ];
    default:
      return [
        ...tower(40, 40, 100, 100, 170, 30),
        ...tower(170, 60, 90, 90, 120, 34),
        ...tower(300, 40, 110, 100, 200, 28),
        ...tower(440, 70, 80, 80, 110, 36),
        ...roofed(40, 250, 200, 90, 44, 36),
        ...roofed(280, 260, 180, 80, 38, 34),
        flat(0, 404, PW, 14, 26, "road"),
        { k: "veh", v: "sedan", x: 330, y: 392, len: 180, dur: 9 },
        ...trees(40, 360, 5, 50, 0.9),
        ...trees(470, 340, 2, 40, 0.9),
      ];
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------------
// the parts
// ---------------------------------------------------------------------------------------------------------------------------------------

type BoxP = { x: number; y: number; w: number; d: number; h: number; l?: number; z?: number; win?: boolean; glass?: boolean; mark?: string; cls?: string };

/** A box in CSS 3D: a top and four sides (the browser draws only the sides that face the camera). */
export function Box({ x, y, w, d, h, l = 30, z = 0, win, glass, mark, cls }: BoxP) {
  const st: CSSProperties & Record<string, string | number> = { left: x, top: y, width: w, height: d, "--h": `${h}px`, "--l": l };
  if (z) st.transform = `translateZ(${z}px)`;
  return (
    <div className={`cm-box${win ? " cm-win" : ""}${glass ? " cm-glass" : ""}${cls ? ` ${cls}` : ""}`} style={st}>
      <i className="cm-f cm-top" style={{ transform: `translateZ(${h}px)` }}>
        {mark && <b>{mark}</b>}
      </i>
      <i className="cm-f cm-fr" />
      <i className="cm-f cm-rt" />
      <i className="cm-f cm-bk" />
      <i className="cm-f cm-lf" />
    </div>
  );
}

const Wheels = ({ xs, y, z = 0 }: { xs: number[]; y: number; z?: number }) => (
  <>
    {xs.flatMap((x) => [<Box key={`${x}a`} x={x - 5} y={-y - 3} w={10} d={4} h={8} l={6} z={z} />, <Box key={`${x}b`} x={x - 5} y={y - 1} w={10} d={4} h={8} l={6} z={z} />])}
  </>
);

/** the vehicle models are centred on their own origin and look along +x */
export function Vehicle({ v }: { v: "bus" | "truck" | "amb" | "sedan" | "car" }) {
  if (v === "bus")
    return (
      <>
        <Box x={-38} y={-12} w={76} d={24} h={20} l={38} z={3} win glass />
        <Box x={-38} y={-12} w={76} d={24} h={3} l={60} z={23} />
        <Wheels xs={[-24, 22]} y={12} />
      </>
    );
  if (v === "truck")
    return (
      <>
        <Box x={-44} y={-13} w={58} d={26} h={26} l={32} z={4} />
        <Box x={18} y={-12} w={24} d={24} h={18} l={44} z={4} />
        <Box x={28} y={-10} w={12} d={20} h={8} l={70} z={16} glass />
        <Wheels xs={[-30, -12, 28]} y={13} />
      </>
    );
  if (v === "amb")
    return (
      <>
        <Box x={-28} y={-12} w={56} d={24} h={22} l={78} z={4} mark="+" />
        <Box x={18} y={-10} w={12} d={20} h={9} l={60} z={16} glass />
        <Box x={-6} y={-4} w={8} d={8} h={3} l={92} z={26} />
        <Wheels xs={[-18, 16]} y={13} />
      </>
    );
  if (v === "car")
    return (
      <>
        <Box x={-27} y={-12} w={54} d={24} h={10} l={86} z={3} />
        <Box x={-12} y={-10} w={26} d={20} h={9} l={26} z={13} glass />
        <Box x={-10} y={-9} w={22} d={18} h={2} l={92} z={22} />
        <Box x={26} y={-9} w={2} d={5} h={3} l={100} z={7} />
        <Box x={26} y={4} w={2} d={5} h={3} l={100} z={7} />
        <Box x={-28} y={-9} w={2} d={5} h={3} l={40} z={7} />
        <Box x={-28} y={4} w={2} d={5} h={3} l={40} z={7} />
        <Box cls="cm-bl" x={19} y={12} w={6} d={3} h={4} l={50} z={6} />
        <Box cls="cm-bl" x={-25} y={12} w={6} d={3} h={4} l={50} z={6} />
        <Wheels xs={[-17, 15]} y={13} />
      </>
    );
  return (
    <>
      <Box x={-22} y={-10} w={44} d={20} h={8} l={50} z={3} />
      <Box x={-8} y={-8} w={20} d={16} h={8} l={64} z={11} glass />
      <Wheels xs={[-14, 12]} y={11} />
    </>
  );
}

const Plane = () => (
  <>
    <Box x={-48} y={-7} w={96} d={14} h={13} l={62} z={4} />
    <Box x={40} y={-5} w={10} d={10} h={9} l={74} z={5} />
    <Box x={-6} y={-48} w={24} d={96} h={3} l={46} z={7} />
    <Box x={-48} y={-20} w={16} d={40} h={2} l={46} z={10} />
    <Box x={-48} y={-2} w={18} d={4} h={18} l={50} z={10} />
  </>
);

const Drone = ({ pkg }: { pkg?: boolean }) => (
  <>
    <Box x={-9} y={-9} w={18} d={18} h={5} l={60} z={20} />
    <div className="cm-rotor">
      <Box x={-16} y={-2} w={32} d={4} h={1} l={30} z={27} />
      <Box x={-2} y={-16} w={4} d={32} h={1} l={30} z={27} />
    </div>
    {pkg && <Box x={-6} y={-6} w={12} d={12} h={9} l={38} z={9} />}
  </>
);

const Crane = () => (
  <>
    <Box x={-4} y={-4} w={8} d={8} h={170} l={50} />
    <Box x={-110} y={-3} w={190} d={6} h={6} l={56} z={170} />
    <Box x={-110} y={-6} w={26} d={12} h={14} l={30} z={156} />
    <Box x={-4} y={-4} w={8} d={8} h={14} l={64} z={176} />
    <Box x={44} y={-1} w={2} d={2} h={46} l={80} z={124} />
    <Box x={40} y={-5} w={10} d={10} h={7} l={60} z={118} />
  </>
);

const Tree = ({ s = 1 }: { s?: number }) => (
  <>
    <Box x={-3 * s} y={-3 * s} w={6 * s} d={6 * s} h={10 * s} l={16} />
    <Box x={-11 * s} y={-11 * s} w={22 * s} d={22 * s} h={13 * s} l={36} z={10 * s} />
    <Box x={-8 * s} y={-8 * s} w={16 * s} d={16 * s} h={12 * s} l={44} z={23 * s} />
    <Box x={-4.5 * s} y={-4.5 * s} w={9 * s} d={9 * s} h={10 * s} l={52} z={35 * s} />
  </>
);

/** one item of a district, placed on the pad at (ox, oy); the pads of the lower row are mirrored */
export function Piece({ it, ox, oy, flip, lite }: { it: Item; ox: number; oy: number; flip: boolean; lite?: boolean }) {
  const fy = (y: number, d = 0) => oy + (flip ? PH - y - d : y);
  // a district that is far from the car is drawn with its big buildings only (fewer layers, a smoother scroll)
  if (lite && (it.k !== "box" || it.h < 46)) return null;
  switch (it.k) {
    case "box":
      return <Box x={ox + it.x} y={fy(it.y, it.d)} w={it.w} d={it.d} h={it.h} l={it.l} z={it.z} win={lite ? false : it.win} glass={lite ? false : it.glass} mark={lite ? undefined : it.mark} />;
    case "flat":
      return <div className={`cm-flat cm-p-${it.pat ?? "none"}`} style={{ left: ox + it.x, top: fy(it.y, it.d), width: it.w, height: it.d, "--l": it.l ?? 20 } as CSSProperties} />;
    case "tree":
      return (
        <div className="cm-at" style={{ left: ox + it.x, top: fy(it.y) }}>
          <Tree s={it.s} />
        </div>
      );
    case "sign":
      return (
        <div className="cm-sign" style={{ left: ox + it.x, top: fy(it.y), transform: `translateZ(${it.z}px)` }}>
          <span>{it.t}</span>
        </div>
      );
    case "veh":
      return (
        <div className="cm-at" style={{ left: ox + it.x, top: fy(it.y) }}>
          <div className="cm-shuttle" style={{ "--len": `${it.len ?? 100}px`, "--dur": `${it.dur ?? 8}s`, animationDelay: `${it.delay ?? 0}s` } as CSSProperties}>
            <Vehicle v={it.v} />
          </div>
        </div>
      );
    case "plane":
      return (
        <div className="cm-at" style={{ left: ox + it.x, top: fy(it.y) }}>
          <div className="cm-takeoff">
            <Plane />
          </div>
        </div>
      );
    case "drone":
      return (
        <div className="cm-at" style={{ left: ox + it.x, top: fy(it.y) }}>
          <div className="cm-orbit" style={{ "--r": `${it.r ?? 60}px`, "--dur": `${it.dur ?? 10}s` } as CSSProperties}>
            <div className="cm-hover">
              <Drone pkg={it.pkg} />
            </div>
          </div>
        </div>
      );
    case "crane":
      return (
        <div className="cm-at" style={{ left: ox + it.x, top: fy(it.y) }}>
          <div className="cm-swing">
            <Crane />
          </div>
        </div>
      );
    case "stack":
      return (
        <div className="cm-at" style={{ left: ox + it.x, top: fy(it.y) }}>
          <i className="cm-smoke" style={{ transform: `translateZ(${it.h}px)` }} />
          <i className="cm-smoke cm-smoke-b" style={{ transform: `translateZ(${it.h}px)` }} />
        </div>
      );
  }
}
