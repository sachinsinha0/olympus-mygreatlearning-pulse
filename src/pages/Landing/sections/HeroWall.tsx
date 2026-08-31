import { useMemo } from "react";
import { Box, Typography, keyframes } from "@mui/material";
import { GL } from "../landingTheme";
import { AI_LABS } from "../content";
import { selectLandingModules } from "../../../lib/pulse/landingModules";
import { useUnitLabel } from "../../../lib/pulse/terminology";
import type { PulseIssue } from "../../../lib/pulse/types";
import issuesData from "../../../mocks/pulse-issues.json";

/**
 * EXPLORATION VARIANT "wall". View with /ai-pulse?hero=wall
 *
 * Inspired by the tile wall on the AI-Native Professional hero, not copied from it.
 * Three deliberate differences:
 *
 * 1. The tiles mean something. That wall drifts tool logos as decoration. This one
 *    interleaves the labs with the REAL modules from the same mock /pulse reads, so
 *    what drifts past is literally the curriculum and the ecosystem it covers.
 * 2. No box. That panel is a rounded rectangle sitting inside its hero. This wall is
 *    taller than the section and hangs off the right edge, so the section's own
 *    clipping crops it and it reads as a glimpse of something larger.
 * 3. Independent clocks. Three columns at three speeds, the middle one running the
 *    other way, and a column pauses under the pointer so a curious lead can read the
 *    module titles. Flat colours throughout, no gradients, no glow.
 */

const drift = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
`;

type Tile = { kind: "lab"; slug: string; label: string } | { kind: "module"; issue: PulseIssue };

/** Deal the labs and modules into three interleaved columns, lab, module, lab... */
function buildColumns(modules: PulseIssue[]): Tile[][] {
  const labs: Tile[] = AI_LABS.map((l) => ({ kind: "lab", slug: l.slug, label: l.label }));
  const mods: Tile[] = modules.map((issue) => ({ kind: "module", issue }));
  const columns: Tile[][] = [[], [], []];
  const max = Math.max(labs.length, mods.length);
  for (let i = 0; i < max; i++) {
    if (labs[i]) columns[i % 3].push(labs[i]);
    if (mods[i]) columns[(i + 1) % 3].push(mods[i]);
  }
  return columns;
}

const COLUMN_SPEEDS = [46, 62, 54];

export function HeroWall() {
  const unit = useUnitLabel();
  const columns = useMemo(
    () => buildColumns(selectLandingModules(issuesData as PulseIssue[]).modules),
    [],
  );

  return (
    <Box
      aria-hidden
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        gap: 1.75,
        backgroundColor: GL.dark,
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "16px",
        px: 2,
        overflow: "hidden",
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" },
        },
      }}
    >
      {columns.map((tiles, col) => (
        <Box
          key={col}
          sx={{
            flex: 1,
            minWidth: 0,
            // The pointer pauses a column, so the module titles can actually be read.
            pointerEvents: "auto",
            "&:hover > div": { animationPlayState: "paused" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.75,
              animation: `${drift} ${COLUMN_SPEEDS[col]}s linear infinite`,
              animationDirection: col === 1 ? "reverse" : "normal",
              willChange: "transform",
            }}
          >
            {/* The list twice over, the seamless loop trick the intro marquee uses. */}
            {[0, 1].map((half) =>
              tiles.map((tile) => (
                <Box
                  key={`${half}-${tile.kind === "lab" ? tile.slug : tile.issue.id}`}
                  sx={{
                    backgroundColor: "#151C2A",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "12px",
                    px: 1.75,
                    py: tile.kind === "lab" ? 2.25 : 1.75,
                    flexShrink: 0,
                  }}
                >
                  {tile.kind === "lab" ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <Box
                        component="img"
                        src={`/brand-logos/${tile.slug}.png`}
                        alt=""
                        loading="lazy"
                        sx={{ width: 34, height: 34, objectFit: "contain", display: "block" }}
                      />
                      <Typography sx={{ fontSize: 12, color: "rgba(255, 255, 255, 0.72)" }}>
                        {tile.label}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "1.1px",
                          textTransform: "uppercase",
                          color: "#7EA9EE",
                        }}
                      >
                        {unit.numbered(tile.issue.issueNumber)}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 13,
                          fontWeight: 600,
                          lineHeight: 1.35,
                          color: "rgba(255, 255, 255, 0.92)",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tile.issue.title}
                      </Typography>
                      <Typography sx={{ mt: 0.5, fontSize: 11, color: "rgba(255, 255, 255, 0.55)" }}>
                        {tile.issue.learningMinutes + tile.issue.handsOnMinutes} min
                      </Typography>
                    </>
                  )}
                </Box>
              )),
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default HeroWall;
