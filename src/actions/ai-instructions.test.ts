import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb } from "@/test/fake-db";

const fake = vi.hoisted(() => ({ current: null as ReturnType<typeof import("@/test/fake-db").createFakeDb> | null, admin: { id: "admin1", email: "harsh@we3vision.com", name: "Harsh" } as { id: string; email: string; name: string } | null }));
vi.mock("@/lib/db", () => ({
  hasDb: true,
  get db() {
    return fake.current!.db;
  },
}));
vi.mock("@/lib/alerts", () => ({ alertFailure: vi.fn(), alertLater: vi.fn() }));
vi.mock("@/lib/auth", () => ({
  requireAdmin: async () => {
    if (!fake.admin) throw new Error("NEXT_REDIRECT /admin/login");
    return fake.admin;
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { saveAiInstructions } from "./ai-instructions";
import { getStoredInstructions } from "@/lib/ai-content/server/instructions-store";
import { getContentType } from "@/lib/ai-content/registry";
import { INSTRUCTION_LIMITS } from "@/lib/ai-content/instructions";

const blog = getContentType("blog")!;

beforeEach(() => {
  fake.current = createFakeDb();
  fake.admin = { id: "admin1", email: "harsh@we3vision.com", name: "Harsh" };
});

describe("saving the AI instructions", () => {
  it("stores the general text, the extra rules and a changed list", async () => {
    const r = await saveAiInstructions({ general: "We3vision is a studio in Surat.", types: { blog: { extra: "End with a call to action.", askFirst: "The target city\nThe offer to mention\n" } } });
    expect(r.ok).toBe(true);
    const stored = await getStoredInstructions();
    expect(stored.general).toBe("We3vision is a studio in Surat.");
    expect(stored.types.blog).toEqual({ extra: "End with a call to action.", askFirst: ["The target city", "The offer to mention"] });
  });

  it("does not store a list that is the same as the standard one (it keeps following the code)", async () => {
    await saveAiInstructions({ types: { blog: { extra: "", askFirst: blog.askFirst.join("\n") } } });
    const stored = await getStoredInstructions();
    expect(stored.types.blog?.askFirst).toBeUndefined();
  });

  it("an emptied list is stored: the AI then asks nothing", async () => {
    await saveAiInstructions({ types: { blog: { extra: "", askFirst: "" } } });
    expect((await getStoredInstructions()).types.blog?.askFirst).toEqual([]);
  });

  it("refuses text that is too long, with a clear message", async () => {
    const tooLong = await saveAiInstructions({ general: "x".repeat(INSTRUCTION_LIMITS.general + 1) });
    expect(tooLong.ok).toBe(false);
    const manyPoints = await saveAiInstructions({ types: { blog: { extra: "", askFirst: Array.from({ length: INSTRUCTION_LIMITS.askFirstItems + 1 }, (_, i) => `point ${i}`).join("\n") } } });
    expect(manyPoints.ok).toBe(false);
    expect(fake.current!.tables.setting).toHaveLength(0);
  });

  it("removes HTML and ignores unknown content types", async () => {
    await saveAiInstructions({ general: "<script>alert(1)</script>Be clear.", types: { nonsense: { extra: "x" }, blog: { extra: "<b>Rule</b>", askFirst: "<i>one</i>" } } });
    const stored = await getStoredInstructions();
    expect(stored.general).toBe("Be clear.");
    expect(stored.types).not.toHaveProperty("nonsense");
    expect(stored.types.blog).toEqual({ extra: "Rule", askFirst: ["one"] });
  });

  it("only a logged-in admin can save", async () => {
    fake.admin = null;
    await expect(saveAiInstructions({ general: "x" })).rejects.toThrow(/login/);
    expect(fake.current!.tables.setting).toHaveLength(0);
  });
});
