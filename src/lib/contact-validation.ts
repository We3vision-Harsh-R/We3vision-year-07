// One rule for an email and a phone number, used by the forms (so the visitor sees the problem at once) and by the server actions (so a
// request that skips the page is stopped too). Pure functions, no imports: safe in the browser and on the server.

/** an email: something@something.tld, no spaces, a dot-separated domain of at least two letters at the end, at most 200 characters */
export function isValidEmail(v: string): boolean {
  const e = v.trim();
  if (e.length > 200 || /\s/.test(e)) return false;
  return /^[A-Za-z0-9._%+'-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(e) && !e.includes("..");
}

/** a phone number: only digits, spaces and + ( ) - . (a + only at the start), with 10 to 15 digits (a mobile number, with or without a country code; 15 is the longest number in the world, E.164) */
export function isValidPhone(v: string): boolean {
  const p = v.trim();
  if (!/^\+?[\d\s().-]+$/.test(p)) return false;
  const digits = p.replace(/\D/g, "").length;
  return digits >= 10 && digits <= 15;
}

/** the message under an email field ("" = fine). An empty value is not an error here (a required field is checked by the form). */
export function emailProblem(v: string): string {
  if (!v.trim()) return "";
  return isValidEmail(v) ? "" : "Please enter a valid email, like name@example.com.";
}

/** the message under a phone field ("" = fine) */
export function phoneProblem(v: string): string {
  if (!v.trim()) return "";
  return isValidPhone(v) ? "" : "Please enter a valid phone number: 10 to 15 digits, for example +91 98765 43210.";
}

/** a person's name: letters, spaces and . ' - only, 2 to 50 characters */
export function nameProblem(v: string): string {
  const n = v.trim();
  if (!n) return "";
  if (n.length < 2) return "Please enter at least 2 letters.";
  if (n.length > 50) return "Please use 50 characters at most.";
  return /^[\p{L}][\p{L}\p{M}\s.'’-]*$/u.test(n) ? "" : "Please use letters and spaces only.";
}

/** a link: a real https address (optional field: empty is fine) */
export function urlProblem(v: string): string {
  const t = v.trim();
  if (!t) return "";
  try {
    const u = new URL(t);
    if (u.protocol !== "https:") return "Please use a link that starts with https://";
    if (!u.hostname.includes(".") || /\s/.test(t)) return "Please enter a valid link, like https://linkedin.com/in/yourname";
    return "";
  } catch {
    return "Please enter a valid link, like https://linkedin.com/in/yourname";
  }
}

/** an amount of money per year: digits with optional commas and one decimal part (optional field) */
export function moneyProblem(v: string): string {
  const t = v.trim().replace(/\s/g, "");
  if (!t) return "";
  return /^\d[\d,]{0,14}(\.\d{1,2})?$/.test(t) ? "" : "Numbers only, for example 600000.";
}

/** experience: Fresher, or a number of years and months such as 2, 2.5, 2 years or 2 years 6 months (optional field) */
export function experienceProblem(v: string): string {
  const t = v.trim();
  if (!t) return "";
  return /^(fresher|\d{1,2}(\.\d)?(\s*(years?|yrs?))?(\s*\d{1,2}\s*(months?|mos?))?)$/i.test(t) ? "" : "Write Fresher or the years, for example 2 or 2 years 6 months.";
}

/** free text (skills, a few lines about yourself): no < or >, and mostly words: a row of symbols is refused */
export function textProblem(v: string): string {
  const t = v.trim();
  if (!t) return "";
  if (/[<>]/.test(t)) return "Please remove the < and > signs.";
  const s = t.replace(/\s/g, "");
  const words = (s.match(/[\p{L}\p{M}\p{N}]/gu) ?? []).length;
  return s.length >= 4 && words / s.length < 0.5 ? "Please write in words, without a row of symbols." : "";
}

/** the problem of one field of the application forms, by its key ("" = fine); the same rules run in the form and on the server */
export function fieldProblem(key: string, value: string): string {
  switch (key) {
    case "name":
    case "city":
      return nameProblem(value);
    case "email":
      return emailProblem(value);
    case "phone":
      return phoneProblem(value);
    case "linkedin":
      return urlProblem(value);
    case "experience":
      return experienceProblem(value);
    case "currentCtc":
    case "expectedCtc":
      return moneyProblem(value);
    case "skills":
    case "about":
      return textProblem(value);
    default:
      return "";
  }
}
