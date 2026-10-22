import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb } from "@/test/fake-db";

const fake = vi.hoisted(() => ({ current: null as ReturnType<typeof import("@/test/fake-db").createFakeDb> | null, after: [] as (() => unknown)[], pinged: [] as string[][], admin: { id: "admin1", email: "harsh@we3vision.com", name: "Harsh" } as { id: string; email: string; name: string } | null }));

vi.mock("@/lib/db", () => ({
  hasDb: true,
  get db() {
    return fake.current!.db;
  },
}));
vi.mock("@/lib/alerts", () => ({ alertFailure: vi.fn(), alertLater: vi.fn(), notifyNewApplication: vi.fn() }));
vi.mock("@/lib/seo-ping", () => ({
  notifySearchEngines: vi.fn(async (paths: string[]) => {
    fake.pinged.push(paths);
    return [];
  }),
}));
vi.mock("@/lib/auth", () => ({
  requireAdmin: async () => {
    if (!fake.admin) throw new Error("NEXT_REDIRECT /admin/login");
    return fake.admin;
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/server", () => ({ after: (fn: () => unknown) => fake.after.push(fn) }));

import { approveSubmission, rejectSubmission, saveSubmissionEdit } from "./ai-submissions";
import { getContentType } from "@/lib/ai-content/registry";
import { createSubmission } from "@/lib/ai-content/server/submissions";
import { validateDraft } from "@/lib/ai-content/registry";

const ctx = { connectionId: "conn1", connectionName: "Claude laptop", adminId: "admin1", adminEmail: "harsh@we3vision.com", scopes: new Set(["content:submit", "content:read"] as const), origin: "https://site.example" };

async function submit(type: "blog" | "career") {
  const def = getContentType(type)!;
  const r = validateDraft(def, def.example);
  if (!r.ok) throw new Error("example invalid");
  const created = await createSubmission(ctx as never, def, r.data);
  if ("full" in created) throw new Error("queue full");
  return created.id;
}

beforeEach(() => {
  fake.current = createFakeDb();
  fake.after.length = 0;
  fake.pinged.length = 0;
  fake.admin = { id: "admin1", email: "harsh@we3vision.com", name: "Harsh" };
  fake.current.tables.adminUser.push({ id: "admin1", email: "harsh@we3vision.com" });
  fake.current.tables.aiConnection.push({ id: "conn1", name: "Claude laptop", adminId: "admin1" });
});

describe("approve a blog article", () => {
  it("publishes through the normal createBlogPost: slug, tags, FAQ and a place at the end of the list", async () => {
    fake.current!.tables.blogPost.push({ id: "old1", slug: "older", title: "Older", sortOrder: 4, published: true, publishedAt: new Date() });
    const id = await submit("blog");
    const r = await approveSubmission(id, "publish");
    expect(r.ok).toBe(true);

    const [, post] = fake.current!.tables.blogPost;
    expect(post).toMatchObject({ slug: "how-ai-can-speed-up-your-customer-support", published: true, sortOrder: 5, title: "How AI Can Speed Up Your Customer Support" });
    expect(post.tags).toEqual(["AI customer support", "customer support automation", "AI chatbot"]);
    expect(post.faq).toEqual([{ question: "Can AI replace a support team?", answer: expect.stringContaining("No.") }]);

    const sub = fake.current!.tables.contentSubmission[0];
    expect(sub).toMatchObject({ status: "approved", entitySlug: post.slug, entityId: post.id, reviewedBy: "harsh@we3vision.com" });
    expect(fake.current!.tables.submissionEvent.map((e) => e.action)).toEqual(["submitted", "approved"]);

    // the search engines are told about the new article, after the response
    await Promise.all(fake.after.map((f) => f()));
    expect(fake.pinged[0]).toEqual([`/blog/${post.slug}`, "/blog"]);
  });

  it("gives a second article with the same title a different address", async () => {
    const first = await submit("blog");
    await approveSubmission(first, "publish");
    fake.current!.tables.contentSubmission[0].status = "approved"; // so the same title can be sent again
    const second = await submit("blog");
    await approveSubmission(second, "publish");
    const slugs = fake.current!.tables.blogPost.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(2);
    expect(slugs[1]).toMatch(/-2$/);
  });

  it("saves a hidden draft in the normal list without telling the search engines", async () => {
    const id = await submit("blog");
    const r = await approveSubmission(id, "draft");
    expect(r.ok).toBe(true);
    expect(fake.current!.tables.blogPost[0].published).toBe(false);
    expect(fake.current!.tables.contentSubmission[0].status).toBe("draft");
    await Promise.all(fake.after.map((f) => f()));
    expect(fake.pinged).toHaveLength(0);
  });

  it("cannot be approved twice", async () => {
    const id = await submit("blog");
    expect((await approveSubmission(id, "publish")).ok).toBe(true);
    const again = await approveSubmission(id, "publish");
    expect(again.ok).toBe(false);
    expect(fake.current!.tables.blogPost).toHaveLength(1);
  });
});

describe("approve a job", () => {
  it("creates an open job through the normal saveJob", async () => {
    const id = await submit("career");
    const r = await approveSubmission(id, "publish");
    expect(r.ok).toBe(true);
    const [job] = fake.current!.tables.careerRole;
    expect(job).toMatchObject({ slug: "senior-ui-ux-designer", active: true, workType: "Full-time", openings: 1 });
    expect(job.responsibilities).toHaveLength(3);
    await Promise.all(fake.after.map((f) => f()));
    expect(fake.pinged[0]).toEqual(["/careers/senior-ui-ux-designer", "/careers"]);
  });

  it("a draft job is closed", async () => {
    const id = await submit("career");
    await approveSubmission(id, "draft");
    expect(fake.current!.tables.careerRole[0].active).toBe(false);
  });
});

describe("reject", () => {
  it("keeps the submission with the reason and publishes nothing", async () => {
    const id = await submit("blog");
    expect((await rejectSubmission(id, "")).ok).toBe(false);
    const r = await rejectSubmission(id, "Too salesy. Remove the claims without a source.");
    expect(r.ok).toBe(true);
    expect(fake.current!.tables.contentSubmission[0]).toMatchObject({ status: "rejected", rejectReason: "Too salesy. Remove the claims without a source." });
    expect(fake.current!.tables.blogPost).toHaveLength(0);
    expect(fake.current!.tables.submissionEvent.map((e) => e.action)).toEqual(["submitted", "rejected"]);
    expect((await approveSubmission(id, "publish")).ok).toBe(false);
  });
});

describe("edit", () => {
  it("checks the form values with the registry and saves them into the submission only", async () => {
    const id = await submit("blog");
    const form = getContentType("blog")!.toFormValues(fake.current!.tables.contentSubmission[0].data as never);
    const bad = await saveSubmissionEdit(id, { ...form, title: "" });
    expect(bad.ok).toBe(false);
    const ok = await saveSubmissionEdit(id, { ...form, title: "A better title for this article", tags: "one, two" });
    expect(ok.ok).toBe(true);
    const sub = fake.current!.tables.contentSubmission[0];
    expect(sub.title).toBe("A better title for this article");
    expect((sub.data as { tags: string[] }).tags).toEqual(["one", "two"]);
    expect(fake.current!.tables.blogPost).toHaveLength(0);
    expect(fake.current!.tables.submissionEvent.map((e) => e.action)).toEqual(["submitted", "edited"]);
  });
});

describe("only a logged-in admin can decide", () => {
  it("throws the redirect to the login when nobody is logged in", async () => {
    const id = await submit("blog");
    fake.admin = null;
    await expect(approveSubmission(id, "publish")).rejects.toThrow(/login/);
    await expect(rejectSubmission(id, "no")).rejects.toThrow(/login/);
    expect(fake.current!.tables.blogPost).toHaveLength(0);
  });
});
