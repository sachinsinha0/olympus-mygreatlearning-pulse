import { Box, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn, EyebrowRule } from "../parts";
import { INTRO_PITCH, TOPICS } from "../content";

/**
 * Beat three of the onboarding pitch: what is actually inside.
 *
 * The slide scrolls the topic vocabulary past as pills, so the pills are this
 * section's payload. They used to sit under the module accordion, which gave the
 * same list two homes on one page.
 *
 * Mirrored split, payload left and text right, so the pair of split sections does
 * not read as one repeated template. On phones the order swaps back, because a
 * heading should introduce its own payload rather than follow it.
 */
export function PitchInsideSection() {
  const { label, title, body } = INTRO_PITCH.inside;

  return (
    <Box component="section" sx={{ bgcolor: GL.pale, py: { xs: 8, md: 13 } }}>
      <ContentColumn>
        <Box
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
            {TOPICS.map((topic) => (
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
                }}
              >
                {topic}
              </Box>
            ))}
          </Box>

          <Box sx={{ order: { xs: 1, md: 2 } }}>
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
