import { describe, expect, it } from "vitest";
import { PLAN_PRICE, planDurationDays } from "./pricing";

describe("planDurationDays", () => {
  it("gives an annual plan a year of access", () => {
    expect(planDurationDays("annual")).toBe(365);
  });

  it("gives a monthly plan 30 days of access", () => {
    expect(planDurationDays("monthly")).toBe(30);
  });
});

describe("PLAN_PRICE", () => {
  it("prices annual as $25/mo billed annually", () => {
    expect(PLAN_PRICE.annual.perMo).toBe("$25/mo");
    expect(PLAN_PRICE.annual.billing).toBe("Billed annually");
  });

  it("prices monthly as $30/mo billed monthly", () => {
    expect(PLAN_PRICE.monthly.perMo).toBe("$30/mo");
    expect(PLAN_PRICE.monthly.billing).toBe("Billed monthly");
  });
});
