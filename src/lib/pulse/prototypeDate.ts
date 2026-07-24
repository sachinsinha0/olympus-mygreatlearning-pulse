/**
 * Fixed "today" for the prototype.
 *
 * This is a design prototype, not production — module content must stay stable
 * regardless of the real calendar date. Classifying modules with `new Date()`
 * meant that as real time passed, every module's release date fell into the past
 * and the "Upcoming Modules" section silently emptied out.
 *
 * All module released/upcoming classification uses this fixed date instead of the
 * real clock, so the released + upcoming split never decays. Adjust this single
 * value to reshape which modules are featured vs. upcoming.
 *
 * (Trial/subscription countdowns in `pricing.tsx` intentionally still use the real
 * clock — those track the user's own interactive trial, not fixed content.)
 */
export const PULSE_TODAY = "2026-06-05";
