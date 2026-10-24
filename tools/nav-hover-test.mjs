// REGRESSION TEST of the floating nav (the pill at the bottom of the laptop site) with a real mouse in a headless Chrome:
// the big menu opens only on the Menu button (hover or click) or on the round button of a scrolled page, never on Home / About / Services.
//   node tools/nav-hover-test.mjs http://localhost:1010 /about?view=desktop      (Windows Git Bash: set MSYS_NO_PATHCONV=1)
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base, path = "/about"] = process.argv.slice(2);
const chromePath = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
const profile = mkdtempSync(join(tmpdir(), "w3v-nav-"));
const chrome = spawn(chromePath, ["--headless=new", "--remote-debugging-port=9335", "--window-size=1440,900", `--user-data-dir=${profile}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    wsUrl = (await fetch("http://127.0.0.1:9335/json/list").then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? "";
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 1;
const wait = new Map();
const ls = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && wait.has(m.id)) {
    wait.get(m.id)(m);
    wait.delete(m.id);
  } else ls.forEach((l) => l(m));
};
const send = (method, params = {}) => new Promise((res) => { const i = id++; wait.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
const move = (x, y) => send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, pointerType: "mouse" });
const click = async (x, y) => { await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 }); await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 }); };

await send("Page.enable");
await send("Runtime.enable");
await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('we3.theme.seen','1')}catch(e){}" });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const loaded = new Promise((r) => { ls.push((m) => m.method === "Page.loadEventFired" && r()); setTimeout(r, 90000); });
await send("Page.navigate", { url: base + path });
await loaded;
await sleep(5000);
const open = () => ev(`document.querySelector('.mm')?.dataset.open === 'true'`);
const center = (sel) => ev(`(() => { const e = [...document.querySelectorAll('.fn-root nav[aria-label=\"Main\"] a, .fn-root nav[aria-label=\"Main\"] button')].find((x) => ${sel}); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; })()`);
const results = [];
const check = (name, ok, got) => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${got === undefined ? "" : "  (" + got + ")"}`); };

const home = await center(`x.textContent.trim() === 'Home'`);
const about = await center(`x.textContent.trim() === 'About'`);
const services = await center(`x.textContent.trim() === 'Services'`);
const menu = await center(`x.textContent.trim() === 'Menu'`);
console.log("positions", JSON.stringify({ home, about, services, menu }));
if (![home, about, services, menu].every((p) => p && p[1] > 700 && p[1] < 900)) { console.log("FAIL: the pill links are not on screen"); process.exit(2); }

await move(10, 10);
await sleep(300);
for (const [name, p] of [["Home", home], ["About", about], ["Services", services]]) {
  await move(p[0] - 3, p[1]);
  await move(p[0], p[1]);
  await move(p[0] + 3, p[1] + 2);
  await sleep(900);
  check(`hover ${name}: menu stays closed`, !(await open()));
}
await move(menu[0], menu[1]);
await sleep(900);
check("hover Menu button: menu opens", await open());
await move(services[0], services[1]);
await sleep(1000);
check("move from Menu to Services: hover-opened menu closes", !(await open()));
await move(menu[0], menu[1]);
await sleep(700);
await move(10, 10);
await sleep(1000);
check("mouse leaves the pill: menu closes", !(await open()));
// click opens and keeps open (sticky), hovering a link does not close it, a second click closes
await move(menu[0], menu[1]);
await sleep(500);
await click(menu[0], menu[1]);
await sleep(400);
await move(home[0], home[1]);
await sleep(900);
check("click Menu then hover Home: menu stays open (sticky)", await open());
await click(menu[0], menu[1]);
await sleep(800);
check("click Menu again: menu closes", !(await open()));
await move(10, 10);
await sleep(600);
// links still work
await move(about[0], about[1]);
await click(about[0], about[1]);
await sleep(2500);
check("click About navigates to /about", (await ev(`location.pathname`)) === "/about", await ev(`location.pathname`));
check("menu closed after navigating", !(await open()));
// scrolled: the round button opens on hover
await move(10, 10);
for (let y = 100; y <= 900; y += 200) { await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: 700, y: 400, deltaX: 0, deltaY: 200 }); await sleep(150); }
for (let i = 0; i < 30 && (await ev(`Math.round(document.querySelector('.fn-root nav').getBoundingClientRect().width)`)) > 56; i++) await sleep(300);
const w = await ev(`Math.round(document.querySelector('.fn-root nav').getBoundingClientRect().width)`);
const round = await ev(`(() => { const r = document.querySelector('.fn-root nav').getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; })()`);
console.log("scrolled: nav width", w);
await move(10, 10);
await sleep(300);
await move(round[0], round[1]);
await sleep(1200);
check("scrolled: hover on the round button opens the menu", await open());
await move(10, 10);
await sleep(1200);
check("scrolled: mouse leaves: menu closes", !(await open()));
ws.close();
chrome.kill();
console.log(results.every(Boolean) ? "ALL PASS" : "SOME FAILED");
process.exit(results.every(Boolean) ? 0 : 1);
