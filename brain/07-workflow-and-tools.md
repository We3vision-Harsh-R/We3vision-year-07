# 07 — Workflow, tools and pitfalls

## Machine and folders
- Windows 11; the owner uses VS Code/Claude Desktop. Shells: Git Bash and PowerShell 5.1 (no `&&` in PowerShell).
- **Repo / working folder:** `D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07` (git, remote
  `We3vision-Harsh-R/We3vision-year-07`, branch `main`). `.claude/worktrees/` is git-ignored session scratch space — never the place for
  real work. `node_modules` exists only in the main folder.
- The Claude Desktop app may open a session in a worktree and a hook then blocks edits in the main folder. Preferred fix: ask the owner
  to open the session on the main folder. If you must use a worktree: **merge**, never blindly copy (next section).

## The clobber incident (2026-10-13) — read this
The worktree was created before teammate Jenish's chatbot commit. Copying the worktree's `globals.css` into the main folder wiped the
chatbot's `.pd-*` CSS from the working tree. It was caught with `git diff --numstat` (135 deletions) and repaired with a 3-way merge
(`git merge-file head base mine`). Rules that follow:
1. Before copying any file between folders, compare with HEAD: `git diff --numstat -- <file>` (unexpected deletions = stale copy).
2. For `globals.css` (huge, edited by several people) always use `git merge-file` with the task-start copy as base
   (`.task-log/<n>/before/src/...`), never `cp`.
3. After a sync run `git diff --stat` in the main folder and look for deletions you did not intend.

## Run it
```bash
npm install              # also runs prisma generate (postinstall)
npm run dev              # http://localhost:1010   (Turbopack). Admin: /admin
npm run typecheck        # tsc --noEmit
npx eslint src/components/site/modern src/components/site/sections   # lint a folder (react-hooks/refs is enforced)
npm run build            # next build --webpack — only when the owner asks
```
`.claude/launch.json` defines a "dev" server (node `next dev` on the main folder, port 1010) for Claude's preview tools.
`next.config.ts` allows LAN origins in dev (`192.168.*.*`, `10.*.*.*`) so phones on the same Wi-Fi can open `http://<PC-IP>:1010`.
Restart the dev server after: `.env` change, `prisma generate`, new migrations.

## Testing in the browser (Claude preview/Browser pane or Playwright)
- Set the viewport first: width 1440, height 900 (the pane otherwise reports width 0); reset to desktop at the end.
- After editing, reload; Fast Refresh sometimes leaves a stale 500 overlay — do a full navigation.
- Pages are long and pinned; scroll with Lenis, not `window.scrollTo`:
  `window.__lenis.scrollTo(el.getBoundingClientRect().top + scrollY - 40, {immediate:true, force:true})`. Element positions shift as
  lazy/pinned sections measure themselves, so compute the target again right before scrolling.
- Screenshots lag one frame and word-by-word headings (`.sh`) need ~1 s to reveal: wait, then capture. rAF stalls when the pane is
  hidden: for time-based motion patch `requestAnimationFrame` with `setTimeout`.
- Dev hooks: `window.__sceneSeek(p)` / `__sphereSeek(t)` / `__sphereSim(s)` (Home hero), `window.__aw` (About world),
  `window.__vr` (Metaverse scene), `?cam` on Home (industries camera tuner, hidden in code).
- Admin screens are login-gated: they can usually only be compile/redirect-checked. Say so in the report.
- Check console + dev-server logs (`preview_logs`) for hydration errors, "Encountered a script tag" (always a side-effect of a 500).

## Numbered tasks and the revert tool
```bash
node tools/tasks.mjs begin 75 "Short title"   # snapshot src/ before the task   (.task-log/75/before)
node tools/tasks.mjs end 75                   # build the patch of the task    (.task-log/75/task.patch) + update TASKS.md
node tools/tasks.mjs revert 75                # undo exactly that task (only its lines; refuses if a later task touched the same lines)
node tools/tasks.mjs redo 75
node tools/tasks.mjs list
```
- Run from the main folder (the tool also copes with a worktree). `.task-log/` is git-ignored: patches live on this PC.
- Next free number: look at the last row of `TASKS.md` (74 was the last on 2026-10-13).
- The owner reverts by sending only a number ("57"). Run revert, run tsc, tell them what came back.

## Database & migrations
- Prisma 7 with `prisma.config.ts`; client generated to `src/generated/prisma`. `prisma migrate deploy` could **not** reach the DB
  from the owner's PC (error P1001), so migrations were applied with a small node/`pg` script: execute the migration SQL against
  `DIRECT_URL`, then insert a row in `_prisma_migrations` (name, checksum, finished_at) so Prisma stays consistent. Then
  `npx prisma generate` and restart the dev server.
- Production DB is the same Supabase project the owner uses from localhost — treat data changes as live.
- Pages are **not** seeded into the DB: until a page is published in the admin, the code defaults in `content/*.ts` are shown.
- First admin: `npm run db:seed` (reads `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`). Only company-domain e-mails are accepted.

## Git and deployment
- The owner commits/pushes. Commit style used so far: short messages ("design update", "job page", "update"). Do not commit unless asked.
- Push to `main` → Hostinger builds (`npm run build`, `npm start`, Node 20.12+/22) and redeploys. Env vars live in hPanel.
- Line endings: Windows `core.autocrlf` warnings are harmless. Do not reformat files.
- Never commit: `.env`, `.env.hostinger`, `.task-log/`, `.claude/worktrees/`.

## Editing tips for AI tools on this repo
- `globals.css` is ~31 000 lines: use `Grep` for a prefix; append new blocks at the end; patch existing rules with exact-string
  replacement scripts (write the script to a file first — here-docs with quotes break in this shell).
- `services.ts` is 90 KB and `tech.ts` 42 KB (long SEO copy): edit by searching a unique string, do not rewrite the file.
- Keep `RENDERERS` exhaustive; keep `SECTIONS.defaults` valid JSON-able data.
- Typecheck and lint after every change set; the lint rule `react-hooks/refs` forbids passing `useRef` objects as props.
- Use `React.CSSProperties` casts for custom properties (`style={{"--i": i} as React.CSSProperties}`).
- `git diff --stat` before you finish to confirm only intended files changed.

## External services & references
- Old site (content): https://www.we3vision.com (hash routes). Sitemap lists every old page.
- GeoNames city list (`public/data/cities.json`, CC BY 4.0) is used by the Careers location picker — keep the credit.
- shadcn/ui docs for future component work: https://ui.shadcn.com/docs/components (not installed).
- Framer templates used only as visual references (never copied): AIgenius (site theme), aigentx (particle sphere), Bungee (brand
  hero/arch gallery), Aset (7W backdrop idea, since removed).

- Speed tools (2026-10-16): `node tools/build-weight.mjs` (first-load JS/CSS per page, after a build), `chunk-report.mjs` (what is inside the chunks; build with `ANALYZE_STATS=1`), `client-graph.mjs`, `lazy-codemod.mjs`, `css-split.mjs`, `style-diff.mjs`. Use `MSYS_NO_PATHCONV=1` in Git Bash when a tool takes a /path argument. In a worktree Turbopack cannot follow a node_modules junction: use `next dev --webpack` or `next start`.
