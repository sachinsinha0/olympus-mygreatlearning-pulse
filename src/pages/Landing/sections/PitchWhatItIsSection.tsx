import { Box, Typography, keyframes } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn } from "../parts";
import { AI_LABS, INTRO_PITCH } from "../content";

/**
 * Beat one of the product's onboarding pitch: what AI Pulse is.
 *
 * The carousel at /pulse/intro opens on this slide, and a lead never sees it, so it
 * lives here in the slide's own words with the slide's own payload, the ten AI labs.
 *
 * Its own section rather than a third of one. The three pitch beats were crammed
 * into a single band, which left none of them room to be read. This one is the
 * opening statement, so it is centred, set large, and given the carousel's blue
 * wash to itself.
 */
/**
 * The intro carousel's marquee, same keyframes and same 64 second period. The list is
 * rendered twice and travelled to -50%, which is what makes the loop seamless.
 */
const marqueeScroll = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
`;

/**
 * The labs, scrolling the way /pulse/intro scrolls them.
 *
 * Faithful to the product: 64s linear, the doubled list, and the same edge mask so
 * logos fade in and out rather than clipping at a hard edge. The mask is a gradient,
 * which this page permits as a mask and never as paint.
 *
 * Two additions. The row pauses under the pointer, because each logo now carries its
 * lab's name and a reader may want to stop and read one. And it freezes entirely
 * under prefers-reduced-motion.
 *
 * At this speed the row travels about 23px per second, so the names stay readable
 * while moving.
 */
function LabsMarquee() {
  const doubled = [...AI_LABS, ...AI_LABS];

  return (
    <Box
      sx={{
        mt: { xs: 3.5, md: 4.5 },
        maxWidth: 1000,
        mx: "auto",
        overflow: "hidden",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        "&:hover .labs-track": { animationPlayState: "paused" },
        "@media (prefers-reduced-motion: reduce)": {
          "& .labs-track": { animation: "none" },
        },
      }}
    >
      <Box
        className="labs-track"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "max-content",
          animation: `${marqueeScroll} 64s linear infinite`,
          willChange: "transform",
        }}
      >
        {doubled.map((lab, i) => (
          <Box
            key={`${lab.slug}-${i}`}
            sx={{
              flexShrink: 0,
              width: { xs: 104, md: 124 },
              textAlign: "center",
              px: { xs: 1, md: 1.5 },
            }}
          >
            <Box
              component="img"
              src={`/brand-logos/${lab.slug}.png`}
              alt=""
              loading="lazy"
              sx={{
                width: { xs: 38, md: 44 },
                height: { xs: 38, md: 44 },
                objectFit: "contain",
                display: "block",
                mx: "auto",
              }}
            />
            <Typography sx={{ mt: 1.25, fontSize: 12, color: GL.body, lineHeight: 1.35 }}>
              {lab.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function PitchWhatItIsSection() {
  const { title, body, labsLabel } = INTRO_PITCH.welcome;

  return (
    <Box
      component="section"
      sx={{
        // The carousel's wash. A background gradient, which the product banner
        // already establishes as product canon on this page.
        background: "linear-gradient(180deg, #F7F9FD 0%, #EDF1FA 100%)",
        py: { xs: 8, md: 13 },
      }}
    >
      <ContentColumn>
        <Box sx={{ maxWidth: 760, mx: "auto", textAlign: "center" }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 30, md: 42 },
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.9px",
              color: GL.heading,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ mt: 2.5, fontSize: 17, lineHeight: 1.65, color: GL.body }}>
            {body}
          </Typography>
        </Box>

        {/* The labs, announced, named, and scrolling as the carousel scrolls them. */}
        <Typography
          sx={{
            mt: { xs: 7, md: 9 },
            textAlign: "center",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            color: GL.body,
          }}
        >
          {labsLabel}
        </Typography>
        <LabsMarquee />
      </ContentColumn>
    </Box>
  );
}

export default PitchWhatItIsSection;
