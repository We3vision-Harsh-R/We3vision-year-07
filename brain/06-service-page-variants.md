# 06 — Service page variants (task 74): "no two pages look the same"

## The request
The owner: on web development, app development, brand design, CRM, 2D/3D animation, UI/UX, graphic design and SEO, every section that
appears on all of them with the same kind of content (story, what we build, process, tools, why, FAQ, more-from) must be shown in a
**different design on each page**, and no design may repeat on any page of the site. **Industries** and **Contact** sections are
excluded (unchanged).

## The table — `src/components/site/modern/variant-table.ts`
`PAGES_ORDER = webdev, mobile, crm, animation, ui-ux-design, graphics, seo, brand-identity`. `variantOf(page, type)` returns the
variant number (0 = the design that existed before; `null` = page not in the table → keeps its old design).

| Type | webdev | mobile | crm | animation | ui-ux | graphics | seo | brand |
|---|---|---|---|---|---|---|---|---|
| process | 0 Rail | 1 Stepper | 2 Zigzag | 3 Stairs | 4 Rows | 5 Ring | 6 Tabs | 7 Board |
| faq | 2 Cards | 0 Split | 1 Stack | 3 Chat | 4 Tabs | 5 Flip | 6 Editorial | – |
| why | 1 Grid | 0 Bento | 2 List | 3 Carousel | 4 Checklist | 5 Tiles | 6 Marquee | 7 Spotlight |
| related | 1 Rows | 0 Links | 2 Deck | 3 Marquee | 4 Tiles | 5 Cloud | 6 Strip | – |
| tools | 1 Tabs | 2 Shelves | 0 Planets | 3 Accordion | 4 Matrix | 5 Detail | 6 Layers | 7 Periodic |
| services | 0 Stage | 2 Phone | 3 Pipeline | 4 Layers | 1 Canvas | 5 Palette | 6 SERP | strip (classic) |
| story | 0 Duo | 1 Lead | 4 Stack | 5 Quote | 2 Rail | 3 Chips | 6 Line | (bb-track) |

(The number is the index into each type's design list; e.g. services: 0 stage, 1 canvas, 2 phone, 3 pipeline, 4 layers, 5 palette,
6 serp; story: 0 duo, 1 lead, 2 rail, 3 chips, 4 stack, 5 quote, 6 line.)

## Files
| Section | Renderer (picks variant) | Variant file | CSS prefix |
|---|---|---|---|
| process | `sections/process.tsx` | `modern/process-variants.tsx` (+ `process-rail.tsx` = 0) | `.vp-*` |
| FAQ | `sections/faq.tsx` (client) | `modern/faq-variants.tsx` (+ `faq-split.tsx` = 0) | `.vf-*` |
| why | `sections/advantages.tsx` | `modern/why-variants.tsx` (+ `why-bento.tsx` = 0) | `.vw-*` |
| related | `sections/services.tsx` (`related-services` branch) | `modern/related-variants.tsx` (+ `related-links.tsx` = 0) | `.vl-*` |
| tools | `sections/tags.tsx` | `modern/tools-variants.tsx` (+ `tech-space.tsx` = 0) | `.vt-*` |
| what we build | `sections/services.tsx` → `ServiceStage variant=BODY[n]` | `modern/service-stage.tsx` (stage, canvas) + `modern/service-bodies.tsx` (phone, pipeline, layers, palette, serp) | `.sx-*`, `.cv-*`, `.vz-*` |
| story | `sections/story.tsx` (`BY_NUMBER`) | same file | `.sy-*`, `.vy-*` |
| shared | – | `modern/variant-kit.tsx` (client: `VHead`, `useCycle`), `modern/variant-table.ts` (server-safe) | `.vk-*` |

## Design of each (what the owner sees)
- **process**: Stepper (numbered track + panel) · Zigzag (alternating cards on a line) · Stairs (stepped cards) · Rows (big numbered
  rows) · Ring (circular dial) · Tabs (tab strip + panel) · Board (columns). Brand uses the classic ProcessFloor on the Brand page
  only if variant 7 is removed.
- **faq**: Stack (wide bars, one open) · Cards (all open, 2 columns) · Chat (question list → chat window, typing dots) ·
  Tabs (list + large answer panel) · Flip (cards turn over) · Editorial (3-column rows). All emit FAQPage JSON-LD.
- **why**: Grid · List (sticky heading + rows) · Carousel (arrows + snap) · Checklist (sticky heading + ticks) · Tiles (big numbers,
  first spans 2) · Marquee (two counter-moving rows, pause on hover) · Spotlight (list + big panel, auto-cycles).
- **related**: Rows (contents list) · Deck (fanned cards that spread on hover) · Marquee pills · Tiles (colour fields) · Cloud
  (chips, text on hover) · Strip (hovered panel opens wide).
- **tools** (all use `techDetail`): Tabs (category tabs + cards) · Shelves (marquee row per category) · Accordion · Matrix (card per
  category, hovered chip shows its line) · Detail (list + large panel, auto-cycles) · Layers (stack diagram) · Periodic (symbol
  tiles + detail bar). 0 = TechSpace planets with the locked pop-up.
- **what we build** (all keep the pinned, scroll-driven, compulsory-scroll mechanics of `ServiceStage`; only the body differs):
  Stage (tab list + art panel) · Canvas (Figma-like frames + inspector) · Phone (phone mock + tab-bar icons) · Pipeline (chevron
  stages + deal card) · Layers (editing-program timeline with playhead) · Palette (swatch list + poster) · SERP (search results,
  open result shows the points).
- **story**: Duo (two glass cards) · Lead (statement + columns) · Rail (outline numbers + rows) · Chips (key phrases + columns) ·
  Stack (staircase cards) · Quote (pull quote left, numbered notes right) · Line (vertical timeline, alternating sides).

## How to change or extend
- **Swap a page's design**: edit its number in `TABLE`; keep every column unique per row (no two pages with the same number in one type
  except `0` pages that really keep the old design). Check [08](08-task-history.md) first — the owner may have asked for the mapping.
- **Add a page** (e.g. 3D modeling): append the slug to `PAGES_ORDER`, give it a number per type that no other page uses. If all
  existing designs are used, design a new variant (next number) in the matching `*-variants.tsx` and add a case + CSS block.
- **New variant checklist**: new class prefix inside the type's prefix (`vw-xx-*`), ≥16 px text, theme-relative colours, desktop only,
  headings via `VHead`, data from the section's existing fields only, `React.CSSProperties` for custom props, no ref objects through
  props (lint `react-hooks/refs`), keyboard access for tabs/buttons, `prefers-reduced-motion` stops marquees.
- **Server/client boundary**: `variantOf` must stay in `variant-table.ts` (no `"use client"`), otherwise a server section crashes with
  "Attempted to call variantOf() from the server but variantOf is on the client".

## Known gaps (told to the owner)
- Pages outside the table (AI, 3D modeling, tech pages, About, Team…) still use their older designs (`variantOf` → `null`).
- Brand's "What we build" (ServiceStrip) is the same design the About page uses.
- Admin screens for these sections are unchanged (content/fields are identical); only the public rendering changed.
