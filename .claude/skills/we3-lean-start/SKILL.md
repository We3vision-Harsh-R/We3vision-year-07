---
name: we3-lean-start
description: Start any We3vision task with the fewest tokens. Use at the beginning of every task in this repo, before reading files.
---

# Lean start (saves tokens)

1. Read ONLY `brain/00-START-HERE.md` (golden rules) and the last 15 lines of `brain/08-task-history.md`. Open `brain/02`, `03`, `04`, `05` only for the part the task touches (use Grep on the brain folder first).
2. Never read a big file whole. `src/app/globals.css` (11k+ lines), `fest-engine.ts`, `timeline-office.tsx`, `mega-menu.css`: Grep for the class or function, then Read with offset/limit.
3. Find before you open: `Grep -l` the class prefix (`fo-`, `fs-`, `pfb-`, `fh-`, `mm-`, `ft-`) to see the owning file.
4. Work in the MAIN folder (the git repo), never a `.claude/worktrees/*` copy. Write files with Bash (`cat > file <<'EOF'`) or a node patch script; the Write/Edit tools are blocked for the main path by a hook.
5. Long patches: write ONE node script that does exact `replace` with "not found / not unique" checks, run it once, then `npx tsc --noEmit` + `npx eslint <changed folders>`.
6. Answer in short Gujarati-English. Do not push or commit unless the owner says so.
7. Do not re-screenshot after every tiny change; take one screenshot per finished piece (see `we3-verify-ui`).
