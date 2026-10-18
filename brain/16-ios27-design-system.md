# 16 · iOS 27 design system for the phone / tablet app (2026-10-18)

The phone and tablet site (`src/app/(m)`, kit prefix `ma-`, page prefix `mp-<page>-`) must look and feel like iOS 27.
The laptop / desktop site is NOT touched. Source of truth: the Apple **iOS and iPadOS 27 (Community)** Figma file,
file key `Mvsl8ZybkGKDROrxau03IG` (read it with the Figma MCP: `get_metadata` without a node id lists the pages;
`get_design_context` / `get_screenshot` for a node). Load the `figma-design-to-code` guidance before `get_design_context`.

## Components already measured in the Figma file (node ids)

| Component | Node | Numbers |
|---|---|---|
| Page control | 549:30528 | glass pill (7 % white + blur), 8 px dots, 8 px gap, current 100 %, others 30 %, last two 6 / 4 px |
| Button – Liquid Glass – Text | 5473:21667 | Large 20/16 pad (50 high), Medium 12/8 (34), Small 10/5 (28, 15 px). Label 17 px / 510 / 18 px line. Glass = clear frosted, Prominent = tint filled, white label. Destructive red `#ff383c`. Disabled 50 % |
| Sheet – iPhone | 10525:1632 | floats 6 px from sides + bottom, radius 38 top / 44-58 bottom, grabber 60×4 at 6 px, toolbar: round glass X (44) left, title 17/590 −0.43 centre, round tinted action right; dim 20 %; rises 0.55 s `cubic-bezier(.32,.72,0,1)`, no bounce |
| Grouped Table View (text fields) | 5534:22455 | one group radius 26, rows 52 px, 16 px side padding, 1 px hairline between rows, 17 px / −0.43, placeholder tertiary |
| Stepper | 5433:18978 | 92×32 pill, two 46 px halves, 1×24 separator, − / + 17 px / 590, fill = tertiary fill |
| Slider | 10456:2061 | row 52, symbols 32 wide, gap 12, track + fill 6 px radius 3, knob 57×40 clear glass, ticks 9 px under |
| Specular light (glass edge) | 10456:1589 | `inset 0 3px .5px -2.25px #282828, inset 0 -3px .5px -2.25px #282828` |
| Menu | 125:58750 | radius ~34, row 50, icon left, label 17 regular, hairlines between groups, destructive red, submenu chevron, top row of 3 icon+label actions |
| Date picker | 5442:5088 / 5530 | month title 17/600 + blue chevron, arrows, weekday 11/600 caps, day 20 regular, today tint 20 %, picked solid, "Time" row + pill |
| Tab bar | 10508:1544 / 1244 | glass pill with 3–4 tabs (current in a darker capsule, tint label) + separate round glass button |
| Home widgets | 544:199447 | radius 28; iPhone sizes 164.67², 349.67×164.33, 349.67×365, 349.67×565.67; name 12 / 510 under it |
| Clock (2x2) | 526:38737 | 148 face (7 % white + blur), numerals #999 19 px, two tick rings, white hands |
| App icons | 2402:669 | Apple artwork — do NOT embed (licence). Use our own squircle icons |

## Tokens (already in `src/components/site/mobile/app/app.css`, on `.ma-root`)
Colours follow the visitor theme: `--ma-h` (hue), `--ma-tint`, `--ma-tint-bg`, `--ma-wash`, `--ma-text`, `--ma-text2`, `--ma-text3`,
`--ma-line`, `--ma-fill`, `--ma-fill2`, `--ma-card`, `--ma-bg`, `--ma-ease`, `--ma-spring`, `--ma-gut`. Never hard-code violet / pink:
use these tokens or `hsl(calc(var(--ma-h) + N) calc(S% * var(--ts)) L%)`.

**Glass recipe (use the same everywhere):**
`background: linear-gradient(180deg, hsl(0 0% 100% / .14), hsl(0 0% 100% / .06)); backdrop-filter: blur(24px) saturate(1.8);`
`box-shadow: 0 0 0 .5px hsl(0 0% 100% / .22), inset 0 1px 0 hsl(0 0% 100% / .28), inset 0 3px .5px -2.25px #282828, inset 0 -3px .5px -2.25px #282828, 0 10px 30px hsl(0 0% 0% / .22);`
iOS tertiary fill on dark: `hsl(240 6% 50% / .2–.24)`.

## Typography (Apple scale, site font Poppins — SF is not licensed for the web)
| Style | Size / line | Weight | Tracking |
|---|---|---|---|
| Large Title | 34 / 1.1 | 600 | 0.37px |
| Title 1 (section heading `.ma-h2`) | 28 / 1.14 | 600 | 0.36px |
| Title 2 | 22 / 1.2 | 600 | 0.35px |
| Title 3 | 20 / 1.25 | 600 | 0.38px |
| Headline (row title) | 17 / 1.3 | 500 | −0.43px |
| Body | 17 / 1.45 | 400 | −0.43px |
| Callout / long answers | 16 / 1.5 | 400 | −0.32px |
| Subheadline | 15 / 1.4 | 400 | −0.24px |
| Footnote / labels | 13 / 1.35 | 400–500 | −0.08px |
Rules: **regular (400) everywhere**; 500 only for row titles / open question; 600 only for headings. No bold body text, no ALL CAPS labels
(except weekday letters). Paragraphs ≥ 16 px, labels ≥ 13 px. `text-wrap: balance` on headings, `pretty` on paragraphs.
Never let text overlap: no fixed heights on text boxes, no negative margins on text, `min-width: 0` on flex children, long words wrap.

## Layout and interaction rules (Apple HIG)
- Whitespace: 72 px between sections, 28 px under a section head, 16–24 px between items. 20–22 px side gutter (`--ma-gut`).
- **No box-in-box.** Prefer open lists with hairlines (`1px solid var(--ma-line)`). Use a glass card only where it groups something
  (a form, a tool, a stage). FAQ is always an open list: question regular 17, answer 16 in `--ma-text2`, a + that turns into −.
- Glow ring (conic border) only in one or two places per page (never on every card).
- Touch targets ≥ 44 px. Buttons side by side when two. Every tap has feedback (`:active` scale .96 with `--ma-spring`).
- Motion: reveal with the kit (`className="ma-rvx"` + `style={{"--rv-d": "60ms"}}` stagger), sheets/menus spring, content swaps
  crossfade with a small blur. Always a `@media (prefers-reduced-motion: reduce)` block that stops your animations.
- Interactive pieces (pickers, segmented controls, steppers, sliders, toggles, tabs) must work with keyboard (Tab / arrows / Enter) and have
  aria (`role="tablist"`, `aria-selected`, `aria-pressed`, `role="switch"`, labels).
- Words only from the CMS data the section receives. Never invent numbers, clients, testimonials or prices. Shapes / skeleton UI are fine.
- One `"use client"` file per page folder for interactive parts (`client.tsx`); sections stay server components.
- Performance: transform / opacity animations only, no new npm packages, no images unless the CMS gives them (use `next/image`).
