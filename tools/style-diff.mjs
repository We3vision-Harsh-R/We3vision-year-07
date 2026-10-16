// STYLE DIFF: proves that a CSS change did not change how pages look. It opens every page in a headless Chrome (1440x900), freezes all
// animations at the first frame, and keeps one hash of the computed styles (about 50 properties + ::before/::after) for every element.
//   node tools/style-diff.mjs record http://localhost:1010 [/path ...]   before the change: pages are loaded 3 times; elements that
//                                                                       differ between the runs (JS-driven) are marked "noise"
//   node tools/style-diff.mjs compare http://localhost:1010 [/path ...]  after the change: lists the elements whose styles changed
//   node tools/style-diff.mjs diff http://localhost:1011 http://localhost:1010 [/path ...]   BEST: two servers (old code, new code) are loaded
//                                                      one after the other in the same Chrome, so nothing has to be recorded in advance
// With no /path the pages of /sitemap.xml are used. Results live in .task-log/style-snap/ (git-ignored). Needs Chrome (CHROME_PATH or the
// default Windows install path) and Node 22+ (global WebSocket). The dev server must be running; first visits of a page compile it (slow).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [mode, baseArg, ...pathsArg] = process.argv.slice(2);
if (!["record", "compare", "inspect", "diff"].includes(mode) || !baseArg) { console.error("usage: node tools/style-diff.mjs record|compare <baseUrl> [/path ...]  |  inspect <baseUrl> /path elementIndex  |  diff <urlBefore> <urlAfter> [/path ...]"); process.exit(2); }
const base = baseArg.replace(/\/+$/, "");
const DIR = ".task-log/style-snap";
mkdirSync(DIR, { recursive: true });
const chromePath = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!chromePath) { console.error("Chrome not found: set CHROME_PATH"); process.exit(2); }

// runs inside the page
const PAGE_FN = `(async () => {
  const P = ["display","position","top","left","width","height","marginTop","marginRight","marginBottom","marginLeft","paddingTop","paddingRight","paddingBottom","paddingLeft","color","backgroundColor","backgroundImage","backgroundSize","backgroundPosition","borderTopWidth","borderTopColor","borderRightWidth","borderBottomWidth","borderLeftWidth","borderTopLeftRadius","borderTopStyle","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","textAlign","textTransform","opacity","transform","filter","backdropFilter","boxShadow","zIndex","overflowX","overflowY","flexDirection","flexWrap","justifyContent","alignItems","gap","gridTemplateColumns","visibility","cursor","animationName","animationDuration","transitionProperty","mixBlendMode","clipPath","maskImage","pointerEvents"];
  const PS = ["content","display","width","height","backgroundColor","backgroundImage","opacity","transform","position","top","left","borderTopWidth","boxShadow"];
  // the big menu is loaded when the visitor shows interest in it: do that, so that old and new pages are compared with the menu in place
  { const nav = document.querySelector('.fn-root'); if (nav) nav.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' })); }
  // wait until the page has stopped growing (hydration and lazy chunks done): 1.5 s without a change, at most 12 s
  { let last = -1, same = 0; for (let i = 0; i < 40 && same < 5; i++) { await new Promise((r) => setTimeout(r, 300)); const n = document.getElementsByTagName('*').length; same = n === last ? same + 1 : 0; last = n; } }
  const imgs = [...document.images]; imgs.forEach((i) => { i.loading = 'eager'; });
  await Promise.all(imgs.map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 5000); })));
  document.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = 0; } catch (e) {} });
  await new Promise((r) => setTimeout(r, 200));
  const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  const out = [];
  for (const el of [...document.querySelectorAll("body *")].slice(0, 12000)) {
    const cs = getComputedStyle(el);
    let s = "";
    for (const p of P) s += cs[p] + "|";
    // the production minifier writes the same value in different ways in different files (0.16 / .16, 0% 0% / 0px 0px): make them equal
    s = s.replace(/(^|[^\\d])0\\.(\\d)/g, "$1.$2").replace(/\\b0% 0%/g, "0px 0px");
    for (const pe of ["::before", "::after"]) { const c = getComputedStyle(el, pe); s += c.content === "none" || c.content === "normal" ? "-" : PS.map((p) => c[p]).join("|"); }
    const cls = typeof el.className === "string" ? el.className.trim().split(/\\s+/).slice(0, 2).join(".") : "";
    out.push(fnv(s) + " " + el.tagName.toLowerCase() + (cls ? "." + cls : ""));
  }
  return out;
})()`;

