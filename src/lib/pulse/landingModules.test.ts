import { describe, expect, it } from "vitest";
import { selectLandingModules } from "./landingModules";
import type { PulseIssue } from "./types";

function issue(id: string, releasedAt: string): PulseIssue {
  return { id, releasedAt } as PulseIssue;
}

describe("selectLandingModules", () => {
  const all = [
    issue("future", "2026-07-01"),
    issue("today", "2026-06-05"),
    issue("older", "2026-05-01"),
    issue("oldest", "2026-04-01"),
  ];

  it("drops modules released after today", () => {
    const { visible } = selectLandingModules(all, "2026-06-05", 6);
    expect(visible.map((i) => i.id)).not.toContain("future");
  });

  it("includes a module released exactly today", () => {
    const { visible } = selectLandingModules(all, "2026-06-05", 6);
    expect(visible.map((i) => i.id)).toContain("today");
  });

  it("sorts newest first", () => {
    const { visible } = selectLandingModules(all, "2026-06-05", 6);
    expect(visible.map((i) => i.id)).toEqual(["today", "older", "oldest"]);
  });

  it("splits at the visible count", () => {
    const { visible, hidden } = selectLandingModules(all, "2026-06-05", 2);
    expect(visible.map((i) => i.id)).toEqual(["today", "older"]);
    expect(hidden.map((i) => i.id)).toEqual(["oldest"]);
  });

  it("counts every released module, not just the visible ones", () => {
    expect(selectLandingModules(all, "2026-06-05", 2).total).toBe(3);
  });

  it("leaves hidden empty when everything fits", () => {
    expect(selectLandingModules(all, "2026-06-05", 6).hidden).toEqual([]);
  });
});
