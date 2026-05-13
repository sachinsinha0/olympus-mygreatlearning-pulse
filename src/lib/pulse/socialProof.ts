import type { PulseIssue } from "./types";
import { daysSince } from "../format";

export const FRESH_DAYS = 7;
export const BUILDING_DAYS = 30;
export const RATING_THRESHOLD = 50;

export type Stage = "fresh" | "building" | "established";

export function stage(issue: PulseIssue, now: Date = new Date()): Stage {
  const age = daysSince(issue.releasedAt, now);
  const { ratingCount, completionCount } = issue.stats;
  if (age < FRESH_DAYS && ratingCount < 10 && completionCount < 25) return "fresh";
  if (age < BUILDING_DAYS || ratingCount < RATING_THRESHOLD) return "building";
  return "established";
}

export function hasDiscussionQuote(issue: PulseIssue): boolean {
  return !!issue.stats.topDiscussionQuote;
}

export function showStars(issue: PulseIssue): boolean {
  return issue.stats.ratingCount >= RATING_THRESHOLD;
}
