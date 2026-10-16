# We3vision website + admin panel

Production website and admin CMS of **We3vision Private Limited** (Surat, India). One Next.js app: the public website, the admin panel
(`/admin`) and the backend (server actions) all live here.

> **Working on this project (human or AI)? Read the [`brain/`](brain/README.md) folder first.** It holds the rules the owner set,
> the architecture, the design system, the full task history and the open items. `AGENTS.md` / `CLAUDE.md` point to it too.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 + a large hand-written `globals.css` · Prisma 7 +
PostgreSQL (Supabase) · Lenis smooth scroll · three.js · own JWT/bcrypt admin login.

**Design:** dark violet theme (re-colourable by visitors with `--th`/`--ts`), Poppins, glass cards with glowing borders, scroll-driven
3D/animated sections. Content and URLs come from the old site www.we3vision.com. Details: `brain/05-design-system.md`.

## Folder structure

```
brain/                      project documentation for humans and AI tools (start here)
prisma/                     schema.prisma, migrations/, seed.ts (first admin login)
public/                     brand logos, images, data/cities.json
tools/tasks.mjs             numbered, revertable tasks (node tools/tasks.mjs begin|end|revert|redo|list)
src/
  app/
    (site)/                 PUBLIC website, one folder per route (home = page.tsx, preview/[slug] = admin draft preview)
    admin/                  ADMIN PANEL: login, dashboard, pages, settings, leads, projects, blog, team, careers, access
    api/ media/             uploads (admin pictures, resumes) and the picture/file server
    globals.css             the whole design (prefix registry in brain/05-design-system.md)
  actions/                  server actions = the backend
  components/
    site/                   website UI (sections/, modern/, about/, metaverse/, career/ …)
    admin/                  admin UI (page editor, field editor, forms)
  lib/
    cms/                    sections.ts (section types + defaults), pages.ts, settings.ts, fields.ts, queries.ts, content/*.ts
    auth.ts session-token.ts db.ts rate-limit.ts theme.ts projects.ts blog.ts team.ts careers.ts ai-chat.ts
  proxy.ts                  protects /admin
```

## How the CMS works

* A page = a list of **sections** (hero, services, process …). Defaults live in `src/lib/cms/content/*.ts`; after *Publish* in the
  admin the database copy wins.
* **One definition per section type** in `src/lib/cms/sections.ts` (fields + defaults). It drives the admin form, the server-side
  sanitising and the default content. Every type needs a renderer in `src/components/site/sections/index.tsx` (TypeScript enforces it).
* **Draft vs published**: the editor saves a draft; visitors only see the published copy. *Publish* keeps a version (last 10).
* Public pages are cached; *Publish* refreshes the cache. If the database is unreachable the site keeps serving the last good page.

### Add a section type
1. Add it to `SECTIONS` in `src/lib/cms/sections.ts`.
2. Create `src/components/site/sections/<name>.tsx`.
3. Register it in `src/components/site/sections/index.tsx`.

### Add a page
1. Add an entry to `PAGES` in `src/lib/cms/pages.ts` (content in `src/lib/cms/content/<page>.ts`).
2. Create `src/app/(site)/<path>/page.tsx` (copy a similar route; use `renderPage` / `pageMetadata` from `lib/cms/page-route.tsx`).
3. Add the slug to `MODERN` in `page-route.tsx` if it should use the modern look. It then appears in **Admin → Pages**.

## Local setup

```bash
npm install                      # also runs `prisma generate`
cp .env.example .env             # fill in the values (use a dev database if you have one)
npm run db:deploy                # apply migrations (see brain/07 if prisma cannot reach the DB)
npm run db:seed                  # create the first admin (ADMIN_EMAIL / ADMIN_PASSWORD from .env)
npm run dev                      # http://localhost:1010   admin: /admin
```

Without `DATABASE_URL` the website still runs with its built-in content (the admin needs the database).

## Environment variables

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Supabase **pooler** string (port 6543). Used by the running app. |
| `DIRECT_URL` | Supabase **direct** string (port 5432). Migrations + seed only. |
| `SESSION_SECRET` | 32+ random characters (admin login cookie). |
| `NEXT_PUBLIC_SITE_URL` | Public URL for sitemap / canonical links. |
| `NEXT_PUBLIC_CHATBOT_API_URL` | Backend of the PANDA chatbot (`/api/chat`, `/api/chat/services`). |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Only for `npm run db:seed`. |
| `SUPABASE_*`, `NEXT_PUBLIC_SUPABASE_*` | Reserved for future Supabase features (see `.env.example`). |

Never commit `.env` or `.env.hostinger`.

## Deploy: Hostinger (Node.js app) + GitHub

1. hPanel → Websites → **Node.js Apps** → import this GitHub repo, branch `main`.
2. Build command `npm run build`, start command `npm start`, Node 20.12+ (22 recommended).
3. Add the environment variables above in hPanel.
4. Apply database migrations once against the live database (`npm run db:deploy` with the live `DIRECT_URL`, or the manual script in
   `brain/07-workflow-and-tools.md`), then `npm run db:seed` for the first admin.
5. Every push to `main` redeploys. Migrations are never run automatically, so a bad migration cannot damage live data.

## Security notes

* Admin: bcrypt password, signed httpOnly cookie, login rate-limit, every admin page **and** action re-checks the session; only
  company e-mail addresses can be admins.
* All tables have Row Level Security enabled with no policies, so Supabase's public API cannot read the data.
* Editor content is sanitised on the server. No raw HTML is stored or rendered.
* Contact form: honeypot field + 5 messages/hour/IP. Uploads are re-validated on the server.

## Scripts

`dev` · `build` (`next build --webpack`) · `start` · `lint` · `typecheck` · `db:generate` · `db:migrate` (dev) · `db:deploy` · `db:seed`
