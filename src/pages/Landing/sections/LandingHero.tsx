import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { GL } from "../landingTheme";
import { ContentColumn } from "../parts";
import { HERO, VALUE_PROPS } from "../content";
import glLogo from "../../../assets/gl-logo.svg";

/**
 * The hero: the product's own banner.
 *
 * This is the marketing hero from PulseV2Hero on /pulse, reproduced faithfully. The
 * gradient card, the masked photograph on the right, the lockup, the headline, the
 * subtitle, the CTA row and the pillars strip along the bottom are the product's
 * design, copied value for value. Six invented hero visuals were explored and
 * rejected before this: the banner a lead sees here is the banner they see after
 * logging in, which is the strongest continuity this page can offer.
 *
 * Two values here break this page's own design rules and are kept deliberately,
 * because they are the product's: the card background gradient and the pillars
 * strip's backdrop blur come verbatim from PulseV2Hero. Product canon beats the
 * local rulebook, the same way the intro marquee's mask does.
 *
 * Differences from /pulse, all behavioural rather than visual: the CTA routes to the
 * landing login step instead of starting a trial in place, there is no trial state
 * logic because this page is public, and there is no Replay intro button because
 * that is product chrome.
 */
export function LandingHero() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const goToLogin = () => navigate("/ai-pulse/login");

  return (
    <Box component="section" id="landing-hero" sx={{ bgcolor: "#ffffff", py: { xs: 4, md: 6 } }}>
      <ContentColumn>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.05, 0.7, 0.1, 1] }}
        >
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px",
              border: `1px solid ${GL.border}`,
              bgcolor: { xs: "#ffffff", md: "transparent" },
              // Product canon: PulseV2Hero's card ground, verbatim.
              background: {
                xs: "none",
                md: "linear-gradient(to right, #ffffff 0%, #ffffff 50%, #c1cedb 100%)",
              },
            }}
          >
            {/* Phones: the photograph stacked on top, scaled from the right edge so
                the subject stays anchored, exactly as the product does it. */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                width: "100%",
                height: { xs: 180, sm: 210 },
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src="/hero/hero%20image.jpg"
                alt=""
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "right center",
                  transform: { xs: "translate(16px, -12px) scale(1.2)", sm: "translate(16px, -12px) scale(1.25)" },
                  transformOrigin: "right center",
                }}
              />
            </Box>

            <Box sx={{ position: "relative", overflow: "hidden" }}>
              {/* Desktop: the photograph fading in from the right, the product's mask. */}
              <Box
                aria-hidden
                component="img"
                src="/hero/hero%20image.jpg"
                alt=""
                sx={{
                  position: "absolute",
                  right: -72,
                  top: -28,
                  bottom: 0,
                  height: "114%",
                  width: "auto",
                  display: { xs: "none", lg: "block" },
                  pointerEvents: "none",
                  objectFit: "cover",
                  objectPosition: "right center",
                  maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 28%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 28%)",
                }}
              />

              <Stack
                gap={2.5}
                sx={{
                  position: "relative",
                  px: { xs: 2, md: 4 },
                  pt: { xs: 2, md: 4 },
                  pb: { xs: 2, md: 4 },
                  maxWidth: { xs: "100%", lg: 680 },
                }}
              >
                <Stack direction="row" alignItems="center" gap={1.25}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", color: GL.heading }}>
                    {HERO.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 400, letterSpacing: "-0.1px", color: GL.body }}>
                    {HERO.by}
                  </Typography>
                  <Box component="img" src={glLogo} alt="Great Learning" sx={{ height: 22, width: "auto", display: "block" }} />
                </Stack>

                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 28, md: 40 },
                    fontWeight: 700,
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
                    onClick={goToLogin}
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
            </Box>

            {/* The pillars strip along the card's bottom edge, the product's own. The
                translucent fill and blur sit over the photograph where it passes
                behind. Product canon, verbatim from PulseV2Hero. */}
            <Box
              sx={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                borderTop: `1px solid ${GL.border}`,
                bgcolor: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              {VALUE_PROPS.map((p, i) => (
                <Stack
                  key={p.title}
                  direction="row"
                  alignItems="flex-start"
                  gap={1.25}
                  sx={{
                    px: 2.5,
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
          </Box>
        </motion.div>
      </ContentColumn>
    </Box>
  );
}

export default LandingHero;
