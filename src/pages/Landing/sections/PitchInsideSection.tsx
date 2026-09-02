import { useRef } from "react";
import { Box, Typography, keyframes } from "@mui/material";
import { useInView, useReducedMotion } from "framer-motion";
import { GL } from "../landingTheme";
import { ContentColumn, EyebrowRule } from "../parts";
import { INTRO_PITCH, TOPIC_ROWS } from "../content";

/**
 * Beat three of the onboarding pitch: what is actually inside.
 *
 * The slide scrolls the topic vocabulary past as pills, so the pills are this
 * section's payload. They used to sit under the module accordion, which gave the
 * same list two homes on one page.
 *
 * The pills sit straight on the grey, not in a panel, and they do not travel. Both
 * were tried: a panel boxed them in, and a marquee is a device for a slide someone
 * watches rather than a page they are reading.
 *
 * What they do instead is light up. A slow wave crosses the cluster, tinting each
 * pill blue for about a second as it passes, which gives the block something to watch
 * without a single word changing position or becoming harder to read. Eighteen still
 * pills on flat grey had nothing happening in them at all.
 *
 * Mirrored split, payload left and text right, so the pair of split sections does
 * not read as one repeated template. On phones the order swaps back, because a
 * heading should introduce its own payload rather than follow it.
 */

/**
 * The wave. Paint only. A pill never changes size, so the cluster holds one fixed
 * shape and a word is never a different size from the word beside it.
 *
 * The word itself turns blue at the crest, not just the pill under it. Tinting only
 * the background made the crest hard to find on a light ground, and the colour is the
 * one thing that carries at a glance.
 *
 * The crest is held across a couple of frames rather than hit at a single instant.
 * A peak with no dwell is a value the pill passes through on its way back down, and
 * the eye never sees the colour it was aiming for.
 *
 * The lit phase is longer than the gap between two pills starting, so at any moment
 * about six of them are somewhere in the tint with one at its peak. That overlap is
 * the point: a band with soft edges reads as a wave passing through, where a single
 * pill switching on and off would read as a blink.
 */
const swell = keyframes`
  0%, 12%, 100% {
    background-color: #ffffff;
    border-color: ${GL.border};
    color: ${GL.heading};
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  }
  4%, 6.5% {
    background-color: #F1F6FE;
    border-color: rgba(25, 106, 229, 0.38);
    color: ${GL.blue};
    box-shadow: 0 6px 18px rgba(25, 106, 229, 0.18);
  }
`;

/** How long the wave takes to cross the whole cluster, and how long it rests after. */
const STEP = 0.16;
const CYCLE = 9;
/** How long the pills wait for the text to land before they start arriving. */
const LEAD = 180;
/** Clear of the entrance, so the two are never running on the same pill. */
const SETTLE = 1.5;

export function PitchInsideSection() {
  const { label, title, body } = INTRO_PITCH.inside;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const topics = TOPIC_ROWS.flat();

  return (
    <Box component="section" sx={{ bgcolor: GL.pale, py: { xs: 8, md: 13 } }}>
      <ContentColumn>
        <Box
          ref={ref}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
            gap: { xs: 5, md: 10 },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              order: { xs: 2, md: 1 },
              display: "flex",
              flexWrap: "wrap",
              gap: 1.25,
            }}
          >
            {topics.map((topic, i) => (
              <Box
                key={topic}
                component="span"
                sx={{
                  backgroundColor: "#ffffff",
                  border: `1px solid ${GL.border}`,
                  borderRadius: "999px",
                  px: 2,
                  py: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: GL.heading,
                  whiteSpace: "nowrap",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                  // They arrive in reading order as the section comes up, then the
                  // wave takes over on the same order, so the two read as one gesture.
                  // A rise and a fade, no scale: a pill is never a size other than
                  // its own, on the way in or once the wave reaches it.
                  opacity: reduce || inView ? 1 : 0,
                  transform: reduce || inView ? "none" : "translateY(10px)",
                  transition: reduce
                    ? "none"
                    : `opacity 420ms cubic-bezier(0.05, 0.7, 0.1, 1) ${LEAD + i * 25}ms,
                       transform 420ms cubic-bezier(0.05, 0.7, 0.1, 1) ${LEAD + i * 25}ms`,
                  animation:
                    inView && !reduce
                      ? `${swell} ${CYCLE}s linear ${SETTLE + i * STEP}s infinite`
                      : "none",
                }}
              >
                {topic}
              </Box>
            ))}
          </Box>

          {/* The text lands first and the pills follow, so the section introduces
              itself before its payload rather than everything arriving at once. */}
          <Box
            sx={{
              order: { xs: 1, md: 2 },
              opacity: reduce || inView ? 1 : 0,
              transform: reduce || inView ? "none" : "translateY(14px)",
              transition: reduce
                ? "none"
                : `opacity 520ms cubic-bezier(0.05, 0.7, 0.1, 1),
                   transform 520ms cubic-bezier(0.05, 0.7, 0.1, 1)`,
            }}
          >
            <EyebrowRule label={label} />
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 24, md: 31 },
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: "-0.6px",
                color: GL.heading,
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ mt: 2, fontSize: 16, lineHeight: 1.65, color: GL.body }}>
              {body}
            </Typography>
          </Box>
        </Box>
      </ContentColumn>
    </Box>
  );
}

export default PitchInsideSection;
