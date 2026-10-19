import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb } from "@/test/fake-db";

const fake = vi.hoisted(() => ({ current: null as ReturnType<typeof import("@/test/fake-db").createFakeDb> | null }));
vi.mock("@/lib/db", () => ({
  hasDb: true,
  get db() {
    return fake.current!.db;
  },
}));
vi.mock("@/lib/alerts", () => ({ alertFailure: vi.fn(), alertLater: vi.fn() }));

import { POST } from "@/app/api/mcp/route";
import { hashToken } from "./tokens";

const TOKEN = "w3v_pat_" + "a".repeat(43);
const URL_ = "https://www.example-site.test/api/mcp";
let n = 0;

function rpc(method: string, params: unknown, token: string | null = TOKEN) {
  return POST(
    new Request(URL_, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...(token ? { authorization: `Bearer ${token}` } : {}), "x-forwarded-for": `10.0.0.${(n = (n + 1) % 250)}` },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    }),
  );
}
const call = async (name: string, args: unknown) => {
  const res = await rpc("tools/call", { name, arguments: args });
  expect(res.status).toBe(200);
  return (await res.json()).result as { isError?: boolean; content: { text: string }[]; structuredContent?: Record<string, unknown> };
};

const draft = { title: "How AI Can Speed Up Support", content: "Intro paragraph.\n\n## First point\n\nText.", summary: "Short summary." };

beforeEach(() => {
  fake.current = createFakeDb();
  const { tables } = fake.current;
  tables.adminUser.push({ id: "admin1", email: "harsh@we3vision.com" });
  tables.aiConnection.push({ id: "conn1", name: "Claude laptop", adminId: "admin1", tokenHash: hashToken(TOKEN), scopes: "content:submit content:read", revokedAt: null, expiresAt: null, accessExpiresAt: null, lastUsedAt: new Date() });
});

describe("authentication", () => {
  it("answers 401 with the OAuth discovery header when there is no token", async () => {
    const res = await rpc("tools/list", {}, null);
    expect(res.status).toBe(401);
    expect(res.headers.get("www-authenticate")).toContain("resource_metadata=");
  });

  it("rejects an unknown token, a revoked connection and an expired one", async () => {
    expect((await rpc("tools/list", {}, "w3v_pat_" + "b".repeat(43))).status).toBe(401);
    fake.current!.tables.aiConnection[0].revokedAt = new Date();
    expect((await rpc("tools/list", {})).status).toBe(401);
    fake.current!.tables.aiConnection[0].revokedAt = null;
    fake.current!.tables.aiConnection[0].expiresAt = new Date(Date.now() - 1000);
    expect((await rpc("tools/list", {})).status).toBe(401);
  });

  it("rejects a connection whose admin is not a company account", async () => {
    fake.current!.tables.adminUser[0].email = "someone@gmail.com";
    expect((await rpc("tools/list", {})).status).toBe(403);
  });
});

