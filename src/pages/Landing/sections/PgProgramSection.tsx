import { Box, Button, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";
import { GL } from "../landingTheme";
import { DarkHeading, Section } from "../parts";
import { GL_SITE, PG_PROGRAM_URL, PG_SECTION } from "../content";

/**
 * The cross sell to the PG Program.
 *
 * These leads came from the sales team, so the deeper programme belongs on the page.
 * The button is a real outbound link to the live PG Program page, not a route.
 *
 * The right hand side is a Great Learning programme card, in the order the live site
 * builds one: institution, programme name, duration and format, badge, then the
 * button. It used to be three invented bullets and an outbound link, which named no
 * university and claimed nothing the programme page actually claims.
 *
 * The institution is set as type. The live cards use the McCombs mark and this repo
 * does not have it, and a university logo is not a thing to approximate.
 *
 * The numbers on the left are the programme page's own. A dark band carrying headline
 * statistics is Great Learning's device, not one invented for this page.
 *
 * One featured card is a dead end for a lead who wants data science or management, so
 * the band closes on the domain listings. Great Learning has no single "all programs"
 * page: its navigation browses by domain, and these are its real domain paths.
 */
function MetaPill({ label }: { label: string }) {
  return (
    <Box
      component="span"
      sx={{
        backgroundColor: "#F2F4F7",
        borderRadius: "999px",
        px: 1.5,
        py: 0.5,
        fontSize: 12.5,
        fontWeight: 500,
        color: GL.body,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}

function ProgramCard() {
  const { eyebrow, university, partner, name, meta, badge, points, cta } = PG_SECTION.card;

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.28)",
        p: { xs: 3, md: 3.5 },
      }}
    >
      {/* The card is a pick out of many, so it says which pick and why, rather than
          appearing to be the only programme Great Learning runs. */}
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1.1px",
          textTransform: "uppercase",
          color: GL.blue,
          mb: 1.5,
        }}
      >
        {eyebrow}
      </Typography>

      <Typography sx={{ fontSize: 13, fontWeight: 600, color: GL.heading, lineHeight: 1.45 }}>
        {university}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: GL.body, mt: 0.25 }}>{partner}</Typography>

      <Typography
        sx={{
          mt: 2,
          fontSize: { xs: 18, md: 19 },
          fontWeight: 600,
          lineHeight: 1.3,
          color: GL.heading,
        }}
      >
        {name}
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
        {meta.map((m) => (
          <MetaPill key={m} label={m} />
        ))}
        {/* The badge sits with the format pills but is tinted, because it is a claim
            about the programme rather than a fact about the timetable. */}
        <Box
          component="span"
          sx={{
            backgroundColor: "#F1F6FE",
            borderRadius: "999px",
            px: 1.5,
            py: 0.5,
            fontSize: 12.5,
            fontWeight: 600,
            color: GL.blue,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </Box>
      </Stack>

      <Box sx={{ height: "1px", backgroundColor: GL.border, my: 2.5 }} />

      <Stack gap={1.5}>
        {points.map((point) => (
          <Stack key={point} direction="row" gap={1.25} alignItems="flex-start">
            <Box sx={{ display: "flex", color: GL.blue, flexShrink: 0, mt: "2px" }}>
              <Check size={17} />
            </Box>
            <Typography sx={{ fontSize: 14.5, lineHeight: 1.5, color: GL.body }}>
              {point}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Outlined, not filled. Start Free Trial is the one filled button on the page,
          and a second one here would put the seven month programme and the fortnight
          trial in the same weight. */}
      <Button
        variant="outlined"
        component="a"
        href={PG_PROGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        fullWidth
        sx={{ mt: 3 }}
      >
        {cta}
      </Button>
    </Box>
  );
}

export function PgProgramSection() {
  return (
    <Section bg={GL.dark}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 5, md: 8 },
          alignItems: "center",
        }}
      >
        <Box>
          <DarkHeading>{PG_SECTION.title}</DarkHeading>
          <Typography
            sx={{ fontSize: 16, lineHeight: 1.65, color: GL.darkBody, mt: 2.5, maxWidth: 520 }}
          >
            {PG_SECTION.body}
          </Typography>

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={{ xs: 3, md: 5 }}
            sx={{ mt: { xs: 4, md: 5 } }}
          >
            {PG_SECTION.stats.map((stat) => (
              <Box key={stat.caption}>
                <Typography
                  sx={{
                    fontSize: { xs: 26, md: 30 },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.8px",
                    color: "#ffffff",
                  }}
                >
                  {stat.figure}
                </Typography>
                <Typography sx={{ fontSize: 13.5, color: GL.darkBody, mt: 0.5 }}>
                  {stat.caption}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <ProgramCard />
      </Box>

      <Box sx={{ height: "1px", backgroundColor: GL.darkBorder, mt: { xs: 5, md: 7 } }} />

      <Typography
        sx={{
          mt: 3,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: GL.darkBody,
        }}
      >
        {PG_SECTION.browse.label}
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap={1.25} sx={{ mt: 2 }}>
        {PG_SECTION.browse.domains.map((domain) => (
          <Box
            key={domain.path}
            component="a"
            href={`${GL_SITE}${domain.path}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.22)",
              borderRadius: "999px",
              px: 2,
              py: 0.875,
              fontSize: 14,
              color: "#ffffff",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "border-color 160ms ease, background-color 160ms ease",
              "&:hover": {
                borderColor: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
              "&:focus-visible": { outline: "2px solid #ffffff", outlineOffset: "2px" },
            }}
          >
            {domain.name}
          </Box>
        ))}
      </Stack>
    </Section>
  );
}

export default PgProgramSection;
