import { describe, expect, it } from "vitest";
import {
  feedbackAspectQuestion,
  feedbackAspects,
  isOtherAspect,
  upsertFeedback,
  type FeedbackMap,
} from "./contentFeedback";

describe("feedbackAspects", () => {
  it("asks what didn't work for ratings 3 and below (6 options + Other)", () => {
    for (const r of [1, 2, 3]) {
      expect(feedbackAspectQuestion(r)).toBe("What didn't work for you?");
      const opts = feedbackAspects(r);
      expect(opts).toHaveLength(7);
      expect(opts.every((o) => o.id.startsWith("improve-"))).toBe(true);
      expect(opts[opts.length - 1].label).toBe("Other");
    }
  });

  it("asks what worked well for ratings 4 and above (4 options + Other)", () => {
    for (const r of [4, 5]) {
      expect(feedbackAspectQuestion(r)).toBe("What worked well?");
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

  it("flags exactly one Other option in each set", () => {
    expect(isOtherAspect("improve-other")).toBe(true);
    expect(isOtherAspect("liked-other")).toBe(true);
    expect(isOtherAspect("improve-too-basic")).toBe(false);
    expect(feedbackAspects(2).filter((o) => isOtherAspect(o.id))).toHaveLength(1);
    expect(feedbackAspects(5).filter((o) => isOtherAspect(o.id))).toHaveLength(1);
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
    const next = upsertFeedback(map, "m1-v1", { rating: 5, aspectIds: ["liked-relevant"] });
    expect(next["m1-v1"]).toEqual({ rating: 5, aspectIds: ["liked-relevant"] });
  });

  it("leaves other items untouched", () => {
    const map: FeedbackMap = { "m1-v1": { rating: 3 } };
    const next = upsertFeedback(map, "m1-v2", { rating: 5 });
    expect(next["m1-v1"]).toEqual({ rating: 3 });
    expect(next["m1-v2"]).toEqual({ rating: 5 });
  });
});
