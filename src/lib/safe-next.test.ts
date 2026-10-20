import { describe, expect, it } from "vitest";
import { safeAdminNext } from "./safe-next";

const backslash = String.fromCharCode(92);

describe("safeAdminNext (where the admin login returns to)", () => {
  it("keeps a path of this site, with its query", () => {
    expect(safeAdminNext("/admin/connect?client_id=w3c_x&state=1")).toBe("/admin/connect?client_id=w3c_x&state=1");
  });
  it.each(["https://evil.example", "//evil.example", `/${backslash}evil.example`, "/ok\r\nSet-Cookie: a=b", "javascript:alert(1)", "", undefined, 5])("falls back to /admin for %s", (v) => {
    expect(safeAdminNext(v)).toBe("/admin");
  });
});
