// POINTER RUN (read-only): how smooth the page stays while a mouse moves over it.
//   node tools/pointer-run.mjs http://localhost:1010 [/path ...] [--cpu=1] [--seconds=4] [--returning] [--idle] [--ablate="name=css;name2=css"] [--json]
// A headless Chrome (1440x900) loads the page cold, waits 2.5 s, then a synthetic mouse draws wide zig-zags over the page at 125 events per second
// for `seconds` seconds. Measured with requestAnimationFrame and the Event Timing API (the numbers behind "Interaction to Next Paint"):
// --idle keeps the mouse still (the same measurement without pointer events): the difference to the normal run is what the POINTER costs.
//   busy%        how much of one CPU core the page's main thread used while the mouse moved (script / layout / style = its parts): the steadiest number
//   fps          frames per second while the mouse moves
//   p95 / worst  95th percentile and worst frame time (ms)
//   >50 ms       frames that took more than 50 ms (a visible hitch)
//   input worst  the slowest pointer event, from the moment it happened until the browser could draw (ms); 'input p98' = 98th percentile
//   handlers     how many pointermove/mousemove/scroll listeners the page registered (they are counted by wrapping addEventListener before the page starts)
// The browser draws with the CPU (no graphics card), so use the numbers to COMPARE two builds on this PC, not as the fps of a real computer.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) ?? `--${n}=${d}`).split("=")[1];
const pos = args.filter((a) => !a.startsWith("--"));
const base = (pos[0] ?? "http://localhost:1010").replace(/\/+$/, "");
const paths = pos.slice(1).length ? pos.slice(1) : ["/", "/about", "/webdev", "/graphics", "/metaverse", "/seo", "/contact"];
const cpu = Number(flag("cpu", 1)), seconds = Number(flag("seconds", 4));
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!chromePath) { console.error("Chrome not found: set CHROME_PATH"); process.exit(2); }
const PORT = 9343;
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-pt-"))}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
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
await send("Performance.enable");
const metrics = async () => Object.fromEntries((await send("Performance.getMetrics")).result.metrics.map((m) => [m.name, m.value]));
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setCPUThrottlingRate", { rate: cpu });
// --returning: the visitor already chose a colour (we3.theme in localStorage), so the first-visit colour picker (a full-screen blurred overlay) is not shown
const RETURNING = args.includes("--returning") ? 'try { localStorage.setItem("we3.theme", JSON.stringify({ h: 0, s: 1, name: "" })); } catch {}' : "";
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `(() => {
    ${RETURNING}
    window.__pt = { frames: [], events: [], handlers: 0 };
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (t, ...r) { if (t === "pointermove" || t === "mousemove" || t === "scroll" || t === "wheel" || t === "touchmove") window.__pt.handlers++; return add.call(this, t, ...r); };
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "pointermove" || e.name === "mousemove") window.__pt.events.push(e.duration); }).observe({ type: "event", durationThreshold: 16, buffered: true }); } catch {}
  })();`,
});

const FRAMES = `(async () => {
  const pt = window.__pt; pt.frames = []; pt.events = [];
  let last = performance.now(), alive = true;
  const tick = (t) => { pt.frames.push(t - last); last = t; if (alive) requestAnimationFrame(tick); };
  requestAnimationFrame((t) => { last = t; requestAnimationFrame(tick); });
  window.__stop = () => { alive = false; };
  return true;
})()`;
const stats = (a) => { const s = [...a].sort((x, y) => x - y); const q = (p) => (s.length ? s[Math.min(s.length - 1, Math.floor(s.length * p))] : 0); const avg = a.reduce((x, y) => x + y, 0) / (a.length || 1); return { fps: Math.round(1000 / (avg || 1)), p95: Math.round(q(0.95)), worst: Math.round(s[s.length - 1] ?? 0), over50: a.filter((x) => x > 50).length, n: a.length }; };

const ablate = (args.find((a) => a.startsWith("--ablate=")) ?? "--ablate=").slice(9).split(";").map((s) => s.trim()).filter(Boolean).map((s) => { const i = s.indexOf("="); return { name: s.slice(0, i), css: s.slice(i + 1) }; });
const scenarios = [{ name: "", css: "" }, ...ablate.map((a) => ({ name: "hide " + a.name, css: a.css + " { display: none !important; }" }))];
const rows = [];
for (const p of paths) for (const sc of scenarios) {
  const done = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") r(); }; listeners.push(l); setTimeout(r, 120000); });
  await send("Page.navigate", { url: base + p });
  await done;
  await new Promise((r) => setTimeout(r, 2500));
  if (sc.css) { await ev(`(() => { const s = document.createElement("style"); s.textContent = ${JSON.stringify(sc.css)}; document.head.append(s); })()`); await new Promise((r) => setTimeout(r, 400)); }
  await ev(FRAMES);
  const m0 = await metrics();
  // wide zig-zags: 125 events per second, the mouse crosses the page left-right while going down and up
  const t0 = Date.now(); let k = 0;
  while (Date.now() - t0 < seconds * 1000) {
    const t = (Date.now() - t0) / 1000;
    const x = 80 + ((Math.sin(t * 2.2) + 1) / 2) * 1280;
    const y = 80 + ((Math.cos(t * 1.3) + 1) / 2) * 740;
    if (!args.includes("--idle")) await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, buttons: 0 });
    k++;
    await new Promise((r) => setTimeout(r, 8));
  }
  const m1 = await metrics();
  await ev("window.__stop()");
  await new Promise((r) => setTimeout(r, 120));
  const d = JSON.parse(await ev("JSON.stringify(window.__pt)"));
  const f = stats(d.frames.filter((x) => x > 0 && x < 2000));
  const e = stats(d.events);
  const pct = (k) => Math.round(((m1[k] - m0[k]) / ((m1.Timestamp - m0.Timestamp) || 1)) * 100);
  rows.push({ path: p + (sc.name ? "  [" + sc.name + "]" : ""), busy: pct("TaskDuration"), script: pct("ScriptDuration"), layout: pct("LayoutDuration"), style: pct("RecalcStyleDuration"), ...f, inputWorst: Math.round(Math.max(0, ...d.events)), inputP98: Math.round([...d.events].sort((x, y) => x - y)[Math.floor(d.events.length * 0.98)] ?? 0), slowEvents: d.events.length, handlers: d.handlers, moves: k });
}
if (args.includes("--json")) { console.log(JSON.stringify(rows, null, 2)); process.exit(0); }
console.log(`mouse moving over the page, CPU ${cpu}x slower, ${seconds}s per page, headless (software drawing)`);
console.log("path".padEnd(44) + "busy%  script%  layout%  style%   fps   p95   worst   >50ms   handlers");
for (const r of rows) console.log(r.path.padEnd(44) + `${String(r.busy).padStart(4)}  ${String(r.script).padStart(7)}  ${String(r.layout).padStart(7)}  ${String(r.style).padStart(6)}  ${String(r.fps).padStart(4)}  ${String(r.p95).padStart(4)}  ${String(r.worst).padStart(6)}  ${String(r.over50).padStart(6)}   ${String(r.handlers).padStart(8)}`);
process.exit(0);
