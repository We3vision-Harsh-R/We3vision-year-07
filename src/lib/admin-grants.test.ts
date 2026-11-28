import { describe, expect, it } from "vitest";
import { ADMIN_AREAS, areaOfPath, canSee, type AdminItem } from "@/components/admin/admin-menu";
import { ADMIN_ACCOUNTS, MASTER_EMAILS, isAllowedAccount, isMasterEmail } from "@/lib/admin-access";
import { canOpen, cleanGrants, resolveAccess } from "@/lib/admin-grants";

const ALL = ADMIN_AREAS.map((a) => a.key);

describe("the three accounts", () => {
  it("are exactly Admin@, Harsh@ and Parth@ of we3vision.com", () => {
    expect(ADMIN_ACCOUNTS.map((a) => a.email)).toEqual(["admin@we3vision.com", "harsh@we3vision.com", "parth@we3vision.com"]);
  });
  it("accept the three addresses in any capital letters and nothing else", () => {
    expect(isAllowedAccount("Admin@we3vision.com")).toBe(true);
    expect(isAllowedAccount(" HARSH@We3vision.com ")).toBe(true);
    expect(isAllowedAccount("parth@we3vision.com")).toBe(true);
    expect(isAllowedAccount("someone@we3vision.com")).toBe(false);
    expect(isAllowedAccount("harsh@w3vision.com")).toBe(false); // a different domain
    expect(isAllowedAccount("admin@we3vision.com.evil.com")).toBe(false);
    expect(isAllowedAccount("harsh@gmail.com")).toBe(false);
    expect(isAllowedAccount("")).toBe(false);
  });
  it("Admin@ and Harsh@ are the two master admins, Parth@ is not", () => {
    expect(MASTER_EMAILS).toEqual(["admin@we3vision.com", "harsh@we3vision.com"]);
    expect(isMasterEmail("ADMIN@we3vision.com")).toBe(true);
    expect(isMasterEmail("Harsh@we3vision.com")).toBe(true);
    expect(isMasterEmail("parth@we3vision.com")).toBe(false);
    expect(isMasterEmail("someone@we3vision.com")).toBe(false);
  });
});

describe("cleanGrants", () => {
  it("keeps only the team member, known screens, each once, in menu order", () => {
    const out = cleanGrants({
      grants: {
        "parth@we3vision.com": ["leads", "blog", "blog", "nonsense", 7],
        "harsh@we3vision.com": ["blog"],
        "admin@we3vision.com": ["blog"],
        "stranger@we3vision.com": ["blog"],
      },
    });
    expect(Object.keys(out)).toEqual(["parth@we3vision.com"]); // the master admins have no row, nobody else counts
    expect(out["parth@we3vision.com"]).toEqual(["blog", "leads"]); // menu order: Blog comes before Leads
  });
  it("is safe against garbage", () => {
    expect(cleanGrants(null)).toEqual({});
    expect(cleanGrants("x")).toEqual({});
    expect(cleanGrants({ grants: [] })).toEqual({ "parth@we3vision.com": [] });
    expect(cleanGrants({ grants: { "parth@we3vision.com": "blog" } })).toEqual({ "parth@we3vision.com": [] });
  });
});

describe("resolveAccess", () => {
  const grants = { "parth@we3vision.com": ["blog" as const, "leads" as const] };
  it("both master admins have every screen, with no row in the list", () => {
    expect(resolveAccess("Admin@we3vision.com", {})).toEqual({ isSuper: true, areas: ALL });
    expect(resolveAccess("harsh@we3vision.com", {})).toEqual({ isSuper: true, areas: ALL });
    expect(resolveAccess("harsh@we3vision.com", { "harsh@we3vision.com": [] } as never).areas).toEqual(ALL); // a row cannot take it away
  });
  it("the team member has exactly the screens that were given, and is not a master admin", () => {
    const p = resolveAccess("parth@we3vision.com", grants);
    expect(p.isSuper).toBe(false);
    expect(p.areas).toEqual(["blog", "leads"]);
    expect(canOpen(p, "blog")).toBe(true);
    expect(canOpen(p, "careers")).toBe(false);
  });
  it("the team member with no row has no screen", () => {
    expect(resolveAccess("parth@we3vision.com", {}).areas).toEqual([]);
  });
  it("any other e-mail has nothing, even with a row", () => {
    expect(resolveAccess("stranger@we3vision.com", { "stranger@we3vision.com": ["blog"] } as never)).toEqual({ isSuper: false, areas: [] });
  });
});

describe("the menu rights", () => {
  it("maps an address to its screen (the longest menu address wins)", () => {
    expect(areaOfPath("/admin/blog")).toBe("blog");
    expect(areaOfPath("/admin/blog/new")).toBe("blog");
    expect(areaOfPath("/admin/careers")).toBe("careers");
    expect(areaOfPath("/admin/careers/interviews")).toBe("careers");
    expect(areaOfPath("/admin/careers/jobs/abc")).toBe("jobs");
    expect(areaOfPath("/admin/careers/setup")).toBe("setup");
    expect(areaOfPath("/admin/ai-submissions/x/edit")).toBe("ai-submissions");
    expect(areaOfPath("/admin/access")).toBe("access");
    expect(areaOfPath("/admin")).toBeNull();
    expect(areaOfPath("/admin/unknown")).toBeNull();
  });
  it("hides the screens the team member was not given, and Admin access from everybody but a master admin", () => {
    const blog: AdminItem = { href: "/admin/blog", label: "Blog", hint: "", icon: "blog", area: "blog" };
    const dash: AdminItem = { href: "/admin", label: "Dashboard", hint: "", icon: "dashboard" };
    const access: AdminItem = { href: "/admin/access", label: "Admin access", hint: "", icon: "access", superOnly: true };
    const member = { isSuper: false, areas: ["blog"] };
    expect(canSee(dash, { isSuper: false, areas: [] })).toBe(true);
    expect(canSee(blog, member)).toBe(true);
    expect(canSee(blog, { isSuper: false, areas: [] })).toBe(false);
    expect(canSee(access, member)).toBe(false);
    expect(canSee(access, { isSuper: true, areas: ALL })).toBe(true);
  });
  it("every screen of the menu can be given, and the list has no duplicates", () => {
    expect(new Set(ALL).size).toBe(ALL.length);
    expect(ALL).toContain("careers");
    expect(ALL).not.toContain("access");
  });
});
