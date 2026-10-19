<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:we3vision-brain -->

# We3vision project brain — READ `brain/` FIRST

This repository is the production website + admin CMS of We3vision Private Limited. All project knowledge (rules, architecture,
design system, history, open items) is in the **`brain/`** folder. Before any edit read, in order:
`brain/00-START-HERE.md` → `brain/02-rules-and-preferences.md` → `brain/03-architecture.md` → `brain/04-pages-and-sections.md` →
`brain/05-design-system.md` → `brain/07-workflow-and-tools.md` (and `06`, `08`, `09` when relevant). Index: `brain/README.md`.

Non-negotiable rules (details and reasons in `brain/02-rules-and-preferences.md`):
- Work in the main repo folder; commit and push every finished task to `main` only (no side branches; typecheck + eslint + `npm run build` first, a push deploys); never print secrets.
  EXCEPTION (owner, 2026-10-16): speed/optimization work goes to the branch `optimize`, never straight to `main`; read `brain/15-optimization-handbook.md` first, and ASK the owner before starting each optimization phase.
- Change only what the task names. Home page `/` and the former locked sections (service strip, TechSpace pop-up, Industries city) were UNLOCKED by the owner on 2026-10-19; they are finished designs, so still change only what the task names.
- Desktop/laptop only (no mobile/responsive code). Poppins font. Paragraphs ≥ 16px, labels ≥ 14px.
- Never hard-code violet/pink: use `hsl(calc(var(--th) + N) calc(S% * var(--ts)) L%)` or the Tailwind tokens. New CSS = new unique
  prefix appended at the end of `src/app/globals.css`.
- Content comes from www.we3vision.com; never invent numbers/testimonials/clients.
- Number big tasks with `node tools/tasks.mjs begin N "title"` … `end N`; update `brain/08-task-history.md` afterwards.
- The owner writes romanized Gujarati/Hinglish: answer in the same simple Gujarati-English style, short.

<!-- END:we3vision-brain -->
