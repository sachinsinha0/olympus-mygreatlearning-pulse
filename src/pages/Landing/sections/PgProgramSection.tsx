import { Box, Button, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";
import { GL } from "../landingTheme";
import { DarkHeading, Section } from "../parts";
import { PG_PROGRAM_URL, PG_SECTION } from "../content";

/**
 * The cross sell to the PG Program.
 *
 * These leads came from the sales team, so the deeper programme belongs on the page.
 * The button is a real outbound link to the live PG Program page, not a route.
 */
export function PgProgramSection() {
  return (
    <Section bg={GL.dark}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: { xs: 4, md: 8 },
          alignItems: "center",
        }}
      >
        <Box>
          <DarkHeading>{PG_SECTION.title}</DarkHeading>
          <Typography
            sx={{ fontSize: 16, lineHeight: 1.65, color: GL.darkBody, mt: 2.5, maxWidth: 560 }}
          >
            {PG_SECTION.body}
          </Typography>
        </Box>

        <Box>
          <Stack gap={2}>
            {PG_SECTION.points.map((point) => (
              <Stack key={point} direction="row" gap={1.5} alignItems="flex-start">
                <Box sx={{ display: "flex", color: GL.blue, flexShrink: 0, mt: "2px" }}>
                  <Check size={18} />
                </Box>
                <Typography sx={{ fontSize: 15, lineHeight: 1.55, color: "#ffffff" }}>
                  {point}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Secondary, not primary. This was solid blue, which made it compete with
              Start Free Trial for the one primary slot on the page. White on the dark
              ground rather than the theme's blue outline, which would not read here. */}
          <Button
            variant="outlined"
            component="a"
            href={PG_PROGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: 4,
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.45)",
              "&:hover": {
                borderColor: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            {PG_SECTION.cta}
          </Button>
        </Box>
      </Box>
    </Section>
  );
}

export default PgProgramSection;
