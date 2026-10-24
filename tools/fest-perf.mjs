// FESTIVAL LOAD RUN (read-only): how much work the browser does with the festival effects on, and how smooth the page stays.
//   node tools/fest-perf.mjs http://localhost:1015 [/path] [--only=name,name] [--ms=5000] [--cpu=1] [--scroll]
// The site must be a production build made with NEXT_PUBLIC_FEST_PREVIEW=1 (then "?festtest" switches every effect on; "?festtest=a,b" only the
// effects a and b). Every scenario loads the page cold in a headless Chrome (1440x900), waits for the effects to settle, then for `ms` milliseconds
//   - records every frame time (requestAnimationFrame),
//   - measures the CPU seconds that every browser process used (renderer = scripts + style + layout + paint, gpu = compositing and the
//     blur / blend work, browser = the rest), per second of wall time.
// The browser draws with the CPU (software GL), so the numbers are only good to COMPARE scenarios on this PC; a real graphics card is much faster.
// A scenario can also inject CSS after the load to switch one part off (ablation), to find the part that costs the most.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) ?? `--${n}=${d}`).split("=").slice(1).join("=");
const pos = args.filter((a) => !a.startsWith("--"));
const base = (pos[0] ?? "http://localhost:1015").replace(/\/+$/, "");
const path = pos[1] ?? "/portfolio";
const ms = Number(flag("ms", 5000));
const cpu = Number(flag("cpu", 1));
const only = flag("only", "").split(",").filter(Boolean);
const scroll = args.includes("--scroll");
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!chromePath) throw new Error("Chrome not found (set CHROME_PATH)");

/** the scenarios: a query string and optional CSS that is injected after the load */
const SCENARIOS = JSON.parse(process.env.FEST_SCENARIOS ?? "null") ?? [
  { name: "off", q: "" },
  { name: "all", q: "?festtest" },
  { name: "no-blur", q: "?festtest", css: ".fs-depth{filter:none!important}" },
  { name: "no-glow", q: "?festtest", css: ".fs-glow{display:none!important}" },
  { name: "no-bulb-anim", q: "?festtest", css: ".fs-bulb{animation:none!important}" },
  { name: "no-diyas", q: "?festtest", css: ".fs-diyaline,.fs-ftdiyas{display:none!important}" },
  { name: "no-brand", q: "?festtest", css: ".fs-brand{display:none!important}" },
  { name: "no-canvas", q: "?festtest", css: ".fs-cv{display:none!important}" },
  { name: "no-lanterns", q: "?festtest", css: ".fs-lantern{display:none!important}" },
  { name: "no-kandils", q: "?festtest", css: ".fs-kandil{display:none!important}" },
  { name: "no-toran", q: "?festtest", css: ".fs-toran{display:none!important}" },
  { name: "no-rangoli", q: "?festtest", css: ".fs-rangoli{display:none!important}" },
];

const PORT = 9350 + Math.floor(Math.random() * 40);
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-fp-"))}`, "--no-first-run", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", "about:blank"], { stdio: "ignore" });
process.on("exit", () => {
  try {
    chrome.kill();
  } catch {}
});
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    wsUrl = (await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? "";
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 1;
const waiting = new Map();
const listeners = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiting.has(m.id)) {
    waiting.get(m.id)(m);
    waiting.delete(m.id);
  } else listeners.forEach((l) => l(m));
};
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = id++;
    waiting.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
