// Draws the share picture (1200x630) that WhatsApp, LinkedIn, Facebook and X show when a We3vision link is posted: public/brand/og-image.png
//   node tools/make-og.mjs
// Made from the real brand logo files (no stock or generated art): violet aurora background + logo mark + logo text, centred.
// A picture cannot follow the visitor's colour theme, so it uses the default violet of the site.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brand = (f) => path.join(root, "public", "brand", f);

const W = 1200;
const H = 630;
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="a" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="hsl(274,62%,24%)"/><stop offset="1" stop-color="hsl(274,76%,5%)"/></radialGradient>
    <radialGradient id="b" cx="88%" cy="92%" r="45%"><stop offset="0" stop-color="hsl(300,60%,20%)" stop-opacity="0.75"/><stop offset="1" stop-color="hsl(300,60%,20%)" stop-opacity="0"/></radialGradient>
    <radialGradient id="c" cx="10%" cy="8%" r="40%"><stop offset="0" stop-color="hsl(255,70%,28%)" stop-opacity="0.6"/><stop offset="1" stop-color="hsl(255,70%,28%)" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#a)"/><rect width="${W}" height="${H}" fill="url(#b)"/><rect width="${W}" height="${H}" fill="url(#c)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="hsl(280,100%,76%)" stroke-opacity="0.18"/>
</svg>`);

const mark = await sharp(brand("logo-white.webp")).resize({ height: 230 }).png().toBuffer();
const text = await sharp(brand("logo-text-white.webp")).resize({ width: 560 }).png().toBuffer();
const mm = await sharp(mark).metadata();
const tm = await sharp(text).metadata();
const gap = 26;
const top = Math.round((H - (mm.height + gap + tm.height)) / 2);

await sharp(bg)
  .composite([
    { input: mark, left: Math.round((W - mm.width) / 2), top },
    { input: text, left: Math.round((W - tm.width) / 2), top: top + mm.height + gap },
  ])
  .png({ compressionLevel: 9 })
  .toFile(brand("og-image.png"));
console.log("public/brand/og-image.png written", W, "x", H);
