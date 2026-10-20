import { describe, expect, it } from "vitest";
import { INSTRUCTION_LIMITS, cleanInstructions, renderGuidelines, renderServerInstructions, resolveInstructions } from "./instructions";
import { getContentType } from "./registry";

const blog = getContentType("blog")!;
const career = getContentType("career")!;
const KEYS = ["blog", "career"];

describe("owner's instructions", () => {
  it("every content type has a standard 'ask first' list", () => {
    expect(blog.askFirst.length).toBeGreaterThan(3);
    expect(career.askFirst.length).toBeGreaterThan(3);
  });

  it("without anything saved, the AI gets the standard list and the built-in rules", () => {
    const text = renderGuidelines(blog, { general: "", types: {} });
    expect(text).toContain("Before you write: collect this information");
    expect(text).toContain(blog.askFirst[0]);
    expect(text).toContain("## Built-in rules");
    expect(text).not.toContain("Instructions of the website owner");
  });

  it("the owner's text comes before the built-in rules and says that it wins", () => {
    const text = renderGuidelines(blog, { general: "We3vision is a studio in Surat.", types: { blog: { extra: "End with a call to action.", askFirst: ["The target city"] } } });
    expect(text).toContain("We3vision is a studio in Surat.");
    expect(text).toContain("End with a call to action.");
    expect(text).toContain("- The target city");
    expect(text).not.toContain(blog.askFirst[0]);
    expect(text.indexOf("End with a call to action.")).toBeLessThan(text.indexOf("## Built-in rules"));
    expect(text).toContain("they win over the built-in rules");
  });

  it("an empty saved list means: do not ask anything", () => {
    const text = renderGuidelines(career, { general: "", types: { career: { askFirst: [] } } });
    expect(text).not.toContain("collect this information");
    expect(resolveInstructions(career, { general: "", types: { career: { askFirst: [] } } }).askFirstIsCustom).toBe(true);
  });

  it("the general part is also said to the AI when it connects", () => {
    expect(renderServerInstructions("BASE", { general: "", types: {} })).toBe("BASE");
    expect(renderServerInstructions("BASE", { general: "Be brief.", types: {} })).toContain("Be brief.");
  });

  it("cleaning: plain text, limits, only known types, no HTML", () => {
    const long = "x".repeat(INSTRUCTION_LIMITS.general + 50);
    const out = cleanInstructions(
      { general: `<b>Hello</b> <script>alert(1)</script>${long}`, types: { blog: { extra: "<i>Rule</i>\n\n\n\nTwo", askFirst: ["  one  ", "", "<b>two</b>", 5] }, hacker: { extra: "x" } } },
      KEYS,
    );
    expect(out.general.startsWith("Hello")).toBe(true);
    expect(out.general.length).toBeLessThanOrEqual(INSTRUCTION_LIMITS.general);
    expect(out.general).not.toContain("<");
    expect(out.types.blog).toEqual({ extra: "Rule\n\nTwo", askFirst: ["one", "two"] });
    expect(out.types).not.toHaveProperty("hacker");
  });

  it("never throws on junk", () => {
    for (const junk of [null, undefined, 5, "x", [], { types: 5 }, { types: { blog: 5 } }]) expect(() => cleanInstructions(junk, KEYS)).not.toThrow();
  });
});
