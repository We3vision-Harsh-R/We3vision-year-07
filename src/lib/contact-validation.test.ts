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
    for (const p of ["9876543210", "+91 98765 43210", "(079) 2345-6789", "+1 415.555.2671"]) expect(isValidPhone(p)).toBe(true);
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
    for (const n of ["Harsh Ramoliya", "Anne-Marie O'Neil", "ગૌતમ શાહ", "Zoë"]) expect(nameProblem(n)).toBe("");
    for (const n of ["A", "R2D2", "<>*:]}{(*&^%$#@!", "x".repeat(51)]) expect(nameProblem(n)).not.toBe("");
  });
  it("links must be https", () => {
    expect(urlProblem("")).toBe("");
    expect(urlProblem("https://www.linkedin.com/in/someone")).toBe("");
    for (const u of ["http://x.com", "javascript:alert(1)", "linkedin.com/in/x", "https://nodot", "not a link"]) expect(urlProblem(u)).not.toBe("");
  });
  it("money and experience are numbers", () => {
    for (const m of ["", "600000", "6,00,000", "5.5"]) expect(moneyProblem(m)).toBe("");
    for (const m of ["abc", "5 lakh", "<>"]) expect(moneyProblem(m)).not.toBe("");
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
