import { type Block, parseContent } from "@/lib/blog-shared";

// The blog SEO checker: one pure engine used by the admin blog editor (live panel), by the AI Submissions screen and by the AI tool preview_content.
// It checks the things on the page that a search engine and a reader can see (no live ranking data is used, nothing is sent anywhere):
// title, description, structure, keyword use, readability and rich-result extras. Score 0-100; every check says the problem and what to do.
// The weights add up to exactly 100 (see MAX below).

export type SeoStatus = "pass" | "warn" | "fail";
export type SeoGroup = "Title" | "Description" | "Structure" | "Keyword" | "Readability" | "Extras";

export type SeoCheck = { id: string; group: SeoGroup; status: SeoStatus; label: string; problem: string; fix: string; points: number; max: number };
export type SeoInput = {
  title: string;
  summary: string;
  /** the article in the light markup of the blog (## heading, - point, paragraphs) */
  content: string;
  tags: string[];
  faq: { question: string; answer: string }[];
  cover: string;
  /** the phrase the article should rank for; when empty the first tag is used */
  keyword?: string;
};
export type SeoReport = {
  score: number;
  grade: "Great" | "Good" | "Needs work" | "Poor";
  keyword: string;
  keywordSource: "typed" | "tag" | "none";
  words: number;
  checks: SeoCheck[];
};

export const SEO_GOOD_SCORE = 85;

