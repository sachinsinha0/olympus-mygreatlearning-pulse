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

const pulseRing = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  70%  { opacity: 0.08; }
  100% { transform: translate(-50%, -50%) scale(11); opacity: 0; }
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
  /** CSS delay before the first beat of each infinite pulse ring. */
  pulse: [1.5, 3.3],
};

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
              );
            })}
          </Box>
        </motion.div>
      ))}

      {/* The pulse at the centre of the system. The beacon lands first, and the
          first beat waits until the ecosystem has assembled around it. */}
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
          borderRadius: 999,
          backgroundColor: GL.blue,
        }}
      />
      {T.pulse.map((delay) => (
        <Box
          key={delay}
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
            animation: `${pulseRing} 3.6s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}

export default HeroOrbit;
