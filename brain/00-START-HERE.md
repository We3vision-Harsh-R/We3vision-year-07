# 00 — Start here (1-page briefing)

> **Continuing design work or a new chat? Read [19-design-decisions-and-handoff.md](19-design-decisions-and-handoff.md) and [18-website-test-master-table.md](18-website-test-master-table.md) right after this page** (decisions made 2026-10-19, what is done, what is open, paste prompt).

## What this project is
The production website **and** admin CMS of **We3vision Private Limited** (Surat, India — web, app, AI, metaverse, UI/UX, CRM, SEO,
animation and brand-design agency). One Next.js 16 app: public site + `/admin` panel + server actions. Dark violet theme, Poppins font,
heavy scroll-driven 3D/animated sections. The site celebrates "7 years of We3vision" (the "7" mark is the brand motif). Details:
[01-project-overview.md](01-project-overview.md).

## The 14 golden rules (reasons in [02-rules-and-preferences.md](02-rules-and-preferences.md))
1. **Work in the main folder** `…/We3vision-year-07` (the git repo). Never edit in a `.claude/worktrees/*` copy and then copy files over —
   stale copies overwrite newer work (this already destroyed the chatbot CSS once; see [07](07-workflow-and-tools.md)).
2. **Touch only what the task names.** Finished work stays exactly as it is.
3. **Home page `/` is UNLOCKED (owner, 2026-10-19).** It is a finished design: change only what the task names, and check shared code (footer, nav, background, glow edge, glass cards, headings) before changing it.
4. **Former locked sections** (`service-strip.tsx`, TechSpace pop-up `.tx-*`, Industries 3D city) were UNLOCKED on 2026-10-19; same care as Home.
5. **Desktop/laptop only.** Write no mobile/responsive code, do not "fix" phone layout (the owner does mobile separately).
6. **Readability:** paragraphs ≥ 16px, chips/labels ≥ 14px, good contrast. Font is **Poppins** only.
7. **Theme rule:** never hard-code a violet/pink colour. Use `hsl(calc(var(--th) + N) calc(S% * var(--ts)) L%)` or the Tailwind tokens.
8. **New styles go in plain CSS in `src/app/globals.css`** (new unique class prefix). Tailwind arbitrary classes are unreliable here.
9. **Content comes from the old site www.we3vision.com** — never invent numbers, testimonials, clients or prices.
10. **Commit and push every finished piece of work to `main` only** (owner's order, 2026-10-16: one branch, no side branches). A push auto-deploys on Hostinger, so before it run `npx tsc --noEmit`, eslint on the changed folders and `npm run build` (webpack); never push a broken build.
11. **Never write secrets** (passwords, keys, `.env` values) into chat, code or docs.
12. **Do not use the paid image-generation tool.** Draw art with SVG/CSS/code.
13. **Do not end every reply with the same open question**; mention an open item once, only if relevant.
14. **Every big task is numbered and revertable**: `node tools/tasks.mjs begin N "title"` … `end N`. The owner sends a number to undo it.

## Workflow for a task
1. Read the request (the owner writes romanized Gujarati/Hinglish, often with annotated screenshots). Reply in the same simple
   Gujarati-English style.
2. Check [04](04-pages-and-sections.md) for the page/files, [02](02-rules-and-preferences.md) for locks.
3. Check the old site (www.we3vision.com) if the task is about content of a page that is new.
4. `node tools/tasks.mjs begin <next number> "<title>"`.
5. Edit with small, targeted changes. New CSS = appended block with a new prefix at the end of `globals.css`.
6. Verify: `npx tsc --noEmit`, `npx eslint <changed folders>`, then look at it in the browser at 1440×900 (see [07](07-workflow-and-tools.md)).
7. `node tools/tasks.mjs end <number>`; update [08-task-history.md](08-task-history.md) and [09-open-items.md](09-open-items.md).
8. Report: what changed, what was verified, what was NOT verified (admin screens are login-gated), caveats. Short.

## Quick facts
- Dev server: port 1010 (`.claude/launch.json` or `npm run dev`). Admin: `/admin` (login needs the seeded admin; credentials are in `.env`, never print them).
- Next.js here is **newer than your training data** (v16, React 19, Tailwind 4, Prisma 7, TypeScript 6). Read
  `node_modules/next/dist/docs/` before using an API you are unsure about (see `AGENTS.md`).
- Page content defaults live in `src/lib/cms/content/*.ts`; the admin overrides them from the database after "Publish".
- 31 000+ lines of CSS in `src/app/globals.css` — grep for the prefix, do not read it whole ([05](05-design-system.md) has the registry).
