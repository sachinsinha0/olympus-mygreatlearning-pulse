import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CalendarClock } from "lucide-react";
import { GL } from "../landingTheme";
import { Section, StatStrip } from "../parts";
import { HERO, HERO_STATS } from "../content";
import { selectLandingModules } from "../../../lib/pulse/landingModules";
import type { PulseIssue } from "../../../lib/pulse/types";
import issuesData from "../../../mocks/pulse-issues.json";

/**
 * The hero. Copy on the left, the photograph on the right, exactly the order the
 * Great Learning course landing template uses: tagline, title, paragraph, buttons,
 * one information line, then the bordered stat strip.
 */
export function LandingHero() {
  const navigate = useNavigate();

  // The fourth stat cell is the real released module count, read from the same mock
  // file /pulse reads. Counting it here keeps the number honest if a module is added.
  const { total } = useMemo(() => selectLandingModules(issuesData as PulseIssue[]), []);
  const stats = [...HERO_STATS, { value: `${total} modules`, label: "Available now" }];

  const goToLogin = () => navigate("/ai-pulse/login");

  return (
    <Section>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 460px" },
          gap: { xs: 4, lg: 6 },
          alignItems: "center",
        }}
      >
        <Stack gap={2.5}>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: GL.blue }}>
            {HERO.tagline}
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 30, md: 36 },
              fontWeight: 500,
              lineHeight: 1.25,
              color: GL.ink,
            }}
          >
            {HERO.title}
          </Typography>

          <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: GL.body, maxWidth: 620 }}>
            {HERO.body}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            {/* The reference template gives both hero buttons near equal generous widths
                (215px and 210px on the live page). Left to size themselves the two labels
                here differ by 80px, which reads auto-sized rather than designed. */}
            <Button
              variant="contained"
              onClick={goToLogin}
              sx={{ fontSize: 18, minHeight: 58, minWidth: { sm: 200 } }}
            >
              {HERO.primaryCta}
            </Button>
            <Button
              variant="outlined"
              onClick={goToLogin}
              sx={{ fontSize: 18, minHeight: 58, minWidth: { sm: 190 } }}
            >
              {HERO.secondaryCta}
            </Button>
          </Stack>

          {/* Where the reference template prints its application deadline. AI Pulse has
              no deadline, so this states the release cadence instead. */}
          <Stack direction="row" gap={1} alignItems="center">
            <Box sx={{ display: "flex", color: GL.blue }}>
              <CalendarClock size={16} />
            </Box>
            <Typography sx={{ fontSize: 15, color: GL.body }}>{HERO.cadence}</Typography>
          </Stack>

          <Box sx={{ mt: 1 }}>
            <StatStrip items={stats} />
          </Box>
        </Stack>

        {/* The filename on disk has a space in it, so the URL keeps it encoded. */}
        <Box
          component="img"
          src="/hero/hero%20image.jpg"
          alt=""
          sx={{
            width: "100%",
            height: { xs: 260, lg: 420 },
            objectFit: "cover",
            borderRadius: "8px",
            display: "block",
          }}
        />
      </Box>
    </Section>
  );
}

export default LandingHero;
