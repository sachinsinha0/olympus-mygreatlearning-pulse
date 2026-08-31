import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { GL } from "../landingTheme";
import { Section } from "../parts";
import { HeroPulseVisual } from "./HeroPulseVisual";
import { HERO, VALUE_PROPS } from "../content";

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
          // 380 rather than 480. The square is the tallest thing in the row, so a
          // larger one left 88px of dead space above and below the copy.
          gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
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

        </Box>

        {/* The pulse visual. The photograph this replaced was an extreme landscape
            source fighting a square frame, and it said nothing about Pulse. See
            HeroPulseVisual for what this is and why it is restrained. */}
        <HeroPulseVisual />
      </Box>

      {/* The three pillars, in the hero, the way /pulse renders them: a strip along the
          bottom of the hero with a rule above it and rules between the cells. The
          product puts a translucent fill and a blur behind it because it sits on a
          gradient. This hero is plain white, so the rule alone does the work. */}
      <Box
        sx={{
          mt: { xs: 5, lg: 7 },
          pt: { xs: 3, md: 3.5 },
          borderTop: `1px solid ${GL.border}`,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          rowGap: 3,
        }}
      >
        {VALUE_PROPS.map((p, i) => (
          <Stack
            key={p.title}
            direction="row"
            gap={1.5}
            alignItems="flex-start"
            sx={{
              px: { md: 3 },
              pl: { md: i === 0 ? 0 : 3 },
              // A 1px neutral rule dividing columns, which is what /pulse puts between
              // its own pillars. Not a coloured accent strip, which is the thing the
              // design brief bans.
              borderLeft: { xs: "none", md: i === 0 ? "none" : `1px solid ${GL.border}` },
            }}
          >
            <Box aria-hidden sx={{ display: "flex", color: GL.blue, flexShrink: 0, mt: "2px" }}>
              <p.Icon size={18} strokeWidth={2} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: GL.heading, lineHeight: 1.4 }}>
                {p.title}
              </Typography>
              <Typography sx={{ fontSize: 14, color: GL.body, lineHeight: 1.5, mt: 0.25 }}>
                {p.body}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>
    </Section>
  );
}

export default LandingHero;