describe("tools", () => {
  it("lists only tools that cannot publish, edit or delete live content", async () => {
    const res = await rpc("tools/list", {});
    const tools = (await res.json()).result.tools as { name: string; inputSchema: { properties?: Record<string, unknown> } }[];
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(["get_content_guidelines", "get_submission_status", "list_content_types", "list_existing_content", "list_my_submissions", "preview_content", "send_to_we3vision", "upload_image"]);
    for (const bad of ["publish", "delete", "update", "approve"]) expect(names.some((x) => x.includes(bad))).toBe(false);
  });

  it("the schema of data shown to the AI is generated from the registry (anyOf of every type)", async () => {
    const tools = (await (await rpc("tools/list", {})).json()).result.tools as { name: string; inputSchema: { properties: { data: { anyOf: { title: string; required?: string[] }[] } } } }[];
    const send = tools.find((t) => t.name === "send_to_we3vision")!;
    expect(send.inputSchema.properties.data.anyOf.map((v) => v.title).sort()).toEqual(["Blog article", "Job opening"]);
  });

  it("preview_content returns errors the AI can act on, and saves nothing", async () => {
    const r = await call("preview_content", { content_type: "blog", data: { title: "short" } });
    expect(r.content[0].text).toContain("NOT valid");
    expect(r.content[0].text).toContain("content: is required");
    expect(fake.current!.tables.contentSubmission).toHaveLength(0);
  });

  it("preview_content shows the preview of a valid draft", async () => {
    const r = await call("preview_content", { content_type: "blog", data: draft });
    expect(r.structuredContent?.valid).toBe(true);
    expect(r.content[0].text).toContain("/blog/how-ai-can-speed-up-support");
  });

  it("send_to_we3vision refuses without the user's confirmation", async () => {
    const r = await call("send_to_we3vision", { content_type: "blog", data: draft, user_confirmed: false });
    expect(r.isError).toBe(true);
    expect(fake.current!.tables.contentSubmission).toHaveLength(0);
  });

  it("send_to_we3vision checks the draft again and fixes nothing silently", async () => {
    const r = await call("send_to_we3vision", { content_type: "blog", data: { ...draft, tile: "huge" }, user_confirmed: true });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("tile");
    expect(fake.current!.tables.contentSubmission).toHaveLength(0);
  });

  it("send_to_we3vision saves a pending submission with an audit event and never touches live content", async () => {
    const r = await call("send_to_we3vision", { content_type: "blog", data: draft, user_confirmed: true });
    expect(r.isError).toBeUndefined();
    const [sub] = fake.current!.tables.contentSubmission;
    expect(sub).toMatchObject({ contentType: "blog", status: "pending_review", connectionId: "conn1", connectionName: "Claude laptop", title: draft.title });
    expect(fake.current!.tables.submissionEvent).toHaveLength(1);
    expect(fake.current!.tables.submissionEvent[0]).toMatchObject({ action: "submitted" });
    expect(fake.current!.tables.blogPost).toHaveLength(0);
    expect(r.content[0].text).toContain(`/admin/ai-submissions/${sub.id}`);
    expect(r.content[0].text).toContain("NOT live");
  });

  it("sending the same draft twice does not create a second submission", async () => {
    await call("send_to_we3vision", { content_type: "blog", data: draft, user_confirmed: true });
    const again = await call("send_to_we3vision", { content_type: "blog", data: draft, user_confirmed: true });
    expect(fake.current!.tables.contentSubmission).toHaveLength(1);
    expect(again.structuredContent?.duplicate).toBe(true);
  });

  it("get_submission_status only shows submissions of the same admin", async () => {
    const sent = await call("send_to_we3vision", { content_type: "blog", data: draft, user_confirmed: true });
    const id = sent.structuredContent!.submission_id as string;
    expect((await call("get_submission_status", { submission_id: id })).content[0].text).toContain("Pending approval");
    const other = "w3v_pat_" + "c".repeat(43);
    fake.current!.tables.adminUser.push({ id: "admin2", email: "other@we3vision.com" });
    fake.current!.tables.aiConnection.push({ id: "conn2", name: "Other", adminId: "admin2", tokenHash: hashToken(other), scopes: "content:read", revokedAt: null, expiresAt: null, accessExpiresAt: null, lastUsedAt: new Date() });
    const res = await rpc("tools/call", { name: "get_submission_status", arguments: { submission_id: id } }, other);
    expect((await res.json()).result.isError).toBe(true);
  });

  it("a connection without the submit permission cannot send", async () => {
    fake.current!.tables.aiConnection[0].scopes = "content:read";
    const r = await call("send_to_we3vision", { content_type: "blog", data: draft, user_confirmed: true });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain("content:submit");
    expect(fake.current!.tables.contentSubmission).toHaveLength(0);
  });

  it("upload_image rejects a file that is not a picture, whatever its name", async () => {
    const html = Buffer.from("<html><script>alert(1)</script></html>".repeat(3)).toString("base64");
    const r = await call("upload_image", { filename: "cover.png", data_base64: html });
    expect(r.isError).toBe(true);
    expect(fake.current!.tables.media).toHaveLength(0);
  });

  it("upload_image stores a real picture and returns a /media link", async () => {
    const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(40)]).toString("base64");
    const r = await call("upload_image", { filename: "cover.png", data_base64: png });
    expect(r.structuredContent?.url).toMatch(/^\/media\/c\d+test$/);
    expect(fake.current!.tables.media).toHaveLength(1);
  });

  it("list_existing_content lists live articles for duplicate checks", async () => {
    fake.current!.tables.blogPost.push({ title: "How AI Can Speed Up Support", slug: "x", category: "AI/ML", published: true, publishedAt: new Date("2026-01-02") });
    const r = await call("list_existing_content", { content_type: "blog", query: "speed" });
    expect(r.content[0].text).toContain("/blog/x");
  });

  it("unknown tools and bad arguments are answered, not thrown", async () => {
    expect((await call("delete_everything", {})).isError).toBe(true);
    const bad = await call("get_submission_status", { submission_id: 5 });
    expect(bad.isError).toBe(true);
    expect(bad.content[0].text).toContain("Invalid arguments");
  });
});
