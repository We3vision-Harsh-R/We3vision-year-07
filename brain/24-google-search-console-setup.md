# 24 — Google Search Console + Bing: set-up guide for www.we3vision.com

For the owner. Do the steps in order; each takes a few minutes. Everything the site can do by itself is already done (sitemap, robots.txt, canonical links,
structured data, llms.txt: see [23](23-seo-geo-aeo-report.md)). What is left needs YOUR Google account and your DNS / hosting login, so only you can click it.
Nobody can promise a rank: this makes the site easy for Google to find, read and trust. Ranking then depends on content, local profile, reviews and links (section 8).

Values you will need
| What | Value |
|---|---|
| Site address (use exactly this) | `https://www.we3vision.com/` |
| Domain (for the Domain property) | `we3vision.com` |
| Sitemap | `https://www.we3vision.com/sitemap.xml` (in a Domain property just type `sitemap.xml`) |
| robots.txt | `https://www.we3vision.com/robots.txt` |
| IndexNow key (Bing and others; public by design, it is served on the site) | `2e44ccf722303d51e1a817d2039a86fb` |

## 1. Create the property and prove you own the site (pick ONE way)
**Way A (best): Domain property with a DNS record.** It covers www, no-www, http and https together and needs no deploy.
1. Open https://search.google.com/search-console and sign in with the Google account that should own the site.
2. Add property > **Domain** > type `we3vision.com` > Continue. Google shows a line `google-site-verification=...`: copy it.
3. Open the place where the DNS of we3vision.com is managed (Hostinger hPanel > Domains > we3vision.com > DNS / Nameservers > DNS records; if the domain is bought elsewhere, its DNS page).
   Add a record: Type **TXT**, Name/Host **@**, Value = the whole line you copied, TTL default. Save.
4. Back in Search Console press **Verify** (DNS can take from 1 minute up to a few hours: try again later if it says "not found yet").

**Way B: URL-prefix property with an HTML tag** (no DNS needed, but a deploy is).
1. Add property > **URL prefix** > `https://www.we3vision.com/` > Continue > open "HTML tag". You see `<meta name="google-site-verification" content="XXXX" />`.
2. Copy ONLY the XXXX part. In the Hostinger environment variables of the site add `GOOGLE_SITE_VERIFICATION` = XXXX. It is read when the site is built, so set it BEFORE the next deploy (push).
3. After the deploy press **Verify**. (The site then writes the tag into every page. Keep it: removing it un-verifies the site.)
Using both A and B is fine. Keep the verification record/tag for ever.

## 2. Submit the sitemap
Search Console > **Sitemaps** > "Add a new sitemap" > `sitemap.xml` > Submit. Status should become **Success** and "Discovered pages" about 119 (it grows with new articles and projects).
The sitemap now carries a `lastmod` date only where it is true (published pages, articles, jobs): that is on purpose.

## 3. Check that Google is NOT blocked (do this before anything else)
A test with a fake Googlebot name got a 403 from the hosting firewall (not from the site code). Real Googlebot is probably let in, but only Google can confirm.
1. Search Console > top search box > paste `https://www.we3vision.com/` > Enter > **Test live URL**. Wait for the result.
2. "URL is available to Google" = good. If it says blocked, "Access denied", "403" or "Server error (5xx)": ask Hostinger support to allow Googlebot and Bingbot in the firewall / bot protection. Message you can paste:
   "Our website we3vision.com returns 403 Forbidden to requests with the user agent of Googlebot and bingbot. Please allow the verified Googlebot and Bingbot crawlers (and OAI-SearchBot) in the firewall / Imunify360 / bot protection for we3vision.com."
3. Later, Settings > **Crawl stats**: the "By response" chart should show almost only 200 (OK). Many 403 = still blocked.

### If the sitemap says "Couldn't fetch" (seen 2026-11-13, right after the first submit)
Checked the same day: the sitemap file is valid (119 URLs, correct dates and host, no duplicates, `application/xml`, 200, also for HEAD / conditional / range / gzip requests, about 0.2-0.6 s),
and it is NOT the site code. Google has already crawled and indexed the NEW home page (a `site:www.we3vision.com` search shows its new title and text), so the real Googlebot reaches the site.
Only a fake "Googlebot" name from a normal PC gets the Hostinger edge 403 (response header `Server: hcdn`, `platform: hostinger`): that is the host's fake-bot protection and is harmless as long as real Googlebot passes.
What to do: (1) wait a few hours and reload the Sitemaps page, a first fetch often shows this for a while; (2) click the row to read the exact reason; (3) if it is still the same after 24 hours, remove the sitemap with the three dots and add `sitemap.xml` again;
(4) while waiting, "Request indexing" (section 4) works without the sitemap; (5) if it never clears, send Hostinger the support message above. Only the home page is in Google so far (plus an old `/items` page of the previous website, which now answers 404 and will drop out).

