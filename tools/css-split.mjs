// CSS SPLIT: moves the rules of page-only class families out of src/app/globals.css into src/styles/<bundle>.css, which only the pages
// that need them load (see tools/css-split.config.mjs). Nothing is guessed: a rule moves only when ALL its selectors need a class of
// one bundle to match, so it can never have applied anywhere else.
//
//   node tools/css-split.mjs plan     what would move (sizes), nothing is written
//   node tools/css-split.mjs apply    writes src/styles/*.css, shrinks globals.css, adds the imports to the page.tsx files
//   node tools/css-split.mjs check    proves that no rule was lost: every rule of the original is in exactly one output file
//
// The tool is re-runnable on a NEW globals.css (after a merge): run `apply` again, it only moves what is still in globals.css and
// appends to the bundle files (rules already in a bundle file are kept, never duplicated).
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { parseCss, classesOf, prefixOf } from "./css-parse.mjs";
import { BUNDLES, PREVIEW_PAGE } from "./css-split.config.mjs";

const mode = process.argv[2] ?? "plan";
const GLOBALS = "src/app/globals.css";
const STYLES = "src/styles";
const famToBundle = new Map();
for (const b of BUNDLES) for (const f of b.families) famToBundle.set(f, b.name);

// ---- selector helpers -------------------------------------------------------------------------------------------------------
function splitTopLevel(text) {
  const parts = [];
  let depth = 0, cur = "", q = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { cur += c; if (c === "\\") cur += text[++i] ?? ""; else if (c === q) q = ""; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    if (c === "," && depth === 0) { parts.push(cur); cur = ""; continue; }
    cur += c;
  }
  if (cur.trim()) parts.push(cur);
  return parts;
}
/** removes :not(...) :is(...) :where(...) :has(...) groups: classes inside them are not REQUIRED for the selector to match */
function withoutOptionalGroups(sel) {
  let out = "";
  for (let i = 0; i < sel.length; ) {
    const m = /^:(not|is|where|has|matches|-webkit-any|-moz-any)\(/.exec(sel.slice(i));
    if (!m) { out += sel[i++]; continue; }
    let depth = 1;
    i += m[0].length;
    while (i < sel.length && depth > 0) { if (sel[i] === "(") depth++; else if (sel[i] === ")") depth--; i++; }
  }
  return out;
}
/** the bundle a selector needs, or null (global): all its required classes must be of ONE bundle family or of unmapped families */
function bundleOfSelector(sel) {
  const need = new Set();
  for (const c of classesOf(withoutOptionalGroups(sel))) { const b = famToBundle.get(prefixOf(c)); if (b) need.add(b); }
  if (need.size <= 1) return need.size ? [...need][0] : null;
  // a selector that needs two bundles only matches on a page that loads both: put it in the one that is imported LAST (it was later in the file)
  return BUNDLES.map((b) => b.name).filter((n) => need.has(n)).pop();
}

// ---- read ------------------------------------------------------------------------------------------------------------------------
const src = readFileSync(GLOBALS, "utf8");
const tree = parseCss(src);
if (tree.map((n) => n.text).join("") !== src) { console.error("parser does not round-trip: stop"); process.exit(2); }

// words used in the TS/TSX sources (to keep keyframes that a component names itself in an inline style)
const sourceText = [];
(function walk(d) { for (const n of readdirSync(d)) { const f = join(d, n); if (n === "generated") continue; if (statSync(f).isDirectory()) walk(f); else if (/\.(tsx?|css)$/.test(n) && f.replace(/\\/g, "/") !== GLOBALS && !f.replace(/\\/g, "/").startsWith(STYLES)) sourceText.push(readFileSync(f, "utf8")); } })("src");
const sources = sourceText.join("\n");

// ---- classify ------------------------------------------------------------------------------------------------------------------
// leaf record: { node, wrappers, dest: Map<bundle|null, selectors[]> }
const records = [];
function collect(nodes, wrappers) {
  for (const node of nodes) {
    if (node.children) { collect(node.children, [...wrappers, node.prelude]); continue; }
    records.push({ node, wrappers });
  }
}
collect(tree, []);
const keyframeDefs = new Map(); // name -> [record]
for (const r of records) {
  const m = /^@keyframes\s+([\w-]+)/i.exec(r.node.prelude);
  if (m) (keyframeDefs.get(m[1]) ?? keyframeDefs.set(m[1], []).get(m[1])).push(r);
}
const keyframeRefs = new Map(); // name -> Set(bundle|"global")
for (const r of records) {
  if (r.node.kind !== "rule") { r.parts = null; continue; }
  const sels = splitTopLevel(r.node.prelude);
  const parts = new Map();
  for (const s of sels) {
    const b = bundleOfSelector(s);
    parts.set(b, [...(parts.get(b) ?? []), s.trim()]);
  }
  r.parts = parts;
  for (const m of r.node.body.matchAll(/animation(?:-name)?\s*:([^;}]*)/gi)) {
    for (const id of m[1].match(/-?[_a-zA-Z][\w-]*/g) ?? []) {
      if (keyframeDefs.has(id)) for (const b of parts.keys()) (keyframeRefs.get(id) ?? keyframeRefs.set(id, new Set()).get(id)).add(b ?? "global");
    }
  }
}
const keyframeBundle = new Map();
for (const [name, defs] of keyframeDefs) {
  const refs = keyframeRefs.get(name);
  if (defs.length !== 1 || !refs || refs.size !== 1 || refs.has("global")) continue;
  if (new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(sources)) continue; // a component names it itself
  keyframeBundle.set(name, [...refs][0]);
}

