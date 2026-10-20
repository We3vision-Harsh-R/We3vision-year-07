import { describe, expect, it } from "vitest";
import { coverSize, drawCover } from "./cover";

describe("drawn cover", () => {
  it.each([
    ["landscape", 1200, 864],
    ["square", 1200, 1200],
    ["portrait", 900, 1200],
    ["tall", 900, 1600],
  ])("%s is %i x %i, the size the admin form asks for", (tile, w, h) => {
    expect(coverSize(tile)).toEqual({ w, h });
  });

  it("makes a real PNG of the right size, and the same title gives the same picture", async () => {
    const a = await drawCover({ title: "How AI Can Speed Up Your Customer Support", category: "AI/ML", tile: "portrait" });
    expect(Array.from(a.bytes.slice(0, 8))).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(a).toMatchObject({ width: 900, height: 1200 });
    const b = await drawCover({ title: "How AI Can Speed Up Your Customer Support", category: "AI/ML", tile: "portrait" });
    expect(Buffer.from(a.bytes).equals(Buffer.from(b.bytes))).toBe(true);
    const c = await drawCover({ title: "A different article about 3D web design", category: "Design", tile: "portrait" });
    expect(Buffer.from(a.bytes).equals(Buffer.from(c.bytes))).toBe(false);
  }, 30000);
});
