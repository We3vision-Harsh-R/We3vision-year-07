import { describe, expect, it } from "vitest";
import { emailProblem, isValidEmail, isValidPhone, phoneProblem } from "./contact-validation";

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
  it("accepts numbers with 7 to 15 digits and the usual signs", () => {
    for (const p of ["9876543210", "+91 98765 43210", "(079) 2345-6789", "+1 415.555.2671"]) expect(isValidPhone(p)).toBe(true);
  });
  it("rejects letters, too few or too many digits and a plus in the middle", () => {
    for (const p of ["", "12345", "abcdefghij", "98765abc10", "1234567890123456", "98+7654321"]) expect(isValidPhone(p)).toBe(false);
  });
  it("messages", () => {
    expect(phoneProblem("")).toBe("");
    expect(phoneProblem("12")).not.toBe("");
  });
});
