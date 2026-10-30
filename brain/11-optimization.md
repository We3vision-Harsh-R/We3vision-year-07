# 11 — Optimization and advanced-level work (set up 2026-10-16)

Goal (owner, 2026-10-16): make the whole website **faster, lighter and smoother**, then take it to an "advanced level" — **without changing how any
page looks** unless the owner asks. This file is the plan, the scoreboard and the rules for that work. Read it together with
[02](02-rules-and-preferences.md) (locks) and [07](07-workflow-and-tools.md) (tools).

## Ground rules for optimization tasks
1. **Invisible by default.** Same pixels, same animation, same text before and after. If a change would alter the look, stop and ask once.
2. **Home `/` is locked.** Most big wins live in shared code (`globals.css`, `(site)/layout.tsx`, background, fonts), which Home also uses.
   A behind-the-scenes change that renders identically is *probably* fine, but the owner has not said so yet → see "Decisions" below. Until
   then: never edit `hero-scene.tsx`, `industries-road.tsx`, `tech-space.tsx`, `glance-orbit.tsx`, `sections/highlights.tsx`,
   `content/home.ts` or the Home route, and do not touch the locked sections (service strip, TechSpace pop-up, Industries 3D city).
3. **Measure first, change second, measure again.** Every task puts a before/after row in the scoreboard below. No number = not done.
4. Desktop/laptop only; no responsive code. Poppins; theme variables only (rules C/D in file 02).
5. One optimization = one numbered task (`node tools/tasks.mjs begin N "title"` … `end N`) so the owner can revert it by number.
6. No commit/push/production build unless the owner asks. A real bundle measurement needs `npm run build` → ask first (it is also the only
   way to see per-route JS sizes). Until then use the static audit and the dev server.
7. Do the work in the **main folder** (see rule 1 of [00](00-START-HERE.md)); this plan was written from a worktree where `node_modules`
   does not exist, so nothing here was built or run against the real app yet.

## Tools
```bash
node tools/perf-audit.mjs                            # static scan: CSS weight, client components, heavy libs, images, rAF loops, public files
node tools/perf-audit.mjs --live http://localhost:1010   # + fetch every sitemap page: status, TTFB, HTML size, script/img count
node tools/perf-audit.mjs --json > .task-log/perf-before.json   # save, then diff after the task
node tools/seo-audit.mjs http://localhost:1010       # existing: indexing health (must stay green after any change)
npm run typecheck ; npx eslint <changed folders>
```
Browser checks (Claude Browser pane at 1440×900, see [07](07-workflow-and-tools.md)): Performance trace, console errors, network waterfall
(`read_network_requests`), and the `parallax-threejs:ship-check` skill (Lighthouse + Core Web Vitals) when the Playwright/Chrome-devtools
tools are connected. Dev mode is slower than production: only compare dev with dev.

## Scoreboard (update after every task)
Baseline measured **2026-10-16** with `node tools/perf-audit.mjs` (static; main code at commit `0465e20`):

| Metric | Baseline | Target | Latest |
|---|---|---|---|
| `globals.css` | 1160 KB raw / 199 KB gzip, 34 841 lines, one file loaded on every page | per-route CSS, shared core < 250 KB raw | — |
| `backdrop-filter` / `filter: blur` rules | 95 / 123 | fewer on-screen at once | — |
| `@keyframes` / infinite animations / `will-change` | 330 / 271 / 30 | infinite ones paused off-screen | — |
| Client components (`"use client"`) | 119 of 331 files | only where state/effects are needed | — |
| `requestAnimationFrame` calls / resize listeners | 84 / 25 | every loop stops off-screen and on hidden tab | — |
| Raw `<img>` / `next/image` imports (9 `unoptimized`) | 12 / 9 | `next/image` or sized webp, width+height set | — |
| Lazy / dynamic imports | 7 (three, p5, gsap lazy; cobe static) | cobe lazy too | — |
| `public/` total | 1994 KB (1006 KB is `data/cities.json`) | cities.json loaded only on demand, smaller | — |
| PNG that could be webp | `brand/logo-stacked.png` (82 KB) | none | — |
| Lighthouse (desktop) perf / LCP / CLS / INP | not measured yet | measure on `/`, `/about`, `/seo`, `/metaverse`, `/portfolio` | — |
| Production JS per route (`npm run build`) | 449 KB gz JS + 120 KB gz CSS on nearly every page (2026-10-16) | JS ≤ 150, CSS ≤ 60 | — |

What is already good (do not "fix"): pages use `revalidate = 600` (ISR); admin/preview send `no-store`; `PauseOffscreen` pauses off-screen
guide animations; GSAP (brand-dev), p5 (brush-town) and the two three.js scenes (`about-world.tsx`, `vr-office.tsx`) are already
`await import()`-ed lazily; fonts use `next/font` with `display: swap`.

