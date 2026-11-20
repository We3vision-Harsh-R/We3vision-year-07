// Draws the 20 cover pictures of the game series of the blog (public/images/blog/<slug>.webp, 1600 x 900) from code: our own flat drawings, no text, no outside art.
//   node tools/make-blog-covers.mjs            writes all 20 files
//   node tools/make-blog-covers.mjs vehicle    only the files whose address contains "vehicle"
// Each picture shows the subject of its article (a streamed map, a car with its springs, a path on a grid, servers and players ...). The middle band stays calm
// because social networks crop a 16:9 picture to a wider shape. The alt text of the pictures is the title of the article (components/site/blog-post.tsx).
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";

const W = 1600;
const H = 900;
const C = { bg1: "#0a0211", bg2: "#1d0a33", pink: "#ff4fa3", sun: "#ffb04a", cyan: "#46e3ff", lilac: "#b58cff", white: "#f6eeff", dim: "#ffffff1f", dim2: "#ffffff38" };
const f = (n) => Math.round(n * 10) / 10;
const rect = (x, y, w, h, fill, extra = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;
const circ = (x, y, r, fill, extra = "") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
const ring = (x, y, r, stroke, sw = 3, extra = "") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, sw = 3, extra = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${extra}/>`;
const poly = (pts, fill, stroke = "none", sw = 3, extra = "") => `<polygon points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
const path = (d, stroke, sw = 4, fill = "none", extra = "") => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const pl = (pts, stroke, sw = 4, extra = "") => path("M" + pts.map((p) => p.map(f).join(" ")).join(" L"), stroke, sw, "none", extra);
const glow = (id, c, s = 12) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${s}"/></filter>`;
const rr = (x, y, w, h, r, fill, extra = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}" ${extra}/>`;
// a small deterministic "random": the same picture every time
const rnd = (seed) => { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };
const noise = (x, y) => Math.sin(x * 1.7 + y * 0.9) * 0.5 + Math.sin(x * 0.8 - y * 1.9 + 2) * 0.3 + Math.sin(x * 3.1 + y * 2.3) * 0.2;

// an isometric box: i, j on the grid, h = height
function iso(cx, cy, i, j, h, tw, th, top, left, right) {
  const x = cx + (i - j) * tw;
  const y = cy + (i + j) * th - h;
  const t = [[x, y - th], [x + tw, y], [x, y + th], [x - tw, y]];
  return (
    poly([[x - tw, y], [x, y + th], [x, y + th + h], [x - tw, y + h]], left, C.bg1, 1) +
    poly([[x + tw, y], [x, y + th], [x, y + th + h], [x + tw, y + h]], right, C.bg1, 1) +
    poly(t, top, C.bg1, 1)
  );
}

const sun = (x, y, r) => `<g>${circ(x, y, r * 1.8, C.sun, 'opacity="0.18" filter="url(#g1)"')}${circ(x, y, r, C.sun)}</g>`;

const covers = {
  "how-gta-style-open-world-games-are-made": () => {
    let s = sun(1180, 300, 70);
    const heights = [];
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) heights.push([i, j, 20 + Math.abs(noise(i, j)) * 150 * (1 + ((i * 3 + j * 5) % 4) / 4)]);
    heights.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
    for (const [i, j, h] of heights) s += iso(800, 330, i, j, h, 62, 31, "#3b2a66", "#241347", "#31195a");
    s += pl([[800, 640], [800 - 62 * 2, 640 - 31 * 3], [800 - 62 * 5, 640 - 31 * 6], [800 + 62 * 2, 640 - 31 * 10], [800 + 62 * 4, 640 - 31 * 13]], C.pink, 6, 'filter="url(#g1)" opacity="0.9"');
    s += pl([[800, 640], [800 - 62 * 2, 640 - 31 * 3], [800 - 62 * 5, 640 - 31 * 6], [800 + 62 * 2, 640 - 31 * 10], [800 + 62 * 4, 640 - 31 * 13]], C.pink, 3);
    s += circ(800, 640, 11, C.cyan);
    return s;
  },
  "open-world-map-streaming-chunks-and-lod": () => {
    let s = "";
    const cw = 150, ch = 110, ox = 800 - cw * 4.5, oy = 450 - ch * 2.5;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) {
      const d = Math.hypot(i - 4, (j - 2) * 1.2);
      const near = d < 1.7, mid = d < 3;
      s += rr(ox + i * cw + 6, oy + j * ch + 6, cw - 12, ch - 12, 10, near ? "#5b2d9a" : mid ? "#2d1856" : "#150a2a", near ? `stroke="${C.cyan}" stroke-width="3"` : `stroke="${C.dim2}" stroke-width="2" stroke-dasharray="${mid ? "0" : "8 8"}"`);
      if (near) s += rr(ox + i * cw + 26, oy + j * ch + 26, cw - 52, ch - 52, 6, C.lilac, 'opacity="0.35"');
    }
    s += ring(800, 450, 190, C.sun, 4, 'stroke-dasharray="14 12"');
    s += circ(800, 450, 22, C.sun) + ring(800, 450, 40, C.sun, 3, 'opacity="0.5"');
    return s;
  },
  "vehicle-physics-in-3d-games-explained": () => {
    let s = line(120, 650, 1480, 650, C.dim2, 4) + line(120, 700, 1480, 700, C.dim, 3, 'stroke-dasharray="40 30"');
    s += path("M360 600 L360 520 Q380 440 560 430 L820 430 Q960 360 1090 440 L1240 450 Q1290 470 1290 540 L1290 600 Z", "#7a3cc9", 5, "#3a1b6b");
    s += poly([[860, 445], [960, 392], [1050, 445]], "#150a2a", C.cyan, 3);
    for (const x of [560, 1090]) {
      s += circ(x, 610, 78, "#0d0617", `stroke="${C.white}" stroke-width="6"`) + circ(x, 610, 30, C.dim2);
      const top = 470;
      let d = `M${x} ${top}`; for (let k = 0; k < 7; k++) d += ` L${x + (k % 2 ? 26 : -26)} ${top + 16 + k * 14}`; d += ` L${x} 565`;
      s += path(d, C.sun, 6);
      s += line(x - 60, 470, x + 60, 470, C.sun, 8);
    }
    s += line(560, 340, 560, 400, C.cyan, 6) + poly([[545, 400], [575, 400], [560, 428]], C.cyan);
    s += line(1090, 340, 1090, 400, C.cyan, 6) + poly([[1075, 400], [1105, 400], [1090, 428]], C.cyan);
    s += pl([[1330, 520], [1440, 520]], C.pink, 6) + poly([[1440, 502], [1470, 520], [1440, 538]], C.pink);
    s += circ(820, 505, 12, C.pink);
    return s;
  },
  "traffic-and-crowd-ai-in-open-world-games": () => {
    let s = "";
    for (const y of [330, 450, 570]) s += rect(80, y - 34, 1440, 68, "#160a2b") + line(80, y, 1520, y, C.dim2, 3, 'stroke-dasharray="36 28"');
    s += rect(1010, 170, 70, 560, "#160a2b");
    const r = rnd(5);
    for (const [y, , col] of [[312, 1, C.pink], [348, -1, C.cyan], [432, 1, C.sun], [468, -1, C.lilac], [552, 1, C.pink], [588, -1, C.cyan]])
      for (let k = 0; k < 4; k++) { const x = 140 + k * 340 + r() * 120; s += rr(x, y - 11, 64, 22, 8, col) + rr(x + 36, y - 8, 20, 16, 4, "#0a0211", 'opacity="0.55"'); }
    for (let k = 0; k < 46; k++) { const x = 100 + r() * 1400, y = r() < 0.5 ? 262 + r() * 18 : 625 + r() * 18; s += circ(x, y, 6, C.white, 'opacity="0.85"'); }
    for (let k = 0; k < 14; k++) s += circ(1045 + (r() - 0.5) * 40, 190 + r() * 520, 6, C.sun);
    s += ring(800, 450, 330, C.cyan, 3, 'stroke-dasharray="6 14" opacity="0.7"') + circ(800, 450, 14, C.white);
    return s;
  },
  "pathfinding-navmesh-and-a-star-in-games": () => {
    let s = "";
    const cols = 15, rows = 8, cw = 90, ox = 800 - cols * cw / 2, oy = 450 - rows * cw / 2;
    const block = new Set(["4,1", "4,2", "4,3", "4,4", "5,4", "6,4", "7,4", "7,3", "7,2", "9,2", "9,3", "9,4", "9,5", "9,6", "10,6", "11,6", "11,5", "11,4", "2,5", "2,6", "3,6", "6,6", "6,7"]);
    const open = new Set(["1,3", "2,3", "3,2", "3,1", "5,1", "5,2", "5,3", "6,3", "7,5", "8,5", "8,4", "8,3", "10,3", "12,3", "12,2", "13,3", "2,4", "3,4", "3,5", "1,4", "2,2", "6,2", "10,4", "10,5", "12,4"]);
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const k = `${i},${j}`;
      s += rect(ox + i * cw + 2, oy + j * cw + 2, cw - 4, cw - 4, block.has(k) ? "#3a2670" : open.has(k) ? "#2a5a78" : "#140a26", open.has(k) ? 'opacity="0.55"' : "");
    }
    const P = [[0, 3], [1, 3], [2, 3], [3, 2], [3, 1], [3, 0], [4, 0], [5, 0], [5, 1], [5, 2], [5, 3], [6, 3], [7, 3], [8, 3], [8, 4], [8, 5], [9, 5], [9, 6], [10, 7], [11, 7], [12, 6], [13, 5], [14, 4]].map(([i, j]) => [ox + i * cw + cw / 2, oy + j * cw + cw / 2]);
    s += pl(P, C.sun, 12, 'filter="url(#g1)" opacity="0.7"') + pl(P, C.sun, 6);
    s += circ(P[0][0], P[0][1], 22, C.cyan) + poly([[P[22][0], P[22][1] - 28], [P[22][0] + 24, P[22][1]], [P[22][0], P[22][1] + 28], [P[22][0] - 24, P[22][1]]], C.pink);
    return s;
  },
  "multiplayer-game-architecture-client-server": () => {
    let s = "";
    const clients = [[260, 230], [260, 450], [260, 670], [1340, 230], [1340, 450], [1340, 670]];
    for (const [x, y] of clients) {
      s += line(x, y, 800, 450, C.dim2, 4) + circ((x + 800) / 2, (y + 450) / 2, 8, C.cyan);
      s += rr(x - 70, y - 48, 140, 96, 14, "#25104a", `stroke="${C.lilac}" stroke-width="3"`) + rr(x - 50, y - 30, 100, 56, 6, "#0b0415") + rr(x - 24, y + 34, 48, 6, 3, C.lilac);
    }
    for (let k = 0; k < 3; k++) { s += rr(690, 330 + k * 82, 220, 70, 14, k === 1 ? "#5b2d9a" : "#3a1b6b", `stroke="${C.pink}" stroke-width="3"`); s += circ(725, 365 + k * 82, 8, C.cyan) + circ(755, 365 + k * 82, 8, C.sun) + rr(820, 358 + k * 82, 70, 14, 7, C.dim2); }
    return s;
  },
  "netcode-lag-prediction-and-interpolation": () => {
    let s = line(140, 330, 1460, 330, C.dim2, 4) + line(140, 600, 1460, 600, C.dim2, 4);
    for (let k = 0; k < 9; k++) { const x = 200 + k * 150; s += line(x, 310, x, 350, C.cyan, 4) + line(x + 70, 580, x + 70, 620, C.pink, 4); s += pl([[x, 350], [x + 70, 580]], C.dim, 3, 'stroke-dasharray="10 10"'); }
    s += path("M200 470 C 350 330, 500 330, 650 460 S 950 590, 1100 450 S 1300 330, 1400 440", C.sun, 6, "none", 'stroke-dasharray="1 0"');
    for (let k = 0; k < 5; k++) s += circ(200 + k * 300, k % 2 ? 420 : 470, 14, C.white);
    s += path("M200 560 C 350 460, 500 470, 650 520 S 950 640, 1100 560", C.lilac, 4, "none", 'stroke-dasharray="14 12"');
    s += circ(1260, 330, 26, C.cyan) + circ(1260, 600, 26, C.pink);
    return s;
  },
  "scaling-game-servers-for-thousands-of-players": () => {
    let s = "";
    const r = rnd(9);
    for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) {
      const x = 170 + col * 190, y = 190 + row * 210, on = (row * 7 + col) % 5 !== 3;
      s += rr(x, y, 150, 150, 14, on ? "#2d1659" : "#120822", `stroke="${on ? C.lilac : C.dim2}" stroke-width="3"`);
      if (on) { for (let k = 0; k < 8; k++) s += circ(x + 28 + (k % 4) * 30, y + 38 + Math.floor(k / 4) * 34, 9, [C.cyan, C.pink, C.sun, C.white][Math.floor(r() * 4)]); s += rr(x + 24, y + 110, 102, 12, 6, C.dim2); s += rr(x + 24, y + 110, 40 + r() * 60, 12, 6, C.sun); }
      else s += line(x + 40, y + 75, x + 110, y + 75, C.dim2, 6, 'stroke-dasharray="4 14"');
    }
    s += poly([[800, 90], [830, 130], [770, 130]], C.cyan) + line(800, 130, 800, 165, C.cyan, 6);
    return s;
  },
  "mission-and-quest-systems-in-open-world-games": () => {
    let s = "";
    const N = [[220, 450, "c"], [480, 300, "d"], [480, 600, "d"], [760, 450, "c"], [1040, 300, "c"], [1040, 600, "d"], [1330, 450, "p"]];
    const E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]];
    for (const [a, b] of E) s += line(N[a][0], N[a][1], N[b][0], N[b][1], C.dim2, 5);
    s += pl([[220, 450], [480, 300], [760, 450], [1040, 300], [1330, 450]], C.sun, 7, 'filter="url(#g1)" opacity="0.8"') + pl([[220, 450], [480, 300], [760, 450], [1040, 300], [1330, 450]], C.sun, 4);
    for (const [x, y, t] of N) {
      if (t === "c") s += circ(x, y, 44, "#2d1659", `stroke="${C.lilac}" stroke-width="4"`) + circ(x, y, 12, C.cyan);
      else if (t === "d") s += poly([[x, y - 52], [x + 52, y], [x, y + 52], [x - 52, y]], "#2d1659", C.pink, 4) + circ(x, y, 9, C.pink);
      else s += path(`M${x} ${y - 60} C ${x + 46} ${y - 60}, ${x + 46} ${y}, ${x} ${y + 46} C ${x - 46} ${y}, ${x - 46} ${y - 60}, ${x} ${y - 60} Z`, C.sun, 5, C.sun) + circ(x, y - 22, 14, C.bg1);
    }
    return s;
  },
  "third-person-camera-and-controls-in-3d-games": () => {
    let s = line(120, 700, 1480, 700, C.dim2, 4);
    s += poly([[300, 300], [300, 560], [820, 470]], "#5b2d9a", "none", 0, 'opacity="0.18"') + pl([[300, 300], [820, 470], [300, 560]], C.cyan, 3, 'opacity="0.7"');
    s += rr(250, 360, 90, 140, 14, "#25104a", `stroke="${C.cyan}" stroke-width="4"`) + circ(295, 345, 22, C.cyan) + ring(295, 345, 36, C.cyan, 2, 'opacity="0.4"');
    s += path("M295 520 Q 520 470, 820 420", C.dim2, 4, "none", 'stroke-dasharray="14 10"');
    s += rr(870, 350, 70, 220, 35, "#7a3cc9", `stroke="${C.white}" stroke-width="3"`) + circ(905, 330, 30, "#7a3cc9", `stroke="${C.white}" stroke-width="3"`);
    s += path("M1020 600 Q 1100 520, 1180 600 T 1340 600", C.sun, 6) + path("M1020 650 Q 1100 570, 1180 650 T 1340 650", C.dim2, 4);
    s += circ(1420, 400, 60, "none", `stroke="${C.pink}" stroke-width="5"`) + circ(1420, 400, 20, C.pink) + circ(1420, 400, 6, C.bg1);
    return s;
  },
  "3d-model-pipeline-for-games-concept-to-engine": () => {
    let s = "";
    const cubes = [[260, "wire"], [600, "flat"], [940, "tex"], [1280, "final"]];
    for (const [x, kind] of cubes) {
      const y = 450, a = 100;
      const top = [[x, y - a], [x + a, y - a / 2], [x, y], [x - a, y - a / 2]], left = [[x - a, y - a / 2], [x, y], [x, y + a], [x - a, y + a / 2]], right = [[x + a, y - a / 2], [x, y], [x, y + a], [x + a, y + a / 2]];
      if (kind === "wire") { for (const p of [top, left, right]) s += poly(p, "none", C.cyan, 3); s += pl([[x - a, y - a / 2], [x + a, y + a / 2]], C.cyan, 2, 'opacity="0.5"') + pl([[x + a, y - a / 2], [x - a, y + a / 2]], C.cyan, 2, 'opacity="0.5"'); }
      if (kind === "flat") { s += poly(left, "#3a1b6b") + poly(right, "#4b2689") + poly(top, "#6a38b8"); }
      if (kind === "tex") { s += poly(left, "#3a1b6b") + poly(right, "#4b2689") + poly(top, "#6a38b8"); for (let k = 1; k < 4; k++) s += pl([[x - a + (k * a) / 4, y - a / 2 + (k * a) / 8 + a / 4 * 0], [x - a + (k * a) / 4, y + (k * a) / 8 + a / 2 * 0 + a - a / 2]], C.sun, 2, 'opacity="0.0"'); for (const p of [top, left, right]) s += poly(p, "none", C.sun, 3, 'stroke-dasharray="10 8"'); }
      if (kind === "final") { s += circ(x, y, 150, C.pink, 'opacity="0.16" filter="url(#g1)"') + poly(left, "#4b2689", C.white, 3) + poly(right, "#7a3cc9", C.white, 3) + poly(top, "#a76bff", C.white, 3) + circ(x - 8, y - 40, 12, C.white); }
    }
    for (const x of [430, 770, 1110]) s += pl([[x - 20, 450], [x + 20, 450]], C.white, 5) + poly([[x + 20, 434], [x + 44, 450], [x + 20, 466]], C.white);
    return s;
  },
  "rendering-big-3d-cities-culling-and-draw-calls": () => {
    let s = "";
    s += poly([[300, 450], [1250, 130], [1250, 770]], "#46e3ff", "none", 0, 'opacity="0.10"') + pl([[300, 450], [1250, 130]], C.cyan, 4) + pl([[300, 450], [1250, 770]], C.cyan, 4);
    s += rr(240, 410, 90, 80, 14, "#25104a", `stroke="${C.cyan}" stroke-width="4"`);
    const r = rnd(12);
    for (let k = 0; k < 34; k++) {
      const x = 420 + r() * 1080, y = 110 + r() * 680, w = 44 + r() * 60, h = 44 + r() * 70;
      const inside = x > 330 && Math.abs(y + h / 2 - 450) < (x - 300) * 0.34;
      s += rr(x, y, w, h, 8, inside ? "#6a38b8" : "#1a0d31", inside ? `stroke="${C.white}" stroke-width="2"` : `stroke="${C.dim2}" stroke-width="2"`);
    }
    s += rr(760, 330, 120, 240, 10, "#0b0415", `stroke="${C.pink}" stroke-width="3" stroke-dasharray="12 8"`);
    return s;
  },
  "day-night-cycle-lighting-and-weather-in-games": () => {
    let s = `<clipPath id="half"><rect x="0" y="0" width="${W / 2}" height="${H}"/></clipPath>`;
    s += rect(0, 0, W / 2, 650, "#40306e", 'opacity="0.55"') + rect(W / 2, 0, W / 2, 650, "#0b0620", 'opacity="0.9"');
    s += path("M200 650 A 600 600 0 0 1 1400 650", C.dim2, 4, "none", 'stroke-dasharray="14 12"');
    s += sun(330, 400, 64) + circ(1270, 400, 50, "#e7e7ff") + circ(1292, 388, 44, "#0b0620");
    const r = rnd(3);
    for (let k = 0; k < 26; k++) s += circ(820 + r() * 700, 80 + r() * 330, 3, C.white, 'opacity="0.8"');
    const hs = [120, 200, 150, 260, 180, 230, 140, 210, 170, 250, 130, 190, 160, 240];
    hs.forEach((h, i) => {
      const x = 80 + i * 100; s += rect(x, 650 - h, 80, h, i < 7 ? "#2a1b52" : "#150c2b");
      for (let k = 0; k < Math.floor(h / 40); k++) for (let q = 0; q < 2; q++) s += rect(x + 14 + q * 34, 650 - h + 16 + k * 40, 18, 22, i < 7 ? "#4b3a86" : r() < 0.6 ? C.sun : "#2a1b52");
    });
    s += rect(0, 650, W, 250, "#0d0617") + line(0, 650, W, 650, C.dim2, 3);
    s += path("M620 280 Q 640 240, 700 250 Q 730 200, 790 240 Q 850 230, 850 280 Z", "#ffffff", 3, C.dim2, 'opacity="0.7"');
    for (let k = 0; k < 6; k++) s += line(680 + k * 30, 300, 664 + k * 30, 350, C.cyan, 3, 'opacity="0.8"');
    return s;
  },
  "procedural-generation-for-3d-game-worlds": () => {
    let s = "";
    for (let row = 0; row < 16; row++) {
      const y0 = 300 + row * 34, pts = [];
      for (let k = 0; k <= 60; k++) { const x = 100 + k * 23.3; pts.push([x, y0 - Math.max(0, noise(k / 6, row / 3.2)) * 190 - Math.abs(noise(k / 2.2, row)) * 22]); }
      const d = "M" + pts.map((p) => p.map(f).join(" ")).join(" L") + ` L1500 ${y0 + 90} L100 ${y0 + 90} Z`;
      s += path(d, row > 10 ? C.pink : C.lilac, 3, `hsl(${265 + row * 2} 60% ${9 + row * 0.9}%)`, `opacity="${0.5 + row * 0.03}"`);
    }
    s += sun(1330, 210, 44);
    return s;
  },
  "spatial-audio-and-sound-design-in-3d-games": () => {
    let s = "";
    for (let k = 1; k <= 7; k++) s += ring(520, 450, k * 62, k % 2 ? C.pink : C.lilac, 4, `opacity="${1 - k * 0.11}"`);
    s += circ(520, 450, 26, C.sun);
    const pts = []; for (let k = 0; k <= 70; k++) { const x = 760 + k * 10, env = Math.sin((k / 70) * Math.PI); pts.push([x, 450 + Math.sin(k * 0.9) * 150 * env * (0.4 + 0.6 * Math.abs(Math.sin(k * 0.31)))]); }
    s += pl(pts, C.cyan, 5);
    s += pl(pts.map(([x, y]) => [x, 900 - y]), C.cyan, 3, 'opacity="0.35"');
    s += circ(1500, 450, 62, "#25104a", `stroke="${C.white}" stroke-width="4"`) + path("M1440 450 A 60 60 0 0 1 1440 380", C.dim2, 4) + rr(1470, 410, 26, 80, 12, C.sun);
    return s;
  },
  "game-ui-minimaps-waypoints-and-hud-design": () => {
    let s = `<clipPath id="mm"><circle cx="560" cy="450" r="320"/></clipPath>`;
    s += circ(560, 450, 332, "#0b0415", `stroke="${C.white}" stroke-width="6"`);
    s += `<g clip-path="url(#mm)">` + rect(240, 130, 640, 640, "#170b2d");
    for (const y of [250, 380, 520, 650]) s += line(240, y, 880, y, "#2d1659", 26);
    for (const x of [360, 520, 700, 820]) s += line(x, 130, x, 770, "#2d1659", 26);
    s += pl([[560, 450], [560, 380], [700, 380], [700, 250], [820, 250]], C.sun, 9, 'filter="url(#g1)" opacity="0.6"') + pl([[560, 450], [560, 380], [700, 380], [700, 250], [820, 250]], C.sun, 6) + `</g>`;
    s += poly([[560, 410], [584, 468], [560, 452], [536, 468]], C.cyan) + poly([[820, 202], [846, 250], [794, 250]], C.pink);
    s += ring(560, 450, 345, C.dim2, 3, 'stroke-dasharray="3 14"');
    s += rr(1000, 230, 440, 70, 16, "#25104a", `stroke="${C.lilac}" stroke-width="3"`) + rr(1000, 360, 440, 70, 16, "#25104a") + rr(1000, 490, 440, 70, 16, "#25104a") + rr(1030, 255, 260, 20, 10, C.cyan) + rr(1030, 385, 180, 20, 10, C.pink) + rr(1030, 515, 320, 20, 10, C.sun);
    s += path("M1100 680 L1180 640 L1260 680", C.pink, 6) + circ(1180, 720, 10, C.pink);
    return s;
  },
  "player-accounts-and-databases-for-online-games": () => {
    let s = "";
    for (const x of [380, 800, 1220]) {
      s += `<rect x="${x - 130}" y="330" width="260" height="250" fill="#25104a"/>` + `<ellipse cx="${x}" cy="580" rx="130" ry="44" fill="#25104a" stroke="${C.lilac}" stroke-width="4"/>` + `<ellipse cx="${x}" cy="330" rx="130" ry="44" fill="#5b2d9a" stroke="${C.lilac}" stroke-width="4"/>`;
      s += line(x - 130, 330, x - 130, 580, C.lilac, 4) + line(x + 130, 330, x + 130, 580, C.lilac, 4);
      for (const y of [420, 500]) s += `<ellipse cx="${x}" cy="${y}" rx="130" ry="44" fill="none" stroke="${C.lilac}" stroke-width="3" opacity="0.6"/>`;
    }
    for (const [x, y] of [[380, 160], [800, 160], [1220, 160]]) { s += rr(x - 90, y - 44, 180, 88, 14, "#2d1659", `stroke="${C.cyan}" stroke-width="3"`) + circ(x - 44, y, 20, C.cyan) + rr(x - 10, y - 14, 80, 12, 6, C.dim2) + rr(x - 10, y + 6, 54, 12, 6, C.dim2); s += pl([[x, y + 44], [x, 330 - 44]], C.dim2, 4, 'stroke-dasharray="10 10"'); }
    s += rr(740, 700, 120, 100, 16, C.sun) + path("M770 700 L770 660 A 30 30 0 0 1 830 660 L830 700", C.sun, 12) + circ(800, 752, 12, C.bg1);
    return s;
  },
  "anti-cheat-and-security-for-online-games": () => {
    let s = glowless();
    s += path("M800 130 L1090 230 L1090 470 Q1090 640 800 770 Q510 640 510 470 L510 230 Z", C.pink, 8, "#25104a");
    s += path("M800 190 L1030 268 L1030 468 Q1030 600 800 710 Q570 600 570 468 L570 268 Z", C.dim2, 3, "#170b2d");
    s += pl([[690, 450], [770, 540], [920, 360]], C.cyan, 22) + pl([[690, 450], [770, 540], [920, 360]], "#0b0415", 8);
    const r = rnd(21);
    for (let k = 0; k < 9; k++) { const x = 160 + r() * 280, y = 150 + r() * 600; s += circ(x, y, 10, C.sun) + pl([[x, y], [510, 450]], C.sun, 3, 'stroke-dasharray="8 10" opacity="0.6"'); }
    s += pl([[1180, 360], [1210, 420], [1180, 480]], C.pink, 6) + pl([[1240, 330], [1280, 420], [1240, 510]], C.pink, 6, 'opacity="0.6"');
    return s;
  },
  "unity-vs-unreal-engine-open-world-games": () => {
    const hex = (cx, cy, r) => [0, 1, 2, 3, 4, 5].map((k) => [cx + r * Math.cos((Math.PI / 3) * k + Math.PI / 6), cy + r * Math.sin((Math.PI / 3) * k + Math.PI / 6)]);
    let s = poly(hex(640, 450, 300), "#0c4a63", C.cyan, 8, 'opacity="0.55"') + poly(hex(960, 450, 300), "#7a1a55", C.pink, 8, 'opacity="0.55"');
    s += poly(hex(640, 450, 300), "none", C.cyan, 8) + poly(hex(960, 450, 300), "none", C.pink, 8);
    s += poly(hex(800, 450, 120), C.white, "none", 0, 'opacity="0.16"') + circ(800, 450, 26, C.sun);
    for (const [x, y, c] of [[470, 340, C.cyan], [470, 560, C.cyan], [1130, 340, C.pink], [1130, 560, C.pink]]) s += circ(x, y, 14, c) + pl([[x, y], [800, 450]], c, 3, 'opacity="0.6"');
    return s;
  },
  "gta-style-game-development-cost-time-and-team": () => {
    let s = "";
    const bars = [[160, 0, 420, C.cyan], [560, 1, 560, C.lilac], [300, 2, 760, C.pink], [820, 3, 520, C.sun], [520, 4, 760, C.cyan], [1100, 5, 340, C.pink]];
    bars.forEach(([x, i, w, c]) => { const y = 200 + i * 100; s += rr(x, y, w, 52, 14, c, 'opacity="0.85"') + rr(x + 14, y + 20, w * 0.4, 12, 6, C.bg1, 'opacity="0.35"'); });
    for (let k = 0; k <= 8; k++) s += line(160 + k * 160, 160, 160 + k * 160, 780, C.dim, 2);
    for (const x of [480, 800, 1120]) s += poly([[x, 150], [x + 20, 176], [x, 202], [x - 20, 176]], C.sun);
    s += circ(1380, 700, 62, C.sun) + circ(1380, 700, 40, "none", `stroke="${C.bg1}" stroke-width="6"`) + circ(1480, 640, 34, C.sun, 'opacity="0.75"');
    return s;
  },
  // the two first articles of the blog (their pictures are public/images/blog/ui-ux-design.webp and ai-automation.webp)
  "ui-ux-design": () => {
    const edge = 'stroke="#7a52d6" stroke-width="4"';
    let s = "";
    // a phone wireframe
    s += rr(330, 170, 300, 540, 38, "#1b0c33", edge);
    s += rr(400, 190, 160, 20, 10, "#000000");
    s += rr(360, 240, 240, 36, 10, "#2b1650") + circ(384, 258, 9, C.pink);
    s += rr(360, 296, 240, 150, 14, "#3b2a66") + path("M380 420 L430 360 L470 400 L520 340 L580 420", C.cyan, 4);
    s += rr(360, 466, 150, 14, 7, "#5b3fa0") + rr(360, 492, 200, 14, 7, "#3b2a66") + rr(360, 518, 120, 14, 7, "#3b2a66");
    s += rr(360, 580, 240, 56, 28, C.pink) + rr(392, 603, 176, 10, 5, "#1d0a33");
    s += rr(360, 654, 240, 30, 15, "#241347");
    // a browser window
    s += rr(720, 230, 560, 380, 22, "#1b0c33", edge);
    s += rr(720, 230, 560, 52, 22, "#2b1650") + circ(752, 256, 7, C.pink) + circ(776, 256, 7, C.sun) + circ(800, 256, 7, C.cyan);
    const cards = [[750, 312, "#3b2a66"], [930, 312, "#2f1c58"], [1110, 312, "#3b2a66"], [750, 462, "#2f1c58"], [930, 462, "#3b2a66"], [1110, 462, "#2f1c58"]];
    cards.forEach(([x, y, c], i) => {
      s += rr(x, y, 150, 120, 14, c, i === 4 ? `stroke="${C.cyan}" stroke-width="4"` : "") + rr(x + 16, y + 74, 90, 10, 5, "#5b3fa0") + rr(x + 16, y + 94, 60, 10, 5, "#4a3188");
    });
    // a cursor on the chosen card, and a dashed flow from the phone to the page
    s += pl([[640, 440], [690, 400], [720, 410]], C.pink, 4, 'stroke-dasharray="10 12"');
    s += ring(1034, 560, 30, C.pink, 3, 'opacity="0.6"') + poly([[1020, 540], [1020, 600], [1036, 586], [1050, 616], [1064, 610], [1050, 580], [1070, 576]], C.white, C.bg1, 3);
    // the palette
    [C.pink, C.sun, C.cyan, C.lilac].forEach((c, i) => (s += circ(780 + i * 66, 676, 22, c)));
    return s;
  },
  "ai-automation": () => {
    const edge = 'stroke="#7a52d6" stroke-width="4"';
    let s = "";
    // three things come in (an e-mail, a form, a chat) ...
    const ins = [210, 380, 550];
    s += rr(250, ins[0] - 46, 150, 92, 18, "#1b0c33", edge) + rect(274, ins[0] - 22, 102, 56, "#3b2a66") + pl([[274, ins[0] - 22], [325, ins[0] + 12], [376, ins[0] - 22]], C.sun, 4);
    s += rr(250, ins[1] - 46, 150, 92, 18, "#1b0c33", edge) + rr(274, ins[1] - 28, 102, 12, 6, "#5b3fa0") + rr(274, ins[1] - 6, 70, 12, 6, "#3b2a66") + rr(274, ins[1] + 16, 90, 12, 6, "#3b2a66");
    s += rr(250, ins[2] - 46, 150, 92, 18, "#1b0c33", edge) + rr(274, ins[2] - 30, 78, 38, 14, C.cyan, 'opacity="0.85"') + rr(326, ins[2] - 2, 56, 30, 12, C.pink, 'opacity="0.85"');
    // ... the AI in the middle ...
    s += circ(800, 380, 190, C.lilac, 'opacity="0.12" filter="url(#g1)"');
    s += circ(800, 380, 130, "#1b0c33", edge) + ring(800, 380, 100, C.cyan, 3, 'opacity="0.7"') + circ(800, 380, 52, C.pink);
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      s += line(800 + Math.cos(a) * 62, 380 + Math.sin(a) * 62, 800 + Math.cos(a) * 100, 380 + Math.sin(a) * 100, C.cyan, 3, 'opacity="0.7"') + circ(800 + Math.cos(a) * 100, 380 + Math.sin(a) * 100, 6, C.cyan);
    }
    s += circ(782, 372, 8, "#1d0a33") + circ(818, 372, 8, "#1d0a33") + path("M780 398 Q800 416 820 398", "#1d0a33", 5);
    // ... and the work that is done comes out (checked boxes)
    const outs = [210, 380, 550];
    outs.forEach((y, i) => {
      s += rr(1200, y - 46, 150, 92, 18, "#1b0c33", edge) + rr(1224, y - 22, 44, 44, 12, i === 1 ? C.sun : C.cyan) + path(`M1234 ${y} L1244 ${y + 11} L1260 ${y - 12}`, "#1d0a33", 6) + rr(1282, y - 16, 44, 10, 5, "#5b3fa0") + rr(1282, y + 6, 30, 10, 5, "#3b2a66");
    });
    // the flows
    ins.forEach((y) => (s += path(`M400 ${y} C 520 ${y}, 560 380, 668 380`, C.pink, 4, "none", 'stroke-dasharray="12 12"')));
    outs.forEach((y) => (s += path(`M932 380 C 1040 380, 1080 ${y}, 1200 ${y}`, C.cyan, 4, "none", 'stroke-dasharray="12 12"')));
    return s;
  },
};
function glowless() { return ""; }

