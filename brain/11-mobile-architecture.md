# 11 — Mobile architecture (tasks 95 + 96 + launcher v5)

Goal: a phone/tablet gets its OWN site (not a shrunk laptop site) and never downloads the laptop code or CSS; one public URL per page (SEO).

## Three apps, three root layouts (task 96)
There is no `src/app/layout.tsx` any more. Each app has its own ROOT layout (`<html>` + `<body>` through `<RootShell>` in `src/lib/root-shell.tsx`,
which holds the Poppins font, the saved-colour boot script and `baseMetadata`):

| App | Root layout | CSS | Contains |
|---|---|---|---|
| laptop website | `src/app/(site)/layout.tsx` | `globals.css` (Tailwind + ~34 000 lines) | every public page, Background, SmoothScroll, Cursor, Footer, FloatingNav… |
| admin panel | `src/app/admin/layout.tsx` | `globals.css` | `/admin/**` |
| phone/tablet | `src/app/(m)/layout.tsx` | **`src/app/(m)/mobile.css` only** | `/m/**` (launcher) |

- Moving between two apps (phone launcher → a desktop-only page, laptop site → admin) is a full page load. That is intended.
- `mobile.css` = theme numbers (`@property --th/--ts`) + a small reset (what Tailwind preflight gave) + the `lnc-` launcher CSS.
  **All new launcher/mobile CSS goes in `mobile.css`, never in `globals.css`.** The launcher CSS used to be in `globals.css`;
  `tools/extract-launcher-css.mjs --write` moved it (any `globals.css` block whose banner says LAUNCHER goes to `mobile.css`; re-runnable).
- A URL that matches no route shows Next's plain default 404 (there is no root layout above the apps). `global-not-found` (experimental flag in
  `next.config.ts`) would let us style it; not done.

## How a phone gets the mobile page
- The visitor always opens the normal address (`we3vision.com/seo`). **`src/proxy.ts`** looks at the request (`?view=`/cookie `we3.view`, then
  `Sec-CH-UA-Mobile`, then the `User-Agent`) and, for a phone/tablet asking for a page listed in **`MOBILE_READY`**, **rewrites** it inside the
  server to `/m/<page>`. The address bar does not change. Pages not in the list keep showing the laptop page, so nothing breaks while mobile grows.
- Logic: **`src/lib/device.ts`** (`wantsMobile`, `mobilePathFor`, `MOBILE_READY`, `VIEW_COOKIE`).
- Only GET/HEAD are rewritten (server actions are POSTs and must reach their own page). `/admin`, `/preview`, `/m`, `/api`, `/_next`, `/media`
  and files with an extension are skipped. The proxy also sets `Vary: User-Agent, Sec-CH-UA-Mobile` (Next may overwrite it: check in production).
- Manual choice: `?view=desktop` or `?view=mobile` sets the cookie for 30 days (a footer switch can use it later).
- SEO: `/m` has `canonical: "/"`; do NOT add `noindex` (Googlebot Smartphone is served the mobile page at the normal URL).
- The laptop `(site)/layout.tsx` no longer mounts the launcher; `/m` (`src/app/(m)/m/page.tsx`) renders `Launcher` and passes the real phone/e-mail from Admin > Settings (contact cards) to the "Talk to us" widget.
- The `lnc-` media queries use `max-width: 99999px` (not 1023.98px): the server picks the site, so a landscape tablet also shows the launcher.

## Add a mobile page
1. Build `src/app/(m)/m/<slug>/page.tsx` (read the same CMS data via `lib/cms`; only the components are mobile ones; style in `mobile.css`).
2. Add its public address (e.g. `"/seo"`) to `MOBILE_READY` in `src/lib/device.ts`. Phones now get it; laptops are unchanged.

## Known limits
- iPadOS "Request desktop website" sends a Mac UA: it stays on the laptop site (use `?view=mobile`).
- Tapping an app that is not in `MOBILE_READY` opens the laptop page on the phone, with no way back to the launcher (as before).
- Dev tip: Turbopack rejects a `node_modules` junction outside the project; use `next dev --webpack` in a worktree.

## The launcher (phone/tablet home), v5 — files in `src/components/site/mobile/`
- **Three screens**: Home (widgets + Products/Blogs/Team/Careers) · Services (one big folder card per group: Development, Creatives, E-commerce,
  Branding, Marketing, Our Products — each with its own group picture and a preview of its pages) · App Library (every page, grouped, searchable).
  A new screen appears when the visitor drags something past the last one (max 4 home screens). The dock (Portfolio, About, Contact, Services) stays.
- **Every page is an app** (`launcher-data.ts` APPS, 38 pages + Home): tapping grows the icon to the full screen and melts it into the website's
  background colour (`.lnc-grow-bg` = the body colour) before the page loads. Links are plain `<a>` + `location.assign` (no Next prefetch storm of
  desktop pages); pages in `MOBILE_READY` use `router.push`.
