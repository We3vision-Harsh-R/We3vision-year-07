// CPU PROFILE (read-only): which scripts and functions use the main thread while a page loads and idles.
//   node tools/cpu-profile.mjs http://localhost:3000 /path [--cpu=4] [--seconds=8] [--device=desktop|phone|tablet]
// Run it on `next dev --webpack` (not on a production build): the dev build keeps file names and function names, a production build is minified.
// Numbers are for finding the heavy code, not for comparing with production times. Prints the biggest scripts and functions by SELF time (ms,
// at the CPU slowdown given). Needs Chrome (CHROME_PATH or the default Windows install) and Node 22+.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => Number((args.find((a) => a.startsWith(`--${n}=`)) ?? `--${n}=${d}`).split("=")[1]);
const pos = args.filter((a) => !a.startsWith("--"));
const base = (pos[0] ?? "http://localhost:3000").replace(/\/+$/, "");
const path = pos[1] ?? "/";
const cpu = flag("cpu", 4), seconds = flag("seconds", 8);
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!chromePath) { console.error("Chrome not found: set CHROME_PATH"); process.exit(2); }
const PORT = 9338;
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-cpu-"))}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
process.on("exit", () => { try { chrome.kill(); } catch {} });
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) { try { wsUrl = (await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? ""; } catch { await new Promise((r) => setTimeout(r, 500)); } }
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 1; const waiting = new Map(); const listeners = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } else listeners.forEach((l) => l(m)); };
const send = (method, params = {}) => new Promise((res) => { const i = id++; waiting.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable");
const deviceName = (args.find((a) => a.startsWith("--device=")) ?? "--device=desktop").split("=")[1];
const D = { desktop: [1440, 900, 1, false, ""], phone: [390, 844, 3, true, "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"], tablet: [820, 1180, 2, true, "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"] }[deviceName];
await send("Emulation.setDeviceMetricsOverride", { width: D[0], height: D[1], deviceScaleFactor: D[2], mobile: D[3] });
if (D[3]) { await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 }); await send("Network.setUserAgentOverride", { userAgent: D[4] }); }
await send("Emulation.setCPUThrottlingRate", { rate: cpu });
// warm the page once (dev server compiles on the first visit), then profile a fresh load
const load = async () => { const done = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") r(); }; listeners.push(l); setTimeout(r, 240000); }); await send("Page.navigate", { url: base + path }); await done; };
await load();
await send("Profiler.enable");
await send("Profiler.setSamplingInterval", { interval: 500 });
await send("Profiler.start");
await load();
await new Promise((r) => setTimeout(r, seconds * 1000));
const { result } = await send("Profiler.stop");
const prof = result.profile;
const byId = new Map(prof.nodes.map((n) => [n.id, n]));
const self = new Map();
prof.samples.forEach((nid, i) => self.set(nid, (self.get(nid) ?? 0) + (prof.timeDeltas[i] ?? 0)));
const short = (u) => (u || "(native)").replace(/^.*?(src\/[^?]*|node_modules\/[^?]*|_next\/[^?]*)/, "$1").replace(/^webpack-internal:.*\.\//, "").slice(-70);
const byUrl = new Map(), byFn = new Map();
let total = 0, idle = 0;
for (const [nid, t] of self) {
  const n = byId.get(nid); const cf = n.callFrame; const ms = t / 1000;
  if (cf.functionName === "(idle)") { idle += ms; continue; }
  total += ms;
  const u = short(cf.url); byUrl.set(u, (byUrl.get(u) ?? 0) + ms);
  const f = `${cf.functionName || "(anonymous)"}  ${u}:${cf.lineNumber + 1}`; byFn.set(f, (byFn.get(f) ?? 0) + ms);
}
const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
console.log(`${base}${path}   CPU ${cpu}x slower, ${seconds}s after load.   busy ${Math.round(total)} ms, idle ${Math.round(idle)} ms`);
console.log("\nbiggest scripts (self ms):");
for (const [u, ms] of top(byUrl, 14)) console.log(String(Math.round(ms)).padStart(7), " ", u);
console.log("\nbiggest functions (self ms):");
for (const [f, ms] of top(byFn, 16)) console.log(String(Math.round(ms)).padStart(7), " ", f);
process.exit(0);
