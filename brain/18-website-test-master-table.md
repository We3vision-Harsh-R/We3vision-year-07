# 18 — Website test report + MASTER TABLE (2026-10-19)

> Aa file copy-paste kari ne biji chat ma api shakay: aa ek j file ma badhu che (bug list, page-wise status, design plan, visitor clarity, fix order, prompt).
> Rule: kai fix karvu hoy to pehla `brain/00-START-HERE.md` + `brain/02-rules-and-preferences.md` vanchvu. Home `/` LOCKED che; locked sections ma pehla owner ne puchvu.

## Status (2026-10-19, task 96)
**Phase 1 DONE ane push thayu:** B-01 (shield regex `wordpress(?:/|$)` → page 200, probes `/wordpress`, `/wordpress/wp-login.php` haji 404), B-09 (`/webdev` ma 1 H1, 6 fake anchor → span; mockup heading `.ws-h1`), B-18 (aria-labels: 6 plugin switches, 3 WP inputs, coupon input), B-04 (branded 404 `global-not-found` + `(site)/not-found.tsx` + `(site)/error.tsx`, prefix `nf-`, `experimental.globalNotFound` on), B-30 (production build warns if `NEXT_PUBLIC_SITE_URL` missing). Verify: tsc, eslint, `npm run build` OK; prod server: wordpress page 200, unknown URL 404 (branded, noindex), /webdev 1 H1.
**Phase 2 DONE (task 97):** B-02 (share picture `public/brand/og-image.png` made by `tools/make-og.mjs` from the real logo files; added to every `pageMetadata` page, About, Sitemap, career jobs; blog/project fallback; **Home done in task 98 (metadata only, owner said yes)**), B-08 (25 titles/descriptions shortened: titles ≤ 60, descriptions ≤ 160; blog/project titles drop the brand suffix when > 60), B-22 (About = `AboutPage` + breadcrumb, Sitemap = `CollectionPage` + breadcrumb). **B-19 closed, no change needed:** list images sit in fixed-size frames (aspect-[4/3], masonry cells, arch frames), so there is no layout shift; detail covers already have alt text. `seo-audit` on the production build: 107 OK, 0 BLOCKS, 0 WARN after the plugin description fix (was 69 OK, 1 BLOCKS, 38 WARN). Note: titles/descriptions saved in Admin > Pages override these defaults — if a page was published in the admin, edit it there too.
**Phase 3 part 1 DONE (task 99):** B-06 + B-11 for the 23 pages that use the standard page hero (balanced heading, short-laptop fit; 9 pages verified at 1280x720, no CTA under the pill). Careers chips and the own-design heroes (Shopify, Physical Marketing, Brand, SEO, Graphics) not changed. **Part 2 DONE (task 100, owner allowed Home):** B-07 (focus ring + skip link), B-07b (text cursor over fields), B-17 (visible labels on the contact flow).
**Phase 4 part 1 DONE (task 101):** B-16 (all 30), B-13 (content labels, not mockups/locked/Home), B-15 (near-black tints; not characters/mockups/locked). **Phase 4 part 2 DONE (task 102, owner unlocked Home/locked):** B-05 (detail pages only), B-14 (Poppins 800), B-13 for all areas. Baki: B-03, B-07, B-10..B-17, B-20..B-29 (Phase 3+). WordPress demo ma 2 `<a>` (theme name, "clear") rahya (CSS `.wpa-foot a`), nano issue.

## 0. Kem test karyu ane shu test NATHI karyu (imandari thi)

**Test karyu (laptop site, dev server `localhost:1010`, main folder):**
- 41 page route: HTTP status, title/description/H1/canonical/og/JSON-LD, images alt + size, buttons/inputs names, font family, font size < 14px, horizontal scroll, broken images (automatic script, 1440×900 iframe).
- 63 detail page (blog 32, portfolio 30, career job 8 — sitemap thi): status, title, description, og, alt.
- `tools/seo-audit.mjs` (repo no potano tool) — 108 sitemap URL: 69 OK, 1 BLOCKS, 38 WARN.
- Hero first-screen check 1280×720 (laptop ni sauthi nani height): H1 lines, CTA vs bottom menu pill overlap.
- Browser ma joyu (screenshot): About, Team, Contact, Careers, Portfolio, Blog, Products, WebDev, Mobile, AI, Metaverse, UI/UX, Animation, 3D Modeling, Portfolio detail, Blog detail, Career job + apply form, mega menu, 404 page.
- Keyboard Tab focus (WebDev), mega menu open/close, console errors.
- Code scan: `src/styles/*.css` + `globals.css` (hard-coded violet/pink, transition: all, outline:none, small font), forms, shield, proxy, robots/sitemap, menu.

