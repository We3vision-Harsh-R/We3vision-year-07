# 09 — Open items, caveats and ideas (as of 2026-10-13)

## Waiting for the owner
- **Portfolio page work** — the owner said "let's work on portfolio page" but gave no specifics. Candidate parts: hero, projects
  list/grid, single project page (`/portfolio/[slug]`), admin Projects management. Ask which one before starting.
- **TechSpace planet overlap** (option A or B, see [08](08-task-history.md)) — unanswered; mention only if relevant.
- **Real client work** for the Brand arch gallery/Portfolio: photos + text come from the owner (admin → Projects). Placeholders
  ("Project 01..30", own SVG art) are in `public/images/showcase`.
- **PANDA chatbot**: backend URL must be set in `NEXT_PUBLIC_CHATBOT_API_URL` (local `.env` and Hostinger). Ask Jenish before
  changing `ai-chat.tsx` / `lib/ai-chat.ts`.
- **Mobile/tablet versions**: the owner will do them separately — do not start.
- **Gov-project logos** (NRIDA, MOC) on Metaverse: monogram badges until logos are supplied (`gov-projects.ts` has a `logo` field).
- **Leader photos** on About/Team: initials avatars until the owner approves downloading/supplying photos.

## Known gaps / caveats
- Task 74 variants cover the 8 pages in the table only; AI, 3D modeling, tech pages, Team, About still use older designs. The Brand
  page's "What we build" strip is identical to the About page's strip.
- Admin screens (Blog, Team, Careers, Projects, Access) were only compile/redirect-checked in previews (login-gated).
- New scenes and sections were only verified at desktop widths; phone/tablet behaviour is unknown on purpose.
- GeoNames city list (CC BY 4.0) needs its credit kept visible in the Careers location picker/footer.
- Production never built in this workflow: run `npm run build` (webpack) before a release; first deploy of a new migration must be
  applied manually (see [07](07-workflow-and-tools.md)).
- `README.md` previously described the old AIgenius design; it was refreshed on 2026-10-13 — keep it short.
- Old note: Home work done on 2026-10-11 before the lock (aurora background, glass cards, border glow, Industries/Tech seams, PANDA
  bar, hub blur removal) already changed Home; task 45 in the revert tool could undo it if the owner asks.

## Ideas the owner mentioned (not started)
- AI chatbot beyond the current backend; heavier GSAP/3D animations (reference sites not given).
- Supabase Auth "in future" (admin uses own login now).
- shadcn/ui components when a new UI element is requested (check ui.shadcn.com first).
- Trending SEO keyword pass on old-site content (allowed by the content rule).

## Technology pages (task 75)
- Not yet checked in the browser by the owner: every menu/tab of the 6 pages. All 6 pages (incl. WP/Shopify dashboards, via `--tw-*` vars at the end of globals.css) follow the theme picker; default purple. Animated multi-gradient (`tgb-flow`) sits behind every 2nd section + the two dashboards.
- Shopify page has no process in the CMS text, so its Home shows a "Today" card instead of the Setup guide.
- Long lists on the tech pages scroll inside their own box (end of globals.css, `scroll-areas.tsx` adds data-lenis-prevent so the wheel scrolls the box, not the page).
- Tech pages animation pass (task 75): mini guide (avatar) appears ONLY where the owner asked: plugin IDE (walks in, presses Activate) and Shopify Home banner (+ cheers on a new order). Headless References tab has an AI box (website chatbot backend if NEXT_PUBLIC_CHATBOT_API_URL is set, else answers from the page FAQ). WP Site Health runs its checks one by one.

## Menu + new pages (task 76)
- The big menu is code-driven: `src/lib/site-menu.ts` (SERVICE_GROUPS, PRODUCT_LINKS, EXPLORE_LINKS). The footer was NOT changed (Home is locked) and still has its Technology column from the admin settings.
- New service pages (content in `content/new-services.ts`, written for SEO, no invented numbers): shopify-plugin, software, brand-development, brand-kit, brand-video, zero-to-n, meta-marketing, physical-marketing. They use the modern sections and have variant-table entries.
- Products (`content/products.ts`): /products, /products/webugmate (links www.webugmate.com), wejobs, wethink, wepresent (coming soon). The wejobs and wethink subdomains did not resolve when checked; the WeBugMate text only says what its own site says (AI-powered project and task management): the owner should add real details.
- App Development, CRM and Headless CMS stay in the Development group (not in the owner's list) so those live pages are not orphaned.
- Sitemap for people: /sitemap (src/app/(site)/sitemap/page.tsx, prefix smp-), lists menu groups + live projects/posts/jobs; also in sitemap.xml. It is not linked from the menu or footer yet (Home is locked, owner list had no Sitemap).
- SEO indexing autopilot done (task 78): see brain/10-seo-indexing.md. Owner must set NEXT_PUBLIC_SITE_URL, submit sitemap.xml in Search Console, and optionally the Google service account / INDEXNOW_KEY. Run tools/seo-audit.mjs before releases.

## Graphic Design page (task 77)
- /graphics is now a custom page (`src/components/site/graphics/graphics.tsx`, CSS prefix `gfx-`), same CMS text as before (read through `tech/data.ts`). The old "Build a brand" guide scene (the cartoon guide at a brand board) is no longer on this page.
- Industries = a painted town drawn with **p5.brush** (https://github.com/acamposuribe/p5.brush, MIT) on top of p5 2.x: `graphics/brush-town.tsx`. npm packages `p5` and `p5.brush` were added to package.json (the owner must run `npm install` on the server / Hostinger build). The town repaints when the colour theme changes. Houses are chosen by the industry name (health, school, construction, shop, game, ads, office, home).
- Not tested yet: very small screens, 9+ industries (the town shows the first 9).

## Graphic Design page v2 (task 79)
- Text is in `content/services.ts` (GRAPHICS_*): rewritten for search (title "Graphic Design Company in Surat, India | Logo, Branding & Print Design", 12 services, keyword FAQ, Adobe Illustrator/Photoshop/InDesign named as the tools). The page also has a code-only keyword cloud and a "What is graphic design?" lesson (`graphics/learn.tsx`) and a FAQPage JSON-LD. If the owner already published an older version of /graphics in the admin, the new default text only shows after "Discard/Reset", the page layout is new either way.
- Pen-tool cursor: `html.cursor-pen` is added by the page; the `.cu-pen` svg lives in `custom-cursor.tsx` (hidden everywhere else, Home looks the same).
- Entrance curtain (`.gfx-curtain`, about 3 s, pure CSS, off for reduced motion). Town: two p5.brush canvases (ink + colour) with scroll masks; p5.brush is ONE shared object, so `brush.instance(p)` is called again in each setup/draw; the colour layer needs an opaque white ground.
- Not tested: phones/tablets, theme colours other than purple on the town, very slow GPUs (two WEBGL canvases).
