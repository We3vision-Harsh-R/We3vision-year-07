# 11 — Mobile architecture (tasks 95 + 96)

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
- The laptop `(site)/layout.tsx` no longer mounts `MobileLauncher` (`MobileLauncher` in `launcher.tsx` is now unused; `/m` renders `Launcher`).
- The `lnc-` media queries use `max-width: 99999px` (not 1023.98px): the server picks the site, so a landscape tablet also shows the launcher.

## Add a mobile page
1. Build `src/app/(m)/m/<slug>/page.tsx` (read the same CMS data via `lib/cms`; only the components are mobile ones; style in `mobile.css`).
2. Add its public address (e.g. `"/seo"`) to `MOBILE_READY` in `src/lib/device.ts`. Phones now get it; laptops are unchanged.

## Known limits
- iPadOS "Request desktop website" sends a Mac UA: it stays on the laptop site (use `?view=mobile`).
- Tapping an app that is not in `MOBILE_READY` opens the laptop page on the phone, with no way back to the launcher (as before).
- Dev tip: Turbopack rejects a `node_modules` junction outside the project; use `next dev --webpack` in a worktree.
