// Route audit: lists every route of the app (the file tree of src/app) and checks that every internal link written in the code points to one of them.
// node tools/route-audit.mjs            -> prints the route map + the links that lead nowhere
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const APP = "src/app";
const routes = []; // { path, kind, group }
const files = {}; // path -> special files in its folder
function walk(dir) {
  for (const n of readdirSync(dir)) {
    const f = join(dir, n);
    if (statSync(f).isDirectory()) {
      walk(f);
      continue;
    }
    const rel = relative(APP, dir).split(sep);
    const segs = rel.filter((s) => s && !/^\(.*\)$/.test(s));
    const group = rel.find((s) => /^\(.*\)$/.test(s)) ?? "";
    const path = "/" + segs.join("/");
    if (n === "page.tsx") routes.push({ path, kind: "page", group });
    else if (n === "route.ts") routes.push({ path, kind: "api", group });
    else if (/^(loading|error|not-found|global-error|layout)\.tsx$/.test(n)) (files[path || "/"] ??= []).push(n.replace(".tsx", ""));
  }
}
walk(APP);
const real = routes.filter((r) => r.kind === "page" && !r.path.startsWith("/m/") && r.path !== "/m");
const matchers = real.map((r) => new RegExp("^" + r.path.replace(/\[\.\.\.[^\]]+\]/g, ".+").replace(/\[[^\]]+\]/g, "[^/]+") + "/?$"));
const known = (p) => p === "/" || matchers.some((m) => m.test(p));

// every "/something" written as a link in the code
const SRC = "src";
const hits = new Map();
function scan(dir) {
  for (const n of readdirSync(dir)) {
    const f = join(dir, n);
    if (statSync(f).isDirectory()) {
      if (["generated", "node_modules"].includes(n)) continue;
      scan(f);
      continue;
    }
    if (!/\.(tsx?|json)$/.test(n) || /\.test\./.test(n)) continue;
    const t = readFileSync(f, "utf8");
    for (const m of t.matchAll(/(?:href|Href|link|url)\s*[:=]\s*[{]?\s*["'`](\/[a-zA-Z0-9\-_/]*)(?:[#?"'`])/g)) {
      const p = m[1].replace(/\/$/, "") || "/";
      if (known(p) || p.startsWith("/api") || p.startsWith("/admin") || p.startsWith("/images") || p.startsWith("/media") || p.startsWith("/_next") || p === "/m" || p.startsWith("/m/")) continue;
      (hits.get(p) ?? hits.set(p, new Set()).get(p)).add(relative(".", f).replaceAll(sep, "/"));
    }
  }
}
scan(SRC);

console.log("ROUTES (public site):", real.length);
for (const r of real.sort((a, b) => a.path.localeCompare(b.path))) console.log("  " + r.path);
console.log("\nROUTES by group:", Object.entries(routes.reduce((a, r) => ((a[r.group || "(root)"] = (a[r.group || "(root)"] ?? 0) + 1), a), {})).map(([k, v]) => `${k}=${v}`).join(", "));
console.log("\nBOUNDARY FILES (loading / error / not-found / global-error) per folder:");
for (const [k, v] of Object.entries(files).sort()) console.log("  " + k + " : " + v.join(", "));
console.log("\nLINKS IN THE CODE THAT LEAD TO NO PAGE:", hits.size);
for (const [p, fs] of [...hits].sort()) console.log("  " + p + "   <- " + [...fs].slice(0, 3).join(", "));
