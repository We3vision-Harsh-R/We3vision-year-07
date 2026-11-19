# 25 — Game development page + the 20-article "GTA-style games" series (2026-11-19)

Why: the site names game development as a service (About page, Metaverse page) but had no page for it, so nobody searching "game development company in India" or
"make a game like GTA" could find it. This adds the page and a 20-article series that explains, one subject per article, how online open-world 3D games in the style
of GTA are built. It is written to match what people really type (how, what, cost, engine), and to lead them to the service page.

## What is on the site (after the next deploy)
| Piece | Where | Notes |
|---|---|---|
| Service page | `/game-development` (`src/lib/cms/content/game-development.ts`, registered in `lib/cms/pages.ts` as slug `game`) | One H1, 9 H2, 11 FAQs (FAQPage data), Service + Breadcrumb data, a "What goes into a GTA-style game" block, the list of all 20 articles, a trademark notice. In the big menu (Development), footer, chat list, About and Metaverse links, 3D Modeling "related", home FAQ answer. Appears in sitemap.xml and llms.txt by itself. |
| 20 articles | `/blog/<address>` (code: `src/lib/blog-series/part1-4.ts`, joined in `index.ts`, merged into the blog in `lib/blog.ts`) | Topic "Game Development", all dated 2026-11-19, each 450-650 words + 3 FAQs (FAQPage data) + 5 tags, links to the other articles and to `/game-development`. Shown after the articles of the admin panel. |
| 20 pictures | `public/images/blog/<address>.webp` (1600 x 900, 18-66 KB) | Own drawings (a streamed map, a car with its springs, a path on a grid, servers, a shield ...), one neon-city mood, no text and no outside art, drawn by `node tools/make-blog-covers.mjs`. File name = article address; alt text = article title; they are also the share picture (og:image). |
| Links | `components/site/blog-rich.tsx` | `[words](/address)` in a paragraph becomes an internal link (also on the phone page). Related articles now rotate through the same topic (each article gets links from its three neighbours). A "Our service" link to `/game-development` shows in the article side bar. |

## The addresses (all short, keyword first)
| # | Article | Address |
|---|---|---|
| 1 | How Online Open-World Games Like GTA Are Made (overview, links to all) | `/blog/how-gta-style-open-world-games-are-made` |
| 2 | How Open-World Maps Work: Streaming, Chunks and LODs | `/blog/open-world-map-streaming-chunks-and-lod` |
| 3 | Vehicle Physics in Games: How 3D Cars Drive | `/blog/vehicle-physics-in-3d-games-explained` |
| 4 | How City Traffic and Crowds Work in 3D Games | `/blog/traffic-and-crowd-ai-in-open-world-games` |
| 5 | Pathfinding in 3D Games: NavMesh and A* Explained | `/blog/pathfinding-navmesh-and-a-star-in-games` |
| 6 | Multiplayer Game Architecture: Client vs Server | `/blog/multiplayer-game-architecture-client-server` |
| 7 | Netcode Basics: Lag, Prediction and Interpolation | `/blog/netcode-lag-prediction-and-interpolation` |
| 8 | How Game Servers Scale to Thousands of Players | `/blog/scaling-game-servers-for-thousands-of-players` |
| 9 | How Missions and Quests Are Built in Open-World Games | `/blog/mission-and-quest-systems-in-open-world-games` |
| 10 | Third-Person Camera and Character Controls in 3D Games | `/blog/third-person-camera-and-controls-in-3d-games` |
| 11 | From Concept Art to In-Game 3D Models: The Pipeline | `/blog/3d-model-pipeline-for-games-concept-to-engine` |
| 12 | How Big 3D Cities Render Fast: Culling and Draw Calls | `/blog/rendering-big-3d-cities-culling-and-draw-calls` |
| 13 | Day-Night Cycles, Lighting and Weather in 3D Games | `/blog/day-night-cycle-lighting-and-weather-in-games` |
| 14 | Procedural Generation: Building 3D Worlds with Code | `/blog/procedural-generation-for-3d-game-worlds` |
| 15 | Game Audio in 3D Worlds: Spatial Sound and Ambience | `/blog/spatial-audio-and-sound-design-in-3d-games` |
| 16 | Minimaps, Waypoints and HUDs: Game UI Explained | `/blog/game-ui-minimaps-waypoints-and-hud-design` |
| 17 | Saving Progress in Online Games: Accounts and Databases | `/blog/player-accounts-and-databases-for-online-games` |
| 18 | Anti-Cheat and Security in Online 3D Games | `/blog/anti-cheat-and-security-for-online-games` |
| 19 | Unity vs Unreal Engine for an Open-World Game | `/blog/unity-vs-unreal-engine-open-world-games` |
| 20 | GTA-Style Game Cost: Team, Time and Scope Explained | `/blog/gta-style-game-development-cost-time-and-team` |

