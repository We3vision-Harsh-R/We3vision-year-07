# 23 — SEO / GEO / AEO round: audit, changes, scorecard (task 150, 2026-11-13)

Scope: technical SEO, generative-engine (GEO) and answer-engine (AEO) readiness of https://www.we3vision.com. Nothing was redesigned; no company facts were invented
(every fact is from the footer contact cards, the About/Home/Services pages or the menu). No ranking or AI-citation result is promised: these steps only make the site
easier to crawl, understand and quote. Not committed or pushed (see section L).

Method: the live site was crawled on 2026-11-13 (119 sitemap URLs, a desktop and an iPhone user agent), then the changed code was built (`next build --webpack`, own dist
folder), served locally and crawled again (44 URLs: the local database has fewer articles and projects than live, so compare properties, not totals).

## A. Initial audit (live site, before the changes)

| Area | Result |
|---|---|
| Status / indexability | 119 of 119 URLs answer 200; none has noindex; every canonical points to its own www address; every page has exactly one `<h1>`; `<html lang="en">`. |
| Titles / descriptions | All titles and descriptions unique except 3 project pages (the same description). 18 titles over 60 characters, 4 over 70 (`/services` and 3 articles). 5 descriptions over 160 (`/services`, `/custom-wordpress...`, 3 training pages). |
| Structured data present | Home (Organization, WebSite, 7 thin Services), inner pages (BreadcrumbList, WebPage, Service), 44 articles (Article + FAQPage), 12 service pages (FAQPage), projects (CreativeWork), jobs (JobPosting), training (Course). |
| Structured data missing | **`/portfolio`, `/contact`, `/services` had none** (the Home-design pages). The Home had no FAQ and its Service nodes had no url. 12 pages show questions but gave no FAQPage data (headless CMS, software, brand development, end-to-end brand, SEO, meta marketing, physical marketing). 5 technology pages (WordPress, Shopify, WooCommerce, Shopify app, WordPress plugin) have a Questions slot in their design but **no questions at all**. |
| Breadcrumbs | The "Services" crumb pointed to `/#services` (a fragment, twice, with a menu group that is not a page); training pages had a crumb without a link (invalid). |
| robots.txt | One rule for `*` (disallow `/admin`, `/preview`) and the sitemap line. No named search-bot rule, `/m/preview` and `/api/` not listed. |
| sitemap.xml | 119 URLs, valid, but **every `<lastmod>` was the request time** ("modified now" on every address): search engines learn to ignore such dates. |
| llms.txt | Did not exist (404). `/indexnow-key.txt` answers 404 because `INDEXNOW_KEY` is not set. |
| Redirects | http to https 301; trailing slash 308; unknown URL 404 (correct); `/About` 404. **`https://we3vision.com/...` (no www) answered 200 with the whole site**, a second copy of every page (canonicals point to www, which limits the damage). |
| Crawler access | A request with a fake Googlebot or bingbot user agent gets **403 from the hosting firewall** (not from this code). OAI-SearchBot, GPTBot, PerplexityBot, ClaudeBot user agents get 200. Real Googlebot probably passes (the firewall checks the IP), but it was not proven: see K. |
| Images | 584 `<img>` on 119 pages: **0 without alt**, 191 with empty alt (decorative or cards whose link text already names them), 186 without width/height (blog, portfolio, brand galleries; measured CLS is still 0.001). |
| Phone twin (`/m/...`) | Phones get a different page (`/m/<page>`) with the canonical of the laptop page. 102 of 119 pages differ: fewer words (project pages 70 words against 410), different H1 on 9 pages, FAQPage on 6 pages only. Mobile-first indexing reads the phone version. The owner's plan (2026-11-13) is to drop `/m`; this resolves itself then. |
| Performance (live, this PC, cold, median of 3) | Desktop `/` FCP/LCP 956 ms, CLS 0.001, 203 KB JS, 129 KB CSS, 30 KB HTML. `/portfolio` 192 ms, `/contact` 1060 ms, `/services` 576 ms, all CLS 0.001. Phone profile 4g: `/` LCP 868 ms, `/about` 776 ms. Lighthouse itself could not be run (the DevTools browser was locked by another session). |

## B. Files created and modified

