import { Box, Divider, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { Section } from "../parts";
import { ADVISOR_PHONE, FOOTER_COLUMNS } from "../content";

/**
 * The dark footer.
 *
 * The wordmark is set as text rather than src/assets/gl-logo.svg. That file is a dark
 * blue wordmark with no light variant, so it would not read on this background.
 *
 * None of the links go anywhere in a prototype, so they are plain text with a default
 * cursor rather than anchors that dead-end.
 */
export function LandingFooter() {
  return (
    <Section bg={GL.dark} py={{ xs: 6, md: 7 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#ffffff" }}>
        Great Learning
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 4,
          mt: 4,
        }}
      >
        {FOOTER_COLUMNS.map((column) => (
          <Box key={column.heading}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#ffffff" }}>
              {column.heading}
            </Typography>
            {column.links.map((link) => (
              <Typography
                key={link}
                sx={{ fontSize: 14, color: GL.darkBody, lineHeight: 2, cursor: "default" }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: GL.darkBorder, mt: 5 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={1}
        // The extra bottom padding keeps the fixed CTA bar clear of the copyright line
        // at the very end of the page. Section only exposes a symmetric py, so it is
        // set on the last row rather than on the band.
        sx={{ mt: 3, pb: { xs: 10, sm: 11 } }}
      >
        <Typography sx={{ fontSize: 13, color: GL.darkBody }}>
          © 2026 Great Learning. All rights reserved.
        </Typography>
        <Typography sx={{ fontSize: 13, color: GL.darkBody }}>
          {`hello@mygreatlearning.com · ${ADVISOR_PHONE}`}
        </Typography>
      </Stack>
    </Section>
  );
}

export default LandingFooter;
