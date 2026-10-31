// PERF BUDGET (read-only): fails (exit 1) when a page of the last `npm run build` downloads more than the budget in tools/perf-budget.json.
//   npm run build && node tools/perf-budget.mjs        check
//   node tools/perf-budget.mjs --update                 write the budget from the current build (current maximum and average + 2 % headroom): use it
//                                                       only after the owner accepted the new numbers; the budget is a ratchet, it should only go down
// "gz" = gzip KB of the files a page loads first (JS and CSS), measured by tools/build-weight.mjs.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const FILE = "tools/perf-budget.json";
const rows = JSON.parse(execFileSync("node", ["tools/build-weight.mjs", "--json"], { encoding: "utf8", maxBuffer: 1 << 26 }));
const kb = (n) => Math.round(n / 1024);
const pages = rows.filter((r) => r.route !== "/_global-error");
const avg = (f) => Math.round(pages.reduce((a, r) => a + f(r), 0) / pages.length / 1024);
const now = { maxJsGz: Math.max(...pages.map((r) => kb(r.jsGz))), maxCssGz: Math.max(...pages.map((r) => kb(r.cssGz))), avgJsGz: avg((r) => r.jsGz), avgCssGz: avg((r) => r.cssGz) };

if (process.argv.includes("--update")) {
  const b = { note: "KB gzip, first load of any page; written by tools/perf-budget.mjs --update", maxJsGz: Math.ceil(now.maxJsGz * 1.02), maxCssGz: Math.ceil(now.maxCssGz * 1.02), avgJsGz: Math.ceil(now.avgJsGz * 1.02), avgCssGz: Math.ceil(now.avgCssGz * 1.02) };
  writeFileSync(FILE, JSON.stringify(b, null, 2) + "\n");
  console.log("budget written:", b);
  process.exit(0);
}
if (!existsSync(FILE)) { console.error("no budget yet: run `node tools/perf-budget.mjs --update` once"); process.exit(2); }
const budget = JSON.parse(readFileSync(FILE, "utf8"));
const over = pages.filter((r) => kb(r.jsGz) > budget.maxJsGz || kb(r.cssGz) > budget.maxCssGz);
console.log(`budget: biggest page JS <= ${budget.maxJsGz} KB gz, CSS <= ${budget.maxCssGz} KB gz; average JS <= ${budget.avgJsGz ?? "-"}, CSS <= ${budget.avgCssGz ?? "-"}`);
console.log(`now:    biggest page JS ${now.maxJsGz} KB, CSS ${now.maxCssGz} KB; average JS ${now.avgJsGz} KB, CSS ${now.avgCssGz} KB; ${pages.length} pages`);
const avgOver = (budget.avgJsGz && now.avgJsGz > budget.avgJsGz) || (budget.avgCssGz && now.avgCssGz > budget.avgCssGz);
if (avgOver) console.log("  OVER  the average of all pages is above its budget");
for (const r of over) console.log(`  OVER  ${r.route}: JS ${kb(r.jsGz)} KB, CSS ${kb(r.cssGz)} KB`);
if (over.length || avgOver) { console.log(`${over.length} page(s) over budget${avgOver ? ", average over budget" : ""}`); process.exit(1); }
console.log("all pages inside the budget");
