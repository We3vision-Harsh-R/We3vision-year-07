# Route architecture (2026-11-26)

One page for "where does every address live". Check it with `node tools/route-audit.mjs` (prints every route, the error/loading boundaries of each area, and any
link written in the code that leads to no page). Run it before a push when you add or rename a page.

## The three roots (each is a separate root layout = a separate `<html>`)
| Area | Folder | Layout | What it loads |
|---|---|---|---|
| Public website (laptop, and phones for pages that have no phone twin) | `src/app/(site)/` | `(site)/layout.tsx` | globals.css, the floating menu, footer, smooth scroll |
| Phone app (phone + tablet twin of a public page) | `src/app/(m)/m/` | `(m)/layout.tsx` | mobile.css only, never globals.css |
| Admin panel | `src/app/admin/` (`(panel)` = the pages with the menu, `login`, `connect`) | `admin/layout.tsx` | globals.css + admin-shell.css, noindex |
Route groups `(site)`, `(m)` and `(panel)` never appear in an address. `/m/...` is internal: the proxy (`src/proxy.ts`) rewrites a phone/tablet request for `/x` to
`/m/x` when `/x` has a phone twin (`src/lib/mobile-ready.generated.ts`, made by `tools/sync-mobile-ready.mjs`); a direct `/m/x` redirects to `/x`.

## Public addresses (the same address for laptop and phone)
- Home `/`; company: `/about`, `/team`, `/careers` (+ `/careers/[slug]` jobs), `/contact`, `/portfolio` (+ `/portfolio/[slug]`), `/blog` (+ `/blog/[slug]`),
  `/products` (+ `/products/webugmate|wejobs|wepresent|wethink`), `/industrial-training` (+ `/3-month|6-month|9-month`), `/services`, `/sitemap`.
- Services (one page each, address kept from the old site, typos included on purpose for SEO): `/ai`, `/webdev`, `/mobile`, `/crm`, `/software-development-services`,
  `/metaverse`, `/game-development`, `/3d-modeling`, `/animation`, `/graphics`, `/ui-ux-design`, `/seo`, `/meta-marketing-services`, `/physical-marketing-services`,
  the brand pages (`/brand-development-services`, `/brand-identity`, `/brand-kit-design`, `/brand-video-production`, `/zero-to-n-brand-development`), the WordPress /
  WooCommerce / Shopify / headless pages (see the audit output for the exact list).
- Legal: `/privacy-policy` and one page per country (`/privacy-policy-eu|usa|uk|germany|canada|australia|singapore|uae|general`).
- Preview (admin only, noindex): `/preview/[slug]`, `/preview/submission`.
- Machine addresses: `/api/*` (chat, careers resume, health, MCP, OAuth, uploads), `/.well-known/*`, `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `manifest.webmanifest`.

## Boundaries (what the visitor sees when something fails or is slow)
| Where | File | Shows |
|---|---|---|
| any public page not found | `(site)/not-found.tsx` | the 404 scene |
| a public page crashes | `(site)/error.tsx` | a calm message + Try again |
| a phone page crashes | `(m)/m/error.tsx` | the same, in plain phone styling |
| a phone page is loading | `(m)/m/loading.tsx` | the phone skeleton |
| an admin page crashes / loads | `admin/error.tsx`, `admin/loading.tsx` | message + Try again / "Loading…" (the admin menu stays) |
| a root layout crashes | `src/app/global-error.tsx` | last safety net with its own `<html>` |

## Adding a page (checklist)
1. Public page: `src/app/(site)/<address>/page.tsx` (+ its CMS entry in `src/lib/cms/pages.ts` and the menu in `src/lib/site-menu.ts`).
2. Phone twin (optional): `src/app/(m)/m/<address>/page.tsx` with `renderMobilePage(slug, {...})`, then `node tools/sync-mobile-ready.mjs`.
3. Admin page: `src/app/admin/(panel)/<name>/page.tsx` + the menu entry in `components/admin/admin-menu.ts`.
4. Run `node tools/route-audit.mjs`: every link must resolve; add the address to `sitemap.ts` if it is public.