- **Long press** an app: lifted icon + menu (Open, Share, Edit Home Screen, Remove from Home Screen / Add to Home Screen). Long press on an empty
  place, or "Edit Home Screen": the items wiggle, "−" removes, drag to rearrange (items reflow, the ghost shows the place), hold at the screen edge
  to change screen, "+" opens the sheet (Widgets: Clock, Calendar, Start a project, Talk to us, 7 years · Wallpaper: 7 theme-relative presets, own photo).
  "Done" ends the edit mode. "Remove" only removes from Home/Services: the Library always keeps every page.
- **Arrangement and wallpaper are kept in the browser** (localStorage key `we3.launcher.v1`, validated on load: unknown ids are dropped). Photo
  wallpapers are shrunk to 1080 px JPEG first. Nothing is sent to the server.
- **Layout maths** is in JS (`launcher.tsx` measure() + `launcher-state.ts` pack/fit): positions are absolute `translate3d`, so reflow and drag only
  animate transforms. The CSS variables --u/--cols/--side/--pitch are set inline from the same numbers.
- Group pictures are separate from the app pictures (no two pictures look alike: Brand Kit = droplet, Products = rocket, groups = chip, palette, store, star, trend, trophy…).
- CSS: `mobile.css`, block "LAUNCHER v5" is the newest (it overrides v1–v4 where they overlap).
- **Icon looks ("Customize", as on the iPhone)**: edit mode (long press on an empty place, or "Edit Home Screen") shows "+", **Customize**, Done at the top. Customize opens a panel at the
  bottom (the screen stays visible): Default (colourful glass) · Dark (dark tile, glowing picture) · Clear (see-through glass, white picture) · Tinted (one colour for all, slider = hue
  away from the theme colour). Kept in `Saved.icons` (`launcher-state.ts`); the root gets `ics-<look>` and `--tint`; CSS block "LAUNCHER v6" in `mobile.css`. The small previews use their own `.lnc-pv` rules.
- **A screen that is shorter than the saved arrangement** (browser bars, rotation) only changes what is *shown* (`fit` in a `useMemo`); the saved arrangement is changed only by something the visitor does (drop, add, Done).
- **Icon design (Apple style, "LAUNCHER v7")**: every picture in `glyph.tsx` is a solid shape (`f`) + thin cut-outs (`c`) + same-colour lines (`s`) on a 24 grid (no more 3-layer outline).
  `--gf` = colour of the shape, `--gc` = colour of the cut-outs; the four looks only change those two colours and the tile. Tile = smooth light-to-deep gradient, hairline rim, soft shadow (no gloss blobs).
  Judge new pictures at 60 px (the real size), not big. Keep every service/page picture about its subject (AI = sparkles, Metaverse = headset, SEO = magnifier + trend, …) and never reuse a picture.
  The /apple:icon command is for Xcode apps (asset catalog, Icon Composer); it does not apply to this website, only its principles were used (flat shapes, system-like light, 60 px check, tinted = one hue).

## Launcher v8 (only the launcher changes; no web page is edited)
- **Screens (a copy of the iPhone home screen, v9)**: every page is an icon installed on the home screens, no list, no section titles: screen 1 (2 widgets + 8 apps + 2 widgets),
  screen 2 (the "Send a message" widget + 16 apps), screen 3 (10 apps), then the App Library. The dock holds 4 apps (Portfolio, About, Contact, Blogs; `DOCK`, `SCREEN_APPS` in `launcher-data.ts`).
  Everything is editable (drag, remove, add with "+"). More home screens appear when one is full. A thin home indicator bar sits at the bottom. Labels are short so they fit under an icon.
- **"+" sheet** has three tabs: **Widgets**, **Apps** (tap any service or page to put it on the Home screen, tap again to take it off) and **Wallpaper**.
- **Widgets that help a visitor reach We3vision** (real data from Admin > Settings, passed by `(m)/m/page.tsx`): *Send a message* (4x2, a real form that uses the existing `submitLead` action,
  so it lands in Admin > Leads; honeypot + rate limit as on the contact page), *Talk to us* (call / mail), *WhatsApp* (wa.me link), *Visit us* (Google Maps link of the head office),
  *Follow us* (LinkedIn / Instagram), *Our services* (4 popular pages), *Start a project*, *7 years*, *Clock*, *Calendar*. A widget's own buttons carry `data-act` (they work by themselves; the press logic ignores them).
- **Font** (Customize > Font): Modern (Poppins) · Soft (Quicksand) · Classic (Playfair Display) · Poster (Bebas Neue) · Typewriter (Space Mono) · Script (Pacifico) · Handwriting (Caveat).
  The root gets `fnt-<id>`; every text of the launcher inherits it. The fonts are declared in `src/app/(m)/fonts.ts` with `preload: false` (next/font needs plain object literals: no spread), so a phone downloads one only when it is chosen.
- Saved in `localStorage` key **`we3.launcher.v3`** (older layouts are ignored: the structure changed).
- **iOS 26 bottom (launcher v9)**: the dock is one pane of liquid glass (faint fill, hairline rim bright at the top); the **Search pill** is a small glass capsule and turns into the **page dots**
  for 1.5 s when the screen changes (always dots in edit mode and on the Library); the Customize panel uses the same glass; the **Clear** look blurs the wallpaper behind the tiles; the **Wave** wallpaper
  (teal → blue → navy) is the iOS 26 look. CSS block "LAUNCHER v9" in `mobile.css`.
