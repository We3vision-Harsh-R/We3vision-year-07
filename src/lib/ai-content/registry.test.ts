import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CONTENT_TYPES, getContentType, jsonSchemaOf, validateDraft } from "./registry";

const blog = getContentType("blog")!;
const career = getContentType("career")!;

describe("registry entries", () => {
  it.each(CONTENT_TYPES.map((t) => [t.key, t] as const))("%s: its own example is a valid draft", (_k, def) => {
    const r = validateDraft(def, def.example);
    expect(r.ok, JSON.stringify(r)).toBe(true);
  });

  it.each(CONTENT_TYPES.map((t) => [t.key, t] as const))("%s: every field has help for the AI and a JSON Schema entry", (_k, def) => {
    const schema = jsonSchemaOf(def) as { properties: Record<string, { description?: string }>; required?: string[] };
    for (const f of def.fields) {
      expect(f.help.length, f.name).toBeGreaterThan(10);
      expect(schema.properties[f.name]?.description, f.name).toContain(f.label);
    }
    expect(schema.required ?? []).toEqual(def.fields.filter((f) => f.required).map((f) => f.name));
  });
});

describe("validateDraft", () => {
  it("fills the defaults", () => {
    const r = validateDraft(career, { title: "Backend Developer", description: "Build the API." });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toMatchObject({ workType: "Full-time", workMode: "On-site", openings: 1, location: "", closesAt: "", responsibilities: [] });
  });

  it("fills today's date and the default picture shape for a blog", () => {
    const r = validateDraft(blog, { title: "A title that is long enough", content: "Hello" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.tile).toBe("portrait");
      expect(r.data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("explains a missing required field", () => {
    const r = validateDraft(blog, { content: "x" });
    expect(r).toMatchObject({ ok: false });
    if (!r.ok) expect(r.errors).toContainEqual({ field: "title", message: "is required" });
  });

  it("says how much too long a field is", () => {
    const r = validateDraft(blog, { title: "A title that is long enough", content: "x", summary: "s".repeat(301) });
    if (r.ok) throw new Error("should fail");
    expect(r.errors).toContainEqual({ field: "summary", message: "too long (301), the limit is 300" });
  });

  it("rejects values outside an enum and names the allowed ones", () => {
    const r = validateDraft(career, { title: "Designer", description: "x", workType: "Freelance" });
    if (r.ok) throw new Error("should fail");
    expect(r.errors[0].field).toBe("workType");
    expect(r.errors[0].message).toContain('"Full-time"');
  });

  it("rejects unknown fields instead of ignoring them", () => {
    const r = validateDraft(blog, { title: "A title that is long enough", content: "x", seoKeywords: "a" });
    if (r.ok) throw new Error("should fail");
    expect(r.errors[0].message).toContain("unknown field");
  });

  it("points at the item of a list that is wrong", () => {
    const r = validateDraft(blog, { title: "A title that is long enough", content: "x", faq: [{ question: "ok?", answer: "yes" }, { question: "q", answer: "a".repeat(401) }] });
    if (r.ok) throw new Error("should fail");
    expect(r.errors[0].field).toBe("faq[2].answer");
  });

  it("removes HTML, scripts and hidden characters", () => {
    const r = validateDraft(blog, { title: "<b>Safe</b> title here<script>alert(1)</script>", content: "Para <img src=x onerror=alert(1)> one​.\n\n\n\n## Head" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.title).toBe("Safe title here");
      expect(r.data.content).toBe("Para one.\n\n## Head");
    }
  });

  it("accepts only safe picture links", () => {
    const base = { title: "A title that is long enough", content: "x" };
    expect(validateDraft(blog, { ...base, cover: "javascript:alert(1)" }).ok).toBe(false);
    expect(validateDraft(blog, { ...base, cover: "http://example.com/a.png" }).ok).toBe(false);
    expect(validateDraft(blog, { ...base, cover: "//evil.example/a.png" }).ok).toBe(false);
    expect(validateDraft(blog, { ...base, cover: "https://example.com/a.png" }).ok).toBe(true);
    expect(validateDraft(blog, { ...base, cover: "/media/clx1234567890abcdef" }).ok).toBe(true);
  });

  it("rejects an impossible date", () => {
    expect(validateDraft(blog, { title: "A title that is long enough", content: "x", date: "2026-02-31" }).ok).toBe(false);
  });

  it("never throws on junk", () => {
    for (const junk of [null, undefined, 5, "text", [], { title: 5 }]) expect(() => validateDraft(blog, junk)).not.toThrow();
    expect(validateDraft(blog, null).ok).toBe(false);
  });
});

describe("mapping to the admin panel's own save action", () => {
  it("blog: tags and FAQ become the text the form uses, and publish decides published", () => {
    const r = validateDraft(blog, { ...blog.example });
    if (!r.ok) throw new Error("example must be valid");
    const live = blog.toAdminInput(r.data, true);
    expect(live.published).toBe(true);
    expect(live.tags).toBe("AI customer support, customer support automation, AI chatbot");
    expect(String(live.faq).split("\n")).toHaveLength(1);
    expect(String(live.faq)).toContain(" | ");
    expect(blog.toAdminInput(r.data, false).published).toBe(false);
  });

  it("career: lists become one item per line, and publish decides active", () => {
    const r = validateDraft(career, { ...career.example });
    if (!r.ok) throw new Error("example must be valid");
    const live = career.toAdminInput(r.data, true);
    expect(String(live.responsibilities).split("\n")).toHaveLength(3);
    expect(live.active).toBe(true);
    expect(career.toAdminInput(r.data, false).active).toBe(false);
  });

  it("slugs: lowercase, dashes, no odd characters", () => {
    expect(blog.slugOf({ title: "AI & the Future: 7 Trends!" })).toBe("ai-the-future-7-trends");
    expect(career.slugOf({ title: "Senior UI/UX Designer" })).toBe("senior-ui-ux-designer");
  });

  it("previews contain the title and the address", () => {
    const r = validateDraft(blog, blog.example);
    if (!r.ok) throw new Error("example must be valid");
    const text = blog.preview(r.data);
    expect(text).toContain("# How AI Can Speed Up Your Customer Support");
    expect(text).toContain("/blog/how-ai-can-speed-up-your-customer-support");
  });
});

// The admin actions keep their limits inline. If someone changes a limit there, the AI would send text that is cut short or refused:
// this reads the actions and compares.
describe("limits still match the admin actions", () => {
  const blogAction = readFileSync("src/actions/blog.ts", "utf8");
  const jobAction = readFileSync("src/actions/jobs.ts", "utf8");
  const limitOf = (src: string, field: string) => {
    const m = new RegExp(`(?:text|line|para)\\(input\\.${field},\\s*(\\d+)`).exec(src);
    if (!m) throw new Error(`no limit found for ${field}`);
    return Number(m[1]);
  };
  const listLimitOf = (src: string, field: string) => {
    const m = new RegExp(`lines\\(input\\.${field},\\s*(\\d+),\\s*(\\d+)\\)`).exec(src);
    if (!m) throw new Error(`no list limit found for ${field}`);
    return { items: Number(m[1]), each: Number(m[2]) };
  };
  const maxOf = (def: typeof blog, name: string) => (def.fields.find((f) => f.name === name) as { max: number }).max;

  it.each([["title"], ["category"], ["summary"], ["content"]])("blog %s", (f) => {
    expect(maxOf(blog, f)).toBeLessThanOrEqual(limitOf(blogAction, f));
  });

  it("blog tags and FAQ fit in the text boxes of the form", () => {
    const tags = blog.fields.find((f) => f.name === "tags") as { maxItems: number; itemMax: number };
    expect(tags.maxItems * tags.itemMax + tags.maxItems * 2).toBeLessThanOrEqual(limitOf(blogAction, "tags"));
    const faq = blog.fields.find((f) => f.name === "faq") as { maxItems: number; questionMax: number; answerMax: number };
    expect(faq.maxItems * (faq.questionMax + faq.answerMax + 4)).toBeLessThanOrEqual(limitOf(blogAction, "faq"));
    expect(faq.maxItems).toBeLessThanOrEqual(12);
  });

  it.each([["title"], ["team"], ["summary"], ["description"], ["location"], ["experience"], ["salary"]])("job %s", (f) => {
    expect(maxOf(career, f)).toBeLessThanOrEqual(limitOf(jobAction, f));
  });

  it.each([["responsibilities"], ["requirements"], ["perks"]])("job list %s", (f) => {
    const def = career.fields.find((x) => x.name === f) as { maxItems: number; itemMax: number };
    const a = listLimitOf(jobAction, f);
    expect(def.maxItems).toBeLessThanOrEqual(a.items);
    expect(def.itemMax).toBeLessThanOrEqual(a.each);
  });
});
