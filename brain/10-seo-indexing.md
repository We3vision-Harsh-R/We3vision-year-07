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

## SEO / GEO / AEO round (task 150, 2026-11-13)
Full report with the audit, the scorecard and the owner checklist: [23-seo-geo-aeo-report.md](23-seo-geo-aeo-report.md).

| Piece | Where | What it does |
|---|---|---|
| Company entity | `src/lib/seo/schema.ts` (`organizationNode`) | ONE description of We3vision (Organization + ProfessionalService, `@id` `<site>/#organization`): founded 2019, Surat head office + Marburg office (only while the footer contact cards still show them), phone/e-mail/social links read from Admin > Settings, `knowsAbout`, `areaServed` India + Worldwide. No ratings, reviews or awards. |
| Shared pieces | `src/lib/seo/schema.ts`, `src/components/site/json-ld.tsx` | `websiteNode`, `webPageNode`, `breadcrumbNode`, `serviceNode`, `faqNode`, `articleGraph`; every page graph points at the company and website by `@id`. Use these for any new page, do not write JSON-LD by hand. |
| Inner pages | `components/site/page-jsonld.tsx` | Breadcrumb (Home > Services > page, real pages only), WebPage/AboutPage/ContactPage/CollectionPage, Service (`@id` `<page>#service`). `site` prop = full company entity (About, Contact). |
| Home | `app/(site)/page.tsx` | Organization, WebSite, WebPage, the 7 Services, FAQPage (same list as the visible FAQ). |
| Home FAQ | `lib/seo/home-faq.ts` + `components/site/home/home-faq.tsx` + `styles/home-faq.css` (`hfq-`) | 10 answer-first Q&A, open text (no click), each with an internal link. The list is the single source for the text and the FAQPage data. Contact answer follows Admin > Settings. |
| New JSON-LD | `/portfolio` (ItemList of projects), `/contact` (ContactPage + full entity), `/services` (CollectionPage + ItemList) | These three Home-design pages had none. |
| FAQPage gaps | `tech/index.tsx` (`FAQ_FROM_DATA`), `marketing/kit.tsx` `Faq` | Technology, software, brand and marketing pages showed questions without FAQPage data. Add a slug to `FAQ_FROM_DATA` only when its design shows `d.faq`. |
| Articles / projects | `articleGraph`, `portfolio/[slug]/page.tsx` | Breadcrumb + WebPage + Article/CreativeWork + FAQ, company by `@id`; desktop and phone share the builder. |
| robots.txt | `app/robots.ts` | `*` and a named group (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot) both allow `/` and disallow `/admin`, `/preview`, `/m/preview`, `/api/`. Training crawlers (GPTBot, Google-Extended, ClaudeBot, CCBot) are NOT named: unchanged, owner decides. |
| sitemap.xml | `app/sitemap.ts` | `lastmod` only when true (admin publish day, article date, job date); no more "modified now" on every address. |
| llms.txt | `app/llms.txt/route.ts` | Built from the menu, page descriptions, articles and contact cards (hourly). A guide only, no guarantee. |
| manifest | `app/manifest.ts` | Name, icons, `en-IN`, dark background colour. |
| og:locale | all metadata builders | `en_IN`. `<html lang="en">` unchanged. |
| Bare domain | `next.config.ts`, env `FORCE_WWW=1` | OFF by default (see below). |

Things to know
- `FORCE_WWW=1` (before the build) makes `we3vision.com` answer with a 301 to www. It is off because it relies on the host sending the original Host header; if it did not, www would redirect to itself. Turn it on, test `https://we3vision.com/about` in a private window, remove it if www does not open. Or do the redirect in Hostinger (Domains > redirect).
- A fake "Googlebot" or "bingbot" user agent gets a 403 page from the hosting firewall (not from this code). Real crawlers are probably let in, but check with Search Console "URL inspection > Test live URL" and Bing Webmaster "URL inspection".
- `/indexnow-key.txt` answers 404 until `INDEXNOW_KEY` is set in the environment.
