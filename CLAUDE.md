@AGENTS.md

# Claude Code notes

- Start every session by reading `brain/00-START-HERE.md` and `brain/02-rules-and-preferences.md` (the full index is `brain/README.md`).
- Use the main repo folder, not a `.claude/worktrees/*` copy; if a worktree is unavoidable, merge instead of copying files.
- After a task: update `brain/08-task-history.md` and `brain/09-open-items.md`.
- For any speed/optimization/"advanced level" task read `brain/11-optimization.md` and `brain/12-skills-and-speed-plan.md` first: they list which skills to use (audit-suite perf/frontend, vercel-react-best-practices, parallax ship-check/memcheck, searchfit-seo, code-review/simplify) and the plan "load only what the screen needs, the rest on scroll/click". Verify every CSS/JS change with `node tools/style-diff.mjs diff <old-url> <new-url>`.
- Optimization = branch `optimize` + the method, ledger and approval rules in `brain/15-optimization-handbook.md` (ask the owner before each phase).
