import { Box, Typography } from "@mui/material";
import { Star } from "lucide-react";
import { GL } from "../landingTheme";
import { Section, SectionHeading } from "../parts";
import { RATINGS } from "../content";

/**
 * Great Learning's review scores, each beside its review site's logo, the way the
 * live pages set them. The box keeps its aria label because the logos are pictures
 * of words: a screen reader hears the score and the site once, and the image adds
 * nothing it needs to repeat.
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
            // The star is the only thing signalling that this number is a rating, and
            // an unlabelled icon says nothing. The box carries the sentence instead.
            aria-label={`Rated ${rating.score} out of 5 on ${rating.site}`}
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
            <Box aria-hidden sx={{ display: "flex" }}>
              <Star size={16} fill={GL.gold} color={GL.gold} />
            </Box>
            <Box
              component="img"
              src={rating.logo}
              alt=""
              aria-hidden
              loading="lazy"
              sx={{ height: 22, width: "auto", display: "block" }}
            />
          </Box>
        ))}
      </Box>
    </Section>
  );
}

export default RatingsRow;
