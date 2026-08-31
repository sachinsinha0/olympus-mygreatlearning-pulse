import { Box, Stack, Typography } from "@mui/material";
import { UserRound } from "lucide-react";
import { GL } from "../landingTheme";
import { ADVISOR_PHONE, ADVISOR_PHONE_HREF } from "../content";

/**
 * The cream advisor strip the course landing template runs under its hero.
 *
 * The colour is full bleed, so the band is a plain Box rather than a Section. The
 * centred row sits inside the shared content column.
 */
export function ExpertBand() {
  return (
    <Box sx={{ backgroundColor: GL.cream, py: 1.5 }}>
      <Box sx={{ maxWidth: GL.maxWidth, mx: "auto", px: { xs: 2.5, md: 4 } }}>
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <Box sx={{ display: "flex", color: GL.body }}>
            <UserRound size={15} />
          </Box>
          <Typography sx={{ fontSize: 14, color: GL.body }}>Speak with our expert</Typography>
          <Box
            component="a"
            href={ADVISOR_PHONE_HREF}
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: GL.heading,
              textDecoration: "underline",
            }}
          >
            {ADVISOR_PHONE}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default ExpertBand;
