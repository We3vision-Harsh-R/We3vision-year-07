// Safe pull / push for the shared `main` branch (two people push to it: never lose work, never force).
//
//   node tools/git-sync.mjs status            where am I: branch, uncommitted files, ahead / behind
//   node tools/git-sync.mjs pull              bring the team's new code into my folder (merge, keeps my commits and theirs)
//   node tools/git-sync.mjs push "message"    commit everything I changed, pull the team's new code, then push to main
//   node tools/git-sync.mjs save "message"    only commit my work (no pull, no push)
// npm shortcuts: npm run git:status | git:pull | git:push -- "message" | git:save -- "message"
//
// Rules it follows:
//   - only on the branch `main` (the one that is deployed); it stops on any other branch
//   - never `--force`, never rewrites history: the team's commits and mine are joined by a normal merge
//   - uncommitted work is committed (push / save) or kept safe (pull stashes it, merges, and puts it back)
//   - if the same lines were changed by both, it STOPS, lists the files, and tells what to do (nothing is lost)
//   - after a pull, if package.json / package-lock.json changed it runs `npm install`
//   - before a push it runs the type check; a push deploys to Hostinger, so a broken build must not go
import { execFileSync, spawnSync } from "node:child_process";

const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trimEnd();
const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" && /^np[mx]$/.test(cmd), ...opts }); // only npm / npx need the shell on Windows (a shell would split a commit message at the spaces)
const say = (m) => console.log(`\n> ${m}`);
const stop = (m) => {
  console.error(`\n✖ ${m}`);
  process.exit(1);
};

const [mode = "status", ...rest] = process.argv.slice(2);
const message = rest.join(" ").trim();

const branch = git("rev-parse", "--abbrev-ref", "HEAD");
if (branch !== "main") stop(`You are on "${branch}". Work and push on "main" only: run  git switch main  first.`);

const dirty = () => git("status", "--porcelain").split("\n").filter(Boolean);
const counts = () => {
  const [behind, ahead] = git("rev-list", "--left-right", "--count", "origin/main...HEAD").split(/\s+/).map(Number);
  return { behind, ahead };
};
const conflicts = () => git("diff", "--name-only", "--diff-filter=U").split("\n").filter(Boolean);

function status() {
  say("fetching the team's latest from GitHub");
  git("fetch", "origin");
  const { behind, ahead } = counts();
  const files = dirty();
  console.log(`branch: main | my commits not pushed: ${ahead} | team commits not pulled: ${behind} | uncommitted files: ${files.length}`);
  if (files.length) console.log(files.slice(0, 25).join("\n") + (files.length > 25 ? `\n… and ${files.length - 25} more` : ""));
  if (behind) console.log("→ run  npm run git:pull  (or git:push, which pulls first)");
  return { behind, ahead, files };
}

function save() {
  if (!message) stop('A message is needed:  npm run git:save -- "what I changed"');
  if (!dirty().length) return say("nothing to commit");
  say("committing my work");
  git("add", "-A");
  const r = run("git", ["commit", "-m", message]);
  if (r.status !== 0) stop("The commit did not work (see above).");
}

function pull() {
  say("fetching the team's latest from GitHub");
  git("fetch", "origin");
  const { behind } = counts();
  if (!behind) return say("already up to date: nothing new from the team");
  const before = git("rev-parse", "HEAD");
  const stashed = dirty().length > 0;
  if (stashed) {
    say("putting my uncommitted work aside for a moment (it comes back after the merge)");
    git("stash", "push", "--include-untracked", "-m", "git-sync before pull");
  }
  say(`pulling ${behind} new commit(s) from the team (merge)`);
  const r = run("git", ["pull", "--no-rebase", "--no-edit", "origin", "main"]);
  if (r.status !== 0) {
    const c = conflicts();
    if (c.length) {
      console.error(`\n✖ Both of you changed the same lines in:\n  ${c.join("\n  ")}\nOpen each file, keep the right lines (search for <<<<<<<), then run:\n  git add -A && git commit --no-edit\n${stashed ? "Your stashed work is safe: after that run  git stash pop\n" : ""}Nothing was lost. To undo the pull: git merge --abort${stashed ? " && git stash pop" : ""}`);
    } else console.error("\n✖ The pull failed (see above). Nothing was lost.");
    process.exit(1);
  }
  if (stashed) {
    say("putting my uncommitted work back");
    const p = run("git", ["stash", "pop"]);
    if (p.status !== 0) {
      const c = conflicts();
      stop(`My work and the team's touch the same lines${c.length ? ` in: ${c.join(", ")}` : ""}. Fix the marked lines (<<<<<<<), then git add -A. The stash is kept (git stash list).`);
    }
  }
  const changed = git("diff", "--name-only", before, "HEAD").split("\n");
  if (changed.some((f) => f === "package.json" || f === "package-lock.json")) {
    say("package.json changed: installing the new packages");
    run("npm", ["install", "--no-audit", "--no-fund"]);
  }
  say(`done. New from the team: ${changed.filter(Boolean).length} file(s)`);
}

function push() {
  if (!message && dirty().length) stop('A message is needed:  npm run git:push -- "what I changed"');
  save();
  pull();
  say("checking the types before the push (a push deploys the site)");
  const t = run("npx", ["tsc", "--noEmit"]);
  if (t.status !== 0) stop("The type check failed, so nothing was pushed. Fix the errors above, then run push again.");
  const { ahead } = counts();
  if (!ahead) return say("nothing to push");
  say(`pushing ${ahead} commit(s) to main`);
  const r = run("git", ["push", "origin", "main"]);
  if (r.status !== 0) stop("The push was refused (someone pushed a moment ago). Run  npm run git:push -- \"message\"  again: it pulls first.");
  say("pushed. Hostinger deploys main now.");
}

if (mode === "status") status();
else if (mode === "pull") pull();
else if (mode === "save") save();
else if (mode === "push") push();
else stop(`Unknown "${mode}". Use: status | pull | save | push`);
