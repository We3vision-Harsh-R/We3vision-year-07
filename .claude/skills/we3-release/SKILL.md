---
name: we3-release
description: Version number, checks, build, commit, tag and push of a finished We3vision update. Use when an update is finished or when the owner says to push.
---

# Release (only when the owner says "push")

1. **Version:** add ONE entry at the top of `VERSION_LOG` in `src/lib/version.ts` (next number after the first entry; date, short title, plain notes). The footer chip, the admin sidebar and Admin > Versions follow by themselves.
2. **History:** append the task to `brain/08-task-history.md`; update `brain/09-open-items.md` if something is left.
3. **Checks:** `npx tsc --noEmit`, `npx eslint <changed folders>`, `npx vitest run` (two timeouts in `ai-content/server/mcp.test.ts` are a known flake, not ours).
4. **Build:** `npm run build`. If it dies with `uncaughtException ... reading 'length'`, run `rm -rf .next` and build again (stale dev cache). Stop the dev server first.
5. **Commit** on `main` with the message ending in the attribution line of the session; **tag** `git tag v<N>`; `git push origin main` then `git push origin v<N>`. A push deploys to Hostinger.
6. Never print secrets. Never push on your own: only when the owner asks.
