import { describe, it, expect } from "vitest";
import { classifyIntent } from "./classifyIntent";

describe("classifyIntent", () => {
  it("maps deadline language to the extension action", () => {
    const i = classifyIntent("I missed the deadline, can I get more time?");
    expect(i.id).toBe("extension");
    expect(i.shape).toBe("action");
  });

  it("maps grading complaints to re-evaluation", () => {
    expect(classifyIntent("I think my project was graded wrong").id).toBe("reeval");
  });

  it("maps solution timing questions to lookup", () => {
    expect(classifyIntent("When will I receive the sample solution?").shape).toBe("lookup");
  });

  it("maps code errors to a mentor reply", () => {
    expect(classifyIntent("My code throws an AccessDenied error").shape).toBe("mentor");
  });

  it("falls back to route for unrecognised text", () => {
    const i = classifyIntent("asdfghjkl qwerty");
    expect(i.shape).toBe("route");
    expect(i.id).toBe("route");
  });

  it("is case-insensitive", () => {
    expect(classifyIntent("EXTEND my DEADLINE").id).toBe("extension");
  });
});
