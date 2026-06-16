export type ExitIntentReason = { id: string; label: string };

export const EXIT_INTENT_REASONS: ExitIntentReason[] = [
  { id: "not-sure", label: "I don't understand what AI Pulse offers" },
  { id: "no-time", label: "I don't have time right now" },
  { id: "cost", label: "Worried about cost / being charged" },
  { id: "not-relevant", label: "It isn't relevant to my role or goals" },
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
