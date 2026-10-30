# 13 — Optimization handbook (method + what was used + where it was applied)

Written 2026-10-16 for Harsh (We3vision). Purpose: any chat, any device or any new project can read this ONE file and (1) apply the same
speed method, (2) build new pages that are fast from day one, (3) see exactly what was already done and on which page.
Plan and history files that go with it: [11-optimization.md](11-optimization.md) (numbers, step log), [12-skills-and-speed-plan.md](12-skills-and-speed-plan.md) (plan).

**Short (Gujarati-English):** optimize no kaam aa file ma lakhyo che. Optimize ni badhi vastu `optimize` branch ma jase (main ma nai, jyare tame kaho tyare merge).
Navo phase chalu karva pehla hamesha tamne puchvu. Aa file main ma che, etle bija project ma pan aa j method vaparay.

---

## 0. Rules of engagement (set by the owner, 2026-10-16)
1. **Optimization work lives on the git branch `optimize`** (not on `main`). Other chats/devices build features on their own branches or `main`;
   `optimize` is merged into `main` only when the owner says so. This file and the rules/brain docs go straight to `main`.
   (`git switch optimize` → work → `git commit` → `git push origin optimize`. Compare with main: `git diff main...optimize`.)
2. **Ask before every phase.** Never start the next optimization phase on your own. Tell the owner what the phase is, which pages it touches and
   the expected gain, and wait for a yes (section 7 lists the phases and their status).
3. **Same look, less download.** Every change must be pixel-identical; if it cannot be, skip it and report it. Home `/` and locked sections:
   changes are allowed only when invisible (owner approved this on 2026-10-16); read `brain/02-rules-and-preferences.md`.
4. Measure before and after, and write the numbers in `brain/11-optimization.md`. No number = not done.

## 1. Results so far (average of the 41 pages of the site, gzip, first load, nomodule polyfills not counted)
| Step | JS | CSS |
|---|---|---|
| Original (commit `0465e20`) | 394 KB | 160 KB |
| After B1 (route CSS + lazy client components) | 219 KB | 119 KB |
| After B2 (late extras + component CSS) | 205 KB (−48%) | 105 KB (−34%) |
| After round 3 (more component CSS, `/graphics` p5 on demand) — **current** (measured 2026-10-16, same method, 41 pages) | **199 KB (−49%)** | **87 KB (−46%)** |

Per page now (JS / CSS gzip): `/blog` 191/106, `/contact` 195/106, `/seo` 203/117, `/graphics` 204/114, `/about` 208/106, `/careers` 211/106,
`/metaverse` 228/106, `/` 233/106, `/webdev` 241/106. Before: ~410/164 on most pages, 332/164 on `/`, `/about`, blog posts, `/sitemap`.
Floor: React + Next framework is ~130 KB gzip JS on every page, so "JS ≤ 150" is not realistic; use **≤ 180** as the budget.
(An early number "449 KB" in older notes counted old-browser polyfills that modern browsers never download; ignore it.)
Look check: before/after style comparison of all 41 pages: identical, except timing-driven demos and the minifier writing the same value differently.

## 2. What was actually used (honest list)
**Used**
- Next.js 16.3.8 production build (`npm run build` = `next build --webpack`), `next start` on two ports to compare an old and a new build
  (`NEXT_DIST_DIR=.next-b1 npx next start -p 1011` serves the older build next to the new one).
- Own scripts in `tools/` (all read-only except the two codemods): `perf-audit.mjs`, `css-analyze.mjs`, `css-parse.mjs`, `css-usage.mjs`,
  `css-split.mjs` (+ `css-split.config.mjs`), `lazy-codemod.mjs`, `client-graph.mjs`, `chunk-report.mjs` (needs `ANALYZE_STATS=1` build),
  `build-weight.mjs`, `perf-run.mjs`, `perf-budget.mjs`, `style-diff.mjs` (headless Chrome through the DevTools protocol), `style-snapshot.js` (early browser-pane version).
- `npx tsc --noEmit` and `npx eslint` after every change; `git worktree` for a second copy of the old code (with `node_modules` linked by a Windows
  junction; remove the junction with `rmdir` before deleting the worktree).
