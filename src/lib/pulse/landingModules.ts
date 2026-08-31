import { PULSE_TODAY } from "./prototypeDate";
import type { PulseIssue } from "./types";

export type LandingModules = {
  /** Shown when the accordion first renders. */
  visible: PulseIssue[];
  /** Revealed by "View all modules". */
  hidden: PulseIssue[];
  /** Every released module, visible plus hidden. */
  total: number;
};

/**
 * The released modules the landing page advertises, newest first.
 *
 * Same rule as PulseHome: classify against PULSE_TODAY rather than the real clock, so
 * the page does not change shape as real time passes, and sort by release date rather
 * than issue number, because the issue numbers are not chronological.
 */
export function selectLandingModules(
  all: PulseIssue[],
  today: string = PULSE_TODAY,
  visibleCount = 6,
): LandingModules {
  const released = all
    .filter((i) => i.releasedAt <= today)
    .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
  return {
    visible: released.slice(0, visibleCount),
    hidden: released.slice(visibleCount),
    total: released.length,
  };
}