// SystemInfo lives on the browser target, not on the page
const ver = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
const bws = new WebSocket(ver.webSocketDebuggerUrl);
await new Promise((r) => (bws.onopen = r));
let bid = 1;
const bwaiting = new Map();
bws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && bwaiting.has(m.id)) {
    bwaiting.get(m.id)(m);
    bwaiting.delete(m.id);
  }
};
const bsend = (method, params = {}) =>
  new Promise((res) => {
    const i = bid++;
    bwaiting.set(i, res);
    bws.send(JSON.stringify({ id: i, method, params }));
  });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.result?.value;
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
if (cpu > 1) await send("Emulation.setCPUThrottlingRate", { rate: cpu });
const load = async (url) => {
  const done = new Promise((r) => {
    listeners.push((m) => m.method === "Page.loadEventFired" && r());
    setTimeout(r, 120000);
  });
  await send("Page.navigate", { url });
  await done;
};
const procs = async () => {
  const r = (await bsend("SystemInfo.getProcessInfo")).result?.processInfo ?? [];
  const sum = {};
  for (const p of r) sum[p.type] = (sum[p.type] ?? 0) + p.cpuTime;
  return sum;
};
const RECORD = (ms, step) => `(async () => {
  const times = []; let last = performance.now(); let alive = true;
  const tick = (t) => { times.push(t - last); last = t; if (alive) requestAnimationFrame(tick); };
  requestAnimationFrame((t) => { last = t; requestAnimationFrame(tick); });
  const start = performance.now();
  await new Promise((resolve) => { const run = () => { ${step}; if (performance.now() - start < ${ms}) setTimeout(run, 16); else resolve(); }; run(); });
  alive = false; await new Promise((r) => setTimeout(r, 50));
  return times;
})()`;
const stats = (t) => {
  const a = (t ?? []).filter((x) => x > 0 && x < 20000);
  const s = [...a].sort((x, y) => x - y);
  const avg = a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
  return { fps: a.length ? Math.round(1000 / avg) : 0, p95: Math.round(s[Math.floor(s.length * 0.95)] ?? 0), over50: a.filter((x) => x > 50).length, frames: a.length };
};

const rows = [];
for (const sc of SCENARIOS) {
  if (only.length && !only.includes(sc.name)) continue;
  await load("about:blank");
  await load(base + path + sc.q);
  await ev("try{sessionStorage.setItem('we3.theme.seen','1')}catch(e){}");
  await new Promise((r) => setTimeout(r, 3500));
  if (sc.css) await ev(`document.head.appendChild(Object.assign(document.createElement('style'),{textContent:${JSON.stringify(sc.css)}})); 1`);
  if (sc.js) await ev(sc.js);
  await new Promise((r) => setTimeout(r, 1200));
  const t0 = Date.now();
  const p0 = await procs();
  const times = await ev(RECORD(ms, scroll ? "window.scrollBy(0, 6)" : ""));
  const wall = (Date.now() - t0) / 1000;
  const p1 = await procs();
  const per = (k) => (((p1[k] ?? 0) - (p0[k] ?? 0)) / wall) * 100; // percent of one core
  const info = await ev("({fx:(document.documentElement.getAttribute('data-fest-fx')||'').split(' ').filter(Boolean).length, canvases:document.querySelectorAll('.fs-top canvas').length, nodes:document.getElementsByTagName('*').length})");
  rows.push({ name: sc.name, renderer: per("renderer"), gpu: per("GPU"), browser: per("browser"), ...stats(times), ...info });
}
console.log(`${base}${path}  (headless, software drawing, CPU ${cpu}x, ${ms / 1000}s per scenario${scroll ? ", scrolling" : ", idle"})  CPU = % of one core`);
console.log("scenario".padEnd(16) + "renderer   gpu   browser   total   fps   p95ms   >50ms   effects  nodes");
for (const r of rows) {
  const total = r.renderer + r.gpu + r.browser;
  console.log(r.name.padEnd(16) + `${r.renderer.toFixed(0).padStart(7)}% ${r.gpu.toFixed(0).padStart(5)}% ${r.browser.toFixed(0).padStart(7)}% ${total.toFixed(0).padStart(6)}%  ${String(r.fps).padStart(4)}  ${String(r.p95).padStart(6)}  ${String(r.over50).padStart(6)}  ${String(r.fx).padStart(7)}  ${r.nodes}`);
}
process.exit(0);