- The Claude Browser pane for the first looks; background tasks + Monitor for the long builds and compares.
**Planned in `brain/12` but NOT run** (say so, do not claim them): the skills `audit-suite:*`, `vercel-react-best-practices`,
`parallax-threejs:ship-check` / `memcheck`, `searchfit-seo:*`, and the community plugins "Web Vitals Auditor" / "Perf Profiler" (offered, install not confirmed).
**Not measured yet:** Lighthouse / Core Web Vitals (LCP, CLS, INP), real-network timing, the "1000 ms" goal, interaction states (clicks, forms, popups),
mobile. First-screen time is therefore *expected* to improve, not proven.

## 3. The method (use this order on any Next.js project)
1. **Measure.** `npm run build` then `node tools/build-weight.mjs` (JS/CSS per page, first load). Optional: `ANALYZE_STATS=1 npm run build` then
   `node tools/chunk-report.mjs /page` to see what is inside the chunks. `node tools/perf-audit.mjs` gives a static scan (CSS size, client components, images, rAF loops).
2. **Find what every page ships.** Key finding on this project: Next sends to a page the JS of **every client file its server code can reach**, even if the
   page never shows it, and even through `next/dynamic` inside a server file (that changes nothing). So registries (section lists, page maps) made every page
   ship every section. Check with `node tools/client-graph.mjs` (big client files and who imports them: `[s]` = server importer = problem).
3. **Lazy client components** (`tools/lazy-codemod.mjs plan|apply`): heavy client components are imported by server files only through
   `src/components/site/lazy.tsx` (a `"use client"` file that wraps them in `next/dynamic`). Each becomes its own chunk, loaded only on pages that render it;
   it is still server-rendered, so HTML and SEO stay the same. Libraries (three, p5, gsap) are `await import()`-ed inside effects.
4. **Split CSS** (`tools/css-split.mjs plan|check|apply`, config `tools/css-split.config.mjs`): page-only class families move out of `src/app/globals.css` into
   `src/styles/<name>.css`. Two kinds: `routes:` (the page.tsx imports it) and `files:` (the component files that use the classes import it, so it loads
   exactly where they render). A rule moves only if every selector of it needs a class of that bundle; mixed rules go to the later bundle; bundle order = original
   file order (cascade). `check` proves no rule is lost. `css-usage.mjs <url>` shows which class families are on which page (crawl of the sitemap).
5. **Defer what the first screen does not need**: smooth scroll library (Lenis) after idle, cursor + colour picker + pause-offscreen through `late-extras.tsx`,
   the big menu (with the AI chat) when the pointer/touch/focus reaches the menu. Anything that changes page width or layout at load (custom scrollbar) is NOT deferred.
6. **Cheap wins**: long cache headers for `/images`, `/brand`, `/data` in `next.config.ts`; unused font weight dropped (Poppins 300).
7. **Prove it looks the same** (`tools/style-diff.mjs diff <old-url> <new-url>`): both builds run with `next start`, a headless Chrome (1440×900) loads every
   page, freezes animations, switches off `setInterval`, waits until the DOM stops growing, hovers the nav (loads the menu), and compares hashes of ~50 computed
   styles for every element. Do not compare dev servers (compile timing makes noise) and do not trust a first run: look at differences one by one with
   `style-diff.mjs inspect <url> <path> <elementIndex>`.
8. **Write it down**: numbers in `brain/11`, files/pages in section 5 below.

## 4. Checklist for a NEW page or section (fast from day one)
- Page-only CSS: create `src/styles/<page>.css` with a **new unique class prefix**; import it from the page's `page.tsx` (whole-page design) or from the component
  files that use it. Do **not** append page CSS to `globals.css`. Add the family to `tools/css-split.config.mjs` if you let the tool move it.
- A client component bigger than ~10 KB source that a server file uses: import it only via `src/components/site/lazy.tsx` (run `node tools/lazy-codemod.mjs apply`).
  Never `import` it statically in a server section or page.
