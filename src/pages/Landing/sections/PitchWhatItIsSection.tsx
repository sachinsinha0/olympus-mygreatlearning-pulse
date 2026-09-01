import { Box, Typography } from "@mui/material";
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
export function PitchWhatItIsSection() {
  const { kicker, title, body } = INTRO_PITCH.welcome;

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
            sx={{
              fontSize: { xs: 26, md: 34 },
              fontWeight: 600,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              color: "#A8C4EE",
            }}
          >
            {kicker}
          </Typography>
          <Typography
            component="h2"
            sx={{
              mt: 0.5,
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

        {/* The labs, given their own air rather than tucked under a paragraph. */}
        <Box
          sx={{
            mt: { xs: 7, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "repeat(10, 1fr)" },
            gap: { xs: 4, md: 3 },
            alignItems: "center",
            justifyItems: "center",
            maxWidth: 960,
            mx: "auto",
          }}
        >
          {AI_LABS.map((lab) => (
            <Box
              key={lab.slug}
              component="img"
              src={`/brand-logos/${lab.slug}.png`}
              alt={lab.label}
              loading="lazy"
              sx={{ width: { xs: 40, md: 46 }, height: { xs: 40, md: 46 }, objectFit: "contain", display: "block" }}
            />
          ))}
        </Box>
      </ContentColumn>
    </Box>
  );
}

export default PitchWhatItIsSection;
