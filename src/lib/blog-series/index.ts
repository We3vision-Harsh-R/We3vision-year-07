import type { Post } from "../blog-posts";
import { dateLabel } from "../blog-shared";
import { PART1 } from "./part1";
import { PART2 } from "./part2";
import { PART3 } from "./part3";
import { PART4 } from "./part4";

// THE GAME SERIES (2026-11-19): 20 articles about how online open-world 3D games in the style of GTA are built, one subject each (world streaming, vehicles,
// traffic, pathfinding, servers, netcode, missions, camera, 3D models, rendering, lighting, generation, audio, UI, accounts, anti-cheat, engines, cost). They are
// part of the blog (lib/blog.ts adds them to the articles of the admin panel), they link to each other and to /game-development, and every one has its own cover
// picture (public/images/blog/<slug>.webp, drawn by tools/make-blog-covers.mjs). A row with the same address in Admin > Blog replaces one of them (or hides it
// when it is not published). The facts are the common methods of the industry; nothing here describes the inside of any one game.
export const SERIES_CATEGORY = "Game Development";
export const SERIES_DATE = "2026-11-19";

export const SERIES: Post[] = [...PART1, ...PART2, ...PART3, ...PART4].map((p) => ({
  ...p,
  category: SERIES_CATEGORY,
  date: SERIES_DATE,
  dateLabel: dateLabel(SERIES_DATE),
  image: `/images/blog/${p.slug}.webp`,
}));
