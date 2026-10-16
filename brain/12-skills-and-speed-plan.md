# 12 — Skills playbook + "load only what is on screen" speed plan (2026-10-16)

Owner's goal: the site runs smooth on every network; a visitor downloads **only the code the visible screen needs** (target: first screen
usable in about **1000 ms**), and the code of a page/section/popup is fetched **only when the visitor clicks or scrolls to it**.
Approved by the owner: pixel-identical changes in shared code, also Home (see [11](11-optimization.md)). The plan below keeps that rule:
**same look, less download.**

## Skills to use (already installed on the owner's Claude; nothing to install)
| Job | Skill / tool |
|---|---|
| Find what is slow (code audit) | `audit-suite:audit-as-perf-eng`, `audit-as-frontend-eng`, `full-audit`, `audit-as-prod-readiness` |
| Next.js / React speed rules | `audit-suite:vercel-react-best-practices` (server vs client components, dynamic import, waterfalls, bundle size) |
| Lighthouse, Core Web Vitals | `parallax-threejs:ship-check` (+ community plugins "Web Vitals Auditor" / "Perf Profiler" if the owner installs them) |
| 3D / canvas cost and leaks | `parallax-threejs:memcheck`, `checkpoint`, `diff`, agent `visual-debugger`, `anthropic-skills:threejs-core-concepts` |
| Animation jank | `audit-suite:web-animation-design`, `make-interfaces-feel-better`, `emil-design-engineering` |
| SEO must not drop | `searchfit-seo:technical-seo`, `seo-audit`, `schema-markup`; `node tools/seo-audit.mjs` |
| Accessibility must not drop | `audit-suite:audit-as-a11y-eng` |
| Review every change | built-in `code-review`, `simplify`; `engineering:code-review`, `testing-strategy`, `deploy-checklist` |
| Look the same after a change | `tools/style-diff.mjs record|compare` (computed-style hashes of every element), `parallax-threejs:qa-visual-test-harness` |
| Own measuring tools | `npm run perf:audit`, `tools/css-usage.mjs`, `tools/css-split.mjs` |
Use the matching skill at the start of each phase and write the result as a row in the scoreboard of [11](11-optimization.md).