## 4. Ask Google to index the main pages (Request indexing)
For each URL: paste it in the top search box > wait > if "URL is not on Google" press **Request indexing** (it first runs a live test, then says "Indexing requested").
Google allows about 10 such requests a day, so do them in batches. The order puts the pages that sell first. Everything else is found through the sitemap.

Batch 1 (day 1: the main pages)
```
https://www.we3vision.com/
https://www.we3vision.com/services
https://www.we3vision.com/ai
https://www.we3vision.com/webdev
https://www.we3vision.com/mobile
https://www.we3vision.com/metaverse
https://www.we3vision.com/software-development-services
https://www.we3vision.com/about
https://www.we3vision.com/contact
https://www.we3vision.com/portfolio
```
Batch 2 (day 2)
```
https://www.we3vision.com/ui-ux-design
https://www.we3vision.com/crm
https://www.we3vision.com/animation
https://www.we3vision.com/3d-modeling
https://www.we3vision.com/graphics
https://www.we3vision.com/brand-identity
https://www.we3vision.com/seo
https://www.we3vision.com/products
https://www.we3vision.com/team
https://www.we3vision.com/blog
```
Batch 3 (day 3: technology and brand pages)
```
https://www.we3vision.com/shopify-development-services
https://www.we3vision.com/custom-wordpress-devlopment-services
https://www.we3vision.com/custom-woocommerce-devlopment
https://www.we3vision.com/headless-CMS-devlopment-services
https://www.we3vision.com/shopify-app-development-services
https://www.we3vision.com/wordpress-plugin-development-company
https://www.we3vision.com/shopify-plugin-development-services
https://www.we3vision.com/brand-development-services
https://www.we3vision.com/brand-kit-design
https://www.we3vision.com/zero-to-n-brand-development
```
Batch 4 (day 4)
```
https://www.we3vision.com/brand-video-production
https://www.we3vision.com/meta-marketing-services
https://www.we3vision.com/physical-marketing-services
https://www.we3vision.com/industrial-training/3-month
https://www.we3vision.com/industrial-training/6-month
https://www.we3vision.com/industrial-training/9-month
https://www.we3vision.com/careers
```
Batch 5 (day 5: ten articles that match what clients search)
```
https://www.we3vision.com/blog/local-seo-for-indian-businesses-how-to-rank-in-your-city
https://www.we3vision.com/blog/ai-agents-for-business-what-they-are-and-where-they-save-time
https://www.we3vision.com/blog/how-much-does-a-business-website-cost-what-really-changes-the-price
https://www.we3vision.com/blog/how-to-build-a-custom-ai-chatbot-for-your-website-step-by-step
https://www.we3vision.com/blog/mobile-app-development-process-from-idea-to-app-store
https://www.we3vision.com/blog/next-js-vs-wordpress-which-is-right-for-your-business-website
https://www.we3vision.com/blog/shopify-vs-woocommerce-which-platform-should-you-choose
https://www.we3vision.com/blog/crm-for-small-business-how-to-choose-and-set-it-up
https://www.we3vision.com/blog/ar-and-vr-for-business-real-use-cases-that-work-today
https://www.we3vision.com/blog/core-web-vitals-how-to-make-your-website-fast-and-rank-higher
```
Day 6 and later: the other articles and every new article you publish. The spelling `devlopment` in three addresses is the real, already known address: do not "correct" it in Search Console.

## 5. What to look at in the first weeks
- **Indexing > Pages**: how many are "Indexed" and why the others are not. "Discovered - currently not indexed" and "Crawled - currently not indexed" are normal for a new site: Google knows the page but waits; more links to it and good, unique text help. "Duplicate, Google chose different canonical" for `https://we3vision.com/...` (no www) is the known copy of the site on the bare domain: fix it with the redirect (section 7).
- **Enhancements**: Breadcrumbs, FAQ, Job postings, Course info. Open each: it must say "valid". A warning about optional fields is fine. Google shows FAQ boxes only for a few big sites, so do not wait for them.
- **Experience > Core Web Vitals / HTTPS**: first data appears after some weeks of real visitors.
- **Security & Manual actions**: must say "No issues detected".
- **Performance**: after 2-3 days you see the first searches. Look at the queries and pages; note the ones at position 8-20: they are the quick wins (improve that page).

