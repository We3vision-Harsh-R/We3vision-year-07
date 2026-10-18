# 17 · Skills, plugins and agents used for the iOS 27 phone / tablet redesign (2026-10-18)

The owner asked to use every installed skill, plugin and AI agent that helps the design. This file lists them so any AI tool can reuse the same set.

## Design source
- **Figma MCP** (connected, file `Mvsl8ZybkGKDROrxau03IG` "iOS and iPadOS 27 (Community)") — component numbers are in `brain/16-ios27-design-system.md`.
- Skill `figma:figma-design-to-code` (mandatory before `get_design_context`).

## Installed skills used (Skill tool, no new install needed)
| Skill | Used for |
|---|---|
| `frontend-design:frontend-design` | aesthetic direction, typography, avoiding templated looks |
| `audit-suite:make-interfaces-feel-better` | polish: spacing, states, feedback on tap |
| `audit-suite:web-animation-design` | springs, crossfades, reduced-motion |
| `audit-suite:web-design-guidelines` | layout / readability rules |
| `audit-suite:audit-as-a11y-eng`, `design:accessibility-review` | keyboard, aria, contrast checks |
| `apple-skills:design` | Liquid Glass, SF-style type scale, HIG motion |
| `apple-skills:visionos` | the /metaverse page (spatial glass) |
| `design:ux-copy` | short labels on buttons and controls |
| agent `apple:hig-reviewer` | HIG review of finished pages |

## AI agents (run in parallel, one owner per file group, no file shared between two agents)
| Agent | Pages / files |
|---|---|
| webdev | /webdev, /mobile — `pages/custom/webdev/*`, `(m)/m/webdev/*` |
| ai-software | /ai, /software-development-services |
| creative | /ui-ux-design, /animation, /3d-modeling |
| crm-products | /crm, /products and the 4 product pages |
| about-team | /about, /team + `sections/about*`, `sections/team*` |
| careers-contact | /careers, /contact + `sections/career*` |
| content | /blog, /portfolio, detail pages (blog / portfolio / careers slug), /sitemap |
| metaverse | /metaverse + `sections/vr*` |
| shared-a | shared hero / story / flow / guide / automate / services / highlights sections (`app/ios27-sections-b.css`) — the 16 generic service pages |
| shared-b | shared process / tags / industries / advantages / strengths / faq / contact / timeline / reach / projects / blogs sections (`app/ios27-sections.css`) |
| launcher | the home screen `/` on phones (`launcher*`, `calendar-pop.tsx`, `(m)/mobile.css`) |
| kit | the shared foundation `mobile/app/*` (nav bar, tab bar, sheets, buttons, type scale), `pages/render.tsx` |

## Not installed (on purpose)
Downloading or running code from the internet (new plugins, npm packages, scripts) is not done by the AI on its own; the redesign uses only what is already
in the project and the installed skills. If a new package is wanted, the owner installs it (or approves it) and it is added here.