const CLICKBAIT = /\b(shocking|you won'?t believe|insane|secret trick|game[- ]?changer|revolutionary|mind[- ]?blowing|unbelievable)\b|!{2,}/i;
const NEXT_STEP = /\b(contact|talk to|reach out|get in touch|next step|book a|schedule|start with|get started|let'?s|discuss|call us|speak with)\b/i;
const CONCLUSION_HEAD = /\b(conclusion|next step|final|wrap|takeaway|summary|what to do|get started|start|ready)\b/i;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s'-]/gu, " ").replace(/\s+/g, " ").trim();
const wordsOf = (s: string) => norm(s).split(" ").filter(Boolean);
const countPhrase = (hay: string, phrase: string) => {
  if (!phrase) return 0;
  const h = ` ${norm(hay)} `;
  const p = ` ${norm(phrase)} `;
  let n = 0;
  for (let i = h.indexOf(p); i >= 0; i = h.indexOf(p, i + p.length - 1)) n++;
  return n;
};
const blockText = (b: Block) => ("h" in b ? b.h : "p" in b ? b.p : b.ul.join(" "));

function check(id: string, group: SeoGroup, max: number, status: SeoStatus, label: string, problem: string, fix: string): SeoCheck {
  return { id, group, status, label, problem, fix, max, points: status === "pass" ? max : status === "warn" ? Math.round(max / 2) : 0 };
}
/** a check that cannot run (no focus keyword set): shown as a warning, no points */
const unknown = (id: string, group: SeoGroup, max: number, label: string, fix: string): SeoCheck => ({ ...check(id, group, max, "warn", label, "No focus keyword is set, so this cannot be checked.", fix), points: 0 });

/** inside lo..hi = pass, any other number above zero = warn, zero = fail */
const rangeStatus = (n: number, lo: number, hi: number): SeoStatus => (n >= lo && n <= hi ? "pass" : n > 0 ? "warn" : "fail");
const band = (n: number, pass: [number, number], warn: [number, number]): SeoStatus => (n >= pass[0] && n <= pass[1] ? "pass" : n >= warn[0] && n <= warn[1] ? "warn" : "fail");

export function analyzeBlog(input: SeoInput): SeoReport {
  const title = input.title.trim();
  const summary = input.summary.trim();
  const typed = (input.keyword ?? "").trim();
  const tagKw = input.tags.find((t) => t.trim())?.trim() ?? "";
  const keyword = typed || tagKw;
  const keywordSource: SeoReport["keywordSource"] = typed ? "typed" : tagKw ? "tag" : "none";

  const blocks = parseContent(input.content);
  const allText = blocks.map(blockText).join(" ");
  const words = wordsOf(allText).length;
  const headings = blocks.filter((b): b is { h: string } => "h" in b).map((b) => b.h);
  const paragraphs = blocks.filter((b): b is { p: string } => "p" in b).map((b) => b.p);
  const firstParagraph = paragraphs[0] ?? "";
  const checks: SeoCheck[] = [];
  const noKw = !keyword;
  const kwFix = "Type the focus keyword (the phrase people search for) in the box above, for example \"3D web design\".";

  // ---- Title (20)
  const tl = title.length;
  checks.push(
    check(
      "title-length",
      "Title",
      8,
      band(tl, [30, 60], [20, 70]),
      `Title length (${tl} characters)`,
      tl === 0 ? "There is no title." : tl < 30 ? "The title is short: it says little to a reader or a search engine." : "Search results cut a title at about 60 characters.",
      tl < 30 ? "Make it 30-60 characters: say what the article gives the reader." : "Shorten it to 60 characters or less, keep the important words first.",
    ),
  );
  const pos = keyword ? norm(title).indexOf(norm(keyword)) : -1;
  checks.push(
    noKw
      ? unknown("title-keyword", "Title", 8, "Keyword in the title", kwFix)
      : check(
          "title-keyword",
          "Title",
          8,
          pos < 0 ? "fail" : pos > 25 ? "warn" : "pass",
          "Keyword in the title",
          pos < 0 ? `The title does not contain "${keyword}".` : "The keyword is late in the title.",
          pos < 0 ? `Put "${keyword}" in the title, near the start.` : "Move the keyword closer to the start of the title.",
        ),
  );
  const caps = title.split(/\s+/).filter((w) => w.length >= 4 && w === w.toUpperCase() && /[A-Z]/.test(w)).length;
  checks.push(
    check(
      "title-tone",
      "Title",
      4,
      CLICKBAIT.test(title) || caps >= 2 ? "warn" : "pass",
      "Honest title",
      "The title looks like clickbait (shouting words or hype).",
      "Write the title as a plain, specific promise. Remove hype words and ALL-CAPS.",
    ),
  );

  // ---- Description (15)
  const sl = summary.length;
  checks.push(
    check(
      "desc-length",
      "Description",
      7,
      band(sl, [120, 160], [90, 180]),
      `Description length (${sl} characters)`,
      sl === 0 ? "There is no summary, so search engines will pick random text." : sl < 120 ? "The description is short." : "The description is long and will be cut in search results.",
      "Write the summary in 120-160 characters: the main keyword and what the reader gets.",
    ),
  );
  checks.push(
    noKw
      ? unknown("desc-keyword", "Description", 5, "Keyword in the description", kwFix)
      : check(
          "desc-keyword",
          "Description",
          5,
          countPhrase(summary, keyword) > 0 ? "pass" : "fail",
          "Keyword in the description",
          `The summary does not contain "${keyword}".`,
          `Use "${keyword}" once in the summary.`,
        ),
  );
  const same = norm(summary) && (norm(summary) === norm(title) || norm(summary).startsWith(norm(title)));
  checks.push(check("desc-unique", "Description", 3, !summary ? "fail" : same ? "warn" : "pass", "Description is not a copy of the title", "The summary repeats the title.", "Write a different sentence: the title is the promise, the summary explains it."));

  // ---- Structure (30)
  checks.push(
    check(
      "length",
      "Structure",
      9,
      words >= 800 ? "pass" : words >= 300 ? "warn" : "fail",
      `Article length (${words} words)`,
      words < 300 ? "The article is very thin. Search engines rank thin pages low." : "The article is shorter than most pages that rank.",
      "Write at least 800 words. Add examples, steps or a real case, not filler.",
    ),
  );
  checks.push(
    check(
      "h2-count",
      "Structure",
      6,
      band(headings.length, [4, 8], [3, 10]),
      `Sections (${headings.length} headings)`,
      headings.length < 3 ? "There are too few headings: readers and search engines cannot scan the article." : "There are too many headings for this article.",
      "Use 4-8 `## ` headings, one idea per section.",
    ),
  );
  const dup = new Set(headings.map(norm)).size !== headings.length;
  checks.push(check("h2-unique", "Structure", 4, dup ? "warn" : "pass", "Every heading is different", "Two headings have the same text.", "Give every section its own descriptive heading."));
  checks.push(
    noKw
      ? unknown("h2-keyword", "Structure", 4, "Keyword in a heading", kwFix)
      : check("h2-keyword", "Structure", 4, headings.some((h) => countPhrase(h, keyword) > 0) ? "pass" : "warn", "Keyword in a heading", `No heading contains "${keyword}".`, `Use "${keyword}" (or a close form) in one \`## \` heading.`),
  );
  const introOk = blocks.length > 0 && "p" in blocks[0] && wordsOf(firstParagraph).length <= 120;
  checks.push(check("intro", "Structure", 3, introOk ? "pass" : "warn", "Short introduction first", "The article does not start with a short paragraph (it starts with a heading or a very long block).", "Start with a 2-4 sentence introduction that says what the reader will get."));
  const lastHead = headings[headings.length - 1] ?? "";
  const lastText = blockText(blocks[blocks.length - 1] ?? { p: "" });
  checks.push(check("conclusion", "Structure", 4, CONCLUSION_HEAD.test(lastHead) || NEXT_STEP.test(lastText) ? "pass" : "warn", "Ends with a next step", "The article just stops: there is no conclusion or next step.", "End with a short conclusion and one gentle next step (for example talking to the We3vision team)."));

  // ---- Keyword (15)
  if (noKw) {
    checks.push(unknown("kw-intro", "Keyword", 7, "Keyword in the first paragraph", kwFix));
    checks.push(unknown("kw-density", "Keyword", 8, "Keyword use", kwFix));
  } else {
    const early = wordsOf(firstParagraph).slice(0, 100).join(" ");
    checks.push(check("kw-intro", "Keyword", 7, countPhrase(early, keyword) > 0 ? "pass" : "fail", "Keyword in the first paragraph", `The first paragraph does not contain "${keyword}".`, `Use "${keyword}" naturally in the first 100 words.`));
    const hits = countPhrase(allText, keyword);
    const density = words ? (hits * wordsOf(keyword).length * 100) / words : 0;
    const status: SeoStatus = hits === 0 ? "fail" : density >= 0.5 && density <= 2.5 ? "pass" : density > 3.5 || density < 0.2 ? "fail" : "warn";
    checks.push(
      check(
        "kw-density",
        "Keyword",
        8,
        status,
        `Keyword use (${hits}x, ${density.toFixed(1)}%)`,
        hits === 0 ? `"${keyword}" is not in the article.` : density > 2.5 ? "The keyword is repeated too often: it reads as keyword stuffing." : "The keyword is used too rarely for the search engine to see the topic.",
        density > 2.5 ? "Remove some repeats and use related words instead." : `Use "${keyword}" about once in every 100-150 words, in natural sentences.`,
      ),
    );
  }

  // ---- Readability (10)
  const sentences = [...paragraphs, ...blocks.flatMap((b) => ("ul" in b ? b.ul : []))].flatMap((t) => t.split(/(?<=[.!?])\s+/)).filter((s) => wordsOf(s).length > 0);
  const avg = sentences.length ? sentences.reduce((n, s) => n + wordsOf(s).length, 0) / sentences.length : 0;
  checks.push(check("sentences", "Readability", 4, avg === 0 ? "warn" : avg <= 22 ? "pass" : avg <= 28 ? "warn" : "fail", `Sentence length (${avg.toFixed(0)} words on average)`, "The sentences are long and hard to read.", "Split long sentences. Aim for 15-20 words on average."));
  const longest = Math.max(0, ...paragraphs.map((p) => wordsOf(p).length));
  checks.push(check("paragraphs", "Readability", 3, longest <= 120 ? "pass" : longest <= 180 ? "warn" : "fail", `Paragraph length (longest ${longest} words)`, "A paragraph is a wall of text.", "Keep paragraphs to 2-4 sentences (under 120 words)."));
  checks.push(check("bullets", "Readability", 3, blocks.some((b) => "ul" in b) ? "pass" : "warn", "A list somewhere", "The article has no bullet list.", "Turn steps or options into a `- ` list: readers (and search snippets) like lists."));

  // ---- Extras (10)
  checks.push(check("faq", "Extras", 5, rangeStatus(input.faq.length, 3, 6), `FAQ (${input.faq.length} questions)`, input.faq.length === 0 ? "There are no FAQ items: no chance of the FAQ rich result in Google." : "A few more questions would help.", "Add 3-6 real questions with 1-3 sentence answers (not repeated from the text)."));
  checks.push(check("tags", "Extras", 3, rangeStatus(input.tags.length, 3, 8), `Tags (${input.tags.length})`, "Tags help the topic page and related articles.", "Use 3-8 short keyword tags."));
  checks.push(check("cover", "Extras", 2, input.cover.trim() ? "pass" : "warn", "Cover picture", "No cover picture: the blog page shows only covers, and share previews are empty.", "Add a cover picture."));

  // an almost empty article cannot score well because of checks that pass on nothing (short paragraphs, no stuffing ...)
  const raw = checks.reduce((n, c) => n + c.points, 0);
  const score = words < 100 ? Math.min(raw, 30) : raw;
  const grade: SeoReport["grade"] = score >= SEO_GOOD_SCORE ? "Great" : score >= 70 ? "Good" : score >= 50 ? "Needs work" : "Poor";
  return { score, grade, keyword, keywordSource, words, checks };
}

/** Plain text of a report (the AI tool preview_content gives it to the AI so it can fix the draft). Only the problems are listed in detail. */
export function seoReportText(r: SeoReport): string {
  const open = r.checks.filter((c) => c.status !== "pass");
  const lines = [
    `SEO score: ${r.score}/100 (${r.grade}). Focus keyword: ${r.keyword ? `"${r.keyword}" (${r.keywordSource === "tag" ? "taken from the first tag" : "given"})` : "none set"}. ${r.words} words.`,
    open.length ? `Fix these (most important first):` : "No problems found.",
    ...open
      .sort((a, b) => b.max - b.points - (a.max - a.points))
      .map((c) => `- [${c.status === "fail" ? "FIX" : "improve"}] ${c.label}: ${c.problem} -> ${c.fix}`),
  ];
  return lines.join("\n");
}
