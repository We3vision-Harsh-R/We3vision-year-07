// PERFORMANCE AUDIT: a fast, read-only health check for the website's weight and smoothness. It changes nothing.
//   node tools/perf-audit.mjs                     static scan of the source code (no server needed)
//   node tools/perf-audit.mjs --live http://localhost:1010     also fetch every page of /sitemap.xml and measure it
//   node tools/perf-audit.mjs --json              machine-readable output (to compare before / after a task)
// Run it BEFORE and AFTER an optimisation task and put the two numbers in brain/11-optimization.md (the "scoreboard").
// No packages are needed: only Node 20.12+.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const liveIdx = args.indexOf("--live");
const liveBase = liveIdx >= 0 ? (args[liveIdx + 1] ?? "http://localhost:1010").replace(/\/+$/, "") : null;

const walk = (dir, out = []) => {
  let names = [];
  try { names = readdirSync(dir); } catch { return out; }
  for (const n of names) {
    if (n === "node_modules" || n === ".next" || n === ".git" || n === ".claude" || n === "generated") continue;
    const p = join(dir, n);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push({ path: p, rel: relative(root, p).replace(/\\/g, "/"), size: s.size });
  }
  return out;
};
const kb = (n) => `${(n / 1024).toFixed(n > 10240 ? 0 : 1)} KB`;
const count = (text, re) => (text.match(re) ?? []).length;

const result = {};
const src = walk(join(root, "src"));
const pub = walk(join(root, "public"));

