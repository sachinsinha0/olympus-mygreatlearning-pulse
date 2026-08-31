import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { GL } from "../landingTheme";
import { CadenceStats, Section } from "../parts";
import { CADENCE_STATS, HERO } from "../content";

/**
 * The hero. Copy on the left, the photograph on the right, in the order the Great
 * Learning course landing template uses.
 *
 * The template opens its left column with the partner institution's logos. AI Pulse
 * has no partner, so the column opens on the tagline.
 *
 * The spacing is deliberately uneven. The tagline and headline sit close as one block,
 * then the paragraph, the CTA row and the stat strip each get more air. Spacing
 * everything equally is what makes a column read as laid out rather than composed.
 */
export function LandingHero() {
  const navigate = useNavigate();

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
          {/* Tagline and headline read as one block, so the gap between them is tight
              and the air comes after. */}
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: GL.blue }}>
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
            <CadenceStats items={CADENCE_STATS} />
          </Box>
        </Box>

        {/* A square frame. The photograph is pale and was dissolving into the white
            page with only a radius to contain it, so it sits on a tinted ground with a
            hairline edge. */}
        <Box
          sx={{
            backgroundColor: "#EEF3FC",
            border: `1px solid ${GL.border}`,
            borderRadius: "8px",
            overflow: "hidden",
            aspectRatio: "1 / 1",
            width: "100%",
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
              // The source is 1979x718 and the frame is square, so only about 36% of
              // its width is ever visible, at every breakpoint. 84% is where the laptop
              // sits fully inside the crop. Lower clips its right edge, higher clips its
              // left. The phone at the frame edge is deliberate, it reads as depth.
              objectPosition: "84% center",
              display: "block",
            }}
          />
        </Box>
      </Box>
    </Section>
  );
}

export default LandingHero;
