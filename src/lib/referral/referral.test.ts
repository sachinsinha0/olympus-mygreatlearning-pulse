import { describe, expect, it } from "vitest";
import { REFERRAL_FAQS, REFERRAL_REWARDS } from "./content";
import { buildReferralLink, formatReferredOn, formatReward, splitEmails } from "./referral";

describe("buildReferralLink", () => {
  it("is a prod-shaped /rl/ link with a url-safe token", () => {
    const link = buildReferralLink("Agentic AI", 49254, Date.UTC(2026, 9, 8));
    expect(link).toMatch(/^https:\/\/mgolympus1\.iac-mygreatlearning\.net\/rl\/[A-Za-z0-9_-]+$/);
  });
  it("differs by program, so each choice gets its own link", () => {
    const at = Date.UTC(2026, 9, 8);
    expect(buildReferralLink("My Program", 1, at)).not.toBe(buildReferralLink("Technology", 1, at));
  });
});

describe("formatting", () => {
  it("prints the referral date like prod", () => {
    expect(formatReferredOn("2022-12-19")).toBe("19 Dec 2022");
  });
  it("prints rewards, or No Reward", () => {
    expect(formatReward(150)).toBe("$150");
    expect(formatReward(null)).toBe("No Reward");
  });
});

describe("splitEmails", () => {
  it("pulls email addresses out of a sentence, leaving the full stop behind", () => {
    expect(splitEmails("Write to referral_support@greatlearning.in.")).toEqual([
      { text: "Write to " },
      { text: "referral_support@greatlearning.in", email: true },
      { text: "." },
    ]);
  });
});

describe("content", () => {
  it("has every FAQ from prod, with the rewards table on one of them", () => {
    expect(REFERRAL_FAQS).toHaveLength(13);
    expect(REFERRAL_FAQS.filter((f) => f.rewardsTable)).toHaveLength(1);
  });
  it("has all 45 rows of the rewards table", () => {
    expect(REFERRAL_REWARDS).toHaveLength(45);
  });
});
