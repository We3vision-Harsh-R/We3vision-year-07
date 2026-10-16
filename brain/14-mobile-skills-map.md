# 14 — Mobile app sprint: skills map (which agent calls which skill)

Written by Agent 9 (skill scout), 2026-10-16. Companion of `brain/13-mobile-app-plan.md`. Everything below was checked against the skills and
plugins that are installed and enabled in this Claude Code session (ListSkills / SearchSkills / ListPlugins / SearchPlugins). Nothing was downloaded,
installed or executed from the internet.

## How to call a skill (read once)
1. Use the **Skill tool**: `Skill(skill="<exact name>", args="<what to look at>")`. Names are exact, e.g. `apple-skills:design`, `audit-suite:audit-as-a11y-eng`.
2. Call it BEFORE you write code for that concern (design skills before building, audit skills after building), not at the very end.
3. A skill gives guidance, not permission: the hard rules in `brain/13-mobile-app-plan.md` and `brain/02-rules-and-preferences.md` always win
   (laptop untouched, Poppins, theme colours only, no 3D, no new CSS in `globals.css`, CMS content only).
4. Apple skills are written for Swift/SwiftUI: take the DESIGN ideas (spacing, hierarchy, motion timing, copy tone) and implement them in CSS/React.
   Never add Swift, Xcode, or any native-app file to this repo.
5. Skills that "audit" may suggest edits outside your ownership: report those on the board instead of editing another agent's files.
6. If a skill needs a connector that is not logged in (Figma, Notion, Slack...), skip it and say so in your report; do not try to log in.

## Agent -> skills to call, in order

| Agent | Skills (in order) | Used for |
|-------|-------------------|----------|
| 1 System designer | 1 `apple-skills:design` (Liquid Glass, typography, SF-symbol-like icons, motion) -> 2 `design:design-system` (tokens, component list, naming) -> 3 `frontend-design:frontend-design` (production-quality React/CSS) -> 4 `audit-suite:vercel-react-best-practices` (server vs client components, Next.js 16 data fetching) -> 5 `audit-suite:web-design-guidelines` (UI rules check) -> 6 `engineering:system-design` (renderMobilePage / section-type mapping) | Build the `ma-` kit, `renderMobilePage`, `app.css` tokens |
| 2a-2d Page designers | 1 `apple-skills:design` (screen composition, large titles, grouped lists) -> 2 `frontend-design:frontend-design` -> 3 `design:ux-copy` (only to CHECK labels/buttons fit; never change the website words) -> 4 `audit-suite:make-interfaces-feel-better` (small polish: press states, spacing) -> 5 `audit-suite:web-animation-design` (CSS transitions only: transform/opacity) | Give each page its own iOS app screen with the laptop content |
| 3 Dev structure | 1 `engineering:code-review` -> 2 `engineering:tech-debt` -> 3 `audit-suite:audit-as-structural-eng` -> 4 `audit-suite:audit-as-repo-maintainer` -> 5 `audit-suite:audit-as-dx-eng` -> 6 `engineering:architecture` (only if a structure decision is needed) | Folder structure, dead code, duplicated CSS, naming, types |
| 4 Responsive | 1 `audit-suite:audit-as-frontend-eng` -> 2 `audit-suite:audit-as-design-eng` -> 3 `audit-suite:emil-design-engineering` (detail polish) -> 4 `audit-suite:web-design-guidelines` -> 5 `design:design-critique` (look at screenshots at 320/375/390/430/744/820/1024) | Fix layout at phone and tablet widths |
| 5 Bugs | 1 `engineering:debug` -> 2 `audit-suite:audit-as-a11y-eng` -> 3 `design:accessibility-review` -> 4 `audit-suite:audit-as-perf-eng` (page weight, LCP/CLS, no heavy JS) -> 5 `engineering:testing-strategy` (what smoke checks to keep) -> 6 `audit-suite:audit-as-prod-readiness` | Console/network errors, hydration, broken links, a11y, speed |
| 6 / 7 Meta reviewers | 6: `engineering:code-review` -> `audit-suite:full-audit` (once, on the whole mobile tree). 7: `design:design-critique` -> `design:design-handoff` (check that the board and notes match what was built) -> `audit-suite:audit-as-ux-eng` | Check that agents 1-5 did their job |
| 8 Desktop guard | 1 `engineering:code-review` (diff of forbidden paths) -> 2 `audit-suite:audit-as-prod-readiness` -> 3 `security-review` (proxy rewrite must not leak `/m` to laptops) -> 4 `engineering:deploy-checklist` | Prove laptop/desktop is unchanged and `proxy.ts` is safe |
| 10 Keeper of notes | 1 `engineering:documentation` -> 2 `design:design-handoff` (for the design-system note in `brain/11-mobile-architecture.md`) | Board, task history, open items |

Agent 9 (this agent) only produced this file.

