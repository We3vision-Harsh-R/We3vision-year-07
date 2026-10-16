# 04 — Pages and sections

Slug = key in `PAGES` (`src/lib/cms/pages.ts`) = `page` prop given to section renderers. Route folders in `src/app/(site)/`.
Content defaults: `src/lib/cms/content/<file>.ts`. Skin: C = classic, M = modern (`MODERN` list in `lib/cms/page-route.tsx`).

## Routes
| Route | Slug | Content file | Skin | Notes |
|---|---|---|---|---|
| `/` | home | `home.ts` | C | **LOCKED.** hero hub, At a glance, Industries road, TechSpace, Why, Reach, Contact |
| `/about` | about | `about.ts` | C | aboutHero (text) → aboutChapters / aboutWorld (3D Pando island) → services strip → timeline → advantages → team |
| `/team` | team | `team.ts` | M | pageHero, teamManifesto, **teamOffice** (3D office, hover pop-up, hierarchy), highlights, teamJourney, teamValues, why, faq, contact |
| `/contact` | contact | `company.ts` | M | pageHero + receptionist scene (`contact-reception.tsx`, `reception-avatar.tsx`) + guided `contact-flow.tsx` |
| `/careers` | careers | `company.ts` | M | train-journey page (career/railway.tsx, journey.tsx, destination.tsx), values, teams, help desk, **Surat Junction** station with job list |
| `/careers/[slug]` | – | `lib/careers.ts` | – | single job page + application form (admin: Careers → Jobs/Applications) |
| `/blog`, `/blog/[slug]` | blog | `company.ts`, `lib/blog*.ts` | M | masonry list, hover pop-up after 0.5 s; admin: Blog |
| `/portfolio`, `/portfolio/[slug]` | portfolio | `company.ts`, `lib/projects.ts` | M | projects from admin → Projects. **Page design work is still pending (see 09)** |
| `/webdev` | webdev | `services.ts` (`WEBDEV_SECTIONS`) | M | guide scene = office builder (`office-builder.tsx`) |
| `/mobile` | mobile | `services.ts` | M | |
| `/ai` | ai | `ai.ts` | M | flow diagram, automate switches, guide, FAQ… |
| `/metaverse` | metaverse | `services.ts` (`METAVERSE_SECTIONS`) | C | scroll-driven 3D office walk + vrFloor + gov projects + vr* sections. Built step by step by the owner |
| `/ui-ux-design` | ui-ux-design | `services.ts` | M | Figma-studio guide (`figma-studio.tsx`), canvas "What we design" |
| `/crm` | crm | `services.ts` | M | (sales guide section was removed) |
| `/animation` | animation | `services.ts` | M | After Effects style guide (`after-effects.tsx`) |
| `/3d-modeling` | 3d-modeling | `services.ts` | M | (3D artist guide removed) – not in the variant table |
| `/graphics` | graphics | `services.ts` | M | |
| `/seo` | seo | `services.ts` | M | SEO lab guide (`seo-lab.tsx`) |
| `/brand-identity` | brand-identity | `brand.ts` | C | wordHero, archGallery (admin Projects group "brand"), brandBoard, process, advantages, tags, industries, sketchCanvas, services, contact |
| `/headless-CMS-devlopment-services` … `/wordpress-plugin-development-company` (6 pages) | headless-cms, custom-wordpress, shopify, custom-woocommerce, shopify-app, wordpress-plugin | `tech.ts` | M | long SEO pages from the old site (route folders keep the old site's misspelled URLs on purpose) |
| `/preview/[slug]` | – | – | by slug | admin draft preview (noindex) |
Sub-service pages of Brand Design (strategy, logo, guidelines, collateral) were **removed** (task 38); their lists stay as text.

## Service page template (`build()` in `services.ts`)
`pageHero` → `story` → (optional `guide`) → `services` ("What we build", cards with fit/problems/outcomes from
`service-details.ts`) → `process` → `tags` (tools) → `industries` → `advantages` (id `why-we3vision`) → `faq` → `services`
(id `related-services`, "More from We3vision") → `contact`. The **repeated** ones get a different design per page: see
[06-service-page-variants.md](06-service-page-variants.md). `industries` and `contact` are intentionally the same everywhere.

## Section types (`SECTIONS` in `lib/cms/sections.ts` → renderer in `components/site/sections/`)
hero (Home hub) · story · brandBoard · strengths · services · highlights · industries · advantages · blogs · reach · contact ·
backdrop7 · pageHero · wordHero · archGallery · projects · flow · automate · faq · process · tags · timeline · guide · vrEntry ·
aboutWorld · aboutHero · aboutChapters · vrSpace · vrFloor · vrEmerge · vrDevices · vrQuiz · vrProcess · sketchCanvas · team ·
teamOffice · careerJourney · careerDestination · careerOpenings · careerValues · careerTeams · careerHelpDesk · teamManifesto ·
teamJourney · teamValues.

| Section | What it is | Main files |
|---|---|---|
| `hero` | Home: particle sphere with "7" → blast → 7 service boxes hub, rail with the walking cartoon avatar, PANDA chat bar | `hero-scene.tsx`, `particle-sphere.tsx`, `.hub-*`, `home-street.tsx` |
| `highlights` | "At a glance" (Home: minimal count-up `glance-min.tsx`; About: bento with Pando) | `sections/highlights.tsx`, `glance-*.tsx` |
| `industries` | 3D low-poly city with a road and a car driving on scroll (pinned); list <1024 px | `industries-city.tsx`, `city-scene.tsx`, `industries-road.tsx` (Home) — **locked** |
| `tags` | Tools: planets (TechSpace) or one of 7 variants | `tech-space.tsx` (locked pop-up), `modern/tools-variants.tsx` |
| `services` | "What we build" stage/canvas/phone/pipeline/layers/palette/serp; also "related" + About strip | `modern/service-stage.tsx`, `service-bodies.tsx`, `service-strip.tsx` (locked), `related-*.tsx` |
| `process` | Steps: ProcessRail (default) / ProcessFloor (classic) / 7 variants | `modern/process-rail.tsx`, `process-floor.tsx`, `modern/process-variants.tsx` |
| `advantages` | Why We3vision: WhyBento / ReasonsStack / 7 variants | `modern/why-bento.tsx`, `reasons-stack.tsx`, `modern/why-variants.tsx` |
| `faq` | FaqSplit + FAQPage JSON-LD / 6 variants | `modern/faq-split.tsx`, `modern/faq-variants.tsx` |
| `story` | text block: duo / lead / rail / chips / stack / quote / line | `sections/story.tsx` (`.sy-*`, `.vy-*`) |
| `guide` | Interactive character scene per service (12 scenes) + office builder (webdev) | `guide.tsx`, `guide-scene(s).tsx`, `guide-kit.tsx`, `office-*.tsx` |
| `flow` / `automate` | AI diagram / switches with avatar | `flow.tsx`, `automate.tsx` |
| `timeline` | About vertical timeline, founders walk, garden, 2027 office | `timeline.tsx`, `timeline-art.tsx`, `timeline-office.tsx`, `timeline-boards.tsx` |
| `aboutWorld` | three.js island + Pando | `about/world.ts`, `panda.ts`, `about-world.tsx` |
| `teamOffice` | Team office: CXO centre, managers table, team corners, seat logic | `modern/team-office.tsx`, `lib/team-seats.ts` |
| `contact` | Short interactive flow: pick need → details (project ticket, budget, rocket) | `contact-flow.tsx`, `contact-form.tsx` |
| `reach` | Global reach: arcs from Surat to many countries, full-width card | `sections/reach.tsx`, `globe.tsx`, `reach-places.tsx` |
| `wordHero`, `archGallery`, `brandBoard`, `sketchCanvas` | Brand Design page only | `word-hero.tsx`/`rotating-word.tsx`, `arch-gallery.tsx`, `brand-board.tsx`, `sketch-canvas.tsx` |
| `vr*` | Metaverse page only | `components/site/metaverse/*` |
| `career*` | Careers page | `components/site/career/*`, `sections/career.tsx` |

## Shared site chrome
`(site)/layout.tsx`: `SmoothScroll` (Lenis), `PauseOffscreen`, `SiteScrollbar` (glass scrollbar), `CustomCursor` ("You" tag),
`ThemeProvider` (colour picker), `Background` (aurora/gradient per page), `LogoMark`, `Footer` (+ `footer-word.tsx`),
`FloatingNav` (bottom glass pill that shrinks on scroll down; opens `mega-menu.tsx`).
