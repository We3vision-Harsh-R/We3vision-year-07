import { describe, expect, it } from "vitest";
import { SEO_GOOD_SCORE, analyzeBlog, seoReportText } from "./blog-seo";

const KW = "3D web design";
const filler = "Teams that plan their work first deliver clearer results for customers every single quarter.";
const para = (extra = "") => `${Array.from({ length: 6 }, () => filler).join(" ")} ${extra}`.trim();

function goodArticle() {
  const sections = ["Why 3D web design matters", "Start with the goal", "Keep the models light", "Test on real devices", "Measure what changes", "What to do next"];
  const body = [
    `${KW} is changing what a business website can feel like. This guide shows what to plan first and what to avoid.`,
    ...sections.flatMap((h, i) => [`## ${h}`, para(i % 2 === 0 ? `Good ${KW} starts with a clear goal.` : ""), para(i === 1 ? `Use ${KW} where it helps a visitor decide.` : "")]),
    "- Plan the goal first\n- Keep files small\n- Test early",
    "Talk to the We3vision team to get started with your next project.",
  ];
  return {
    title: "3D Web Design Trends for Business Websites in 2026",
    summary: "How 3D web design, lighter models and scroll-driven scenes are changing business websites, and what to plan first.",
    content: body.join("\n\n"),
    tags: ["3D web design", "WebGL", "UI/UX"],
    faq: [1, 2, 3].map((n) => ({ question: `Question ${n}?`, answer: "A short direct answer." })),
    cover: "/media/abc",
  };
}

describe("analyzeBlog", () => {
  it("scores a complete article as great", () => {
    const r = analyzeBlog(goodArticle());
    expect(r.keyword).toBe(KW);
    expect(r.keywordSource).toBe("tag");
    expect(r.score).toBeGreaterThanOrEqual(SEO_GOOD_SCORE);
    expect(r.checks.reduce((n, c) => n + c.max, 0)).toBe(100);
  });

  it("scores a thin article low and says what to fix", () => {
    const r = analyzeBlog({ title: "Hi", summary: "", content: "Short text.", tags: [], faq: [], cover: "" });
    expect(r.score).toBeLessThan(40);
    expect(r.checks.find((c) => c.id === "length")?.status).toBe("fail");
    expect(r.checks.find((c) => c.id === "title-length")?.status).toBe("fail");
    expect(seoReportText(r)).toContain("Fix these");
  });

  it("uses the typed keyword before the first tag", () => {
    const r = analyzeBlog({ ...goodArticle(), keyword: "webgl" });
    expect(r.keyword).toBe("webgl");
    expect(r.keywordSource).toBe("typed");
  });

  it("flags keyword stuffing", () => {
    const stuffed = `${Array.from({ length: 40 }, () => `${KW} is good.`).join(" ")}`;
    const r = analyzeBlog({ ...goodArticle(), content: stuffed });
    expect(r.checks.find((c) => c.id === "kw-density")?.status).toBe("fail");
  });

  it("flags a title without the keyword and clickbait", () => {
    const r = analyzeBlog({ ...goodArticle(), title: "SHOCKING SECRETS you won't believe about websites!!" });
    expect(r.checks.find((c) => c.id === "title-keyword")?.status).toBe("fail");
    expect(r.checks.find((c) => c.id === "title-tone")?.status).toBe("warn");
  });

  it("does not break on empty input and asks for a keyword", () => {
    const r = analyzeBlog({ title: "", summary: "", content: "", tags: [], faq: [], cover: "" });
    expect(r.keywordSource).toBe("none");
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.checks.find((c) => c.id === "title-keyword")?.fix).toContain("focus keyword");
  });
});
