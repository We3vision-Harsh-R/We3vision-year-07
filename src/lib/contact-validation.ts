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
  return leadPhone(v).ok;
}

/** the message under an email field ("" = fine). An empty value is not an error here (a required field is checked by the form). */
export function emailProblem(v: string): string {
  if (!v.trim()) return "";
  return isValidEmail(v) ? "" : "Please enter a valid email, like name@example.com.";
}

/** the message under a phone field ("" = fine) */
export function phoneProblem(v: string): string {
  if (!v.trim()) return "";
  const p = leadPhone(v);
  return p.ok ? "" : p.problem;
}

/** a person's name: letters, spaces and . ' - only, 2 to 50 characters */
export function nameProblem(v: string): string {
  const n = v.trim();
  if (!n) return "";
  if (n.length < 2) return "Please enter at least 2 letters.";
  if (n.length > 50) return "Please use 50 characters at most.";
  return /^[\p{L}][\p{L}\p{M}\s]*$/u.test(n) ? "" : "Full name can only contain letters and spaces.";
}

/** a link: a real https address (optional field: empty is fine) */
export function urlProblem(v: string): string {
  const t = v.trim();
  if (!t) return "";
  try {
    const u = new URL(t);
    if (u.protocol !== "https:") return "Please use a link that starts with https://";
    if (!u.hostname.includes(".") || /\s/.test(t)) return "Please enter a valid https:// link, like https://linkedin.com/in/yourname";
    return "";
  } catch {
    return "Please enter a valid https:// link, like https://linkedin.com/in/yourname";
  }
}

/** an amount of money per year: digits with optional commas and one decimal part (optional field) */
export function moneyProblem(v: string): string {
  const t = v.trim().replace(/\s/g, "");
  if (!t) return "";
  return /^\d{1,12}$/.test(t) ? "" : "Numbers only (digits), for example 600000.";
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

/** "Why do you want to join": when it is written, at least 20 characters, and plain text */
export function aboutProblem(v: string): string {
  const t = v.trim();
  if (!t) return "";
  if (t.length < 20) return "Please write at least 20 characters about why you want to join.";
  return textProblem(v);
}

/** a question of the form that asks for a link ("Link to your best work"): the answer must be an https link */
export const isLinkQuestion = (label: string) => /\b(link|url|portfolio|website)\b/i.test(label);

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
      return textProblem(value);
    case "about":
      return aboutProblem(value);
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------------
// THE CONTACT FORMS (Get a free quote / Start a project): the same rules in the forms and in the server action submitLead.

/** the name of a contact form: letters, single spaces between names, hyphens and apostrophes only; 2 to 100 characters; the spaces round it are cut */
export function leadNameProblem(v: string): string {
  const n = v.trim();
  if (!n) return "Please enter your full name.";
  if (n.length < 2) return "Your name needs at least 2 letters.";
  if (n.length > 100) return "Please use 100 characters at most.";
  return /^[\p{L}\p{M}][\p{L}\p{M}\s'’-]*$/u.test(n) ? "" : "Please use letters, spaces, hyphens and apostrophes only (no numbers or symbols).";
}

/** what is allowed in the phone field while typing: digits (and a + at the start), at most 10 digits for an Indian number, 12 with 91 in front, 15 with another country code */
export function limitPhone(v: string): string {
  const plus = v.trim().startsWith("+");
  let d = v.replace(/\D/g, "");
  d = d.slice(0, plus ? (d.startsWith("91") ? 12 : 15) : d.startsWith("91") && d.length > 10 ? 12 : 10);
  return (plus ? "+" : "") + d;
}

/** the name as it is stored: trimmed, and one space between the names */
export const cleanLeadName = (v: string) => v.trim().replace(/\s+/g, " ");

/**
 * the phone number of a contact form. An Indian number is 10 digits starting with 6, 7, 8 or 9; "+91", "91" or a 0 in front, spaces, dashes and
 * brackets are taken away. A number with another country code (+44 ...) is accepted with 10 to 15 digits.
 * Returns the number in one form ("+91 9876543210") or the problem.
 */
export function leadPhone(v: string): { ok: true; value: string } | { ok: false; problem: string } {
  const raw = v.trim();
  if (!raw) return { ok: false, problem: "Please enter your mobile number." };
  if (!/^\+?[\d\s().-]+$/.test(raw)) return { ok: false, problem: "Use digits only: for example 98765 43210." };
  const digits = raw.replace(/\D/g, "");
  const abroad = raw.startsWith("+") && !digits.startsWith("91");
  if (abroad) return digits.length >= 10 && digits.length <= 15 ? { ok: true, value: `+${digits}` } : { ok: false, problem: "Please enter a valid number with its country code, 10 to 15 digits." };
  let local = digits;
  if (local.length === 12 && local.startsWith("91")) local = local.slice(2);
  else if (local.length === 11 && local.startsWith("0")) local = local.slice(1);
  return /^[6-9]\d{9}$/.test(local) ? { ok: true, value: `+91 ${local}` } : { ok: false, problem: "Please enter a valid 10-digit mobile number (it starts with 6, 7, 8 or 9)." };
}

export type LeadValues = { name: string; email: string; phone: string; message: string };
export type LeadProblems = Partial<Record<keyof LeadValues, string>>;

/** every problem of a contact form by field. `phone` is checked when it is filled in, and always when `phoneRequired`; `messageRequired` likewise. */
export function leadProblems(v: LeadValues, o: { phoneRequired?: boolean; messageRequired?: boolean } = {}): LeadProblems {
  const out: LeadProblems = {};
  const name = leadNameProblem(v.name);
  if (name) out.name = name;
  if (!v.email.trim()) out.email = "Please enter your email.";
  else if (!isValidEmail(v.email)) out.email = "Please enter a valid email, like name@example.com.";
  if (v.phone.trim() || o.phoneRequired) {
    const p = leadPhone(v.phone);
    if (!p.ok) out.phone = p.problem;
  }
  const m = v.message.trim();
  if (m && /[<>{}\[\]\\|^~`*=$]/.test(m)) out.message = "Please use normal text: letters, numbers and basic punctuation (. , ! ? ' - : ; ( ) / & @) only.";
  else if (!m && o.messageRequired !== false) out.message = "Please tell us about your project.";
  else if (m && m.length < 10 && o.messageRequired !== false) out.message = "Please write a few more words (at least 10 characters).";
  return out;
}
