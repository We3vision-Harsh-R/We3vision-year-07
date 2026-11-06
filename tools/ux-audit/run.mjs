// UX AUDIT runner: opens every page of the site in headless Chrome (laptop sizes + an iPhone) and collects what inpage.js finds.
//   node tools/ux-audit/run.mjs <baseUrl> [--only=laptop|phone] [--quick=1] [--workers=3] [--paths=/a,/b] [--limit=N] [--out=.task-log/ux-audit]
//   node tools/ux-audit/report.mjs [--out=...]            (rebuild the lists from the saved raw.jsonl)
// Pages: /sitemap.xml of the site. Laptop: 1440x900 on every page, 1280x720 and 1920x1080 on the main pages. Phone: 390x844 on every page
// (the iPhone user agent makes src/proxy.ts serve the /m app pages, exactly what a visitor gets). Needs Chrome and Node 22+.
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch, setViewport, visit } from "./cdp.mjs";
import { writeReports } from "./report.mjs";

const args = process.argv.slice(2);
const flag = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=") ?? d;
const base = (args.find((a) => !a.startsWith("--")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("usage: node tools/ux-audit/run.mjs <baseUrl> [--only=laptop|phone] [--workers=3] [--paths=/a,/b] [--limit=N]");
  process.exit(2);
}
const OUT = flag("out", ".task-log/ux-audit");
const only = flag("only", "");
const workers = +flag("workers", 3);
mkdirSync(OUT, { recursive: true });
const RAW = join(OUT, "raw.jsonl");
if (!flag("append")) writeFileSync(RAW, "");

let paths = flag("paths", "") ? flag("paths").split(",") : [];
if (!paths.length) {
  const sm = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
  paths = [...new Set(["/", ...[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname)])];
}
if (flag("limit")) paths = paths.slice(0, +flag("limit"));
const main = paths.filter((p) => p.split("/").filter(Boolean).length <= 1);

const VIEWPORTS = [
  { device: "laptop", w: 1440, h: 900, list: paths },
  { device: "laptop", w: 1280, h: 720, list: main },
  { device: "laptop", w: 1920, h: 1080, list: main },
  { device: "phone", w: 390, h: 844, phone: true, list: paths },
];
const quick = flag("quick"); // --quick=1: only 1440x900 and the phone (a fix loop does not need all three laptop sizes)
const jobs = VIEWPORTS.filter((v) => (!only || v.device === only) && !(quick && v.w !== 1440 && v.device === "laptop")).flatMap((v) => v.list.map((path) => ({ ...v, path })));
console.log(`${jobs.length} page checks (${paths.length} pages, ${main.length} main) with ${workers} Chrome windows`);

const INPAGE = readFileSync(new URL("./inpage.js", import.meta.url), "utf8");
let done = 0;
async function work(id) {
  const c = await launch(9400 + id);
  let cur = "";
  while (jobs.length) {
    const j = jobs.shift();
    const key = `${j.w}x${j.h}${j.phone ? "p" : ""}`;
    if (key !== cur) { await setViewport(c, j); cur = key; }
    const cfg = { phone: !!j.phone, minTarget: j.phone ? 44 : 24, minLabel: j.phone ? 12 : 14, minPara: j.phone ? 15 : 16, css: j.path === "/" };
    const row = { device: j.device, vp: `${j.w}x${j.h}`, path: j.path };
    try {
      const { data, problems, status } = await visit(c, base + j.path, `(${INPAGE})(${JSON.stringify(cfg)})`);
      Object.assign(row, data, { status, problems });
    } catch (e) {
      row.error = String(e.message ?? e).slice(0, 200);
    }
    appendFileSync(RAW, JSON.stringify(row) + "\n");
    done++;
    console.log(`${String(done).padStart(3)} ${row.error ? "ERROR" : "ok   "} ${row.vp.padEnd(9)} ${j.path}${row.error ? " " + row.error : ""}`);
  }
  c.close();
}
await Promise.all(Array.from({ length: workers }, (_, i) => work(i)));
writeReports(OUT);
process.exit(0);
