// Turns raw.jsonl (run.mjs) into the lists the owner reads:
//   PROBLEMS.md   one line per problem  (id | severity | rule | device | page | element | text | what is wrong | fix)
//   SUMMARY.md    totals by category / rule / page + the page-load numbers
//   INVENTORY.md  how many buttons / links / images / headings / words every page has, and every button label with its word count
//   summary.json  the same totals for scripts (the before / after comparison)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CATS, RULES } from "./rules.mjs";

const SEV = { 1: "HIGH", 2: "MED ", 3: "LOW " };
const pad = (n, w = 4) => String(n).padStart(w, "0");

export function writeReports(out) {
  const rows = readFileSync(join(out, "raw.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const merged = new Map(); // key -> problem
  let raw = 0;
  const add = (rule, row, el, txt, d) => {
    const r = RULES[rule];
    if (!r) return;
    const k = [rule, row.device, row.path, el, txt].join("|");
    const p = merged.get(k) ?? { rule, ...r, device: row.device, path: row.path, el, txt, d, vps: new Set(), n: 0 };
    p.vps.add(row.vp.split("x")[0]);
    p.n++;
    merged.set(k, p);
  };
  for (const row of rows) {
    if (row.error) { add("PAGE01", row, "", "", "audit error: " + row.error); raw++; continue; }
    if (row.status && row.status !== 200) { add("PAGE01", row, "", "", `HTTP ${row.status}`); raw++; }
    for (const m of row.problems ?? []) { add(m.startsWith("http") ? "NET01" : "CON01", row, "", "", m); raw++; }
    for (const [rule, h] of Object.entries(row.hits ?? {})) {
      raw += h.n;
      for (const it of h.items) add(rule, row, it.el, it.txt, it.d);
    }
  }
  const list = [...merged.values()].sort((a, b) => a.sev - b.sev || a.rule.localeCompare(b.rule) || a.path.localeCompare(b.path) || a.el.localeCompare(b.el));
  list.forEach((p, i) => (p.id = "P" + pad(i + 1)));

  // ---- PROBLEMS.md ----
  const line = (p) => `${p.id} | ${SEV[p.sev]} | ${p.rule} | ${p.device === "phone" ? "PHONE " : "LAPTOP"} ${[...p.vps].join("/")} | ${p.path} | ${p.el || "(page)"} | ${p.txt ? '"' + p.txt + '" | ' : ""}${p.d} | fix: ${p.fix}`;
  const head = `# UX problem list (${new Date().toISOString().slice(0, 10)})\n\n${list.length} problems listed, one per line (${raw} raw hits: a line stands for one element on one page; a hit repeated on 3 laptop sizes is one line).\nFormat: id | severity | rule | device + window width | page | element | text | what is wrong | fix\n\n`;
  writeFileSync(join(out, "PROBLEMS.md"), head + list.map(line).join("\n") + "\n");

  // ---- SUMMARY.md / summary.json ----
  const byRule = {}, byCat = {}, byDev = { laptop: 0, phone: 0 }, byPage = {};
  for (const p of list) {
    byRule[p.rule] = (byRule[p.rule] ?? 0) + 1;
    byCat[p.cat] = (byCat[p.cat] ?? 0) + 1;
    byDev[p.device]++;
    byPage[p.device + " " + p.path] = (byPage[p.device + " " + p.path] ?? 0) + 1;
  }
  const sevCount = [1, 2, 3].map((s) => list.filter((p) => p.sev === s).length);
  const pagesChecked = new Set(rows.map((r) => r.device + " " + r.path)).size;
  let md = `# UX audit summary\n\n${rows.length} page checks (${pagesChecked} page+device pairs), **${list.length} problems** (${sevCount[0]} high, ${sevCount[1]} medium, ${sevCount[2]} low); laptop ${byDev.laptop}, phone ${byDev.phone}. Raw hits: ${raw}.\n\n## By category\n| Category | Problems |\n|---|---|\n`;
  md += Object.entries(CATS).map(([k, v]) => `| ${v} | ${byCat[k] ?? 0} |`).join("\n");
  md += `\n\n## By rule\n| Rule | Sev | Problems | What | Fix |\n|---|---|---|---|---|\n`;
  md += Object.entries(byRule).sort((a, b) => b[1] - a[1]).map(([k, n]) => `| ${k} | ${RULES[k].sev} | ${n} | ${RULES[k].title} | ${RULES[k].fix} |`).join("\n");
  md += `\n\n## Worst pages (top 25)\n| Page | Problems |\n|---|---|\n` + Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, n]) => `| ${k} | ${n} |`).join("\n");
  const perf = rows.filter((r) => r.perf && r.vp === "1440x900").sort((a, b) => b.perf.lcp - a.perf.lcp).slice(0, 10);
  md += `\n\n## Slowest first screens (laptop 1440x900, top 10)\n| Page | LCP ms | CLS | KB on load |\n|---|---|---|---|\n` + perf.map((r) => `| ${r.path} | ${r.perf.lcp} | ${r.perf.cls} | ${r.perf.kb} |`).join("\n") + "\n";
  writeFileSync(join(out, "SUMMARY.md"), md);
  writeFileSync(join(out, "summary.json"), JSON.stringify({ problems: list.length, raw, severity: sevCount, byCat, byRule, byDev, pages: pagesChecked }, null, 1));

  // ---- FIXLIST.md: the same problems grouped by CSS selector (one CSS change fixes a whole row) ----
  let fm = "# Fix list: problems grouped by element class (one CSS rule fixes a row)\n\nSelector = the last element of the path. `pages` = on how many different pages it happens.\n";
  // a bare tag (span, p, li ...) says little: the parent is added so the component that owns it can be found
  const noise = /\.(tr\w*|text-\w+|mt-\d+|space-\w+|relative|absolute|flex|grid|block)\b/g;
  const sel = (p) => {
    const seg = p.el.split(" > ");
    let last = seg.pop() || "(page)";
    if (!/[.#]/.test(last) && seg.length) last = seg.pop() + " > " + last;
    return last.replace(noise, "");
  };
  for (const rule of Object.keys(byRule).sort((a, b) => RULES[a].sev - RULES[b].sev || byRule[b] - byRule[a])) {
    const g = {};
    for (const p of list.filter((x) => x.rule === rule)) { const k = p.device + " " + sel(p); (g[k] ??= { n: 0, pages: new Set(), ex: p }).n++; g[k].pages.add(p.path); }
    const top = Object.entries(g).sort((a, b) => b[1].n - a[1].n).slice(0, 25);
    fm += `\n## ${rule} · ${RULES[rule].title} (${byRule[rule]})  → ${RULES[rule].fix}\n| Device + selector | Problems | Pages | Example |\n|---|---|---|---|\n` + top.map(([k, v]) => `| ${k} | ${v.n} | ${v.pages.size} | ${v.ex.path} ${v.ex.el.slice(0, 80)} ${v.ex.txt ? '"' + v.ex.txt.slice(0, 24) + '" ' : ""}${v.ex.d.slice(0, 50)} |`).join("\n") + "\n";
  }
  writeFileSync(join(out, "FIXLIST.md"), fm);

  // ---- INVENTORY.md ----
  const inv = (dev) => rows.filter((r) => r.inv && (dev === "phone" ? r.device === "phone" : r.vp === "1440x900")).sort((a, b) => a.path.localeCompare(b.path));
  let im = "# Content inventory (what every page contains)\n\n";
  for (const [dev, title] of [["laptop", "Laptop 1440x900"], ["phone", "Phone 390x844 (what a phone is served)"]]) {
    const rs = inv(dev);
    const sum = (f) => rs.reduce((s, r) => s + (f(r.inv) || 0), 0);
    im += `## ${title}: ${rs.length} pages\nTotals: ${sum((i) => i.buttons)} buttons, ${sum((i) => i.buttonLinks)} button-style links, ${sum((i) => i.links)} text links (${sum((i) => i.linksExternal)} external), ${sum((i) => i.inputs)} fields, ${sum((i) => i.images)} images, ${sum((i) => i.svg)} svg, ${sum((i) => i.canvas)} canvas, ${sum((i) => i.paragraphs)} paragraphs, ${sum((i) => i.words)} words, ${sum((i) => i.buttonWords)} words inside button labels.\n\n`;
    im += "| Page | Buttons | Btn-links | Links | Fields | Images | H1 | H2 | H3 | Paragraphs | Words | Avg words/para | Longest para | Screens tall |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n";
    im += rs.map((r) => `| ${r.path} | ${r.inv.buttons} | ${r.inv.buttonLinks} | ${r.inv.links} | ${r.inv.inputs} | ${r.inv.images} | ${r.inv.headings.h1} | ${r.inv.headings.h2} | ${r.inv.headings.h3} | ${r.inv.paragraphs} | ${r.inv.words} | ${r.inv.avgWordsPerPara} | ${r.inv.longestPara} | ${r.meta.tallVh} |`).join("\n") + "\n\n";
    im += `### Every button label (${dev})\n`;
    im += rs.filter((r) => r.inv.buttonLabels.length).map((r) => `- **${r.path}** (${r.inv.buttonLabels.length}${r.inv.buttonLabels.length >= 80 ? "+" : ""}): ` + r.inv.buttonLabels.map((b) => `${b.label ? `"${b.label}"` : "(no name)"} ${b.words}w`).join(" · ") + (r.inv.duplicateButtonLabels.length ? `  — repeated: ${r.inv.duplicateButtonLabels.join(", ")}` : "")).join("\n") + "\n\n";
  }
  writeFileSync(join(out, "INVENTORY.md"), im);
  console.log(`\n${list.length} problems (${sevCount[0]} high / ${sevCount[1]} medium / ${sevCount[2]} low), ${raw} raw hits → ${out}/PROBLEMS.md, SUMMARY.md, INVENTORY.md`);
  return { problems: list.length, raw, sevCount };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("report.mjs")) {
  const out = (process.argv.find((a) => a.startsWith("--out=")) ?? "--out=.task-log/ux-audit").slice(6);
  if (!existsSync(join(out, "raw.jsonl"))) { console.error("no raw.jsonl in " + out); process.exit(2); }
  writeReports(out);
}
