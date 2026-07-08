import { describe, expect, it } from "vitest";
import { feedbackPrompt, upsertFeedback, type FeedbackMap } from "./contentFeedback";

describe("feedbackPrompt", () => {
  it("uses an apologetic prompt for low ratings", () => {
    expect(feedbackPrompt(1)).toMatch(/missed the mark/i);
    expect(feedbackPrompt(2)).toMatch(/missed the mark/i);
  });

  it("uses a neutral prompt for a middling rating", () => {
    expect(feedbackPrompt(3)).toMatch(/what would make this better/i);
  });

  it("uses a positive prompt for high ratings", () => {
    expect(feedbackPrompt(4)).toMatch(/stood out/i);
    expect(feedbackPrompt(5)).toMatch(/stood out/i);
  });
});

describe("upsertFeedback", () => {
  it("adds feedback for a new item without mutating the source map", () => {
    const map: FeedbackMap = {};
    const next = upsertFeedback(map, "m1-v1", { rating: 4 });
    expect(next["m1-v1"]).toEqual({ rating: 4 });
    expect(map).toEqual({});
  });

  it("overwrites existing feedback for the same item", () => {
    const map: FeedbackMap = { "m1-v1": { rating: 2, note: "old" } };
    const next = upsertFeedback(map, "m1-v1", { rating: 5, aspectId: "clarity" });
    expect(next["m1-v1"]).toEqual({ rating: 5, aspectId: "clarity" });
  });

  it("leaves other items untouched", () => {
    const map: FeedbackMap = { "m1-v1": { rating: 3 } };
    const next = upsertFeedback(map, "m1-v2", { rating: 5 });
    expect(next["m1-v1"]).toEqual({ rating: 3 });
    expect(next["m1-v2"]).toEqual({ rating: 5 });
  });
});
