#!/usr/bin/env node
// Desktop guard: proves the laptop/desktop site is unchanged by the mobile work.
//
//   node tools/desktop-guard.mjs diff [baseRef]   (default base 4e5c7fa)
//     Fails (exit 1) if a protected laptop file changed between baseRef and HEAD
//     (and in the uncommitted working tree).
//
//   node tools/desktop-guard.mjs http <baseUrl>   (e.g. http://localhost:3000)
//     Fetches the laptop paths with a desktop Chrome UA and checks they are the
//     laptop pages (no launcher, no mobile app). Also checks "/" with an iPhone UA
//     returns the launcher. Exit 1 on any failure.
//
// No dependencies (Node 18+ for global fetch).

import { execFileSync } from "node:child_process";

const DEFAULT_BASE = "4e5c7fa";

// Protected laptop paths (brain/13-mobile-app-plan.md rule 1).
const PROTECTED = [
  "src/app/(site)/",
  "src/app/admin/",
  "src/app/globals.css",
  "src/styles/",
  "src/components/",
  "src/lib/",
  "src/actions/",
  "prisma/",
  "next.config.ts",
  "package.json",
];

// Exceptions inside the protected paths (mobile-only code).
function isAllowed(file) {
  if (file.startsWith("src/components/site/mobile/")) return true;
  if (file.startsWith("src/lib/mobile")) return true;
  if (file === "src/lib/device.ts") return true;
  return false;
}

function isProtected(file) {
  if (isAllowed(file)) return false;
  return PROTECTED.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function runDiff(base) {
  let committed;
  try {
    committed = git(["diff", "--name-only", `${base}...HEAD`]);
  } catch (e) {
    console.error(`desktop-guard: git diff failed for base "${base}": ${e.message}`);
    process.exit(2);
  }
  const uncommitted = git(["diff", "--name-only", "HEAD"]);
  const all = [...new Set([...committed, ...uncommitted])];
  const bad = all.filter(isProtected);

  console.log(`desktop-guard diff: base ${base}...HEAD (+ working tree)`);
  console.log(`changed files: ${all.length}, protected laptop files touched: ${bad.length}`);
  if (bad.length) {
    console.log("FAIL - these laptop/desktop files changed:");
    for (const f of bad) console.log(`  - ${f}`);
    process.exit(1);
  }
  console.log("OK - laptop/desktop files are unchanged.");
}

const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

const LAPTOP_PATHS = ["/", "/about", "/seo", "/webdev", "/contact", "/blog", "/careers", "/metaverse"];

async function fetchHtml(url, ua) {
  const res = await fetch(url, { headers: { "user-agent": ua, accept: "text/html" }, redirect: "follow" });
  return { status: res.status, html: await res.text() };
}

function laptopChecks(status, html) {
  const problems = [];
  if (status !== 200) problems.push(`status ${status}`);
  if (html.includes('class="lnc')) problems.push('has class="lnc');
  if (html.includes("ma-root")) problems.push("has ma-root");
  // Mobile route chunks: /_next/static/chunks/app/(m)/m/... or .../app/m/...
  if (/_next\/static\/[^"']*(\(m\)|%28m%29)\/m\//.test(html) || /_next\/static\/chunks\/app\/m\//.test(html))
    problems.push("has /m/ chunk");
  const hasDesktopCss = /globals[^"']*\.css/.test(html) || /\((site)\)|%28site%29/.test(html) || /\/_next\/static\/css\//.test(html);
  if (!hasDesktopCss) problems.push("no globals/(site) css");
  return problems;
}

async function runHttp(baseUrl) {
  if (!baseUrl) {
    console.error("usage: node tools/desktop-guard.mjs http <baseUrl>");
    process.exit(2);
  }
  baseUrl = baseUrl.replace(/\/+$/, "");
  const rows = [];
  let failed = false;

  for (const p of LAPTOP_PATHS) {
    try {
      const { status, html } = await fetchHtml(baseUrl + p, DESKTOP_UA);
      const problems = laptopChecks(status, html);
      if (problems.length) failed = true;
      rows.push({ ua: "desktop", path: p, status, result: problems.length ? "FAIL" : "OK", notes: problems.join("; ") });
    } catch (e) {
      failed = true;
      rows.push({ ua: "desktop", path: p, status: "-", result: "FAIL", notes: e.message });
    }
  }

  // Sanity: a phone on "/" must get the launcher.
  try {
    const { status, html } = await fetchHtml(baseUrl + "/", IPHONE_UA);
    const ok = status === 200 && html.includes('class="lnc');
    if (!ok) failed = true;
    rows.push({ ua: "iphone", path: "/", status, result: ok ? "OK" : "FAIL", notes: ok ? "launcher found" : 'no class="lnc' });
  } catch (e) {
    failed = true;
    rows.push({ ua: "iphone", path: "/", status: "-", result: "FAIL", notes: e.message });
  }

  console.log(`desktop-guard http: ${baseUrl}`);
  console.table(rows);
  if (failed) {
    console.log("FAIL - see table above.");
    process.exit(1);
  }
  console.log("OK - laptop pages serve the desktop site; phone gets the launcher.");
}

const [mode, arg] = process.argv.slice(2);
if (mode === "diff") runDiff(arg || DEFAULT_BASE);
else if (mode === "http") await runHttp(arg);
else {
  console.log("usage:\n  node tools/desktop-guard.mjs diff [baseRef]\n  node tools/desktop-guard.mjs http <baseUrl>");
  process.exit(2);
}