// ---- minimal Chrome DevTools Protocol client --------------------------------------------------------------------------------
const profile = mkdtempSync(join(tmpdir(), "w3v-chrome-"));
const chrome = spawn(chromePath, ["--headless=new", "--remote-debugging-port=9333", "--window-size=1440,900", "--hide-scrollbars=false", `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "--mute-audio", "about:blank"], { stdio: "ignore" });
const stop = () => { try { chrome.kill(); } catch {} };
process.on("exit", stop);
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) {
  try { wsUrl = (await fetch("http://127.0.0.1:9333/json/list").then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? ""; } catch { await new Promise((r) => setTimeout(r, 500)); }
}
if (!wsUrl) { console.error("could not start Chrome"); process.exit(2); }
const ws = new WebSocket(wsUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let nextId = 1;
const waiting = new Map(), listeners = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); } else listeners.forEach((l) => l(msg));
};
const send = (method, params = {}) => new Promise((res) => { const id = nextId++; waiting.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
await send("Page.enable");
await send("Runtime.enable");
// autoplay timers (tab rotations, typing loops) would show a different state depending on WHEN the page was hydrated: switch them off so that old and new start from the same state
await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.setInterval = function () { return 0; };" });
const problems = [];
listeners.push((m) => {
  if (m.method === "Runtime.exceptionThrown") problems.push((m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).split("\n")[0].slice(0, 160));
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") problems.push(m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 160));
});
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
async function snapshot(path, root = base) {
  const loaded = new Promise((r) => { const l = (m) => { if (m.method === "Page.loadEventFired") { listeners.splice(listeners.indexOf(l), 1); r(); } }; listeners.push(l); setTimeout(r, 120000); });
  const nav = await send("Page.navigate", { url: root + path });
  if (process.env.DEBUG) console.log("navigate", JSON.stringify(nav).slice(0, 200));
  await loaded;
  const res = await send("Runtime.evaluate", { expression: PAGE_FN, awaitPromise: true, returnByValue: true, timeout: 60000 });
  if (res.result?.exceptionDetails) throw new Error(JSON.stringify(res.result.exceptionDetails).slice(0, 300));
  return res.result.result.value;
}

// inspect: prints the element with this index (the numbers that "compare" prints) so that a difference can be understood
if (mode === "inspect") {
  await snapshot(pathsArg[0]);
  const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => { const e = [...document.querySelectorAll("body *")][${Number(pathsArg[1])}]; const cs = getComputedStyle(e); return JSON.stringify({ html: e.outerHTML.slice(0, 260), parent: e.parentElement.outerHTML.slice(0, 160), width: cs.width, height: cs.height, display: cs.display, opacity: cs.opacity, rect: e.getBoundingClientRect().toJSON(), all: Object.fromEntries([...cs].map((p) => [p, cs.getPropertyValue(p)])) }, null, 1); })()` });
  console.log(r.result.result.value);
  stop();
  process.exit(0);
}
if (mode === "diff") {
  const urlB = pathsArg.shift().replace(/\/+$/, "");
  let bad = 0;
  const list = pathsArg.length ? pathsArg : [...new Set([...(await fetch(`${urlB}/sitemap.xml`).then((r) => r.text())).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname).concat("/"))];
  for (const p of list) {
    try {
      const a1 = await snapshot(p, base), a2 = await snapshot(p, base);
      problems.length = 0;
      const b = await snapshot(p, urlB);
      if (problems.length) console.log(`CONSOLE ${p}: ${problems.length} error(s) on the NEW page, e.g. ${problems[0]}`);
      if (a1.length !== a2.length) { console.log(`UNSTABLE ${p}: the OLD page has ${a1.length} then ${a2.length} elements, compared the second run`); }
      if (a2.length !== b.length) {
        bad++;
        const da = a2.map((x) => x.split(" ")[1]), db = b.map((x) => x.split(" ")[1]);
        let k = 0; while (k < da.length && k < db.length && da[k] === db[k]) k++;
        console.log(`DIFF ${p}: element count ${a2.length} -> ${b.length}; first difference at ${k}: old [${da.slice(k, k + 3).join(" ")}] new [${db.slice(k, k + 3).join(" ")}]`);
        continue;
      }
      const noise = new Set(); if (a1.length === a2.length) for (let i = 0; i < a1.length; i++) if (a1[i].split(" ")[0] !== a2[i].split(" ")[0]) noise.add(i);
      const diffs = [];
      for (let i = 0; i < b.length; i++) if (!noise.has(i) && b[i].split(" ")[0] !== a2[i].split(" ")[0]) diffs.push(`${i}:${b[i].split(" ")[1]}`);
      if (diffs.length) bad++;
      console.log(`${diffs.length ? "DIFF" : "same"} ${p}: ${diffs.length} of ${b.length} elements differ (noise ignored: ${noise.size})${diffs.length ? "\n   " + diffs.slice(0, 10).join("\n   ") : ""}`);
    } catch (e) { bad++; console.log(`ERROR ${p}: ${String(e.message ?? e).slice(0, 200)}`); }
  }
  stop();
  process.exit(bad ? 1 : 0);
}

