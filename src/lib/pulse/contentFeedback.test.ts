import { describe, expect, it } from "vitest";
import { feedbackAspectQuestion, feedbackAspects, upsertFeedback, type FeedbackMap } from "./contentFeedback";

describe("feedbackAspects", () => {
  it("asks what to improve for ratings 3 and below (4 options + Other)", () => {
    for (const r of [1, 2, 3]) {
      expect(feedbackAspectQuestion(r)).toBe("What could be better?");
      const opts = feedbackAspects(r);
      expect(opts).toHaveLength(5);
      expect(opts.every((o) => o.id.startsWith("improve-"))).toBe(true);
      expect(opts[opts.length - 1].label).toBe("Other");
    }
  });

  it("asks what the user liked for ratings 4 and above (4 options + Other)", () => {
    for (const r of [4, 5]) {
      expect(feedbackAspectQuestion(r)).toBe("What did you like?");
      const opts = feedbackAspects(r);
      expect(opts).toHaveLength(5);
      expect(opts.every((o) => o.id.startsWith("liked-"))).toBe(true);
      expect(opts[opts.length - 1].label).toBe("Other");
    }
  });

  it("uses disjoint ids across the two sets so a stale selection can't carry over", () => {
    const improveIds = new Set(feedbackAspects(2).map((o) => o.id));
    const likedIds = feedbackAspects(5).map((o) => o.id);
    expect(likedIds.some((id) => improveIds.has(id))).toBe(false);
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
