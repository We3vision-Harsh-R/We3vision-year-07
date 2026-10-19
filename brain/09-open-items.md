# 09 — Open items, caveats and ideas (as of 2026-10-13)

## Waiting for the owner
- **Portfolio page work** — the owner said "let's work on portfolio page" but gave no specifics. Candidate parts: hero, projects
  list/grid, single project page (`/portfolio/[slug]`), admin Projects management. Ask which one before starting.
- **TechSpace planet overlap** (option A or B, see [08](08-task-history.md)) — unanswered; mention only if relevant.
- **Real client work** for the Brand arch gallery/Portfolio: photos + text come from the owner (admin → Projects). Placeholders
  ("Project 01..30", own SVG art) are in `public/images/showcase`.
- **PANDA chatbot**: backend URL must be set in `NEXT_PUBLIC_CHATBOT_API_URL` (local `.env` and Hostinger). Ask Jenish before
  changing `ai-chat.tsx` / `lib/ai-chat.ts`.
- **Mobile app** (2026-10-16): sprint in progress (10 agents) — plan in [13](13-mobile-app-plan.md), architecture in [11](11-mobile-architecture.md).
- **Launcher real-phone test**: only checked in the browser so far; test on a real iPhone/Android.
- **Launcher drag-to-create-folder**: not built yet.
- **Community plugins offered** (Mobile App Design (iOS), A11y Enforcer): waiting for the owner's yes/no.
- **2 leftover worktree folders** were still in use and not removed; clean them up when free.
- **Dev server**: the main folder runs on port 1010 (`.claude/launch.json`).
- **Gov-project logos** (NRIDA, MOC) on Metaverse: monogram badges until logos are supplied (`gov-projects.ts` has a `logo` field).
- **Leader photos** on About/Team: initials avatars until the owner approves downloading/supplying photos.

## Known gaps / caveats
- Task 74 variants cover the 8 pages in the table only; AI, 3D modeling, tech pages, Team, About still use older designs. The Brand
  page's "What we build" strip is identical to the About page's strip.
- Admin screens (Blog, Team, Careers, Projects, Access) were only compile/redirect-checked in previews (login-gated).
- New scenes and sections were only verified at desktop widths; phone/tablet behaviour is unknown on purpose.
- GeoNames city list (CC BY 4.0) needs its credit kept visible in the Careers location picker/footer.
- Production never built in this workflow: run `npm run build` (webpack) before a release; first deploy of a new migration must be
  applied manually (see [07](07-workflow-and-tools.md)).
- `README.md` previously described the old AIgenius design; it was refreshed on 2026-10-13 — keep it short.
- Old note: Home work done on 2026-10-11 before the lock (aurora background, glass cards, border glow, Industries/Tech seams, PANDA
  bar, hub blur removal) already changed Home; task 45 in the revert tool could undo it if the owner asks.

## Ideas the owner mentioned (not started)
- AI chatbot beyond the current backend; heavier GSAP/3D animations (reference sites not given).
- Supabase Auth "in future" (admin uses own login now).
- shadcn/ui components when a new UI element is requested (check ui.shadcn.com first).
- Trending SEO keyword pass on old-site content (allowed by the content rule).

## Technology pages (task 75)
- Not yet checked in the browser by the owner: every menu/tab of the 6 pages. All 6 pages (incl. WP/Shopify dashboards, via `--tw-*` vars at the end of globals.css) follow the theme picker; default purple. Animated multi-gradient (`tgb-flow`) sits behind every 2nd section + the two dashboards.
- Shopify page has no process in the CMS text, so its Home shows a "Today" card instead of the Setup guide.
- Long lists on the tech pages scroll inside their own box (end of globals.css, `scroll-areas.tsx` adds data-lenis-prevent so the wheel scrolls the box, not the page).
- Tech pages animation pass (task 75): mini guide (avatar) appears ONLY where the owner asked: plugin IDE (walks in, presses Activate) and Shopify Home banner (+ cheers on a new order). Headless References tab has an AI box (website chatbot backend if NEXT_PUBLIC_CHATBOT_API_URL is set, else answers from the page FAQ). WP Site Health runs its checks one by one.

