// BUILD WEIGHT: what a visitor downloads on the FIRST load of every page, from a finished `npm run build` (read-only).
//   node tools/build-weight.mjs            table, biggest first
//   node tools/build-weight.mjs --json     JSON (for before/after comparison)
// It reads the prerendered HTML in .next/server/app, collects every <script src> and stylesheet <link> of the page and adds up the size
// of those files in .next/static (raw and gzip) plus the HTML itself. Code that loads later (dynamic import, on click) is NOT counted:
// that is the point, a smaller number here = less to download before the page is usable. Budget (see brain/12): JS <= 150 KB gzip, CSS <= 60 KB gzip.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const root = ".next";
if (!existsSync(join(root, "server/app"))) { console.error("No build found: run `npm run build` first."); process.exit(2); }
const files = [];
(function walk(d, rel = "") { for (const n of readdirSync(d)) { const f = join(d, n); if (statSync(f).isDirectory()) walk(f, rel + n + "/"); else if (n.endsWith(".html") && !/_not-found|404|500/.test(n)) files.push({ path: f, route: "/" + (rel + n).replace(/\.html$/, "").replace(/^index$/, "") }); } })(join(root, "server/app"));

const cache = new Map();
const sizeOf = (href) => {
  const clean = decodeURIComponent(href.split("?")[0]).replace(/^\/_next\//, "");
  if (cache.has(clean)) return cache.get(clean);
  const f = join(root, clean);
  const r = existsSync(f) ? (() => { const b = readFileSync(f); return { raw: b.length, gz: gzipSync(b).length }; })() : { raw: 0, gz: 0 };
  cache.set(clean, r);
  return r;
};
const rows = [];
for (const { path, route } of files) {
  const html = readFileSync(path, "utf8");
  const scripts = new Set([...html.matchAll(/<script([^>]+)src="([^"]+)"([^>]*)>/g)].filter((m) => !/noModule|nomodule/.test(m[1] + m[3])).map((m) => m[2]).filter((s) => s.startsWith("/_next/"))); // nomodule = old-browser polyfills: modern browsers skip them
  for (const m of html.matchAll(/<link[^>]+rel="preload"[^>]+as="script"[^>]*href="([^"]+)"|<link[^>]+href="([^"]+)"[^>]+as="script"/g)) scripts.add(m[1] ?? m[2]);
  const css = new Set([...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]));
  const sum = (set) => [...set].reduce((a, h) => { const s = sizeOf(h); return { raw: a.raw + s.raw, gz: a.gz + s.gz }; }, { raw: 0, gz: 0 });
  const j = sum(scripts), c = sum(css);
  rows.push({ route, htmlGz: gzipSync(html).length, jsRaw: j.raw, jsGz: j.gz, cssRaw: c.raw, cssGz: c.gz, scripts: scripts.size, sheets: css.size });
}
rows.sort((a, b) => b.jsGz + b.cssGz - (a.jsGz + a.cssGz));
if (process.argv.includes("--json")) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }
const k = (n) => (n / 1024).toFixed(0).padStart(5);
console.log("route".padEnd(46) + "  JS gz  JS raw  CSS gz CSS raw  HTML gz  files");
for (const r of rows) console.log(r.route.padEnd(46) + `${k(r.jsGz)}  ${k(r.jsRaw)}  ${k(r.cssGz)}  ${k(r.cssRaw)}  ${k(r.htmlGz)}    ${r.scripts}+${r.sheets}`);
const avg = (f) => rows.reduce((a, r) => a + r[f], 0) / rows.length;
console.log(`\n${rows.length} pages. average: JS ${k(avg("jsGz")).trim()} KB gz, CSS ${k(avg("cssGz")).trim()} KB gz. Budget: JS <= 150, CSS <= 60 (KB gzip).`);
