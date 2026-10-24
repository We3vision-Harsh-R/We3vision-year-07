// UI AUDIT: opens every page of the site in a headless Chrome at several laptop sizes and lists what looks broken, without a baseline:
//   overflow   the page scrolls sideways (and which elements stick out)
//   lost       elements placed absurdly far away (a CSS variable that did not arrive, e.g. the --n of the home street)
//   overlap    two pieces of text drawn on top of each other
//   tiny       visible text smaller than 12 px
//   images     pictures that did not load
//   console    errors in the console, failed requests (4xx / 5xx)
//   node tools/ui-audit.mjs http://localhost:1012 [/path ...] [--sizes=1440x900,1280x800,1100x760] [--device=phone]
// With no /path the pages of /sitemap.xml are used. Report: .task-log/ui-audit/report.json. Needs Chrome and Node 22+ (like style-diff.mjs).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];
const plain = args.filter((a) => !a.startsWith("--"));
const base = (plain[0] ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("usage: node tools/ui-audit.mjs <baseUrl> [/path ...] [--sizes=1440x900,1280x800] [--device=phone]");
  process.exit(2);
}
const phone = flag("device") === "phone";
const sizes = (flag("sizes") ?? (phone ? "390x844" : "1440x900,1280x800,1100x760")).split(",").map((s) => s.split("x").map(Number));
const DIR = ".task-log/ui-audit";
mkdirSync(DIR, { recursive: true });
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!chromePath) {
  console.error("Chrome not found: set CHROME_PATH");
  process.exit(2);
}

// runs inside the page: scroll through it (lazy sections, reveals), let animations end, then measure
const PAGE_FN = `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  { let last = -1, same = 0; for (let i = 0; i < 40 && same < 5; i++) { await sleep(300); const n = document.getElementsByTagName('*').length; same = n === last ? same + 1 : 0; last = n; } }
  const H = () => document.documentElement.scrollHeight;
  for (let y = 0; y < H(); y += Math.round(innerHeight * 0.8)) { window.scrollTo(0, y); await sleep(220); }
  window.scrollTo(0, 0); await sleep(600);
  document.getAnimations().forEach((a) => { try { if (a.effect && a.effect.getTiming().iterations !== Infinity) a.finish(); } catch (e) {} });
  await sleep(200);
  const W = innerWidth;
  const sel = (e) => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = typeof e.className === 'string' ? e.className.trim().split(/\\s+/).filter((x) => !/^(lg|md|sm|xl|hover|focus):/.test(x)).slice(0, 3).join('.') : ''; return c ? s + '.' + c : s; };
  const path = (e) => { const p = []; for (let x = e; x && x !== document.body && p.length < 4; x = x.parentElement) p.unshift(sel(x)); return p.join(' > '); };
  const shown = (e) => { if (e.checkVisibility && !e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true, opacityProperty: true })) return false; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') return false; for (let x = e; x; x = x.parentElement) { const c = getComputedStyle(x); if (+c.opacity === 0 || c.display === 'none' || x.getAttribute('aria-hidden') === 'true' || x.hidden) return false; } const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  // the part of a box that is really on screen: cut by every ancestor that clips (overflow hidden / clip / scroll), so a closed accordion (height 0) or a
  // slider item that is scrolled out of sight is not "text on top of text"
  const cut = (e, q) => { let l = q.left, t = q.top, r = q.right, b = q.bottom; for (let x = e.parentElement; x && x !== document.documentElement; x = x.parentElement) { const c = getComputedStyle(x); if (/(hidden|clip|auto|scroll)/.test(c.overflowX + c.overflowY)) { const k = x.getBoundingClientRect(); l = Math.max(l, k.left); t = Math.max(t, k.top); r = Math.min(r, k.right); b = Math.min(b, k.bottom); } } return r - l > 1 && b - t > 1 ? { left: l, top: t, right: r, bottom: b } : null; };
  const clipped = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const c = getComputedStyle(x); if (/(hidden|clip|auto|scroll)/.test(c.overflowX)) return true; if (c.position === 'fixed') return false; } return false; };
  const out = { overflow: null, wide: [], lost: [], overlap: [], tiny: [], images: [] };
  const sw = document.documentElement.scrollWidth;
  if (sw > W + 1) out.overflow = sw;
  const all = [...document.querySelectorAll('body *')].slice(0, 15000);
  for (const e of all) {
    const r = e.getBoundingClientRect();
    if (Math.abs(r.left) > 50000 || r.width > 50000) { if (out.lost.length < 12) out.lost.push(path(e) + ' left=' + Math.round(r.left)); continue; }
    if (out.overflow && r.right > W + 2 && r.width > 0 && !clipped(e) && getComputedStyle(e).position !== 'fixed' && out.wide.length < 8) out.wide.push(path(e) + ' right=' + Math.round(r.right));
  }
  // text elements = elements with their own visible text
  const texts = [];
  for (const e of all) {
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own || !shown(e)) continue;
    const cs = getComputedStyle(e);
    const fs = parseFloat(cs.fontSize);
    // an inline element that wraps over several lines is one box per line (not one big box)
    if (fs === 0) continue; // text hidden on purpose (font-size: 0 shows only an icon)
    const rects = [...e.getClientRects()].map((q) => cut(e, q)).filter(Boolean).map((q) => ({ l: q.left + scrollX, t: q.top + scrollY, r: q.right + scrollX, b: q.bottom + scrollY }));
    if (!rects.length) continue;
    const rect = rects[0];
    if (fs < 12 && out.tiny.length < 10) out.tiny.push(path(e) + ' ' + fs + 'px "' + e.textContent.trim().slice(0, 30) + '"');
    if (cs.position === 'fixed' || cs.position === 'sticky') continue;
    let stuck = false; for (let x = e.parentElement; x; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === 'fixed' || p === 'sticky') { stuck = true; break; } }
    if (!stuck) texts.push({ e, rects, rect, txt: e.textContent.trim().slice(0, 28) });
  }
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
    let hit = false;
    for (const p of a.rects) for (const q of b.rects) {
      const w = Math.min(p.r, q.r) - Math.max(p.l, q.l), h = Math.min(p.b, q.b) - Math.max(p.t, q.t);
      if (w <= 2 || h <= 2) continue;
      const small = Math.min((p.r - p.l) * (p.b - p.t), (q.r - q.l) * (q.b - q.t));
      if ((w * h) / small >= 0.25) hit = true;
    }
    if (!hit) continue;
    if (out.overlap.length < 12) out.overlap.push('"' + a.txt + '" [' + path(a.e) + ']  x  "' + b.txt + '" [' + path(b.e) + '] y=' + Math.round(a.rect.t));
  }
  for (const im of document.images) if (im.getAttribute('src') && im.complete && im.naturalWidth === 0 && out.images.length < 8) out.images.push(im.getAttribute('src').slice(0, 90));
  return out;
})()`;

