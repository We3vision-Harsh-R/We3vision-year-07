// LAYERS AUDIT (read-only): lists the page layers that cost the most to draw: fixed/sticky boxes, and every element with a filter, backdrop-filter,
// mix-blend-mode, a running animation or will-change, with its size on screen. A big layer with a blur or a blend mode that sits above moving content
// is repainted on every frame (and, with a mouse, on every pointer move).
//   node tools/layers-audit.mjs http://localhost:1010 /path [--device=phone] [--hover=x,y] [--returning]
// Headless Chrome, 1440x900 (phone 390x844 @3x). Sorted by "cost score" = area in screen-heights x (blur 3 + backdrop 3 + blend 3 + infinite animation 2 + will-change 1 + fixed 1).
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const pos = args.filter((a) => !a.startsWith("--"));
const base = (pos[0] ?? "http://localhost:1010").replace(/\/+$/, "");
const path = pos[1] ?? "/";
const phone = args.includes("--device=phone");
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
const PORT = 9344;
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-ly-"))}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
process.on("exit", () => { try { chrome.kill(); } catch {} });
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) { try { wsUrl = (await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? ""; } catch { await new Promise((r) => setTimeout(r, 500)); } }
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 1; const waiting = new Map(); const listeners = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } else listeners.forEach((l) => l(m)); };
const send = (method, params = {}) => new Promise((res) => { const i = id++; waiting.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable");
// --returning: the visitor already chose a colour, so the first-visit colour picker (a full-screen blurred overlay) is not on the page
if (args.includes("--returning")) await send("Page.addScriptToEvaluateOnNewDocument", { source: 'try { localStorage.setItem("we3.theme", JSON.stringify({ h: 0, s: 1, name: "" })); } catch {}' });
await send("Emulation.setDeviceMetricsOverride", phone ? { width: 390, height: 844, deviceScaleFactor: 3, mobile: true } : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
if (phone) await send("Network.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1" });
const done = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") r(); }; listeners.push(l); setTimeout(r, 120000); });
await send("Page.navigate", { url: base + path });
await done;
await new Promise((r) => setTimeout(r, 3500));
// --hover=x,y: move the mouse there first (e.g. onto the floating Menu button, to see the layers of the open big menu)
const hover = args.find((a) => a.startsWith("--hover="));
if (hover) {
  const [hx, hy] = hover.slice(8).split(",").map(Number);
  for (const dx of [-30, -10, 0]) { await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: hx + dx, y: hy, buttons: 0 }); await new Promise((r) => setTimeout(r, 120)); }
  await new Promise((r) => setTimeout(r, 2500));
}
const out = (await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
  const vh = innerHeight, vw = innerWidth, rows = [];
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const blur = cs.filter !== "none" && /blur/.test(cs.filter);
    const bd = cs.backdropFilter !== "none" && cs.backdropFilter !== "";
    const blend = cs.mixBlendMode !== "normal";
    const anim = cs.animationName !== "none" && cs.animationIterationCount === "infinite";
    const wc = cs.willChange !== "auto";
    const fixed = cs.position === "fixed" || cs.position === "sticky";
    if (!(blur || bd || blend || anim || wc || fixed)) continue;
    const w = Math.min(r.right, vw) - Math.max(r.left, 0), h = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    const area = Math.max(0, w) * Math.max(0, h) / (vw * vh);
    const score = area * ((blur ? 3 : 0) + (bd ? 3 : 0) + (blend ? 3 : 0) + (anim ? 2 : 0) + (wc ? 1 : 0) + (fixed ? 1 : 0));
    const cls = typeof el.className === "string" ? el.className.trim().split(/\\s+/).slice(0, 3).join(".") : "";
    rows.push({ sel: el.tagName.toLowerCase() + (cls ? "." + cls : ""), area: Math.round(area * 100), fx: [blur && "blur", bd && "backdrop", blend && "blend:" + cs.mixBlendMode, anim && "anim:" + cs.animationName.slice(0, 18), wc && "will-change", fixed && cs.position].filter(Boolean).join(" "), score: Math.round(score * 100) / 100 });
  }
  return rows.sort((a, b) => b.score - a.score).slice(0, 22);
})()` })).result.result.value;
console.log(`${base}${path}  ${phone ? "phone" : "laptop"} (area = % of the screen that the box covers)`);
console.log("score  area%  layer / effects");
for (const r of out) console.log(String(r.score).padStart(5) + String(r.area).padStart(7) + "  " + r.sel.slice(0, 54).padEnd(54) + " " + r.fx);
process.exit(0);
