// Headless Chrome screenshots (works while the Browser pane is hidden).
// MSYS_NO_PATHCONV=1 node tools/shot.mjs <baseUrl> <path> <WxH,WxH> <outPrefix> "<js run before the shot; may return a value>"
// Example: node tools/shot.mjs http://localhost:1010 "/about?festtest" 1440x900 out "window.scrollTo(0,99999); return 1"
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base, path, sizesArg, out, pre = ""] = process.argv.slice(2);
const chromePath = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);
const profile = mkdtempSync(join(tmpdir(), "w3v-shot-"));
const chrome = spawn(chromePath, ["--headless=new", "--remote-debugging-port=9336", "--window-size=1440,900", `--user-data-dir=${profile}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
let wsUrl = "";
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    wsUrl = (await fetch("http://127.0.0.1:9336/json/list").then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? "";
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
await send("Page.enable");
await send("Runtime.enable");
await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('we3.theme.seen','1')}catch(e){}" });
for (const size of sizesArg.split(",")) {
  const [w, h] = size.split("x").map(Number);
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  const loaded = new Promise((r) => { ls.push((m) => m.method === "Page.loadEventFired" && r()); setTimeout(r, 90000); });
  await send("Page.navigate", { url: base + path });
  await loaded;
  await sleep(4500);
  if (pre) {
    const r = await send("Runtime.evaluate", { expression: `(async () => { ${pre} })()`, awaitPromise: true, returnByValue: true });
    if (r.result?.result?.value !== undefined) console.log(size, JSON.stringify(r.result.result.value));
    if (r.result?.exceptionDetails) console.log("script error", JSON.stringify(r.result.exceptionDetails).slice(0, 200));
  }
  await sleep(900);
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 85 });
  writeFileSync(`${out}-${size}.jpg`, Buffer.from(shot.result.data, "base64"));
  console.log("saved", `${out}-${size}.jpg`);
}
ws.close();
chrome.kill();
process.exit(0);
