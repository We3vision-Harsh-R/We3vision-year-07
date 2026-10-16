// CLIENT GRAPH (read-only): the biggest "use client" files and who imports them ([c] = client file, [s] = server file).
//   node tools/client-graph.mjs [minKB]
// Why it matters: Next ships to a page EVERY client file that its server code can reach (also through next/dynamic). A big client file that
// is imported by a server file therefore goes to every page that includes that server file. A client file that is only reached through
// a dynamic import INSIDE another client file becomes its own chunk, loaded only when it is rendered.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { posix } from "node:path";

const minKB = Number(process.argv[2] ?? 14);
const files = [];
(function walk(d) { for (const n of readdirSync(d)) { const f = join(d, n); if (statSync(f).isDirectory()) walk(f); else if (/\.tsx?$/.test(n)) files.push(f.split("\\").join("/")); } })("src");
const info = {};
for (const f of files) { const t = readFileSync(f, "utf8"); info[f] = { t, client: /^\s*["']use client["']/m.test(t.slice(0, 300)), size: t.length }; }
const resolve = (from, spec) => {
  let base;
  if (spec.startsWith("@/")) base = "src/" + spec.slice(2);
  else if (spec.startsWith(".")) base = posix.join(posix.dirname(from), spec);
  else return null;
  for (const e of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]) if (info[base + e]) return base + e;
  return null;
};
const importers = {};
for (const f of files) for (const m of info[f].t.matchAll(/(?:import|export)[^"';]*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)) {
  const r = resolve(f, m[1] ?? m[2]);
  if (r) (importers[r] ??= []).push(f);
}
const short = (x) => x.replace("src/components/site/", "").replace("src/app/", "app/");
const rows = files.filter((f) => info[f].client && info[f].size > minKB * 1000).sort((a, b) => info[b].size - info[a].size);
for (const f of rows) console.log(String(Math.round(info[f].size / 1024)).padStart(4) + "K  " + short(f).padEnd(38) + " <- " + (importers[f] ?? []).map((x) => short(x) + (info[x].client ? "[c]" : "[s]")).join(", ").slice(0, 120));
