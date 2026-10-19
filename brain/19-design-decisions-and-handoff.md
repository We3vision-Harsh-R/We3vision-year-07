# 19 — Design decisions + hand-off (2026-10-19) — READ THIS to continue the design work in a new chat

> Harsh (Gujarati-English): navi chat ma aa file vanchi ne seedhu aagal vadho. Ema lakhyu che ke **kai design nakki karyu, kai ban gayu, kai baki che** ane
> **kem karvu**. Bug list + test report: [18-website-test-master-table.md](18-website-test-master-table.md). Rules: [02](02-rules-and-preferences.md).
> State of the code: everything below is on `main` (last commit when this file was written: `34c5dfa` + this file). Tasks 96–109 in `TASKS.md`.

## 0. How to work (the loop that was used for tasks 96–109)

1. Read `brain/00-START-HERE.md`, `02`, this file and `18`.
2. **Rules changed on 2026-10-19:** the owner UNLOCKED Home `/` and the old locked sections (service strip, TechSpace pop-up, Industries city). They are still
   finished designs: change only what the task names.
3. `node tools/tasks.mjs begin N "title"` (run in the MAIN folder; next free number is **110**), work, `node tools/tasks.mjs end N`, set `done` in `TASKS.md`.
4. **Editing:** in a Claude worktree session a hook blocks edits in the main folder. Edit in the worktree, commit, bring `origin/main` in with the app's
   `sync_with_base_branch` tool, then in the MAIN folder `git merge --ff-only <worktree-branch>`, run `npx tsc --noEmit`, eslint on changed files and
   `npm run build` there, then `git push origin main` (a push deploys on Hostinger). Commit trailer: `Co-Authored-By: Claude …`.
5. Build tips: stop the dev server first. If `npm run build` dies with `uncaughtException … reading 'length'` delete `.next/cache` and build again. If `tsc`
   shows errors inside `.next/dev/types`, delete `.next/dev`. A dev server on port 1010 is started with `.claude/launch.json` (`preview_start dev`).
6. Check a page at **1280×720 and 1440×900** with DOM measurements (buttons must end above the floating menu pill: pill top = viewport height − 102 px),
   not only with screenshots (the browser pane screenshots are small and the dev server is slow: wait 15–25 s after a first visit).
7. Update `brain/08-task-history.md`, `09-open-items.md` and the status lines in `18` after each task.
8. Reply to the owner in simple romanized Gujarati-English, short. **For a new hero: show 2–3 options first (a small wireframe widget) and build only the one the owner picks.**

## 1. System decisions (apply everywhere, new work must follow them)

| Topic | Decision | Where |
|---|---|---|
| Font | **Poppins only** (weights 400–800). Archivo was removed; the giant year on About and the rotating word on Brand use Poppins 800. | `src/lib/root-shell.tsx` |
| Text size | **Nothing under 14px** (labels/chips), paragraphs ≥ 16px. Applies to Home, menu, former locked sections and mockups too. Exempt only: SVG drawing text (`fontSize` in art) and `.rl-livery` (lettering painted on the train). | all css |
| Colours | Never a hard-coded violet/pink. `hsl(calc(var(--th) + N) calc(S% * var(--ts)) L%)` (`BASE_HUE` = 284, so offset = hue − 284). Character art (`.ch`, `.ra-*`) and the code-editor/mini-website mockups (`.ob-*`, `.ws-*`) keep their own palette on purpose. | `src/lib/theme.ts` |
| Focus | One keyboard focus ring: 2px `var(--color-violet)`, offset 3px (`html a:focus-visible …`, end of globals.css). Skip link `.skp-link` + `<main id="main-content">`. Components with their own ring (`.rp-cta`) keep it. | `globals.css`, `(site)/layout.tsx` |
| Cursor | Custom cursor steps aside over text fields (`data-mode="text"`), normal I-beam shows. | `custom-cursor.tsx` |
| Motion | Animate `transform/opacity` and named paint properties only; **no `transition: all`**. Every new animation needs a `prefers-reduced-motion` block that shows a calm finished state. | css |
| Hero fit | The standard page hero (`sections/page-hero.tsx`, classes `phz-hero`/`phz-h1`) uses `text-wrap: balance` and on short laptop screens (min-width 1024, max-height 800) a smaller heading and top gap. Buttons must stay above the menu pill. | `globals.css` `.phz-*` |
| Detail pages | On `/blog/<slug>`, `/portfolio/<slug>`, `/careers/<slug>` the logo fades after 240 px and the bottom menu hides while scrolling down (Tab or scrolling up brings it back). | `logo-mark.tsx`, `floating-nav.tsx` |
| Forms | Contact flow has a visible 14px label above every field; placeholders end with `…` or show an example; email/tel have `inputMode`. | `contact-flow.tsx`, css `.cf-fld` |
| SEO | Titles ≤ 60 characters, descriptions 70–160. Blog/project titles drop the "| We3vision" suffix when longer than 60. Share picture `public/brand/og-image.png` (made by `node tools/make-og.mjs` from the real logo) is in the metadata of every page (`src/lib/share-image.ts`). About = `AboutPage` JSON-LD, sitemap page = `CollectionPage`. `node tools/seo-audit.mjs <url>` must say 0 BLOCKS / 0 WARN (it did: 108/108). Titles saved in Admin > Pages override the code defaults. | `lib/cms/content/*.ts` |
| 404 / errors | Branded 404 (`global-not-found.tsx`, needs `experimental.globalNotFound` in `next.config.ts`), `(site)/not-found.tsx`, `(site)/error.tsx`; CSS prefix `nf-`. | `not-found-view.tsx` |
| Placeholders | Projects with the template text or the name "Project NN" are hidden from the public site (`isPlaceholderProject` in `src/lib/projects.ts`); the admin still lists them. Never invent content, numbers, clients. | `projects.ts` |
| Security shield | `src/lib/shield.ts` blocks hacker probes; `/wordpress` only matches as a whole path segment (`wordpress(?:/|$)`) so `/wordpress-plugin-development-company` works. Test every new route name against it. | `shield.ts` |

