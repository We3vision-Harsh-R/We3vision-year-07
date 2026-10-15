// SEO AUDIT: finds the pages that Google might NOT index and tells you why.
//   node tools/seo-audit.mjs https://www.we3vision.com      (the live site)
//   node tools/seo-audit.mjs http://localhost:3000          (the dev server)
// It reads /sitemap.xml and checks every page: the HTTP status, noindex (meta tag or header), the canonical address, the title, the description,
// exactly one <h1>, structured data and internal links. A page that fails a rule marked "BLOCKS" will not be indexed; "WARN" only lowers quality.
// It also lists the pages that the site links to but that are missing in the sitemap. The exit code is 1 when a page BLOCKS indexing.

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/+$/, "");
const ua = { "User-Agent": "We3vision-SEO-Audit/1.0" };

const get = async (url) => {
  try {
    const res = await fetch(url, { headers: ua, redirect: "manual" });
    const body = res.status >= 300 && res.status < 400 ? "" : await res.text();
    return { status: res.status, headers: res.headers, body };
  } catch (e) {
    return { status: 0, headers: new Headers(), body: "", error: String(e) };
  }
};

const sm = await get(`${base}/sitemap.xml`);
if (sm.status !== 200) {
  console.error(`Could not read ${base}/sitemap.xml (HTTP ${sm.status}). Is the server running?`);
  process.exit(2);
}
const urls = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const path = (u) => { try { return new URL(u).pathname || "/"; } catch { return u; } };
console.log(`Sitemap: ${urls.length} addresses\n`);

const rows = [];
const linked = new Set();
for (const url of urls) {
  const target = url.startsWith("http") ? url.replace(/^https?:\/\/[^/]+/, base) : url;
  const r = await get(target);
  const issues = [];
  const html = r.body;
  const metaRobots = (html.match(/<meta[^>]+name=["']robots["'][^>]*>/i) ?? [""])[0];
  const xrobots = r.headers.get("x-robots-tag") ?? "";
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ?? [])[1] ?? "";
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) ?? [])[1]?.trim() ?? "";
  const desc = (html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ?? [])[1] ?? "";
  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (r.status !== 200) issues.push(`BLOCKS HTTP ${r.status}`);
  if (/noindex/i.test(metaRobots) || /noindex/i.test(xrobots)) issues.push("BLOCKS noindex");
  if (!canonical) issues.push("WARN no canonical");
  else if (path(canonical) !== path(url)) issues.push(`WARN canonical points to ${path(canonical)}`);
  if (!title || title === "We3vision") issues.push("WARN default or missing title");
  else if (title.length > 70) issues.push(`WARN title ${title.length} chars (over 70)`);
  if (!desc) issues.push("WARN no description");
  else if (desc.length < 70 || desc.length > 170) issues.push(`WARN description ${desc.length} chars (70-170 is best)`);
  if (h1 !== 1) issues.push(`WARN ${h1} h1 tags (one is best)`);
  if (!/application\/ld\+json/.test(html)) issues.push("WARN no structured data");
  for (const m of html.matchAll(/<a[^>]+href=["'](\/[^"'#?]*)["']/gi)) linked.add(m[1].replace(/\/$/, "") || "/");
  rows.push({ url: path(url), status: r.status, issues });
}

let blocks = 0;
for (const r of rows) {
  const bad = r.issues.filter((i) => i.startsWith("BLOCKS"));
  if (bad.length) blocks += 1;
  console.log(`${r.issues.length === 0 ? "OK   " : bad.length ? "FAIL " : "WARN "} ${r.url}${r.issues.length ? "\n        " + r.issues.join("\n        ") : ""}`);
}

const inMap = new Set(urls.map((u) => path(u).replace(/\/$/, "") || "/"));
const skip = /^\/(admin|api|_next|preview|images|brand|media)(\/|$)|\.[a-z0-9]+$/i;
const missing = [...linked].filter((p) => !inMap.has(p) && !skip.test(p));
if (missing.length) console.log(`\nLinked from the pages but NOT in the sitemap (check them):\n  ${missing.sort().join("\n  ")}`);

const robots = await get(`${base}/robots.txt`);
console.log(`\nrobots.txt: HTTP ${robots.status}${/Sitemap:/i.test(robots.body) ? ", lists the sitemap" : ", does NOT list the sitemap"}${/Disallow:\s*\/\s*$/m.test(robots.body) ? ", BLOCKS the whole site!" : ""}`);
console.log(`\n${rows.length} pages checked: ${rows.filter((r) => r.issues.length === 0).length} OK, ${blocks} block indexing, ${rows.filter((r) => r.issues.length && !r.issues.some((i) => i.startsWith("BLOCKS"))).length} with warnings.`);
process.exit(blocks ? 1 : 0);
