// Who may have an admin login, and the picture of the login page. No server-only imports: the seed script uses the domain rule too.

/** Only e-mail addresses of this company can sign in, and only they can be added as admin users (the rule for every login, master admin or team member). */
export const ADMIN_DOMAIN = "we3vision.com";

export function isCompanyEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  return at > 0 && e.slice(at + 1) === ADMIN_DOMAIN && /^[a-z0-9._%+'-]+$/.test(e.slice(0, at));
}

// THE MASTER ADMINS (owner, 2026-11-28). They see every screen and Admin access, and nobody can remove them (they need nobody's permission).
// They are fixed here in the code on purpose: a database row alone can never make somebody a master admin.
// Every OTHER login is a team member made in Admin access by a master admin; a team member opens only the screens a master admin ticked for them.
export const MASTER_ADMINS = [
  { email: "admin@we3vision.com", name: "Admin" },
  { email: "harsh@we3vision.com", name: "Harsh" },
  { email: "parth@we3vision.com", name: "Parth" },
] as const;
export const MASTER_EMAILS: string[] = MASTER_ADMINS.map((a) => a.email);

/** One of the master admins (any capital letters are fine). */
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
