import { Box, keyframes } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { GL } from "../landingTheme";

/**
 * The hero visual: the AI ecosystem in slow orbit around a beating pulse.
 *
 * This is a 720px system designed to be placed partly OFF the viewport edge, so the
 * arcs sweep through the hero and clip off screen instead of sitting inside a panel.
 * The section that mounts it owns the clipping.
 *
 * ENTRANCE. The load is choreographed as a story rather than popping into existence:
 * the beacon lands first, the rings breathe in from the centre outward, the labs
 * gather one by one along them, and only once the system is assembled does the first
 * pulse fire. Entrances use the Material emphasized curve and a Premium duration
 * band, per the motion-design skill: entrances decelerate, staggers stay inside
 * their budget, and nothing animates on opacity alone.
 *
 * LOOP. Each ring rotates continuously on a slow linear loop (linear is correct
 * here, an orbit is constant angular velocity), neighbouring rings run in opposite
 * directions, and every chip carries a counter rotation of the same period so the
 * logo stays upright while it travels. The slowest ring takes three minutes per
 * revolution: motion this slow reads as atmosphere, not as an effect.
 *
 * THE BEAT. Every 4.8 seconds the beacon contracts and a wavefront leaves it. The
 * chips orbit at fixed radii, so the wave reaches each ring at a constant time no
 * matter where the chips have rotated to, and each lab ticks as the wave passes:
 * inner ring at 0.45s, middle at 0.9s, outer at 1.8s, solved from the wave's ease
 * out curve. The headline says Pulse keeps you in sync, and this is that sentence
 * as motion. Same radius chips tick together because the wavefront hits them
 * together, which also keeps the number of things moving at once inside the motion
 * skill's one third rule.
 *
 * Still inside the design rules: no gradients, no glow, no blur. Everything freezes
 * under prefers-reduced-motion, entrances included.
 */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const counterSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;

/**
 * The wavefront. 28px scaled to 26x is a 740px diameter, so the wave dies just past
 * the outer orbit. It expands over 60% of the beat and rests for the remainder, on
 * an ease out, the way a ripple loses energy.
 */
const waveFront = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.45; }
  40%  { opacity: 0.2; }
  60%  { transform: translate(-50%, -50%) scale(26); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(26); opacity: 0; }
`;

/** The heart contracts as the wave leaves. Anticipation, then release. */
const beaconBeat = keyframes`
  0%   { transform: scale(1); }
  3%   { transform: scale(1.4); }
  9%   { transform: scale(1); }
  100% { transform: scale(1); }
`;

/** One lab acknowledging the wave as it passes. A short lift, then settle. */
const chipTick = keyframes`
  0%    { transform: scale(1); }
  4.5%  { transform: scale(1.09); }
  12%   { transform: scale(1); }
  100%  { transform: scale(1); }
