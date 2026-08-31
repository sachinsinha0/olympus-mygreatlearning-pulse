/**
 * How long the AI Pulse free trial runs.
 *
 * This number used to be written out as `30` in five separate files, which is how the
 * product and the emails drifted apart. Everything that needs the trial length reads it
 * from here now: the landing page, the /pulse hero, the consume page, and pricing.tsx.
 */
export const TRIAL_DAYS = 14;

/** The ISO date a trial started on `startISO` runs out. */
export function trialEndsOn(startISO: string): string {
  const d = new Date(`${startISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + TRIAL_DAYS);
  return d.toISOString().slice(0, 10);
}
