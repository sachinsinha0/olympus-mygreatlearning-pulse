import { Box, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { Lede, Section, SectionHeading } from "../parts";
import { AI_LABS, INTRO_PITCH } from "../content";

/**
 * The product's three slide onboarding pitch, told on one band.
 *
 * A lead never sees the intro carousel at /pulse/intro, so its story lives here in
 * the same order and the same words: what Pulse is, how often it lands, what is
 * inside. This section absorbed the old labs wall, which was beat three of that
 * story standing alone.
 *
 * The three beats deliberately take three layouts: a centred statement, then text
 * with the slide's own stat cards beside it, then the centred wall. One repeated
 * layout would read as a template, and the carousel itself changes composition per
 * slide.
 */

/** The stat card from the slide: caption above, number and unit on one baseline. */
function StatCard({ caption, number, unit }: { caption: string; number: string; unit: string }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: GL.body,
        }}
      >
        {caption}
      </Typography>
      <Stack direction="row" alignItems="baseline" gap={1} sx={{ mt: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: 40, md: 52 },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-2px",
            color: GL.heading,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {number}
        </Typography>
        <Typography sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 600, color: GL.heading }}>
          {unit}
        </Typography>
      </Stack>
    </Box>
  );
}

export function IntroPitchSection() {
  return (
    <Section bg={GL.pale}>
      {/* Beat one: what Pulse is. */}
      <SectionHeading align="center">{INTRO_PITCH.welcome.title}</SectionHeading>
      <Box sx={{ mt: 2 }}>
        <Lede align="center">{INTRO_PITCH.welcome.body}</Lede>
      </Box>

      {/* Beat two: the cadence, with the slide's own numbers beside it. */}
      <Box
        sx={{
          mt: { xs: 6, md: 9 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
          gap: { xs: 4, md: 8 },
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 22, md: 26 },
              fontWeight: 600,
              lineHeight: 1.3,
              color: GL.heading,
              maxWidth: 560,
            }}
          >
            {INTRO_PITCH.release.title}
          </Typography>
          <Typography sx={{ mt: 1.5, fontSize: 16, lineHeight: 1.6, color: GL.body, maxWidth: 540 }}>
            {INTRO_PITCH.release.body}
          </Typography>
        </Box>
        <Stack direction="row" gap={{ xs: 5, md: 7 }}>
          {INTRO_PITCH.release.stats.map((s) => (
            <StatCard key={s.caption} {...s} />
          ))}
        </Stack>
      </Box>

      {/* Beat three: what is inside, the labs wall. */}
      <Box sx={{ mt: { xs: 7, md: 10 } }}>
        <SectionHeading align="center">{INTRO_PITCH.inside.title}</SectionHeading>
        <Box sx={{ mt: 2 }}>
          <Lede align="center">{INTRO_PITCH.inside.body}</Lede>
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
      </Box>
    </Section>
  );
}

export default IntroPitchSection;
