# 10 — Starter prompt for any AI tool

Paste the block below as the **first message** in a new session (Claude Code, Cursor, Codex, Copilot Chat, Gemini CLI, ChatGPT with
the folder attached…). Tools that read `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` already get a short version of it automatically.

```
You are continuing the production website + admin CMS of We3vision Private Limited (Next.js 16, React 19, Tailwind 4, Prisma 7 +
Supabase). Before you answer or edit anything, read these files completely, in order:

  brain/00-START-HERE.md
  brain/02-rules-and-preferences.md
  brain/03-architecture.md
  brain/04-pages-and-sections.md
  brain/05-design-system.md
  brain/07-workflow-and-tools.md
  (and brain/06-service-page-variants.md, brain/08-task-history.md, brain/09-open-items.md when the task touches them)

Then:
- Work ONLY in the main folder (the git repo). Do not commit, push or run a production build unless I ask.
- Touch only what my message names. The Home page "/" and the locked sections listed in brain/02 must not change.
- Desktop/laptop only (no mobile code). Poppins font. Paragraph >= 16px, labels >= 14px.
- Never hard-code violet/pink colours: use hsl(calc(var(--th) + N) calc(S% * var(--ts)) L%).
- I write romanized Gujarati/Hinglish. Reply in the same simple Gujarati-English style, short.
- Number every big task with `node tools/tasks.mjs begin N "title"` ... `end N`, then update brain/08-task-history.md and
  brain/09-open-items.md.
- Verify with `npx tsc --noEmit`, eslint on the changed folders and the browser at 1440x900; tell me what you could not verify.

Confirm in 3 lines what you understood (project, my top rules, next task number), then wait for my task.
```

## Extra context to give when relevant
- A screenshot with red/blue/green marks = layout instructions (red = tag, blue = heading/text, green = list…).
- "Lock" means: never edit without asking. "Revert N" means: `node tools/tasks.mjs revert N`.
- If the AI tool cannot run commands, give it the files listed above and let it return unified diffs; apply them in the main folder.

## When the AI tool has no file access (chat only)
Upload/paste: all `brain/*.md`, `src/lib/cms/sections.ts`, `src/lib/cms/pages.ts`, and the files of the page being changed. Ask for
complete files or exact find/replace blocks, never "rewrite the whole file" for `globals.css`, `services.ts` or `tech.ts`.
