import { keyframes } from "@emotion/react";

/**
 * Motion for the payment result page, from the approved payment result pages
 * (gl-payment-page src/utils/motion.ts). Every moving animation is one keyframe
 * interval: CSS applies the timing function per interval, so a mid keyframe
 * would stop dead and restart. Overshoot comes from EASE_BACK, not extra stops.
 * All of it is skipped for people who prefer reduced motion.
 */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
`;

const pop = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;

const ripple = keyframes`
  from { opacity: 0.6; transform: scale(0.9); }
  to { opacity: 0; transform: scale(1.6); }
`;

const draw = keyframes`
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
`;

// Each particle sets --burst-angle. Movement and fade are separate animations so
// the movement stays one continuous ease-out; the fade uses linear segments.
const burstMove = keyframes`
  from { transform: rotate(var(--burst-angle)) translateY(-28px) scale(1); }
  to { transform: rotate(var(--burst-angle)) translateY(-58px) scale(0.3); }
`;

const burstFade = keyframes`
  0% { opacity: 0; }
  15% { opacity: 1; }
  55% { opacity: 1; }
  100% { opacity: 0; }
`;

const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/** Fast start, long soft settle. */
export const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Ease-out that overshoots its end value a little and settles back. */
export const EASE_BACK = "cubic-bezier(0.34, 1.56, 0.64, 1)";

const motionOk = (animation: string) => ({
  "@media (prefers-reduced-motion: no-preference)": { animation },
});

/** Fade and 16px rise. */
export const enterUp = (delayMs = 0) => motionOk(`${fadeUp} 640ms ${EASE_OUT} ${delayMs}ms both`);
/** Scale-in with a small overshoot, for the status mark arriving. */
export const popIn = (delayMs = 0) => motionOk(`${pop} 560ms ${EASE_BACK} ${delayMs}ms both`);
/** One expanding ring that fades out. */
export const rippleOut = (delayMs = 0) => motionOk(`${ripple} 900ms ${EASE_OUT} ${delayMs}ms both`);
/** Draws an SVG stroke. The path needs pathLength={1} and strokeDasharray 1. */
export const drawStroke = (delayMs = 0, durationMs = 420) =>
  motionOk(`${draw} ${durationMs}ms ${EASE_OUT} ${delayMs}ms both`);
/** One outward burst for a particle placed at the centre of its parent. */
export const burstOut = (delayMs = 0) =>
  motionOk(`${burstMove} 760ms ${EASE_OUT} ${delayMs}ms both, ${burstFade} 760ms linear ${delayMs}ms both`);
/** Plain fade-in, for surfaces that should not move. */
export const fadeIn = (delayMs = 0, durationMs = 900) =>
  motionOk(`${fade} ${durationMs}ms ${EASE_OUT} ${delayMs}ms both`);

/**
 * Payment-successful choreography, in ms: the mark pops, the tick draws, a burst
 * and ripples go out as it lands, then the content settles in. The referral
 * panel arrives last so it doesn't compete with the confirmation.
 */
export const SUCCESS_TIMELINE = {
  mark: 80,
  tick: 380,
  burst: 620,
  ripple: 560,
  tint: 200,
  title: 600,
  action: 760,
  details: 700,
  breakdown: 800,
  support: 900,
  aside: 1000,
} as const;
