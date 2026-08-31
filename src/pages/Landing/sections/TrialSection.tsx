import { Box, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { Section, SectionHeading } from "../parts";
import { TRIAL_FOOTNOTE, TRIAL_STEPS } from "../content";

/**
 * The three steps of the free trial, on the pale band.
 *
 * Large numerals, deliberately not another icon card grid. The page already uses
 * outlined icon tiles in the dark section and blue circled ticks in the accordion.
 * A third icon treatment here would be the repetition the spec bans.
 */
export function TrialSection() {
  return (
    <Section bg={GL.pale}>
      <SectionHeading align="center">How does the free trial work?</SectionHeading>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 5,
          mt: 5,
          maxWidth: 980,
          mx: "auto",
        }}
      >
        {TRIAL_STEPS.map((step, i) => (
          <Stack key={step.title} gap={1.25}>
            <Typography
              aria-hidden
              sx={{ fontSize: 40, fontWeight: 600, lineHeight: 1, color: GL.blue }}
            >
              {String(i + 1).padStart(2, "0")}
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: GL.heading }}>
              {step.title}
            </Typography>
            <Typography sx={{ fontSize: 15, lineHeight: 1.6, color: GL.body }}>
              {step.body}
            </Typography>
          </Stack>
        ))}
      </Box>

      <Typography sx={{ fontSize: 15, color: GL.body, textAlign: "center", mt: 5 }}>
        {TRIAL_FOOTNOTE}
      </Typography>
    </Section>
  );
}

export default TrialSection;
