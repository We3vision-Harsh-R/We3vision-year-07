// One rule for an email and a phone number, used by the forms (so the visitor sees the problem at once) and by the server actions (so a
// request that skips the page is stopped too). Pure functions, no imports: safe in the browser and on the server.

/** an email: something@something.tld, no spaces, a dot-separated domain of at least two letters at the end, at most 200 characters */
export function isValidEmail(v: string): boolean {
  const e = v.trim();
  if (e.length > 200 || /\s/.test(e)) return false;
  return /^[A-Za-z0-9._%+'-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(e) && !e.includes("..");
}

/** a phone number: only digits, spaces and + ( ) - . (a + only at the start), with 7 to 15 digits (the longest number in the world, E.164) */
export function isValidPhone(v: string): boolean {
  const p = v.trim();
  if (!/^\+?[\d\s().-]+$/.test(p)) return false;
  const digits = p.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}

/** the message under an email field ("" = fine). An empty value is not an error here (a required field is checked by the form). */
export function emailProblem(v: string): string {
  if (!v.trim()) return "";
  return isValidEmail(v) ? "" : "Please enter a valid email, like name@example.com.";
}

/** the message under a phone field ("" = fine) */
export function phoneProblem(v: string): string {
  if (!v.trim()) return "";
  return isValidPhone(v) ? "" : "Please enter a valid phone number: 7 to 15 digits, for example +91 98765 43210.";
}
