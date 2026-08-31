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
    const { modules } = selectLandingModules(all, "2026-06-05");
    expect(modules.map((i) => i.id)).not.toContain("future");
  });

  it("includes a module released exactly today", () => {
    const { modules } = selectLandingModules(all, "2026-06-05");
    expect(modules.map((i) => i.id)).toContain("today");
  });

  it("runs in chronological order, oldest first", () => {
    const { modules } = selectLandingModules(all, "2026-06-05");
    expect(modules.map((i) => i.id)).toEqual(["oldest", "older", "today"]);
  });

  it("names the most recently released module, not the first in the list", () => {
    expect(selectLandingModules(all, "2026-06-05").newest?.id).toBe("today");
  });

  it("counts every released module", () => {
    expect(selectLandingModules(all, "2026-06-05").total).toBe(3);
  });

  it("has no newest when nothing has been released yet", () => {
    const result = selectLandingModules(all, "2020-01-01");
    expect(result.modules).toEqual([]);
    expect(result.newest).toBeNull();
    expect(result.total).toBe(0);
  });

  it("does not mutate the array it is given", () => {
    const input = [...all];
    selectLandingModules(input, "2026-06-05");
    expect(input.map((i) => i.id)).toEqual(["future", "today", "older", "oldest"]);
  });
});
