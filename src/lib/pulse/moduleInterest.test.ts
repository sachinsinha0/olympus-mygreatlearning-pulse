import { describe, expect, it } from "vitest";
import { addInterestId } from "./moduleInterest";

describe("addInterestId", () => {
  it("adds a module that is not yet marked", () => {
    expect(addInterestId([], "pulse-13")).toEqual(["pulse-13"]);
    expect(addInterestId(["pulse-11"], "pulse-13")).toEqual(["pulse-11", "pulse-13"]);
  });

  it("is idempotent — marking twice does not duplicate the id", () => {
    const once = addInterestId([], "pulse-13");
    expect(addInterestId(once, "pulse-13")).toEqual(["pulse-13"]);
  });

  it("returns the same reference when the module is already marked", () => {
    const ids = ["pulse-13"];
    expect(addInterestId(ids, "pulse-13")).toBe(ids);
  });

  it("does not mutate the input list", () => {
    const ids = ["pulse-11"];
    addInterestId(ids, "pulse-13");
    expect(ids).toEqual(["pulse-11"]);
  });
});
