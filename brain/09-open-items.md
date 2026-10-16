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