// 1) CSS ------------------------------------------------------------------------------------------------------------
const cssFile = src.find((f) => f.rel === "src/app/globals.css");
if (cssFile) {
  const css = readFileSync(cssFile.path, "utf8");
  result.css = {
    file: cssFile.rel,
    bytes: cssFile.size,
    gzipBytes: gzipSync(css).length,
    lines: css.split("\n").length,
    mediaQueries: count(css, /@media/g),
    backdropFilter: count(css, /backdrop-filter\s*:/g),
    filterBlur: count(css, /filter\s*:[^;{}]*blur\(/g),
    willChange: count(css, /will-change\s*:/g),
    infiniteAnimations: count(css, /animation[^;{}]*infinite/g),
    keyframes: count(css, /@keyframes/g),
    gradients: count(css, /gradient\(/g),
  };
}

// 2) Components -----------------------------------------------------------------------------------------------------
const code = src.filter((f) => [".ts", ".tsx"].includes(extname(f.rel)));
let clientFiles = 0, nextImage = 0, rawImg = 0, unoptimized = 0, dyn = 0, rafLoops = 0, resizeListeners = 0;
const heavy = { three: [], p5: [], gsap: [], cobe: [] };
const pagesWithoutRevalidate = [];
for (const f of code) {
  const t = readFileSync(f.path, "utf8");
  if (/^\s*["']use client["']/m.test(t.slice(0, 400))) clientFiles++;
  nextImage += count(t, /from\s+["']next\/image["']/g);
  rawImg += count(t, /<img[\s>]/g);
  unoptimized += count(t, /\bunoptimized\b/g);
  dyn += count(t, /next\/dynamic|React\.lazy|\blazy\(|await import\(|\bimport\(/g);
  rafLoops += count(t, /requestAnimationFrame\(/g);
  resizeListeners += count(t, /addEventListener\(\s*["']resize["']/g);
  if (/(?:from\s+|import\(\s*)["']three(?:["']|\/)/.test(t)) heavy.three.push(f.rel);
  if (/(?:from\s+|import\(\s*)["']p5(?:["']|\.brush)/.test(t)) heavy.p5.push(f.rel);
  if (/(?:from\s+|import\(\s*)["']gsap/.test(t)) heavy.gsap.push(f.rel);
  if (/(?:from\s+|import\(\s*)["']cobe["']/.test(t)) heavy.cobe.push(f.rel);
  if (/\/page\.tsx$/.test(f.rel) && !f.rel.includes("/admin/") && !/export const (revalidate|dynamic)/.test(t)) pagesWithoutRevalidate.push(f.rel);
}
result.code = {
  tsFiles: code.length,
  clientComponents: clientFiles,
  nextImageImports: nextImage,
  rawImgTags: rawImg,
  unoptimizedImages: unoptimized,
  lazyOrDynamicImports: dyn,
  requestAnimationFrameCalls: rafLoops,
  resizeListeners,
  heavyLibraryImporters: Object.fromEntries(Object.entries(heavy).map(([k, v]) => [k, v])),
  publicPagesWithoutRevalidate: pagesWithoutRevalidate,
  biggestSourceFiles: [...src].filter((f) => f.rel !== "src/app/globals.css").sort((a, b) => b.size - a.size).slice(0, 8).map((f) => `${f.rel} (${kb(f.size)})`),
};

// 3) Public files ---------------------------------------------------------------------------------------------------
const imgExt = new Set([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff"]);
result.assets = {
  totalPublicBytes: pub.reduce((a, f) => a + f.size, 0),
  over100KB: pub.filter((f) => f.size > 100 * 1024).sort((a, b) => b.size - a.size).map((f) => `${f.rel} (${kb(f.size)})`),
  notWebp: pub.filter((f) => imgExt.has(extname(f.rel).toLowerCase())).sort((a, b) => b.size - a.size).map((f) => `${f.rel} (${kb(f.size)})`),
  fontFiles: pub.filter((f) => /\.(woff2?|ttf|otf)$/i.test(f.rel)).map((f) => f.rel),
};

// 4) Live pages (optional) -------------------------------------------------------------------------------------------
if (liveBase) {
  const ua = { "User-Agent": "We3vision-Perf-Audit/1.0", "Accept-Encoding": "gzip" };
  const sm = await fetch(`${liveBase}/sitemap.xml`, { headers: ua }).then((r) => r.text()).catch(() => "");
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim().replace(/^https?:\/\/[^/]+/, liveBase));
  const pages = [];
  for (const url of urls) {
    const t0 = performance.now();
    try {
      const res = await fetch(url, { headers: ua, redirect: "manual" });
      const ttfb = performance.now() - t0;
      const html = await res.text();
      pages.push({
        path: new URL(url).pathname,
        status: res.status,
        ttfbMs: Math.round(ttfb),
        htmlKB: Math.round(Buffer.byteLength(html) / 1024),
        htmlGzipKB: Math.round(gzipSync(html).length / 1024),
        scripts: count(html, /<script[\s>]/g),
        imgs: count(html, /<img[\s>]/g),
        cache: res.headers.get("cache-control") ?? "",
      });
    } catch (e) {
      pages.push({ path: new URL(url).pathname, status: 0, error: String(e) });
    }
  }
  result.live = { base: liveBase, pages };
}

// Output ------------------------------------------------------------------------------------------------------------
if (asJson) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}
const line = (k, v) => console.log(`  ${k.padEnd(34)} ${v}`);
console.log("\nCSS");
if (result.css) {
  const c = result.css;
  line("globals.css", `${kb(c.bytes)}  (${kb(c.gzipBytes)} gzip, ${c.lines} lines)`);
  line("@media / @keyframes", `${c.mediaQueries} / ${c.keyframes}`);
  line("backdrop-filter / filter:blur", `${c.backdropFilter} / ${c.filterBlur}   (GPU heavy: keep few on screen)`);
  line("will-change / infinite anims", `${c.willChange} / ${c.infiniteAnimations}`);
}
console.log("\nCode");
const k = result.code;
line("ts/tsx files", k.tsFiles);
line("client components", `${k.clientComponents}  (every one ships JS to the browser)`);
line("next/image imports vs raw <img>", `${k.nextImageImports} vs ${k.rawImgTags}   (unoptimized flags: ${k.unoptimizedImages})`);
line("lazy / dynamic imports", k.lazyOrDynamicImports);
line("requestAnimationFrame calls", `${k.requestAnimationFrameCalls}   (each needs a stop when off screen)`);
line("resize listeners", k.resizeListeners);
for (const [lib, files] of Object.entries(k.heavyLibraryImporters)) line(`imports ${lib}`, files.length ? files.join(", ") : "-");
line("pages without revalidate/dynamic", k.publicPagesWithoutRevalidate.length ? k.publicPagesWithoutRevalidate.join(", ") : "none");
console.log("  biggest source files:");
for (const s of k.biggestSourceFiles) console.log(`    ${s}`);
console.log("\nPublic assets");
line("total", kb(result.assets.totalPublicBytes));
line("files over 100 KB", result.assets.over100KB.length ? "" : "none");
for (const s of result.assets.over100KB) console.log(`    ${s}`);
line("png/jpg that could be webp", result.assets.notWebp.length ? "" : "none");
for (const s of result.assets.notWebp) console.log(`    ${s}`);
line("local font files", result.assets.fontFiles.length ? result.assets.fontFiles.join(", ") : "none (Poppins comes from next/font/google)");
if (result.live) {
  console.log(`\nLive pages (${result.live.base}) — the dev server is slower than production, compare dev with dev only`);
  console.log("  " + "path".padEnd(46) + "status  ttfb   html   gzip   scripts  img");
  for (const p of result.live.pages) {
    console.log("  " + p.path.padEnd(46) + String(p.status).padEnd(8) + `${p.ttfbMs ?? "-"}ms`.padEnd(7) + `${p.htmlKB ?? "-"}KB`.padEnd(7) + `${p.htmlGzipKB ?? "-"}KB`.padEnd(7) + String(p.scripts ?? "-").padEnd(9) + (p.imgs ?? "-"));
  }
}
console.log("");
