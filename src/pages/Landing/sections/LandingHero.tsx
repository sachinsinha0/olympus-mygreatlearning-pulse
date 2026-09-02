import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useOpenTrialDialog } from "../TrialDialog";
import { GL } from "../landingTheme";
import { ContentColumn } from "../parts";
import { HERO, VALUE_PROPS } from "../content";

/**
 * The hero, staged like a platform product page: the photograph is the section's
 * full bleed background, not an image inside a card, and the content sits on the
 * 1280 grid on top of it. The reference for the staging is microsoft.com's product
 * pages. The reference for every word is still PulseV2Hero: the headline, subtitle,
 * CTA label, reassurance line and the three pillars are the product's, verbatim.
 * Staging diverges from the in-app banner, the strings never do.
 *
 * The asset makes this work. hero-wide.jpg is a 2285x718 extension of the product
 * banner's photograph, the same scene with 300px more calm space on its left, made
 * for exactly this staging: the device cluster anchors right and the dark text sits
 * on quiet ground with no overlay needed. The product's own hero image.jpg stays
 * untouched for /pulse.
 *
 * The pillars strip plays the role of the reference's bottom anchor bar: a full
 * bleed translucent band over the image's foot, its content on the grid. The fill
 * and blur values are PulseV2Hero's own.
 *
 * Flush under the header, no top gap: a full bleed background reads as page chrome,
 * where the boxed banner this replaces wanted 32px of air above it.
 *
 * Below lg the photograph becomes a full bleed band above the content, and the
 * content and pillars sit on plain white, since at phone widths the crop shows
 * mostly the device cluster and text over it would fight for contrast.
 */
export function LandingHero() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const openTrialDialog = useOpenTrialDialog();

  return (
    <Box component="section" id="landing-hero" sx={{ position: "relative", bgcolor: "#ffffff" }}>
      {/* Desktop: the photograph as the section's background, edge to edge. */}
      <Box
        aria-hidden
        sx={{
          display: { xs: "none", lg: "block" },
          position: "absolute",
          inset: 0,
          backgroundImage: 'url("/hero/hero-wide2.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      />

      {/* Phones and tablets: the photograph as a full bleed band above the content. */}
      <Box
        aria-hidden
        sx={{
          display: { xs: "block", lg: "none" },
          height: { xs: 190, sm: 230, md: 280 },
          backgroundImage: 'url("/hero/hero-wide2.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      />

      <ContentColumn sx={{ position: "relative" }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.05, 0.7, 0.1, 1] }}
        >
          <Stack gap={2.5} sx={{ maxWidth: { xs: "100%", lg: 620 }, py: { xs: 3, lg: 10 } }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 28, md: 40 },
                // One step below the product's 700. Poppins carries more visual
                // weight than the product's Inter at the same setting.
                fontWeight: 600,
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.84px",
                color: "rgba(0, 0, 0, 0.92)",
              }}
            >
              {HERO.titleLines.map((line) => (
                <Box key={line} component="span" sx={{ display: "block" }}>
                  {line}
                </Box>
              ))}
            </Typography>

            <Typography
              sx={{
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "-0.2px",
                color: "rgba(0, 0, 0, 0.56)",
                textWrap: "balance",
              }}
            >
              {HERO.body}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={{ xs: 1.25, sm: 2 }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowRight size={18} />}
                onClick={openTrialDialog}
                sx={{
                  // The product button's proportions, not the landing theme's.
                  height: { xs: 44, md: 40 },
                  minHeight: 0,
                  px: 2,
                  width: { xs: "100%", sm: "auto" },
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.2px",
                  borderRadius: "8px",
                  flexShrink: 0,
                }}
              >
                {HERO.primaryCta}
              </Button>
              <Stack direction="row" alignItems="center" gap={0.75} sx={{ color: GL.body, px: { xs: 0.5, sm: 0 } }}>
                <ShieldCheck size={14} strokeWidth={2} />
                <Typography
                  sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.1px", lineHeight: "18px", whiteSpace: "nowrap" }}
                >
                  {HERO.reassurance}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </motion.div>
      </ContentColumn>

      {/* The pillars as the section's bottom bar, full bleed, content on the grid.
          Translucent over the photograph on desktop, plain white below lg where it
          sits on white anyway. Fill and blur are PulseV2Hero's own. */}
      <Box
        sx={{
          position: "relative",
          borderTop: `1px solid ${GL.border}`,
          bgcolor: { xs: "#ffffff", lg: "rgba(255, 255, 255, 0.55)" },
          backdropFilter: { lg: "blur(10px)" },
          WebkitBackdropFilter: { lg: "blur(10px)" },
        }}
      >
        <ContentColumn>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            {VALUE_PROPS.map((p, i) => (
              <Stack
                key={p.title}
                direction="row"
                alignItems="flex-start"
                gap={1.25}
                sx={{
                  px: { xs: 0, md: 2.5 },
                  pl: { md: i === 0 ? 0 : 2.5 },
                  py: { xs: 1.5, md: 2 },
                  minWidth: 0,
                  borderRight: {
                    xs: "none",
                    md: i < VALUE_PROPS.length - 1 ? `1px solid ${GL.border}` : "none",
                  },
                  borderBottom: {
                    xs: i < VALUE_PROPS.length - 1 ? `1px solid ${GL.border}` : "none",
                    md: "none",
                  },
                }}
              >
                <Box sx={{ flexShrink: 0, display: "flex", color: GL.blue, mt: "1px" }}>
                  <p.Icon size={18} strokeWidth={2} />
                </Box>
                <Stack gap={0.5} sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: "20px", color: "rgba(33, 33, 33, 0.92)" }}>
                    {p.title}
                  </Typography>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.43, color: "rgba(33, 33, 33, 0.72)" }}>
                    {p.body}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Box>
        </ContentColumn>
      </Box>
    </Box>
  );
}

export default LandingHero;
