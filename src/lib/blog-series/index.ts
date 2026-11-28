import type { Post } from "../blog-posts";
import { dateLabel } from "../blog-shared";
import { PART1 } from "./part1";
import { PART2 } from "./part2";
import { PART3 } from "./part3";
import { PART4 } from "./part4";
import { PART5 } from "./part5";

// THE GAME SERIES (2026-11-19): 20 articles about how online open-world 3D games in the style of GTA are built, one subject each (world streaming, vehicles,
// traffic, pathfinding, servers, netcode, missions, camera, 3D models, rendering, lighting, generation, audio, UI, accounts, anti-cheat, engines, cost). They are
// part of the blog (lib/blog.ts adds them to the articles of the admin panel), they link to each other and to /game-development, and every one has its own cover
// picture (public/images/blog/<slug>.webp, drawn by tools/make-blog-covers.mjs). A row with the same address in Admin > Blog replaces one of them (or hides it
// when it is not published). The facts are the common methods of the industry; nothing here describes the inside of any one game.
export const SERIES_CATEGORY = "Game Development";
export const SERIES_DATE = "2026-11-19";

// PART 5 (2026-11-27): 12 articles on internships, training and choosing a software company in Surat (pictures drawn by tools/make-blog-covers-2.mjs). Each one carries its own category.
export const CAREER_DATE = "2026-11-27";

const make = (list: typeof PART1, category: string, date: string): Post[] =>
  list.map((p) => ({ ...p, category: p.category ?? category, date, dateLabel: dateLabel(date), image: `/images/blog/${p.slug}.webp` }));

export const SERIES: Post[] = [
  ...make([...PART1, ...PART2, ...PART3, ...PART4], SERIES_CATEGORY, SERIES_DATE),
  ...make(PART5, "Business in Surat", CAREER_DATE),
];
