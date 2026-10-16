// CHUNK REPORT: what is inside the JavaScript that a page downloads (read-only). Needs a build made with ANALYZE_STATS=1:
//   ANALYZE_STATS=1 npm run build
//   node tools/chunk-report.mjs /seo           the chunks of one page, biggest first, with the packages / source folders inside each
//   node tools/chunk-report.mjs /seo --files   also the biggest single modules
// Sizes are the parsed (source) sizes webpack reports, before minification: use them to compare parts, not as download size.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const route = process.argv[2] ?? "/";
const showFiles = process.argv.includes("--files");
const file = ".next/stats-client.json";
if (!existsSync(file)) { console.error("No stats: run `ANALYZE_STATS=1 npm run build` first."); process.exit(2); }
const stats = JSON.parse(readFileSync(file, "utf8"));
const html = readFileSync(join(".next/server/app", (route === "/" ? "index" : route.replace(/^\//, "")) + ".html"), "utf8");
const wanted = new Set([...html.matchAll(/src="\/_next\/(static\/chunks\/[^"?]+\.js)/g)].map((m) => m[1]));
const chunks = stats.chunks.filter((c) => c.files.some((f) => wanted.has(f)));
const label = (name) => {
  const m = /node_modules\/((?:@[^/]+\/)?[^/]+)/.exec(name);
  if (m) return "pkg:" + m[1];
  const s = /^\.\/src\/(.*)$/.exec(name.replace(/^\.\/(\.claude\/worktrees\/[^/]+\/)?/, "./"));
  if (s) { const parts = s[1].split("/"); return "src:" + parts.slice(0, parts.length > 3 ? 3 : parts.length - 1).join("/"); }
  return "other:" + name.split("/").slice(0, 2).join("/");
};
const flat = (mods) => mods.flatMap((m) => (m.modules ? flat(m.modules) : [m])).filter((m) => m.name);
let total = 0;
const rows = [];
for (const c of chunks) {
  const mods = flat(c.modules ?? []);
  const sum = mods.reduce((a, m) => a + (m.size ?? 0), 0);
  total += sum;
  const by = new Map();
  for (const m of mods) by.set(label(m.name), (by.get(label(m.name)) ?? 0) + (m.size ?? 0));
  rows.push({ c, sum, by, mods });
}
rows.sort((a, b) => b.sum - a.sum);
const k = (n) => (n / 1024).toFixed(0).padStart(5) + " KB";
console.log(`${route}: ${chunks.length} chunks, ${k(total)} of module source in total\n`);
for (const r of rows.slice(0, 8)) {
  console.log(`${r.c.files[0].split("/").pop().padEnd(40)} ${k(r.sum)}  (${r.mods.length} modules)`);
  for (const [name, size] of [...r.by.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) console.log(`     ${k(size)}  ${name}`);
  if (showFiles) for (const m of r.mods.sort((a, b) => b.size - a.size).slice(0, 8)) console.log(`        ${k(m.size)}  ${m.name.slice(0, 100)}`);
}
