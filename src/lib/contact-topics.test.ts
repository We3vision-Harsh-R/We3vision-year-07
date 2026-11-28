import { describe, expect, it } from "vitest";
import { topicHeader } from "./contact-topics";

describe("topicHeader", () => {
  it("writes the topic and the answers of that topic only", () => {
    const answers: Record<string, string[]> = { company: ["Acme <b>"], ways: ["Referral partner", "White-label partner"], role: ["ignored"] };
    const h = topicHeader("partner", (k) => answers[k] ?? []);
    expect(h).toBe("Topic: Partner\nHow would you like to partner?: Referral partner, White-label partner\nCompany or college: Acme b");
  });
  it("gives nothing for an unknown topic", () => {
    expect(topicHeader("hack", () => ["x"])).toBe("");
  });
});
