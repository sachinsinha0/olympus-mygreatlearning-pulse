import { Box } from "@mui/material";
import { GL } from "../landingTheme";
import { Lede, Section, SectionHeading } from "../parts";
import { AI_LABS, LABS_SECTION } from "../content";

/**
 * The AI labs the modules cover.
 *
 * The onboarding carousel scrolls this same list past on its third slide. Here it is
 * static: the reference site's logo wall on /enterprise is a plain grid with no cards
 * and no motion, and a scrolling marquee on a landing page is decoration rather than
 * information.
 *
 * Each logo keeps its real name as alt text, so the wall is a readable list rather than
 * ten unlabelled images.
 *
 * On the pale ground rather than white. The dark band that used to sit between the
 * ratings row and the modules is gone, and without a break here the page ran four white
 * sections in a row.
 */
export function LabsSection() {
  return (
    <Section bg={GL.pale}>
      <SectionHeading align="center">{LABS_SECTION.title}</SectionHeading>

      <Box sx={{ mt: 2 }}>
        <Lede align="center">{LABS_SECTION.body}</Lede>
      </Box>

      <Box
        sx={{
          mt: 5,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3, 1fr)",
            sm: "repeat(5, 1fr)",
          },
          gap: { xs: 4, md: 5 },
          alignItems: "center",
          justifyItems: "center",
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {AI_LABS.map((lab) => (
          <Box
            key={lab.slug}
            component="img"
            src={`/brand-logos/${lab.slug}.png`}
            alt={lab.label}
            loading="lazy"
            sx={{ width: 44, height: 44, objectFit: "contain", display: "block" }}
          />
        ))}
      </Box>
    </Section>
  );
}

export default LabsSection;
