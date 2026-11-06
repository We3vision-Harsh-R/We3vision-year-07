// One screenshot of a page after the audit fixes, with the first-visit windows skipped (shot.mjs of tools/ does not skip them).
//   MSYS_NO_PATHCONV=1 node tools/ux-audit/shot.mjs <baseUrl> <path> <WxH>[p] <out.jpg> [scrollY | css-selector]      (p after the size = iPhone)
import { writeFileSync } from "node:fs";
import { launch, setViewport, visit } from "./cdp.mjs";

const [base, path, size, out, at = "0"] = process.argv.slice(2);
const [w, h] = size.replace("p", "").split("x").map(Number);
const c = await launch(9420);
await setViewport(c, { w, h, phone: size.endsWith("p") });
const target = /^\d+$/.test(at) ? `window.scrollTo(0, ${+at});` : `document.querySelector(${JSON.stringify(at)})?.scrollIntoView({ block: "center" });`;
await visit(c, base + path, `(async () => { await new Promise((r) => setTimeout(r, 4000)); ${target} await new Promise((r) => setTimeout(r, 1800)); return 1; })()`);
const shot = await c.send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log("saved", out);
c.close();
process.exit(0);
