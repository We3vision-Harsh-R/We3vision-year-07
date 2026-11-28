# 27 — GEO / SEO / AEO master plan for We3vision (2026-11-27)

Owner goal: when people search (Google, Google AI Overviews, ChatGPT, Perplexity, Gemini, Copilot, LinkedIn) for our services, for "internship in Surat",
or for a software / IT company in Surat, We3vision is the answer. Honest rule: nobody can promise rank 1 (Google, LinkedIn and the AI products decide, and
big sites compete). What this plan does is remove every reason NOT to be chosen and build the signals they use. Results take 2-12 weeks per step.

Terms: SEO = ranking in the search results. GEO = being quoted by AI answers (AI Overviews, ChatGPT, Perplexity ...). AEO = answer-first text (FAQ,
short direct answers) that both can lift out. All three need the same base: a fast, crawlable site, clear pages, real facts, and the same company
facts repeated on many trusted places (the "entity").

## PART A — done in code (automatic, nothing for the owner to do)
| Already on the site | Where |
|---|---|
| Titles, descriptions, canonical, one H1, sitemap (+lastmod), robots (AI search bots allowed), llms.txt + llms-full.txt | `src/app/*`, brain/23, 26 |
| Company data (Organization/ProfessionalService, offers catalogue, 27 services, FAQPage on every service page, Article on blogs, Course on training, JobPosting on careers) | `lib/seo/schema.ts` |
| Home FAQ (13 answer-first questions) | `lib/seo/home-faq.ts` |
| Game development page + 20 articles | brain/25 |
| This round (2026-11-27): `/internship-in-surat`, `/software-company-in-surat`, FAQ on the 3 training pages, 12 articles (internship + business in Surat), technical audit + 301 for mis-spelt URLs | brain/08 entry of today |

## PART B — what only the owner can do (accounts and real-world proof). Do them in this order, one by one
Tick each box. Use EXACTLY the same company name, address, phone and website everywhere (copy from the Contact page):
`We3vision Private Limited, We3vision House 1/936, Bhim Kachchhi Mohallo, Nanpura, Surat, Gujarat 395001`, website `https://www.we3vision.com`.

### Step 1 — Search Console + Bing (day 1, 30 min) — the base of everything
- [ ] Google Search Console: add `https://www.we3vision.com`, verify (see brain/24), submit `https://www.we3vision.com/sitemap.xml`.
- [ ] Request indexing for the new pages: `/software-company-in-surat`, `/internship-in-surat`, `/game-development`, 3 training pages, home. 10 a day max.
- [ ] Bing Webmaster Tools: import from Search Console (1 click), submit sitemap. ChatGPT search and Copilot use Bing, so this is a main GEO step.
- [ ] Set `INDEXNOW_KEY` in the hosting environment (brain/24) so new pages are pushed to Bing/Yandex automatically.

### Step 2 — Google Business Profile (day 1-2, 1 hour) — the #1 factor for "in Surat" searches
- [ ] Create / claim the profile "We3vision Private Limited", category "Software company" (+ "Internet marketing service", "Training centre" as secondary only if true), address Nanpura Surat, phone, website, hours, 10+ real photos (office, team, work).
- [ ] Add every service in the Services tab and the same short description as the site's About text.
- [ ] Ask 10 real clients / ex-trainees for a Google review (send the profile review link). Never buy or fake reviews (Google removes the profile).
- [ ] Post one update a week (a new article, an internship batch).
- [ ] Do the same for Bing Places (import from Google) and Apple Business Connect.

