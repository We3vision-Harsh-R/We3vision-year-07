# We3vision Brain — read this folder before you touch the project

> Last updated: 2026-10-13, after task 74. Written so that **any** AI tool (Claude Code, Cursor, Codex, Copilot, Gemini, ChatGPT…) or a new
> developer can continue the project without asking the owner what was done before.

This folder is the project's memory. Everything a new AI session would otherwise have to guess is written here: what the project is, the
rules the owner (Harsh) set, how the code is organised, how the design system works, what was built and rejected, how to run and test, and
what is still open.

## Reading order

| # | File | Read it when | What is inside |
|---|------|--------------|----------------|
| 0 | [00-START-HERE.md](00-START-HERE.md) | **always, first** | One-page briefing: golden rules + workflow + checklist |
| 1 | [01-project-overview.md](01-project-overview.md) | first session | Company, stack, hosting, database, repo, people, env var names |
| 2 | [02-rules-and-preferences.md](02-rules-and-preferences.md) | **before any edit** | Every rule the owner set (locked pages, desktop only, readability, language…) with the reason |
| 3 | [03-architecture.md](03-architecture.md) | before touching code | Folder map, CMS/section system, admin panel, database, how to add a page/section |
| 4 | [04-pages-and-sections.md](04-pages-and-sections.md) | when a task names a page | Every route, its content file, its special sections |
| 5 | [05-design-system.md](05-design-system.md) | before writing CSS/UI | Theme variables, fonts, shared components, CSS prefix registry |
| 6 | [06-service-page-variants.md](06-service-page-variants.md) | when touching the 8 service pages | The "no two pages look the same" system (task 74) |
| 7 | [07-workflow-and-tools.md](07-workflow-and-tools.md) | before running/testing | Dev server, browser testing tricks, revert tool, DB migrations, git, pitfalls |
| 8 | [08-task-history.md](08-task-history.md) | to avoid redoing work | Tasks 1–74, decisions, **rejected designs (do not rebuild them)** |
| 9 | [09-open-items.md](09-open-items.md) | to know what is next | Pending requests, caveats, ideas |
| 10 | [10-seo-indexing.md](10-seo-indexing.md) | before any new page / release | Search engine autopilot, owner checklist, how to audit indexing |
| 11 | [11-optimization.md](11-optimization.md) | **any speed / optimization / "advanced level" task** | Plan, scoreboard (baseline numbers), guardrails vs the Home lock, `tools/perf-audit.mjs` |
| 11 | [11-mobile-architecture.md](11-mobile-architecture.md) | **any mobile/tablet task** | Separate phone app `src/app/(m)`, device routing, three root layouts |
| 12 | [12-skills-and-speed-plan.md](12-skills-and-speed-plan.md) | **before any speed work** | Skills to use per job, 1000 ms budget, plan A–E (route CSS, lazy on scroll/click, smoothness), what the owner gets |
| 13 | [13-mobile-app-plan.md](13-mobile-app-plan.md) | **mobile app sprint** | Plan: every page as an iOS-style app screen |
| 14 | [14-mobile-skills-map.md](14-mobile-skills-map.md) | before mobile work | Mobile skills map |
| 10 | [10-starter-prompt.md](10-starter-prompt.md) | when you open a new AI tool | Copy-paste prompt that makes any AI use this folder |

Related files outside this folder: `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` / `.github/copilot-instructions.md` / `.cursor/rules/` (they
only point here), `README.md` (setup + deploy), `TASKS.md` (numbered task list used by the revert tool).

## For Harsh (Gujarati-English)

- Navi AI tool / navo account kholo to pehla message ma `10-starter-prompt.md` no text paste karo. Bas, AI badhu aa folder mathi samji jase.
- Kai navu kaam pachhi thay to AI ne kaho: "kaam pachhi brain folder update kar" — `08-task-history.md`, `09-open-items.md` ane
  jarur hoy to biji files update thase.
- Aa folder git ma jase (GitHub ma push thay to), etle koi pan computer par kaam kari shakay.
- Locked pages/sections ni list `02-rules-and-preferences.md` ma che. Navi vastu lock karvi hoy to e file ma ek line add karavo.

## Maintenance rule for AI tools

When you finish a task: (1) add a row to `TASKS.md` through the tool (`node tools/tasks.mjs begin/end`), (2) add a short entry to
`08-task-history.md`, (3) put new rules or caveats into `02-…` / `07-…`, (4) move finished items out of `09-open-items.md`. Keep every file
factual and short; link instead of copying.
