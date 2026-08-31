import { PULSE_TODAY } from "./prototypeDate";
import type { PulseIssue } from "./types";

export type LandingModules = {
  /** The modules the accordion lists, oldest first, the way a curriculum reads. */
  modules: PulseIssue[];
  /** The most recently released module, or null when nothing has been released. */
  newest: PulseIssue | null;
  /** How many modules are released in total, which can exceed `modules.length`. */
  total: number;
};

/**
 * The released modules the landing page advertises, in chronological order.
 *
 * The product at /pulse lists modules newest first, because a returning learner wants
 * the fresh one at the top. The landing page is the opposite situation: a lead has
 * never seen any of it, so the list reads as a curriculum and runs oldest to newest,
 * the way the course pages number their weeks upward.
 *
 * Two rules carried over from PulseHome. Classify against PULSE_TODAY rather than the
 * real clock, so the page does not change shape as real time passes. And sort by
 * release date, not issue number, because the issue numbers are not chronological:
 * pulse-11 releases after pulse-12.
 *
 * `limit` trims from the FRONT, so the list keeps the most recent modules and still
 * reads forwards. Trimming from the back would have dropped the newest module, which
 * is the strongest thing on the page. `total` still counts everything released, so the
 * page can say how many exist without listing them all.
 *
 * `newest` is returned separately because the login step drops a new trial user into
 * the freshest module, which is the far end of this list from where it starts.
 */
export function selectLandingModules(
  all: PulseIssue[],
  today: string = PULSE_TODAY,
  limit = 8,
): LandingModules {
  const released = all
    .filter((i) => i.releasedAt <= today)
    .sort((a, b) => a.releasedAt.localeCompare(b.releasedAt));
  return {
    modules: released.slice(Math.max(0, released.length - limit)),
    newest: released.length > 0 ? released[released.length - 1] : null,
    total: released.length,
  };
}