// ---- rebuild -------------------------------------------------------------------------------------------------------------------
const out = new Map(); // bundle -> array of { wrappers, text }
const add = (bundle, wrappers, text) => { (out.get(bundle) ?? out.set(bundle, []).get(bundle)).push({ wrappers, text }); };
const moved = new Map(); // bundle -> bytes
const keep = new Set(); // records that stay whole in globals
const rewritten = new Map(); // record -> replacement text for globals ("" = removed)
for (const r of records) {
  const { node } = r;
  if (r.parts) {
    if (r.parts.size === 1 && r.parts.has(null)) { keep.add(r); continue; }
    for (const [b, sels] of r.parts) {
      if (b === null) continue;
      add(b, r.wrappers, `${sels.join(",\n")} {${node.body}}\n`);
      moved.set(b, (moved.get(b) ?? 0) + Buffer.byteLength(`${sels.join(",")}{${node.body}}`));
    }
    const rest = r.parts.get(null);
    rewritten.set(r, rest ? `${rest.join(",\n")} {${node.body}}\n` : "");
    continue;
  }
  const km = /^@keyframes\s+([\w-]+)/i.exec(node.prelude);
  if (km && keyframeBundle.has(km[1])) {
    const b = keyframeBundle.get(km[1]);
    add(b, r.wrappers, `${node.prelude} {${node.body}}\n`);
    moved.set(b, (moved.get(b) ?? 0) + Buffer.byteLength(node.text));
    rewritten.set(r, "");
    continue;
  }
  keep.add(r);
}

function renderGlobals() {
  const render = (nodes) => nodes.map((node) => {
    if (node.children) {
      const inner = render(node.children);
      return inner.trim() ? `${node.trivia ?? ""}${node.prelude} {\n${inner}}\n` : "";
    }
    const rec = records.find((r) => r.node === node);
    return rewritten.has(rec) ? rewritten.get(rec) : node.text;
  }).join("");
  return render(tree);
}
function renderBundle(items) {
  let text = "", open = [];
  for (const it of items) {
    let common = 0;
    while (common < open.length && common < it.wrappers.length && open[common] === it.wrappers[common]) common++;
    text += "}\n".repeat(open.length - common);
    for (let k = common; k < it.wrappers.length; k++) text += `${it.wrappers[k]} {\n`;
    open = it.wrappers;
    text += it.text;
  }
  return text + "}\n".repeat(open.length);
}

