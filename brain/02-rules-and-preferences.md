# 02 — Rules and preferences (set by the owner, with reasons)

These are standing instructions. They override defaults. When a rule and a task conflict, say so once and wait for a yes.

## A. How to communicate
- The owner writes **romanized Gujarati mixed with English** (Hinglish-style), often with annotated screenshots (red/blue/green marks =
  layout instructions). Reply in the **same simple Gujarati-English style**, short, concrete.
- Report faithfully: what changed, what was verified, what was *not* verified. If something failed, say so.
- Do not repeat the same question at the end of every reply (the owner said "me tane puchto nai" when this happened). Mention an open
  item at most once and only when relevant.
- Never print passwords/keys/`.env` values.

## B. Where and how to work
- **Main folder only**: `D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07` is the git repo, the folder
  the dev server serves and the folder the owner pushes to GitHub. Do not work in `.claude/worktrees/*` and copy files across: a stale
  copy overwrote newer commits once (see [07](07-workflow-and-tools.md) "The clobber incident"). If a tool forces a worktree, **merge**
  (3-way) instead of copying.
- **No commit / push / production build** unless asked. The owner runs git. (Line-ending warnings LF→CRLF are normal on Windows.)
- Never commit `.env*` (except `.env.example`).
- New big task = numbered with `tools/tasks.mjs`; the owner reverts a task by sending its number.

## C. Scope discipline
- **Only change what the new request names.** Finished/approved work stays exactly as it is ("pachal na task ne change nai kar, ene as
  it is reva de"). If a request seems to need an older change, find a way that keeps the old behaviour (new rule, remap input) and say
  what was touched.
- **Home page `/` is LOCKED (since 2026-10-11).** No change of any kind: not layout, colours, animation or text. Before a task check
  whether files/classes are used by Home. Shared code (footer, nav pill, mega menu, background/aurora, glow edge, glass cards,
  headings) also changes Home → scope such a change (page prop/slug check, a class Home does not have) or ask once. Never edit for
  another page's task: `hero-scene.tsx`, `industries-road.tsx`, `tech-space.tsx`, `glance-orbit.tsx`, `sections/highlights.tsx`,
  `src/lib/cms/content/home.ts`, the Home route.
- **Locked sections** (the owner said "perfect"): ask before editing:
  - "What we build" service strip: `src/components/site/service-strip.tsx`, `src/lib/cms/content/service-details.ts`, `.ss-*` CSS.
  - TechSpace **pop-up card**: `.tx-pop` and everything inside it in `src/components/site/tech-space.tsx` + `.tx-*` CSS (the blur around
    it was adjusted later at the owner's request). A `LOCKED` comment sits at the top of locked files.
  - Industries 3D city: `industries-city.tsx`, `city-scene.tsx`, `.cm-*` CSS.
  - When in doubt which sections are locked, ask once.
- Pages the owner rebuilt "step by step" (Metaverse, About world) are built **only** as instructed: do not add sections to
  `/metaverse` or bring back the human guide on `/about` unless asked.

## D. Design rules
- **Desktop/laptop only** (since 2026-10-11): no `@media (max-width…)`, phone/tablet rules or responsive effort. Do not remove or rewrite
  existing responsive code either. Test at 1280–1920 px wide (1440×900 default).
- **Readability**: paragraphs ≥ 16 px, chips/labels ≥ 14 px, good contrast and line height — also on every new section.
- **Font**: Poppins everywhere (`--font-poppins`, via `next/font` in `src/app/layout.tsx`), public site and admin. Code samples may be monospace.
- **Theme-relative colours**: never a hard-coded violet/pink hex or rgba in public-site CSS/TSX. Use Tailwind tokens (`violet`, `orchid`,
  `void`, `dusk`) or `hsl(calc(var(--th) + offset) calc(S% * var(--ts)) L%)` (underscores inside Tailwind arbitrary values). Canvas code
  uses `shiftRgb` + `liveTheme()` from `src/lib/theme.ts`. The admin panel is excluded from re-colouring.
- **Unique, polished, "not AI-looking"**: the owner rejected generic glow/gradient/card-grid looks several times ("bakvas", "looked AI
  generated", "bharchak = crowded"). Prefer flat, hairlines, one accent, real structure, purposeful motion. Thick strokes, designed
  details (e.g. 7 + W linked by a node). Do not clutter; do not add boxes/heavy shadows/more furniture to scenes.
- **No repeated designs**: each repeated section type (process, FAQ, why, related, tools, what-we-build, story) must look different on
  each of the 8 service pages and also not repeat anywhere on the site (see [06](06-service-page-variants.md)).
- **"Avatar"** = the owner's one character (the brand-board/automate guide, the rigged vector avatar in `avatar.tsx`). Reuse it when
  they say avatar; on some pages they asked to remove avatars (animation, UI/UX, SEO, CRM, 3D modeling guides).
- **Images**: never copy a commercial template's assets (the Framer templates used as references are rebuilt in own code/SVG). The
  paid image-generation tool is **not** to be used; art is drawn with SVG/CSS/code. Downloading files from the old site needs the owner's OK.
- Scroll behaviour the owner asked for on service pages: sections with several boxes are **pinned** and the scroll opens the boxes one
  by one, **compulsory (snaps)**, the heading stays on screen with them, after the last box the section moves up (task 67–69).
- Use **React Bits**-style effects (own builds) where they fit; **shadcn/ui** (ui.shadcn.com/docs/components) is the saved resource for
  *future* new components — check it first when a new UI element is requested, but do not add it on your own.

## E. Content rules
- Content comes from www.we3vision.com. Read the old page first (browser tool; the SPA does not work with plain fetch). Keep facts,
  services and contact details accurate; you may rewrite for trending SEO keywords. If a requested page is not on the old site, say
  so and write it fresh (still no invented numbers).
- Leader/team photos and client logos need the owner's approval/supply; initials/monograms are used until then.
- Real client photos for the Brand arch gallery go in `public/images/projects/` or come from admin Projects (group "brand").

## F. Technical conventions
- Every new frontend page must be registered in `src/lib/cms/pages.ts` so it appears in the admin; every new editable field goes in
  `src/lib/cms/sections.ts` (one definition drives admin form + sanitising + defaults).
- Server vs client: functions used by server section components must live in non-`"use client"` modules (e.g. `variant-table.ts`).
- Class prefixes must be unique; grep `globals.css` before inventing one (registry in [05](05-design-system.md)).
- Use `Write` with a script file for complex node/sed edits; shell here-docs with quotes break easily on Windows.
- Lint rule `react-hooks/refs` is on: never pass ref objects through props or read `ref.current` during render.
- Dev-only debug hooks exist (`window.__aw`, `window.__vr`, `window.__sceneSeek`, `window.__sphereSeek`); keep them dev-only.