**Test NATHI karyu / limit:**
- Production build (`npm run build`) nathi chalavyo → speed/Lighthouse numbers nathi. Dev mode ma pehli vaar page 2–16 s compile thay (e dev-only che, bug ganvu nahi).
- Admin panel (`/admin`) login-gated → joyu nathi.
- Form SUBMIT nathi karyu (real lead + WhatsApp alert jay). Fakt field/label/validation code joyu.
- Mobile/tablet app (`/m/*`) fakt status + canonical joyu (200, canonical laptop URL — OK). Design nathi joyu.
- Browser pane screenshot nana ane ghana vaar half-render hoy che; tethi pixel-level design judgement ~ **measure + code + screenshot** no mix che. Real 1440×900 / 1920×1080 par owner e ek vaar aankh thi jovu.
- Safari/Firefox, screen reader, real contrast meter nathi vaparya.
- Test ni vachche owner no dev server (port 1010) band thai gayo (3D Modeling page iframe ma load karta). Bug che ke mari load thi e nathi pakku → prod build par pachi test karvo. Meh server pachho chalu karyo.

## 1. Scoreboard

| Priority | Matlab | Count |
|---|---|---|
| **P0** | Page kharab / visitor lost / Google ne nathi dekhatu | 1 |
| **P1** | Mota UX / SEO / rule break (ghana pages ma) | 11 |
| **P2** | Design / consistency / a11y (dekhay che pan kaam chale che) | 14 |
| **P3** | Nani polish / check karvani | 8 |

Good news: 39 real pages 200 OK (1 j 404), 1 H1 (webdev sivay), image alt badha ma che, broken image 0, console ma app error 0 (fakt dev HMR), horizontal scroll 0, font Poppins (2 jagya e Archivo), `rel=noopener`/sandbox sari, headers (HSTS, nosniff, frame) sara, `/m` pages canonical sahi.

---

## 2. MASTER TABLE (copy-paste mate)

Columns: **ID | Pri | Page / Area | Aa problem che (mode ma shu thay che) | Proof | Kya change karvu | Faido | Kem karvu (reason) | Pachi shu (target purun karva) | Files | Lock?**

