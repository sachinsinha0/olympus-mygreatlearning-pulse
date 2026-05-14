import { useCallback } from "react";
import { usePricing } from "./pricing";

export type PulseCtaAction = "start" | "start-trial" | "subscribe" | "renew";

type PulseCta = {
  label: string;
  action: PulseCtaAction;
  onClick: () => void;
};

export function usePulseCta(courseUrl?: string): PulseCta {
  const { state, trialStartedAt, openPricingModal, startTrial } = usePricing();

  const navigate = useCallback(() => {
    if (courseUrl) window.location.href = courseUrl;
  }, [courseUrl]);

  const onPreTrial = useCallback(() => {
    startTrial();
    navigate();
  }, [startTrial, navigate]);

  // Paid OR trial-already-started → content access
  if (state === "paid" || (state === "trial" && trialStartedAt)) {
    return { label: "Start", action: "start", onClick: navigate };
  }

  // Pre-trial (state=trial, !trialStartedAt) → Start Trial nudge
  if (state === "trial") {
    return { label: "Start 30-day trial", action: "start-trial", onClick: onPreTrial };
  }

  // Expired → renew
  return { label: "Renew · from $100/mo", action: "renew", onClick: openPricingModal };
}
