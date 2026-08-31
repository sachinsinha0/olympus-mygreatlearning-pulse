import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import { GL } from "../landingTheme";
import { ContentColumn } from "../parts";
import { HeroOrbit } from "./HeroOrbit";
import { HERO, VALUE_PROPS } from "../content";

/**
 * The hero. Copy on the left, the orbit system sweeping in from the right edge of the
 * viewport, then the product's three pillars as a strip along the bottom, the way
 * /pulse renders them.
 *
 * This section does not use the shared Section wrapper because it owns its own
 * clipping: the orbit is anchored partly off screen and the section's overflow is what
 * crops it, so the arcs run off the page instead of sitting inside a panel.
 *
 * The spacing is deliberately uneven. The tagline and headline sit close as one block,
 * then the paragraph, the CTA row and the pillars each get more air. Spacing everything
 * equally is what makes a column read as laid out rather than composed.
 */
export function LandingHero() {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/ai-pulse/login");

  return (
    <Box
      component="section"
      id="landing-hero"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "#ffffff",
        py: { xs: 6, md: 9 },
      }}
    >
      {/* Desktop: the orbit hangs off the right edge of the viewport. It sits behind
          the content column in the stacking order, and the copy keeps clear of it by
          width, not by z-index tricks. */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "absolute",
          top: "50%",
          right: -180,
          transform: "translateY(-56%)",
          width: 720,
          height: 720,
        }}
      >
        <HeroOrbit />
      </Box>

      <ContentColumn sx={{ position: "relative" }}>
        <Box sx={{ maxWidth: 600 }}>
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

          {/* The CTA and the reassurance share a row, so the width is filled by
              something true rather than by a second button. */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={{ xs: 2, sm: 2.5 }}
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              onClick={goToLogin}
              sx={{ fontSize: 16, minHeight: 52, minWidth: { sm: 200 }, width: { xs: "100%", sm: "auto" } }}
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

        {/* Phones and tablets get the orbit as a full bleed band under the copy,
            clipped top and bottom, scaled down. The negative margins run it out to the
            section edges past the column padding. */}
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            position: "relative",
            height: 300,
            overflow: "hidden",
            mt: 5,
            mx: { xs: -2.5, md: -4 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(0.55)",
              width: 720,
              height: 720,
            }}
          >
            <HeroOrbit />
          </Box>
        </Box>

        {/* The three pillars, in the hero, the way /pulse renders them: a strip along
            the bottom of the hero with a rule above it and rules between the cells. The
            white fill keeps the orbit's faint outer arcs from running behind the text
            where the two meet. */}
        <Box
          sx={{
            mt: { xs: 5, lg: 7 },
            pt: { xs: 3, md: 3.5 },
            borderTop: `1px solid ${GL.border}`,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            rowGap: 3,
            position: "relative",
            backgroundColor: "#ffffff",
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
      </ContentColumn>
    </Box>
  );
}

export default LandingHero;
