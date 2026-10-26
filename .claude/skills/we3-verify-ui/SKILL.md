---
name: we3-verify-ui
description: Look at a page of the We3vision site in headless Chrome with one command and few tokens (screenshots, scripted clicks, fest preview). Use after a visible change.
---

# Verify the UI cheaply

The Browser pane is often hidden, so use the headless scripts in `tools/`:

- `tools/shot.mjs <base> <path> <WxH,WxH> <outPrefix> "<js run before the shot>"` : screenshot(s) after running a JS snippet (it may `return` a value that is printed). Example: `MSYS_NO_PATHCONV=1 node tools/shot.mjs http://localhost:1010 "/about?festtest" 1440x900 out "window.scrollTo(0,99999); return 1"`
- `tools/nav-hover-test.mjs`, `tools/ui-audit.mjs` : floating nav and page audit.

Rules: start the dev server with `preview_start {name:"dev"}` (port 1010) and stop it after. In Git Bash always prefix `MSYS_NO_PATHCONV=1`. `?festtest` turns every festival effect on. The first request after a start compiles slowly: `curl` the page once first, and wait 8-11 s after load for lazy festival chunks. Prefer reading the printed values from the snippet; look at ONE screenshot per finished piece and only open the image you need. Check 1440x900 first, then 1100 and 1920 for layout work.
