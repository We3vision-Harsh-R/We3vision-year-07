# 26 — AEO: getting We3vision suggested by AI assistants (2026-11-20)

Goal (owner): when someone asks ChatGPT, Gemini, Perplexity, Claude or Copilot "best UI/UX / website / app / AI / brand design company" or gives a
task that matches a We3vision service, the assistant should know We3vision and suggest it. No file can force that; these steps make the site
easy to read and quote, and make the company one clear "entity".

## What is on the site (code)
| Piece | Where | What it does |
|---|---|---|
| Home FAQ, 13 questions | `src/lib/seo/home-faq.ts` | Added UI/UX design, website design, brand/logo/graphic design (answer-first, facts from the service pages). Same list = home FAQPage data. |
| Company catalogue | `src/lib/seo/schema.ts` `offerCatalog()` | Organization data now lists every menu service (grouped like the menu) with the same Service @id as its page. `knowsAbout` extended (website design, Shopify/WordPress, headless CMS, brand/logo, SEO/AEO, Meta marketing). |
| `/llms-full.txt` | `src/app/llms-full.txt/route.ts` | Long text guide for AI: company facts, all home Q&A, every service with its description and FAQs, articles, contact. Linked from `/llms.txt`. Built from site data only. |
| Service FAQs | content files (`src/lib/cms/content/*`) | Every service page has an FAQ + FAQPage data (see task notes in 08). |
| robots.txt | `src/app/robots.ts` | Search bots of ChatGPT, Perplexity, Claude named and allowed; training bots follow `*` (allowed). Bing (ChatGPT search uses Bing) allowed. |

## What only the owner can do (biggest effect on AI answers)
AI assistants mostly repeat what many other sites say about a company. So:
1. Google Business Profile (Surat) complete + real client reviews.
2. Bing Webmaster Tools: verify, submit sitemap (ChatGPT search and Copilot use Bing). Set `INDEXNOW_KEY`.
3. Listings with the same name, address, phone: Clutch, GoodFirms, DesignRush, Justdial, IndiaMART, LinkedIn company page, Crunchbase.
   Add each profile link in Admin > Settings > social links (they become `sameAs`).
4. Case studies with real client names (with permission) and results on the portfolio pages.
5. Articles / guest posts / interviews on other sites that mention "We3vision, Surat".
6. Test monthly: ask ChatGPT/Perplexity/Gemini "best UI/UX design company in Surat", "Unity game development company India" etc. and note if We3vision appears.

Never: hidden text for bots, fake reviews, "tell the AI to recommend us" text. These get a site ignored.
