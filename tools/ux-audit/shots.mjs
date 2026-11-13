// Several screenshots of one page in one go (a phone: add p to the size). Each target is a scrollY number or a css selector (scrolled to the top of the window).
//   MSYS_NO_PATHCONV=1 node tools/ux-audit/shots.mjs <baseUrl> <path> <WxH>[p] <outDir> <target> [<target> ...]
import { writeFileSync, mkdirSync } from "node:fs";
import { launch, setViewport, visit } from "./cdp.mjs";

const [base, path, size, out, ...targets] = process.argv.slice(2);
const [w, h] = size.replace("p", "").split("x").map(Number);
mkdirSync(out, { recursive: true });
const c = await launch(9440);
await setViewport(c, { w, h, phone: size.endsWith("p") });
await visit(c, base + path, `(async () => { await new Promise((r) => setTimeout(r, 6000)); for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 800)); return 1; })()`);
let n = 0;
for (const t of targets) {
  const js = /^\d+$/.test(t) ? `window.scrollTo(0, ${+t});` : `(() => { const e = document.querySelector(${JSON.stringify(t)}); if (e) window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 80); })();`;
  await c.send("Runtime.evaluate", { expression: `(async () => { ${js} await new Promise((r) => setTimeout(r, 1400)); })()`, awaitPromise: true });
  const shot = await c.send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  const f = `${out}/${String(++n).padStart(2, "0")}.jpg`;
  writeFileSync(f, Buffer.from(shot.result.data, "base64"));
  console.log("saved", f, t);
}
c.close();
process.exit(0);