## 2. The "unique first screen" system for the service pages (B-25)

**Why:** the owner's rule "no two pages look the same" — before this, 9 pages had the same centred template (badge, 2-line heading, text, 2 buttons).

**Pattern (copy it for the next page):**
- File `src/components/site/modern/<name>-hero.tsx`, exported component `XxxHero({ data, site })`; props type `SectionProps<"pageHero">` (not `SectionComponent`, that is a component type).
- It is called from `src/components/site/sections/page-hero.tsx` with one line per page, placed after the contact-page branch:
  `if (page === "<slug>") return <XxxHero data={data} site={site} />;` (the slug is the page's key in `src/lib/cms/pages.ts`).
- **Left side = the same for all** (re-use the classes `.wdh`, `.wdh-copy`, `.wdh-h1`, `.wdh-p`, `.wdh-cta`; texts come from the CMS `pageHero` fields unchanged, heading `\n` replaced by a space, `animate-rise` entrance). One `<h1>`.
- **Right side = one unique, drawn, CSS-only scene**, 540 px wide, ~410–440 px high, with its own class prefix appended at the END of `src/app/globals.css`
  (grep the prefix first: it must be unused). Entrance `animation: wdh-in .9s … both; animation-delay: .5s`. A 14px tag chip names the idea (when it helps).
- Keep the page's `HeroGradient` background (`<HeroGradient page="<slug>" />`) and `<HeroBadges badges={site.badges} />`; section classes
  `phz-hero wdh-root relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32`.
- On short screens `@media (min-width:1024px) and (max-height:800px)` scale the scene (`transform: scale(.88–.9); transform-origin: center right`).
- `@media (prefers-reduced-motion: reduce)`: stop animations and show a finished still state.
- Theme colours only; no avatar; no stock/generated images (SVG/CSS only); **no invented numbers** (that is why "speed rings 100/100" was rejected).
- Verify with a DOM script at 1280×720 and 1440×900: `.wdh-cta` bottom < pill top (618 at 720, 798 at 900), `document.querySelectorAll('h1').length === 1`,
  `scrollWidth − innerWidth === 0`, and the animation is really running (read a computed transform/clip-path twice).

### Done (owner picked the option in brackets)

| Page (slug) | File | CSS prefix | Concept | Task |
|---|---|---|---|---|
| `/webdev` (`webdev`) | `modern/webdev-hero.tsx` | `wdh-` | **A. Page builds itself**: a browser window assembles a website block by block (menu, hero, 3 cards, footer), then a selection outline walks over Menu / Hero / Cards / Footer and names them. | 104 |
| `/mobile` (`mobile`) | `modern/mobile-hero.tsx` | `mbh-` | **B. One code, two phones**: a code card ("One codebase") joined by dashed wires to an iPhone-style and an Android-style phone that swipe through the same 3 drawn screens, looping. | 105 |
| `/crm` (`crm`) | `modern/crm-hero.tsx` | `crh-` | **B. One customer, every channel**: customer card with 4 tiles (Email, WhatsApp, ERP, Web form); a pulse runs from each tile into the card and that history line fills in. | 106 |
| `/ui-ux-design` (`ui-ux-design`) | `modern/uiux-hero.tsx` | `uxh-` | **A. Wireframe to finished UI**: one screen drawn twice (grey dashed wireframe under, finished design over); a light line sweeps and paints it, holds, sweeps back (tags "Wireframe" / "UI design"). | 107 |
| `/animation` (`animation`) | `modern/animation-hero.tsx` | `anm-` | **A. Bouncing ball**: squash and stretch, floor shadow that grows with height, 3 dashed ghost frames, on a graph-paper stage (tag "Squash and stretch"). | 108 |
| `/3d-modeling` (`3d-modeling`) | `modern/modeling-hero.tsx` | `mdl-` | **B. Material sphere**: wireframe sphere fills with light and cycles matte, glossy, metal while a light circles it (tags Wireframe/Matte/Glossy/Metal, 12 s loop). | 109 |

### Already own designs before this work (do not redo)
`/seo` (typing search bar hero), `/graphics` (pen-tool/curtain), `/ai` (AI hero background + robot buddy), `/contact` (receptionist), `/careers` (train),
`/metaverse` (3D office walk), `/brand-identity`, `/brand-development-services`, `/brand-kit-design`, `/brand-video-production`, `/zero-to-n-brand-development`,
the six technology pages (`tech/*.tsx` dashboards), `/products/*`, `/about` (Pando island), `/team` (office). Home `/` hero = particle sphere hub.

### Still on the standard centred hero (candidates, owner decides the order, one page at a time)
`/blog`, `/products` (list), `/team`, `/portfolio`, `/software-development-services`, `/shopify-plugin-development-services`, `/meta-marketing-services`,
`/physical-marketing-services`. Ideas already discussed (use as option material, 2–3 per page, owner picks):
- Blog: cursor-grid is already behind it; idea = stack of article cards fanning out, or a reading-progress "bookmark" ribbon.
- Products: four product tiles (WeBugMate live, the rest "Coming soon") orbiting a launch pad; keep "Coming soon" text (owner decision: do not claim WeJobs/WeThink are live).
- Team: the existing `.ah-bg` lights; idea = name badges lining up into an org tree.
- Software: dashboard/modules snapping together; Meta/Physical marketing already have ads-manager UI sections (do not repeat).
- **Rejected on purpose:** speed/score rings with "100" (invented numbers), isometric city/diorama (Industries city already uses it), a Figma-canvas hero for UI/UX (the Figma-studio guide is lower on the page).

## 3. Bug-list status (details in `18`)

- **Done (code):** B-01 shield, B-02 share image, B-04 404, B-05 detail-page overlap, B-06 hero safe zone, B-07/B-07b focus + cursor, B-08 SEO lengths, B-09 H1/anchors,
  B-10 placeholder projects (auto-hidden), B-11 balanced headings (standard hero), B-12 menu 14px, B-13 labels 14px everywhere, B-14 Archivo removed, B-15 near-black tints
  (not characters/mockups), B-16 `transition: all`, B-17 contact labels, B-18 aria-labels, B-22 JSON-LD, B-25 six heroes, B-30 env warning.
- **Closed without change:** B-19 (list images sit in fixed frames, no layout shift), B-20 (owner: keep "Coming soon"), B-21 (owner: keep the careers gate; hint line already exists).
- **Open:** **B-03 live `NEXT_PUBLIC_SITE_URL` + deploy** (the public domain still served the OLD site on 2026-10-19; check the Hostinger deploy log, set the env var, `npm install`,
  point the domain), B-23/B-26/B-27 (production Lighthouse, dev crash that happened once while loading `/3d-modeling` in an iframe), B-24 (city labels clipped on Metaverse — now editable),
  B-29/B-31/B-32/B-33 (minor), the heroes listed above, Phase 6 optimisation (`optimize` branch, handbook 15).
- **Owner must fix in Admin > Projects:** titles "Carousel 1/2/3", typo "Good DOllar" / "God Dollar", "Arushi" vs "Aarushi Developers". The live database may differ from the dev one.

## 4. Not verified (say so in reports)
Admin panel (login), form submissions, real phones, Safari/Firefox, Lighthouse on the live site, every pinned scene at 1440×900 / 1920×1080 by eye, the "Metal" phase of the
3D-modeling hero by eye, reduced-motion by eye (only the CSS exists).

## 5. Paste this into a new chat
```
Tu We3vision website no senior developer + designer che. Repo: D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07 (branch main).
Pehla vaanch: brain/00-START-HERE.md, brain/02-rules-and-preferences.md, brain/19-design-decisions-and-handoff.md, brain/18-website-test-master-table.md.
Owner romanized Gujarati-English ma lakhe che: same short style ma jawab aap. Home ane badha sections unlocked che (2026-10-19), pan "change only what the task names".
Design rules aa file ma che (Poppins, 14px floor, theme hsl colours, reduced-motion, hero pattern, no invented numbers). Naya hero mate pehla 2-3 option batav, owner pick kare pachi j banav.
Dar kaam: node tools/tasks.mjs begin N "title" (next 110), tsc + eslint + npm run build pachi j push to main, brain/08 + 09 update karo, short report (shu karyu, shu verify karyu, shu nathi karyu).
Hamnaa no kaam: ___ (e.g. "Blog page no hero" ya "live deploy check").
```
