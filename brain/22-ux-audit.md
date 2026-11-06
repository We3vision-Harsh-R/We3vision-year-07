# 22 — UX audit tool (`tools/ux-audit/`)

One command opens every page of the site in headless Chrome (laptop 1440x900 on all pages, 1280x720 and 1920x1080 on the main pages, and an iPhone 390x844 on all pages — the iPhone user agent makes `src/proxy.ts` serve the `/m` app pages, so it tests what a visitor really gets) and writes the problem list.

## Use
```
npm run build                       # or NEXT_DIST_DIR=.next-audit npm run build   (a second build next to the dev server's .next)
NEXT_DIST_DIR=.next-audit npx next start -p 1012
npm run ux:audit -- http://localhost:1012            # all pages, 3 Chrome windows (~35 min)
npm run ux:audit -- http://localhost:1012 --only=phone --paths=/about,/contact
npm run ux:report                                    # rebuild the lists from the saved .task-log/ux-audit/raw.jsonl
```
Git Bash rewrites `/about` into a Windows path: prefix `MSYS_NO_PATHCONV=1` when you pass `--paths`. A build rewrites `tsconfig.json` (formatting only): `git checkout tsconfig.json` before committing.

## Output (`.task-log/ux-audit/`, not committed)
- `PROBLEMS.md` — one line per problem: id | severity | rule | device + width | page | element | text | what is wrong | fix.
- `SUMMARY.md` — totals by category / rule / page, slowest first screens. `summary.json` — same numbers for before/after.
- `INVENTORY.md` — per page: buttons, button-style links, links, fields, images, headings, paragraphs, words; and **every button label with its word count**.

## Files
| File | Job |
|---|---|
| `run.mjs` | pages from `/sitemap.xml`, viewports, Chrome pool, writes `raw.jsonl` |
| `inpage.js` | runs inside the page: scroll, measure, all checks, inventory |
| `rules.mjs` | rule catalogue (id, category, severity, title, fix) — add a rule here and in `inpage.js` |
| `report.mjs` | merges viewports, writes the four files |
| `cdp.mjs` | Chrome DevTools driver; skips the 3 first-visit windows (theme welcome, welcome gate, name question) |

Rule groups: UI (looks), UX (works), CX (what the visitor understands), A11Y, SEO, PERF, MOB (phone only). A line counts one element on one page and device; the same hit on three laptop sizes is one line.
Thresholds: laptop body 16px / label 14px / target 24px; phone body 15px / label 12px / target 44px.

## Fix loop (audit -> generate -> build -> audit again)
`inpage.js` also returns a CSS cure for every font-size / line-height / contrast / tap-target problem. `node tools/ux-audit/fixgen.mjs --from=<audit dirs>` writes them as plain CSS (one rule per element class, `html` in front so it wins):
`src/styles/ux-auto.css` (laptop), `src/styles/ux-auto-phone.css` (laptop-site pages on a phone, inside `@media (max-width: 767px)`), `src/app/(m)/ux-auto.css` (phone app). **Do not edit these by hand.** Hand-written site-wide fixes are `src/styles/ux-fixes.css` and `src/app/(m)/ux-fixes.css`.
Colour cure = same hue (written as `var(--th) + offset`, theme rule kept), only lightness moves until the text passes 4.5:1. What the generator cannot aim at (no class, tiny dots) goes to `MANUAL.md` in the audit folder.
Several audits can be merged (`--from=a,b`): the strongest cure wins, so the loop only adds rules until the audit is clean.
