/** Where to go after the admin login: only a path of this site (an address that starts with a single "/"), otherwise the dashboard. */
export function safeAdminNext(value: unknown): string {
  const v = typeof value === "string" ? value : "";
  const backslash = String.fromCharCode(92);
  if (!v.startsWith("/") || v.startsWith("//") || v.includes(backslash) || /[\r\n]/.test(v) || v.length > 2000) return "/admin";
  return v;
}
