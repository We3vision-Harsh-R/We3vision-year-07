# 10 — SEO indexing autopilot (task 78)

Goal: every page of the website is listed in Google (Search Console) and the other search engines, and new or changed pages are found
by themselves. What the code does, what only the owner can do, and how to check.

## What is automatic (in the code)
| Piece | Where | What it does |
|---|---|---|
| XML sitemap | `src/app/sitemap.ts` → `/sitemap.xml` | Every CMS page, `/sitemap`, published projects, articles and open jobs, each with `lastmod`, change frequency and priority. Drafts and hidden items are not listed. Refreshes hourly. |
| robots.txt | `src/app/robots.ts` | Allows everything except `/admin` and `/preview`, and points to the sitemap. |
| Canonical + title + description + Open Graph | `pageMetadata()` in `lib/cms/page-route.tsx` | Every CMS page. Detail pages (blog, portfolio, careers) have their own. |
| Structured data | `components/site/page-jsonld.tsx` | BreadcrumbList + WebPage on every inner page, Service on service pages. Home has Organization/WebSite, FAQ sections have FAQPage, jobs have JobPosting, articles have Article. |
| IndexNow | `lib/seo-ping.ts`, key file `/indexnow-key.txt` | Bing, Yandex, Seznam, Naver are told the moment something is published. Needs `INDEXNOW_KEY`. |
| Google sitemap ping | `lib/seo-ping.ts` | After every publish the sitemap is submitted again through the Search Console API (Google then re-reads it). Needs `GOOGLE_SERVICE_ACCOUNT_JSON` + `GSC_SITE_URL`. |
| Google Indexing API for jobs | `lib/seo-ping.ts` | Only for `/careers/<job>` pages (JobPosting). Google allows this API only for job and live-stream pages. |
| Hooks | `actions/pages.ts` (publish), `actions/blog.ts`, `actions/projects.ts` | Run with `after()` so the admin never waits and a failure never breaks the save. |

## What nobody can automate (the honest part)
Google has **no API to force indexing of normal pages**. The "Request indexing" button of Search Console is manual and limited. What works,
and is set up: a complete sitemap, correct canonicals, internal links (menu, footer, `/sitemap` page, "related" blocks), fresh `lastmod`
dates, fast pages and unique titles/descriptions. Google then indexes by itself, usually within days to a few weeks for a new site.

## One-time checklist for the owner (about 20 minutes)
1. Production `.env`: `NEXT_PUBLIC_SITE_URL=https://www.we3vision.com` (the one address the site is served from; www or not, but only one; the
   other must redirect to it with 301). All canonicals and the sitemap use this value.
2. Google Search Console → add the property (best: "Domain" with the DNS TXT record) → Sitemaps → submit `sitemap.xml`.
3. Optional autopilot for Google: Google Cloud → create a service account (no cost) → enable "Google Search Console API" and "Web Search
   Indexing API" → download its JSON key → put the file path in `GOOGLE_SERVICE_ACCOUNT_JSON` → in Search Console (Settings → Users and
   permissions) add the service account e-mail as **Owner** → set `GSC_SITE_URL` (for example `sc-domain:we3vision.com`).
4. Optional for Bing/Yandex: choose a key of 8–64 letters/numbers → `INDEXNOW_KEY=...`. Check that `https://www.we3vision.com/indexnow-key.txt`
   shows the key. Also add the site in Bing Webmaster Tools (it can import from Search Console).
5. After the first launch run once: `npx tsx tools/seo-submit.ts` (tells everybody about every address).
6. In Search Console use "URL inspection" → "Request indexing" for the 5–10 most important pages (Home, About, Services, Portfolio, Contact).

## How to find pages that are NOT indexed, and why
`node tools/seo-audit.mjs https://www.we3vision.com` reads the sitemap and checks every page: HTTP status, noindex (meta or header),
canonical, title, description, one `<h1>`, structured data, and links that are missing in the sitemap. `BLOCKS` = Google cannot index it.
Then, in Search Console → Pages ("Page indexing"), the reasons are listed per address:
- "Discovered – currently not indexed" / "Crawled – currently not indexed": Google knows the page but does not find it worth indexing yet.
  Fix: more internal links to it, unique and useful text, wait. Re-run `seo-submit`.
- "Duplicate without user-selected canonical" / "Alternate page with proper canonical": two addresses show the same page (http/https, www/non-www,
  trailing slash). Fix: one site address in `NEXT_PUBLIC_SITE_URL` and 301 redirects.
- "Excluded by noindex": a noindex tag. Only `/admin`, `/preview` and missing jobs have it on purpose.
- "Not found (404)" / "Soft 404": a link or sitemap entry that points to nothing. The audit lists them.

## Rules for every new page (so it is indexed from day one)
1. Register it in `lib/cms/pages.ts` (title, path, SEO title ≤ 60–70 characters, description 70–160 characters, unique).
2. One `<h1>`; real text (not only images/canvas); at least one link TO it (menu, `lib/site-menu.ts`, related blocks, `/sitemap`).
3. Add it to `lib/site-menu.ts` if it is a service/product page, so it is in the menu and in the HTML sitemap.
4. Run `node tools/seo-audit.mjs http://localhost:1010` before the release.
