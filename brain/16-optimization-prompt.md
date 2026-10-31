# 16 — Prompt to optimize ANOTHER website (public site + admin panel) with the same method

Use: open the other project in Claude (Claude Code), paste the prompt below as the first message. It tells Claude to follow `brain/15-optimization-handbook.md`
of this project (We3vision) and to copy its measuring tools. Keep this project's folder on the PC (path below) or attach `brain/15-optimization-handbook.md` + the `tools/` folder.
Reference project on this PC: `D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07` (GitHub: `We3vision-Harsh-R/We3vision-year-07`, files `brain/15-optimization-handbook.md`, `tools/*.mjs`).

---

## PROMPT (copy everything between the lines)

```text
You are going to optimize this project's website AND its admin panel for speed on laptop, tablet and phone, the same way it was done for another project of mine
(the "reference project", We3vision). Do NOT change how anything looks or behaves: the design must stay exactly as it is. Work in small, measured steps.

REFERENCE (read first, it is the method + the tools):
- Folder on this PC: D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07
  (or GitHub We3vision-Harsh-R/We3vision-year-07). Read brain/15-optimization-handbook.md completely (sections 0-11) and look at the tools/ folder:
  perf-audit, css-analyze, css-parse, css-usage, css-split (+ config), lazy-codemod, client-graph, chunk-report, build-weight, perf-budget,
  perf-run (real FCP/LCP/CLS, --device=phone|tablet, --profile=4g|slow4g), trace-summary, cpu-profile, image-audit, smooth-run, style-diff.
- Copy the tools you need into this project's tools/ folder (they need Node 22+ and Chrome; adjust paths/config for this project). Do not copy site code.

RULES OF ENGAGEMENT (mine, they override your defaults):
1. Work on a git branch called `optimize` (use a git worktree or switch branch). Never push to main/production without my explicit "yes". Do not deploy.
2. ASK ME before each phase: say what the phase is, which pages/files it touches and the expected gain, then wait for my yes. Do not start the next phase on your own.
3. Same look, less download. Every change must be pixel-identical (prove it with style-diff between an old build and a new build, both run with `next start` or the
   production server of this stack). If a step cannot be identical, skip it and tell me.
4. Measure before and after every phase and write the numbers down. No number = not done. Be honest: say what you measured, what you did NOT measure
   (for example real phones, real Lighthouse, real network), and what stayed unchanged on purpose.
5. Do not touch parts I marked locked, and do not print secrets (.env). Ask me if unsure what is locked.
6. Answer me in simple romanized Gujarati-English, short. Report in this order: what changed, what was verified, what was NOT verified, what is next.

PHASES (do them in this order, ask me before each one):
0. Look and report (no code change): stack and hosting, the list of routes (public pages, admin pages, phone/tablet pages if there is a separate mobile app),
   current weights (build + build-weight), first-load JS/CSS per page, biggest client components (client-graph), biggest CSS, images, fonts, caching headers.
   Give me a baseline table (JS/CSS gzip per page, FCP/LCP/CLS on desktop, 4g and slow4g, for phone, tablet and desktop) and a short plan with expected gains.
A. Public website:
   - Page-only CSS out of the global stylesheet into per-page / per-component files (css-split), proven lossless (css-split check) and identical (style-diff).
   - Heavy client components imported by server files only through one "use client" lazy file with dynamic() (lazy-codemod), libraries (three, p5, gsap, charts, maps)
     imported inside effects only when the section is near the screen.
   - Things the first screen does not need (smooth-scroll library, custom cursor, theme picker, big menus, chat widgets) load after the first paint or on first use.
   - Oversized pictures re-encoded at ~3-4x their shown size (image-audit; never blur, check at 2x/3x), unused font weights dropped, long cache headers for static files,
     dead CSS removed, budget file (perf-budget) so nobody makes it heavier again.
B. Admin panel (it must be fast too and must never load the public site's code):
   - Own root layout / own CSS bundle: public-site CSS, animations, 3D, cursor, smooth-scroll, tracking etc. must not be loaded in /admin.
   - Split heavy admin parts (rich text / markdown editors, charts, image croppers, tables with many columns, code editors) with dynamic import, load them only
     on the screens that use them; keep the login page tiny.
   - Data: no request waterfalls, paginate big lists, cache what can be cached, keep `no-store` for private pages, check slow queries (N+1) and big payloads.
   - Measure it like the public site (build-weight per admin route, perf-run on the logged-in screens if possible; ask me for a test login if needed, never use a real one).
C. Phone and tablet (if the project has a separate mobile app or responsive pages): perf-run/trace-summary/smooth-run with --device=phone and --device=tablet,
   find what is heavy (script, layout, paint, backdrop-filter / blur layers, big images, long tasks), fix only what keeps the look identical, report fps while scrolling.
E. Look for these first (each one was a real, invisible win on a Next.js project; they are cheap to check):
   - A client file that imports a module which itself imports big server data (all page texts, menus, content files) ships that data to every visitor. Find them with
     a chunk report (which source files are inside the first-load chunks), move the small thing a client needs into its own small module, keep a re-export for the server.
   - A SERVER file that statically imports heavy client components ships them to every page that can reach that server file (a section/registry file used by all pages).
     Put such components behind a "use client" wrapper file with next/dynamic (still server-rendered, same HTML). If a generator/codemod does this, check name clashes by hand.
   - Libraries and WebGL/canvas that are created while the page loads although they are far below the screen: create them when they come near the viewport (keep the
     animation timeline so it looks the same).
   - Mouse smoothness: measure a mouse run AND an idle run of the same page (the difference is what the pointer costs); look at style-recalculation %, not only fps. A
     pointer handler that writes a CSS variable on a big root restyles the whole subtree on every move: register the property (@property, inherits: false) and write it only on
     the few moving layers. Also check that the variable really works (a global @property of the same name once made a whole "lean with the mouse" effect do nothing).
   - Layout shift after hydration: something that changes the page width late (hiding the native scroll bar with a class added by a client effect) moves everything
     sideways; put that class on <html> in the server HTML.
   - Do not trust one run: a software-rendered or busy PC varies by 2-3x between runs of the same build. Claim only deterministic numbers (bytes per page, number of layout reads,
     style-recalc %, CLS, requests) or A/B repeated 5+ times alternating; say clearly what could not be proven.
   - One command at the end: a speed-check script (budget of the biggest page AND the average, load numbers on laptop/tablet/phone, mouse run, optional look compare of an
     older server), added as an npm script, so the project "keeps running properly" after the optimization.
D. Finish: update this project's brain/docs with a copy of the handbook adapted to this project (method, what was used, ledger of what was changed on which page, numbers
   before/after, gotchas), commit on the `optimize` branch and push that branch only. Tell me the exact commands to merge when I decide.

DELIVERABLE FOR EACH PHASE: changed files, before/after numbers, proof that the look is identical, anything not done and why. Start with phase 0 now and wait for my yes.
```

---

## Notes for Harsh (Gujarati-English)
- Aa prompt bija project na Claude ma pehla message tarike paste karo. Claude pehla project jove (read-only), baseline table ane plan aapse, pachhi tamari "haa" par j phase karse.
- Bija project ma Next.js na hoy (bija framework ma hoy) to prompt ni method same che, pan tools ma thodu adjust karvu padse (Claude e kari dese ke kahe).
- Admin panel mate khas dhyan: admin ne public site no CSS/JS na jaay (alag root layout), ane bhaaru editor/chart sirf je screen ma joiye tyaj load thay. Prompt ma e lakhyu che.
- Last ma `npm run speed:check` jevo ek command banavi aapse (budget + load + mouse + look compare), jethi pachhi pan khabar pade ke site halki che ke nai.
- "Branch optimize ma j push" ane "main ma tamari haa vagar nahi" prompt ma che.