// ---- pages -----------------------------------------------------------------------------------------------------------------------
let paths = pathsArg;
if (!paths.length) {
  const sm = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
  paths = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname).concat("/"))];
}
const file = (p) => join(DIR, (p === "/" ? "home" : p.replace(/^\//, "").replace(/[^\w.-]+/g, "_")) + ".json");
let bad = 0;
for (const p of paths) {
  try {
    if (mode === "record") {
      const runs = [await snapshot(p), await snapshot(p), await snapshot(p)];
      const n = runs[0].length;
      const stable = runs.every((r) => r.length === n);
      const noise = [];
      if (stable) for (let i = 0; i < n; i++) if (new Set(runs.map((r) => r[i].split(" ")[0])).size > 1) noise.push(i);
      writeFileSync(file(p), JSON.stringify({ path: p, base: runs[0], noise, stable, counts: runs.map((r) => r.length) }));
      console.log(`recorded ${p}: ${n} elements, ${stable ? noise.length + " noisy" : "ELEMENT COUNT CHANGES BETWEEN RUNS " + runs.map((r) => r.length)}`);
    } else {
      const rec = JSON.parse(readFileSync(file(p), "utf8"));
      const cur = await snapshot(p);
      if (!rec.stable) { // the page builds a different number of elements each time: compare only what is the same
        console.log(`${p}: baseline was unstable (${rec.counts}), compared ${cur.length} elements loosely`);
      }
      if (cur.length !== rec.base.length) { bad++; console.log(`DIFF ${p}: element count ${rec.base.length} -> ${cur.length}`); continue; }
      const noise = new Set(rec.noise);
      const diffs = [];
      for (let i = 0; i < cur.length; i++) if (!noise.has(i) && cur[i].split(" ")[0] !== rec.base[i].split(" ")[0]) diffs.push(`${i}:${cur[i].split(" ")[1]}`);
      if (diffs.length) bad++;
      console.log(`${diffs.length ? "DIFF" : "same"} ${p}: ${diffs.length} of ${cur.length} elements differ (noise ignored: ${noise.size})${diffs.length ? "\n   " + diffs.slice(0, 10).join("\n   ") : ""}`);
    }
  } catch (e) {
    bad++;
    console.log(`ERROR ${p}: ${String(e.message ?? e).slice(0, 200)}`);
  }
}
stop();
process.exit(mode === "compare" && bad ? 1 : 0);
