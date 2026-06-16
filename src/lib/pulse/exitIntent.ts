export type ExitIntentReason = { id: string; label: string };

export const EXIT_INTENT_REASONS: ExitIntentReason[] = [
  { id: "not-sure", label: "I don't know what Pulse is" },
  { id: "no-time", label: "I don't have time now" },
  { id: "cost", label: "I think it costs money" },
  { id: "not-relevant", label: "It's not useful for me" },
  { id: "browsing", label: "I'm just looking" },
  { id: "other", label: "Another reason" },
];

const inPulse = (p: string) => p === "/pulse" || p.startsWith("/pulse/");

/**
 * True when navigating OUT of the Pulse area: current path is under /pulse and
 * the destination is not. Navigating within Pulse never counts.
 */
export function isExitFromPulse(currentPath: string, nextPath: string): boolean {
  return inPulse(currentPath) && !inPulse(nextPath);
}
