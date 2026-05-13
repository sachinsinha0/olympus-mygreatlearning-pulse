import { Box, Stack, Typography } from "@mui/material";

const PILLARS = [
  {
    n: "01",
    title: "Structured, not a feed",
    body: "Releases are sequenced and dated. After a year you have a map of how AI evolved, not a playlist.",
  },
  {
    n: "02",
    title: "Vetted by a human first",
    body: "Nothing ships unless someone on the team has used it on a real, non-trivial problem.",
  },
  {
    n: "03",
    title: "Awareness, understanding, application",
    body: "Every release moves you through all three. You hear about it, you grasp it, then you ship the hands-on demo.",
  },
  {
    n: "04",
    title: "Archive that compounds",
    body: "Each release joins a searchable back-catalogue. Month 13 you own a year of applied AI.",
  },
];

export function HowPulseWorks() {
  return (
    <Stack gap={2.5}>
      <Stack gap={0.5} sx={{ maxWidth: 720 }}>
        <Typography
          sx={{
            fontSize: { xs: 18, md: 20 },
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: "-0.4px",
            color: "text.primary",
          }}
        >
          What's behind every release
        </Typography>
        <Typography
          sx={{
            fontSize: 13,
            color: "text.secondary",
            lineHeight: 1.5,
          }}
        >
          Four things go into every Pulse release.
        </Typography>
      </Stack>

      <Box
        sx={(theme) => ({
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          rowGap: 2,
          columnGap: 0,
          borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
          pt: 2,
          "& > div": {
            px: { xs: 0, md: 2.5 },
            position: "relative",
          },
          "& > div:first-of-type": { pl: 0 },
          "& > div:last-of-type": { pr: 0 },
          "& > div:not(:first-of-type)::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 4,
            bottom: 4,
            width: "1px",
            background: theme.palette.outlineVariant.main,
            display: { xs: "none", md: "block" },
          },
        })}
      >
        {PILLARS.map(({ n, title, body }) => (
          <Stack key={n} gap={0.5}>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-1px",
                color: "primary.main",
                opacity: 0.85,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {n}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1.3,
                color: "text.primary",
                letterSpacing: "-0.2px",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                lineHeight: 1.45,
                color: "text.secondary",
              }}
            >
              {body}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}
