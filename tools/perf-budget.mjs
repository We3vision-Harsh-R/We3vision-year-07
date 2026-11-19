// PERF BUDGET (read-only): fails (exit 1) when a page of the last `npm run build` downloads more than the budget in tools/perf-budget.json.
//   npm run build && node tools/perf-budget.mjs        check
//   node tools/perf-budget.mjs --update                 write the budget from the current build (current maximum and averages + 2 % headroom): use it
//                                                       only after the owner accepted the new numbers; the budget is a ratchet, it should only go down
// "gz" = gzip KB of the files a page loads first (JS and CSS), measured by tools/build-weight.mjs.
// Two groups are averaged SEPARATELY: the laptop pages and the phone/tablet app (/m/...). One average over all pages moved whenever the mix changed
// (22 new blog articles or 10 privacy pages made the "average" worse without any page getting heavier).
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const FILE = "tools/perf-budget.json";
const rows = JSON.parse(execFileSync("node", ["tools/build-weight.mjs", "--json"], { encoding: "utf8", maxBuffer: 1 << 26 }));
const kb = (n) => Math.round(n / 1024);
const pages = rows.filter((r) => r.route !== "/_global-error");
const isPhone = (r) => r.route === "/m" || r.route.startsWith("/m/");
const laptop = pages.filter((r) => !isPhone(r));
const phone = pages.filter(isPhone);
const avg = (list, f) => (list.length ? Math.round(list.reduce((a, r) => a + f(r), 0) / list.length / 1024) : 0);
const now = {
  maxJsGz: Math.max(...pages.map((r) => kb(r.jsGz))),
  maxCssGz: Math.max(...pages.map((r) => kb(r.cssGz))),
  avgLaptopJsGz: avg(laptop, (r) => r.jsGz),
  avgLaptopCssGz: avg(laptop, (r) => r.cssGz),
  avgPhoneJsGz: avg(phone, (r) => r.jsGz),
  avgPhoneCssGz: avg(phone, (r) => r.cssGz),
};
const up = (n) => Math.ceil(n * 1.02);

if (process.argv.includes("--update")) {
  const b = {
    note: "KB gzip, first load of a page; written by tools/perf-budget.mjs --update (maximum of any page; averages of the laptop pages and of the phone app /m separately)",
    maxJsGz: up(now.maxJsGz),
    maxCssGz: up(now.maxCssGz),
    avgLaptopJsGz: up(now.avgLaptopJsGz),
    avgLaptopCssGz: up(now.avgLaptopCssGz),
    avgPhoneJsGz: up(now.avgPhoneJsGz),
    avgPhoneCssGz: up(now.avgPhoneCssGz),
  };
  writeFileSync(FILE, JSON.stringify(b, null, 2) + "\n");
  console.log("budget written:", b);
  process.exit(0);
}
if (!existsSync(FILE)) { console.error("no budget yet: run `node tools/perf-budget.mjs --update` once"); process.exit(2); }
const budget = JSON.parse(readFileSync(FILE, "utf8"));
const over = pages.filter((r) => kb(r.jsGz) > budget.maxJsGz || kb(r.cssGz) > budget.maxCssGz);
console.log(`budget: biggest page JS <= ${budget.maxJsGz} KB gz, CSS <= ${budget.maxCssGz} KB gz`);
console.log(`        laptop average JS <= ${budget.avgLaptopJsGz ?? "-"}, CSS <= ${budget.avgLaptopCssGz ?? "-"}; phone app average JS <= ${budget.avgPhoneJsGz ?? "-"}, CSS <= ${budget.avgPhoneCssGz ?? "-"}`);
console.log(`now:    biggest page JS ${now.maxJsGz} KB, CSS ${now.maxCssGz} KB; ${laptop.length} laptop pages average JS ${now.avgLaptopJsGz}, CSS ${now.avgLaptopCssGz}; ${phone.length} phone pages average JS ${now.avgPhoneJsGz}, CSS ${now.avgPhoneCssGz}`);
const avgOver = [
  [budget.avgLaptopJsGz, now.avgLaptopJsGz, "laptop average JS"],
  [budget.avgLaptopCssGz, now.avgLaptopCssGz, "laptop average CSS"],
  [budget.avgPhoneJsGz, now.avgPhoneJsGz, "phone average JS"],
  [budget.avgPhoneCssGz, now.avgPhoneCssGz, "phone average CSS"],
].filter(([limit, value]) => limit && value > limit);
for (const [limit, value, name] of avgOver) console.log(`  OVER  ${name}: ${value} KB (budget ${limit})`);
for (const r of over) console.log(`  OVER  ${r.route}: JS ${kb(r.jsGz)} KB, CSS ${kb(r.cssGz)} KB`);
if (over.length || avgOver.length) { console.log(`${over.length} page(s) over budget${avgOver.length ? `, ${avgOver.length} average(s) over budget` : ""}`); process.exit(1); }
console.log("all pages inside the budget");