- Heavy libraries (three.js, p5, gsap, charts, maps): `await import("lib")` inside `useEffect`, only when the section is near the screen.
- Nothing new in `src/app/(site)/layout.tsx` unless every page needs it for the first paint; otherwise put it in `late-extras.tsx` or load it on first use.
- Images: `next/image` or a sized `.webp` with `width`/`height`, `loading="lazy"` below the fold, no giant files in `public/` (`perf-audit` lists files > 100 KB).
- Animations: every `requestAnimationFrame` loop and infinite CSS animation must pause off-screen; avoid stacking many `backdrop-filter`/`blur` layers.
- Fonts: only the weights you use. Keep desktop-only, Poppins, theme variables (see `brain/02`).
- Before the owner merges: `npx tsc --noEmit`, `npx eslint <folders>`, `npm run build`, `node tools/build-weight.mjs`, and `style-diff diff` against the old build for the pages you touched.
- Add a row to section 5 of this file and the numbers to `brain/11`.

## 5. Ledger — what was changed and where (all inside commit `8108cdc` "optimize" on top of `0465e20`; now in `main`)
### 5.1 Site-wide
| What | File(s) | Effect |
|---|---|---|
| Long cache for static files | `next.config.ts` (`/images`, `/brand`, `/data`: 1 day + 7 days stale-while-revalidate) | repeat visits |
| Poppins weight 300 removed (not used anywhere) | `src/app/layout.tsx` | 1 font file less |
| Lenis loaded at idle | `src/components/site/smooth-scroll.tsx` | smaller first load |
| Big menu + AI chat fetched when the menu is approached | `floating-nav.tsx` (mega-menu is a separate chunk, mounted closed) | smaller first load |
| Cursor, colour picker, pause-offscreen at idle | new `late-extras.tsx`, used in `src/app/(site)/layout.tsx` | smaller first load |
| Lazy client components | new `lazy.tsx` (43 components, generated by `tools/lazy-codemod.mjs`) | pages only download the sections they show |
| Two oversized footer/header pictures re-encoded at ~4× their shown size (visually the same: mean pixel difference 1.6 % at 2× screens): `public/images/make-in-india.webp` 1314×576 → 400×175 (108 → 26 KB), `public/brand/logo-text-white.webp` 700×277 → 350×138 (13 → 6 KB) | `public/` | −90 KB image bytes on EVERY page (measured: `/` images 159 → 69 KB on the wire) |
| Dead CSS removed (families `gl`, `rg`, `dg`, `pulse` + their keyframes: used by no page, no component) | `src/app/globals.css` | −14 KB raw |
| `/graphics`: p5 + p5.brush (~350 KB) are downloaded when the painted town is within ~900 px of the screen (IntersectionObserver) | `graphics/brush-town.tsx` | `/graphics` first load JS 569 → 222 KB on the wire; the town draws when you scroll to it (checked in a real Chrome: 0 canvases at load, 2 after scrolling, same end result) |
| `npm run dev` works again (`turbopack: {}`) | `next.config.ts` | dev only |
| Module stats hook + second build folder | `next.config.ts` (`ANALYZE_STATS`, `NEXT_DIST_DIR`) | measuring only |
| Dev port 1010 | `package.json`, `.claude/launch.json` | n/a |

(The three rows above together lowered the average first-load JS from 219 to 205 KB gzip; they were not measured one by one.)

### 5.2 Lazy client components (component → server files that now import it through `lazy.tsx`)
`sections/hero.tsx`→HeroScene · `sections/highlights.tsx`→GlanceOrbit · `sections/industries.tsx`→IndustriesCity, IndustriesRoad · `sections/tags.tsx`→TechSpace, ToolsVariant ·
`sections/services.tsx`→ServiceStrip, ServiceStage · `sections/about-world.tsx`→AboutWorld · `sections/about-chapters.tsx`→AboutChapters · `sections/advantages.tsx`→WhyVariant ·
`sections/process.tsx`→ProcessVariant · `sections/blogs.tsx`→BlogMasonry · `sections/contact.tsx`→ContactFlow · `sections/page-hero.tsx`→ContactReception ·
`sections/career.tsx`→ContactFlow, CareerRailway, CareerJourney · `career/job-page.tsx`→JobApply · `sections/guide.tsx`→AiBuddy, FigmaStudio, GuideScene, OfficeBuilder ·
`sections/sketch-canvas.tsx`→SketchCanvas · `sections/team-office.tsx`→TeamOffice · `sections/vr-floor.tsx`→VrFloor · `sections/vr-process.tsx`→VrProcess ·
`sections/vr-space.tsx`→VrSpace · `sections/index.tsx`→Automate, Faq, BrandBoard, Timeline · `tech/index.tsx`→the 12 tech page designs.
Which page uses which section: `src/lib/cms/content/<page>.ts` (and `brain/04-pages-and-sections.md`).

