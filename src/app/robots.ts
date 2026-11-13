import type { MetadataRoute } from "next";

// robots.txt. Everything public may be crawled; the admin panel, the draft previews and the API are private.
// The search and answer crawlers of AI products are named on purpose, so the rule is visible and cannot be lost by accident:
//   OAI-SearchBot (ChatGPT search), ChatGPT-User (a person asks ChatGPT to open a page), PerplexityBot (Perplexity search), Claude-SearchBot.
// These are SEARCH crawlers: they find and quote pages in answers. The crawlers that collect text to TRAIN models (GPTBot, Google-Extended,
// ClaudeBot, CCBot ...) are NOT named here: they follow the "*" rule, which is exactly what the site did before. Changing that is the owner's
// decision (add a "User-agent: GPTBot / Disallow: /" group to forbid it). A named group replaces the "*" group for that crawler, so the private
// paths are repeated in it.
const PRIVATE = ["/admin", "/preview", "/m/preview", "/api/"];
const SEARCH_BOTS = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot"];

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1010").replace(/\/+$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: SEARCH_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