## Budget (what "fast" means here; checked after every task)
- First screen (above the fold) on a normal 4G phone/laptop connection: HTML + CSS + JS needed to show and use it **≤ ~150 KB gzip JS, ≤ ~60 KB gzip CSS**, LCP **≤ 1.0–1.5 s**, CLS **< 0.05**, INP **< 200 ms**. Slow 3G cannot reach 1 s for any 3D page: for those the first screen must still show text and the layout at once, while 3D loads after.
- Nothing is "assumed": numbers come from `npm run build` + Lighthouse (needs the owner's OK to run one production build, not committed or deployed).

## The plan (order = biggest win first, each phase is a numbered task that can be reverted)
**A. Measure (no code change).** One production build for the real per-route JS/CSS sizes, Lighthouse (desktop + throttled 4G) on 8 key pages, `perf:audit --live`. Result: the true starting numbers.

**B. Load only what the screen needs**
1. *Route CSS* (started): the 292 KB of CSS of 13 page-only designs now lives in `src/styles/*.css`, loaded only by its page. Continue with the section-based families (metaverse, webdev, careers, contact, team, ai…) and the Home-only ones (`lnc`, `hub`) ≈ another 300+ KB. Every step proven by `style-diff`.
2. *Below-the-fold sections load when they come near the screen*: a small `LazyOnView` wrapper (IntersectionObserver + `next/dynamic`) around heavy sections (3D scenes, big SVG art, chat, maps, galleries). The text/heading renders on the server at once; the heavy client code downloads when the visitor scrolls within about one screen of it. Pages keep the same look; the first screen stops paying for the sections below.
3. *Download on click*: PANDA chatbot, mega-menu panels, the colour-theme picker, TechSpace pop-up content, modals, the Careers apply form, the location picker and `cities.json` (already on demand) load their code only when opened (`import()` on first click/hover). Hovering a menu link prefetches that page's route (cheap), clicking opens it at once.
4. *Server components first*: move static markup and long copy (office-art, guide-scenes, railway SVGs: 40–50 KB each) out of `"use client"` files so it is not shipped as JS. 119 client components today.
5. *Layout on every page*: SmoothScroll (Lenis), CustomCursor, ThemeProvider, Background, FloatingNav are loaded for every route. Keep what is needed for first paint; load the cursor, smooth-scroll and extras after first paint/idle.
6. *Heavy libraries stay lazy*: three.js, p5, GSAP are already `await import()`; verify nothing re-imports them at top level; load them only after the section is near the screen.

**C. Network**
7. Static headers for `/images`, `/brand`, `/data` (done), long cache for build files (Next does), `Cache-Control` for ISR pages, preconnect/`dns-prefetch` for the only external origin (Google Fonts, or vendor Poppins with `next/font/local` → no external request at all; needs the .woff2 files).
8. Images: every `<img>` gets width/height + `sizes`; `next/image` where the source is ours; AVIF/WebP; first-screen image `priority`; others `lazy` (already).
9. Compression: confirm Hostinger serves Brotli/gzip for HTML, JS, CSS, JSON, SVG (check with `perf:audit --live` on the live domain).

**D. Smoothness (60 fps)**
10. Every `requestAnimationFrame`/infinite animation stops off-screen and on hidden tab (most already do; list the few that do not).
11. GPU: fewer stacked `backdrop-filter`/`blur` layers visible at once (95 + 123 rules today); `will-change` only while animating; `content-visibility: auto` for long below-the-fold sections (same look, less layout work).
12. 3D scenes: pause on leave, dispose geometry/textures (`memcheck`), lower pixel ratio on weak GPUs.

**E. Keep it fast**
13. A budget script (`tools/perf-budget.mjs`) that fails when CSS/JS/HTML size of a route goes over the budget; run before every release. Add the rule to [02](02-rules-and-preferences.md): "new page CSS goes into `src/styles/<page>.css` and is imported by that page only; heavy client code is lazy".

## What the owner gets
- The first screen shows much faster on mobile data and cheap laptops: less to download and less to run before it is usable.
- Pages the visitor never opens cost nothing; a button's code is fetched only when it is used.
- Smoother scroll and animation (fewer layers and loops running at once), less battery/heat.
- Better Google ranking signals (Core Web Vitals: LCP, CLS, INP) and lower bounce for visitors on slow networks.
- Less server/bandwidth use on Hostinger; changes are safe because every step is compared before/after (`style-diff`) and can be reverted by task number.

## What is NOT promised
- "Everything in 1000 ms on every network": true for the first screen on 4G/broadband after phases A–C; on very slow networks, and for the 3D scenes (Metaverse, About world, Home hero) the layout and text appear in ~1 s and the 3D follows after.
- No visual change is intended. If a step cannot be done without a visible change, it is skipped and listed for the owner.

## Status (update here)
- Done: asset cache headers, Poppins 300 dropped, `perf-audit`, CSS usage analysis, CSS split tool, 13 page bundles written (292 KB out of `globals.css`; checked that no rule was lost). **Not yet proven**: the before/after style compare on all pages was stopped half-way — rerun `node tools/style-diff.mjs compare http://localhost:3100` before this goes live.
- Next: owner chooses compare size; then phase A (needs OK for one production build).

## Status update (2026-10-16, later)
- Done: A (measured), B1 route CSS (13 bundles), B1 route JS (lazy.tsx). JS 394 → 219 KB gz, CSS 160 → 119 KB gz per page on average. Details and next steps: [11](11-optimization.md).
- RULE for new work: a heavy client component (> ~10 KB source) must be used from a server file ONLY through `src/components/site/lazy.tsx` (re-run `node tools/lazy-codemod.mjs apply`); never import it statically from a server section, or every page ships it again.
- Verify every speed change with: `npm run build` → `node tools/build-weight.mjs`, and `node tools/style-diff.mjs diff <old> <new>` (needs the old code built in a second worktree and both run with `next start`).
