// Who may have an admin login, and the picture of the login page. No server-only imports: the seed script uses the domain rule too.

/** Only e-mail addresses of this company can sign in, and only they can be added as admin users. */
export const ADMIN_DOMAIN = "we3vision.com";

export function isCompanyEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  return at > 0 && e.slice(at + 1) === ADMIN_DOMAIN && /^[a-z0-9._%+'-]+$/.test(e.slice(0, at));
}

// THE THREE ACCOUNTS (owner, 2026-11-28). The admin panel has exactly these three logins and no others: a row of any other e-mail in the
// database cannot sign in, cannot be created and is ignored everywhere.
//  - Admin@ and Harsh@ are the two MASTER ADMINS: every screen, Admin access, and nobody can remove them (they need nobody's permission).
//  - Parth@ is a team member: he opens only the screens a master admin ticked for him in Admin access.
// To add a person or change a role, change a line here (a code change on purpose).
export const ADMIN_ACCOUNTS = [
  { email: "admin@we3vision.com", name: "Admin", master: true },
  { email: "harsh@we3vision.com", name: "Harsh", master: true },
  { email: "parth@we3vision.com", name: "Parth", master: false },
] as const;
export const ADMIN_EMAILS: string[] = ADMIN_ACCOUNTS.map((a) => a.email);
export const MASTER_EMAILS: string[] = ADMIN_ACCOUNTS.filter((a) => a.master).map((a) => a.email);

/** One of the three accounts (any capital letters are fine). */
export const isAllowedAccount = (email: string) => ADMIN_EMAILS.includes(email.trim().toLowerCase());
/** One of the two master admins (Admin@ or Harsh@). */
export const isMasterEmail = (email: string) => MASTER_EMAILS.includes(email.trim().toLowerCase());

/** The picture on the right of the login page until another one is chosen in the admin panel. */
export const DEFAULT_LOGIN_IMAGE = "/images/about-metaverse.webp";
export const LOGIN_SETTING_KEY = "login";

/** Accepts the address of an uploaded picture (/media/…), a picture of the site (/images/…) or a https address. */
export function cleanLoginImage(input: unknown): string {
  const v = typeof input === "string" ? input.trim() : "";
  if (!v || v.length > 500) return "";
  return /^\/(media|images|brand)\/[\w./-]+$/.test(v) || /^https:\/\/[^\s"'<>]+$/.test(v) ? v : "";
}
