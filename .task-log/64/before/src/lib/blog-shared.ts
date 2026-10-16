// What the blog needs on the server AND in the browser (the admin panel preview): the shapes of the pictures on the Blog page, and the light text
// markup the articles are written in (so that the admin panel only needs a text box):
//   ## A heading            a line that starts with ##
//   - a point               lines that start with - (a list; one point per line)
//   a paragraph             any other text; an empty line starts a new paragraph

export type Block = { h: string } | { p: string } | { ul: string[] };
export type FaqItem = { question: string; answer: string };

/** The shapes a picture can have on the Blog page. `ratio` = height / width, `size` = what size to upload (the picture is cropped to fill the shape). */
export const TILES = [
  { value: "landscape", label: "Landscape", ratio: 0.72, size: "1200 × 864 px", hint: "Low and wide. Good for a wide photo or a banner." },
  { value: "square", label: "Square", ratio: 1, size: "1200 × 1200 px", hint: "Even. Good for a logo, an icon or a centred subject." },
  { value: "portrait", label: "Portrait", ratio: 1.33, size: "900 × 1200 px", hint: "Taller than wide. The usual shape of a cover." },
  { value: "tall", label: "Tall", ratio: 1.78, size: "900 × 1600 px", hint: "Very tall, like a phone screen. Stands out in the list." },
] as const;
export type TileValue = (typeof TILES)[number]["value"];
export const DEFAULT_TILE: TileValue = "portrait";
export const tileOf = (v: unknown): TileValue => (TILES.some((t) => t.value === v) ? (v as TileValue) : DEFAULT_TILE);
export const tileRatio = (v: unknown) => TILES.find((t) => t.value === v)?.ratio ?? 1.33;

/** One article as the website and the admin panel use it. */
export type BlogEntry = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  tile: TileValue;
  /** ISO date (yyyy-mm-dd) shown on the article */
  date: string;
  dateLabel: string;
  tags: string[];
  blocks: Block[];
  faq: FaqItem[];
  sortOrder: number;
  published: boolean;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function dateLabel(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1] ?? ""} ${Number(m[3])}, ${m[1]}`;
}

/** The text of the editor -> the blocks the article is drawn from. */
export function parseContent(text: string): Block[] {
  const blocks: Block[] = [];
  let list: string[] | null = null;
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ p: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list?.length) blocks.push({ ul: list });
    list = null;
  };
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
    } else if (/^#{1,4}\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ h: line.replace(/^#+\s*/, "") });
    } else if (/^[-*•]\s+/.test(line)) {
      flushPara();
      (list ??= []).push(line.replace(/^[-*•]\s+/, ""));
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

/** The blocks -> the text of the editor (used to put the first articles into the admin panel). */
export function blocksToText(blocks: Block[]): string {
  return blocks
    .map((b) => ("h" in b ? `## ${b.h}` : "p" in b ? b.p : b.ul.map((t) => `- ${t}`).join("\n")))
    .join("\n\n");
}

/** "Question | Answer", one per line. */
export function parseFaq(text: string): FaqItem[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf("|");
      return i < 0 ? null : { question: l.slice(0, i).trim(), answer: l.slice(i + 1).trim() };
    })
    .filter((x): x is FaqItem => Boolean(x && x.question && x.answer));
}
export const faqToText = (faq: FaqItem[]) => faq.map((q) => `${q.question} | ${q.answer}`).join("\n");

export const parseTags = (text: string) =>
  text
    .split(/[,\n]/)
    .map((t) => t.trim().replace(/^#/, ""))
    .filter(Boolean)
    .slice(0, 12);
