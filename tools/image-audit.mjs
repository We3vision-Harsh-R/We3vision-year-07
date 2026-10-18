// IMAGE AUDIT (read-only): which pictures are much bigger than the size they are shown at, on which pages.
//   node tools/image-audit.mjs http://localhost:1021 [/path ...] [--device=desktop|phone|tablet]     (a production server is best; with no /path the sitemap is used)
// For every <img> of every page it records the file, its real size in pixels (natural), the biggest size it is shown at on any page (css pixels),
// and the bytes. "keep" is the width that stays sharp on a 2x screen at the biggest shown size (shown width x 3 for a safety margin).
// A picture whose natural width is more than twice "keep" is listed as oversized, with the bytes that could be saved if it were re-encoded at "keep".
// Background images set in CSS are not covered. Needs Chrome and Node 22+.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const base = (args[0] ?? "http://localhost:1021").replace(/\/+$/, "");
let paths = args.filter((a) => !a.startsWith('--')).slice(1);
if (!paths.length) {
  const sm = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
  paths = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname).concat("/"))];
}
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
const PORT = 9339;
const chrome = spawn(chromePath, ["--headless=new", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", `--user-data-dir=${mkdtempSync(join(tmpdir(), "w3v-img-"))}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
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
const DV = { desktop: [1440, 900, 1, false, ""], phone: [390, 844, 3, true, "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"], tablet: [820, 1180, 2, true, "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"] }[deviceName];
await send("Emulation.setDeviceMetricsOverride", { width: DV[0], height: DV[1], deviceScaleFactor: DV[2], mobile: DV[3] });
if (DV[3]) await send("Network.setUserAgentOverride", { userAgent: DV[4] });
const DPR = DV[2];

const PAGE = `(async () => {
  const nav = document.querySelector('.fn-root'); if (nav) nav.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
  document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; });
  await new Promise((r) => setTimeout(r, 2500));
  const out = [];
  for (const i of document.images) {
    const r = i.getBoundingClientRect();
    out.push({ src: i.currentSrc || i.src, nw: i.naturalWidth, nh: i.naturalHeight, w: r.width, h: r.height });
  }
  return out;
})()`;
const seen = new Map();
for (const p of paths) {
  const loaded = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") r(); }; listeners.push(l); setTimeout(r, 90000); });
  await send("Page.navigate", { url: base + p });
  await loaded;
  const res = await send("Runtime.evaluate", { expression: PAGE, awaitPromise: true, returnByValue: true });
  for (const i of res.result.result.value ?? []) {
    if (!i.src || i.src.startsWith("data:") || !i.nw) continue;
    const key = i.src.replace(/^https?:\/\/[^/]+/, "");
    const e = seen.get(key) ?? { src: key, nw: i.nw, nh: i.nh, w: 0, h: 0, pages: new Set() };
    e.w = Math.max(e.w, i.w); e.h = Math.max(e.h, i.h); e.pages.add(p);
    seen.set(key, e);
  }
}
const rows = [];
for (const e of seen.values()) {
  const url = base + e.src.split("?")[0];
  let bytes = 0;
  try { bytes = Number((await fetch(url, { method: "HEAD", headers: { "Accept-Encoding": "identity" } })).headers.get("content-length") ?? 0); } catch {}
  const shown = Math.max(e.w, 1);
  const keep = Math.ceil(shown * Math.max(DPR, 2) * 1.5); // the pixels a screen of this density can show, plus 50 % of margin
  const over = e.nw / keep;
  const saved = over > 2 ? Math.round(bytes * (1 - (keep / e.nw) ** 2 * 1.3)) : 0; // pixels scale with the square; webp is not perfectly proportional (x1.3)
  rows.push({ ...e, pages: e.pages.size, bytes, keep, over: Math.round(over * 10) / 10, saved });
}
rows.sort((a, b) => b.saved - a.saved || b.bytes - a.bytes);
console.log(`${rows.length} different pictures on ${paths.length} pages\n`);
console.log("file".padEnd(46) + "natural    shown(max)   keep   KB   pages   saving");
for (const r of rows.filter((x) => x.saved > 2000 || x.bytes > 60000)) console.log(r.src.slice(-45).padEnd(46) + `${r.nw}x${r.nh}`.padEnd(11) + `${Math.round(r.w)}x${Math.round(r.h)}`.padEnd(13) + String(r.keep).padEnd(7) + String(Math.round(r.bytes / 1024)).padEnd(5) + String(r.pages).padEnd(8) + (r.saved ? `~${Math.round(r.saved / 1024)} KB` : "ok"));
console.log(`\ntotal that could be saved if every oversized picture were re-encoded at "keep": about ${Math.round(rows.reduce((a, r) => a + r.saved, 0) / 1024)} KB`);
process.exit(0);