| ID | Pri | Page / Area | Problem | Proof | Change (shu kari shakay) | Faido | Reason | Next step to full target | Files | Lock? |
|---|---|---|---|---|---|---|---|---|---|---|
| B-01 ✅ | **P0** | `/wordpress-plugin-development-company` (+ Menu → E-commerce → "WordPress Plugin Development", + sitemap.xml) | Aa service page **404 "Not found."** aape che, `noindex`, title nathi. Menu ma link che, sitemap ma che — visitor + Google bane ne dead end. 15 vaar click = IP 1 kalak mate block + Admin → Alerts ma khoti "hacking" alert. | Fetch: 404, body "Not found." `seo-audit`: BLOCKS 404 + noindex. Cause: shield regex `wordpress` (boundary vagar) e `/wordpress-plugin…` ne hack-probe maane che. Local test: aa ek j real URL block thay che. | `PROBE_PATH` ma `wordpress` → `wordpress(?:\/\|$)` (fakt `/wordpress` ane `/wordpress/…` probe). Fix pachi `/wordpress-plugin-development-company` 200 aavvu joie + `seo-audit` OK. | Aa page Google ma aave, menu link chale, visitor lost na thay, IP ban risk jay. | Hacker-shield real page ne pan roke che. | Fix → `node tools/seo-audit.mjs <url>` + prod par check. Test add: shield regex vs badha `PAGES` paths (script 10 line). | `src/lib/shield.ts:12` | Nahi |
| B-02 ✅ | **P1** | Site-wide SEO / social | **Koi pan laptop page ma `og:image` nathi** (Home, About, badhi services…). Fakt blog/portfolio/job ma che. WhatsApp/LinkedIn share ma image vagar nu link. Twitter card pan nathi. | Audit: 38/38 main pages `noOG`. `baseMetadata` ma openGraph/twitter nathi. | `baseMetadata` ma default `openGraph.images` (brand 1200×630) + `twitter: summary_large_image`. Page-wise override optional. | Share karyu link professional dekhay → click vadhe. | Sales/marketing links WhatsApp par j share thay. | Brand OG image (code/SVG thi, no paid image tool) banavi `public/` ma. | `src/lib/root-shell.tsx` (`baseMetadata`), `src/lib/cms/page-route.tsx` (`pageMetadata`) | Home ni metadata → Home locked; default ma add karvu to Home ne pan lage → owner ni haa. |
| B-03 | **P1** | robots.txt, sitemap.xml, canonical | Local ma `Sitemap: http://localhost:3000/sitemap.xml` ane badha canonical `localhost:3000` (`.env` ma `NEXT_PUBLIC_SITE_URL`). Live par set na hoy to Google ne localhost URL malshe. | `/robots.txt`, `/sitemap.xml` (108 loc), `/m/about` canonical badha localhost:3000. Port pan mismatch (3000 vs 1010). | **Live site par check karvu** (`curl https://www.we3vision.com/robots.txt`). Hostinger env ma `NEXT_PUBLIC_SITE_URL=https://www.we3vision.com`. Fallback `localhost` ne production ma error banavo (build fail / warn). | Google index sachu URL par. | Galat canonical = pura site no SEO zero. | Live par 3 file joi ne ✓. | `.env`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/lib/root-shell.tsx` | Nahi |
| B-04 ✅ | **P1** | 404 page (badhi khoti URL) | Default Next.js **kalo screen, "404 \| This page could not be found."** — brand nathi, menu nathi, back link nathi, font system. Visitor pachho jay. | Screenshot `/nonexistent-page`; koi `not-found.tsx`/`error.tsx`/`global-error` laptop site ma nathi (`(m)` ma fakt loading). | Branded 404: logo, aurora background, "Aa page nathi malto", 3 buttons (Home, Services, Contact) + search/PANDA. `error.tsx` pan (500 mate). | Lost visitor pachho aave, brand trust. | 404 = sauthi vadhu "lost" moment. | Same style `not-found.tsx` + `error.tsx` + `global-error.tsx`; 404 `noindex` rakhvu. | `src/app/(site)/not-found.tsx` (new), `error.tsx` (new) | Nahi (Home ne touch nathi) |
| B-05 ✅ (detail pages) | **P1** | Fixed logo + bottom menu pill + round menu button (badha pages) | Reading vakhte **logo mark ane menu button text/heading par overlap** kare che: Blog article ma paragraph par "W" logo + "≡" button; WebDev "Websites For Every Industry" heading par logo; Portfolio "The Beer Beauty" title par logo. Bottom pill cards/CTA dhake che. | Screenshots: `/blog/ai-agents…` (scroll 1200), `/webdev` (9000), `/portfolio` (1300), `/careers/web-developer`. | (a) article/detail pages par logo ne chhoto/fade (scroll thaya pachi opacity↓ ane pointer-events none), (b) pill ne content na CTA par aave tyare auto-hide / safe-bottom padding. | Text vanchay, CTA dekhay, clean feel. | Reading + clicking sauthi moti UX rule. | Detail pages ma `scroll-padding`, sections ma bottom 96px safe area. | `src/components/site/logo-mark.tsx`, `floating-nav.tsx`, css `.lm-*` / `.fn-*` | **Shared → Home pan lage.** Page-prop (`/blog/*`, detail) thi scope karvu; baki mate owner ni haa. |
| B-06 ✅ (standard hero) | **P1** | First screen 1280×720 (laptop) | Bottom pill **hero CTA button dhake che**: WeBugMate ("Visit WeBugMate", "All products"), AI ("Get a free quote", "See how AI works"), Animation ("Discuss your animation project", "Our animation services"), 3D Modeling (screenshot), Shopify ("Customize theme"), Physical Marketing, Careers (city chips). | `hero check`: CTA rectangle ∩ pill rectangle (x 458–822, y 618–672). | Hero ni height `min(100svh, …)` + CTA ne y ≤ 560px rakhvo, ya hero ma `padding-bottom: 120px`. | Primary action hamesha dekhay → leads vadhe. | Laptop 1280×720 ghanu common (1366×768, 1536×864 scaled). | Test 1280×720, 1366×768, 1440×900, 1920×1080 badha par CTA ∩ pill = 0. | `sections/page-hero.tsx`, css hero blocks | Nahi (Home sivay) |
| B-07 ✅ | **P1** | Focus / keyboard | Koi global `:focus-visible` nathi; browser default **1px ring** — "Get a free quote" par ring `rgb(13,3,22)` (violet button par dark = dekhay nahi). Logo link `outline: none`. 31 `outline:none` rules (public css). Skip link nathi. Tab order pehla theme-colour button par jay. | Tab test `/webdev`: `outline auto 1px rgb(13,3,22)`; logo `outline none`. `outline:none` ×31 public css (+6 admin). | Global theme-based ring: `:focus-visible { outline: 2px solid hsl(calc(var(--th)+…)…); outline-offset: 3px }`; badha `outline:none` ne replacement; `Skip to content` link (`<main id>`); colour-FAB tab order chhelle. | Keyboard / screen-reader user site vapri shake; legal a11y. | WCAG 2.4.7; web-interface-guidelines. | Pachi 10 pages par Tab-through video-less check. | `globals.css` (new prefix block at end), `(site)/layout.tsx` | Nahi (Home par pan keyboard sudhare — owner ne kaho) |
| B-07b ✅ | P1 | Custom cursor | `html.has-custom-cursor * { cursor: none !important }` — input / textarea / text-select ma pan system cursor gayo. Contact/Careers form ma text caret-cursor dekhato nathi. | `globals.css:196`. | Form fields (`input, textarea, select, [contenteditable]`) ma `cursor: text !important` return. | Typing comfortable. | Forms = leads. | Cursor ne form par "You" tag hide. | `globals.css` / `custom-cursor.tsx` | Nahi |
| B-08 ✅ | **P1** | SEO titles / descriptions | **20 page title > 60 char** (Google kaape), 14 > 70 (Metaverse 81/85, Graphics 82/86, Brand Dev 92/96, Brand Video 90/94). **17 description > 170** (WebDev 221, AI 216, Metaverse 215, Graphics 209, Brand Dev 208, CRM 205…). Blog: 24/32 title > 65. | `seo-audit.txt` + audit. | Title ≤ 60, description 120–158. Keyword aage, brand "\| We3vision" chhelle. Admin Pages ma meta edit. | SERP ma poora title/snippet dekhay → CTR. | Cut-off text = loss. | Ek pass: badha 38 + 32 blog ni list banavi owner ne approve karavvi. | `src/lib/cms/content/*.ts`, admin → Pages | Nahi |
| B-09 ✅ | **P1** | `/webdev` | **2 `<h1>`** + 6 anchor jena `href` nathi. | audit h1:2, emptyHref6; seo-audit WARN. | Ek j H1; mockup (office builder) na fake `<a>` → `<span>`/`button`. | Clean heading structure. | SEO + a11y. | — | `components/site/office-builder.tsx`, `guide*.tsx` | Nahi |
| B-10 | **P1** | Portfolio list + detail | **Placeholder content live**: "The New Shop" card text = *"A short description of the project: the client's goal and what we designed for them."*; projects **"Carousel 1/2/3"**, **"Project 28/29/30"** (title + URL + meta); **Cosimo** card ma image nathi (khali dark card). | Screenshot `/portfolio` (scroll 1300); sitemap URLs; audit titles. | Admin → Projects ma real title/desc/image; jyaan content nathi tyaan project hide (draft). Image missing hoy to designed fallback tile. | Portfolio = trust page; placeholder dekhay to company amateur lage. | Owner rule: invent nahi — real content owner thi. | Owner pase thi 6 real descriptions + images; baki hide. | Admin Projects (DB), `components/site/modern/*portfolio*` | Portfolio design pending (brain 09) |
| B-11 ✅ (balance + short screens) | **P1** | Hero typography (badhe) | H1 size ek system nathi: **83, 74, 62, 58, 56, 54, 50, 45, 42, 37, 35, 26 px** alag alag pages par. 1280 par heading **widow/orphan**: 3D Modeling *"Bring Your Concepts To / **Life** / With Custom 3D / Modeling"* (4 line), AI/WeBugMate 3 line. `page-hero` ma `text-wrap: balance` nathi. | `hero check` (fs), screenshot 3D. | H1 scale 3 steps (hero 64–72, section 40–44, small 28–32) + `text-wrap: balance` hero + h2 par. | Premium, consistent. | Orphan word = amateur. | Typography tokens table (sec 4). | `sections/page-hero.tsx`, `globals.css` | Nahi |
| B-12 ✅ (menu 14px; duplicate Brand Design not changed) | **P2** | Mega menu | **39 links 13px** (rule ≥14). **"Brand Design"** 2 vaar (Creatives ane Branding). | DOM: sizes `13px×39`. `site-menu.ts`. | Links 14–15px; "Brand Design" ek j jagya (Branding group); Services link `/#services` fine. | Rule + clarity. | Duplicate = confusion. | — | `components/site/mega-menu.tsx`, css `mega-menu.css`, `lib/site-menu.ts` | **Shared with Home → owner ni haa.** |
| B-13 ✅ (all areas) | **P2** | Small text < 14px | About "office" labels **9.5px ×16** (`.of-label`); Brand Identity gallery tags **11.5px ×60** (`.arch-cat`), captions 11.5–13.8; Careers `.rv-no` 13px; UI/UX `cv-dim` 13px; careers.css ×7, ui-ux.css ×5, office.css ×2, team.css ×1, globals ×1 `font-size ≤13px`. Home `hub-name` 12.8px, "Reason" label 13.6px (Home = locked). | audit `under14`; css grep. | Chips/labels ≥ 14px; decorative ma jara ma `aria-hidden`. | Readability rule. | Owner rule: label ≥14, para ≥16. | Re-run audit, under14 = 0 (mockup UI sivay). | `styles/careers.css`, `ui-ux.css`, `office.css`, `brand-identity.css`, `globals.css .of-label` | `.of-label` About = owner ni haa; Home items locked |
| B-14 ✅ | **P2** | Font Poppins only | **Archivo 900** load thay che: `/about` (2027 office sign, `timeline-office.tsx`) ane `/brand-identity` (`rotating-word.tsx`). Extra font file. | Computed fonts `Archivo`. | Poppins 700/600 thi replace, ya owner approve kare to exception. | Rule + ek font file ochhi. | "Poppins everywhere". | — | `components/site/timeline-office.tsx`, `rotating-word.tsx` | Brand word design → owner puchvu |
| B-15 ✅ (tints) | **P2** | Theme colour rule | **Hard-coded violet/pink colours** je theme picker thi badalta nathi: `office.css` ~47 values (team office), `globals.css` ~41 (lines 2169–2188, 226…), `contact.css` ~10, `metaverse.css` ~14, `about.css`, `process-floor.css`, `theme-picker.css`. (Admin excluded.) | Script: hex/rgb hue 245–345 in public CSS. | `hsl(calc(var(--th) + N) calc(S% * var(--ts)) L%)` ma convert. Near-black bg (`rgb(5,2,12)`) pan hue-shift. | Theme change kare tyare puro site badalay. | Owner rule 7. | Theme-picker ma 3 colours try karine screenshot compare (`tools/style-diff.mjs`). | `styles/office.css`, `globals.css`, `contact.css`, `metaverse.css` | Home ne naadvu nahi |
| B-16 ✅ | **P2** | `transition: all` | 30 jagya: seo-marketing ×9, graphics ×6, meta-marketing ×4, brand-dev ×3, headless ×3, physical ×3, shopify-app ×1, woocommerce ×1. | css grep. | Properties list (`transform, opacity, background-color, border-color`). | Smooth, kam repaint. | Perf + jank. | `style-diff` verify. | `styles/*.css` (names ᴜpar) | Nahi |
| B-17 ✅ (contact flow) | **P2** | Forms (Contact, Careers, tech-page demos) | Contact forms ma **visible label nathi** — placeholder + `aria-label` (type kare to hint jai chhe, "optional" gayab). Placeholders ma `…` ellipsis nathi, email ma `spellCheck={false}`/`inputMode` nathi. | `contact-form.tsx`, `contact-flow.tsx`. Careers `job-apply` ma label che ✓. | Floating/visible labels, "(optional)" label ma, validation message field nu nichhe. | Fewer form errors → vadhu leads. | CX + a11y. | Contact submit nu real test (staging) pachi. | `components/site/contact-form.tsx`, `contact-flow.tsx` | Nahi |
| B-18 ✅ | **P2** | Tech demo pages (WordPress, WooCommerce) | WordPress mockup ma **6 `role=switch` button ne naam nathi**, 3 input unlabeled ("Title", "What's on your mind", "Search Pages"); WooCommerce **coupon input unlabeled**. | audit noName/noLabel; `tech/wordpress.tsx:291,188,189,212`, `woocommerce.tsx:62`. | `aria-label` add. | Screen reader. | a11y. | — | `components/site/tech/wordpress.tsx`, `woocommerce.tsx` | Nahi |
| B-19 ✖ no change | **P2** | Image dimensions | Blog list **33 image**, Portfolio list **30**, Brand Identity gallery **60** — `width/height` nathi (layout jump / CLS). Blog/portfolio card images `alt=""` (decor che pan title cover image no alt hovo joie). | audit `imgNoDim`; `modern/blog-masonry.tsx:155`, `blog-extra.tsx`. | `width`/`height` ya `aspect-ratio` box; detail cover ma meaningful alt. | Stable layout, SEO images. | CLS + image SEO. | Lighthouse prod. | `components/site/img.tsx`, `modern/blog-*.tsx`, `arch-gallery.tsx` | Nahi |
| B-20 | **P2** | Products (WeJobs / WeThink / WePresent) | Site kahe che **"Coming soon"**, pan `wejobs.we3vision.com` **live che** (title "We Jobs – Find Your Dream Job") ane `wethink.we3vision.com` title **"client"** (default). Content mismatch. | curl titles. | Owner kaho: WeJobs live kari ne link aapvo ke "coming soon" j raakhvu. | Visitor ne sachu. | Wrong status = trust loss. | Owner decision. | `lib/cms/content/products.ts` | Nahi |
| B-21 | **P2** | Careers hero | "Reach Your Destination": scroll karta **page aagal jato nathi** jya sudhi city na choose karo (scroll 2600 → same screen) ane city chips bottom pill niche dabay che. Gate no koi hint nathi. | Screenshot + scrollTo test. | Chhota hint ("City choose karo → train aave") + "Skip, show all jobs" link. | Visitor atkay nahi. | Hidden gate = confusion. | Owner confirm ke gate intentional che. | `components/site/career/journey.tsx`, `railway.tsx` | Owner step-by-step design — puchvu |
| B-22 ✅ | **P2** | Structured data | `/about`, `/sitemap` ma **JSON-LD nathi** (Organization/AboutPage). Careers job ma og nathi. | audit `ld0`; seo-audit WARN. | AboutPage + Organization (same-as LinkedIn/Instagram); `/sitemap` BreadcrumbList. | Rich results. | SEO. | — | `app/(site)/about/page.tsx` | Nahi |
| B-23 | **P2** | Hero blank pachhi text (initial load) | Dev ma pehla frame ma hero text dikhatu nathi (aurora j), pachi aave. Prod ma kevu — **verify**. | Screenshots at 3–6 s on `/portfolio`, `/blog`, `/ai`, `/ui-ux-design`, `/animation`. | Prod build par check; jo thay to hero text SSR-visible (no `opacity:0` until JS). | LCP + first impression. | First paint empty = bounce. | Lighthouse LCP prod. | `sections/page-hero.tsx` reveal classes | Nahi |
| B-24 | **P2** | Industries 3D city (Metaverse, WebDev, Mobile…) | Metaverse city ma labels **right edge par clip**: "Real estate & construct…", "Apartm…". WebDev/Mobile ma card text blur ma atki jay che (transition snapshot). | Screenshots `/metaverse`, `/mobile`, `/webdev`. | Labels ne viewport-aware (flip/left align), blur-in final state. | Clean 3D scene. | Clipped text amateur. | Owner ne batavi permission. | `industries-city.tsx`, `city-scene.tsx` | **LOCKED — puchvu** |
| B-25 | **P2** | Repeated hero layout | 9 pages (`webdev, mobile, crm, ui-ux, animation, 3d-modeling, blog, products, team`) no first-screen **same**: badge → 2-line white/lilac H1 → paragraph → 2 buttons, centre. Owner nu rule "no repeated designs". | Screenshots + h1 top 216–250 / fs74 same. | Service-wise hero scene (sec 5). | Page ni oalakh, "wow", service samajay. | Owner rule 6 + clarity. | Phase-wise, page by page. | `sections/page-hero.tsx` + per-page hero | Per-page owner approval |
| B-26 | **P3** | Page weight / scroll length | Pages ghana lamba: Metaverse **39 773 px**, Brand Dev 29 732, AI 21 482, Brand Identity 21 321. Heavy WebGL/p5 (graphics, 3D). | `scrollHeight`. | Prod Lighthouse (`ship-check`), lazy-mount WebGL off-screen (already `PauseOffscreen`). | Fast on laptop. | Dev-mode numbers reliable nathi. | `brain/15-optimization-handbook.md` phases. | many | Optimize branch |
| B-27 | P3 | Dev stability | Owner no dev server 3D Modeling iframe test vakhte band thayo (cause unknown: memory/WebGL). | Port 1010 refused after test. | Prod build par same page 3–4 vaar open/close, memory juvo. | Crash risk filter. | Unconfirmed — site bug na pan hoy. | `npm run build && npm start` test. | — | — |
| B-28 | P3 | `theme-color` / `color-scheme` | `color-scheme: dark` ane `<meta name="theme-color">` nathi (fakt careers.css). Scrollbar/native select/overscroll light rahe. | grep. | `html{color-scheme:dark}` + meta theme-color. | Dark pages ma white flash/scrollbar nahi. | Polish. | — | `globals.css`, `root-shell.tsx` | Home ne asar → owner |
| B-29 | P3 | Old-site URL spelling | `devlopment` (typo) URLs jaane-jaane rakhya (old SEO). | routes. | Keep; correct URL ne 301 add na karo jya sudhi old rankings. | Rank safe. | Intentional. | — | — | — |
| B-30 ✅ | P3 | Metadata base | `metadataBase` fallback `http://localhost:1010`; `title: "We3vision"` default. | `root-shell.tsx`. | Prod ma env missing = build warning. | Safety. | B-03 sathe. | — | `root-shell.tsx` | Nahi |
| B-31 | P3 | Screen-reader extras | `alt=""` decor sivay team photos (`team-office.tsx:408,586` `alt=""`) — name hovu joie. | grep. | `alt={name}`. | a11y + SEO. | Team photos real. | — | `modern/team-office.tsx` | Nahi |
| B-32 | P3 | WebDev code mock font | Mockup text 7–12px (`index.html`, "EXPLORER", etc.) — mockup UI che (decorative) → `aria-hidden`/exempt rule lakhvo. | audit. | Mark decorative; baki real UI ≥14. | Rule clarity. | — | — | `office-builder.tsx` | Nahi |
| B-33 | P3 | Console | App error 0 (fakat dev HMR websocket). `office-code.ts` ma sample `console.log` che (code sample string, bug nathi). | console. | — | — | — | — | — | — |

> Note: Admin panel, form submit, real device, Lighthouse prod — **aa 4 baki che** (sec 7 ma "Next test round").

---

## 3. Page-wise status (badha pages)

`OK` = status 200 + 1 H1 + metadata theek. `SEO` = title/description lamba. Numbers = B-IDs upar.

| Page | Status | SEO | Main issues (B-IDs) |
|---|---|---|---|
| `/` Home (LOCKED) | 200 | OK | og (B-02); small label `hub-name` 12.8px, `rs-label` 13.6 (locked) |
| `/about` | 200 | desc 176, no JSON-LD | B-13 (`of-label` 9.5px ×16), B-14 Archivo, B-22 |
| `/team` | 200 | desc 184 | B-25 hero, B-15 office.css colours |
| `/contact` | 200 | OK | B-17 labels, B-06 pill near CTA, B-07b cursor |
| `/careers` | 200 | OK | B-06 chips under pill, B-21 gate, B-13 `rv-no` 13px |
| `/careers/[8 jobs]` | 200 | OK, no og | B-05 overlap, apply form ✓ labels |
| `/blog` + 32 posts | 200 | 24/32 title > 65, cover `alt=""` | B-08, B-19, B-05 |
| `/portfolio` + 30 | 200 | OK | **B-10 placeholders**, B-19 |
| `/products` | 200 | title 73 | B-08 |
| `/products/webugmate` | 200 | OK | B-06 CTA under pill |
| `/products/wejobs` `/wethink` `/wepresent` | 200 | OK | B-20 status mismatch |
| `/webdev` | 200 | title 69, desc 221, **2 H1** | B-09, B-08, B-13 (mockup) |
| `/mobile` | 200 | title 74/78, desc 196 | B-08, B-24 card blur |
| `/ai` | 200 | desc 216 | B-06 CTA, B-08 |
| `/metaverse` | 200 | title 81/85, desc 215 | B-24 labels clipped, B-26 (39 773px) |
| `/ui-ux-design` | 200 | title 75/79, desc 189 | B-08, B-13 `cv-dim` |
| `/crm` | 200 | desc 205 | B-08 |
| `/animation` | 200 | title 77/85, desc 191 | B-06 CTA, B-08 |
| `/3d-modeling` | 200 | desc 191 | B-11 orphan "Life", B-06 |
| `/graphics` | 200 | title 82/86, desc 209 | B-08, B-16 `transition: all` ×6 |
| `/seo` | 200 | OK | B-16 ×9 |
| `/brand-identity` | 200 | desc 178 | B-13 (60 tags 11.5px), B-14, B-19 (60 imgs) |
| `/brand-development-services` | 200 | **title 92/96**, desc 208 | B-08, B-16 |
| `/brand-kit-design` | 200 | title 77/81 | B-08 |
| `/brand-video-production` | 200 | **title 90/94** | B-08 |
| `/zero-to-n-brand-development` | 200 | desc 175 | B-08 |
| `/headless-CMS-devlopment-services` | 200 | title 74, desc 177 | B-08, B-16 |
| `/custom-wordpress-devlopment-services` | 200 | title 78 | B-18 (switches/inputs), B-09 (1 anchor) |
| `/shopify-development-services` | 200 | title 71/75 | B-06 ("Customize theme" under pill) |
| `/custom-woocommerce-devlopment` | 200 | title 67 | B-18 coupon input, B-16 |
| `/shopify-app-development-services` | 200 | title 67/71 | B-16 |
| **`/wordpress-plugin-development-company`** | **404** | noindex | **B-01** |
| `/shopify-plugin-development-services` | 200 | title 77/81, desc 172 | B-08 |
| `/software-development-services` | 200 | desc 180 | B-08 |
| `/meta-marketing-services` | 200 | OK | hero H1 4 lines (B-11) |
| `/physical-marketing-services` | 200 | OK | B-06 ("Branded merchandise" under pill) |
| `/sitemap` | 200 | no JSON-LD | B-22 |
| 404 / unknown URL | 404 | — | **B-04** |

---

## 4. "Master design" — ek system, badhi jagya same rules (Apple-minimal + We3vision theme)

Aa owner na rules (Poppins, theme tokens, desktop only, ≥16/≥14px, unique per service, flat + hairlines + one accent) par based che. **Kai bhi implement karva pehla owner ni haa; page-by-page.**

| Token / Rule | Value (proposal) | Aa kya vapray |
|---|---|---|
| H1 hero | 64–72px / 1.05 / 600, `text-wrap: balance`, max 2 lines (1280 par) | badha service-page hero |
| H2 section | 40–44px / 1.1 | section heads |
| H3 card | 22–24px | card title |
| Body | 16–18px / 1.6 (≥16 hamesha) | paragraphs |
| Label/chip | 14px, 500, letter-spacing .04em | badges, tags, nav |
| Spacing scale | 8 · 16 · 24 · 40 · 64 · 96 | section padding 96/120 |
| Hero safe zone | content `bottom ≥ 120px` (floating pill mate) | CTA overlap zero |
| Radius | 12 (inputs) · 20 (cards) · 999 (pills) | |
| Primary button | height 48, theme gradient ek j recipe, hover brighten, **focus ring 2px theme** | badhe |
| Focus ring | `outline: 2px solid hsl(calc(var(--th) + 20) calc(100% * var(--ts)) 72%)` + offset 3 | global |
| Motion | `transform/opacity` j, 200–400ms, `prefers-reduced-motion` respect | |
| Colour | fakt `hsl(calc(var(--th)+N) …)` ya Tailwind tokens | hard-coded hex nahi |
| CTA rule | Dar page par **1 primary** + 1 secondary; above fold y ≤ 560 @720 | |

---

## 5. Service-wise themed design (hero + ek signature section) — "service ni ukhaan design ma dekhay"

Rules: unique per page, no copied template assets, theme tokens, desktop, avatar fakt jya owner e kahyu. **Options** — owner pick kare.

| Service page | Aaje first screen | Service-related hero idea (code/SVG/CSS) | Signature interaction |
|---|---|---|---|
| WebDev | text hero (same template) | Browser window jema layout blocks scroll sathe gothavay (header → hero → cards → footer) | "Build your page" toggles (already office-builder: first screen ma preview aapo) |
| Mobile app | text hero | Single phone, screens swipe (login → feed → pay) with theme glass | Platform switch iOS/Android |
| AI | text hero | Node graph: data → model → answer pulsing | "Ask the robot" already; hero ma 1 live example |
| CRM | text hero | Pipeline columns, deal card drag-in animation | Stage counter |
| UI/UX | blurred | Figma-like canvas: frames, cursors, layer panel | Zoom to 100% |
| Animation | blurred | After-Effects style timeline with 3 layers sliding | Scrub play-head |
| 3D Modeling | text hero (orphan) | Wireframe → shaded rotating object (three.js already on site) | Drag to rotate, wire/solid |
| Graphics | pen-tool (done) | Keep; fix `transition: all` | — |
| SEO | search bar (done) | Keep | — |
| Brand identity / kit / video / dev / E2E | word hero / gallery | Brand-board cards forming a logo grid; video = film strip | Palette picker linked to theme |
| Tech pages (WP, Woo, Shopify, Headless, Plugin, Shopify app) | own dashboards (done) | Add `aria-label`s; make first screen show platform dashboard preview | Demo buttons labelled |
| Contact / Careers / Team / Blog / Products / Portfolio | mixed | Contact = reception (done); Careers = train (done); others get unique hero from list above | — |

---

## 6. Visitor clarity (CX) — "visitor ne samjay: shu che, shu karvanu, shu thase"

Har page par 3 savalo no jawab pehli screen par: **Aa shu che? → Mare shu karvanu? → Click karya pachi shu thase?**

| Check | Aaje | Karvu |
|---|---|---|
| Primary action dekhay (no overlap) | Pill CTA dhake che (B-06) | Safe zone + 1 clear CTA |
| Aa page shu che (1 line) | Ghana pages ma H1 saaru, paraan 2 line | H1 + 1-line "kone mate / shu male" chip row |
| Scroll gate / pinned section hint | Careers gate no hint (B-21); pinned service boxes ma "scroll to open" hint nathi | Nana text hint + progress dots + "Skip" |
| Interactive demos ne ketla "try me" | Many (switches, canvases) | Cursor label "Try", first-state example filled |
| Form: je pachhi thase te kehvu | Contact flow ma "Mission brief" saaru ✓ | Submit pachi: "24 kalak ma reply" + WhatsApp link (owner approve) |
| Lost visitor | Black 404 (B-04) | Branded 404 |
| Trust | Placeholder portfolio (B-10) | Real work only |
| Language | English; Gujarati/Hindi nathi | Optional (owner ne puchvu) |

---

## 7. Fix order (phase-wise) + owner ne puchvana sawal

**Phase 1 (aaj j, nani, safe — kam 1 task, 1 push):** B-01 (shield), B-09 (H1/anchors), B-18 (aria-labels), B-04 (404 + error page), B-12 (menu 14px + duplicate — owner ni haa), B-30 env guard.
**Phase 2 (SEO/share):** B-02 og image, B-03 (live env check), B-08 titles/descriptions, B-22 JSON-LD, B-19 image sizes.
**Phase 3 (UX system):** B-07 focus ring + skip link, B-07b cursor on inputs, B-06 hero safe zone, B-11 type scale + balance, B-17 forms.
**Phase 4 (design):** B-05 logo/pill overlap, B-13 small labels, B-15 theme colours, B-16 transitions, B-14 Archivo, B-25 service heroes (page by page).
**Phase 5 (content/owner):** B-10 portfolio real content, B-20 product status, B-21 careers gate.
**Phase 6 (optimize):** `optimize` branch, handbook 15 — Lighthouse prod, B-23/26/27.

**Owner ne puchvu (ek ek vaar):**
1. Shared pieces (logo, bottom pill, mega menu, global focus ring, og default) Home pan badalse — Home locked che → "shared change allowed?" (B-05, B-07, B-12, B-02, B-28).
2. Locked sections (service strip, TechSpace popup, Industries city) — B-24 city labels clip fix allowed?
3. Archivo font exception (About 2027 sign, Brand rotating word) — rakhvu ke Poppins?
4. WeJobs live che — "Coming soon" badalvu?
5. Portfolio: real content kyare malse? Tya sudhi placeholder projects hide karu?

**Next test round (jyare ready):** prod build Lighthouse, admin login test, form submit staging, real 1440×900 + 1920×1080 screenshots, Safari/Firefox, keyboard full-site, real device for mobile app.

---

## 8. Prompt (biji chat ma paste karva)

```
Tu We3vision website no senior developer che. Repo: D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07 (main folder, branch main).
Pehla vaanch: brain/00-START-HERE.md, brain/02-rules-and-preferences.md, brain/18-website-test-master-table.md.
Owner Gujarati-English (romanized) ma lakhe che: tu pan same short style ma jawab aap.
Rules: Home "/" LOCKED; locked sections (service strip, TechSpace popup, Industries city) ne puchya vagar nahi; desktop only; Poppins; para ≥16px, label ≥14px; theme colours hsl(calc(var(--th)+N)…); new CSS = new prefix, end of globals.css; typecheck + eslint + npm run build pachi j push; main only.
Kaam: master table ni Phase 1 thi chalu kar (B-01 shield fix, B-09, B-18, B-04, B-30). Ek ek task number (node tools/tasks.mjs begin N "title"). Dar fix pachi: shu change karyu, kya verify karyu, shu verify nathi karyu, faido — short ma. Pachi Phase 2 mate owner ne puchh.
```