### 5.3 CSS moved out of `globals.css` (1160 KB → 535 KB raw; 24 files in `src/styles/`)
Whole-page bundles (imported by the page's `page.tsx`; the draft preview `preview/[slug]/page.tsx` imports all):
| Page (route) | Bundle |
|---|---|
| `/graphics` | `graphics.css` |
| `/brand-development-services` | `brand-dev.css` |
| `/zero-to-n-brand-development` | `end-to-end.css` |
| `/seo`, `/meta-marketing-services`, `/physical-marketing-services` | `seo-marketing.css` (shared by the three) |
| `/physical-marketing-services` | `physical-marketing.css` |
| `/meta-marketing-services` | `meta-marketing.css` |
| `/headless-CMS-devlopment-services` | `headless-cms.css` |
| `/custom-wordpress-devlopment-services` | `wordpress.css` |
| `/shopify-development-services` | `shopify.css` |
| `/custom-woocommerce-devlopment` | `woocommerce.css` |
| `/shopify-app-development-services` | `shopify-app.css` |
| `/wordpress-plugin-development-company` | `wp-plugin.css` |
Component-level bundles (imported by the component files, so they load wherever those render; page = where the crawl saw the classes):
| Bundle | Imported by (components) | Seen on page |
|---|---|---|
| `home-hero.css` | `hero-scene.tsx`, `home-street.tsx` | `/` |
| `brand-identity.css` | `sections/brand-board.tsx`, `sections/sketch-canvas.tsx`, `sketch-canvas.tsx`, `sections/arch-gallery.tsx` | `/brand-identity` |
| `ai.css` | `sections/flow.tsx`, `ai-buddy.tsx`, `sections/automate.tsx` | `/ai` |
| `careers.css` | `career/*` (destination, form-controls, job-apply, journey, location-picker, railway), `sections/career.tsx`, `figma-studio.tsx` | `/careers`, `/ui-ux-design` |
| `office.css` | `office-art.tsx`, `office-builder.tsx`, `office-site.tsx`, `guide-kit.tsx`, `guide-scene.tsx`, `guide-scenes.tsx` | `/webdev` |
| `metaverse.css` | `metaverse/vr-floor`, `vr-gov`, `vr-process`, `vr-devices`, `vr-quiz` | `/metaverse` |
| `about.css` | `about/about-chapters.tsx` | `/about` |
| `team.css` | `modern/team-office.tsx`, `glance-min.tsx` | `/team` |
| `contact.css` | `contact-reception.tsx`, `reception-avatar.tsx` | `/contact` |
| `blog.css` | `modern/blog-masonry.tsx` | `/blog` |
| `animation.css` | `after-effects.tsx` | `/animation` |
| `ui-ux.css` | `figma-studio.tsx` | `/ui-ux-design` |
Round 3 (added 2026-10-16, imported by the component files; `globals.css` 508 → 290 KB raw): `mega-menu.css` (mega-menu.tsx), `panda-chat.css` (importers of ai-chat: about-chapters, hero-scene, mega-menu, tech/ask-ai, sections/guide; **ai-chat.tsx itself was not touched**, it belongs to Jenish), `theme-picker.css`,
`admin.css` (admin login + blog form/preview), `process-floor.css`, `seo-lab.css`, `reasons-stack.css`, and the "modern" section variants `modern-tools.css`, `modern-process.css`, `modern-service.css`, `modern-faq.css`, `modern-why.css`, `modern-related.css`, `modern-base.css`;
families added to existing bundles: `vs` → metaverse, `aw` → about, `jb` → careers, `kit` → brand-identity.
Left in `globals.css` on purpose: shared families (`vt vp vz vf vw md ch cf …`), locked sections (`ss` service strip, `tx` TechSpace pop-up, `cm` Industries city), Home-only `lnc`/`go`, mega menu `mm`.

### 5.4 Page-by-page summary
CSS bundles are exact (5.3). "Lazy" lists only the components that belong to that page's own sections (5.2); other sections of a page are lazy too.
Check a page's sections in `src/lib/cms/content/<page>.ts`.
| Page | What applies |
|---|---|
| `/` Home | `home-hero.css`; lazy HeroScene, GlanceOrbit; layout deferrals |
| `/about` | `about.css`; lazy AboutWorld, AboutChapters; layout deferrals |
| `/ai` | `ai.css`; lazy Automate, AiBuddy |
| `/webdev` | `office.css`; lazy OfficeBuilder, GuideScene |
| `/ui-ux-design` | `ui-ux.css`, `careers.css` (figma-studio uses both); lazy FigmaStudio |
| `/brand-identity` | `brand-identity.css`; lazy BrandBoard, SketchCanvas |
| `/team` | `team.css`; lazy TeamOffice |
| `/contact` | `contact.css`; lazy ContactReception, ContactFlow |
| `/careers`, `/careers/[slug]` | `careers.css`; lazy CareerRailway, CareerJourney, ContactFlow, JobApply |
| `/blog` | `blog.css`; lazy BlogMasonry |
| `/metaverse` | `metaverse.css`; lazy VrFloor, VrProcess, VrSpace |
| `/animation` | `animation.css` |
| The 12 tech/marketing/brand pages (5.3 table) | their route bundle + only their own lazy design component |
| All other pages (`/portfolio`, `/products/*`, `/crm`, `/mobile`, `/3d-modeling`, `/software-development-services`, `/brand-kit-design`, `/brand-video-production`, `/shopify-plugin-development-services`, `/sitemap`, blog posts) | the site-wide items (5.1) and the smaller `globals.css` |

## 6. Gotchas learned (save yourself the hours)
- `next/dynamic` inside a **server** file does not split anything (all reachable client files still ship). Put the `dynamic()` in a `"use client"` file (`lazy.tsx`).
- `webpack()` in `next.config.ts` makes `next dev` (Turbopack) stop with "build is using Turbopack, with a webpack config and no turbopack config". Workaround:
  `npx next dev --webpack -p 1010`. Proper fix (needs the owner's OK, 1 line): add `turbopack: {},` above `webpack(...)` in `next.config.ts`.
- In a git worktree Turbopack cannot follow a `node_modules` junction: use `next dev --webpack` or `next start`.
- Git Bash turns `/path` arguments into `C:/Program Files/Git/path`: run tools with `MSYS_NO_PATHCONV=1`.
- Files in this repo have CRLF endings in the working tree: scripts that edit them must keep CRLF. Template strings in patch scripts eat backslashes: write patches as files.
- Production minification writes the same value differently in different CSS files (`0.16`/`.16`, `0% 0%`/`0px 0px`, reversed gradients): `style-diff` normalizes the common ones; always check a remaining difference with `inspect` before calling it a bug.
- Compare production builds, not dev servers; stub `setInterval`; some demos (plugin page, rotating word, walkers) are timing-driven and unstable even on the old code.
- A stylesheet that is moved later in the cascade can lose ties it used to win: that is why bundle order follows the original file order.

## 7. Phases and approval status (ask the owner before starting any "waiting" phase)
| Phase | What | Status |
|---|---|---|
| A | Measure (build, `build-weight`) | done |
| B1 | Route CSS bundles + lazy client components | done |
| B2 | Late extras, lazy menu, Lenis at idle, component CSS bundles | done |
| fix | `turbopack: {}` in `next.config.ts` so `npm run dev` works again | done (round 3) |
| B3 | Below-the-fold sections load when they come near the screen | **not done on purpose**: measured desktop first paint is already 0.2–0.9 s and slow-4G is limited by bytes; B3 only reorders downloads and changes the HTML (layout-jump risk). Only done for `/graphics` p5. Ask the owner if he still wants it |
| B4 | Remaining CSS: modern variants, menu, chat, theme picker, admin | done (round 3). Still in `globals.css` on purpose: locked `ss tx cm`, shared chrome, `cf`, Home-only `lnc`/`go` |
| B5 | Footer, background, logo, launcher code after first paint | not done: they are small (< 10 KB gz together) and part of the first screen; no measurable gain |
| C | Images (blog cards are ~120 KB each; resizing could soften them: the owner dislikes soft images), Brotli/gzip check on Hostinger | **waiting for approval**. Note: `next/font/google` already self-hosts Poppins at build time, so there is no runtime request to Google |
| D | Smoothness (Home/Metaverse main-thread time) | diagnosed in round 4 (section 10), **not changed**: the cause is inside the owner's locked hero scene, see 10 |
| E | `tools/perf-budget.mjs` + `tools/perf-budget.json` (ratchet: JS ≤ 244, CSS ≤ 108 KB gz, lower it when the numbers improve) and `tools/perf-run.mjs` (real FCP/LCP/CLS in headless Chrome) | done (round 3). Real Lighthouse is still not run |

## 8. Using this in another project / chat
Paste at the start of the chat: "Read `brain/15-optimization-handbook.md` in the We3vision repo and follow its method: work on branch `optimize`, ask me before each phase,
measure with the tools, keep the look identical, and log every change in section 5." Copy `tools/css-*.mjs`, `lazy-codemod.mjs`, `build-weight.mjs`,
`style-diff.mjs`, `client-graph.mjs` to the other project (they only need Node 22+; adjust the paths in the config files).

## 9. Real loading numbers (headless Chrome, `next start`, cache off, median of 3, this PC — compare only with numbers from the same PC)
`node tools/perf-run.mjs http://localhost:<port> [/paths] --profile=desktop|4g|slow4g`
| Page | desktop LCP before → after | slow-4G (1.6 Mbit/s, 150 ms, CPU 4× slower) first paint before → after |
|---|---|---|
| `/` | 612 → 776 ms (noise) | 2408 → 1872 ms |
| `/blog` | 356 → 204 ms | 2112 → 1576 ms (LCP is the 389 KB blog image: 2112 → 2412) |
| `/webdev` | 476 → 520 ms | 2920 → 2500 ms |
| `/graphics` | 544 → 280 ms | 2628 → 1968 ms |
| `/metaverse` | 824 → 944 ms | 2212 → 1512 ms |
Reading: on desktop/broadband every page paints in under ~1 s (the owner's 1000 ms goal is met there). On slow 4G first paint is ~1.5–2.5 s: that is **not** 1000 ms.
What still limits it: ~100 KB of render-blocking CSS, 200–260 KB of JS, big images (blog 389 KB), and main-thread time (Home blocking time ~1.1 s, `/metaverse` ~2 s: three.js/particles). Run-to-run noise is ±15 %.
Look check of round 3 (old build vs new build, 40 pages): 30 identical; the rest are one `<script>` tag moved in 6 pages, minifier writing a gradient differently (`rs-view`), the rotating word on `/brand-identity` (timing), and `/graphics` where the two canvases are created only after scrolling (by design).

## 10. Round 4 findings (2026-10-16): Lighthouse, Hostinger, CPU, images
- **Lighthouse** (Chrome DevTools MCP, `next start` build): `/blog` desktop 100 / 100 / 100 / 100 (accessibility, best practices, SEO, agentic browsing); `/contact` mobile 100 ×4, one note: CLS 0.051 (limit 0.05). `/` could not be audited: Lighthouse reports NO_FCP in that harness (a trace of the same page shows LCP 647 ms, TTFB 20 ms, CLS 0), so treat Home's Lighthouse score as unknown.
- **Hostinger** (live `https://we3vision.com`, read-only header check): HTML comes with `Content-Encoding: br` (Brotli) from Hostinger's CDN (`hcdn`). The live domain still serves the OLD site (title, no `/_next` files, 404 for `/images/...`), so JS/CSS/JSON compression of the new site could not be checked: after the first deploy run `curl -sI -H "Accept-Encoding: br, gzip" https://we3vision.com/<a /_next/static/...js file>` and look for `content-encoding`.
- **Home main-thread time** (trace + forced-reflow insight): forced reflow ~1.2 s in total at load: hero scene `hero-scene.tsx` ~0.8 s (reads `getBoundingClientRect()` in its animation loop while styles are dirty), a shared chunk with the section components ~0.7 s, industries road ~0.2 s; DOM 3 826 elements, style recalculation up to 390 ms. A CPU profile on `next dev` (`tools/cpu-profile.mjs`) shows the time is mostly native rendering ("(program)" 14 s of 21 s at 4× CPU), not JavaScript. **Not changed**: the loop belongs to the locked Home hero; a safe idea for a later round (needs the owner's go): read the track rectangle only when a scroll or resize happened.
- **Images**: `node tools/image-audit.mjs <url>` lists pictures larger than 2× their biggest shown size: 4 of 17 files, ~154 KB; two were fixed (above). Left alone on purpose: `logo-horizontal-dark.webp` (also used as a texture on the 3D wall of `/metaverse`), `logo-white.webp` (also in the locked TechSpace pop-up and the phone launcher), blog pictures 1672×941 shown at 728 px (fine for 2× screens).
- **Look check** (previous build vs new build, 40 pages): 39 identical; `/wordpress-plugin-development-company` differs in one element of its self-playing demo (it is unstable even on the old code).
- **Timing numbers of this round are not comparable**: the PC was busy (two servers and other work); slow-4G first paint jumped between 1.9 s and 7.5 s for the same page. Use the byte numbers (reliable), re-run `perf-run.mjs` on a quiet PC for times.
- **B3** (sections load when scrolled to) was **not** done beyond `/graphics`: it does not remove bytes, only moves them, changes the first HTML and can cause layout jumps; the measured desktop first paint is already 0.2–0.9 s.

## 11. Phone and tablet app (2026-10-17) — measured, one change
The phone/tablet site is a separate app (`src/app/(m)`, `/m/**`, CSS only `(m)/mobile.css`; see brain/11-mobile-architecture.md). The proxy gives it to phones/tablets for the normal addresses.
**Tools now know phones/tablets**: `--device=phone|tablet` in `perf-run.mjs`, `cpu-profile.mjs`, `image-audit.mjs`, `style-diff.mjs`; new `trace-summary.mjs` (main-thread time by kind of work + who invalidates layout) and `smooth-run.mjs` (frames per second while scrolling / swiping). Phone = 390×844 @3x, tablet = 820×1180 @2x, touch, iPhone/iPad user agent.
**Weight is already at the floor**: every `/m/<page>` loads ~161 KB JS + ~21 KB CSS (gzip), the launcher `/m` 169 KB JS + 13 KB CSS; React + Next are ~130 KB of that, the whole launcher code is ~8 KB gzip. There is nothing big to cut.
**Loading (headless Chrome, `next start`, cold, median of 3; PC noise ±15 %)**
| Page | phone, normal 4G (9 Mbit/s, 170 ms, CPU 2× slower): FCP / LCP | phone, slow 4G (1.6 Mbit/s, 150 ms, CPU 4× slower): FCP / LCP |
|---|---|---|
| inner pages (about, contact, careers, webdev, seo, portfolio) | 0.5–0.65 s / 0.88–0.98 s | 0.7–1.3 s / 1.0–1.9 s |
| `/m/blog` | 0.53 s / 1.28 s (two 115 KB pictures) | 0.73 s / 2.7 s |
| launcher `/` (home screen) | 1.3 s / 1.3 s | 2.7–3.0 s / 2.8–3.0 s |
Tablet is the same (launcher 1.24 s on 4G, 2.7 s on slow 4G). So the "about 1000 ms" goal is met on a normal 4G phone/tablet for the inner pages and nearly for the launcher; on the harsh slow-4G + 4×-slower-CPU profile only the inner pages stay near 1–2 s.
**Why the launcher is the slow one**: it draws its icons with JavaScript after the page arrived (the HTML is only the wallpaper), and its glass look is expensive to paint: trace at 4× CPU: paint ~2.3 s, script ~2.6 s, layout ~1.0 s, 9 long tasks (3.2 s blocking). The headless browser draws with the CPU, a real phone GPU is much faster, so read it as a comparison.
**Change made (invisible)**: `components/site/mobile/launcher.tsx` builds the content of the home screens and the App Library in steps (`fill`): the first paint only builds the screen in view, the neighbours follow after 250 ms and the rest after 900 ms (always everything while editing/dragging). Result: first paint 3.0–3.3 s → 2.7 s, longest blocking task 1.6 s → 1.0 s, script time −40 %, paint −45 % in the first seconds. The computed styles of `/`, `/about`, `/webdev` on the phone are identical before/after (`style-diff --device=phone`).
**Smoothness (fps while scrolling, 4× slower CPU, software drawing)**: inner pages 49–60 fps (p95 frame 17–33 ms, a few frames over 50 ms), launcher swipe 13–34 fps in both builds (noise bigger than any change; worst frames ~1 s on the first swipe because the next screen has to be drawn once). A real phone was not available: judge the launcher swipe on a real device.
**Images on phones**: only 11 pictures; the blog pictures are 1672×941 shown at 350×233 (needs ~1050 px at 3×), 115 KB each: a 1100-px copy would save ~55 KB each, but the pictures come from the admin panel (any address, `unoptimized` on purpose), so it needs the owner's decision (use Next's image optimizer on Hostinger, or upload smaller pictures in the admin).
**Not done / ideas (ask the owner)**: server-render the first home screen so icons appear with the HTML (big gain on the launcher, but the layout maths is in JavaScript: needs a design-safe plan); fewer `backdrop-filter` layers on the launcher (23 rules) if a real phone drops frames; resize blog pictures (above).

## 12. Round 5 (2026-10-31): "khatanakh" round, Phase 0-2 (branch `optimize`, not in main)
**Baseline (Phase 0)**, average of 41 pages, gzip: JS 283 KB, CSS 72 KB. The JS had grown since round 4 because new code was added after it.
**Three real regressions found and fixed (all invisible):**
1. `lib/site-menu.ts` (imported by client components) imported `lib/cms/pages.ts` (~369 KB source = all page texts) only for `unlistedPages()`. That data shipped to every visitor. Moved the function to the server-only `lib/site-menu-pages.ts` (sitemap pages use it). RULE: a file that client components import must never import `lib/cms/*`.
2. `components/site/lazy.tsx` was out of date (new sections added by others were imported straight into server files). Refreshed with `node tools/lazy-codemod.mjs apply 10` + `apply 7`; the codemod now keeps existing entries. Also `CursorGrid` (page-hero) made lazy.
3. `cobe` (globe library) is imported with `import("cobe")` only when a globe is on the page (`components/site/globe.tsx`).
**Result (same method)**: JS 283 -> **190 KB gz**, CSS 72 -> **62 KB gz** on average. Laptop look compare (`style-diff`, 40 pages): 32 identical, the other 8 not visual. Phone compare: styles same.
**Console message seen on phone pages in the style-diff harness** (`appendChild ... Invalid regular expression: /|$)/`): the OLD build prints it too, and a plain headless load does not show it, so it is not from this round (harness/injected-script related). Not fixed.
**New tools**: `tools/pointer-run.mjs` (busy %, frame time and long frames while a synthetic mouse moves; `--cpu --ablate="name=css selector"` hides a layer to find what the pointer makes expensive), `tools/layers-audit.mjs` (lists the costliest fixed/blur/backdrop/animated layers), `tools/cpu-profile.mjs --mouse`, `NO_MINIFY=1` build switch in `next.config.ts` (readable profile).
**Pointer finding**: the JS pointer handlers are already rAF/passive and cheap; the cost is painting/compositing full-screen animated layers (star canvas, sphere canvas, aurora, backdrop-filter). The test PC draws in software, so only compare before/after on the same PC.
**Not done yet (next, one by one, ask the owner before each)**: Phase 1 pause hidden decorative animation (first-visit picker covers the page), Phase 2 gsap -> native (brand page only), Phase 3 Home hero forced reflow + off-screen loops, Phase 4 images/fonts/cache headers, Phase 5 static client -> server components, Phase 6 admin own CSS bundle + lazy editors, Phase 7 `npm run speed:check` + lower the budget in `perf-budget.json`.
