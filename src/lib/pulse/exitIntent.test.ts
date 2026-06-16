import { describe, it, expect } from "vitest";
import { isExitFromPulse, EXIT_INTENT_REASONS } from "./exitIntent";

describe("isExitFromPulse", () => {
  it("blocks leaving the Pulse area for a non-Pulse route", () => {
    expect(isExitFromPulse("/pulse", "/")).toBe(true);
    expect(isExitFromPulse("/pulse/intro", "/courses")).toBe(true);
    expect(isExitFromPulse("/pulse/modules/m1", "/program_support")).toBe(true);
  });

  it("does not block navigation within the Pulse area", () => {
    expect(isExitFromPulse("/pulse/intro", "/pulse")).toBe(false);
    expect(isExitFromPulse("/pulse", "/pulse/modules/m1")).toBe(false);
  });

  it("does not block navigation that starts outside Pulse", () => {
    expect(isExitFromPulse("/", "/courses")).toBe(false);
    expect(isExitFromPulse("/courses", "/")).toBe(false);
  });

  it("treats lookalike paths outside /pulse as non-Pulse", () => {
    expect(isExitFromPulse("/pulse", "/pulse-x")).toBe(true);
    expect(isExitFromPulse("/pulse-x", "/pulse")).toBe(false);
  });
});

describe("EXIT_INTENT_REASONS", () => {
  it("has unique ids and includes the cost concern", () => {
    const ids = EXIT_INTENT_REASONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("cost");
  });
});
