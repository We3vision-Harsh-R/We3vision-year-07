// CSS USAGE PER PAGE (read-only): which class families (gfx-, bdv-, ...) are really in the HTML of which page.
//   node tools/css-usage.mjs http://localhost:1010 [out.json]
// It reads /sitemap.xml, downloads every page (server-rendered HTML, so what the visitor gets first) and collects all class names.
// Classes added later by JavaScript (clicks, modals) are NOT in this HTML: the source files are searched too ("mentions"), and a family
// that is mentioned in a file but never seen in the HTML is reported as "js-only" so nobody moves it by mistake.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { prefixOf } from "./css-parse.mjs";

const base = (process.argv[2] ?? "http://localhost:1010").replace(/\/+$/, "");
const out = process.argv[3];
const sm = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
const extra = ["/", "/sitemap", "/m"];
const paths = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname).concat(extra))];

const pageFamilies = {}; // path -> { family: count }
for (const p of paths) {
  const res = await fetch(base + p, { redirect: "manual" }).catch(() => null);
  if (!res || res.status !== 200) { console.log(`skip ${p} (${res ? res.status : "no answer"})`); continue; }
  const html = await res.text();
  const fam = {};
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) fam[prefixOf(c)] = (fam[prefixOf(c)] ?? 0) + 1;
  }
  pageFamilies[p] = fam;
  console.log(`ok   ${p}  (${Object.keys(fam).length} families)`);
}

// source mentions: "gfx-" inside a ts/tsx string anywhere under src (not globals.css)
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const f = join(d, n); const s = statSync(f); if (s.isDirectory()) walk(f); else if (/\.(tsx?|mjs)$/.test(n)) files.push(f); } };
walk("src");
const allFamilies = new Set(Object.values(pageFamilies).flatMap((o) => Object.keys(o)));
const css = readFileSync("src/app/globals.css", "utf8");
for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) allFamilies.add(prefixOf(m[1]));
const mentions = {};
for (const f of files) {
  const t = readFileSync(f, "utf8");
  for (const fam of allFamilies) {
    if (fam.length < 2 || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(fam)) continue;
    if (new RegExp(`(?<![\\w-])${fam}-[\\w$\\{]|["'\`]${fam}["'\`\\s]`).test(t)) (mentions[fam] ??= []).push(relative(".", f).replace(/\\/g, "/"));
  }
}
const result = { base, paths: Object.keys(pageFamilies), pageFamilies, mentions };
if (out) writeFileSync(out, JSON.stringify(result));
const byFamily = {};
for (const [p, fam] of Object.entries(pageFamilies)) for (const f of Object.keys(fam)) (byFamily[f] ??= []).push(p);
console.log("\nfamily -> pages (families in 1-3 pages only)");
for (const [f, ps] of Object.entries(byFamily).sort((a, b) => a[1].length - b[1].length)) if (ps.length <= 3) console.log(`${f.padEnd(10)} ${ps.join(" ")}`);
