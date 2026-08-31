import { Box, keyframes } from "@mui/material";
import { GL } from "../landingTheme";

/**
 * EXPLORATION VARIANT "radar". View with /ai-pulse?hero=radar
 *
 * The metaphor is scanning: Pulse sweeps the frontier so you do not have to. The
 * labs sit still at their stations, a hairline sweep turns once every six seconds,
 * and each lab brightens and lifts exactly as the line passes it. The sweep angle
 * and each chip's tick delay share one clock, so cause and effect stay locked
 * however long the page is open.
 *
 * Unlike the orbit, nothing here travels. The stillness of the chips against the
 * single moving line is the point of comparison.
 */

const SWEEP = 6;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const blip = keyframes`
  0%    { transform: scale(1); opacity: 0.66; }
  4%    { transform: scale(1.12); opacity: 1; }
  30%   { transform: scale(1); opacity: 1; }
  70%   { opacity: 0.66; }
  100%  { transform: scale(1); opacity: 0.66; }
`;

/** Angle 0 points right, positive clockwise, matching the sweep's own convention. */
const STATIONS: { slug: string; angle: number; radius: number; size: number }[] = [
  { slug: "openai", angle: 305, radius: 130, size: 52 },
  { slug: "claude", angle: 20, radius: 235, size: 58 },
  { slug: "googlegemini", angle: 75, radius: 150, size: 48 },
  { slug: "anthropic", angle: 130, radius: 250, size: 44 },
  { slug: "perplexity", angle: 175, radius: 165, size: 46 },
  { slug: "cursor", angle: 225, radius: 260, size: 40 },
  { slug: "huggingface", angle: 262, radius: 190, size: 44 },
  { slug: "githubcopilot", angle: 340, radius: 285, size: 42 },
];

const GUIDE_RINGS = ["30%", "55%", "80%"];

export function HeroRadar() {
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
      {GUIDE_RINGS.map((d) => (
        <Box
          key={d}
          sx={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: d,
            height: d,
            borderRadius: "999px",
            border: "1px solid rgba(25, 106, 229, 0.10)",
          }}
        />
      ))}

      {/* The sweep. A hairline from the centre to the rim, turning on one clock. */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "46%",
          height: "2px",
          transformOrigin: "left center",
          backgroundColor: "rgba(25, 106, 229, 0.35)",
          animation: `${rotate} ${SWEEP}s linear infinite`,
        }}
      />

      {/* The hub. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 14,
          height: 14,
          borderRadius: "999px",
          backgroundColor: GL.blue,
        }}
      />

      {STATIONS.map((s) => (
        <Box
          key={s.slug}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `rotate(${s.angle}deg) translateX(${s.radius}px) rotate(${-s.angle}deg)`,
          }}
        >
          <Box
            sx={{
              width: s.size,
              height: s.size,
              ml: `${-s.size / 2}px`,
              mt: `${-s.size / 2}px`,
              borderRadius: "999px",
              backgroundColor: "#ffffff",
              border: `1px solid ${GL.border}`,
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06), 0 10px 24px rgba(16, 24, 40, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // The tick fires as the sweep line reaches this station's angle.
              animation: `${blip} ${SWEEP}s ease ${(s.angle / 360) * SWEEP}s infinite`,
            }}
          >
            <Box
              component="img"
              src={`/brand-logos/${s.slug}.png`}
              alt=""
              loading="lazy"
              sx={{ width: "56%", height: "56%", objectFit: "contain", display: "block" }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default HeroRadar;
