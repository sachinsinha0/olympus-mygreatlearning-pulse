import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { usePricing } from "../../lib/pulse/pricing";
import { track } from "../../lib/analytics";
import { isExitFromPulse } from "../../lib/pulse/exitIntent";
import { ExitIntentDialog } from "./ExitIntentDialog";

/**
 * Intercepts navigation OUT of the Pulse area (in-app nav-away or browser Back)
 * when the user has not started the trial, and shows a one-per-session
 * capture-only dialog. Renders nothing when idle.
 */
export function ExitIntentGuard({ source }: { source: "onboarding" | "pulse_home" }) {
  const { state, trialStartedAt } = usePricing();
  // Fires on every exit from Pulse until the user actually starts the trial.
  const enabled = state === "trial" && !trialStartedAt;

  const blocker = useBlocker(
    useCallback(
      ({
        currentLocation,
        nextLocation,
      }: {
        currentLocation: { pathname: string };
        nextLocation: { pathname: string };
      }) => enabled && isExitFromPulse(currentLocation.pathname, nextLocation.pathname),
      [enabled],
    ),
  );

  const open = blocker.state === "blocked";

  // Fire the "shown" event once per blocked transition.
  const shownRef = useRef(false);
  useEffect(() => {
    if (open && !shownRef.current) {
      shownRef.current = true;
      track("GL:PulseExitIntent_Shown", { source });
    } else if (!open) {
      shownRef.current = false;
    }
  }, [open, source]);

  // Capture-only: any resolution simply lets the blocked navigation proceed.
  const proceed = useCallback(() => {
    if (blocker.state === "blocked") blocker.proceed();
  }, [blocker]);

  const handleSubmit = (reason: string, note: string) => {
    track("GL:PulseExitIntent_Submitted", { reason, note, source });
    proceed();
  };

  const handleDismiss = () => {
    track("GL:PulseExitIntent_Dismissed", { source });
    proceed();
  };

  if (!open) return null;

  return (
    <ExitIntentDialog
      open={open}
      onSubmit={handleSubmit}
      onSkip={handleDismiss}
      onClose={handleDismiss}
    />
  );
}
