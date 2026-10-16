// CSS SPLIT ANALYSIS (read-only): how many bytes of src/app/globals.css belong to which class family (the prefix before the first dash).
//   node tools/css-analyze.mjs            table of families, biggest first
//   node tools/css-analyze.mjs --json     the same as JSON (used by css-usage.mjs)
import { readFileSync } from "node:fs";
import { parseCss, classesOf, prefixOf, leaves } from "./css-parse.mjs";

const file = "src/app/globals.css";
const src = readFileSync(file, "utf8");
const tree = parseCss(src);

// the parser must give the file back exactly: otherwise nothing built on it can be trusted
const joined = tree.map((x) => x.text).join("");
if (joined !== src) {
  console.error(`PARSER MISMATCH: ${joined.length} vs ${src.length} chars`);
  process.exit(2);
}

const flat = leaves(tree);
const families = new Map(); // prefix -> { bytes, rules, mixedBytes }
const base = { bytes: 0, rules: 0 };
let keyframes = { bytes: 0, count: 0 };
for (const r of flat) {
  const size = Buffer.byteLength(r.text);
  if (r.kind === "at" && /^@keyframes/i.test(r.prelude)) { keyframes.bytes += size; keyframes.count++; continue; }
  if (r.kind !== "rule") { base.bytes += size; base.rules++; continue; }
  const cls = classesOf(r.prelude);
  if (cls.length === 0) { base.bytes += size; base.rules++; continue; }
  const fams = [...new Set(cls.map(prefixOf))];
  for (const f of fams) {
    const e = families.get(f) ?? { bytes: 0, rules: 0, shared: 0 };
    if (fams.length === 1) { e.bytes += size; e.rules++; } else e.shared += size;
    families.set(f, e);
  }
}
const rows = [...families.entries()].map(([prefix, e]) => ({ prefix, ...e })).sort((a, b) => b.bytes - a.bytes);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ total: Buffer.byteLength(src), base, keyframes, families: rows }, null, 2));
  process.exit(0);
}
const kb = (b) => (b / 1024).toFixed(1).padStart(8) + " KB";
console.log(`globals.css: ${(Buffer.byteLength(src) / 1024).toFixed(0)} KB, ${tree.length} top-level nodes, ${flat.length} leaf rules, ${families.size} class families`);
console.log(`no class (:root, html, body, *, element selectors, @font-face, ...): ${kb(base.bytes)} in ${base.rules} rules`);
console.log(`@keyframes: ${kb(keyframes.bytes)} in ${keyframes.count}`);
console.log("\nfamily        own rules   (count)   rules that mix families");
for (const r of rows.slice(0, 70)) console.log(`${r.prefix.padEnd(12)} ${kb(r.bytes)}  ${String(r.rules).padStart(6)}   ${kb(r.shared)}`);
const rest = rows.slice(70);
console.log(`... ${rest.length} more small families, ${kb(rest.reduce((a, r) => a + r.bytes, 0))} together`);
