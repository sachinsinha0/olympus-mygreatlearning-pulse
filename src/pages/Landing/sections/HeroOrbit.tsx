import { Box, keyframes } from "@mui/material";
import { GL } from "../landingTheme";

/**
 * The hero visual: the AI ecosystem in slow orbit around a beating pulse.
 *
 * This is a 720px system designed to be placed partly OFF the viewport edge, so the
 * arcs sweep through the hero and clip off screen instead of sitting inside a panel.
 * The section that mounts it owns the clipping.
 *
 * The motion is real orbit, not bobbing. Each ring rotates continuously on a slow
 * linear loop, neighbouring rings run in opposite directions, and every chip carries a
 * counter rotation of the same duration so the logo stays upright while it travels.
 * The slowest ring takes three minutes per revolution. Motion this slow reads as
 * atmosphere rather than as an effect asking to be noticed.
 *
 * Still inside the design rules: no gradients, no glow, no blur. The rings are
 * hairlines, the pulse is a fading hairline ring, and everything freezes under
 * prefers-reduced-motion.
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

type OrbitChip = { slug: string; angle: number; size: number };

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
      { slug: "claude", angle: 15, size: 64 },
      { slug: "openai", angle: 195, size: 60 },
    ],
  },
  {
    diameter: 500,
    duration: 140,
    reverse: true,
    borderColor: "rgba(25, 106, 229, 0.12)",
    chips: [
      { slug: "googlegemini", angle: 80, size: 54 },
      { slug: "anthropic", angle: 210, size: 46 },
      { slug: "perplexity", angle: 330, size: 50 },
    ],
  },
  {
    diameter: 700,
    duration: 190,
    borderColor: "rgba(25, 106, 229, 0.08)",
    chips: [
      { slug: "cursor", angle: 45, size: 42 },
      { slug: "huggingface", angle: 160, size: 46 },
      { slug: "githubcopilot", angle: 285, size: 44 },
    ],
  },
];

export function HeroOrbit() {
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
      {RINGS.map((ring) => (
        <Box
          key={ring.diameter}
          sx={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: ring.diameter,
            height: ring.diameter,
            borderRadius: "999px",
            border: `1px solid ${ring.borderColor}`,
            animation: `${spin} ${ring.duration}s linear infinite`,
            animationDirection: ring.reverse ? "reverse" : "normal",
          }}
        >
          {ring.chips.map((chip) => (
            // The arm swings the chip out to the ring's edge. The two wrappers under it
            // cancel the arm's angle and the ring's rotation, so the logo stays upright
            // while it travels.
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
                  <Box
                    sx={{
                      width: chip.size,
                      height: chip.size,
                      ml: `${-chip.size / 2}px`,
                      mt: `${-chip.size / 2}px`,
                      borderRadius: "999px",
                      backgroundColor: "#ffffff",
                      border: `1px solid ${GL.border}`,
                      boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06), 0 12px 28px rgba(16, 24, 40, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={`/brand-logos/${chip.slug}.png`}
                      alt=""
                      loading="lazy"
                      sx={{ width: "56%", height: "56%", objectFit: "contain", display: "block" }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ))}

      {/* The pulse at the centre of the system. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 16,
          height: 16,
          borderRadius: "999px",
          backgroundColor: GL.blue,
        }}
      />
      {[0, 1.8].map((delay) => (
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
            animation: `${pulseRing} 3.6s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}

export default HeroOrbit;
