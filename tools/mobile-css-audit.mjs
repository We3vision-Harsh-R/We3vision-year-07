#!/usr/bin/env node
// Mobile CSS audit: a responsive checker for the mobile "app" pages.
// Scans every .css file under src/app/(m)/ and src/components/site/mobile/ plus every
// inline `style={{...}}` in .tsx files there, and reports problems with file:line.
//
//   node tools/mobile-css-audit.mjs            -> report, exit 0 (audit, not a gate)
//   node tools/mobile-css-audit.mjs --strict   -> exit 1 when any finding exists
//   node tools/mobile-css-audit.mjs --json     -> machine-readable output
//
// Units: `calc(N * var(--u))` is read as N iPhone points (--u is ~1px on a 393px phone).
// No dependencies: a small brace-tracking CSS reader is used, good enough for an audit.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIRS = ["src/app/(m)", "src/components/site/mobile"];
const args = new Set(process.argv.slice(2));
const STRICT = args.has("--strict");
const JSON_OUT = args.has("--json");

const CHECKS = {
  width: "Fixed width/min-width > 340px outside @media (min-width)",
  vw100: "width: 100vw (sideways scroll risk)",
  snap: "Horizontal snap container without overflow-x auto/scroll",
  font12: "font-size below 12px",
  body15: "Body text below 15px",
  touch: "Touch target (button/a) height/min-height < 40px",
  safe: "position: fixed bottom bar without env(safe-area-inset-bottom)",
  color: "Hard-coded violet/pink colour (hue 260-340)",
};
const findings = Object.fromEntries(Object.keys(CHECKS).map((k) => [k, []]));
const media = new Map(); // query -> { count, files:Set }
let cssFiles = 0, tsxFiles = 0, styleBlocks = 0;

// ---------- file walk ----------
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules") walk(p, out); }
    else out.push(p);
  }
  return out;
}
const rel = (f) => path.relative(ROOT, f).split(path.sep).join("/");

