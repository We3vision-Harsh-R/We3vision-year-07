// Cleaning of text that comes from an AI tool. The website never renders raw HTML (articles use a light text markup, everything else is plain
// text), so the rule is simple: remove anything that looks like HTML, hidden control characters and unsafe links BEFORE the text is checked
// against the limits of the registry. No server-only imports: used by the MCP server, the admin panel and the tests.

// comments, whole <script>/<style> blocks (with their content), then any other tag
const TAG = /<!--[\s\S]*?-->|<(script|style)\b[\s\S]*?<\/\1\s*>|<\/?[a-z][^>]*>/gi;
// control characters (except \n and \t, handled separately), zero-width and bidi-override characters
const HIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;

const strip = (s: string) => s.replace(TAG, "").replace(HIDDEN, "");

/** One line of text: no tags, no line breaks, single spaces. */
export function cleanLine(value: string): string {
  return strip(value).replace(/[\r\n\t]+/g, " ").replace(/ {2,}/g, " ").trim();
}

/** Several lines (paragraphs, article markup): no tags, \n line breaks, at most one empty line in a row. */
export function cleanBlock(value: string): string {
  return strip(value)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]{2,}/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** "/media/<id>" (a picture uploaded with upload_image) or a https address. Anything else is not a valid picture link. */
export function isImageLink(value: string): boolean {
  return /^\/media\/[a-z0-9]{10,40}$/i.test(value) || /^https:\/\/[^\s"'<>\\]{1,480}$/i.test(value);
}

/** yyyy-mm-dd that is a real calendar day. */
export function isCalendarDay(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() + 1 === Number(m[2]) && d.getUTCDate() === Number(m[3]);
}

/** "Senior UI/UX Designer" -> "senior-ui-ux-designer" (the same rule as the blog and careers admin actions). */
export function slugify(text: string, max = 80): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max) || "untitled"
  );
}
