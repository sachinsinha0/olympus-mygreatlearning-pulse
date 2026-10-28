import { describe, expect, it } from "vitest";
import { FAILURE_CODES, FAILURE_REASONS, isFailureCode } from "./failures";

describe("failure reasons", () => {
  it("covers the six approved categories, each with copy", () => {
    expect(FAILURE_CODES).toEqual(["cancelled", "declined", "insufficient_funds", "authentication_failed", "bank_timeout", "unknown"]);
    for (const code of FAILURE_CODES) {
      const r = FAILURE_REASONS[code];
      expect(r.title && r.reason && r.advice && r.label).toBeTruthy();
    }
  });

  it("recognises codes, and rejects anything else", () => {
    expect(isFailureCode("declined")).toBe(true);
    expect(isFailureCode("expired")).toBe(false);
    expect(isFailureCode(null)).toBe(false);
  });
});
