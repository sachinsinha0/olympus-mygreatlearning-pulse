import { Box, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn } from "../parts";
import { RECOGNITION } from "../content";

/**
 * The reader's problem, named before the page describes itself.
 *
 * This is the beat the page was missing. It opened on our positioning and went
 * straight into three sections explaining the product, so a lead never got the moment
 * where they recognise their own week. Everything after this lands as an answer to a
 * question the reader has now been asked.
 *
 * Composition is two columns of type and nothing else: the statement left, the prose
 * right. No heading and payload, no icons, no cards. Every other section on the page
 * is a heading with something under it, so a spread of plain text reads as a different
 * voice, which is the point. It should feel closer to someone talking than to a panel.
 */
export function RecognitionSection() {
  return (
    <Box component="section" sx={{ bgcolor: "#ffffff", py: { xs: 8, md: 13 } }}>
      <ContentColumn>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            gap: { xs: 3.5, md: 10 },
            alignItems: "start",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 27, md: 38 },
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.8px",
              color: GL.heading,
              maxWidth: 560,
            }}
          >
            {RECOGNITION.title}
          </Typography>

          <Box sx={{ maxWidth: 520, pt: { md: 1 } }}>
            <Typography sx={{ fontSize: 17, lineHeight: 1.7, color: GL.body }}>
              {RECOGNITION.body}
            </Typography>
            <Typography sx={{ mt: 2.5, fontSize: 17, lineHeight: 1.7, color: GL.body }}>
              {RECOGNITION.alternatives}
            </Typography>
          </Box>
        </Box>
      </ContentColumn>
    </Box>
  );
}

export default RecognitionSection;