`;

/** Material Design 3 emphasized decelerate. The skill's entrance curve. */
const ENTER = [0.05, 0.7, 0.1, 1] as const;

type OrbitChip = { slug: string; label: string; angle: number; size: number };

type Ring = {
  diameter: number;
  /** Seconds per full revolution. */
  duration: number;
  reverse?: boolean;
  borderColor: string;
  chips: OrbitChip[];
};

/**
 * Hand tuned. Angles are spread so no two chips ever cluster as the rings rotate
 * against each other, and sizes fall with distance for depth.
 */
const RINGS: Ring[] = [
  {
    diameter: 300,
    duration: 90,
    borderColor: "rgba(25, 106, 229, 0.18)",
    chips: [
      { slug: "claude", label: "Claude", angle: 15, size: 64 },
      { slug: "openai", label: "OpenAI", angle: 195, size: 60 },
    ],
  },
  {
    diameter: 500,
    duration: 140,
    reverse: true,
    borderColor: "rgba(25, 106, 229, 0.12)",
    chips: [
      { slug: "googlegemini", label: "Gemini", angle: 80, size: 54 },
      { slug: "anthropic", label: "Anthropic", angle: 210, size: 46 },
      { slug: "perplexity", label: "Perplexity", angle: 330, size: 50 },
    ],
  },
  {
    diameter: 700,
    duration: 190,
    borderColor: "rgba(25, 106, 229, 0.08)",
    chips: [
      { slug: "cursor", label: "Cursor", angle: 45, size: 42 },
      { slug: "huggingface", label: "Hugging Face", angle: 160, size: 46 },
      { slug: "githubcopilot", label: "GitHub Copilot", angle: 285, size: 44 },
    ],
  },
];

/**
 * The entrance timeline, in seconds. Beacon, then rings inner to outer, then chips
 * in reading order, then the first pulse beat once everything has landed. The chip
 * stagger is 60ms, inside the skill's dramatic budget for a hero.
 */
const T = {
  beacon: 0.15,
  ring: (i: number) => 0.25 + i * 0.13,
  chip: (n: number) => 0.55 + n * 0.06,
};

/** Seconds per heartbeat. Calm, per the motion skill's emotion mapping. */
const BEAT = 4.8;
/** The first beat fires one breath after the entrance has assembled the system. */
const BEAT_START = 1.6;
/**
 * When the wavefront crosses each orbit, solved from the wave's easeOutCubic curve
 * against the ring radii of 150, 250 and 350 in the 720 system. Fixed radii mean
 * fixed arrival times, however far the ring has rotated.
 */
const WAVE_ARRIVAL = [0.45, 0.9, 1.8];

export function HeroOrbit() {
  const reduce = useReducedMotion();
  // One global index per chip so the stagger runs across rings, not per ring.
  let chipIndex = 0;

  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" },
        },
      }}
    >
      {RINGS.map((ring, ringIdx) => (
        <motion.div
          key={ring.diameter}
          initial={reduce ? false : { opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: T.ring(ringIdx), ease: ENTER }}
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: ring.diameter,
            height: ring.diameter,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "999px",
              border: `1px solid ${ring.borderColor}`,
              animation: `${spin} ${ring.duration}s linear infinite`,
              animationDirection: ring.reverse ? "reverse" : "normal",
              willChange: "transform",
            }}
          >
            {ring.chips.map((chip) => {
              const n = chipIndex++;
              return (
                // The arm swings the chip out to the ring's edge. The two wrappers
                // under it cancel the arm's angle and the ring's rotation, so the
                // logo stays upright while it travels.
                <Box
                  key={chip.slug}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${chip.angle}deg) translateX(${ring.diameter / 2}px)`,
                  }}
                >
                  <Box sx={{ transform: `rotate(${-chip.angle}deg)` }}>
                    <Box
                      sx={{
                        animation: `${counterSpin} ${ring.duration}s linear infinite`,
                        animationDirection: ring.reverse ? "reverse" : "normal",
                      }}
                    >
                      {/* The tick lives on its own wrapper. The framer element below
                          owns its transform for entrance and hover, and the counter
                          spin above owns another, so the beat needs a layer of its
                          own. Delay is the beat start plus this ring's wave arrival,
                          so the chip lifts exactly as the wavefront passes. */}
                      <Box
                        sx={{
                          animation: `${chipTick} ${BEAT}s ease ${BEAT_START + WAVE_ARRIVAL[ringIdx]}s infinite`,
                        }}
                      >
                      <motion.div
                        title={chip.label}
                        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={reduce ? undefined : { scale: 1.07 }}
                        transition={{
                          duration: 0.38,
                          delay: T.chip(n),
                          ease: ENTER,
                          scale: { duration: 0.38, delay: T.chip(n), ease: ENTER },
                        }}
                        style={{
                          width: chip.size,
                          height: chip.size,
                          marginLeft: -chip.size / 2,
                          marginTop: -chip.size / 2,
                          borderRadius: 999,
                          backgroundColor: "#ffffff",
                          border: `1px solid ${GL.border}`,
                          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06), 0 12px 28px rgba(16, 24, 40, 0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // The one interactive element in the system: hover feedback
                          // on the chip itself, nothing else catches the pointer.
                          pointerEvents: "auto",
                          cursor: "default",
                        }}
                      >
                        <Box
                          component="img"
                          src={`/brand-logos/${chip.slug}.png`}
                          alt=""
                          loading="lazy"
                          sx={{ width: "56%", height: "56%", objectFit: "contain", display: "block" }}
                        />
                      </motion.div>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </motion.div>
      ))}

      {/* The heart of the system. The framer wrapper lands it during the entrance,
          and the inner element carries the infinite beat, because the two cannot
          share one transform. It contracts at the top of every cycle, exactly as
          the wavefront leaves. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, delay: T.beacon, ease: ENTER }}
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 16,
          height: 16,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "999px",
            backgroundColor: GL.blue,
            animation: `${beaconBeat} ${BEAT}s ease ${BEAT_START}s infinite`,
          }}
        />
      </motion.div>

      {/* The wavefront, and a faint echo a beat's breath behind it. */}
      {[
        { opacity: 0.5, offset: 0 },
        { opacity: 0.18, offset: 0.18 },
      ].map((wave) => (
        <Box
          key={wave.offset}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 28,
            height: 28,
            borderRadius: "999px",
            border: `1.5px solid ${GL.blue}`,
            transform: "translate(-50%, -50%)",
            opacity: 0,
            animation: `${waveFront} ${BEAT}s cubic-bezier(0.33, 1, 0.68, 1) ${BEAT_START + wave.offset}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}

export default HeroOrbit;
