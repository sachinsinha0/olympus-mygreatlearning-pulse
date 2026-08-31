import { Box, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { DarkHeading, IconTile, Section } from "../parts";
import { VALUE_PROPS } from "../content";
import { TrialRailCard } from "./TrialRailCard";

/**
 * The dark band, and the start of the sticky rail.
 *
 * The value prop items carry no card background, no fill and no shadow. They are an
 * outlined tile, a title and a paragraph on the dark ground, which is what the course
 * landing template does here.
 *
 * The rail card is sticky from lg up and overlaps the boundary into the section below,
 * the way the reference lead form does. Below lg it is not rendered here at all. The
 * modules section renders it once instead, so it never appears twice at the same time.
 */
export function WhySubscribe() {
  return (
    <Section bg={GL.dark} py={{ xs: 6, md: 9 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" },
          gap: { xs: 5, lg: 8 },
        }}
      >
        <Box>
          <DarkHeading>Why should you subscribe to AI Pulse?</DarkHeading>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              columnGap: 5,
              rowGap: 4.5,
              mt: 5,
            }}
          >
            {VALUE_PROPS.map((prop) => (
              <Stack key={prop.title} gap={2}>
                <IconTile Icon={prop.Icon} dark />
                <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#ffffff" }}>
                  {prop.title}
                </Typography>
                <Typography sx={{ fontSize: 15, lineHeight: 1.6, color: GL.darkBody }}>
                  {prop.body}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: { xs: "none", lg: "block" }, position: "sticky", top: 96, alignSelf: "start" }}>
          <TrialRailCard />
        </Box>
      </Box>
    </Section>
  );
}

export default WhySubscribe;
