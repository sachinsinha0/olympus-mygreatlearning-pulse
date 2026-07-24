import { describe, expect, it } from "vitest";
import {
  getHandsOnItemId,
  getModuleItems,
  reorderHandsOnAfterFirstVideo,
} from "./courseItems";
import type { CourseItem } from "./types";

const v = (id: string, title: string): CourseItem => ({ id, type: "video", title });
const tyu = (id: string, title: string): CourseItem => ({ id, type: "tyu", title });
const overview = (id: string): CourseItem =>
  ({
    id,
    type: "overview",
    title: "Overview",
    moduleLabel: "Module 1",
    moduleTitle: "T",
    summary: "",
    description: "",
    objectives: [],
    topics: [],
    prerequisites: "",
  }) as CourseItem;

describe("reorderHandsOnAfterFirstVideo", () => {
  it("moves the hands-on video to immediately after the first non-hands-on video", () => {
    const items = [
      overview("o"),
      v("v1", "Segment 1"),
      tyu("p1", "Test Your Understanding 1"),
      v("v2", "Segment 2"),
      v("demo", "Hands-on demo"),
      { id: "r1", type: "reading", title: "Discussion" } as CourseItem,
    ];
    const result = reorderHandsOnAfterFirstVideo(items).map((i) => i.id);
    expect(result).toEqual(["o", "v1", "demo", "p1", "v2", "r1"]);
  });

  it("keeps multiple hands-on parts together, in order, after the first video", () => {
    const items = [
      v("v1", "Segment 1"),
      v("v2", "Segment 2"),
      v("h1", "Hands-on Demo Part 1"),
      v("h2", "Hands-on Demo Part 2"),
    ];
    const result = reorderHandsOnAfterFirstVideo(items).map((i) => i.id);
    expect(result).toEqual(["v1", "h1", "h2", "v2"]);
  });

  it("is a no-op when there is no hands-on item", () => {
    const items = [v("v1", "Segment 1"), v("v2", "Segment 2")];
    expect(reorderHandsOnAfterFirstVideo(items).map((i) => i.id)).toEqual(["v1", "v2"]);
  });

  it("is a no-op when there is no non-hands-on video", () => {
    const items = [overview("o"), v("h1", "Hands-on demo")];
    expect(reorderHandsOnAfterFirstVideo(items).map((i) => i.id)).toEqual(["o", "h1"]);
  });
});

describe("getHandsOnItemId", () => {
  it("returns the first hands-on video id for an authored module", () => {
    // pulse-9 => section m2, hands-on parts m2-v5 / m2-v6
    expect(getHandsOnItemId("pulse-9")).toBe("m2-v5");
  });

  it("returns a hands-on item id for every released, overview-only module (synthesis fallback)", () => {
    for (const id of ["pulse-12", "pulse-11", "pulse-8", "pulse-7"]) {
      const handsOnId = getHandsOnItemId(id);
      expect(handsOnId).toBeTruthy();
      const items = getModuleItems(id);
      expect(items.some((i) => i.id === handsOnId)).toBe(true);
    }
  });

  it("returns null for an unknown module", () => {
    expect(getHandsOnItemId("does-not-exist")).toBeNull();
  });
});

describe("getModuleItems ordering", () => {
  it("places the hands-on item right after the first video for authored modules", () => {
    const items = getModuleItems("pulse-9");
    const firstVideoIdx = items.findIndex(
      (i) => i.type === "video" && !/hands[-\s]?on/i.test(i.title),
    );
    const firstHandsOnIdx = items.findIndex(
      (i) => i.type === "video" && /hands[-\s]?on/i.test(i.title),
    );
    expect(firstHandsOnIdx).toBe(firstVideoIdx + 1);
  });
});
