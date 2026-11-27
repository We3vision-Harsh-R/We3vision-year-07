// Draws the 12 cover pictures of blog part 5 (internships, training, choosing a software company in Surat) from code: our own flat drawings, no text, no logos, no outside art.
//   node tools/make-blog-covers-2.mjs           writes all 12 files (public/images/blog/<slug>.webp)
//   node tools/make-blog-covers-2.mjs seo       only the files whose address contains "seo"
// Same dark purple neon look as tools/make-blog-covers.mjs (which is not changed). Scenes are drawn 1600 x 900 and kept inside x 260..1340 because the
// "landscape" box of the blog page crops the sides a little. The alt text of the pictures is the title of the article.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const W = 1600;
const H = 900;
const C = { bg1: "#0a0211", bg2: "#1d0a33", pink: "#ff4fa3", sun: "#ffb04a", cyan: "#46e3ff", lilac: "#b58cff", white: "#f6eeff", dim: "#ffffff1f", dim2: "#ffffff38", mid: "#3b2a66", dark: "#1b0c33", edge: "#7a52d6" };
const f = (n) => Math.round(n * 10) / 10;
const rect = (x, y, w, h, fill, extra = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;
const rr = (x, y, w, h, r, fill, extra = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}" ${extra}/>`;
const circ = (x, y, r, fill, extra = "") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
const ring = (x, y, r, stroke, sw = 3, extra = "") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, sw = 3, extra = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${extra}/>`;
const poly = (pts, fill, stroke = "none", sw = 3, extra = "") => `<polygon points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
const path = (d, stroke, sw = 4, fill = "none", extra = "") => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const pl = (pts, stroke, sw = 4, extra = "") => path("M" + pts.map((p) => p.map(f).join(" ")).join(" L"), stroke, sw, "none", extra);
const glow = (id, s = 12) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${s}"/></filter>`;
const rnd = (seed) => { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };
const E = `stroke="${C.edge}" stroke-width="4"`;
const sun = (x, y, r) => `<g>${circ(x, y, r * 1.8, C.sun, 'opacity="0.18" filter="url(#g1)"')}${circ(x, y, r, C.sun)}</g>`;
const check = (x, y, c = C.cyan) => path(`M${x - 12} ${y} L${x - 2} ${y + 11} L${x + 14} ${y - 12}`, c, 6);
const bars = (x, y, ws, c = C.mid) => ws.map((w, i) => rr(x, y + i * 24, w, 12, 6, c)).join("");
const arrow = (x1, y, x2, c = C.white) => pl([[x1, y], [x2 - 16, y]], c, 6) + poly([[x2 - 18, y - 16], [x2 + 6, y], [x2 - 18, y + 16]], c);
// an isometric block (i, j on a grid, h = height)
function iso(cx, cy, i, j, h, tw, th, top, left, right) {
  const x = cx + (i - j) * tw, y = cy + (i + j) * th - h;
  return poly([[x - tw, y], [x, y + th], [x, y + th + h], [x - tw, y + h]], left, C.bg1, 1) + poly([[x + tw, y], [x, y + th], [x, y + th + h], [x + tw, y + h]], right, C.bg1, 1) + poly([[x, y - th], [x + tw, y], [x, y + th], [x - tw, y]], top, C.bg1, 1);
}
const laptop = (x, y, w, screen) => {
  const h = w * 0.62;
  return rr(x, y, w, h, 16, C.dark, E) + rr(x + 16, y + 16, w - 32, h - 32, 8, "#0b0415") + screen(x + 16, y + 16, w - 32, h - 32) + poly([[x - 40, y + h + 4], [x + w + 40, y + h + 4], [x + w + 10, y + h + 34], [x - 10, y + h + 34]], "#2b1650", C.edge, 3);
};
const pin = (x, y, s, c = C.pink) => path(`M${x} ${y} C ${x - s * 0.9} ${y - s * 0.9}, ${x - s * 0.9} ${y - s * 2}, ${x} ${y - s * 2} C ${x + s * 0.9} ${y - s * 2}, ${x + s * 0.9} ${y - s * 0.9}, ${x} ${y} Z`, c, 4, c) + circ(x, y - s * 1.3, s * 0.4, C.bg1);
const person = (x, y, c, s = 1) => circ(x, y - 70 * s, 26 * s, c) + path(`M${x - 46 * s} ${y + 30 * s} Q ${x} ${y - 66 * s}, ${x + 46 * s} ${y + 30 * s} Z`, c, 3, c);

const covers = {
  // 1. choose an internship: a signpost with three paths and a check mark on the chosen one
  "choose-internship-in-surat-for-it-students": () => {
    let s = rr(780, 230, 40, 440, 10, C.mid) + rr(720, 660, 160, 22, 11, "#241347");
    const rows = [[300, C.dim2, false], [430, C.sun, true], [560, C.dim2, false]];
    rows.forEach(([y, c, on], i) => {
      s += poly([[500, y - 44], [940, y - 44], [1010, y], [940, y + 44], [500, y + 44]], on ? "#4b2689" : "#25104a", on ? C.sun : C.edge, 4);
      s += bars(560, y - 20, [i === 1 ? 250 : 170, 110], on ? C.lilac : C.mid);
      if (on) s += circ(1160, y, 44, C.sun) + check(1160, y, C.bg1);
      else s += ring(1160, y, 44, C.dim2, 4);
    });
    s += circ(380, 440, 40, C.cyan) + path("M340 560 Q 380 470, 420 560", C.cyan, 8) + pl([[430, 500], [490, 460]], C.cyan, 4, 'stroke-dasharray="10 10"');
    return s;
  },
  // 2. internship vs training: two blocks side by side (a team desk vs a stepped course)
  "internship-vs-industrial-training-difference": () => {
    let s = line(800, 200, 800, 700, C.dim2, 4, 'stroke-dasharray="12 14"');
    // left: a company desk with a laptop and two people
    s += rr(330, 560, 360, 26, 8, "#2b1650", E) + rr(380, 470, 120, 90, 10, C.dark, E) + circ(440, 515, 14, C.cyan) + circ(590, 400, 34, C.lilac) + path("M540 520 Q 590 410, 640 520 Z", C.lilac, 3, C.lilac) + circ(440, 380, 30, C.pink) + path("M396 470 Q 440 380, 484 470 Z", C.pink, 3, C.pink);
    // right: steps of a course
    for (let k = 0; k < 4; k++) s += iso(1060, 420, k, 0, 60 + k * 60, 62, 31, k === 3 ? C.sun : "#5b2d9a", "#241347", "#31195a");
    s += pl([[960, 560], [1060, 500], [1180, 430], [1300, 360]], C.cyan, 4, 'stroke-dasharray="10 10"') + circ(1300, 340, 14, C.sun);
    return s;
  },
  // 3. web development internship: a laptop with code lines and a browser window
  "web-development-internship-in-surat-what-you-learn": () => {
    let s = laptop(420, 220, 520, (x, y) => {
      const r = rnd(8);
      let c = "";
      for (let k = 0; k < 9; k++) c += rr(x + 26 + (k % 3) * 30, y + 26 + k * 28, 60 + r() * 220, 12, 6, [C.cyan, C.pink, C.sun, C.lilac][k % 4], 'opacity="0.85"');
      return c;
    });
    s += rr(900, 280, 380, 300, 20, C.dark, E) + rr(900, 280, 380, 48, 20, "#2b1650") + circ(930, 304, 7, C.pink) + circ(954, 304, 7, C.sun) + circ(978, 304, 7, C.cyan);
    s += rr(924, 350, 332, 90, 12, C.mid) + rr(924, 462, 150, 90, 12, "#2f1c58") + rr(1090, 462, 166, 90, 12, "#2f1c58") + path("M940 420 L990 390 L1030 410 L1090 370 L1180 420", C.cyan, 4);
    s += pl([[940, 320], [1010, 250], [1090, 250]], C.pink, 4, 'stroke-dasharray="10 10"') + circ(1100, 250, 12, C.pink);
    s += rr(300, 620, 120, 40, 12, C.sun, 'opacity="0.9"') + rr(320, 636, 80, 8, 4, C.bg1);
    return s;
  },
  // 4. UI/UX: wireframe screens, a pen path and a colour palette
  "ui-ux-design-internship-in-surat-portfolio-and-skills": () => {
    let s = "";
    for (const [x, y, k] of [[330, 250, 0], [560, 300, 1], [790, 250, 2]]) {
      s += rr(x, y, 190, 330, 26, C.dark, E) + rr(x + 20, y + 40, 150, 70, 10, k === 1 ? C.mid : "#2f1c58");
      s += k === 0 ? bars(x + 20, y + 140, [150, 110, 130]) : k === 1 ? rr(x + 20, y + 130, 150, 120, 12, "none", `stroke="${C.cyan}" stroke-width="3" stroke-dasharray="8 8"`) + circ(x + 95, y + 190, 22, C.cyan) : bars(x + 20, y + 140, [120, 150, 90]);
      s += rr(x + 30, y + 270, 130, 34, 17, k === 2 ? C.pink : C.mid);
    }
    s += path("M1080 600 Q 1130 420, 1210 360 T 1330 280", C.sun, 6) + poly([[1330, 262], [1360, 270], [1342, 298]], C.sun) + circ(1210, 360, 10, C.white);
    [C.pink, C.sun, C.cyan, C.lilac].forEach((c, i) => (s += circ(1120 + i * 62, 660, 24, c)));
    s += rr(1040, 440, 130, 90, 12, C.dark, E) + path("M1060 510 L1090 470 L1115 495 L1150 455", C.cyan, 4);
    return s;
  },
  // 5. a project that gets noticed: a repo box with a branch graph, a star and a resume sheet
  "internship-project-resume-github-that-gets-noticed": () => {
    let s = rr(300, 210, 360, 480, 18, C.dark, E) + circ(360, 270, 22, C.lilac) + rr(400, 258, 190, 14, 7, C.white, 'opacity="0.7"') + bars(330, 330, [260, 200, 230, 150, 240, 120]) + rr(330, 600, 140, 40, 14, C.cyan, 'opacity="0.85"');
    s += pl([[800, 640], [800, 270]], C.lilac, 6) + pl([[800, 560], [900, 500], [900, 400], [800, 340]], C.cyan, 6) + pl([[800, 450], [700, 400], [700, 330]], C.pink, 6);
    for (const [x, y, c] of [[800, 640, C.lilac], [800, 560, C.lilac], [800, 450, C.lilac], [800, 340, C.lilac], [800, 270, C.sun], [900, 500, C.cyan], [900, 400, C.cyan], [700, 400, C.pink], [700, 330, C.pink]]) s += circ(x, y, 16, c);
    s += rr(1000, 210, 330, 480, 18, "#f6eeff", "") + circ(1090, 300, 36, C.edge) + rr(1150, 280, 130, 14, 7, C.edge) + rr(1150, 306, 90, 12, 6, C.mid);
    s += bars(1040, 380, [250, 210, 230]).replace(new RegExp(C.mid, "g"), "#c9b8ee") + bars(1040, 480, [220, 180]).replace(new RegExp(C.mid, "g"), "#c9b8ee");
    const star = []; for (let k = 0; k < 10; k++) { const a = (Math.PI / 5) * k - Math.PI / 2, r = k % 2 ? 22 : 50; star.push([1170 + Math.cos(a) * r, 620 + Math.sin(a) * r]); }
    s += poly(star, C.sun) ;
    return s;
  },
  // 6. how long: three growing stacks of calendar blocks (3, 6, 9)
  "how-long-should-industrial-training-be-3-6-9-months": () => {
    let s = line(280, 690, 1320, 690, C.dim2, 4);
    [[420, 3, C.cyan], [800, 6, C.lilac], [1180, 9, C.pink]].forEach(([x, n, c]) => {
      for (let k = 0; k < n; k++) s += rr(x - 90, 640 - k * 52 - (n > 6 ? 0 : 0), 180, 42, 10, c, `opacity="${0.5 + k * 0.05}"`) + rr(x - 70, 652 - k * 52, 60, 10, 5, C.bg1, 'opacity="0.35"');
      s += circ(x, 640 - n * 52 - 36, 22, C.sun);
    });
    s += pl([[420, 460], [800, 360], [1180, 190]], C.sun, 3, 'stroke-dasharray="10 12" opacity="0.6"');
    return s;
  },
  // 7. questions: a checklist with speech bubbles of question marks
  "questions-to-ask-before-joining-internship-or-training-in-surat": () => {
    let s = rr(560, 190, 480, 520, 22, C.dark, E);
    [270, 380, 490, 600].forEach((y, i) => {
      s += rr(600, y - 24, 48, 48, 12, i < 3 ? C.cyan : "none", i < 3 ? "" : `stroke="${C.dim2}" stroke-width="4"`) + (i < 3 ? check(624, y, C.bg1) : "") + rr(676, y - 18, 280 - i * 24, 14, 7, C.lilac) + rr(676, y + 6, 170, 12, 6, C.mid);
    });
    for (const [x, y, c] of [[360, 330, C.pink], [1240, 300, C.sun], [1240, 560, C.cyan]]) {
      s += rr(x - 90, y - 70, 180, 120, 28, "#25104a", `stroke="${c}" stroke-width="4"`) + poly([[x - 20, y + 50], [x + 10, y + 50], [x - 30, y + 90]], "#25104a", c, 4);
      s += path(`M${x - 22} ${y - 30} Q ${x - 22} ${y - 52}, ${x} ${y - 52} Q ${x + 24} ${y - 52}, ${x + 24} ${y - 30} Q ${x + 24} ${y - 14}, ${x} ${y - 8} L${x} ${y + 4}`, c, 8) + circ(x, y + 26, 6, c);
    }
    return s;
  },
  // 8. choose a web company: a checklist next to two browser windows being compared
  "how-to-choose-a-web-development-company-in-surat": () => {
    let s = "";
    for (const [x, on] of [[300, false], [740, true]]) {
      s += rr(x, 260, 380, 330, 20, C.dark, on ? `stroke="${C.cyan}" stroke-width="6"` : E) + rr(x, 260, 380, 46, 20, "#2b1650") + circ(x + 28, 283, 7, C.pink) + circ(x + 52, 283, 7, C.sun) + circ(x + 76, 283, 7, C.cyan);
      s += rr(x + 24, 330, 332, 100, 12, on ? "#4b2689" : C.mid) + rr(x + 24, 450, 150, 110, 12, "#2f1c58") + rr(x + 196, 450, 160, 110, 12, "#2f1c58");
      if (on) s += circ(x + 340, 262, 36, C.cyan) + check(x + 340, 262, C.bg1);
    }
    s += rr(1180, 260, 160, 330, 18, C.dark, E);
    [320, 410, 500].forEach((y, i) => (s += rr(1200, y - 16, 32, 32, 8, i < 2 ? C.sun : "none", `stroke="${C.sun}" stroke-width="3"`) + rr(1244, y - 6, 70 - i * 10, 12, 6, C.mid)));
    s += poly([[640, 660], [700, 660], [670, 700]], C.cyan) + line(670, 610, 670, 660, C.cyan, 6);
    return s;
  },
  // 9. how long: a timeline with stages and a calendar
  "how-long-does-a-website-or-app-take-to-build": () => {
    let s = rr(300, 200, 280, 260, 20, C.dark, E) + rr(300, 200, 280, 56, 20, C.pink);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += rr(326 + c * 62, 280 + r * 54, 44, 38, 8, r === 1 && c === 2 ? C.sun : C.mid);
    const st = [[420, 620], [600, 620], [780, 620], [960, 620], [1140, 620], [1300, 620]];
    s += line(380, 620, 1300, 620, C.dim2, 6);
    st.forEach(([x, y], i) => (s += i < 4 ? circ(x, y, 30, C.cyan) + check(x, y, C.bg1) : i === 4 ? circ(x, y, 30, C.sun) + circ(x, y, 10, C.bg1) : ring(x, y, 30, C.dim2, 5)));
    s += pl([[420, 620], [600, 620], [780, 620], [960, 620]], C.cyan, 6);
    s += rr(700, 250, 160, 260, 26, C.dark, E) + rr(720, 290, 120, 70, 8, C.mid) + bars(720, 390, [120, 80, 100]) + rr(1000, 250, 300, 190, 16, C.dark, E) + rr(1020, 276, 260, 40, 8, C.mid) + rr(1020, 332, 120, 80, 8, "#2f1c58") + rr(1160, 332, 120, 80, 8, "#2f1c58");
    return s;
  },
  // 10. ask a software company: two shapes shaking hands with a shield in the middle
  "questions-to-ask-a-software-company-before-hiring": () => {
    let s = circ(800, 420, 150, C.lilac, 'opacity="0.12" filter="url(#g1)"');
    s += rr(300, 340, 260, 190, 30, "#25104a", `stroke="${C.cyan}" stroke-width="5"`) + circ(430, 400, 34, C.cyan) + path("M380 490 Q 430 410, 480 490", C.cyan, 8) + rr(1040, 340, 260, 190, 30, "#25104a", `stroke="${C.pink}" stroke-width="5"`) + poly([[1170, 360], [1220, 440], [1120, 440]], C.pink) + rr(1128, 450, 84, 40, 10, C.pink);
    s += path("M560 440 L690 400 L780 420 L880 380 L1040 440", C.dim2, 12) + path("M560 440 L690 400 L780 420 L880 380 L1040 440", C.white, 4);
    s += rr(690, 400, 110, 60, 22, C.sun, "") + rr(790, 380, 110, 60, 22, C.lilac, "") + rr(720, 420, 150, 44, 22, C.white, 'opacity="0.9"');
    s += path("M800 570 L880 600 L880 680 Q880 740 800 770 Q720 740 720 680 L720 600 Z", C.sun, 6, "#25104a") + check(800, 680, C.sun);
    return s;
  },
  // 11. AI for small business: a small shop with a bot helper and gears/flow
  "ai-for-small-business-where-to-start": () => {
    let s = poly([[330, 420], [580, 420], [600, 330], [310, 330]], C.pink) + rr(330, 420, 250, 240, 8, C.dark, E) + rr(370, 480, 80, 180, 6, "#0b0415") + rr(480, 480, 70, 70, 6, C.mid);
    s += `<path d="M310 330 Q 330 380 370 380 Q 410 380 410 330 Q 410 380 450 380 Q 490 380 490 330 Q 490 380 530 380 Q 570 380 600 330" fill="none" stroke="${C.white}" stroke-width="3"/>`;
    s += circ(900, 430, 150, C.cyan, 'opacity="0.12" filter="url(#g1)"') + rr(800, 350, 200, 170, 36, C.dark, `stroke="${C.cyan}" stroke-width="5"`) + circ(860, 420, 16, C.cyan) + circ(940, 420, 16, C.cyan) + path("M860 475 Q 900 505 940 475", C.pink, 7) + line(900, 350, 900, 310, C.cyan, 5) + circ(900, 300, 10, C.sun);
    s += arrow(620, 440, 790, C.pink);
    for (const [x, y] of [[1150, 330], [1150, 440], [1150, 550]]) s += rr(x - 20, y - 36, 200, 72, 14, "#25104a", E) + rr(x, y - 14, 44, 28, 8, C.cyan) + bars(x + 60, y - 10, [90, 60]) + arrow(1010, 440, 1100, C.cyan).slice(0, 0);
    s += arrow(1010, 440, 1120, C.cyan);
    return s;
  },
  // 12. local SEO: a magnifier over a map with pins and a five-star
  "local-seo-for-business-in-surat-what-to-fix-first": () => {
    let s = poly([[330, 300], [1010, 260], [1070, 640], [380, 690]], "#1d0f3a", C.edge, 4);
    s += pl([[330, 440], [1050, 420]], C.mid, 22) + pl([[560, 280], [610, 680]], C.mid, 22) + pl([[820, 270], [880, 650]], C.mid, 22) + pl([[350, 580], [1060, 540]], C.mid, 14);
    s += rr(620, 450, 120, 70, 8, "#2f1c58") + rr(430, 330, 90, 80, 8, "#2f1c58") + rr(890, 330, 100, 90, 8, "#2f1c58") + rr(900, 560, 110, 60, 8, "#2f1c58");
    s += pin(700, 400, 34) + pin(480, 520, 24, C.sun) + pin(940, 520, 24, C.cyan);
    s += circ(1040, 430, 150, C.cyan, 'opacity="0.1"') + ring(1040, 430, 140, C.white, 14) + ring(1040, 430, 140, C.cyan, 4, 'opacity="0.8"') + pl([[1140, 530], [1280, 690]], C.white, 26) + pl([[1140, 530], [1280, 690]], C.pink, 10);
    s += pin(1040, 480, 36, C.sun);
    [0, 1, 2, 3, 4].forEach((k) => {
      const pts = []; for (let q = 0; q < 10; q++) { const a = (Math.PI / 5) * q - Math.PI / 2, r = q % 2 ? 8 : 18; pts.push([420 + k * 50 + Math.cos(a) * r, 750 + Math.sin(a) * r]); }
      s += poly(pts, C.sun);
    });
    return s;
  },
};

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

// the "landscape" box of the blog page (1200 x 864): the scene is placed in the middle, the sides that do not fit are cropped
function coverSvg(key) {
  const [Wt, Ht, sc] = [1200, 864, 0.96];
  const tx = (Wt - W * sc) / 2, ty = Ht / 2 - (H / 2) * sc;
  const gy = ty + 800 * sc, fy = ty + H * sc;
  const r = rnd(key.length);
  let stars = "";
  for (let k = 0; k < 54; k++) stars += circ(r() * Wt, r() * gy * 0.97, 1 + r() * 2, C.white, `opacity="${0.15 + r() * 0.4}"`);
  let floor = "";
  if (Ht - fy > 2) floor += rect(0, fy - 1, Wt, Ht - fy + 1, "#07010d");
  const hz = `<radialGradient id="hz" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.pink}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></radialGradient>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Wt}" height="${Ht}" viewBox="0 0 ${Wt} ${Ht}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>${glow("g1", 14)}${hz}</defs>${rect(0, 0, Wt, Ht, "url(#bg)")}<ellipse cx="${f(Wt / 2)}" cy="${f(gy)}" rx="${f(Wt * 0.8)}" ry="${f(Ht * 0.3)}" fill="url(#hz)"/>${stars}${floor}<g transform="translate(${f(tx)} ${f(ty)}) scale(${sc})">${skyline(key.length)}${covers[key]()}</g></svg>`;
}

export const SLUGS = Object.keys(covers);

if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("make-blog-covers-2.mjs")) {
  const only = process.argv[2] ?? "";
  mkdirSync("public/images/blog", { recursive: true });
  for (const slug of SLUGS.filter((s) => s.includes(only))) {
    const out = `public/images/blog/${slug}.webp`;
    const info = await sharp(Buffer.from(coverSvg(slug))).webp({ quality: 80 }).toFile(out);
    console.log(out, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
  }
}
