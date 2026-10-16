# 03 — Architecture

## Folder map
```
brain/                      this documentation (read first)
prisma/                     schema.prisma, migrations/, seed.ts (first admin)
public/                     brand/ (logos), images/ (blog, industries, showcase…), data/cities.json (GeoNames, CC BY 4.0)
design-assets/              source art (guide character sheet, logo)
tools/tasks.mjs             numbered revertable tasks (see 07)
src/
  app/
    (site)/                 PUBLIC website. layout.tsx = background, cursor, nav, footer. One folder per route (static folders, no [sub])
    admin/                  ADMIN: login/, (panel)/ dashboard, pages, settings, leads, projects, blog, team, careers, access
    api/admin/upload        picture upload (admin only);  api/careers/resume = resume upload;  media/[id] = serves Media rows
    globals.css             ~31 000 lines: the entire design (see 05)
    robots.ts sitemap.ts layout.tsx (Poppins) icon.png apple-icon.png
  actions/                  server actions = backend: auth, pages, settings, leads, projects, blog, team, careers, jobs, admin-access
  components/
    site/                   public UI. sections/ = one renderer per section type. modern/ = redesigned look + variants. about/, metaverse/, career/ = feature folders
    admin/                  admin UI (page-editor, fields-editor, project-form, team-manager, seat-picker, careers-*, blog-form…)
  lib/
    cms/                    sections.ts, pages.ts, fields.ts, settings.ts, queries.ts, page-route.tsx, content/*.ts (default content)
    auth.ts session-token.ts db.ts rate-limit.ts request.ts format.ts theme.ts
    projects.ts blog.ts team.ts careers.ts (+ *-shared.ts without server-only imports, blog-posts.ts built-in articles)
    ai-chat.ts              PANDA chatbot client (Jenish)
  generated/prisma          created by `prisma generate` (gitignored)
  proxy.ts                  guards /admin (middleware in Next 16)
```

## The CMS in one minute
- A **page** = ordered list of **sections** `{ id, type, data }`. Registered in `PAGES` (`src/lib/cms/pages.ts`) with default SEO and
  `defaultContent` (from `src/lib/cms/content/<page>.ts`).
- A **section type** is defined **once** in `SECTIONS` (`src/lib/cms/sections.ts`): `{ label, fields, defaults }`. Field kinds
  (`fields.ts`): `text`, `textarea`, `url`, `image`, `group`, `list`. That single definition drives the admin form, the server-side
  sanitising (`normalize`) and the default data. `SectionType`/`SectionData` types are derived from it.
- **Renderers**: `src/components/site/sections/index.tsx` has `RENDERERS: { [T in SectionType]: SectionComponent<T> }` — TypeScript
  fails the build if a type has no renderer. `PageSections` renders `{ sections, site, skin, page }`; each renderer receives
  `{ data, site, sectionId, skin, page, projects }`.
- **Skin**: `"classic"` (Home, About, Metaverse, Brand Design, Contact… earlier look) or `"modern"` (the service pages + list pages),
  decided by `skinOf(slug)` in `src/lib/cms/page-route.tsx` (`MODERN` list). `page` = the slug; renderers use it to pick designs.
- **Draft vs published**: editor saves a draft; visitors see `published`. Publish snapshots a `PageVersion` (latest 10 kept, restorable).
  Public pages are cached; Publish revalidates instantly. DB unreachable → Next keeps the last good cached page (queries *throw* on
  DB errors on purpose). No `DATABASE_URL` or no published row → the built-in default content is shown.
- **Settings** (`src/lib/cms/settings.ts`, table `Setting` key `site`): company name, floating menu, big menu, footer columns, contact
  cards, social, badges. Edited at `/admin/settings`.

## Database (Prisma 7, Postgres)
Models: `AdminUser`, `Page`, `PageVersion`, `Setting`, `Lead`, `Media` (picture/resume bytes), `Project` (portfolio; `group` "brand" =
Brand page arches), `BlogPost`, `TeamMember` (with seat), `CareerRole`, `CareerQuestion`, `CareerApplication`.
Migrations (in `prisma/migrations`): init, media_projects, blog_posts, team_members, team_seat, careers, career_jobs.
All tables have RLS on with no policies (Supabase public API cannot read them); only this server can.
Rules: read helpers in `lib/*.ts` return built-in data without a DB and **throw** on DB errors. Migrations are never auto-run on deploy.

## Auth & security
- bcrypt password, signed httpOnly cookie, login rate-limit, `requireAdmin()` at the top of every admin page and action,
  `src/proxy.ts` first line of defence, admin accounts limited to the company e-mail domain (`lib/admin-access.ts`).
- Editor content is sanitised on the server (types, lengths, safe links); no raw HTML is stored/rendered.
- Contact form: honeypot + 5 messages/hour/IP (`actions/leads.ts`). Security headers + `noindex` for `/admin` and `/preview` in `next.config.ts`.
- Uploads: picture resized to webp in the browser, re-checked on the server; resumes checked by magic bytes, only downloadable.

## How to…
**Add a section type**: define in `SECTIONS` → component in `sections/<name>.tsx` → register in `sections/index.tsx`.
**Add a page**: entry in `PAGES` (+ content in `content/<page>.ts`) → `src/app/(site)/<path>/page.tsx` using `renderPage(slug)` and
`pageMetadata(slug)` from `page-route.tsx` → add slug to `MODERN` if it should use the modern look → it appears in Admin → Pages.
(Use plain static route folders; a dynamic `[sub]` route crashed the dev worker.)
**Add a field to a section**: add to its `fields` and `defaults` in `sections.ts`; the admin form appears automatically.
**Add a tech/tool description** (pop-ups, variants): `src/lib/cms/content/tech-details.ts` (`techDetail(name)`).
**Add a DB model**: edit `schema.prisma` → new folder in `prisma/migrations` (SQL by hand) → apply (see 07) → `prisma generate` →
restart dev server.
**New global CSS**: append a commented block with a fresh prefix at the end of `globals.css`.

## Data flow of a public request
`(site)/<route>/page.tsx` → `renderPage(slug)` → `getPublishedPage(slug)` + `getSiteSettings()` → `PageSections` → renderer per
section → client components for animation. Sections that need projects (`projects`, `archGallery` with a group) trigger `getProjects()`.
