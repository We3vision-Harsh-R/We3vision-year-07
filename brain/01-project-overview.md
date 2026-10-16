# 01 — Project overview

## Company and goal
- **We3vision Private Limited**, Surat, India (HQ: 1/936 A, Ishwar Sadan, Bhim Kachchhi Mohallo, Nanpura, Surat 395001; +91 7383216096;
  info@we3vision.com). Germany office: Zum Lahnberg 64, Marburg 35037; +49 1516 2774145; germany@we3vision.com.
  LinkedIn `/company/we3visioninfotech/`, Instagram `we3vision_private_limited`, Dribbble `Harsh_Ramoliya`.
- Services: Web development, Mobile apps, AI development, Metaverse (AR/VR/MR/XR), UI/UX, CRM, 2D/3D animation, graphic design,
  3D modeling, SEO, Brand identity, plus technology pages (headless CMS, WordPress, Shopify, WooCommerce, Shopify app, WP plugin).
- Goal: a production-grade redesign of www.we3vision.com ("year 07" edition) that looks unique, polished and "smart" (not template/AI
  looking), with every page editable from an admin panel. The staging/target host is `07.we3vision.com`.
- Content source: the old site **https://www.we3vision.com** (client-side React SPA; hash routes like `/#/about`; sitemap
  `/sitemap.xml`). The old site has **no** statistics, testimonials or process section — never invent them.

## Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack dev, `next build --webpack` for production), React 19 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS 4 for utilities **plus** a very large hand-written `src/app/globals.css` (the real design lives there) |
| DB | PostgreSQL on Supabase (project ref `nuoiqvqixquectcsxxyd`, region ap-southeast-2) via Prisma 7 + `@prisma/adapter-pg` |
| Auth | Own admin login: bcryptjs + `jose` signed httpOnly cookie, `src/proxy.ts` guards `/admin`, every action re-checks `requireAdmin()` |
| Motion | Lenis smooth scroll (`window.__lenis`), CSS animations, three.js (`three` 0.180) for 3D scenes, cobe (dotted globe), canvas |
| Validation | zod 4 |
| Hosting | Hostinger Node.js web app, GitHub auto-deploy: **push to `main` = live** |
| Repo | `https://github.com/We3vision-Harsh-R/We3vision-year-07` (branch `main`) |

Supabase JS/SSR packages are **not** installed on purpose (the admin uses its own login). Some `SUPABASE_*` names exist in
`.env.example` for future use.

## Environment variable names (values are secret — never print them)
`DATABASE_URL` (pooler, 6543), `DIRECT_URL` (direct, 5432, migrations/seed), `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`,
`ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` (seed only), `NEXT_PUBLIC_CHATBOT_API_URL` (PANDA chatbot backend),
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`. Files: `.env` (real, gitignored), `.env.hostinger` (upload copy, gitignored),
`.env.example` (placeholders, committed). If `.env` changes while the dev server runs → restart the dev server (cached Prisma client).
Without `DATABASE_URL` the site runs with built-in default content (the admin then cannot work).

## People
- **Harsh** (owner/lead developer, git user "Harsh - We3vision Private Limited") — gives the tasks, writes Gujarati/Hinglish.
- **Jenish** (`mrjenu7`) — integrated the **PANDA AI chatbot** (commit "Jenish Integrate AI Chatbot"): `src/lib/ai-chat.ts`,
  `src/components/site/ai-chat.tsx`, CSS `.pd-*` in `globals.css`. Backend is external, reached via `NEXT_PUBLIC_CHATBOT_API_URL`
  (`POST /api/chat`, `GET /api/chat/services`). Do not break these files.
- The owner builds the **mobile/tablet** versions separately.

## Admin panel (`/admin`)
Login → dashboard with: **Pages** (section editor with draft/publish/versions + SEO + preview), **Settings** (menus, footer, contact
cards, social), **Leads** (contact form messages), **Projects** (portfolio + picture upload), **Blog**, **Team** (people + seat
picker for the 3D office), **Careers** (jobs, applications, questions/setup), **Access** (admin users limited to the company e-mail
domain + login-page picture). Pictures are resized to webp in the browser and stored **in the database** (table `Media`, served at
`/media/<id>`).

## Brand facts
Dark theme, violet default hue 284 (visitors can re-colour the whole site with the theme picker), Poppins, glass cards with glowing
borders, panda mascot **"Pando"** (About page world, At-a-glance, chatbot name PANDA = Professional AI Navigation & Digital Assistant),
founders Smit, Harsh, Vatsal (+ Parth joined 2023) shown as avatars on the About timeline.
