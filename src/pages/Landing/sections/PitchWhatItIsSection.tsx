import { Box, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn, Marquee } from "../parts";
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
 * The labs, scrolling the way /pulse/intro scrolls them: 64 seconds, one direction,
 * each logo carrying its lab's name.
 *
 * At this speed the row travels about 23px per second, so the names stay readable
 * while moving. The mechanics live in Marquee, which the topic rows share.
 */
function LabsMarquee() {
  return (
    <Marquee
      items={AI_LABS}
      keyOf={(lab) => lab.slug}
      duration={64}
      sx={{ mt: { xs: 3.5, md: 4.5 }, maxWidth: 1000, mx: "auto" }}
      renderItem={(lab) => (
        <Box
          sx={{
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
      )}
    />
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
