// Who may have an admin login, and the picture of the login page. No server-only imports: the seed script uses the domain rule too.

/** Only e-mail addresses of this company can sign in, and only they can be added as admin users. */
export const ADMIN_DOMAIN = "we3vision.com";

export function isCompanyEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  return at > 0 && e.slice(at + 1) === ADMIN_DOMAIN && /^[a-z0-9._%+'-]+$/.test(e.slice(0, at));
}

/** The picture on the right of the login page until another one is chosen in the admin panel. */
export const DEFAULT_LOGIN_IMAGE = "/images/about-metaverse.webp";
export const LOGIN_SETTING_KEY = "login";

/** Accepts the address of an uploaded picture (/media/…), a picture of the site (/images/…) or a https address. */
export function cleanLoginImage(input: unknown): string {
  const v = typeof input === "string" ? input.trim() : "";
  if (!v || v.length > 500) return "";
  return /^\/(media|images|brand)\/[\w./-]+$/.test(v) || /^https:\/\/[^\s"'<>]+$/.test(v) ? v : "";
}