// ---------- value helpers ----------
// Returns a length in px (or iPhone points for var(--u)), or null when unknown.
function toPx(v) {
  if (v == null) return null;
  v = String(v).trim();
  let m;
  if ((m = v.match(/^(-?[\d.]+)px$/))) return +m[1];
  if ((m = v.match(/^(-?[\d.]+)r?em$/))) return +m[1] * 16;
  if ((m = v.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*var\(--u\)\s*\)$/))) return +m[1];
  if ((m = v.match(/^calc\(\s*var\(--u\)\s*\*\s*(-?[\d.]+)\s*\)$/))) return +m[1];
  if ((m = v.match(/^(-?[\d.]+)$/))) return +m[1]; // unitless number (inline styles)
  return null;
}
// font-size: also read the smallest bound of clamp()/min()/max() (the size a small phone gets).
function fontPx(v) {
  const direct = toPx(v);
  if (direct != null) return direct;
  const m = String(v).match(/^(clamp|min|max)\((.*)\)$/);
  if (!m) return null;
  const parts = splitTop(m[2]);
  const nums = parts.map(toPx).filter((n) => n != null);
  if (!nums.length) return null;
  if (m[1] === "clamp") return toPx(parts[0]);
  return Math.min(...nums);
}
function splitTop(s) {
  const out = []; let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function violetHits(value) {
  const hits = [];
  const isViolet = (h, s, l) => h >= 260 && h <= 340 && s > 0.15 && l > 0.08 && l < 0.95;
  for (const m of value.matchAll(/#([0-9a-f]{3,8})\b/gi)) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) continue;
    const [H, S, L] = rgbToHsl(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
    if (isViolet(H, S, L)) hits.push(m[0]);
  }
  for (const m of value.matchAll(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/gi)) {
    const [H, S, L] = rgbToHsl(+m[1], +m[2], +m[3]);
    if (isViolet(H, S, L)) hits.push(m[0] + ")");
  }
  // hsl() with a literal hue (theme formula uses calc(var(--th) + N), which is fine)
  for (const m of value.matchAll(/hsla?\(\s*(-?[\d.]+)(deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/gi)) {
    const H = ((+m[1] % 360) + 360) % 360;
    if (isViolet(H, +m[3] / 100, +m[4] / 100)) hits.push(m[0] + ")");
  }
  return hits;
}

const BODY_SEL = /(^|[\s>+~,(])(p|li|body|dd|blockquote)\b|[-_](text|body|para|desc|lead|copy|txt|p)\b/i;
const TOUCH_SEL = /(^|[\s>+~,(])(button|a)\b|[-_](btn|button|link|cta|tap|chip|tab)\b/i;

function add(kind, file, line, sel, detail) {
  findings[kind].push({ file, line, sel: (sel || "").replace(/\s+/g, " ").trim().slice(0, 60), detail });
}

// ---------- rule-level checks (shared by CSS and inline styles) ----------
// decls: [{ prop, value, line }], ctx: { sel, inMinWidth, file }
function checkRule(decls, ctx) {
  const get = (p) => decls.filter((d) => d.prop === p).pop();
  const { file, sel } = ctx;

  for (const d of decls) {
    const v = d.value.replace(/\s*!important\s*$/, "");
    if ((d.prop === "width" || d.prop === "min-width") && !ctx.inMinWidth) {
      const px = toPx(v);
      if (px != null && px > 340 && !/var\(--u\)/.test(v)) add("width", file, d.line, sel, `${d.prop}: ${v}`);
      else if (/var\(--u\)/.test(v) && px != null && px > 340) add("width", file, d.line, sel, `${d.prop}: ${v} (${px}pt)`);
    }
    if (/^(width|min-width)$/.test(d.prop) && /^100vw$/.test(v.trim())) add("vw100", file, d.line, sel, `${d.prop}: ${v}`);
    if (d.prop === "font-size") {
      const px = fontPx(v);
      if (px != null && px > 0) {
        if (px < 12) add("font12", file, d.line, sel, `font-size: ${v} (=${+px.toFixed(2)})`);
        else if (px < 15 && BODY_SEL.test(sel)) add("body15", file, d.line, sel, `font-size: ${v} (=${+px.toFixed(2)})`);
      }
    }
    if (!/^--/.test(d.prop) || /color|bg|tint|accent/i.test(d.prop)) {
      const hits = violetHits(v);
      if (hits.length) add("color", file, d.line, sel, `${d.prop}: ${hits.join(", ")}`);
    }
  }

  // touch targets
  if (TOUCH_SEL.test(sel) && !/::?(before|after|placeholder)/.test(sel)) {
    for (const p of ["height", "min-height"]) {
      const d = get(p);
      const px = d ? toPx(d.value) : null;
      if (px != null && px > 0 && px < 40) add("touch", file, d.line, sel, `${p}: ${d.value}`);
    }
  }

  // fixed bottom bars
  const pos = get("position");
  if (pos && /fixed/.test(pos.value) && (get("bottom") || get("inset") || get("inset-block-end"))) {
    const all = decls.map((d) => d.value).join(" ");
    const bottom = get("bottom");
    const anchoredBottom = !bottom || !/auto/.test(bottom.value);
    // a full-screen overlay (inset: 0 or top + bottom both set) is not a bottom bar
    const inset = get("inset");
    const fullScreen = (inset && splitTop(inset.value.replace(/\s+/g, ",")).length === 1) || (get("top") && bottom && !/auto/.test(get("top").value));
    if (anchoredBottom && !fullScreen && !/safe-area-inset-bottom/.test(all)) add("safe", file, pos.line, sel, "no env(safe-area-inset-bottom)");
  }

  // horizontal snap
  const snap = get("scroll-snap-type");
  if (snap && /\b(x|inline|both)\b/.test(snap.value)) {
    const ox = get("overflow-x") || get("overflow");
    if (!ox || !/(auto|scroll)/.test(ox.value)) add("snap", file, snap.line, sel, `scroll-snap-type: ${snap.value}; overflow-x: ${ox ? ox.value : "(unset)"}`);
  }
}

// ---------- CSS reader ----------
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}
function auditCss(file) {
  const src = stripComments(fs.readFileSync(file, "utf8"));
  const name = rel(file);
  const stack = []; // { header, decls }
  let buf = "", bufStart = 0, line = 1, quote = null, paren = 0;
  const lineAt = (s, startLine) => startLine + (s.match(/^\s*/)[0].match(/\n/g) || []).length;

  const pushDecl = (text, startLine) => {
    const top = stack[stack.length - 1];
    if (!top) return;
    const i = text.indexOf(":");
    if (i < 0) return;
    const prop = text.slice(0, i).trim().toLowerCase();
    const value = text.slice(i + 1).trim();
    if (!prop || /[{}]/.test(prop)) return;
    top.decls.push({ prop, value, line: lineAt(text, startLine) });
  };

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quote) { buf += ch; if (ch === quote && src[i - 1] !== "\\") quote = null; if (ch === "\n") line++; continue; }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === "(") paren++;
    if (ch === ")") paren--;
    if (ch === "{" && paren <= 0) {
      const header = buf.trim();
      const hl = lineAt(buf, bufStart);
      if (/^@media/i.test(header)) {
        const q = header.replace(/^@media\s*/i, "").replace(/\s+/g, " ");
        const e = media.get(q) || { count: 0, files: new Set(), first: `${name}:${hl}` };
        e.count++; e.files.add(name); media.set(q, e);
      }
      stack.push({ header, decls: [], line: hl });
      buf = ""; bufStart = line; continue;
    }
    if (ch === ";" && paren <= 0) { pushDecl(buf, bufStart); buf = ""; bufStart = line; continue; }
    if (ch === "}" && paren <= 0) {
      if (buf.trim()) pushDecl(buf, bufStart);
      const node = stack.pop();
      if (node && !/^@/.test(node.header) && node.decls.length) {
        const inMinWidth = stack.some((s) => /^@media/i.test(s.header) && /min-width/i.test(s.header));
        checkRule(node.decls, { file: name, sel: node.header, inMinWidth });
      } else if (node && /^@font-face|^@page/i.test(node.header)) { /* skip */ }
      buf = ""; bufStart = line; continue;
    }
    if (ch === "\n") line++;
    buf += ch;
  }
}

// ---------- TSX inline styles ----------
const kebab = (s) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
function auditTsx(file) {
  const src = fs.readFileSync(file, "utf8");
  const name = rel(file);
  const re = /style=\{\{/g;
  let m;
  while ((m = re.exec(src))) {
    styleBlocks++;
    let depth = 2, i = m.index + m[0].length;
    const start = i;
    while (i < src.length && depth > 0) { if (src[i] === "{") depth++; else if (src[i] === "}") depth--; i++; }
    const body = src.slice(start, i - 2);
    const baseLine = src.slice(0, start).split("\n").length;
    // enclosing JSX tag name, used as the "selector"
    const before = src.slice(Math.max(0, m.index - 300), m.index);
    const tag = (before.match(/<([A-Za-z][\w.]*)[^<]*$/) || [, "inline"])[1];
    const decls = [];
    for (const part of splitTop(body.replace(/\n/g, "\u0000"))) {
      const pm = part.match(/^\s*(?:\u0000\s*)*["']?([\w-]+)["']?\s*:\s*([\s\S]+)$/);
      if (!pm) continue;
      const offset = body.indexOf(part);
      const ln = baseLine + (body.slice(0, offset).match(/\n/g) || []).length + (part.match(/^[\s\u0000]*/)[0].match(/\u0000/g) || []).length;
      let value = pm[2].replace(/\u0000/g, " ").trim();
      const q = value.match(/^["'`](.*)["'`]$/);
      if (q) value = q[1];
      const prop = pm[1].startsWith("--") ? pm[1] : kebab(pm[1]);
      // unitless numbers in React mean px for lengths
      if (/^-?[\d.]+$/.test(value) && /(width|height|font-size)$/.test(prop)) value += "px";
      decls.push({ prop, value, line: ln });
    }
    if (decls.length) checkRule(decls, { file: name, sel: tag, inMinWidth: false });
  }
}

// ---------- run ----------
for (const d of DIRS) {
  for (const f of walk(path.join(ROOT, d))) {
    if (f.endsWith(".css")) { cssFiles++; auditCss(f); }
    else if (f.endsWith(".tsx")) { tsxFiles++; auditTsx(f); }
  }
}

// breakpoint summary
const bps = [...media.entries()].map(([q, e]) => {
  const max = [...q.matchAll(/max-width\s*:\s*([\d.]+)px/gi)].map((x) => +x[1]);
  const min = [...q.matchAll(/min-width\s*:\s*([\d.]+)px/gi)].map((x) => +x[1]);
  return { query: q, count: e.count, files: e.files.size, first: e.first, max, min };
});
const covered = (lo, hi) => bps.some((b) => [...b.max, ...b.min].some((v) => v >= lo && v <= hi));
const coverage = {
  "phone 320-430": covered(320, 430),
  "large phone 431-743": covered(431, 743),
  "tablet 744-1024": covered(744, 1024),
};

const total = Object.values(findings).reduce((n, a) => n + a.length, 0);

if (JSON_OUT) {
  console.log(JSON.stringify({ cssFiles, tsxFiles, styleBlocks, total, findings, breakpoints: bps.map((b) => ({ ...b })), coverage }, null, 2));
} else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`\nMobile CSS audit  —  ${cssFiles} css files, ${tsxFiles} tsx files (${styleBlocks} inline style blocks)\n`);
  for (const [k, title] of Object.entries(CHECKS)) {
    const list = findings[k];
    console.log(`## ${title}  [${list.length}]`);
    if (!list.length) { console.log("   (none)\n"); continue; }
    const w = Math.min(70, Math.max(...list.map((f) => `${f.file}:${f.line}`.length)));
    for (const f of list.slice(0, 60)) console.log(`   ${pad(`${f.file}:${f.line}`, w)}  ${pad(f.sel, 34)}  ${f.detail}`);
    if (list.length > 60) console.log(`   ... ${list.length - 60} more (use --json)`);
    console.log("");
  }
  console.log(`## @media breakpoints  [${bps.length} distinct queries]`);
  for (const b of bps.sort((a, b) => (Math.max(0, ...a.max, ...a.min) - Math.max(0, ...b.max, ...b.min)))) {
    console.log(`   ${pad(b.query.slice(0, 64), 66)} x${pad(b.count, 4)} ${b.first}`);
  }
  console.log(`   coverage: ${Object.entries(coverage).map(([k, v]) => `${k} ${v ? "yes" : "NO"}`).join(" | ")}\n`);
  console.log("## Counts");
  for (const [k, title] of Object.entries(CHECKS)) console.log(`   ${pad(k, 8)} ${pad(findings[k].length, 5)} ${title}`);
  console.log(`   ${pad("TOTAL", 8)} ${total}\n`);
}

process.exit(STRICT && total > 0 ? 1 : 0);