Quick rules of thumb:
- Anything about how it LOOKS or MOVES -> `apple-skills:design` first, then `frontend-design:frontend-design`.
- Anything about HOW THE CODE IS BUILT in Next.js 16 -> `audit-suite:vercel-react-best-practices` (and read `node_modules/next/dist/docs/` as AGENTS.md says).
- Anything about CHECKING finished work -> the matching `audit-suite:audit-as-*` lens, then `engineering:code-review`.

## Not applicable (do not call these)

| Skill / plugin | Why not |
|----------------|---------|
| `apple-skills:swiftui`, `swift`, `swiftdata`, `ios` (ios-development), `macos`, `watchos`, `visionos` | SwiftUI only (native code) |
| `apple-skills:foundation`, `generators`, `shared`, `mapkit`, `core-ml`, `apple-intelligence` | Native frameworks only |
| `apple-skills:app-store`, `release-review`, `legal`, `growth`, `monetization`, `product` and `apple:submit/ship/deploy/testflight/metadata/screenshots/rejection/release/release-notes/milestone/ratings/experiment/event/localize/privacy` | App Store / TestFlight workflow |
| `apple:iap`, `apple:subscription` | StoreKit only |
| `apple:new-app`, `brainstorm`, `idea(s)`, `roadmap`, `plan`, `build`, `autonomous`, `verify`, `map`, `resume`, `pause`, `progress`, `help`, `usage`, `validate`, `differentiate`, `discuss`, `spike`, `next-version`, `modernize` | SwiftShip app workflow (writes `.planning/` for Swift apps) |
| `apple:accessibility`, `apple:visual-qa`, `apple:walkthrough`, `apple:prototype`, `apple:juice`, `apple:icon`, `apple:review`, `apple:perf`, `apple:security`, `apple:test`, `apple:debug`, `apple:bugfix` | Needs Xcode / Simulator / XCUITest (use the web equivalents in the table) |
| `apple:hig-reviewer`, `apple:swiftui-builder`, `apple:swift-generalist`, other `apple:*` agents | Swift code agents (HIG ideas are already in `apple-skills:design`) |
| `figma:*` (figma-design-to-code, figma-use, figma-generate-design, ...) | Only if the owner connects Figma and gives a file link; Figma login is not done in this session. `figma:figma-swiftui` never applies |
| `parallax-threejs:*`, `anthropic-skills:threejs-core-concepts` | 3D / three.js; mobile pages must have no 3D |
| `searchfit-seo:*` | SEO work; mobile pages keep the laptop canonical URL, no SEO changes in this sprint |
| `remotion:*`, `ffmpeg-llm:*`, `anthropic-skills:*` (pptx, docx, pdf, xlsx, ...) | Video / office files |
| `small-business:*`, `finance:*`, `10x-Team:*`, `ai-employees:hire`, `agent-army:agent-army`, `agent-debugging:*` | Business or team-orchestration tools, not part of this build (agent-army would duplicate the 10-agent sprint) |
| `workflow-audit:*` | SwiftUI workflow audit |
| `design:user-research`, `design:research-synthesis` | No user research in this sprint |

## Missing / optional plugins (owner: click Install, nothing was installed)
Found in the plugin directory, currently NOT enabled:
- **Mobile App Design (iOS)** by UXKIN (`plugin_011xvEF1CFLsDNkMYoBcKLKo`): skills `ios-screens`, `ios-flows`, `ios-review`, commands `review-screen`. Gives iPhone
  screen patterns checked against Apple conventions (settings, lists, permissions). Most useful for Agents 1, 2a-2d and 7. It is community-made and its
  optional `uxkin` MCP server is remote: skills alone are enough, the MCP can stay off.
- **A11y Enforcer: WCAG Accessibility Checker** (`plugin_019ZPoryasLhWPPD2ajsJYPb`): `/a11y-check` and `/contrast` commands for HTML/React. Useful for Agent 5
  (contrast >= 4.5 on theme colours). Optional, because `audit-suite:audit-as-a11y-eng` and `design:accessibility-review` already cover this.
- Not recommended: *Mobile Design System* (greenfield only, makes a new design system from scratch) and *tailwind-design-system* (this repo uses its own CSS prefixes).

Already installed and enough: Design, Frontend Design, Engineering, Audit Suite, Security Review, `apple-skills` (design part only).

## Owner's list: not found
- Anything for Swift/SwiftUI/SwiftData/StoreKit/CloudKit/TestFlight/Xcode exists (as `apple-skills:*`, `apple:*`), but is not applicable to a Next.js website (see above).
- No separate "iOS 26 Liquid Glass" skill exists by that name: it is inside `apple-skills:design`. Same for "typography", "ux-writing", "sf-symbols", "animation": all inside `apple-skills:design`.
- No dedicated "Next.js 16" or "CSS" skill: use `audit-suite:vercel-react-best-practices` + the docs in `node_modules/next/dist/docs/`.
- `design:design-handoff` and all `figma:*` skills exist, but `figma` and other connectors (Notion, Slack, Linear, GitHub...) show "needs authentication": they will not work until the owner logs in.
