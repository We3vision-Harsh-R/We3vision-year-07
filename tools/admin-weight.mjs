// ADMIN WEIGHT (read-only): estimated JS per admin page = every chunk its client reference manifest lists + the framework chunks, gzip.
// The admin pages are rendered on demand (not in .next/server/app as html), so build-weight.mjs cannot see them. Run after `npm run build`:  node tools/admin-weight.mjs
// It over-estimates the real download (login: 175 estimated vs 150 measured) but is right for comparing before/after.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
const root = ".next";
const base = join(root, "server/app/admin");
const manifests = [];
(function walk(d) { for (const n of readdirSync(d)) { const f = join(d, n); if (statSync(f).isDirectory()) walk(f); else if (n.endsWith("page_client-reference-manifest.js")) manifests.push(f); } })(base);
const cache = new Map();
const size = (f) => { if (cache.has(f)) return cache.get(f); const p = join(root, f); const r = existsSync(p) ? gzipSync(readFileSync(p)).length : 0; cache.set(f, r); return r; };
// chunks every page of the app loads (framework, main, polyfills...)
const bm = JSON.parse(readFileSync(join(root, "build-manifest.json"), "utf8"));
const common = new Set([...(bm.rootMainFiles || [])]);
const rows = [];
for (const m of manifests) {
  const src = readFileSync(m, "utf8");
  const chunks = new Set();
  for (const x of src.matchAll(/static\/chunks\/[A-Za-z0-9_\-./%()\[\]]+?\.js/g)) chunks.add(decodeURIComponent(x[0]));
  const css = new Set();
  for (const x of src.matchAll(/static\/(?:css|chunks)\/[A-Za-z0-9_\-./]+?\.css/g)) css.add(x[0]);
  const js = [...new Set([...chunks, ...common])];
  const route = m.slice(base.length).replace(/\\/g, "/").replace(/\/page_client-reference-manifest\.js$/, "") || "/";
  rows.push({ route: "/admin" + route, js: js.reduce((a, f) => a + size(f), 0), n: js.length, css: [...css].reduce((a, f) => a + size(f), 0) });
}
rows.sort((a, b) => b.js - a.js);
const k = (n) => String(Math.round(n / 1024)).padStart(4);
console.log("route".padEnd(44) + " JS gz  files  CSS gz");
for (const r of rows) console.log(r.route.padEnd(44) + k(r.js) + "  " + String(r.n).padStart(5) + k(r.css));
console.log("average JS gz", Math.round(rows.reduce((a, r) => a + r.js, 0) / rows.length / 1024));