Created: `src/lib/seo/schema.ts` (company entity and shared nodes), `src/lib/seo/home-faq.ts`, `src/components/site/json-ld.tsx`, `src/components/site/home/home-faq.tsx`,
`src/styles/home-faq.css` (prefix `hfq-`), `src/app/llms.txt/route.ts`, `src/app/manifest.ts`, `brain/23-seo-geo-aeo-report.md`.

Modified (SEO): `src/app/robots.ts`, `src/app/sitemap.ts`, `next.config.ts`, `.env.example`, `src/app/(site)/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `portfolio/page.tsx`,
`portfolio/[slug]/page.tsx`, `services/page.tsx`, `sitemap/page.tsx`, `blog/[slug]/page.tsx`, `careers/[slug]/page.tsx`, `src/components/site/page-jsonld.tsx`, `blog-post.tsx`,
`home/home-more.tsx` (one import + one line), `tech/index.tsx`, `marketing/kit.tsx`, `modern/ai-page-client.tsx`, `training/training-page.tsx`,
`mobile/pages/{detail,render,sitemap}.tsx`, `src/lib/cms/page-route.tsx`, `src/lib/cms/content/tech.ts` (FAQ of 5 pages + 1 description), `src/lib/industrial-training.ts` (3 descriptions),
`brain/10-seo-indexing.md`, `brain/08`, `brain/09`.

Not part of this task (another chat's uncommitted work in the same folder): `home-glide.tsx`, `home-main.tsx`, `modern/ai-page.tsx`, `styles/home.css`, `styles/ai-phone.css`.

## C. Technical SEO done
- **robots.txt**: `*` and a named group (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot) both allow `/`; both disallow `/admin`, `/preview`, `/m/preview`, `/api/`
  (a named group replaces `*` for that crawler, so the private paths are repeated). **Training crawlers (GPTBot, Google-Extended, ClaudeBot, CCBot) are not named: their permission is
  exactly what it was.** Sitemap line kept.
- **sitemap.xml**: `lastmod` only when true (day published in the admin, article date, job date). No `/m`, `/admin`, `/preview`, no noindex page. Still hourly.
- **llms.txt** (`/llms.txt`): built from the menu, the page descriptions, the 20 newest articles and the footer contact cards, refreshed hourly. A guide only; nothing guarantees AI use.
- **manifest** (`/manifest.webmanifest`): name, icons, `en-IN`, dark background colour; opens in the browser.
- **Metadata**: `og:locale` = `en_IN` on every page type (laptop and phone). Titles and descriptions shortened where the code owns them: `/services` (76 to 64 characters, 162 to 154), the
  WordPress page (168 to 163), the three training pages (194, 181, 187 to 169, 158, 166). Three article titles over 70 characters live in the database: edit them in Admin > Blog.
- **Escaping fix**: three pages (`/sitemap`, AI FAQ, training) escaped `<` in their JSON-LD with a no-op; all JSON-LD now goes through `JsonLd` which really escapes it.
- **Bare domain**: `FORCE_WWW=1` (set before the build) adds a 301 from `we3vision.com` to www. Off by default, see K.

## D. GEO (entity clarity)
One company entity, `<site>/#organization` (Organization + ProfessionalService): name, alternate name, logo, one-sentence description, `foundingDate` 2019, Surat head office with the
full postal address, Marburg office, phone and e-mail (read from Admin > Settings), two ContactPoints (India, Germany), `areaServed` India + Worldwide, `knowsAbout` (the ten service
topics), `sameAs` = the two verified profiles (LinkedIn, Instagram). The two offices are only written while the footer cards still show them (`proof` check), so the data cannot drift from
the visible text. Every page graph carries a small copy of the company and the website with the same `@id`. No aggregateRating, reviews, awards or client names.

## E. AEO (answers)
- **Home FAQ** (new, visible, open text, no click needed): 10 questions that follow the asked list (services, AI company in India, AR/VR, metaverse, mobile apps, games, industries, technologies,
  clients outside India, how to contact). Each answer starts with the answer, uses only facts that are already on the site, and ends with an internal link. Same list = FAQPage data of the home page.
