// SMOOTHNESS RUN (read-only): how many frames per second a phone/tablet page really gives while it scrolls (or while the launcher is swiped).
//   node tools/smooth-run.mjs http://localhost:1040 [/path ...] [--device=phone|tablet] [--cpu=4] [--json]
// The page is loaded cold, left alone for 2 s, then it is scrolled down in small steps for about 4 s (a real touch swipe on the launcher "/").
// Every frame time is measured with requestAnimationFrame. Reported: average fps, the 95th percentile frame time, and the number of frames that took
// more than 50 ms (a visible hitch) or more than 100 ms. The browser is headless (the pictures are drawn by the CPU, not a phone GPU) and the CPU is slowed
// down, so read the numbers as a comparison between two builds, not as the fps of a real phone.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) ?? `--${n}=${d}`).split("=")[1];
const pos = args.filter((a) => !a.startsWith("--"));
const base = (pos[0] ?? "http://localhost:1040").replace(/\/+$/, "");
const deviceName = flag("device", "phone");
const cpu = Number(flag("cpu", 4));
const paths = pos.slice(1).length ? pos.slice(1) : ["/", "/about", "/blog", "/webdev", "/seo", "/portfolio"];
const DEV = { phone: [390, 844, 3, "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"], tablet: [820, 1180, 2, "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"] }[deviceName];
if (!DEV) { console.error("device must be phone or tablet"); process.exit(2); }
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
const PORT = 9342;
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-sm-"))}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
process.on("exit", () => { try { chrome.kill(); } catch {} });
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) { try { wsUrl = (await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? ""; } catch { await new Promise((r) => setTimeout(r, 500)); } }
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 1; const waiting = new Map(); const listeners = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } else listeners.forEach((l) => l(m)); };
const send = (method, params = {}) => new Promise((res) => { const i = id++; waiting.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.result.value;
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: DEV[0], height: DEV[1], deviceScaleFactor: DEV[2], mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await send("Network.setUserAgentOverride", { userAgent: DEV[3] });
await send("Emulation.setCPUThrottlingRate", { rate: cpu });
const load = async (p) => { const done = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") r(); }; listeners.push(l); setTimeout(r, 120000); }); await send("Page.navigate", { url: base + p }); await done; };

// frame recorder (in the page): returns the list of frame times in ms while `work()` runs for `ms` milliseconds
const RECORD = (ms, step) => `(async () => {
  const times = []; let last = performance.now(); let alive = true;
  const tick = (t) => { times.push(t - last); last = t; if (alive) requestAnimationFrame(tick); };
  requestAnimationFrame((t) => { last = t; requestAnimationFrame(tick); });
  const start = performance.now();
  await new Promise((resolve) => { const run = () => { ${step}; if (performance.now() - start < ${ms}) setTimeout(run, 16); else resolve(); }; run(); });
  alive = false; await new Promise((r) => setTimeout(r, 50));
  return times;
})()`;
const swipe = async () => { // a real finger swipe from right to left across the launcher, several times
  for (let k = 0; k < 3; k++) {
    const y = DEV[1] * 0.5, x0 = DEV[0] * 0.85, x1 = DEV[0] * 0.15;
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y }] });
    for (let i = 1; i <= 12; i++) { await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + ((x1 - x0) * i) / 12, y }] }); await new Promise((r) => setTimeout(r, 16)); }
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await new Promise((r) => setTimeout(r, 900));
    // and back
    await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x1, y }] });
    for (let i = 1; i <= 12; i++) { await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x1 + ((x0 - x1) * i) / 12, y }] }); await new Promise((r) => setTimeout(r, 16)); }
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await new Promise((r) => setTimeout(r, 900));
  }
};
const stats = (t) => {
  const a = t.filter((x) => x > 0 && x < 2000);
  const s = [...a].sort((x, y) => x - y);
  const avg = a.reduce((x, y) => x + y, 0) / a.length;
  return { frames: a.length, fps: Math.round(1000 / avg), p95: Math.round(s[Math.floor(s.length * 0.95)]), over50: a.filter((x) => x > 50).length, over100: a.filter((x) => x > 100).length, worst: Math.round(s[s.length - 1]) };
};
const rows = [];
for (const p of paths) {
  await load(p); await new Promise((r) => setTimeout(r, 2500));
  let times;
  if (p === "/") {
    // launcher: record while the finger swipes between the home screens
    const rec = ev(RECORD(15000, ""));
    await swipe();
    times = await rec;
  } else {
    times = await ev(RECORD(4000, "window.scrollBy(0, 14)"));
  }
  rows.push({ path: p, ...stats(times) });
}
if (args.includes("--json")) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }
console.log(`device ${deviceName}, CPU ${cpu}x slower, headless (software drawing): fps while scrolling (launcher "/": while swiping)`);
console.log("path".padEnd(24) + "fps   p95 ms   >50ms   >100ms   worst ms   frames");
for (const r of rows) console.log(r.path.padEnd(24) + `${String(r.fps).padStart(3)}   ${String(r.p95).padStart(6)}   ${String(r.over50).padStart(5)}   ${String(r.over100).padStart(6)}   ${String(r.worst).padStart(8)}   ${r.frames}`);
process.exit(0);
