import { describe, expect, it } from "vitest";
import { emailProblem, experienceProblem, fieldProblem, isValidEmail, isValidPhone, moneyProblem, nameProblem, phoneProblem, textProblem, urlProblem } from "./contact-validation";

describe("email", () => {
  it("accepts normal addresses", () => {
    for (const e of ["a@b.co", "harsh.we3vision@gmail.com", "first+tag@sub.example.in", " me@x.org "]) expect(isValidEmail(e)).toBe(true);
  });
  it("rejects broken ones", () => {
    for (const e of ["", "abc", "a@b", "a@b.", "a b@c.com", "a@@b.com", "@b.com", "a@b..com", "a@.com", "a@b.c"]) expect(isValidEmail(e)).toBe(false);
  });
  it("says nothing for an empty field and a message for a bad one", () => {
    expect(emailProblem("")).toBe("");
    expect(emailProblem("nope")).not.toBe("");
    expect(emailProblem("ok@ok.com")).toBe("");
  });
});

describe("phone", () => {
  it("accepts numbers with 10 to 15 digits and the usual signs", () => {
    for (const p of ["9876543210", "+91 98765 43210", "+1 415.555.2671"]) expect(isValidPhone(p)).toBe(true);
  });
  it("rejects letters, too few or too many digits and a plus in the middle", () => {
    for (const p of ["", "12345", "123456789", "abcdefghij", "98765abc10", "1234567890123456", "98+7654321", "<>*:]}{(*&^%$#@!"]) expect(isValidPhone(p)).toBe(false);
  });
  it("messages", () => {
    expect(phoneProblem("")).toBe("");
    expect(phoneProblem("12")).not.toBe("");
  });
});

describe("the application fields", () => {
  it("name: letters and spaces, 2 to 50", () => {
    for (const n of ["Harsh Ramoliya", "ગૌતમ શાહ", "Zoë"]) expect(nameProblem(n)).toBe("");
    for (const n of ["A", "R2D2", "Anne-Marie", "O'Neil", "<>*:]}{(*&^%$#@!", "x".repeat(51)]) expect(nameProblem(n)).not.toBe("");
  });
  it("links must be https", () => {
    expect(urlProblem("")).toBe("");
    expect(urlProblem("https://www.linkedin.com/in/someone")).toBe("");
    for (const u of ["http://x.com", "javascript:alert(1)", "linkedin.com/in/x", "https://nodot", "not a link"]) expect(urlProblem(u)).not.toBe("");
  });
  it("money and experience are numbers", () => {
    for (const m of ["", "600000", "45000"]) expect(moneyProblem(m)).toBe("");
    for (const m of ["abc", "5 lakh", "<>", "6,00,000", "5.5", "-3"]) expect(moneyProblem(m)).not.toBe("");
    for (const e of ["", "Fresher", "2", "2.5", "2 years", "2 years 6 months", "10 yrs"]) expect(experienceProblem(e)).toBe("");
    for (const e of ["a lot", "<script>", "2 apples"]) expect(experienceProblem(e)).not.toBe("");
  });
  it("text: no angle brackets and not a row of symbols", () => {
    expect(textProblem("React, Figma, Unity and SEO")).toBe("");
    expect(textProblem("<script>alert(1)</script>")).not.toBe("");
    expect(textProblem("@#$%^&*()!@#$%^&*")).not.toBe("");
  });
  it("fieldProblem picks the rule by the key", () => {
    expect(fieldProblem("email", "x")).not.toBe("");
    expect(fieldProblem("currentCtc", "abc")).not.toBe("");
    expect(fieldProblem("unknownKey", "<>")).toBe("");
  });
});

import { cleanLeadName, leadNameProblem, leadPhone, leadProblems } from "./contact-validation";

describe("contact forms (lead)", () => {
  it("name: letters, spaces, - and ' only", () => {
    for (const n of ["Harsh Ramoliya", "Anne-Marie", "O'Neil", "ગૌતમ શાહ"]) expect(leadNameProblem(n)).toBe("");
    for (const n of ["", "   ", "A", "R2D2", "John@Doe", "Jo.hn", "<script>", "x".repeat(101)]) expect(leadNameProblem(n)).not.toBe("");
    expect(cleanLeadName("  Harsh    Ramoliya ")).toBe("Harsh Ramoliya");
  });
  it("phone: an Indian mobile of 10 digits starting with 6-9", () => {
    for (const p of ["9876543210", "+91 98765 43210", "98765-43210", "09876543210", "91 9876543210"]) expect(leadPhone(p)).toEqual({ ok: true, value: "+91 9876543210" });
    for (const p of ["", "1234567890", "5876543210", "98765", "98765abc10", "+91 12345"]) expect(leadPhone(p).ok).toBe(false);
  });
  it("a number with another country code is fine", () => {
    expect(leadPhone("+44 7700 900123")).toEqual({ ok: true, value: "+447700900123" });
    expect(leadPhone("+44 77").ok).toBe(false);
  });
  it("problems by field", () => {
    expect(leadProblems({ name: "Asha", email: "a@b.co", phone: "9876543210", message: "I need a CRM for sales" }, { phoneRequired: true })).toEqual({});
    const bad = leadProblems({ name: "A1", email: "x", phone: "", message: "   " }, { phoneRequired: true });
    expect(Object.keys(bad).sort()).toEqual(["email", "message", "name", "phone"]);
    expect(leadProblems({ name: "Asha", email: "a@b.co", phone: "", message: "I need a CRM for sales" })).toEqual({});
  });
});

import { limitPhone } from "./contact-validation";

describe("limitPhone", () => {
  it("keeps digits only and at most 10 (12 with 91, 15 with a country code)", () => {
    expect(limitPhone("98a76-54321 0999")).toBe("9876543210");
    expect(limitPhone("+91 98765 43210 77")).toBe("+919876543210");
    expect(limitPhone("")).toBe("");
  });
  it("a message with symbols is refused, normal punctuation is fine", () => {
    expect(leadProblems({ name: "Asha", email: "a@b.co", phone: "", message: "Hello! Need a CRM, 2 users (sales) - ASAP?" }).message).toBeUndefined();
    expect(leadProblems({ name: "Asha", email: "a@b.co", phone: "", message: "Hello <b>bold</b> {x} [y] \\ | ^ ~" }).message).toBeDefined();
  });
});

import { aboutProblem, isLinkQuestion } from "./contact-validation";

describe("job form extras", () => {
  it("about: at least 20 characters when written", () => {
    expect(aboutProblem("")).toBe("");
    expect(aboutProblem("short one")).not.toBe("");
    expect(aboutProblem("I like building apps that people use every day.")).toBe("");
    expect(aboutProblem("<script>alert(1)</script> and more words here")).not.toBe("");
  });
  it("a question about a link is checked as a link", () => {
    expect(isLinkQuestion("Link to your best work (optional)")).toBe(true);
    expect(isLinkQuestion("Are you able to work from our Surat office?")).toBe(false);
  });
});
