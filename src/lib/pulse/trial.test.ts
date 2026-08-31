import { describe, expect, it } from "vitest";
import { TRIAL_DAYS, trialEndsOn } from "./trial";

describe("TRIAL_DAYS", () => {
  it("is 14 days", () => {
    expect(TRIAL_DAYS).toBe(14);
  });
});

describe("trialEndsOn", () => {
  it("adds the trial length to the start date", () => {
    expect(trialEndsOn("2026-08-31")).toBe("2026-09-14");
  });

  it("crosses a year boundary", () => {
    expect(trialEndsOn("2026-12-25")).toBe("2027-01-08");
  });

  it("handles a leap day", () => {
    expect(trialEndsOn("2028-02-20")).toBe("2028-03-05");
  });
});
