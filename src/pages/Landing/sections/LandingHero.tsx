import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { GL } from "../landingTheme";
import { Section, StatStrip } from "../parts";
import { HERO, HERO_STATS } from "../content";
import { selectLandingModules } from "../../../lib/pulse/landingModules";
import type { PulseIssue } from "../../../lib/pulse/types";
import issuesData from "../../../mocks/pulse-issues.json";

/**
 * The hero. Copy on the left, the photograph on the right, in the order the Great
 * Learning course landing template uses.
 *
 * The template opens its left column with the partner institution's logos, which give
 * the top of the column some mass. AI Pulse has no partner, so the product name does
 * that job here. It also fixes a real gap: the headline never says "AI Pulse", and a
 * lead arriving from a sales call needs to see the name above the fold.
 *
 * The spacing is deliberately uneven. The name, tagline and headline sit close as one
 * block, then the paragraph, the CTA row and the stat strip each get more air. Spacing
 * everything equally is what makes a column read as laid out rather than composed.
 */
export function LandingHero() {
  const navigate = useNavigate();

  // The fourth stat cell is the real released module count, read from the same mock
  // file /pulse reads. Counting it here keeps the number honest if a module is added.
  const { total } = useMemo(() => selectLandingModules(issuesData as PulseIssue[]), []);
  const stats = [...HERO_STATS, { value: `${total} modules`, label: "Available now" }];

  const goToLogin = () => navigate("/ai-pulse/login");

  return (
    <Section id="landing-hero">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 480px" },
          gap: { xs: 5, lg: 7 },
          alignItems: "center",
        }}
      >
        <Box>
          {/* Name, tagline and headline read as one block, so the gaps inside it are
              tight and the air comes after it. */}
          <Stack direction="row" alignItems="baseline" gap={1}>
            <Typography
              sx={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", color: GL.heading }}
            >
              {HERO.name}
            </Typography>
            <Typography sx={{ fontSize: 13, color: GL.body }}>{HERO.by}</Typography>
          </Stack>

          <Typography sx={{ mt: 2.5, fontSize: 14, fontWeight: 400, color: GL.blue }}>
            {HERO.tagline}
          </Typography>

          <Typography
            component="h1"
            sx={{
              mt: 0.75,
              fontSize: { xs: 30, md: 38 },
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: "-0.6px",
              color: GL.ink,
            }}
          >
            {HERO.titleLines.map((line) => (
              <Box key={line} component="span" sx={{ display: "block" }}>
                {line}
              </Box>
            ))}
          </Typography>

          <Typography sx={{ mt: 3, fontSize: 16, lineHeight: 1.6, color: GL.body, maxWidth: 560 }}>
            {HERO.body}
          </Typography>

          {/* The CTA and the reassurance share a row. The reference fills this width
              with two buttons, but there is only one CTA on this page, so the
              reassurance is the counterweight rather than a second button. */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={{ xs: 2, sm: 2.5 }}
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              onClick={goToLogin}
              sx={{ fontSize: 16, minHeight: 52, minWidth: { sm: 200 } }}
            >
              {HERO.primaryCta}
            </Button>
            <Stack direction="row" alignItems="center" gap={1}>
              <Box aria-hidden sx={{ display: "flex", color: GL.body, flexShrink: 0 }}>
                <ShieldCheck size={16} />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: GL.body }}>
                {HERO.reassurance}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mt: 5 }}>
            <StatStrip items={stats} />
          </Box>
        </Box>

        {/* The photograph is pale and was dissolving into the white page with only a
            radius to contain it. The tinted ground and the hairline give it an edge, and
            the crop pushes past the empty light area on the left of the source so the
            devices fill the frame. */}
        <Box
          sx={{
            backgroundColor: "#EEF3FC",
            border: `1px solid ${GL.border}`,
            borderRadius: "8px",
            overflow: "hidden",
            height: { xs: 240, sm: 300, lg: 380 },
          }}
        >
          <Box
            component="img"
            src="/hero/hero%20image.jpg"
            alt="AI Pulse open on a laptop and a phone"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // The source is 1979x718, so a near square frame can only ever show
              // about 40% of its width. 78% is where the AI cube, the phone and the
              // laptop all land inside the crop.
              objectPosition: "78% center",
              display: "block",
            }}
          />
        </Box>
      </Box>
    </Section>
  );
}

export default LandingHero;