## Menu + new pages (task 76)
- The big menu is code-driven: `src/lib/site-menu.ts` (SERVICE_GROUPS, PRODUCT_LINKS, EXPLORE_LINKS). The footer was NOT changed (Home is locked) and still has its Technology column from the admin settings.
- New service pages (content in `content/new-services.ts`, written for SEO, no invented numbers): shopify-plugin, software, brand-development, brand-kit, brand-video, zero-to-n, meta-marketing, physical-marketing. They use the modern sections and have variant-table entries.
- Products (`content/products.ts`): /products, /products/webugmate (links www.webugmate.com), wejobs, wethink, wepresent (coming soon). The wejobs and wethink subdomains did not resolve when checked; the WeBugMate text only says what its own site says (AI-powered project and task management): the owner should add real details.
- App Development, CRM and Headless CMS stay in the Development group (not in the owner's list) so those live pages are not orphaned.
- Sitemap for people: /sitemap (src/app/(site)/sitemap/page.tsx, prefix smp-), lists menu groups + live projects/posts/jobs; also in sitemap.xml. It is not linked from the menu or footer yet (Home is locked, owner list had no Sitemap).
- SEO indexing autopilot done (task 78): see brain/10-seo-indexing.md. Owner must set NEXT_PUBLIC_SITE_URL, submit sitemap.xml in Search Console, and optionally the Google service account / INDEXNOW_KEY. Run tools/seo-audit.mjs before releases.

## Graphic Design page (task 77)
- /graphics is now a custom page (`src/components/site/graphics/graphics.tsx`, CSS prefix `gfx-`), same CMS text as before (read through `tech/data.ts`). The old "Build a brand" guide scene (the cartoon guide at a brand board) is no longer on this page.
- Industries = a painted town drawn with **p5.brush** (https://github.com/acamposuribe/p5.brush, MIT) on top of p5 2.x: `graphics/brush-town.tsx`. npm packages `p5` and `p5.brush` were added to package.json (the owner must run `npm install` on the server / Hostinger build). The town repaints when the colour theme changes. Houses are chosen by the industry name (health, school, construction, shop, game, ads, office, home).
- Not tested yet: very small screens, 9+ industries (the town shows the first 9).

## Graphic Design page v2 (task 79)
- Text is in `content/services.ts` (GRAPHICS_*): rewritten for search (title "Graphic Design Company in Surat, India | Logo, Branding & Print Design", 12 services, keyword FAQ, Adobe Illustrator/Photoshop/InDesign named as the tools). The page also has a code-only keyword cloud and a "What is graphic design?" lesson (`graphics/learn.tsx`) and a FAQPage JSON-LD. If the owner already published an older version of /graphics in the admin, the new default text only shows after "Discard/Reset", the page layout is new either way.
- Pen-tool cursor: `html.cursor-pen` is added by the page; the `.cu-pen` svg lives in `custom-cursor.tsx` (hidden everywhere else, Home looks the same).
- Entrance curtain (`.gfx-curtain`, about 3 s, pure CSS, off for reduced motion). Town: two p5.brush canvases (ink + colour) with scroll masks; p5.brush is ONE shared object, so `brush.instance(p)` is called again in each setup/draw; the colour layer needs an opaque white ground.
- Not tested: phones/tablets, theme colours other than purple on the town, very slow GPUs (two WEBGL canvases).

## Brand Development page (task 80)
- /brand-development-services is a custom page (`components/site/brand/brand-dev.tsx`, prefix `bdv-`). The owner's full service text (12 chapters with every deliverable, 7 service lines, the Starter/Complete/Premium table) is in `brand/brand-data.ts` (code, not editable in the admin); hero, story, FAQ, industries, why and related come from the CMS text (`content/new-services.ts`, BRANDDEV_*).
- Motion = GSAP + ScrollTrigger (npm `gsap`, free "no charge" licence), loaded only on this page, hooked to Lenis. The twelve chapters are one pinned sideways scroll. Laptop/desktop only (no responsive code), as the owner asked.
- The package table has no prices on purpose. "Social media management" is marked as a separate service (owner's note).
- Not tested: real-speed smoothness (the test browser ran at about 4 fps), 1280×720, other theme colours.
- Brand Development (task 81): restyled with the site tokens (violet, glass cards, gradient headings, pill buttons; no blue) and made lighter for smooth scroll: no backdrop blur, one eased belt speed, chapter rail updates only on change, orbit state moved into Orbit, scrub:true (Lenis already smooths).

## Brand Development fixes (task 82)
- Hero/stats sized with vh so they fit 1200x830 and 1366x768; the chapter progress is now a road (`.bdv-road`) above the floating menu with `GuideSide` walking by scroll (pauses when scroll stops). CSS block `bdv-fix2` at the end of globals.css.
- Not tested: 1920x1080, other theme colours, real-speed smoothness.
- Walker road detail (task 82b): parallax scenery (buildings, lamps, trees via CSS mask), curb lines, shadow, dust puffs, step speed follows scroll speed (--wd). CSS block bdv-walk.
- Road walker v2 (task 82c): own component brand/walker.tsx (human proportions, profile face, hip/knee/ankle gait, arm swing, bob, blink; stands and breathes when scroll stops), CSS block bdvw- at end of globals.css. Trees/lamps now taller than the walker.
- Chapter cards equal size (task 82d): track stretches all 12 to the tallest, compact variant under 800px height (CSS bdv-eq).

## End-to-End Brand Development (task 83)
- /zero-to-n-brand-development (route unchanged) is now a custom page: `brand/end-to-end.tsx` + `end-to-end-data.ts`, CSS prefix `e2e-`. Hero text, FAQ, SEO and the contact CTA come from the CMS (`ZERO_*` in content/new-services.ts); the other sections' text is in code.
- Form = the site's existing Contact section (not the long 8-field form of the brief; the services multi-select is not there). Portfolio section is a placeholder + link to /portfolio (no branding case studies invented). Menu label renamed.
- If a published version of this page exists in the admin DB, it overrides the new hero/FAQ text until republished.
- E2E page motion (task 83b): ruler fills with scroll + dot, active section mark lights, hero stagger/float, journey line draws and nodes pop, scope rows stagger, tabs sticky, process line fills, hovers (CSS block e2e-anim).

## Mega menu width fit (task 84)
- The longer label "End-to-End Brand Development" made the five service groups wider than the panel at about 1200-1300px. CSS block `mmfit` (end of globals.css) tightens gaps and, under 1320px, uses 13px link text (below the usual 14px) so everything stays on one line without clipping. Tested at 1200x800 and 1280x720. Also the e2e hero headline stays on two lines at 1200.

## Mega menu v2 (task 85)
- The earlier fix used window media queries, but the panel is capped (was 1280px), so on 1920px screens the 5 groups still overflowed. Now the cap is 1400px and the `mmfit` rules are container queries on `.mm-pop` (≤1380px, ≤1296px); `.mm-in` has overflow-x hidden. Tested 1100, 1200, 1280, 1500, 1920.

## Menu sizes + Poppins (task 86)
- CSS block `mmsize`: panel up to 1560px; on screens >=880px high and panel >=1500px the links are 16px. The small numbers (01, 02) in the menu, sitemap and brand pages use Poppins instead of a monospace font.
- NOT changed on purpose: about 60 other `ui-monospace` rules (Headless CMS / Shopify App / WP Plugin demo windows and some Home-page labels); those are code-style UI and Home is locked. Ask the owner if they also want Poppins there.

## Marketing pages (task 87)
- Custom pages in `src/components/site/marketing/` (kit.tsx shared; seo-aeo, meta, physical + *-data.ts text). CSS prefixes `mkt-` (shared), `sxo-`, `mta-`, `phy-` at the end of globals.css. Wired in `tech/index.tsx` for slugs seo, meta-marketing, physical-marketing. Title/description/FAQ/contact CTA in the CMS content (services.ts SEO_*, new-services.ts META_*/PHYSICAL_*) match the new copy.
- All examples are labelled concept/illustration; no invented data. Contact form = the site's existing Contact section (below the page). Published admin versions of these 3 pages (if any) override the new SEO text/FAQ until republished.
- Not done on purpose: mobile/tablet layouts (owner rule), case studies (no approved data), live audit/crawl, live Meta data.

## Sharp images + pinned steps (task 88)
- Cause of soft images: finished animations kept `filter: blur(0)` (a composited, scaled layer). All `blur(0)` end states are now `filter: none` (globals.css). Brand logos use `unoptimized` (served as the 600-900px originals). Admin upload: high-quality smoothing, webp 93%, max 2400px (already uploaded pictures are not re-processed: re-upload them if they look soft).
- Rule from the owner: a section with step-by-step points stays pinned until every point has been shown, then the next section comes. Done with `Sec pin={{count,onChange}}` (marketing pages) and the End-to-End process section. Other older pages with step scrolls (Brand Development journey etc.) already pin.
- NEXT (owner asked): go page by page and redesign every section so no two sections (and no two pages) share the same look. Waiting for the owner to name the first page.
- SEO hero redesigned (typing search bar, ring of 5 nodes, travelling dots) and audit explorer pinned (scroll walks the 8 areas). CSS sxo-hero v2.
- SEO page v3: everything centred; hero = centred text + typing search bar; lab moved to a band under the hero; section search-pills, service rows as search results, FAQ as 'People also ask' (theme colours only, no Google branding). CSS block 'SEO page: everything centred'.
- SEO page: new section 03 Keyword Finder (marketing/keyword-puzzle.tsx, CSS kwf-): website bar -> business kind -> what it sells -> glass jar of keyword pieces (template keywords) -> drag/click into the search box (SERP preview + keyword-to-page map + coverage guide, no rank/volume claims). Audit explorer redesigned as a results page (sxo-aud). Sections renumbered 04-11.
- SEO page: audit v3 (search bar + suggestion list + answer box + 4 cards) and process v2 (centred stage line + big card, vars --sk/--sn because --n/--k are set to 0 by a global ol rule).
- Mobile/tablet launcher (task 89): src/components/site/mobile/ (launcher.tsx, launcher-data.ts, glyph.tsx), CSS lnc- (only <1024px; hidden on desktop). Mounted in (site)/layout.tsx as <MobileLauncher/>, renders only on '/'. Home screen = widget + 8 apps + dock of 4 (Portfolio, About, Contact, Services->library). Swipe left = App Library (7 groups, folders). Icons link to the existing (desktop-design) pages for now; sub-pages are not redesigned for mobile yet and there is no 'back to launcher' control yet.
- Launcher icons v2 (task 90): liquid glass tiles (tinted frosted glass, specular streak, rim light, glowing duotone glyph); library has all 38 sitemap pages. Not in the library yet: dynamic pages (blog posts, job pages, portfolio projects).
- Launcher v2 (task 91): rebuilt to iOS 26 measurements (icon 60, 4 cols, margin 27, row pitch 97, widgets 2x2 = analog clock + 'Have an idea?' card, Search pill, dots, dock). Library: Suggestions + Recently Added + 7 groups, search shows an A-Z list. Tapping an app grows its icon to full screen, then the page opens. NOTE: Poppins comes from next/font/google; when the dev machine cannot reach Google, the site shows the Arial fallback. Vendoring the Poppins woff2 files with next/font/local would make it always load (needs the font files).
- Launcher smoothness (task 92): the clock + status bar keep their own time (useNow), the launcher no longer re-renders every second; the clock hands move per frame with requestAnimationFrame (second hand sweeps, no CSS transition); wallpaper lights without big blur, icons without backdrop-filter. Not measurable in the test pane (rAF pauses when the pane is hidden): check on a real phone.
- Launcher v3 (task 93): every app has its own colour (golden-angle hues from the theme hue), continuous squircle corner where the browser supports corner-shape, no fake status bar, names one line, dock without names, library tiles/icons sized like iOS (icon 60, tile ~158), swipe down on home = Search. Not built: long-press jiggle/edit mode, widgets stack, haptics.
- Launcher v4 (task 94b): icons follow the iOS 26 liquid-glass references the owner sent (WWDC25 layered glass, Photos icon, the 49 iOS icons set): two tile kinds (full-colour tile + white glass glyph, light frosted tile + coloured glass glyph), glyph in 3 glass layers, rim light also on dock/search/widgets. Meta Marketing page rebuilt as an ads-manager style UI (task 94).

## Optimization (set up 2026-10-16) — see [11-optimization.md](11-optimization.md)
- Waiting for the owner: (1) may pixel-identical changes touch shared code Home also uses (CSS split, fonts, cobe, layout)? (2) OK to run one `npm run build` for baseline JS sizes? (3) Poppins .woff2 files for next/font/local.
- Phase 1 pass 1 done (asset cache headers, Poppins 300 dropped); most other Phase 1 items were already fine. Next big lever: split globals.css per route (Phase 2) — needs screenshot comparison of every page.

## Mobile app status (2026-10-17)
- Done and on `main`: kit + 37 app screens (all pages of the launcher/sitemap), bespoke iOS screens for 17 pages (about, team, careers, contact, portfolio, blog, products x5, ai, webdev, mobile, software, crm, metaverse).
- Layout check (tools/mobile-layout-check.browser.js) on 38 pages x 6 widths (320/390/430/744/820/1024): no sideways scroll, nothing outside the screen, no overlap.
- Still baseline-kit screens (good, but not bespoke): ui-ux, animation, 3d-modeling, the 7 technology pages, graphics, brand identity/kit/video/development, end-to-end, seo, meta, physical, sitemap.
- NOT mobile yet (they still open the laptop page on a phone): detail pages blog/[slug], portfolio/[slug], careers/[slug] (+ job apply). Needs dynamic mobile routes and a prefix rule in `src/lib/device.ts`.
- Not tested on a real phone; tablet only measured in a desktop browser.
- Tab bar + Apps sheet + Contact sheet are in the kit and show on ALL 37 screens (2026-10-17). Only /webdev has its sections redesigned to the one-panel pattern; other bespoke pages may still look different from each other. Owner to say which page next.

## Status 2026-10-17 (evening): launcher v10 + detail pages
- Done in the main folder, NOT committed (owner commits): everything in brain/11 "Launcher v10 + whole-app pass".
- Not done / to decide: a styled 404 for a phone (needs the experimental `global-not-found` flag); "Edit Pages" (reorder/hide screens) is "Add Page" only; dock icons have no "-" badge in edit mode; haptics cannot be tested here (needs a real iPhone/Android); the mega menu on the laptop is untouched (shared with the locked Home page).

## Open after the iOS 27 redesign (2026-10-18)
- Visual review by the owner on a real phone/tablet; the browser pane screenshots were unreliable during the check.
- app.css and mobile.css still carry the older appended blocks under the new ones (works, but could be consolidated).
- A few UI labels are code words, not CMS: service card labels ("Right for you when", "Problems it solves", "What you get", "Learn more"), careers "All", contact "Message" / "Phone and e-mail", CRM "Back/Next/Step N of M", blog "min read" (estimated from word count).
- /team: teamValues, highlights and FAQ use the default kit look.
- CRM pipeline is sized for about 7 steps.

## Alerts / WhatsApp (2026-10-18)
- WhatsApp works only after the owner adds on Hostinger: ALERT_WHATSAPP_TO + CALLMEBOT_APIKEY (or WHATSAPP_CLOUD_TOKEN + WHATSAPP_CLOUD_PHONE_ID, or ALERT_WEBHOOK_URL), then Admin > Alerts > "Send a test message".
- CallMeBot is a free third-party relay: the alert text (and a contact message: name, e-mail, words) passes through it. The Meta Cloud API is the official option.
- The new password-fingerprint cookie logs every admin out once after the deploy (expected).
- The shield counts in memory (one Node process); with several processes each one counts on its own.
- Admin > Alerts still to be seen with the real DB (it could not be opened locally).

## Hiring desk (2026-10-18)
- To check with the real DB after the deploy: drag and drop, notes, interview, bulk actions.
- HR facts live in Setting rows "hire:<id>"; if applications grow to many thousands, move them to columns / a table (needs a migration).
- Message templates are fixed in lib/hiring-shared.ts (TEMPLATES); an editor in Admin > Careers > Questions of HR could come later.

## Blog page / live preview (2026-10-18)
- If the blog page is already published in the DB, the new top story is not on the live page until it is added in Admin > Pages > Blog (+ Add section) and published.
- The phone preview exists only for the blog page (lib/cms/preview.ts); other pages need their mobile options there to get one.
- Live preview reloads the frame after each save (about 1 s); a longer page scrolls back to the same place, inner scroll areas start at the top.

## Phone app Apple round (2026-10-18)
- Old CSS of the replaced pieces (mp-about-apps, mp-about-rail, mp-about-facts ...) is still in the page CSS files (unused, harmless; can be cleaned).
- Job rows open a sheet, so the phone page has no direct <a> to every job any more (the laptop page, the canonical one, keeps them).
- Not tested on a real iPhone/Android (pull-down to close, swipes).

## Website test round 1 (2026-10-19) — see [18-website-test-master-table.md](18-website-test-master-table.md)
- Phase 1 done in task 96 (B-01, B-04, B-09, B-18, B-30). Phase 2 done in task 97 (B-02, B-08, B-22; B-19 not needed). Home share picture done in task 98. Waiting: B-03 live env check. Phase 3 done in tasks 99 + 100 (hero, focus ring, skip link, text cursor, form labels). Phase 4 done in tasks 101 + 102 (B-05 detail pages, B-13, B-14, B-15 tints, B-16). Owner unlocked Home + locked sections (2026-10-19). Still open: B-15 for character/mockup palettes (office.css, `.ch`, `.ra-*` stay own palette on purpose), SVG art text sizes, B-25 service heroes (page by page), Phase 5 content (B-10, B-20, B-21), Phase 6 optimize. Look at the 14px labels on a real 1440x900/1920x1080 screen (tight places: Home hub tabs, TechSpace pop-up, Industries city labels, webdev code editor).
- `global-not-found` is an experimental Next flag: if a Next upgrade breaks the 404, remove the flag and `src/app/global-not-found.tsx`.
- Owner to answer: shared Home-affecting changes (logo/pill/menu/focus ring/og default), Industries city label clip (locked), Archivo font exception, WeJobs "coming soon" vs live subdomain, real portfolio content.
- Still to test: prod build Lighthouse, admin, form submit on staging, 1440×900 and 1920×1080 screenshots, other browsers, real phone.
- Live check needed: `NEXT_PUBLIC_SITE_URL` on Hostinger (local robots/sitemap/canonical show localhost:3000).

## Phase 5 (2026-10-19, task 103)
- Placeholder projects are hidden automatically (see 08). Owner to fix in Admin > Projects: titles Carousel 1/2/3, typo Good DOllar / God Dollar, Arushi vs Aarushi. The live database may differ from the dev one.
- WeJobs / WeThink subdomains are live but the site says Coming soon (owner decided to keep it). Next phases: B-25 service heroes (page by page), B-03 live env check, Phase 6 optimize.

## B-25 service heroes (task 104)
- Done: /webdev (page builds itself), /mobile (one code, two phones), /crm (one customer, every channel), /ui-ux-design (wireframe to finished UI). Next in the list: /animation, /3d-modeling (+ blog, products, team); show 2-3 options first, build the pick. Ideas are in brain/18 section 5.
