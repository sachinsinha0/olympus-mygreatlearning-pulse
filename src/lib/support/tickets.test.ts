import { describe, it, expect } from "vitest";
import { filterByStatus, statusCounts, STATUS_FILTERS, STATUS_LABELS } from "./tickets";

const tickets = [
  { id: "a", status: "open" as const },
  { id: "b", status: "open" as const },
  { id: "c", status: "closed" as const },
  { id: "d", status: "reopened" as const },
];

describe("filterByStatus", () => {
  it("returns everything for 'all'", () => {
    expect(filterByStatus(tickets, "all")).toHaveLength(4);
  });
  it("filters by a specific status", () => {
    expect(filterByStatus(tickets, "open").map((t) => t.id)).toEqual(["a", "b"]);
    expect(filterByStatus(tickets, "closed").map((t) => t.id)).toEqual(["c"]);
    expect(filterByStatus(tickets, "reopened").map((t) => t.id)).toEqual(["d"]);
  });
  it("returns an empty array when nothing matches", () => {
    expect(filterByStatus([{ id: "x", status: "open" as const }], "reopened")).toEqual([]);
  });
});

describe("statusCounts", () => {
  it("counts each status plus a total", () => {
    expect(statusCounts(tickets)).toEqual({ all: 4, open: 2, closed: 1, reopened: 1 });
  });
  it("zeroes for an empty list", () => {
    expect(statusCounts([])).toEqual({ all: 0, open: 0, closed: 0, reopened: 0 });
  });
});

describe("constants", () => {
  it("orders filters with 'all' first", () => {
    expect(STATUS_FILTERS).toEqual(["all", "open", "closed", "reopened"]);
  });
  it("labels every status", () => {
    expect(STATUS_LABELS).toEqual({ open: "Open", closed: "Closed", reopened: "Reopened" });
  });
});
