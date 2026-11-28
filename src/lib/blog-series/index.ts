import type { Post } from "../blog-posts";
import { dateLabel } from "../blog-shared";
import { PART5 } from "./part5";

// THE CODE ARTICLES (lib/blog.ts adds them to the articles of the admin panel, after them). Part 5 (2026-11-27): 12 articles on internships, training and choosing
// a software company in Surat; each one carries its own category, its cover picture is public/images/blog/<slug>.webp (drawn by tools/make-blog-covers-2.mjs).
// A row with the same address in Admin > Blog replaces one of them (or hides it when it is not published). Add a new part as part6.ts and list it below.
export const CAREER_DATE = "2026-11-27";

const make = (list: typeof PART5, category: string, date: string): Post[] =>
  list.map((p) => ({ ...p, category: p.category ?? category, date, dateLabel: dateLabel(date), image: `/images/blog/${p.slug}.webp` }));

export const SERIES: Post[] = [...make(PART5, "Business in Surat", CAREER_DATE)];
