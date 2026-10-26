# 21 — Git: how two people work on `main` without losing code

Two people (Harsh and Jenish) push to the SAME branch `main`, and a push to `main` deploys the site on Hostinger. So the rules are simple and strict.

## Every day (3 commands)
| What | Command |
|---|---|
| See where I am (new code from the team? my unsaved files?) | `npm run git:status` |
| Get the team's new code (before I start working) | `npm run git:pull` |
| Send my work: commit + pull the team's code + type check + push | `npm run git:push -- "what I changed"` |
| Only commit my work (no pull, no push) | `npm run git:save -- "what I changed"` |

What `git:pull` does: fetches, puts my uncommitted files aside, MERGES the team's commits into mine (a normal merge: nothing is rewritten or lost), puts my files back, runs `npm install` if `package.json` changed.
What `git:push` does: commit, pull (as above), `tsc --noEmit`, then `git push origin main`. If the push is refused (the other person pushed a second ago) just run it again.

## If both of us changed the same lines (a conflict)
The tool stops, lists the files and tells what to do. Open each file, search for `<<<<<<<`, keep the right lines (with `merge.conflictstyle=diff3` it also shows the original), then `git add -A && git commit --no-edit` and run `git:push` again. To cancel the whole pull: `git merge --abort`.

## Rules
1. **Pull before you start** and before you push (the tool does it for you).
2. Commit small and often, with a message that says what changed. Never `git push --force`, never `git reset --hard` on a shared branch.
3. Do not edit the same file at the same time if you can avoid it (CSS: `globals.css` is the usual collision: put new rules at the end, with your own prefix).
4. Before a push that changes code run `npm run build` once (a broken build goes live).
5. One version number per finished update: add the entry at the top of `src/lib/version.ts` (see `we3-release`), and tag after the push.
6. Work in the main project folder, not in `.claude/worktrees/*`.

## One-time setup (already done in this folder)
`git config pull.rebase false` (pull = merge), `pull.ff true`, `fetch.prune true`, `push.default current`, `push.autoSetupRemote true`, `merge.conflictstyle diff3`. On Jenish's computer run the same lines once (or copy `tools/git-sync.mjs` usage: it works with the defaults too).

## Safer way for the future (optional)
A person who is not sure of a change can work on a branch (`git switch -c jenish/my-change`), push that branch, and the other merges it into `main` on GitHub (Pull Request). `main` then only gets reviewed work. The tool above is for the normal case: both on `main`.