### Step 3 — LinkedIn (week 1; this is what "LinkedIn search" shows)
LinkedIn ranks company pages by: keywords in the name/tagline/About, completeness, location, followers and activity, and people who list the company as employer.
- [ ] Company page `We3vision Private Limited` (existing: linkedin.com/company/we3visionprivatelimited): tagline with keywords: "Software, AI, web & app development company in Surat | Internship & industrial training"; About = 2 paragraphs from the site's About; industry "IT Services and IT Consulting"; location Surat; website link; logo + cover.
- [ ] Add "Specialities": web development, mobile app development, AI/ML, UI/UX design, Shopify, WordPress, metaverse, game development, internship in Surat, industrial training Surat.
- [ ] Every team member: set employer to the company page, headline "… at We3vision | Surat", location Surat, About with the same keywords (people search finds profiles).
- [ ] Post on the page 3 times a week for 8 weeks: a new article link + 2 lines, a project, a batch photo, an internship opening. Use 3-5 hashtags: #SuratIT #InternshipInSurat #WebDevelopment #AIDevelopment #IndustrialTraining.
- [ ] Post internship openings as LinkedIn Jobs (type Internship, location Surat) - this is the strongest way to appear when students search "internship Surat" on LinkedIn.
- [ ] Ask the team to share and comment on the page posts in the first hour.

### Step 4 — Internship channels (week 1-2) — where students search first
- [ ] Internshala: company profile + post every training/internship (title like "Web Development Internship in Surat").
- [ ] Naukri / Indeed / Glassdoor / AmbitionBox: company profile with the same text (reviews from real ex-trainees).
- [ ] College placement cells and training-placement officers in Surat (SVNIT, local engineering / BCA / MCA colleges): email the `/internship-in-surat` link. Ask colleges to link to it from their website (a good backlink).
- [ ] Be honest in every posting: the training is fee-based, not a paid internship (matches the website; a mismatch hurts trust and ranking).

### Step 5 — Business listings and directories (week 2-3, 2 hours total)
Same name/address/phone each time (NAP). Add the website link and a service list.
- [ ] Clutch, GoodFirms, DesignRush, TopDevelopers, SoftwareWorld (B2B reviews: ask 3 clients each).
- [ ] Justdial, Sulekha, IndiaMART, TradeIndia (local India).
- [ ] Crunchbase, Wellfound, Product Hunt (for our products), GitHub organization, YouTube channel.
- [ ] Facebook page, Instagram, X: bio = one-line company description + link.
- [ ] Local: Surat chamber / local IT association listings if you are a member.
- [ ] Update the website Admin > Settings > Social links with every real profile (they become `sameAs` in the company data = how AI connects the dots).

### Step 6 — Content and mentions (week 3 onward, ongoing)
- [ ] YouTube: 1 short video per article / project (title = the question, link in description).
- [ ] Republish each new article as a summary on LinkedIn Articles, Medium or Hashnode with "Originally published at …" + canonical link to we3vision.com.
- [ ] Answer 2-3 real questions a week on Quora / Reddit / Stack Overflow / LinkedIn groups, mention We3vision only where it truly helps. No spam.
- [ ] Guest posts / interviews: 1 a month on Surat or India tech sites, student portals, startup blogs.
- [ ] Real case studies with client permission (name, problem, result with real numbers) on Portfolio pages; this is the best GEO content and cannot be written by me without your facts.
- [ ] Press: DPIIT / Startup India and MSME recognition on the site already; announce training batches to local newspapers' tech columns.

### Step 7 — Test and improve (every month)
- [ ] Ask ChatGPT, Gemini, Perplexity, Copilot, Google: "best software company in Surat", "internship in Surat for IT students", "web development company in Surat", "industrial training in Surat", "AI development company in India". Note if We3vision appears and which page they quote.
- [ ] Search Console > Performance: filter queries "surat", "internship", "training", "game"; improve pages at position 8-20 first (more FAQs, examples).
- [ ] Add 4 new articles a month (questions from Step 7 that nobody answers well). Ask Claude: "write the next 4 articles of series part6".

## PART C — what to tell Claude later (copy-paste prompts)
- "Add 10 more articles about <topic>" (blog series, honest facts only).
- "Add a page for <new service>" (copy the game / Surat page pattern).
- "Check the GEO status" (audit + report).
- Send real case study facts (client, problem, result) and a case-study page is built.