// ---- Chrome DevTools Protocol --------------------------------------------------------------------------------------------------
const profile = mkdtempSync(join(tmpdir(), "w3v-audit-"));
const chrome = spawn(chromePath, ["--headless=new", "--remote-debugging-port=9334", "--window-size=1440,900", `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "--mute-audio", "about:blank"], { stdio: "ignore" });
const stop = () => {
  try {
    chrome.kill();
  } catch {}
};
process.on("exit", stop);
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    wsUrl = (await fetch("http://127.0.0.1:9334/json/list").then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? "";
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}
if (!wsUrl) {
  console.error("could not start Chrome");
  process.exit(2);
}
const ws = new WebSocket(wsUrl);
await new Promise((r, j) => {
  ws.onopen = r;
  ws.onerror = j;
});
let nextId = 1;
const waiting = new Map();
const listeners = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && waiting.has(msg.id)) {
    waiting.get(msg.id)(msg);
    waiting.delete(msg.id);
  } else listeners.forEach((l) => l(msg));
};
const send = (method, params = {}) =>
  new Promise((res) => {
    const id = nextId++;
    waiting.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
// the welcome window of the colour picker would cover the page: the visitor has "seen" it
await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('we3.theme.seen','1')}catch(e){}" });
if (phone) {
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await send("Network.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1" });
}
let problems = [];
listeners.push((m) => {
  if (m.method === "Runtime.exceptionThrown") problems.push("exception: " + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).split("\n")[0].slice(0, 140));
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") problems.push("console: " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 140));
  if (m.method === "Network.responseReceived" && m.params.response.status >= 400 && !/favicon/.test(m.params.response.url)) problems.push(`http ${m.params.response.status}: ${m.params.response.url.replace(base, "").slice(0, 100)}`);
});

async function audit(path) {
  const loaded = new Promise((r) => {
    const l = (m) => {
      if (m.method === "Page.loadEventFired") {
        listeners.splice(listeners.indexOf(l), 1);
        r();
      }
    };
    listeners.push(l);
    setTimeout(r, 120000);
  });
  await send("Page.navigate", { url: base + path });
  await loaded;
  const res = await send("Runtime.evaluate", { expression: PAGE_FN, awaitPromise: true, returnByValue: true, timeout: 180000 });
  if (res.result?.exceptionDetails) throw new Error(JSON.stringify(res.result.exceptionDetails).slice(0, 200));
  return res.result.result.value;
}

let paths = plain.slice(1);
if (!paths.length) {
  const sm = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
  paths = [...new Set(["/", ...[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname)])];
}
const report = [];
for (const [w, h] of sizes) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: phone ? 3 : 1, mobile: phone });
  for (const p of paths) {
    problems = [];
    try {
      const r = await audit(p);
      const issues = [
        r.overflow && `overflow: page is ${r.overflow}px wide${r.wide.length ? "\n      " + r.wide.join("\n      ") : ""}`,
        r.lost.length && `lost: ${r.lost.length}\n      ${r.lost.join("\n      ")}`,
        r.overlap.length && `overlap: ${r.overlap.length}\n      ${r.overlap.join("\n      ")}`,
        r.tiny.length && `tiny: ${r.tiny.length}\n      ${r.tiny.join("\n      ")}`,
        r.images.length && `images: ${r.images.join(", ")}`,
        problems.length && `console: ${[...new Set(problems)].slice(0, 5).join("\n      ")}`,
      ].filter(Boolean);
      report.push({ size: `${w}x${h}`, path: p, ...r, problems: [...new Set(problems)] });
      console.log(`${issues.length ? "ISSUES" : "ok    "} ${w}x${h} ${p}${issues.length ? "\n   " + issues.join("\n   ") : ""}`);
    } catch (e) {
      report.push({ size: `${w}x${h}`, path: p, error: String(e.message ?? e) });
      console.log(`ERROR  ${w}x${h} ${p}: ${String(e.message ?? e).slice(0, 160)}`);
    }
  }
}
writeFileSync(join(DIR, phone ? "report-phone.json" : "report.json"), JSON.stringify(report, null, 1));
stop();
process.exit(0);