## Roadmap (ordered by value ÷ risk)
Phase 0 — **Measure** (no code change): run the audit with `--live`, take Lighthouse on 5 key pages, then (with the owner's OK) one
`npm run build` to record per-route JS. Fill the baseline rows marked "not measured".

Phase 1 — **Invisible wins** (each a numbered task):
1. **Static asset headers** in `next.config.ts`: long `Cache-Control` for `/images`, `/brand`, `/data`, fonts (no look change, Home unaffected).
2. **cities.json (1 MB)**: confirm it is fetched only by the Careers picker on interaction, not at page load; trim to the fields used.
3. **Images**: `logo-stacked.png` → webp; give every `<img>` width/height (kills layout shift); revisit the 9 `unoptimized` flags
   (task 88 set them for sharpness — keep the sharpness: use `quality`/`sizes`, not a blur).
4. **Fonts**: Poppins loads 5 weights from Google. Check which weights are used; drop the unused ones; optionally vendor with
   `next/font/local` (also fixes the "Arial fallback when Google is unreachable" noted in task 91). Needs the font files from the owner.
5. **Heavy libraries**: three, p5 and gsap are already lazy (checked 2026-10-16). `cobe` is a **static** import in `globe.tsx`
   (used by the Reach section, `sections/reach.tsx`, which pages include it? — Home may): load it lazily when the section nears the
   viewport; check Home impact first. Also check the three.js scenes dispose geometry/textures on unmount (`memcheck` skill).
6. **Animation loops**: every `requestAnimationFrame`/`setInterval`/CSS infinite animation stops when off-screen or the tab is hidden
   (extend the `PauseOffscreen` idea); `resize`/`scroll` listeners passive and throttled; remove duplicate Lenis/ScrollTrigger refreshes.
7. **GPU load**: list `backdrop-filter` and large `filter: blur` layers that are on screen together; replace stacked blurs with one shared
   layer or a pre-blurred image only where the result is visually identical.

Phase 2 — **Structural** (bigger, needs a visual regression pass and probably the Home decision below):
1. **Split `globals.css`** (1.16 MB, 199 KB gzip, render-blocking on every route including admin) into a small shared core + per-route files
   by class prefix (`gfx-`, `bdv-`, `e2e-`, `mkt-`/`sxo-`/`mta-`/`phy-`, `lnc-`, `cm-`, `tx-`…). Cascade order must be preserved; compare
   screenshots before/after on every page at 1440×900. Registry of prefixes: [05](05-design-system.md).
2. **Server vs client split**: move data and static markup out of `"use client"` files (e.g. long copy, SVG art such as
   `office-art.tsx`, `guide-scenes.tsx`, `railway.tsx` 51 KB) so they render on the server and ship less JS.
3. **Layout weight**: `(site)/layout.tsx` mounts SmoothScroll, CustomCursor, ThemeProvider, Background, FloatingNav, Footer and the
   mobile launcher on every page; measure their cost and defer the non-critical ones (after first paint / on idle).
4. **Data layer**: `getSiteSettings()` runs on every request of the layout → confirm it is cached (tags + `revalidateTag` from the admin
   publish action) so a published change appears at once and normal visits never hit the database.

Phase 3 — **Advanced level** (feature work: pick with the owner, nothing is started): Core Web Vitals monitoring (`useReportWebVitals` →
own endpoint), prefetch on hover for the mega menu, View Transitions between pages, structured-data coverage check, image placeholders
(blurDataURL) for portfolio, offline-friendly 404/500 pages, CSP header, accessibility pass (focus rings, reduced-motion everywhere),
an automated visual-regression + perf budget script in `tools/` that fails when a metric above gets worse.

## Decisions waiting for the owner
- **May behind-the-scenes (pixel-identical) changes touch shared code that Home also uses** (CSS split, fonts, layout loading)? Phase 1
  items 1–3 and 6–7 can be scoped away from Home's files; items 4–5 (fonts, cobe) and Phase 2 reach Home. Until the owner says yes, those are not started.
- OK to run **one** `npm run build` for the baseline numbers (not deployed, not committed)?
- Can the owner supply the **Poppins `.woff2` files** (for `next/font/local`)?

## Log
- 2026-10-16 — setup: this file, `tools/perf-audit.mjs`, `npm run perf:audit`, baseline above. No site code changed.
- 2026-10-16 — owner approved pixel-identical changes in shared code (incl. Home). Phase 1 pass 1 (worktree, tsc + eslint clean, headers checked on a dev server):
  - `next.config.ts`: `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` for `/images`, `/brand`, `/data` (verified with curl).
  - `src/app/layout.tsx`: Poppins weight 300 dropped (no CSS or component uses it; one font file less). Needs a look in the browser on production.
  - Checked, **no change needed**: `cities.json` is already fetched only when someone types in the Careers location picker; all raw `<img>` are
    already webp + `loading="lazy"` (admin ones are admin-only); rAF loops are scroll-throttled one-shots or already pause off-screen (the
    continuous ones — hero, sphere, VR floor, globe, cursor-grid — use IntersectionObserver / stop when idle); `cobe` is ~5 KB and its
    loop already skips drawing off-screen, so lazy-loading it would risk Home for almost no gain.
  - Left alone on purpose: `public/brand/logo-stacked.png` is referenced by Home's structured data (`(site)/page.tsx`); converting would change a URL.
  - The real remaining weight is `globals.css` (Phase 2 item 1). Next step: measure which prefix blocks belong to which route, then split.
- 2026-10-16 — CSS split pass 1 (13 page-only designs → `src/styles/*.css`, 12 files after merging sxo+mkt): `globals.css` 1160 KB → 850 KB raw (199 → 148 KB gzip). Tools: `css-parse/analyze/usage/split`, `style-diff`.
  Proof: `node tools/style-diff.mjs diff <old-server> <new-server> /paths` (old code on one port, new on another; computed styles of every element, animations frozen, images loaded). 19 pages compared (all 12 changed pages + Home, About, Contact, Webdev, Metaverse, Careers, UI/UX, AI): the only real differences were CSS ORDER problems (a rule that needs two bundles, and the interleaved sxo/mkt/mta blocks) — both fixed (mixed selectors go to the later bundle; sxo+kwf+mkt+mta are one bundle `seo-marketing`; imports follow the original order). Left: the floating theme-picker button (`tp-fab`, JS-timed), Home (`go`, a block that is unstable even on the old code: 4455 vs 4403 elements) and Graphics (1360 vs 1362 elements on the old code too). Not compared: pages that were not in the 19 (Home-only blocks not moved yet).
  Rule for new CSS: a page-only design's CSS goes into its `src/styles/<bundle>.css`, not into globals.css. Re-running `node tools/css-split.mjs apply` after a merge moves anything that came back into globals.css.
- 2026-10-16 — PHASE A measured (one `npm run build`, webpack, not deployed; `node tools/build-weight.mjs` reads it): first-load weight per page.
  | | JS gzip | CSS gzip | Budget |
  |---|---|---|---|
  | almost every page | **449 KB** (same 16 files everywhere) | **120 KB** (+4–14 KB page bundle) | JS ≤ 150, CSS ≤ 60 |
  | `/`, `/about`, blogs | 371 KB | 120 KB | |
  Build facts: 63 static pages, all ISR 10 min; no build errors. The JS is the same on every page: one chunk of 508 KB raw / 149 KB gz, one of 279 KB / 78 KB, 236 KB / 65 KB, react-dom 62 KB, polyfills 39 KB (Next standard). So the whole client code of the site (layout extras + every section) is shipped to every visitor: this, not CSS, is the main cost. JS is ~3× over budget, CSS ~2×.
  Next (Phase B1/B2): see which modules are in the three big chunks (`npx next experimental-analyze` in the MAIN folder — Turbopack does not run from a worktree), then (a) `LazyOnView` + `next/dynamic` for below-the-fold sections, (b) load menu/chat/theme picker/cursor on first use or idle, (c) move static markup to server components. Re-run `build-weight` after each step and write the numbers here.
- 2026-10-16 — PHASE B1 done (route-level code splitting). Finding: Next ships to every page the JS of ALL client files its server code can reach (also through `next/dynamic` in a server file — that alone changed nothing). Fix = `src/components/site/lazy.tsx` ("use client", generated by `node tools/lazy-codemod.mjs apply`): 43 heavy client components are loaded with `next/dynamic` from a CLIENT file, so each is its own chunk and a page downloads only the ones it renders (still server-rendered: same HTML, same SEO). 28 server files now import from `lazy.tsx` instead of the component file.
  Result, same measuring method (`node tools/build-weight.mjs`, nomodule polyfills not counted), original code vs now, average of 41 pages: **JS 394 → 219 KB gzip (−44%)**, **CSS 160 → 119 KB gzip (−26%)**. Examples (JS / CSS gz): /blog 410/164 → 206/120, /seo 410/164 → 217/131, /webdev 410/164 → 256/120, Home 332/164 → 244/120.
  Proof: `node tools/style-diff.mjs diff <old prod server> <new prod server>` on all 41 pages: 32 identical, 0 console errors; the other 8 are not visual (7 pages: one `<script>` element fewer in <body>; About: one frozen-walker element). Both servers were `next start` builds (old code built in a temporary worktree).
  Still above budget (JS ≤ 150): the floor is ~206 KB = React + Next framework (~130 KB) + the layout that every page loads (menu, theme picker, cursor, Lenis, footer, ~76 KB). Next steps: (1) load cursor/theme picker/launcher/Lenis after first paint, (2) menu panels on first open, (3) Home-only and section-based CSS into bundles (−60 KB CSS more), (4) `loading=lazy` for below-the-fold sections via an IntersectionObserver wrapper, (5) maybe revise the budget to JS ≤ 180 (framework alone is 130).
  New tools: `build-weight.mjs`, `chunk-report.mjs` (needs `ANALYZE_STATS=1 npm run build`), `client-graph.mjs`, `lazy-codemod.mjs`, `style-diff.mjs diff`.
- 2026-10-16 — PHASE B2 (load later / only where used), measured the same way (`build-weight`, average of 41 pages): JS 219 → **205 KB gz**, CSS 119 → **105 KB gz** (from the original: JS 394 → 205 = −48%, CSS 160 → 105 = −34%). Examples now (JS/CSS gz): /blog 191/106, /contact 195/106, /seo 203/117, /about 208/106, Home 233/106, /webdev 241/106 (before B1: 410/164).
  What changed: (1) `smooth-scroll.tsx`: Lenis (the smooth-scroll library) is imported when the browser is idle after the first paint; (2) `floating-nav.tsx`: the big menu with the AI chat (`mega-menu.tsx`, 238 DOM elements) is a separate chunk, fetched when the visitor shows interest in the menu (mouse over the pill, touch, keyboard focus or an open call) and mounted closed; (3) new `late-extras.tsx`: custom cursor, colour picker and PauseOffscreen are imported at idle; used in `(site)/layout.tsx`; (4) 12 more CSS bundles imported by the COMPONENT files that use them (`files:` in `css-split.config.mjs`), so the CSS loads wherever those components render: office (webdev), careers, metaverse, brand-identity, contact, team, ai, animation, ui-ux, about, blog, home-hero: globals.css 850 → 535 KB (95 KB gzip before minify).
  Not changed on purpose: SiteScrollbar (hiding the native scrollbar late would shift the page width), MobileLauncher (phones), the locked-section CSS (ss, tx, cm), Home-only `lnc`/`go`.
  Merge note: `(site)/layout.tsx` is also edited by the task-95 work in the main folder (launcher moved out) — merge by hand: keep their change and replace `CustomCursor`, `PauseOffscreen`, `ThemeProvider` by `<LateExtras />`.
  Proof: `style-diff diff` B1 server vs B2 server (`NEXT_DIST_DIR=.next-b1 next start` serves the older build next to the new one). The diff tool now moves the pointer over the nav so that the menu is loaded in the new page before the snapshot.
  B2 compare result (B1 vs B2, 41 pages): 31 identical. The other 10 are not visual: 4 pages have one `<script>` element fewer/moved in <body>; /wordpress-plugin page and the Brand Identity rotating word (`rw`) are JS-timed demos that are unstable even on the old build; /webdev, /metaverse, /team differ only in how the minifier writes the same gradient (`linear-gradient(0deg,…)` vs reversed order, `rgba(0,0,0,0) 0px`), checked property by property.
- 2026-10-16 — ROUND 3 (branch `optimize`): 14 more CSS bundles (menu, PANDA chat, theme picker, admin, modern variants…): globals.css 508 → 290 KB raw; /graphics p5 loads when the town is near; `turbopack: {}` so npm run dev works; tools perf-run.mjs, perf-budget.mjs (+ perf-budget.json). Average first load: JS 201 → 199 KB gz, CSS 98 → 87 KB gz (baseline = the same build before round 3; the earlier "105" figure was measured on an older main). Real numbers and what still limits slow networks: brain/15 section 9.
- 2026-10-16 — ROUND 4: two oversized pictures resized (−90 KB images on every page), dead CSS removed (−14 KB raw), tools cpu-profile.mjs + image-audit.mjs, Lighthouse + Hostinger + CPU findings in brain/15 section 10. First-load JS/CSS average unchanged (JS ~200, CSS ~86 KB gz).
- 2026-10-17 — PHONE/TABLET round: measured the separate mobile app (floor-level weight: ~161 KB JS + ~21 KB CSS per page; inner pages LCP 0.9–1.0 s on 4G), launcher filled in steps (first paint −10–20 %), tools got --device=phone|tablet + trace-summary + smooth-run. Details: brain/15 section 11.
- 2026-10-31 — ROUND 5 phase 0-2 (branch optimize): site-menu no longer ships all page texts to every visitor, lazy.tsx refreshed, cobe + cursor-grid lazy. Average JS 283 -> 190 KB gz, CSS 72 -> 62 KB gz, look identical (style-diff). New tools pointer-run, layers-audit. Details: brain/15 section 12.
