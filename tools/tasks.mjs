// A small tool to keep every big task of the website work revertable (the project is not in git, so this keeps its own patches).
//
//   node tools/tasks.mjs begin 3 "Border glow on all cards"   take a copy of src/ before the task starts
//   node tools/tasks.mjs end 3                                make the patch of the task (what changed in src/)
//   node tools/tasks.mjs revert 3                             undo exactly that task (also in the MAIN folder that the dev server runs from)
//   node tools/tasks.mjs redo 3                               put it back
//   node tools/tasks.mjs list                                 show the list of tasks
//
// The patches live in .task-log/ (next to this folder, ignored by the site). Reverting a task only undoes the lines that the task changed,
// so the other tasks stay as they are (if a later task changed the very same lines, the revert says so and changes nothing).

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// the folder the dev server runs from. When this tool runs inside a worktree (<main>/.claude/worktrees/<name>) the files are also
// copied to <main>; when it runs in the main folder itself (the normal case) there is nothing to copy.
const inWorktree = path.basename(path.dirname(root)) === "worktrees" && path.basename(path.dirname(path.dirname(root))) === ".claude";
const main = inWorktree ? path.resolve(root, "..", "..", "..") : root;
const log = path.join(root, ".task-log");
const metaFile = path.join(log, "tasks.json");
const listFile = path.join(root, "TASKS.md");

const read = () => (fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, "utf8")) : { tasks: {} });
const write = (m) => {
  fs.mkdirSync(log, { recursive: true });
  fs.writeFileSync(metaFile, JSON.stringify(m, null, 2));
  const rows = Object.entries(m.tasks)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([n, t]) => `| ${n} | ${t.title} | ${t.status} |`);
  fs.writeFileSync(listFile, `# Tasks (revert one with: node tools/tasks.mjs revert <number>)\n\nProject knowledge for AI tools and developers: see brain/README.md. Add every new task here through this tool (begin/end).\n\n| # | Task | Status |\n|---|------|--------|\n${rows.join("\n")}\n`);
};
const copyDir = (from, to) => fs.cpSync(from, to, { recursive: true, filter: (p) => !p.includes(`${path.sep}node_modules`) });

const [cmd, num, ...rest] = process.argv.slice(2);
const m = read();

if (cmd === "begin") {
  const dir = path.join(log, num);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "before"), { recursive: true });
  copyDir(path.join(root, "src"), path.join(dir, "before", "src"));
  m.tasks[num] = { title: rest.join(" ") || m.tasks[num]?.title || `Task ${num}`, status: "in progress" };
  write(m);
  console.log(`task ${num}: started (copy of src/ taken)`);
} else if (cmd === "end") {
  const dir = path.join(log, num);
  const tmp = path.join(dir, "tmp");
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmp, "a"), { recursive: true });
  fs.mkdirSync(path.join(tmp, "b"), { recursive: true });
  copyDir(path.join(dir, "before", "src"), path.join(tmp, "a", "src"));
  copyDir(path.join(root, "src"), path.join(tmp, "b", "src"));
  const r = spawnSync("git", ["diff", "--no-index", "--binary", "--no-color", "a", "b"], { cwd: tmp, encoding: "utf8", maxBuffer: 1 << 28 });
  fs.writeFileSync(path.join(dir, "task.patch"), r.stdout);
  fs.rmSync(tmp, { recursive: true, force: true });
  const files = [...r.stdout.matchAll(/^diff --git a\/[ab]\/(\S+) b\/[ab]\//gm)].map((x) => x[1]);
  m.tasks[num] = { ...m.tasks[num], status: "done", files: files.length };
  write(m);
  console.log(`task ${num}: done, ${files.length} files changed`);
} else if (cmd === "revert" || cmd === "redo") {
  const patch = path.join(log, num, "task.patch");
  if (!fs.existsSync(patch)) {
    console.error(`task ${num}: no patch (was it ended?)`);
    process.exit(1);
  }
  const reverse = cmd === "revert";
  const args = ["apply", "-p2", "--whitespace=nowarn", ...(reverse ? ["-R"] : []), patch];
  try {
    execFileSync("git", ["apply", "--check", "-p2", ...(reverse ? ["-R"] : []), patch], { cwd: root, stdio: "pipe" });
  } catch (e) {
    console.error(`task ${num}: cannot ${cmd} cleanly (a later task changed the same lines). Nothing was changed.\n${e.stderr?.toString() ?? ""}`);
    process.exit(1);
  }
  execFileSync("git", args, { cwd: root, stdio: "inherit" });
  // the same files in the MAIN folder (the dev server runs from there)
  const text = fs.readFileSync(patch, "utf8");
  const files = [...text.matchAll(/^diff --git a\/[ab]\/(\S+) b\/[ab]\//gm)].map((x) => x[1]);
  for (const f of main === root ? [] : files) {
    const from = path.join(root, f);
    const to = path.join(main, f);
    if (fs.existsSync(from)) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    } else fs.rmSync(to, { force: true });
  }
  m.tasks[num].status = reverse ? "reverted" : "done";
  write(m);
  console.log(`task ${num}: ${reverse ? "reverted" : "put back"} (${files.length} files${main === root ? "" : ", also in the main folder"})`);
} else if (cmd === "list") {
  console.log(fs.existsSync(listFile) ? fs.readFileSync(listFile, "utf8") : "no tasks yet");
} else {
  console.log("usage: node tools/tasks.mjs begin|end|revert|redo|list <number> [title]");
}
