// Creates src/app/(m)/m/<path>/page.tsx for every editable laptop page that has none yet (a 3-line app screen over the same CMS page).
//   node tools/scaffold-mobile-pages.mjs          then:  node tools/sync-mobile-ready.mjs
// The slug is read from the laptop route file (renderPage("<slug>")); dynamic routes ([slug]) and /preview are skipped. Existing mobile
// pages are NEVER overwritten (a page designer may have replaced them with a bespoke screen).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "src/app/(site)");
const mob = path.join(root, "src/app/(m)/m");
const made = [];
const skipped = [];

const walk = (dir, rel) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith("[") || e.name.startsWith("(") || e.name === "preview") continue;
    const r = rel ? rel + "/" + e.name : e.name;
    const file = path.join(dir, e.name, "page.tsx");
    if (fs.existsSync(file)) {
      const m = /renderPage\(\s*"([^"]+)"\s*\)/.exec(fs.readFileSync(file, "utf8"));
      if (m) {
        const target = path.join(mob, r, "page.tsx");
        if (fs.existsSync(target)) skipped.push(r);
        else {
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(
            target,
            [
              'import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";',
              "",
              "// /" + r + " as an app screen: the same CMS page as the laptop route, shown with the MobileApp kit. A page designer may replace this with a bespoke screen.",
              "export const revalidate = 600;",
              "",
              'export const generateMetadata = () => mobileMetadata("' + m[1] + '");',
              "",
              "export default function Page() {",
              '  return renderMobilePage("' + m[1] + '");',
              "}",
              "",
            ].join("\n"),
          );
          made.push(r + " -> " + m[1]);
        }
      }
    }
    walk(path.join(dir, e.name), r);
  }
};
walk(site, "");
console.log(made.length + " created:\n  " + made.join("\n  "));
if (skipped.length) console.log(skipped.length + " already exist (kept): " + skipped.join(" "));
