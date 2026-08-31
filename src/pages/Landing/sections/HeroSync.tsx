import { Fragment } from "react";
import { Box, keyframes } from "@mui/material";
import { GL } from "../landingTheme";
import { TOPICS } from "../content";

/**
 * EXPLORATION VARIANT "sync". View with /ai-pulse?hero=sync
 *
 * A different family from the other five. No chips, no cards, no orbits: the visual
 * is the headline performed. "AI moves fast" is a stream of the product's own topic
 * vocabulary rushing past in four lanes at four speeds, grey and relentless. "Pulse
 * keeps you in sync" is the one fixed blue line: any term crossing it snaps into
 * full ink for exactly as long as it is inside the Pulse zone, then returns to the
 * stream. The words are the same 18 concepts the onboarding carousel scrolls, so
 * even the noise is product truth.
 *
 * HOW THE SNAP WORKS. Each lane is rendered twice: a grey base stream, and a synced
 * copy in ink and blue sitting above it, clipped to a 120px band around the line
 * with clip-path. Both copies run the same animation with the same duration and
 * delay, so they stay in perfect registration, and only the colour changes at the
 * band's edges. The two copies share identical font metrics for that reason: colour
 * and opacity differ, size and weight must not.
 *
 * The edge fade uses the same maskImage treatment the product's own intro marquee
 * ships in PulseIntroPage. That is the one place a gradient appears in this page's
 * code, as a mask, never as paint, and it is product canon rather than decoration.
 */

const stream = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

/** Where the Pulse line sits, as a fraction of the region width. */
const LINE_AT = 0.32;
/** Half-width of the sync zone, px. */
const ZONE = 60;

type Lane = { topics: string[]; size: number; duration: number; baseOpacity: number };

/**
 * The 18 real topics dealt into four lanes. Speeds and sizes differ per lane so the
 * stream reads as traffic rather than as a formation, and every duration is prime
 * relative to its neighbours so the pattern never visibly repeats.
 */
const LANES: Lane[] = [
  { topics: TOPICS.slice(0, 5), size: 18, duration: 26, baseOpacity: 0.34 },
  { topics: TOPICS.slice(5, 10), size: 25, duration: 17, baseOpacity: 0.4 },
  { topics: TOPICS.slice(10, 14), size: 16, duration: 31, baseOpacity: 0.26 },
  { topics: TOPICS.slice(14, 18), size: 21, duration: 21, baseOpacity: 0.36 },
];

/** One lane's content, twice over for the seamless loop, dot-separated. */
function Track({ lane, synced }: { lane: Lane; synced: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "max-content",
        animation: `${stream} ${lane.duration}s linear infinite`,
        willChange: "transform",
      }}
    >
      {[0, 1].map((half) => (
        <Fragment key={half}>
          {lane.topics.map((topic) => (
            <Fragment key={topic}>
              <Box
                component="span"
                sx={{
                  fontSize: lane.size,
                  fontWeight: 600,
                  letterSpacing: "-0.2px",
                  whiteSpace: "nowrap",
                  color: synced ? GL.blue : GL.heading,
                  opacity: synced ? 1 : lane.baseOpacity,
                }}
              >
                {topic}
              </Box>
              <Box
                component="span"
                aria-hidden
                sx={{
                  fontSize: lane.size,
                  px: 2.25,
                  color: synced ? GL.blue : GL.heading,
                  opacity: synced ? 0.55 : lane.baseOpacity * 0.6,
                }}
              >
                ·
              </Box>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Box>
  );
}

export function HeroSync() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        // The product's own marquee edge treatment, from PulseIntroPage.
        maskImage: "linear-gradient(90deg, transparent 0, black 56px, black 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0, black 56px, black 100%)",
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" },
        },
      }}
    >
      {/* The grey stream: AI moves fast. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4.5,
        }}
      >
        {LANES.map((lane, i) => (
          <Track key={i} lane={lane} synced={false} />
        ))}
      </Box>

      {/* The synced copy, clipped to the band around the line. Identical animation,
          identical metrics, so the registration is exact and only the ink changes. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4.5,
          clipPath: `inset(0 calc(${(1 - LINE_AT) * 100}% - ${ZONE}px) 0 calc(${LINE_AT * 100}% - ${ZONE}px))`,
        }}
      >
        {LANES.map((lane, i) => (
          <Track key={i} lane={lane} synced />
        ))}
      </Box>

      {/* The Pulse line itself, with the beacon at its head. */}
      <Box
        sx={{
          position: "absolute",
          top: "6%",
          bottom: "6%",
          left: `${LINE_AT * 100}%`,
          width: "2px",
          backgroundColor: GL.blue,
          opacity: 0.85,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "6%",
          left: `${LINE_AT * 100}%`,
          transform: "translate(-50%, -50%)",
          width: 10,
          height: 10,
          borderRadius: "999px",
          backgroundColor: GL.blue,
        }}
      />
    </Box>
  );
}

export default HeroSync;
