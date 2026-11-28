import type { Post } from "../blog-posts";

/** One article of the code articles as it is written (category, date and picture are added in index.ts). */
export type SeriesPost = Pick<Post, "slug" | "title" | "summary" | "tags" | "blocks" | "faq"> & { category?: string };
