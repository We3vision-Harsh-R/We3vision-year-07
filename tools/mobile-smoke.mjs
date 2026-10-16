// Mobile app smoke test: opens every mobile page (and "/") as an iPhone and checks it is healthy, then checks every internal link once.
//   node tools/mobile-smoke.mjs <baseUrl>        e.g. node tools/mobile-smoke.mjs http://localhost:3000
// Paths come from src/lib/mobile-ready.generated.ts (MOBILE_PAGES, public paths; src/proxy.ts rewrites a phone to /m<path>).
// A page FAILS when: status != 200, the HTML shows an error text, or the mobile root (m-root) is missing.
// Exit code 1 when anything failed. Node 20+, no dependencies.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const CONCURRENCY = 6;
const TIMEOUT_MS = 30000;
const ERROR_TEXTS = ["Application error", "Internal Server Error", "Unhandled Runtime Error"];
const MOBILE_ROOT = "m-root";

const die = (msg) => {
  console.error(`mobile-smoke: ${msg}`);
  process.exit(1);
};

// ---- input ----
const rawBase = process.argv[2];
if (!rawBase) die("usage: node tools/mobile-smoke.mjs <baseUrl>   (e.g. http://localhost:3000)");
let base;
try {
  base = new URL(rawBase);
  if (!/^https?:$/.test(base.protocol)) throw new Error();
} catch {
  die(`not a valid http(s) URL: ${rawBase}`);
}
const baseStr = base.origin;

function readPaths() {
  const file = path.join(root, "src/lib/mobile-ready.generated.ts");
  let src;
  try {
    src = fs.readFileSync(file, "utf8");
  } catch {
    die(`cannot read ${path.relative(root, file)} (run node tools/sync-mobile-ready.mjs first)`);
  }
  const m = src.match(/MOBILE_PAGES[^=]*=\s*(\[[\s\S]*?\])\s*;/);
  if (!m) die("MOBILE_PAGES array not found in src/lib/mobile-ready.generated.ts");
  let list;
  try {
    list = JSON.parse(m[1]);
  } catch (e) {
    die(`MOBILE_PAGES is not valid JSON: ${e.message}`);
  }
  if (!Array.isArray(list) || list.some((p) => typeof p !== "string")) die("MOBILE_PAGES must be an array of strings");
  return [...new Set(["/", ...list])];
}

// ---- helpers ----
async function fetchPage(p, method = "GET") {
  const t0 = performance.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(baseStr + p, { method, redirect: "follow", headers: { "user-agent": UA }, signal: ctrl.signal });
    const body = method === "GET" ? await res.text() : "";
    return { status: res.status, ms: Math.round(performance.now() - t0), body, finalUrl: res.url };
  } catch (e) {
    const why = e.name === "AbortError" ? `timeout ${TIMEOUT_MS / 1000}s` : e.cause?.code || e.cause?.message || e.message;
    return { status: 0, ms: Math.round(performance.now() - t0), body: "", error: why };
  } finally {
    clearTimeout(timer);
  }
}

async function pool(items, worker) {
  const out = new Array(items.length);
  let i = 0;
  const run = async () => {
    while (i < items.length) {
      const k = i++;
      out[k] = await worker(items[k]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, run));
  return out;
}

function internalLinks(html) {
  const set = new Set();
  for (const m of html.matchAll(/href\s*=\s*["'](\/(?!\/)[^"'#?\s]*)[^"']*["']/gi)) {
    let h = m[1].replace(/&amp;/g, "&");
    if (h.startsWith("/_next/") || h.startsWith("/api/")) continue; // assets and API, not pages
    if (h.length > 1) h = h.replace(/\/+$/, "");
    set.add(h);
  }
  return set;
}

// ---- reachability check first (clear message instead of a page of failures) ----
const paths = readPaths();
const probe = await fetchPage("/", "HEAD");
if (probe.status === 0) die(`cannot reach ${baseStr} (${probe.error}). Is the server running?`);

// ---- pages ----
const pages = await pool(paths, async (p) => {
  const r = await fetchPage(p);
  const problems = [];
  if (r.status === 0) problems.push(`no response (${r.error})`);
  else if (r.status !== 200) problems.push(`status ${r.status}`);
  for (const t of ERROR_TEXTS) if (r.body.includes(t)) problems.push(`"${t}"`);
  if (r.status !== 0 && !r.body.includes(MOBILE_ROOT)) problems.push(`no ${MOBILE_ROOT}`);
  return { path: p, status: r.status, ms: r.ms, kb: (Buffer.byteLength(r.body) / 1024).toFixed(1), problems, links: internalLinks(r.body) };
});

// ---- links (each unique link once; HEAD, GET if HEAD is not allowed) ----
const linkFrom = new Map();
for (const pg of pages) for (const l of pg.links) if (!linkFrom.has(l)) linkFrom.set(l, pg.path);
const linkList = [...linkFrom.keys()].sort();
const linkResults = await pool(linkList, async (l) => {
  let r = await fetchPage(l, "HEAD");
  if (r.status === 405 || r.status === 501 || r.status === 0) r = await fetchPage(l, "GET");
  return { link: l, from: linkFrom.get(l), status: r.status, error: r.error };
});
const broken = linkResults.filter((r) => r.status !== 200);

// ---- report ----
const pad = (s, n) => String(s).padEnd(n);
const w = Math.max(6, ...pages.map((p) => p.path.length)) + 2;
console.log(`\nMobile smoke test: ${baseStr}  (${pages.length} page(s), iPhone Safari UA)\n`);
console.log(pad("path", w) + pad("status", 8) + pad("ms", 8) + pad("KB", 9) + "problems");
console.log("-".repeat(w + 25 + 30));
for (const p of pages)
  console.log(pad(p.path, w) + pad(p.status || "ERR", 8) + pad(p.ms, 8) + pad(p.kb, 9) + (p.problems.length ? p.problems.join(", ") : "ok"));

console.log(`\nInternal links checked: ${linkList.length}, broken: ${broken.length}`);
for (const b of broken) console.log(`  BROKEN ${pad(b.link, w)} ${b.status || "ERR"}${b.error ? ` (${b.error})` : ""}  (first seen on ${b.from})`);

const failedPages = pages.filter((p) => p.problems.length);
console.log(`\nSummary: ${pages.length - failedPages.length}/${pages.length} pages ok, ${broken.length} broken link(s).`);
if (failedPages.length || broken.length) {
  console.log("RESULT: FAIL");
  process.exit(1);
}
console.log("RESULT: PASS");
