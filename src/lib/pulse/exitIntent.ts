export type ExitIntentReason = { id: string; label: string };

export const EXIT_INTENT_REASONS: ExitIntentReason[] = [
  { id: "not-sure", label: "Not sure what Pulse is" },
  { id: "no-time", label: "No time right now" },
  { id: "cost", label: "Worried about cost / being charged" },
  { id: "not-relevant", label: "Not relevant to me" },
  { id: "browsing", label: "Just browsing" },
  { id: "other", label: "Other" },
];

const inPulse = (p: string) => p === "/pulse" || p.startsWith("/pulse/");

/**
 * True when navigating OUT of the Pulse area: current path is under /pulse and
 * the destination is not. Navigating within Pulse never counts.
 */
export function isExitFromPulse(currentPath: string, nextPath: string): boolean {
  return inPulse(currentPath) && !inPulse(nextPath);
}
