import { Box, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { DarkHeading, IconTile, Section } from "../parts";
import { VALUE_PROPS } from "../content";
import { RAIL_GUTTER } from "./TrialRailRegion";

/**
 * The dark band, and the start of the sticky rail.
 *
 * The value prop items carry no card background, no fill and no shadow. They are an
 * outlined tile, a title and a paragraph on the dark ground, which is what the course
 * landing template does here.
 *
 * The trial card is not rendered here. It is positioned over this section and the
 * modules section together by TrialRailRegion, so it can travel past both. All this
 * section does is leave RAIL_GUTTER clear on the right from lg up.
 */
export function WhySubscribe() {
  return (
    <Section bg={GL.dark} py={{ xs: 6, md: 9 }}>
      <Box sx={{ pr: { lg: `${RAIL_GUTTER}px` } }}>
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
      </Box>
    </Section>
  );
}

export default WhySubscribe;
