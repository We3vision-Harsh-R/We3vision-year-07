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
vi.mock("next/headers", () => ({ headers: async () => new Headers({ host: "site.example", "x-forwarded-proto": "https" }) }));

import { createConnection, deleteSubmissionRecord, removeConnection, removeTool, revokeAllConnections, revokeConnection, saveAiSwitches } from "./ai-integrations";
import { getAiSettings } from "@/lib/ai-content/server/settings";
import { hashToken } from "@/lib/ai-content/server/tokens";

beforeEach(() => {
  fake.current = createFakeDb();
  fake.admin = { id: "admin1", email: "harsh@we3vision.com", name: "Harsh" };
  fake.current.tables.adminUser.push({ id: "admin1", email: "harsh@we3vision.com" });
});

describe("create, revoke and remove connections from the admin panel", () => {
  it("makes a token that is shown once and stored only as a hash", async () => {
    const r = await createConnection({ name: "Claude laptop", scopes: ["content:submit", "content:read"], days: 30 });
    expect(r.ok).toBe(true);
    expect(r.token).toMatch(/^w3v_pat_/);
    expect(r.mcpUrl).toBe("https://site.example/api/mcp");
    const row = fake.current!.tables.aiConnection[0];
    expect(row.tokenHash).toBe(hashToken(r.token!));
    expect(JSON.stringify(row)).not.toContain(r.token!);
    expect(row.expiresAt).toBeInstanceOf(Date);
  });

  it("needs a name and at least one permission", async () => {
    expect((await createConnection({ name: "x", scopes: ["content:read"], days: 1 })).ok).toBe(false);
    expect((await createConnection({ name: "Valid name", scopes: [], days: 1 })).ok).toBe(false);
    expect((await createConnection({ name: "Valid name", scopes: ["admin:everything"], days: 1 })).ok).toBe(false);
  });

  it("revokes one, revokes all, and removes only a revoked one from the list", async () => {
    await createConnection({ name: "One", scopes: ["content:read"], days: 0 });
    await createConnection({ name: "Two", scopes: ["content:read"], days: 0 });
    const [a, b] = fake.current!.tables.aiConnection;
    expect((await removeConnection(a.id as string)).ok).toBe(false);
    expect((await revokeConnection(a.id as string)).ok).toBe(true);
    expect(a.revokedAt).toBeInstanceOf(Date);
    expect((await removeConnection(a.id as string)).ok).toBe(true);
    expect(fake.current!.tables.aiConnection).toHaveLength(1);
    const all = await revokeAllConnections();
    expect(all).toMatchObject({ ok: true });
    expect(b.revokedAt).toBeInstanceOf(Date);
  });

  it("removing a tool revokes its connections and forgets it", async () => {
    fake.current!.tables.oauthClient.push({ id: "w3c_toolone0000000000", name: "Claude", redirectUris: [] });
    fake.current!.tables.aiConnection.push({ id: "conn1", name: "Claude", clientId: "w3c_toolone0000000000", adminId: "admin1", revokedAt: null });
    expect((await removeTool("w3c_toolone0000000000")).ok).toBe(true);
    expect(fake.current!.tables.oauthClient).toHaveLength(0);
    expect(fake.current!.tables.aiConnection[0].revokedAt).toBeInstanceOf(Date);
  });
});

describe("the switches", () => {
  it("are on by default, can be switched off and on again", async () => {
    expect(await getAiSettings()).toMatchObject({ enabled: true, alerts: true });
    expect((await saveAiSwitches({ enabled: false, alerts: false })).ok).toBe(true);
    expect(await getAiSettings()).toMatchObject({ enabled: false, alerts: false });
    expect((await saveAiSwitches({ enabled: true, alerts: true })).ok).toBe(true);
    expect(await getAiSettings()).toMatchObject({ enabled: true, alerts: true });
  });

  it("the server variable AI_INTEGRATION=off wins and the admin cannot switch it on", async () => {
    process.env.AI_INTEGRATION = "off";
    try {
      expect(await getAiSettings()).toMatchObject({ enabled: false, forcedOff: true });
      const r = await saveAiSwitches({ enabled: true, alerts: true });
      expect(r.ok).toBe(false);
    } finally {
      delete process.env.AI_INTEGRATION;
    }
  });
});

describe("delete the record of a finished submission", () => {
  it("refuses while it is waiting, deletes when it is finished", async () => {
    fake.current!.tables.contentSubmission.push({ id: "subwaiting0000000", title: "A", status: "pending_review" }, { id: "subrejected0000000", title: "B", status: "rejected" });
    expect((await deleteSubmissionRecord("subwaiting0000000")).ok).toBe(false);
    expect((await deleteSubmissionRecord("subrejected0000000")).ok).toBe(true);
    expect(fake.current!.tables.contentSubmission.map((s) => s.id)).toEqual(["subwaiting0000000"]);
  });
});

describe("only a logged-in admin", () => {
  it("every action goes to the login when nobody is logged in", async () => {
    fake.admin = null;
    await expect(saveAiSwitches({ enabled: false })).rejects.toThrow(/login/);
    await expect(revokeAllConnections()).rejects.toThrow(/login/);
    await expect(removeTool("x")).rejects.toThrow(/login/);
    await expect(deleteSubmissionRecord("x")).rejects.toThrow(/login/);
    await expect(createConnection({ name: "Abc", scopes: ["content:read"] })).rejects.toThrow(/login/);
  });
});
