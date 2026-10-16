// One-time migration helper (task 96): moves every "LAUNCHER" block of src/app/globals.css into src/app/(m)/mobile.css.
//
//   node tools/extract-launcher-css.mjs            show what would move
//   node tools/extract-launcher-css.mjs --write    move it (globals.css loses the blocks, mobile.css gets them after its base part)
//
// A block = everything from a `/* ====…` banner line up to the next banner. It is moved when its banner text contains the word LAUNCHER.
// Safe to run again later (for example after merging launcher CSS that someone added to globals.css by mistake): it appends to mobile.css.
// In the moved text `max-width: 1023.98px` becomes `max-width: 99999px`, because the mobile site is chosen by the server (src/proxy.ts), not by
// the screen width: a tablet in landscape (1024px+) must show the launcher too.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const globals = path.join(root, "src/app/globals.css");
const mobile = path.join(root, "src/app/(m)/mobile.css");
const write = process.argv.includes("--write");

const lines = fs.readFileSync(globals, "utf8").split("\n");
const banner = (l) => /^\/\* ={20,}/.test(l);

// split into blocks at banner lines; a banner opens a block (the closing banner line of the title comment belongs to the same block)
const blocks = [];
let cur = { start: 0, lines: [] };
let inBanner = false;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (banner(l) && !inBanner) {
    if (cur.lines.length) blocks.push(cur);
    cur = { start: i, lines: [] };
    inBanner = true;
  } else if (inBanner && /={20,}\s*\*\/\s*$/.test(l)) inBanner = false;
  cur.lines.push(l);
}
if (cur.lines.length) blocks.push(cur);

const isLauncher = (b) => /LAUNCHER/.test(b.lines.slice(0, 4).join("\n"));
const moved = blocks.filter(isLauncher);
console.log(`${blocks.length} blocks, ${moved.length} launcher blocks, ${moved.reduce((n, b) => n + b.lines.length, 0)} lines`);
for (const b of moved) console.log(`  line ${b.start + 1}: ${b.lines[1]?.trim().slice(0, 90)}`);

if (write && moved.length) {
  const keep = blocks.filter((b) => !isLauncher(b)).map((b) => b.lines.join("\n")).join("\n");
  const add = moved.map((b) => b.lines.join("\n").replaceAll("max-width: 1023.98px", "max-width: 99999px").replace(/\n+$/, "")).join("\n\n");
  fs.writeFileSync(globals, keep.replace(/\n*$/, "\n"));
  fs.appendFileSync(mobile, `\n${add}\n`);
  console.log("moved.");
}