- **FAQPage data added** where questions were visible but unmarked: headless CMS, software, brand development, end-to-end brand, SEO/AEO, meta marketing, physical marketing.
- **5 technology pages got real questions** (4 each, written only from each page's own text): WordPress, Shopify, WooCommerce, Shopify apps, WordPress plugins. Their existing Questions tab/help/chat
  design was empty before; now it shows them, and the FAQPage data follows. Note: on those pages the answers sit behind a tab or a click (the text is in the JSON-LD and the HTML).
- Not covered (no or little FAQ content): `/brand-identity`, `/careers` (visible questions, no data), the three product placeholder pages, project pages.

## F. Structured data map (all pages, one connected graph)
`Organization(+ProfessionalService)` `#organization`  <-  `WebSite` `#website`  <-  `WebPage` `<page>#webpage` (type: AboutPage, ContactPage, CollectionPage or WebPage)  ->  `BreadcrumbList`
`<page>#breadcrumb`, `Service` `<page>#service` (provider = company), `FAQPage` `<page>#faq`. Articles: `Article` + `FAQPage` + trail, author and publisher = company by `@id`. Projects: `CreativeWork`
`#project`, creator = company. Lists: `/portfolio` ItemList of projects, `/services` ItemList of the seven services (same `@id` as on the home page and on the service pages). Training: `Course`.
Breadcrumbs now name only real pages (Home > Services > page). Validation done here: every block parses; `@id` unique per page; every `{"@id"}` reference resolves inside its own page;
breadcrumbs have a link on every non-last item; 44/44 laptop pages and 44/44 phone-agent pages, 0 problems. **Not done here: Schema.org Validator and Google Rich Results Test** (external services;
run them on the live URLs after the deploy, see M).

## G. Page metadata
No service-page title had to change: all are unique (no duplicate anywhere) and only `/services` and 3 articles were over 70 characters (section C). Keyword targets stay as they are (no page was re-aimed, so no
cannibalisation was introduced; `/ai`, `/webdev`, `/mobile`, `/metaverse`, `/ui-ux-design` and the technology pages each keep their own topic). The URL typos `devlopment` (3 pages) and the capital `CMS` in
`/headless-CMS-devlopment-services` are old indexed addresses and were kept (changing them needs 301s: owner decision).

## H. Crawler accessibility (final build, local)
44/44 pages HTTP 200, canonical = own address, one H1, no noindex, JSON-LD on every page. The FAQ answers of the home page and of the new technology FAQs are in the server HTML (no JavaScript needed).
Phone user agent: same checks pass (0 JSON-LD problems); content parity is the open item in K.

## I. robots.txt and sitemap validation
`robots.txt`: two groups, `Allow: /`, private paths disallowed, sitemap line, checked from the build output. `sitemap.xml`: well-formed `urlset`, 0 duplicate `<loc>`, no `/m`, `/admin`, `/preview`;
`lastmod` only on dated items. `llms.txt`: 200, `text/plain; charset=utf-8`.

## J. Performance (honest)
This task changes no script and no image, so no speed gain is claimed. Measured with `tools/perf-run.mjs` (cold, median of 3): final local build `/` 164 ms FCP/LCP, CLS 0.001, 205 KB JS, 132 KB CSS, 36 KB HTML;
`/portfolio`, `/contact`, `/services` CLS 0.001. Live before: `/` CLS 0.001, 203 KB JS, 129 KB CSS, 30 KB HTML. The FCP/LCP values are **not comparable** (local server against the real network); the HTML grew about 6 KB
gzip on the home page (the FAQ text, once in the page and once in the structured data). The build also contains the other chat's CSS, so the 3 KB CSS difference is not caused by this task alone (`home-faq.css` is about 2 KB raw).
Lighthouse and a Core Web Vitals field check were not possible here. Speed work needs the `optimize` branch and the owner's approval per phase (brain/15).

## K. Remaining issues (manual or owner decisions)
1. **Firewall 403 for crawler user agents.** Open Search Console > URL inspection > Test live URL for `/`, and Bing Webmaster > URL inspection. If either says "blocked/403", whitelist the crawlers in the Hostinger firewall (hPanel). Highest priority, because it would block everything else.
2. **`INDEXNOW_KEY`** is not set on the live server (`/indexnow-key.txt` 404). Set it (8-64 letters/numbers) to switch the Bing autopilot on. `GOOGLE_SERVICE_ACCOUNT_JSON` + `GSC_SITE_URL` are optional (brain/10).
3. **Bare domain copy** (`https://we3vision.com`): either a Hostinger redirect to www, or `FORCE_WWW=1` before the build (test it first, see `next.config.ts`).
4. **Phone pages (`/m`)**: fewer words, different H1, FAQPage on 6 pages only. Goes away when `/m` is dropped (owner plan); until then Google's mobile index reads the thinner copy.
5. **Case studies**: project pages hold only a title, category, summary and a text (about 410 words on the laptop page). No "client requirement / problem / solution / technologies / outcome" data exists; none was invented. The owner writes it in Admin > Projects (the Content field), then a structured page can follow. Also: three projects ("Carousel 1/2/3") share one description and look like placeholders.
6. **GPTBot, Google-Extended and other training crawlers**: unchanged (allowed by `*`). Decide if that is wanted.
7. **Profiles**: `sameAs` lists only LinkedIn and Instagram (the only ones on the site). Add Facebook, YouTube, X, Clutch etc. in Admin > Settings > Social links if they exist and are official.
8. **Google Business Profile**: the name, address and phone in the structured data equal the footer. Check that the profile shows the same text (it cannot be read from here).
9. **Long titles** of 3 articles (live database): Admin > Blog.
10. **Image sizes**: 186 gallery `<img>` have no width/height (CLS is still 0.001; low priority).
11. Pages still without FAQ: `/brand-identity`, `/careers` (no data), `/products/wejobs|wethink|wepresent`.
12. The home FAQ was checked at 1440x900 only (it wraps by itself on narrow screens, but phone layout was not looked at: the owner's phone plan covers it).
13. Contact form submit, admin screens and the live deployment were not exercised.

## L. Deployment
1. The working folder also holds another chat's unfinished work (list in B). Commit only the files of this task, or let the owner's release flow (`we3-release`) take everything.
2. A version entry (`src/lib/version.ts`, next number after v149) is NOT added yet: nothing is released.
3. `npm run git:pull`, then `npm run git:push -- "v150: SEO, GEO and AEO round"` (brain/21). Hostinger builds on the push. Environment on the server: `NEXT_PUBLIC_SITE_URL=https://www.we3vision.com` (already correct), optional `INDEXNOW_KEY`, optional `FORCE_WWW=1`.
4. After the deploy: open `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/manifest.webmanifest` and view the source of `/`, `/about`, `/contact`, `/webdev`, one article, one project.
5. Run `node tools/seo-audit.mjs https://www.we3vision.com` (read-only).

## M. Search Console and Bing Webmaster checklist
- Search Console: add the Domain property (DNS TXT); Sitemaps > submit `sitemap.xml` (the lastmod change makes a new read useful); URL inspection > Test live URL on `/` and `/webdev` (confirms Googlebot is not blocked); Request indexing for `/`, `/about`, `/services`, `/portfolio`, `/contact`; Pages report: watch "Duplicate, Google chose different canonical" (bare domain) and "Crawled - not indexed"; Enhancements: FAQ, Breadcrumbs, Job postings, Course info: fix any error shown. Google shows FAQ rich results only for a few authoritative sites, so do not expect them for a company site.
- Bing Webmaster Tools: import the site from Search Console; submit the sitemap; URL inspection on `/`; set the IndexNow key (`INDEXNOW_KEY`); AI Performance / Copilot citation report if offered.
- Rich Results Test and Schema.org Validator: paste the live URLs of `/`, `/about`, `/contact`, `/webdev`, one article, one project, one job. Expect "no errors"; warnings about optional fields (opening hours, price range, geo) are fine and are left out on purpose because the site does not state them.
- Google Business Profile: same name, address, phone and website address as the footer.

## N. Scorecard (only what was actually tested)
| Check | Result |
|---|---|
| `tsc --noEmit` | pass (after the last edit too) |
| eslint on every changed folder | pass, 0 messages |
| `next build --webpack` (final code, except 5 description strings changed afterwards) | pass |
| Final-build crawl, laptop agent (44 pages) | 44/44 HTTP 200, canonical self, 1 H1, 0 noindex |
| JSON-LD integrity, laptop and phone agent | 0 problems in 44 + 44 pages (parse, unique `@id`, resolved references, breadcrumb links) |
| FAQPage coverage on pages that show questions | all except the pages listed in K11 |
| robots.txt / sitemap.xml / llms.txt / manifest | served as designed (checked from the build) |
| Home FAQ visual, WooCommerce Questions tab | looked at 1440x900: fine; sticky heading works |
| CLS on `/`, `/portfolio`, `/contact`, `/services` | 0.001 each (local) |
| Schema.org Validator, Rich Results Test, Search Console, Bing, Lighthouse, real Googlebot | **not tested** |
| Phone layout of the new FAQ, forms, admin | **not tested** |