// the common mood of the series: a low neon city at dusk along the bottom edge (our own drawing)
function skyline(seed) {
  const r = rnd(seed + 40);
  let s = rect(0, 800, W, 100, "#07010d") + line(0, 800, W, 800, C.pink, 3, 'opacity="0.55"') + rect(0, 760, W, 40, C.pink, 'opacity="0.05"');
  for (let x = 0; x < W; x += 54) {
    const h = 20 + r() * 70;
    s += rect(x, 800 - h, 44, h, "#0f0520");
    for (let k = 0; k < Math.floor(h / 22); k++) if (r() < 0.55) s += rect(x + 8 + (k % 2) * 18, 800 - h + 8 + k * 22, 10, 10, r() < 0.5 ? C.sun : C.cyan, 'opacity="0.8"');
  }
  return s;
}

export function coverSvg(slug) {
  const draw = covers[slug];
  if (!draw) throw new Error("no cover drawn for " + slug);
  const r = rnd(slug.length);
  let stars = "";
  for (let k = 0; k < 70; k++) stars += circ(r() * W, r() * H, 1 + r() * 2, C.white, `opacity="${0.15 + r() * 0.4}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>${glow("g1", C.pink, 14)}</defs>${rect(0, 0, W, H, "url(#bg)")}${stars}${skyline(slug.length)}${draw()}</svg>`;
}

// THE BOX SHAPES OF THE BLOG PAGE (lib/blog-shared.ts TILES): the picture of an article is drawn for the shape of its box, so nothing important is cut. The scene
// (drawn 1600 x 900) is placed in the middle of the canvas; the sides that do not fit are cropped, the room above is more night sky with stars and the room
// below is the neon floor of the city (a perspective grid). src/lib/blog-tiles.json says which article has which shape (lib/blog.ts reads the same file).
const SHAPES = { landscape: [1200, 864, 0.96], square: [1200, 1200, 0.9], portrait: [900, 1200, 0.8], tall: [900, 1600, 0.8] };
export function coverSvgFor(key, tile = "landscape") {
  const draw = covers[key];
  if (!draw) throw new Error("no cover drawn for " + key);
  const [Wt, Ht, sc] = SHAPES[tile] ?? SHAPES.landscape;
  const tx = (Wt - W * sc) / 2;
  const ty = Ht / 2 - (H / 2) * sc;
  const gy = ty + 800 * sc; // the ground line of the scene
  const fy = ty + H * sc; // where the ground of the scene ends
  const r = rnd(key.length);
  let stars = "";
  const n = Math.round((70 * Wt * Ht) / (W * H));
  for (let k = 0; k < n; k++) stars += circ(r() * Wt, r() * gy * 0.97, 1 + r() * 2, C.white, `opacity="${0.15 + r() * 0.4}"`);
  let floor = "";
  if (Ht - fy > 2) {
    floor += rect(0, fy - 1, Wt, Ht - fy + 1, "#07010d");
    if (Ht - fy > 60) {
      for (let k = -14; k <= 14; k++) floor += line(Wt / 2, gy, Wt / 2 + k * Wt * 0.2, Ht, C.pink, 2, 'opacity="0.17"');
      for (let j = 1; j <= 7; j++) floor += line(0, fy + (Ht - fy) * (j / 7) ** 2, Wt, fy + (Ht - fy) * (j / 7) ** 2, C.pink, 2, 'opacity="0.15"');
    }
  }
  const hz = `<radialGradient id="hz" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.pink}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Wt}" height="${Ht}" viewBox="0 0 ${Wt} ${Ht}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>${glow("g1", C.pink, 14)}${hz}</defs>${rect(0, 0, Wt, Ht, "url(#bg)")}<ellipse cx="${f(Wt / 2)}" cy="${f(gy)}" rx="${f(Wt * 0.8)}" ry="${f(Ht * 0.3)}" fill="url(#hz)"/>${stars}${floor}<g transform="translate(${f(tx)} ${f(ty)}) scale(${sc})">${skyline(key.length)}${draw()}</g></svg>`;
}

export const SLUGS = Object.keys(covers);

if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("make-blog-covers.mjs")) {
  const only = process.argv[2] ?? "";
  mkdirSync("public/images/blog", { recursive: true });
  const tiles = JSON.parse(readFileSync("src/lib/blog-tiles.json", "utf8"));
  for (const slug of SLUGS.filter((s) => s.includes(only))) {
    const out = `public/images/blog/${slug}.webp`;
    const tile = tiles[slug] ?? "landscape";
    const info = await sharp(Buffer.from(coverSvgFor(slug, tile))).webp({ quality: 82 }).toFile(out);
    console.log(out, tile, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
  }
}
