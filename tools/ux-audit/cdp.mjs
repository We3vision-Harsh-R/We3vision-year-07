// Tiny Chrome DevTools Protocol driver for the UX audit: one headless Chrome per worker (own port + profile), no dependencies (Node 22+).
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = process.env.CHROME_PATH ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"].find(existsSync);

export async function launch(port) {
  if (!CHROME) throw new Error("Chrome not found: set CHROME_PATH");
  const profile = mkdtempSync(join(tmpdir(), "w3v-ux-"));
  const proc = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, "--window-size=1440,900", `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "--mute-audio", "about:blank"], { stdio: "ignore" });
  let wsUrl = "";
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      wsUrl = (await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json())).find((t) => t.type === "page")?.webSocketDebuggerUrl ?? "";
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!wsUrl) throw new Error("could not start Chrome on " + port);
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let nextId = 1;
  const waiting = new Map();
  const listeners = new Set();
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
  for (const m of ["Page.enable", "Runtime.enable", "Network.enable"]) await send(m);
  // the three first-visit windows (colour picker welcome, "Welcome" gate, "What should we call you?") would cover the page: the visitor has "seen" them
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('we3.theme.seen','1');sessionStorage.setItem('w3v-welcome','1');localStorage.setItem('w3v-name-skip','1')}catch(e){}" });
  return {
    send,
    on: (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    close: () => {
      try {
        ws.close();
        proc.kill();
      } catch {}
    },
  };
}

export const PHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

/** set the window to a viewport; `phone` also sends the iPhone user agent + touch (so src/proxy.ts serves the /m app pages) */
export async function setViewport(c, { w, h, phone }) {
  await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: phone ? 3 : 1, mobile: !!phone });
  await c.send("Emulation.setTouchEmulationEnabled", { enabled: !!phone, maxTouchPoints: phone ? 5 : 0 });
  await c.send("Network.setUserAgentOverride", { userAgent: phone ? PHONE_UA : "" });
}

/** open `url`, wait for load, run `expression` (async) in the page and return its value + the console / network problems seen while loading */
export async function visit(c, url, expression, { loadTimeout = 90000, evalTimeout = 240000 } = {}) {
  const problems = [];
  const off = c.on((m) => {
    if (m.method === "Runtime.exceptionThrown") problems.push("exception: " + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).split("\n")[0].slice(0, 140));
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") problems.push("console: " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 140));
    if (m.method === "Network.responseReceived" && m.params.response.status >= 400 && !/favicon|\/api\/(chat|alerts)/.test(m.params.response.url)) problems.push(`http ${m.params.response.status}: ${m.params.response.url.slice(0, 110)}`);
  });
  let status = 0;
  const offStatus = c.on((m) => {
    if (m.method === "Network.responseReceived" && m.params.type === "Document" && !status) status = m.params.response.status;
  });
  const loaded = new Promise((res) => {
    const l = (m) => {
      if (m.method === "Page.loadEventFired") {
        offLoad();
        res();
      }
    };
    const offLoad = c.on(l);
    setTimeout(res, loadTimeout);
  });
  await c.send("Page.navigate", { url });
  await loaded;
  const r = await c.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, timeout: evalTimeout });
  off();
  offStatus();
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 200));
  return { data: r.result.result.value, problems: [...new Set(problems)], status };
}
