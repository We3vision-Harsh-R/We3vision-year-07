// TRACE SUMMARY (read-only): where the main thread spends its time while a page loads: script, style, layout, paint, garbage collection...
//   node tools/trace-summary.mjs http://localhost:1040 /path [--device=desktop|phone|tablet] [--cpu=4] [--seconds=6]
// It records a Chrome trace (DevTools categories) of a cold load, then adds up the durations of the main-thread events by kind. Events nest
// (a function call is inside a script evaluation), so read the numbers as "how much of the time is spent in this kind of work", not as a sum.
// Use it on a production build (`next start`): the names of scripts are minified but the kinds of work are what matter here.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => (args.find((a) => a.startsWith(`--${n}=`)) ?? `--${n}=${d}`).split("=")[1];
const pos = args.filter((a) => !a.startsWith("--"));
const base = (pos[0] ?? "http://localhost:1040").replace(/\/+$/, "");
const path = pos[1] ?? "/";
const cpu = Number(flag("cpu", 4)), seconds = Number(flag("seconds", 6)), deviceName = flag("device", "desktop");
const DEV = { desktop: [1440, 900, 1, false, ""], phone: [390, 844, 3, true, "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"], tablet: [820, 1180, 2, true, "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"] }[deviceName];
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
const PORT = 9341;
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-tr-"))}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
process.on("exit", () => { try { chrome.kill(); } catch {} });
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) { try { wsUrl = (await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? ""; } catch { await new Promise((r) => setTimeout(r, 500)); } }
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 1; const waiting = new Map(); const listeners = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } else listeners.forEach((l) => l(m)); };
const send = (method, params = {}) => new Promise((res) => { const i = id++; waiting.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: DEV[0], height: DEV[1], deviceScaleFactor: DEV[2], mobile: DEV[3] });
if (DEV[3]) { await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 }); await send("Network.setUserAgentOverride", { userAgent: DEV[4] }); }
const load = async () => { const done = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") r(); }; listeners.push(l); setTimeout(r, 120000); }); await send("Page.navigate", { url: base + path }); await done; };
await load(); // warm
await send("Emulation.setCPUThrottlingRate", { rate: cpu });
const events = [];
listeners.push((m) => { if (m.method === "Tracing.dataCollected") events.push(...m.params.value); });
const complete = new Promise((r) => listeners.push((m) => m.method === "Tracing.tracingComplete" && r()));
await send("Tracing.start", { categories: "devtools.timeline,v8.execute,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.stack", transferMode: "ReportEvents" });
await load();
await new Promise((r) => setTimeout(r, seconds * 1000));
await send("Tracing.end");
await complete;
// the renderer main thread = the thread that has the most event time
const byThread = new Map();
for (const e of events) if (e.ph === "X" && e.dur) { const k = `${e.pid}:${e.tid}`; byThread.set(k, (byThread.get(k) ?? 0) + e.dur); }
const main = [...byThread.entries()].sort((a, b) => b[1] - a[1])[0][0];
const KINDS = { "EvaluateScript": "script run", "v8.compile": "script compile", "FunctionCall": "function calls (inside script)", "FireAnimationFrame": "animation frames (JS)", "TimerFire": "timers (JS)", "ParseHTML": "HTML parse", "UpdateLayoutTree": "style recalculation", "Layout": "layout", "PrePaint": "pre-paint", "Paint": "paint", "Layerize": "layers", "Commit": "commit", "MajorGC": "garbage collection (major)", "MinorGC": "garbage collection (minor)", "HitTest": "hit test" };
const sums = {}, counts = {};
let longTasks = 0, blocking = 0, longest = 0;
for (const e of events) {
  if (e.ph !== "X" || !e.dur || `${e.pid}:${e.tid}` !== main) continue;
  if (e.name === "RunTask" && e.dur > 50000) { longTasks++; blocking += e.dur / 1000 - 50; longest = Math.max(longest, e.dur / 1000); }
  if (KINDS[e.name]) { sums[e.name] = (sums[e.name] ?? 0) + e.dur / 1000; counts[e.name] = (counts[e.name] ?? 0) + 1; }
}
console.log(`${base}${path}  device ${deviceName}  CPU ${cpu}x slower  (cold load + ${seconds}s)`);
console.log(`long tasks (> 50 ms): ${longTasks}, blocking time ${Math.round(blocking)} ms, longest ${Math.round(longest)} ms\n`);
console.log("kind of work".padEnd(36) + "total ms   count");
for (const [k, ms] of Object.entries(sums).sort((a, b) => b[1] - a[1])) console.log(KINDS[k].padEnd(36) + String(Math.round(ms)).padStart(8) + String(counts[k]).padStart(8));
// who makes the browser lay out / restyle again and again? (the script line that invalidated the layout)
const who = new Map();
for (const e of events) {
  if ((e.name === "InvalidateLayout" || e.name === "ScheduleStyleRecalculation") && `${e.pid}:${e.tid}` === main) {
    const fr = e.args?.data?.stackTrace?.[0];
    const key = e.name + "  " + (fr ? `${fr.functionName || "(anonymous)"} ${String(fr.url).split("/").slice(-2).join("/")}:${fr.lineNumber}:${fr.columnNumber}` : "(no script: the browser itself)");
    who.set(key, (who.get(key) ?? 0) + 1);
  }
}
console.log("\nwho invalidates layout / style (count):");
for (const [k, n] of [...who.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(String(n).padStart(6), " ", k);
process.exit(0);
