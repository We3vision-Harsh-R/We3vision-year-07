import { describe, expect, it } from "vitest";
import { ADMIN_AREAS, areaOfPath, canSee, type AdminItem } from "@/components/admin/admin-menu";
import { ADMIN_DOMAIN, MASTER_ADMINS, MASTER_EMAILS, isCompanyEmail, isMasterEmail } from "@/lib/admin-access";
import { canOpen, cleanGrants, resolveAccess } from "@/lib/admin-grants";

const ALL = ADMIN_AREAS.map((a) => a.key);

describe("the master admins", () => {
  it("are exactly Admin@, Harsh@ and Parth@ of we3vision.com", () => {
    expect(MASTER_ADMINS.map((a) => a.email)).toEqual(["admin@we3vision.com", "harsh@we3vision.com", "parth@we3vision.com"]);
    expect(MASTER_EMAILS).toEqual(["admin@we3vision.com", "harsh@we3vision.com", "parth@we3vision.com"]);
  });
  it("are found in any capital letters, and nobody else is a master admin", () => {
    expect(isMasterEmail("ADMIN@we3vision.com")).toBe(true);
    expect(isMasterEmail(" Harsh@We3vision.com ")).toBe(true);
    expect(isMasterEmail("parth@we3vision.com")).toBe(true);
    expect(isMasterEmail("someone@we3vision.com")).toBe(false);
    expect(isMasterEmail("parth@gmail.com")).toBe(false);
    expect(isMasterEmail("")).toBe(false);
  });
});

describe("the company e-mail rule (the only rule for a new login)", () => {
  it("accepts any name at the company domain", () => {
    expect(ADMIN_DOMAIN).toBe("we3vision.com");
    expect(isCompanyEmail("someone@we3vision.com")).toBe(true);
    expect(isCompanyEmail(" Rina.Shah+hr@We3vision.com ")).toBe(true);
  });
  it("refuses every other domain and look-alike", () => {
    expect(isCompanyEmail("harsh@w3vision.com")).toBe(false); // a different domain
    expect(isCompanyEmail("admin@we3vision.com.evil.com")).toBe(false);
    expect(isCompanyEmail("harsh@gmail.com")).toBe(false);
    expect(isCompanyEmail("a b@we3vision.com")).toBe(false);
    expect(isCompanyEmail("@we3vision.com")).toBe(false);
    expect(isCompanyEmail("")).toBe(false);
  });
});

describe("cleanGrants", () => {
  it("keeps only team members, known screens, each once, in menu order", () => {
    const out = cleanGrants({
      grants: {
        "rina@we3vision.com": ["leads", "blog", "blog", "nonsense", 7],
        " Dev@We3vision.com ": ["careers"],
        "harsh@we3vision.com": ["blog"],
        "admin@we3vision.com": ["blog"],
        "parth@we3vision.com": ["blog"],
        "stranger@gmail.com": ["blog"],
      },
    });
    expect(Object.keys(out).sort()).toEqual(["dev@we3vision.com", "rina@we3vision.com"]); // the master admins have no row, other domains never count
    expect(out["rina@we3vision.com"]).toEqual(["blog", "leads"]); // menu order: Blog comes before Leads
    expect(out["dev@we3vision.com"]).toEqual(["careers"]);
  });
  it("is safe against garbage", () => {
    expect(cleanGrants(null)).toEqual({});
    expect(cleanGrants("x")).toEqual({});
    expect(cleanGrants({ grants: [] })).toEqual({});
    expect(cleanGrants({ grants: { "rina@we3vision.com": "blog" } })).toEqual({ "rina@we3vision.com": [] });
    expect(cleanGrants({ grants: { __proto__: ["blog"], "constructor": ["blog"] } })).toEqual({});
  });
});

describe("resolveAccess", () => {
  const grants = { "rina@we3vision.com": ["blog" as const, "leads" as const] };
  it("every master admin has every screen, with no row in the list", () => {
    for (const email of ["Admin@we3vision.com", "harsh@we3vision.com", "parth@we3vision.com"]) {
      expect(resolveAccess(email, {})).toEqual({ isSuper: true, areas: ALL });
    }
    expect(resolveAccess("parth@we3vision.com", { "parth@we3vision.com": [] } as never).areas).toEqual(ALL); // a row cannot take it away
  });
  it("a team member has exactly the screens that were given, and is not a master admin", () => {
    const p = resolveAccess("rina@we3vision.com", grants);
    expect(p.isSuper).toBe(false);
    expect(p.areas).toEqual(["blog", "leads"]);
    expect(canOpen(p, "blog")).toBe(true);
    expect(canOpen(p, "careers")).toBe(false);
  });
  it("a team member with no row has no screen", () => {
    expect(resolveAccess("rina@we3vision.com", {}).areas).toEqual([]);
  });
  it("an e-mail of another domain has nothing, even with a row", () => {
    expect(resolveAccess("stranger@gmail.com", { "stranger@gmail.com": ["blog"] } as never)).toEqual({ isSuper: false, areas: [] });
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
