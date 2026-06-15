type MixpanelLike = { track?: (event: string, props?: Record<string, unknown>) => void };

declare global {
  interface Window {
    mixpanel?: MixpanelLike;
  }
}

/**
 * Thin analytics shim for the prototype. Forwards to window.mixpanel.track when
 * the real SDK is present; otherwise logs to the console. Event names mirror the
 * production GL:* convention so this is a drop-in once Mixpanel is wired.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.mixpanel?.track === "function") {
    window.mixpanel.track(event, props);
    return;
  }
  // eslint-disable-next-line no-console
  console.debug("[track]", event, props ?? {});
}
