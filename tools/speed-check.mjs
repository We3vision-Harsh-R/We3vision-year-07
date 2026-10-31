// SPEED CHECK: the one command that answers "is the site still fast?" (read-only; it only starts a local server on a free port).
//   npm run speed:check                         weights + budget, then a fresh `next start` of the CURRENT build measured in headless Chrome
//   npm run speed:check -- --build              run `npm run build` first (5-10 minutes)
//   npm run speed:check -- --quick              only the weights and the budget (no browser, ~5 seconds)
//   npm run speed:check -- --compare=http://localhost:1011   also prove the look is unchanged: style-diff of that (older) server against this build
//   npm run speed:check -- --port=1090          the port of the temporary server (default 1090)
// Steps: 1 budget (tools/perf-budget.mjs: biggest page and the average, JS + CSS gzip)   2 admin weight (info)   3 load numbers on laptop, tablet and
// phone (tools/perf-run.mjs: FCP, LCP, CLS, blocking time, bytes)   4 mouse smoothness (tools/pointer-run.mjs: fps and slow frames while a mouse moves)
// 5 optional look compare (tools/style-diff.mjs).  FAIL = over the budget, or a layout shift (CLS) above 0.05. FCP/LCP/blocking time/fps are
// printed but never fail the check: the test PC draws in software and the same build varies a lot between runs, so compare them only with a run
// of the previous version made on the same PC right before (see brain/15-optimization-handbook.md).
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) ?? `--${n}=${d}`).slice(n.length + 3);
const PORT = Number(flag("port", 1090));
const quick = args.includes("--quick");
const compare = flag("compare", "");
const fails = [];
const log = (s = "") => console.log(s);
const head = (s) => log(`\n== ${s} ` + "=".repeat(Math.max(3, 70 - s.length)));
const node = (script, a = [], opts = {}) => spawnSync(process.execPath, [script, ...a], { encoding: "utf8", maxBuffer: 1 << 27, env: { ...process.env, MSYS_NO_PATHCONV: "1" }, ...opts });
const t0 = Date.now();

if (args.includes("--build")) {
  head("0  build");
  const r = spawnSync("npm", ["run", "build"], { stdio: "inherit", shell: true });
  if (r.status !== 0) { console.error("build failed: nothing to measure"); process.exit(2); }
}
if (!existsSync(".next/server/app")) { console.error("No build found: run `npm run speed:check -- --build` (or `npm run build`) first."); process.exit(2); }

head("1  budget (tools/perf-budget.json)");
const b = node("tools/perf-budget.mjs");
log(b.stdout.trim());
if (b.status !== 0) fails.push("over the JS/CSS budget");

head("2  admin pages (estimated JS, info)");
const a = node("tools/admin-weight.mjs");
const lines = a.stdout.trim().split("\n");
log([lines[0], ...lines.slice(1, 4), "...", lines[lines.length - 1]].join("\n"));

if (quick) finish();

// a temporary production server of the current build
const nextBin = "node_modules/next/dist/bin/next";
const server = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], { stdio: "ignore" });
const stop = () => { try { server.kill(); } catch {} };
process.on("exit", stop);
const base = `http://localhost:${PORT}`;
let up = false;
for (let i = 0; i < 40 && !up; i++) { try { up = (await fetch(base + "/", { signal: AbortSignal.timeout(3000) })).ok; } catch { await new Promise((r) => setTimeout(r, 1500)); } }
if (!up) { stop(); console.error(`the server did not start on port ${PORT} (is the port free?)`); process.exit(2); }

const json = (script, a) => { const r = node(script, [...a, "--json"]); try { return JSON.parse(r.stdout.slice(r.stdout.indexOf("["), r.stdout.lastIndexOf("]") + 1) || r.stdout.slice(r.stdout.indexOf("{"))); } catch { return null; } };
const perf = (device, paths) => { const r = node("tools/perf-run.mjs", [base, ...paths, `--device=${device}`, "--json"]); try { return JSON.parse(r.stdout.slice(r.stdout.indexOf("{"))).rows; } catch { return null; } };
head("3  load numbers (median of 3 cold loads, no throttling)");
log("device  page                          FCP    LCP    CLS    TBT  req  JS KB CSS KB");
for (const [device, paths] of [["desktop", ["/", "/webdev", "/contact"]], ["tablet", ["/", "/webdev"]], ["phone", ["/", "/webdev"]]]) {
  const rows = perf(device, paths);
  if (!rows) { log(`${device}: no result (Chrome not found?)`); fails.push(`${device} load run failed`); continue; }
  for (const r of rows) {
    log(`${device.padEnd(8)}${r.path.padEnd(26)}${String(r.fcp).padStart(6)} ${String(r.lcp).padStart(6)} ${String(r.cls).padStart(6)} ${String(r.tbt).padStart(6)} ${String(r.requests).padStart(4)} ${String(r.js).padStart(5)} ${String(r.css).padStart(6)}`);
    if (r.cls > 0.05) fails.push(`${device} ${r.path}: layout shift CLS ${r.cls} > 0.05`);
  }
}

head("4  mouse smoothness (laptop, returning visitor, mouse kept off the bottom menu)");
const pr = json("tools/pointer-run.mjs", [base, "/", "/webdev", "/contact", "/about", "--returning", "--seconds=4"]);
if (!pr) log("no result");
else {
  log("page                  fps   p95 ms  worst ms  frames>50ms  style%");
  for (const r of pr) log(`${r.path.padEnd(20)}${String(r.fps).padStart(5)} ${String(r.p95).padStart(8)} ${String(r.worst).padStart(9)} ${String(r.over50).padStart(11)} ${String(r.style).padStart(7)}`);
  log("(the software-drawn test browser: 60 fps = as smooth as it can be; Home is slow here even without a mouse)");
}

if (compare) {
  head(`5  look compare: ${compare} (old)  vs  ${base} (this build)`);
  const r = node("tools/style-diff.mjs", ["diff", compare, base, "/", "/seo", "/about", "/webdev", "/contact", "/graphics", "/careers"], { timeout: 1000 * 60 * 15 });
  const out = (r.stdout || "").trim().split("\n").filter((l) => /^(same|DIFF)/.test(l));
  log(out.join("\n"));
  for (const l of out) if (l.startsWith("DIFF")) fails.push(l.slice(0, 80));
}
stop();
finish();

function finish() {
  head(`result (${Math.round((Date.now() - t0) / 1000)} s)`);
  if (fails.length) { log("FAIL:"); for (const f of fails) log("  - " + f); process.exit(1); }
  log(quick ? "PASS (quick): inside the budget (the browser checks were skipped)" : "PASS: inside the budget, no layout shift above 0.05" + (compare ? ", look identical" : ""));
  process.exit(0);
}
