import { Box, Typography } from "@mui/material";
import { Star } from "lucide-react";
import { GL } from "../landingTheme";
import { Section, SectionHeading } from "../parts";
import { RATINGS } from "../content";

/**
 * Great Learning's review scores.
 *
 * The live pages set each score beside the review site's logo. We do not ship those
 * logos as local assets, so each box carries the score, one gold star and the site
 * name as text.
 */
export function RatingsRow() {
  return (
    <Section py={{ xs: 4, md: 6 }}>
      <SectionHeading align="center">Delivered by Great Learning</SectionHeading>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
        }}
      >
        {RATINGS.map((rating) => (
          <Box
            key={rating.site}
            sx={{
              border: `1px solid ${GL.border}`,
              borderRadius: "8px",
              padding: "14px 22px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: GL.heading }}>
              {rating.score}
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Star size={16} fill={GL.gold} color={GL.gold} />
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: GL.body }}>
              {rating.site}
            </Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}

export default RatingsRow;
