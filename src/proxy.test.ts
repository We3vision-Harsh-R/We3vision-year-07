import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

const ev = { waitUntil() {} } as never;

describe("proxy security", () => {
  it("sends the security headers on a page", async () => {
    const res = await proxy(new NextRequest("http://localhost/about"), ev);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("content-security-policy")).toContain("object-src 'none'");
  });
  it("sends an admin page without a login to the login page", async () => {
    process.env.SESSION_SECRET = "x".repeat(40);
    const res = await proxy(new NextRequest("http://localhost/admin/leads"), ev);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin/login");
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  });
});
