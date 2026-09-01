import { Box, Stack, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn, EyebrowRule } from "../parts";
import { INTRO_PITCH } from "../content";

/**
 * Beat two of the onboarding pitch: how often a module lands.
 *
 * The slide's own two stat cards carry it, verbatim: one new module every two weeks,
 * twenty six a year. Both numbers had fallen off the landing page entirely before
 * the pitch was brought over.
 *
 * Split composition, text left and the numbers right, so this reads differently from
 * the centred statement above it and the mirrored beat below.
 *
 * The numbers are solid blue where the slide sets them in a gradient, because
 * gradient text is one of the things this page rules out.
 */

function StatCard({ caption, number, unit }: { caption: string; number: string; unit: string }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        backgroundColor: "#ffffff",
        border: `1px solid ${GL.border}`,
        borderRadius: "16px",
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px rgba(16, 24, 40, 0.08)",
        px: { xs: 3, md: 3.5 },
        py: { xs: 3, md: 4 },
      }}
    >
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
      <Stack direction="row" alignItems="baseline" gap={1} sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontSize: { xs: 48, md: 62 },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-2.5px",
            color: GL.blue,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {number}
        </Typography>
        <Typography sx={{ fontSize: { xs: 17, md: 19 }, fontWeight: 600, color: GL.heading }}>
          {unit}
        </Typography>
      </Stack>
    </Box>
  );
}

export function PitchCadenceSection() {
  const { label, title, body, vetting, stats } = INTRO_PITCH.release;

  return (
    <Box component="section" sx={{ bgcolor: "#ffffff", py: { xs: 8, md: 13 } }}>
      <ContentColumn>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 5, md: 10 },
            alignItems: "center",
          }}
        >
          <Box>
            <EyebrowRule label={label} />
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 24, md: 31 },
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: "-0.6px",
                color: GL.heading,
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ mt: 2, fontSize: 16, lineHeight: 1.65, color: GL.body, maxWidth: 520 }}>
              {body}
            </Typography>

            {/* The vetting promise, set apart by a hairline rather than a box. It is
                the page's only concession, so it should read as an aside someone
                added, not as another marketing claim in a container. */}
            <Box sx={{ mt: 3.5, pt: 3, borderTop: `1px solid ${GL.border}`, maxWidth: 520 }}>
              <Typography sx={{ fontSize: 15.5, lineHeight: 1.65, color: GL.heading }}>
                {vetting}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" gap={{ xs: 2, md: 3 }}>
            {stats.map((s) => (
              <StatCard key={s.caption} {...s} />
            ))}
          </Stack>
        </Box>
      </ContentColumn>
    </Box>
  );
}

export default PitchCadenceSection;
