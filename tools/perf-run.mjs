// PERF RUN: real loading numbers of pages in a headless Chrome (read-only). Use it against `next start` (a production build), not `next dev`.
//   node tools/perf-run.mjs http://localhost:1010 [/path ...] [--profile=desktop|4g|slow4g] [--json]
// Per page it prints: FCP and LCP (ms), CLS, blocking time (sum of long tasks over 50 ms), number of requests, and the bytes that were really
// transferred (compressed) split into JS / CSS / images / fonts / HTML. Cache is off, every page is loaded cold, 3 runs, the median is shown.
// Profiles: desktop = no throttling; 4g = 9 Mbit/s, 170 ms round trip, CPU 2x slower; slow4g = 1.6 Mbit/s, 150 ms, CPU 4x slower (Lighthouse "mobile").
// With no /path a set of key pages is used. Needs Chrome (CHROME_PATH or the default Windows install) and Node 22+.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) ?? `--${n}=${d}`).split("=")[1];
const asJson = args.includes("--json");
const profileName = flag("profile", "desktop");
const positional = args.filter((a) => !a.startsWith("--"));
const base = (positional[0] ?? "http://localhost:1010").replace(/\/+$/, "");
const paths = positional.slice(1).length ? positional.slice(1) : ["/", "/about", "/blog", "/contact", "/careers", "/webdev", "/seo", "/graphics", "/metaverse", "/brand-development-services", "/headless-CMS-devlopment-services"];
const PROFILES = {
  desktop: { down: 0, up: 0, rtt: 0, cpu: 1 },
  "4g": { down: (9 * 1024 * 1024) / 8, up: (9 * 1024 * 1024) / 8, rtt: 170, cpu: 2 },
  slow4g: { down: (1.6 * 1024 * 1024) / 8, up: (750 * 1024) / 8, rtt: 150, cpu: 4 },
};
const profile = PROFILES[profileName];
if (!profile) { console.error("profile must be desktop, 4g or slow4g"); process.exit(2); }
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!chromePath) { console.error("Chrome not found: set CHROME_PATH"); process.exit(2); }

const PORT = 9335;
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-perf-"))}`, "--no-first-run", "--disable-extensions", "--mute-audio", "about:blank"], { stdio: "ignore" });
const stop = () => { try { chrome.kill(); } catch {} };
process.on("exit", stop);
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) {
  try { wsUrl = (await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? ""; } catch { await new Promise((r) => setTimeout(r, 500)); }
}
if (!wsUrl) { console.error("could not start Chrome"); process.exit(2); }
const ws = new WebSocket(wsUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let nextId = 1;
const waiting = new Map(), listeners = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } else listeners.forEach((l) => l(m));
};
const send = (method, params = {}) => new Promise((res) => { const id = nextId++; waiting.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
await send("Page.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Network.emulateNetworkConditions", { offline: false, latency: profile.rtt, downloadThroughput: profile.down || -1, uploadThroughput: profile.up || -1 });
await send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `(() => {
    window.__perf = { lcp: 0, fcp: 0, cls: 0, tbt: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__perf.fcp = e.startTime; }).observe({ type: "paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.tbt += Math.max(0, e.duration - 50); }).observe({ type: "longtask", buffered: true });
  })();`,
});

const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
async function run(path) {
  const types = new Map(); // requestId -> resource type
  const bytes = { Script: 0, Stylesheet: 0, Image: 0, Font: 0, Document: 0, Other: 0 };
  let requests = 0;
  const on = (m) => {
    if (m.method === "Network.requestWillBeSent") { requests++; types.set(m.params.requestId, m.params.type); }
    if (m.method === "Network.loadingFinished") {
      const t = types.get(m.params.requestId) ?? "Other";
      bytes[t in bytes ? t : "Other"] += m.params.encodedDataLength;
    }
  };
  listeners.push(on);
  const loaded = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") { listeners.splice(listeners.indexOf(l), 1); r(); } }; listeners.push(l); setTimeout(r, 90000); });
  await send("Page.navigate", { url: base + path });
  await loaded;
  await new Promise((r) => setTimeout(r, 2500 * Math.max(1, profile.cpu / 2))); // late work: idle chunks, lazy parts
  const v = (await send("Runtime.evaluate", { expression: "JSON.stringify(window.__perf)", returnByValue: true })).result.result.value;
  listeners.splice(listeners.indexOf(on), 1);
  const p = JSON.parse(v);
  const kb = (n) => Math.round(n / 1024);
  return { fcp: Math.round(p.fcp), lcp: Math.round(p.lcp), cls: Math.round(p.cls * 1000) / 1000, tbt: Math.round(p.tbt), requests, js: kb(bytes.Script), css: kb(bytes.Stylesheet), img: kb(bytes.Image), font: kb(bytes.Font), html: kb(bytes.Document) };
}

const rows = [];
for (const path of paths) {
  const runs = [];
  await run(path).catch(() => null); // warm-up: the first request of a page in `next start` can be slower
  for (let i = 0; i < 3; i++) runs.push(await run(path));
  const pick = (k) => median(runs.map((r) => r[k]));
  rows.push({ path, fcp: pick("fcp"), lcp: pick("lcp"), cls: pick("cls"), tbt: pick("tbt"), requests: pick("requests"), js: pick("js"), css: pick("css"), img: pick("img"), font: pick("font"), html: pick("html") });
}
stop();
if (asJson) { console.log(JSON.stringify({ profile: profileName, rows }, null, 2)); process.exit(0); }
console.log(`profile: ${profileName}   (median of 3 cold loads, cache off; KB = compressed bytes on the wire)`);
console.log("path".padEnd(40) + "FCP ms  LCP ms   CLS   TBT ms  req   JS   CSS  img  font  html");
for (const r of rows) console.log(r.path.padEnd(40) + `${String(r.fcp).padStart(6)}  ${String(r.lcp).padStart(6)}  ${String(r.cls).padStart(5)}  ${String(r.tbt).padStart(6)}  ${String(r.requests).padStart(3)}  ${String(r.js).padStart(4)} ${String(r.css).padStart(4)} ${String(r.img).padStart(4)} ${String(r.font).padStart(4)} ${String(r.html).padStart(5)}`);
console.log("\nGoal of the owner: first screen usable in about 1000 ms. LCP is the number to watch (good: <= 2500 ms on slow4g, <= 1000 ms on desktop/4g).");
