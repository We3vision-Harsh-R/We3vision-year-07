import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

// SEARCH ENGINE AUTOPILOT. Whenever a page, article, project or job goes live, the search engines are told about it:
//  - IndexNow (Bing, Yandex, Seznam, Naver, ...) gets the changed addresses at once. Needs INDEXNOW_KEY.
//  - Google gets the sitemap submitted again through the Search Console API, so it fetches sitemap.xml and finds the new or changed pages.
//    Google has no "index this page now" API for normal pages (the "Request indexing" button of Search Console is manual); the sitemap, internal
//    links and fresh <lastmod> dates are the supported way. Needs GOOGLE_SERVICE_ACCOUNT_JSON and GSC_SITE_URL.
//  - Job pages (they carry JobPosting data) are also sent to Google's Indexing API, which Google allows for JobPosting pages.
// Nothing here ever throws: if a key is missing or a service is down, the website keeps working and the result says what was skipped.
// No secret is written in the code; everything comes from the environment (see .env.example).

export type PingResult = { engine: string; ok: boolean; note: string };

export const siteBase = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
const isLive = (base: string) => /^https:\/\//.test(base) && !/localhost|127\.0\.0\.1|example\.com/.test(base);

type ServiceAccount = { client_email: string; private_key: string };
function account(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const text = raw.trim().startsWith("{") ? raw : readFileSync(raw, "utf8");
    const j = JSON.parse(text) as Partial<ServiceAccount>;
    return j.client_email && j.private_key ? { client_email: j.client_email, private_key: j.private_key } : null;
  } catch {
    return null;
  }
}

const b64 = (v: string | Buffer) => Buffer.from(v).toString("base64url");

async function googleToken(scope: string): Promise<string | null> {
  const acc = account();
  if (!acc) return null;
  const now = Math.floor(Date.now() / 1000);
  const head = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64(JSON.stringify({ iss: acc.client_email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3300 }));
  const sig = createSign("RSA-SHA256").update(`${head}.${body}`).sign(acc.private_key);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${head}.${body}.${b64(sig)}` }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

/** IndexNow: tells Bing, Yandex and the others which addresses changed. */
export async function pingIndexNow(urls: string[]): Promise<PingResult> {
  const key = process.env.INDEXNOW_KEY;
  const base = siteBase();
  if (!key) return { engine: "IndexNow", ok: false, note: "skipped: INDEXNOW_KEY is not set" };
  if (!isLive(base)) return { engine: "IndexNow", ok: false, note: "skipped: NEXT_PUBLIC_SITE_URL is not the live https address" };
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(base).host, key, keyLocation: `${base}/indexnow-key.txt`, urlList: urls.slice(0, 9000) }),
    });
    return { engine: "IndexNow", ok: res.status === 200 || res.status === 202, note: `HTTP ${res.status}` };
  } catch (e) {
    return { engine: "IndexNow", ok: false, note: String(e) };
  }
}

/** Google Search Console: submit the sitemap again (it is allowed as often as needed). */
export async function submitSitemapToGoogle(): Promise<PingResult> {
  const site = process.env.GSC_SITE_URL;
  const base = siteBase();
  if (!account()) return { engine: "Google sitemap", ok: false, note: "skipped: GOOGLE_SERVICE_ACCOUNT_JSON is not set" };
  if (!site) return { engine: "Google sitemap", ok: false, note: "skipped: GSC_SITE_URL is not set" };
  if (!isLive(base)) return { engine: "Google sitemap", ok: false, note: "skipped: NEXT_PUBLIC_SITE_URL is not the live https address" };
  try {
    const token = await googleToken("https://www.googleapis.com/auth/webmasters");
    if (!token) return { engine: "Google sitemap", ok: false, note: "could not get a Google token (check the service account)" };
    const feed = encodeURIComponent(`${base}/sitemap.xml`);
    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${feed}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    return { engine: "Google sitemap", ok: res.ok, note: `HTTP ${res.status}${res.ok ? "" : " (is the service account an owner of the property in Search Console?)"}` };
  } catch (e) {
    return { engine: "Google sitemap", ok: false, note: String(e) };
  }
}

/** Google Indexing API: only for pages that carry JobPosting data (the career pages). */
export async function notifyGoogleJobs(urls: string[]): Promise<PingResult> {
  if (!account()) return { engine: "Google jobs", ok: false, note: "skipped: GOOGLE_SERVICE_ACCOUNT_JSON is not set" };
  if (urls.length === 0) return { engine: "Google jobs", ok: true, note: "no job pages" };
  try {
    const token = await googleToken("https://www.googleapis.com/auth/indexing");
    if (!token) return { engine: "Google jobs", ok: false, note: "could not get a Google token" };
    let ok = 0;
    for (const url of urls.slice(0, 50)) {
      const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      });
      if (res.ok) ok += 1;
    }
    return { engine: "Google jobs", ok: ok === Math.min(urls.length, 50), note: `${ok} of ${Math.min(urls.length, 50)} sent` };
  } catch (e) {
    return { engine: "Google jobs", ok: false, note: String(e) };
  }
}

/** Everything at once, for the paths (like "/blog/my-post") that were just published or changed. */
export async function notifySearchEngines(paths: string[]): Promise<PingResult[]> {
  const base = siteBase();
  const urls = [...new Set(paths.filter(Boolean).map((p) => (p.startsWith("http") ? p : `${base}${p.startsWith("/") ? p : `/${p}`}`)))];
  const jobs = urls.filter((u) => /\/careers\/[^/]+$/.test(u));
  const out = await Promise.all([pingIndexNow(urls.length ? urls : [`${base}/sitemap.xml`]), submitSitemapToGoogle(), notifyGoogleJobs(jobs)]);
  return out;
}
