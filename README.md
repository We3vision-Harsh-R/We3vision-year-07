# We3vision website + admin panel

One Next.js app: the public website, the admin panel (`/admin`) and the backend (server actions) all live here.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Prisma 7 + PostgreSQL (Supabase) · Lenis smooth scroll.

**Design:** the "AIgenius" Framer template look (dark violet #0d0316, DM Sans, gradient headings, blueprint frame lines, stars, glowing horizon, bottom floating menu), rebuilt in our own code (no template files copied). Content, URLs and images come from the old site www.we3vision.com. Use `*stars*` in the Story text to highlight words.

## Folder structure

```
prisma/                     schema.prisma, migrations/, seed.ts (first admin login)
src/
  app/
    (site)/                 PUBLIC website  ->  page.tsx = home, preview/[slug] = admin draft preview
    admin/                  ADMIN PANEL     ->  login/, (panel)/ dashboard, pages, settings, leads
    robots.ts  sitemap.ts   SEO
  actions/                  server actions = the backend (auth, pages, settings, leads)
  components/
    site/                   website UI (header, footer, contact form, sections/*)
    admin/                  admin UI (page editor, field editor, nav)
  lib/
    cms/                    sections.ts (section types + demo content), pages.ts, settings.ts, fields.ts, queries.ts
    auth.ts  session-token.ts  db.ts  rate-limit.ts
  proxy.ts                  protects /admin
```

## How the CMS works (important to understand)

* A page = a list of **sections** (hero, services, about …). Content is stored as JSON in the `Page` table.
* **One definition per section** in `src/lib/cms/sections.ts` (fields + demo content). It drives the admin form, the server-side
  sanitising and the default content. No duplicate code.
* **Draft vs published:** the editor saves a draft; visitors only see the published copy. *Publish* also keeps a version
  (last 10) that can be restored.
* The public pages are **cached**. Visitors never hit the database; *Publish* refreshes the cache instantly.
* If the database is unreachable, the site keeps serving the last good cached page (it never swaps in demo content).

### Add a new section type
1. Add it to `SECTIONS` in `src/lib/cms/sections.ts`.
2. Create `src/components/site/sections/<name>.tsx`.
3. Register it in `src/components/site/sections/index.tsx` (TypeScript errors until you do).

### Add a new page (e.g. About)
1. Add an entry to `PAGES` in `src/lib/cms/pages.ts`.
2. Create `src/app/(site)/about/page.tsx` (copy `(site)/page.tsx`, change the slug and `revalidate`).
3. It now appears in **Admin → Pages** with its own editor, SEO fields and preview. The admin needs no other change.

## Local setup

```bash
npm install                      # also runs `prisma generate`
cp .env.example .env             # fill in the values (Supabase DEV project!)
npm run db:deploy                # apply migrations
npm run db:seed                  # create the first admin (ADMIN_EMAIL / ADMIN_PASSWORD from .env)
npm run dev                      # http://localhost:3000   admin: /admin
```

Without `DATABASE_URL` the website still runs with demo content (the admin needs the database).

## Environment variables

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Supabase **pooler** string (port 6543). Used by the running app. |
| `DIRECT_URL` | Supabase **direct** string (port 5432). Migrations + seed only. |
| `SESSION_SECRET` | 32+ random characters (admin login cookie). |
| `NEXT_PUBLIC_SITE_URL` | Public URL, for sitemap / canonical links. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Only for `npm run db:seed`. |

Never commit `.env`. Use **two Supabase projects**: `dev` for local work, `prod` for the live site.

## Deploy: Hostinger (Node.js app) + GitHub

1. hPanel → Websites → Add website → **Node.js Apps** → import this GitHub repo, branch `main`.
2. Build command `npm run build`, start command `npm start`, Node 20.12+ (22 recommended).
3. Add the environment variables above (use the **prod** Supabase project) in hPanel.
4. Run the database migration once against prod: `npm run db:deploy` (locally with prod `DIRECT_URL`), then `npm run db:seed`.
5. Every push to `main` redeploys. Work on a branch, test with `npm run build`, merge to `main` only when ready.

Migrations are never run automatically on deploy, so a bad migration cannot damage live data.

## Security notes

* Admin: bcrypt password, signed httpOnly cookie, login rate-limit, every admin page **and** action re-checks the session.
* All tables have Row Level Security enabled with no policies, so Supabase's public API cannot read your data. Only this server can.
* Editor content is sanitised on the server (types, lengths, only safe links). No raw HTML is ever stored or rendered.
* Contact form: honeypot field + 5 messages/hour/IP.

## Scripts

`dev` · `build` · `start` · `lint` · `typecheck` · `db:generate` · `db:migrate` (dev) · `db:deploy` (prod) · `db:seed`
