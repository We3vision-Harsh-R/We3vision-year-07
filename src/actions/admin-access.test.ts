import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb } from "@/test/fake-db";

const fake = vi.hoisted(() => ({ current: null as ReturnType<typeof import("@/test/fake-db").createFakeDb> | null, me: { id: "m1", email: "harsh@we3vision.com", name: "Harsh" } }));
vi.mock("@/lib/db", () => ({
  hasDb: true,
  get db() {
    return fake.current!.db;
  },
}));
vi.mock("@/lib/alerts", () => ({ alertFailure: vi.fn(), alertLater: vi.fn() }));
vi.mock("@/lib/auth", () => ({
  requireSuperAdmin: async () => fake.me,
  createSession: vi.fn(),
  sessionVersion: () => "v",
}));
vi.mock("bcryptjs", () => ({ default: { hash: async (p: string) => `hash:${p}` } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createAdminUser, deleteAdminUser, saveAdminAccess, setAdminPassword } from "./admin-access";
import { readGrants } from "@/lib/admin-permissions";

const users = () => fake.current!.tables.adminUser;
const PASSWORD = "a-long-enough-password";

beforeEach(() => {
  fake.current = createFakeDb();
  fake.me = { id: "m1", email: "harsh@we3vision.com", name: "Harsh" };
  users().push({ id: "m1", email: "harsh@we3vision.com", name: "Harsh" }, { id: "m2", email: "parth@we3vision.com", name: "Parth" });
});

describe("a master admin adds a new user", () => {
  it("creates a team member with a hashed password and the name that was typed", async () => {
    const r = await createAdminUser({ name: "  Rina   Shah ", email: " Rina@We3vision.com ", password: PASSWORD });
    expect(r.ok).toBe(true);
    const row = users().find((u) => u.email === "rina@we3vision.com");
    expect(row?.name).toBe("Rina Shah");
    expect(row?.passwordHash).toBe(`hash:${PASSWORD}`);
  });

  it("refuses an e-mail of another domain, a missing name and a short password", async () => {
    expect((await createAdminUser({ name: "Rina", email: "rina@gmail.com", password: PASSWORD })).ok).toBe(false);
    expect((await createAdminUser({ name: "Rina", email: "rina@we3vision.com.evil.com", password: PASSWORD })).ok).toBe(false);
    expect((await createAdminUser({ name: "  ", email: "rina@we3vision.com", password: PASSWORD })).ok).toBe(false);
    expect((await createAdminUser({ name: "Rina", email: "rina@we3vision.com", password: "short" })).ok).toBe(false);
    expect(users()).toHaveLength(2);
  });

  it("refuses an e-mail that already has a login", async () => {
    const r = await createAdminUser({ name: "Someone", email: "parth@we3vision.com", password: PASSWORD });
    expect(r.ok).toBe(false);
    expect(users()).toHaveLength(2);
  });

  it("a new login never inherits the screens of an older login with the same e-mail", async () => {
    await createAdminUser({ name: "Rina", email: "rina@we3vision.com", password: PASSWORD });
    await saveAdminAccess({ grants: { "rina@we3vision.com": ["blog", "leads"] } });
    expect(await readGrants()).toEqual({ "rina@we3vision.com": ["blog", "leads"] });
    const rina = users().find((u) => u.email === "rina@we3vision.com")!;
    expect((await deleteAdminUser(rina.id as string)).ok).toBe(true);
    expect(await readGrants()).toEqual({}); // removing the login forgets its screens
    await createAdminUser({ name: "Rina", email: "rina@we3vision.com", password: PASSWORD });
    expect(await readGrants()).toEqual({}); // and the new one starts with none
  });
});

describe("removing and changing logins", () => {
  it("never removes a master admin, not even for another master admin, and never yourself", async () => {
    expect((await deleteAdminUser("m2")).ok).toBe(false); // Parth@ is a master admin now
    expect((await deleteAdminUser("m1")).ok).toBe(false); // yourself
    expect(users().map((u) => u.id)).toEqual(["m1", "m2"]);
  });

  it("removes a team member", async () => {
    users().push({ id: "t1", email: "rina@we3vision.com", name: "Rina" });
    expect((await deleteAdminUser("t1")).ok).toBe(true);
    expect(users().map((u) => u.id)).toEqual(["m1", "m2"]);
  });

  it("changes the password of a company login, and refuses a login of another domain", async () => {
    users().push({ id: "t1", email: "rina@we3vision.com", name: "Rina", passwordHash: "old" }, { id: "x1", email: "old@gmail.com", name: "Old", passwordHash: "old" });
    expect((await setAdminPassword("t1", PASSWORD)).ok).toBe(true);
    expect(users().find((u) => u.id === "t1")?.passwordHash).toBe(`hash:${PASSWORD}`);
    expect((await setAdminPassword("x1", PASSWORD)).ok).toBe(false);
    expect((await setAdminPassword("t1", "short")).ok).toBe(false);
  });
});

describe("saving the screens of the team members", () => {
  it("keeps only existing team members: no master admin, no e-mail without a login, no unknown screen", async () => {
    users().push({ id: "t1", email: "rina@we3vision.com", name: "Rina" });
    const r = await saveAdminAccess({
      grants: {
        "rina@we3vision.com": ["leads", "blog", "nonsense"],
        "parth@we3vision.com": ["blog"], // a master admin: no row
        "nobody@we3vision.com": ["blog"], // has no login yet: nothing is stored for the future
        "stranger@gmail.com": ["blog"],
      },
    });
    expect(r.ok).toBe(true);
    expect(await readGrants()).toEqual({ "rina@we3vision.com": ["blog", "leads"] });
  });
});