// ---- modes -------------------------------------------------------------------------------------------------------------------------
const kb = (n) => (n / 1024).toFixed(1).padStart(7) + " KB";
const newGlobals = renderGlobals();
if (mode === "plan" || mode === "check") {
  console.log(`globals.css now: ${kb(Buffer.byteLength(src))}  (${kb(gzipSync(src).length)} gzip)`);
  let total = 0;
  for (const b of BUNDLES) { const t = moved.get(b.name) ?? 0; total += t; console.log(`  ${b.name.padEnd(20)} ${kb(t)}  -> ${(b.routes ?? b.files).join(", ")}`); }
  console.log(`after the split: globals.css ${kb(Buffer.byteLength(newGlobals))} (${kb(gzipSync(newGlobals).length)} gzip), moved ${kb(total)}`);
  console.log(`keyframes moved: ${keyframeBundle.size} of ${keyframeDefs.size}`);
}
if (mode === "check") {
  // every selector+body of the original must be found in the outputs (as a (wrappers, selector, body) triple)
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const key = (wrappers, sel, body) => `${wrappers.map(norm).join(" > ")} || ${norm(sel)} || ${norm(body)}`;
  const want = new Map();
  for (const r of records) {
    if (r.node.kind === "rule") for (const s of splitTopLevel(r.node.prelude)) want.set(key(r.wrappers, s, r.node.body), (want.get(key(r.wrappers, s, r.node.body)) ?? 0) + 1);
    else if (r.node.kind === "at") want.set(key(r.wrappers, r.node.prelude, r.node.body ?? ""), (want.get(key(r.wrappers, r.node.prelude, r.node.body ?? "")) ?? 0) + 1);
  }
  const have = new Map();
  const readBack = (text) => {
    const walk = (nodes, wrappers) => {
      for (const n of nodes) {
        if (n.children) walk(n.children, [...wrappers, n.prelude]);
        else if (n.kind === "rule") for (const s of splitTopLevel(n.prelude)) have.set(key(wrappers, s, n.body), (have.get(key(wrappers, s, n.body)) ?? 0) + 1);
        else if (n.kind === "at") have.set(key(wrappers, n.prelude, n.body ?? ""), (have.get(key(wrappers, n.prelude, n.body ?? "")) ?? 0) + 1);
      }
    };
    walk(parseCss(text), []);
  };
  readBack(newGlobals);
  for (const [b, items] of out) readBack(renderBundle(items));
  let lost = 0, extra = 0;
  for (const [k, c] of want) if ((have.get(k) ?? 0) < c) { lost++; if (lost <= 5) console.log("LOST:", k.slice(0, 160)); }
  for (const [k, c] of have) if ((want.get(k) ?? 0) < c) { extra++; if (extra <= 5) console.log("EXTRA:", k.slice(0, 160)); }
  console.log(lost || extra ? `CHECK FAILED: ${lost} lost, ${extra} extra` : `CHECK OK: all ${want.size} distinct rules are present exactly once`);
  process.exit(lost || extra ? 1 : 0);
}
if (mode === "apply") {
  if (!existsSync(STYLES)) mkdirSync(STYLES, { recursive: true });
  for (const [b, items] of out) {
    const file = join(STYLES, `${b}.css`);
    const cfg = BUNDLES.find((x) => x.name === b);
    const head = `/* Loaded only by: ${(cfg.routes ?? cfg.files).join(", ")} (see tools/css-split.config.mjs). Add new "${BUNDLES.find((x) => x.name === b).families.join("-, ")}-" rules HERE, not in globals.css. */\n`;
    const body = renderBundle(items);
    writeFileSync(file, existsSync(file) ? readFileSync(file, "utf8").trimEnd() + "\n\n" + body : head + body);
  }
  writeFileSync(GLOBALS, newGlobals);
  const addImport = (file, names) => {
    let t = readFileSync(file, "utf8");
    const eol = t.includes("\r\n") ? "\r\n" : "\n";
    for (const b of BUNDLES) t = t.replace(new RegExp(`import "@/styles/${b.name}\\.css";\\r?\\n`, "g"), "");
    const lines = names.map((n) => `import "@/styles/${n}.css";`).join(eol) + eol; // config order = original order
    // a "use client" / "use server" directive must stay the first statement: the imports go below it
    const directive = /^(\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*)(["']use (?:client|server)["'];?\r?\n)/.exec(t);
    writeFileSync(file, directive ? t.slice(0, directive[0].length) + eol + lines + t.slice(directive[0].length) : lines + t);
  };
  const have = (b) => existsSync(join(STYLES, `${b.name}.css`));
  const routes = new Set(BUNDLES.flatMap((b) => b.routes ?? []));
  for (const r of routes) addImport(`src/app/(site)/${r}/page.tsx`, BUNDLES.filter((b) => b.routes?.includes(r) && have(b)).map((b) => b.name));
  const fileSet = new Set(BUNDLES.flatMap((b) => b.files ?? []));
  for (const f of fileSet) addImport(f, BUNDLES.filter((b) => b.files?.includes(f) && have(b)).map((b) => b.name));
  addImport(PREVIEW_PAGE, BUNDLES.filter((b) => existsSync(join(STYLES, `${b.name}.css`))).map((b) => b.name));
  console.log(`written: globals.css ${kb(Buffer.byteLength(newGlobals))}, ${out.size} bundle files in ${STYLES}/. Now run: node tools/css-split.mjs check`);
}
