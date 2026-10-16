# 05 — Design system

## Look in one paragraph
Near-black violet background (`--color-void`), one accent (violet, `--color-violet`/`--a`), muted orchid body text, Poppins,
big gradient headings (white → pale violet, key words in violet), glass cards (`--card`, 1px hairline `--hair`, radius 20–30 px),
soft radial colour pools instead of flat fills, border glow on cards (`.bglow` + `<GlowEdge />`), starfield/aurora background,
fixed bottom glass-pill menu, custom cursor with a "You" tag, glass scrollbar, Lenis smooth scroll. The original inspiration was the
Framer template "AIgenius" (rebuilt in own code, nothing copied); the owner has since pushed the site toward unique, scroll-driven
scenes (3D office, island, train, city, solar system, timeline).

## Theme variables (THE most important rule)
- `<html>` carries `--th` (hue, default 284) and `--ts` (saturation factor, default 1). Visitors change them with the theme picker
  (`theme-picker.tsx`, localStorage key `we3.theme`). **Lightness never changes**, so contrast stays.
- Write colours as `hsl(calc(var(--th) + OFFSET) calc(S% * var(--ts)) L% / A)`. Frequent offsets: **354** = accent violet,
  **347** = very dark base, **349** = card, **326** = pink, **24/44/300/10** extra hues used by multi-colour designs.
  In JS/SVG use the helper `T(sat, light, alpha)` pattern from existing code or `shiftRgb`/`liveTheme()` in `src/lib/theme.ts`.
- Tailwind tokens (`@theme` in globals.css): `void`, `violet`, `dusk`, `orchid` (+ admin: `ink`, `brand*`). In arbitrary values use
  underscores: `bg-[hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76%)]`.
- Scoped palettes: `.md` (modern skin) defines `--a --ad --soft --hair --card`; `.sy`, `.vk`… redefine the same names. Inside such a
  scope use `var(--a)`, `var(--soft)`, `var(--hair)`, `var(--card)`.
- The admin panel keeps its own fixed colours.

## Typography & sizes
Poppins only (`--font-poppins`). Paragraph ≥ 1rem (usually 1.0625–1.25rem), chips/labels ≥ 0.875rem, headings `clamp()`-based,
letter-spacing −0.02…−0.04em on headings, `line-height` 1.5–1.7 for text. Heading component: `SplitHeading`
(`modern/split-heading.tsx`, words fade/blur in; class `.sh`, `.md-h2`); intro text `.md-intro`; chip `.md-chip`.

## Shared building blocks (reuse them)
| Piece | File | Use |
|---|---|---|
| `Reveal` | `reveal.tsx` | fade/blur-in on scroll (`delay` prop) |
| `GlowEdge` + `.bglow` | `glow-edge.tsx` | pointer-following border glow on cards (task 3) |
| `IconTile` | `icons.tsx` | rounded icon tile (`index`, `large`) |
| `SmartLink` | `smart-link.tsx` | internal/external/hash links |
| `SectionHead`, `Frame`, `Chip`, `ButtonLink`, `Wide`, `Rich`, `paragraphs` | `ui.tsx` | section header/layout helpers; `*star*` text highlights |
| `VHead`, `useCycle`, `two`, `plain`, `lines` | `modern/variant-kit.tsx` | heading + auto-cycling state for variants |
| `Avatar` (rigged) | `avatar.tsx` | the character; CSS `.ch-*` |
| `techDetail(name)` | `lib/cms/content/tech-details.ts` | `{cat, tagline, builds[], industries[], why}` for a tool |
| `Lenis` | `smooth-scroll.tsx` → `window.__lenis` | programmatic scroll: `__lenis.scrollTo(y,{immediate:true,force:true})` |
| Registered CSS props | globals.css `@property` | `--th`, `--ts`, `--p`, `--nx`, `--ac` animate smoothly |
Keyframes you can reuse: `vq-in` (rise-in), `sx-fill`, `rise`, `fade-in`, `bob`.

## Layout conventions
- Section wrapper: `<section id="…" className="py-24 sm:py-32">` + inner `mx-auto w-full max-w-[1120px] px-4` (modern) or `Wide`.
- Pinned scroll scenes: outer track with computed height + inner `position: sticky; top: 78px` (logo clearance). The service stage
  zooms the content to fit short laptops (`.sx-fit` zoom ≥ 0.7). Use IntersectionObserver instead of per-frame layout reads.
- Desktop first and only; `prefers-reduced-motion` should stop long motion (existing code does).
- New grids inside a `display:grid` wrapper need `grid-template-columns: minmax(0, 1fr)` or long rows push the page wider
  (`:where(.vt,.vz,.vw,.vf,.vp)` rule at the end of globals.css does that for the variant sections).

## CSS prefix registry (grep `^\.<prefix>-` in `globals.css` before adding a new one)
| Prefix | Owner |  | Prefix | Owner |
|---|---|---|---|---|
| `hub` | Home hero hub (`hero-scene.tsx`) | | `sx` / `cv` | What-we-build stage / canvas (`service-stage.tsx`) |
| `ss` | service strip (locked) | | `vz` | What-we-build bodies (`service-bodies.tsx`) |
| `ts` / `tx` | TechSpace planets / pop-up (locked) | | `vt` | tools variants |
| `cm` | Industries city (locked) | | `vp` | process variants (`rl-*` = railway on Careers, **not** related) |
| `sy` / `vy` | story looks | | `vf` | FAQ variants |
| `vw` | why variants | | `vl` | related variants |
| `vk` | shared variant head | | `md` | modern skin tokens/typography |
| `bb`, `kit` | brand board / brand kit | | `arch` | Brand arch gallery |
| `ob`, `ws`, `tk`, `pb` | office builder (webdev guide) | | `gs`, `ch` | guide scenes / rigged avatar |
| `fg` | Figma studio (UI/UX guide) | | `ae` | After Effects guide (animation) |
| `sl` | SEO lab (SEO guide) | | `at`, `av` | automate switches / brand-board avatar wrapper |
| `fa` | flow diagram | | `cf`, `ios` | contact flow |
| `rc`, `ra` | contact receptionist | | `cj`, `rl`, `jb`, `ro`, `rv`, `rt`, `rh` | careers (journey, railway, job page, openings…) |
| `to2` | team office | | `tm`, `tj`, `tv` | team story sections |
| `of`, `bd`, `tl` | 2027 office, boards, timeline | | `aw`, `ac`, `ah` | About world / chapters / hero |
| `vfo`, `ga` | metaverse floor + gov courtyard | | `vs`, `vr`, `vd`, `vda`, `vq`, `mp`, `ve` | other metaverse parts |
| `pd` | PANDA chatbot (Jenish) | | `bud` | AI buddy |
| `orb` | industries orbit (unused) | | `st`, `go`, `gm`, `hg` | home street, glance orbit/min, hero gradient |
| `mm`, `fn`, `ft` | mega menu, floating nav, footer | | `tp` | theme picker |
| `bm`, `bp`, `adb` | blog masonry, blog post, admin blog preview | | `sk` | sketch canvas |
| `lg` | liquid-glass pill | | `nr` | neon reveal |
`vs-` already belongs to the metaverse; `rw-` is the Brand hero; `rl-` is the railway. When a new section needs a prefix, pick 2–3
unused letters and check.

## Effects the owner liked (own builds)
Neon Reveal, Dappled Light, Circle Gallery (draggable ring on a 3D floor), border glow, split-heading word reveal, blur-in entrances,
glass "liquid" pills, depth-of-field blur, compulsory (snapping) pinned scroll.
