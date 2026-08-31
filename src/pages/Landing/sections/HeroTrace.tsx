import { Box, keyframes } from "@mui/material";
import { GL } from "../landingTheme";

/**
 * EXPLORATION VARIANT "trace". View with /ai-pulse?hero=trace
 *
 * The most literal reading of the name: a pulse trace, the kind a monitor draws.
 * A bright head travels the line on a loop, and the labs sitting on the flat
 * stretches tick as the trace passes through them. The metaphor is monitoring:
 * Pulse watches the signal so you do not have to.
 *
 * The head is the classic stroke dash trick. The path carries pathLength 100, the
 * dash is a 10 unit head against a 90 unit gap, and animating the offset walks the
 * head along the line. Chip tick delays are the head's arrival at each chip's
 * position along the path, so cause precedes effect the way it does in the orbit's
 * wavefront.
 */

const PERIOD = 4.5;

const travel = keyframes`
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
`;

const chipTick = keyframes`
  0%    { transform: scale(1); }
  4%    { transform: scale(1.1); }
  11%   { transform: scale(1); }
  100%  { transform: scale(1); }
`;

/**
 * Two beats across a 560x360 canvas, the spikes offset from centre so the line does
 * not read as symmetric. The chips sit on the flat stretches between them.
 */
const PATH = "M 0 190 H 118 L 140 120 L 162 250 L 184 190 H 330 L 352 110 L 374 255 L 396 190 H 560";

/** Chip x positions, and the fraction of the path the head has covered on arrival. */
const CHIPS: { slug: string; x: number; y: number; size: number; at: number }[] = [
  { slug: "openai", x: 62, y: 190, size: 48, at: 0.1 },
  { slug: "claude", x: 252, y: 190, size: 54, at: 0.42 },
  { slug: "googlegemini", x: 448, y: 190, size: 48, at: 0.77 },
  { slug: "anthropic", x: 528, y: 190, size: 42, at: 0.93 },
];

export function HeroTrace() {
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
      <Box component="svg" viewBox="0 0 560 360" sx={{ width: "100%", height: "100%", display: "block" }}>
        {/* The resting line, always present, faint. */}
        <path d={PATH} fill="none" stroke="rgba(25, 106, 229, 0.16)" strokeWidth="2" />
        {/* The travelling head. */}
        <Box
          component="path"
          d={PATH}
          fill="none"
          stroke={GL.blue}
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={100}
          sx={{
            strokeDasharray: "10 90",
            animation: `${travel} ${PERIOD}s linear infinite`,
          }}
        />
      </Box>

      {CHIPS.map((chip) => (
        <Box
          key={chip.slug}
          sx={{
            position: "absolute",
            // The svg scales to the container, so chip anchors are percentages of the
            // same 560x360 space the path is drawn in.
            left: `${(chip.x / 560) * 100}%`,
            top: `${(chip.y / 360) * 100}%`,
            width: chip.size,
            height: chip.size,
            ml: `${-chip.size / 2}px`,
            mt: `${-chip.size / 2}px`,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "999px",
              backgroundColor: "#ffffff",
              border: `1px solid ${GL.border}`,
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06), 0 10px 24px rgba(16, 24, 40, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: `${chipTick} ${PERIOD}s ease ${chip.at * PERIOD}s infinite`,
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
      ))}
    </Box>
  );
}

export default HeroTrace;
