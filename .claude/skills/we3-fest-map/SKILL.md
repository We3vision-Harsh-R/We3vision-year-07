---
name: we3-fest-map
description: Map of the Diwali/Fest system (files, switches, how to add an effect). Use for any task that touches Admin > Fest or a festival decoration, instead of searching the code.
---

# Fest map

- **Switches:** `src/lib/fest.ts` `FEST_EFFECTS` (key, group site/industry/pointer/places, label, hint, on). Admin UI is generated from it (`components/admin/fest-manager.tsx`). Adding a key: add it there, update the counts in `src/lib/fest.test.ts`, add a `version.ts` entry.
- **Boot/attributes:** `<html data-fest data-fest-fx data-fest-density>`; read anywhere with `useFest()?.has("key")` (`fest/use-fest.ts`). Live updates: `fest/fest-live.tsx` + `/api/fest`.
- **Lazy loading:** every piece is a chunk in `fest/lazy.tsx` (`LazyFestLayer`, `LazyOfficeFest`, `LazyFestMenu`, `LazyMenuScene`, road/car). Nothing is downloaded when a festival is off. New piece = new `dynamic(import)` + a wrapper that checks its switch.
- **Whole site layer:** `fest/fest-layer.tsx` -> `fest-top.tsx` (DOM art `fest-art.tsx`) + canvas `fest-engine.ts` (particles, rockets, bursts; physics in `fest-physics.ts`, tests beside it) + `fest-pointer.tsx` (sparkler, click volley of rockets, diya, bloom, chakri).
- **Places:** menu `fest-menu.tsx` (+ `FestMenuScene`), logo ground `fest-brand.tsx`, offices `office-fest.tsx` + `office-floor.tsx` (rangoli floor, `SPOTS` per office), footer family `fest-home.tsx` (container query tiers), industries road `industries-fest.tsx`.
- **CSS prefixes:** `fs-` (fest.css, fest-places.css), `fo-` (fest-office.css), `rf-` (fest-road.css), `fh-` footer home, `fs-ms-` menu scenes, `dw-` home street people (`home-diwali.tsx`, figures reusable via `DIWALI_ITEM`).
- **Rules:** colours with `hsl(calc(var(--th) + N) calc(S% * var(--ts)) L%)` for theme colours (festival warm colours may be literal), only transform/opacity animate, every effect pauses off screen (`data-pause-off`) and has a reduced-motion rule. Laptop only. Preview with `?festtest`.