## Keywords and tags (where they are, and why not everywhere)
- Page title and description: "game development company in India", "Unity and Unreal Engine", "GTA-style" prototypes. H1: "Game Development Company In India". H2/FAQ: "GTA-style game", "make a game like GTA", "like GTA 6", "open-world game", "Unity or Unreal Engine for an open-world game", "how much does it cost to develop a game like GTA". Body: "game development company in Surat, India", "3D games", "VR and AR games", "metaverse games", "WebGL and Three.js".
- Articles: each title is the question people type; the tags (shown on the page, written into the Article data as `keywords`) are 5 per article, for example Open world games, GTA-style games, 3D game development, Game servers, Netcode, Unity, Unreal Engine, Game audio, Game UI.
- The `<meta name="keywords">` tag is NOT used: Google and Bing ignore it.
- "GTA" and "GTA 6" are used only where they describe a style of game and in questions people ask, never as a list of keywords on every page. Stuffing them everywhere is a spam signal for Google and a trademark risk (GTA and Grand Theft Auto are trademarks of Take-Two Interactive Software, Inc.). The page says the company is not connected to them and never copies another game's characters, maps, music or art. This is not legal advice.
- No page can honestly be promised a rank for the head term "GTA 6": that search belongs to the publisher, big news sites and Wikipedia. The realistic targets are the long questions above, and "game development company in India / Surat".

## After the deploy (Search Console)
1. Request indexing for `/game-development`, then the 20 articles, 10 a day (the list of addresses is the table above; use `https://www.we3vision.com` + address).
2. In Performance, filter queries that contain "game", "gta", "open world", "unity", "unreal" after 1-2 weeks. Pages at position 8-20 are the ones to improve first (longer text, more examples).
3. These articles are in code, so no search engine is pinged by the admin panel automatically; the sitemap carries them (lastmod 2026-11-19).

## How to change or remove one
- Edit the text: `src/lib/blog-series/part*.ts` (blocks: `{ h }` heading, `{ p }` paragraph with optional `[words](/address)` links, `{ ul }` list; `faq`; `tags`). Pictures: change the drawing in `tools/make-blog-covers.mjs` and run it again.
- Replace or hide one without code: in Admin > Blog add an article with the SAME address (it is shown instead), or the same address unpublished (it is hidden).
- To list them in the admin panel for editing, they would have to be imported into the database (not done: the database is not reachable from the code here).

## Slugs of the rest of the site (not changed, decision for the owner)
- Three technology pages keep the old, mis-spelt addresses on purpose (`/custom-wordpress-devlopment-services`, `/custom-woocommerce-devlopment`, `/headless-CMS-devlopment-services`; the last one also has capital letters) because they were indexed under these names. Changing them needs a 301 redirect from each old address; best done now while Search Console is new. Tell me and I do it.
- One older article in the database has a cut-off address (`.../web-apps-ai-and-immers`) and three article titles are over 70 characters: fix in Admin > Blog.

## Ideas for the next articles (honest, useful, linked to the service page)
How to make a GTA-style game in the browser with Three.js; How multiplayer co-op missions are built; Physics and destruction in open-world games; How to design the map of an open-world game (landmarks and districts); Building a driving game in Unity; Live operation of an online game (events, updates, economy); How games handle loading screens and saves. A news-style "GTA 6" explainer was offered and NOT chosen: it brings fans, not clients, and needs facts checked against official sources on the day.