## 6. Bing and ChatGPT search
1. https://www.bing.com/webmasters > sign in > **Import** your site from Google Search Console (one click, no second verification). Then Sitemaps > add the same sitemap.
2. IndexNow (tells Bing, Yandex and others about every new or changed page by itself): in the Hostinger environment add `INDEXNOW_KEY` = `2e44ccf722303d51e1a817d2039a86fb`, deploy, and check that `https://www.we3vision.com/indexnow-key.txt` shows exactly that key. The site then pings IndexNow after every publish in the admin panel.
3. ChatGPT search uses its own crawler (OAI-SearchBot): it is allowed in robots.txt. There is nothing to submit.

## 7. Optional automation for Google, and the bare-domain redirect
- Auto-submit the sitemap after every publish: Google Cloud > create a service account (free) > enable "Google Search Console API" and "Web Search Indexing API" > download its JSON key > put it in `GOOGLE_SERVICE_ACCOUNT_JSON`
  > in Search Console > Settings > Users and permissions add the service account e-mail as **Owner** > set `GSC_SITE_URL` = `sc-domain:we3vision.com` (Domain property) or `https://www.we3vision.com/` (URL prefix). Details: [10](10-seo-indexing.md).
- `https://we3vision.com` (without www) also opens the whole site. Google is told www is the real one (canonical links), but a 301 is cleaner: Hostinger > Domains > redirect we3vision.com to https://www.we3vision.com, or set `FORCE_WWW=1` before a build and test it (see `next.config.ts`).

## 8. What really moves the rank (honest list)
1. **Google Business Profile** (the biggest lever for "IT company in Surat"): create or claim it at https://business.google.com with EXACTLY the footer data: We3vision Private Limited, We3vision House 1/936, Bhim Kachchhi Mohallo, Nanpura, Surat, Gujarat 395001, phone +91 7383216096, website https://www.we3vision.com/, categories such as "Software company" and "Website designer". Verify it (postcard or video), add real photos and your real services. Ask real clients for real reviews (never buy or write them).
2. **Real links**: your LinkedIn and Instagram pages (already in the site data), and honest listings on directories for IT companies (for example Clutch, GoodFirms, your Startup India / MSME pages) with the same name, address and phone. No bought links.
3. **One page per search**: see the keyword map below. Game development, AR/VR and "custom AI agents" have no page of their own yet (they sit inside `/metaverse`, `/ai` and `/about`). A dedicated page per topic, with your REAL projects, engines (Unity, Unreal) and process, is the next thing to build. Tell me the facts and I write it; I will not invent clients or results.
4. **Case studies**: project pages are thin (title, category, short text). Write the real story of 5 best projects in Admin > Projects: client need, problem, what you built, tools, result. This is what turns a page from "listed" into "ranked".
5. **Keep publishing** one useful article every 1-2 weeks about questions your clients really ask, with the page they should visit linked inside it.
6. Speed and mobile: the site is fast enough in tests; phone pages are being finished by the phone plan.

Keyword map (from the live titles, 2026-11-13)
| Search idea | Page that answers it | Status |
|---|---|---|
| AI development company India | `/ai` ("AI Development Company in India") | ready |
| AI automation services | `/ai` | covered in the text, not in the title |
| Custom AI agent development | article "AI agents for business" and `/ai` | no own page |
| Web development company in Surat / India | `/webdev` ("Web Development Company in Surat, India") | ready |
| Mobile app development company India | `/mobile` ("...Company in Surat") | title says Surat, not India |
| Android app / iOS app development | `/mobile` | no own pages |
| Metaverse development company | `/metaverse` ("Metaverse Development Company in India") | ready |
| AR development / VR development company India | `/metaverse` | title has no AR/VR: a page or title change is needed |
| Game development company India, Unity, Unreal | none (mentioned in `/metaverse`, `/about`) | **gap: new page needed** |
| UI UX design company India | `/ui-ux-design` ("UI/UX Design Services in Surat, India") | ready |
| IT company in Surat | `/about`, home | ready |
| Software development company in Gujarat | `/software-development-services` ("...in Surat, India") | title has no Gujarat |
| Custom CRM development | `/crm` | ready |
Title changes are small and I can make them on your word (they change what Google shows for the page).

## 9. Two-week checklist
- [ ] Property created and verified (Way A or B)
- [ ] Sitemap submitted, status Success
- [ ] "Test live URL" on the home page says available to Google
- [ ] Batches 1-5 requested (10 a day)
- [ ] Bing imported + IndexNow key set
- [ ] Google Business Profile created and verified
- [ ] Pages report checked after 7 and 14 days; Enhancements valid
- [ ] First 5 real case studies written
