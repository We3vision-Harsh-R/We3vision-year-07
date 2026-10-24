import { describe, expect, it } from "vitest";
import { DEFAULT_FEST, DENSITIES, FEST_EFFECTS, FEST_GROUPS, FEST_TEST, anyFest, cleanFest, festBootScript, festFor } from "./fest";

describe("the festival effects list", () => {
  it("has 10 whole-website, 10 industry, 6 pointer and 7 place effects, each key once", () => {
    const count = (g: string) => FEST_EFFECTS.filter((e) => e.group === g).length;
    expect([count("site"), count("industry"), count("pointer"), count("places")]).toEqual([10, 10, 6, 7]);
    expect(new Set(FEST_EFFECTS.map((e) => e.key)).size).toBe(FEST_EFFECTS.length);
    for (const e of FEST_EFFECTS) expect(FEST_GROUPS.some((g) => g.id === e.group)).toBe(true);
  });

  it("the click rocket is one of the pointer effects and is on by default", () => {
    const rocket = FEST_EFFECTS.find((e) => e.key === "rocket");
    expect(rocket).toMatchObject({ group: "pointer", on: true });
  });

  it("with nothing saved the festival is off and the effects have their own defaults", () => {
    expect(anyFest(DEFAULT_FEST)).toBe(false);
    const fx = DEFAULT_FEST.diwali.effects;
    expect(fx.fireworks).toBe(true);
    expect(fx.embers).toBe(false);
    expect(DEFAULT_FEST.diwali.density).toBe("normal");
  });
});

describe("cleanFest", () => {
  it("fills missing keys and drops unknown festivals and bad paths", () => {
    const c = cleanFest({ nope: { site: true }, diwali: { site: true, pages: ["/about", "/blog/*", "../etc", "javascript:alert(1)", 5], effects: { fireworks: false, junk: true } } });
    expect(Object.keys(c)).toEqual(["diwali"]);
    expect(c.diwali.site).toBe(true);
    expect(c.diwali.pages).toEqual(["/about", "/blog/*"]);
    expect(c.diwali.effects.fireworks).toBe(false);
    expect(c.diwali.effects).not.toHaveProperty("junk");
    expect(c.diwali.effects.toran).toBe(true);
  });

  it("carries over the three switches of the first version (sky, lanterns, cursor)", () => {
    const c = cleanFest({ diwali: { site: true, effects: { sky: false, lanterns: false, cursor: false } } });
    expect(c.diwali.effects.skylanterns).toBe(false);
    expect(c.diwali.effects.fireworks).toBe(false);
    expect(c.diwali.effects.kandils).toBe(false);
    expect(c.diwali.effects.sparkler).toBe(false);
    // the new key "skylanterns" does not clash with the old key "lanterns" (that one meant the kandils)
    const d = cleanFest({ diwali: { effects: { lanterns: true, sky: true, cursor: true } } });
    expect(d.diwali.effects.kandils).toBe(true);
  });

  it("an own value of a new key wins over the old one", () => {
    const c = cleanFest({ diwali: { effects: { sky: false, fireworks: true } } });
    expect(c.diwali.effects.fireworks).toBe(true);
    expect(c.diwali.effects.skylanterns).toBe(false);
  });

  it("the density must be one of the three", () => {
    expect(cleanFest({ diwali: { density: "rich" } }).diwali.density).toBe("rich");
    expect(cleanFest({ diwali: { density: "huge" } }).diwali.density).toBe("normal");
    expect(DENSITIES.map((d) => d.id)).toEqual(["low", "normal", "rich"]);
  });

  it("never throws on junk", () => {
    for (const junk of [null, undefined, 5, "x", [], { diwali: 5 }, { diwali: { effects: 5, pages: "x" } }]) expect(() => cleanFest(junk)).not.toThrow();
  });
});

describe("which festival a page gets", () => {
  const cfg = cleanFest({ diwali: { site: false, pages: ["/about", "/blog/*"], effects: { rocket: false }, density: "rich" } });
  it("matches an exact path and a group, with or without a trailing slash", () => {
    expect(festFor(cfg, "/about")?.id).toBe("diwali");
    expect(festFor(cfg, "/about/")?.id).toBe("diwali");
    expect(festFor(cfg, "/blog/my-post")?.id).toBe("diwali");
    expect(festFor(cfg, "/blogger")).toBeNull();
    expect(festFor(cfg, "/")).toBeNull();
  });
  it("gives the effects and the density of the rule", () => {
    const f = festFor(cfg, "/about");
    expect(f?.effects.rocket).toBe(false);
    expect(f?.density).toBe("rich");
  });
  it("the whole-website switch covers every page", () => {
    expect(festFor(cleanFest({ diwali: { site: true } }), "/anything")?.id).toBe("diwali");
  });
});

describe("the boot script and the test config", () => {
  it("puts the festival, the effects and the density on <html>", () => {
    const s = festBootScript(cleanFest({ diwali: { site: true, density: "low" } }));
    expect(s).toContain("data-fest-fx");
    expect(s).toContain("data-fest-density");
    expect(() => new Function(s)).not.toThrow();
  });
  it("cannot be broken out of by a hostile path", () => {
    expect(festBootScript(cleanFest({ diwali: { pages: ["/</script><script>alert(1)"] } }))).not.toContain("</script>");
  });
  it("the test config has every effect on for every page", () => {
    expect(Object.values(FEST_TEST.diwali.effects).every(Boolean)).toBe(true);
    expect(festFor(FEST_TEST, "/x")?.id).toBe("diwali");
  });
});
