import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GL } from "../landingTheme";
import { selectLandingModules } from "../../../lib/pulse/landingModules";
import { useUnitLabel } from "../../../lib/pulse/terminology";
import type { PulseIssue } from "../../../lib/pulse/types";
import issuesData from "../../../mocks/pulse-issues.json";

/**
 * EXPLORATION VARIANT "feed". View with /ai-pulse?hero=feed
 *
 * The metaphor is the cadence itself: real modules keep landing. Every few seconds a
 * new release drops in at the top with spring physics, the feed shifts down, and the
 * oldest slips away. The cards are the real product modules from the same mock file
 * /pulse reads, so the motion is literally the curriculum arriving.
 *
 * The loop cycles through the released modules. In production the interval stands in
 * for two weeks.
 */

const VISIBLE = 4;
const INTERVAL_MS = 3000;

export function HeroFeed() {
  const reduce = useReducedMotion();
  const unit = useUnitLabel();
  // Chronological, so arrivals run 01, 02, 03 and the feed reads as the curriculum
  // building. The newest card sits on top, the ones below are what came before it.
  const modules = useMemo(() => selectLandingModules(issuesData as PulseIssue[]).modules, []);
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setHead((h) => (h + 1) % modules.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduce, modules.length]);

  const visible = Array.from(
    { length: VISIBLE },
    (_, i) => modules[(head - i + modules.length * 8) % modules.length],
  );

  return (
    <Box aria-hidden sx={{ position: "relative", width: "100%", height: "100%", pointerEvents: "none" }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: "#9AA0A8",
          mb: 1.5,
        }}
      >
        New module every two weeks
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((m, i) => (
            <motion.div
              key={m.id}
              layout
              initial={reduce ? false : { opacity: 0, y: -56, scale: 0.96 }}
              animate={{ opacity: i === VISIBLE - 1 ? 0.45 : 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, transition: { duration: 0.3 } }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                backgroundColor: "#ffffff",
                border: `1px solid ${GL.border}`,
                borderRadius: 8,
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05), 0 8px 20px rgba(16, 24, 40, 0.08)",
                padding: "14px 16px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  color: GL.blue,
                }}
              >
                {unit.numbered(m.issueNumber)}
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: GL.heading,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {m.title}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13, color: GL.body }}>
                {m.handsOnMinutes
                  ? `${m.learningMinutes} min learning · ${m.handsOnMinutes} min hands-on`
                  : `${m.learningMinutes} min learning`}
              </Typography>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default HeroFeed;
