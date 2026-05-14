import { useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { usePricing, daysUntil } from "../../lib/pulse/pricing";

type CtaMode = "button-loader" | "none";

type HeroCopy = {
  headline: React.ReactNode;
  subtitle: string;
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
  ctaMode: CtaMode;
};

type PillarItem = { title: string; body: string };

const PILLARS: PillarItem[] = [
  {
    title: "New module every two weeks",
    body: "New module every two weeks, 26 a year. Your AI knowledge keeps pace with the field.",
  },
  {
    title: "Hands-on demos",
    body: "Module ends with a hands-on demo, not just videos to watch. You finish with a skill you can apply.",
  },
  {
    title: "Sequenced and outcome-driven",
    body: "Each release builds on the last, moving from awareness to understanding to application.",
  },
];

function useHeroCopy(): HeroCopy {
  const { state, trialStartedAt, activeUntil, startTrial, openPricingModal } = usePricing();

  const scrollToModules = () => {
    const target =
      document.getElementById("released-modules") ??
      document.getElementById("pulse-modules");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (state === "paid") {
    return {
      headline: (
        <>
          Your AI knowledge,
          <br />
          current as the field.
        </>
      ),
      subtitle:
        "Every Pulse module is yours. Pick where you left off, or jump into the newest one below.",
      primaryCtaLabel: "Browse modules",
      onPrimaryCta: scrollToModules,
      ctaMode: "none",
    };
  }

  if (state === "expired") {
    return {
      headline: (
        <>
          Pick up where
          <br />
          you left off.
        </>
      ),
      subtitle:
        "Your past modules are still in the archive. Renew to unlock the new releases coming every two weeks.",
      primaryCtaLabel: "Renew · from $100/mo",
      onPrimaryCta: openPricingModal,
      ctaMode: "none",
    };
  }

  if (state === "trial" && trialStartedAt) {
    const days = daysUntil(activeUntil);
    return {
      headline: (
        <>
          You're in. {days} day{days === 1 ? "" : "s"} left.
          <br />
          Subscribe to keep your access.
        </>
      ),
      subtitle:
        "Subscribe before your trial ends to keep every released module plus the new ones coming every two weeks.",
      primaryCtaLabel: "Subscribe to Pulse",
      onPrimaryCta: openPricingModal,
      ctaMode: "none",
    };
  }

  return {
    headline: (
      <>
        AI moves faster than any curriculum.
        <br />
        Pulse keeps you ahead.
      </>
    ),
    subtitle:
      "A new applied module every two weeks on what's actually shipping in AI. You leave each one with a skill you can use, not just news to read.",
    primaryCtaLabel: "Start 30-day trial",
    onPrimaryCta: startTrial,
    ctaMode: "button-loader",
  };
}

export function PulseV2Hero() {
  const copy = useHeroCopy();
  const [loading, setLoading] = useState(false);

  const handleCta = () => {
    if (loading) return;
    if (copy.ctaMode === "button-loader") {
      setLoading(true);
      setTimeout(() => {
        copy.onPrimaryCta();
        setLoading(false);
      }, 500);
    } else {
      copy.onPrimaryCta();
    }
  };

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        background: "linear-gradient(to right, #ffffff 0%, #ffffff 50%, #c1cedb 100%)",
      })}
    >
      {/* Top section: text left, illustration right. Height follows content. */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background illustration — anchored to the right, fades into the text column */}
        <Box
          aria-hidden
          component="img"
          src="/hero/pulse-hero.png"
          alt=""
          sx={{
            position: "absolute",
            right: -64,
            top: -24,
            bottom: 0,
            height: "110%",
            width: "auto",
            display: { xs: "none", md: "block" },
            pointerEvents: "none",
            objectFit: "cover",
            objectPosition: "right center",
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 28%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 28%)",
          }}
        />

        {/* Text content */}
        <Stack
          gap={2.5}
          sx={{
            position: "relative",
            px: { xs: 3, md: 5 },
            pt: 4,
            pb: 4,
            maxWidth: { xs: "100%", md: 620 },
          }}
        >
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
            {copy.headline}
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              lineHeight: "20px",
              letterSpacing: "0.28px",
              color: "rgba(0, 0, 0, 0.56)",
              maxWidth: 520,
            }}
          >
            {copy.subtitle}
          </Typography>

          <Box>
            <Button
              variant="contained"
              disableElevation
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={16} thickness={5} sx={{ color: "inherit" }} />
                ) : (
                  <ArrowRight size={18} />
                )
              }
              onClick={handleCta}
              sx={{
                height: 40,
                px: 2,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "-0.2px",
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              {copy.primaryCtaLabel}
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Bottom strip: 3 pillar columns */}
      <Box
        sx={(theme) => ({
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
          bgcolor: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        })}
      >
        {PILLARS.map((p, i) => (
          <Box
            key={p.title}
            sx={(theme) => ({
              px: { xs: 2.5, md: 2.5 },
              py: 2,
              minWidth: 0,
              borderRight: {
                xs: "none",
                md: i < PILLARS.length - 1 ? `1px solid ${theme.palette.outlineVariant.main}` : "none",
              },
              borderBottom: {
                xs: i < PILLARS.length - 1 ? `1px solid ${theme.palette.outlineVariant.main}` : "none",
                md: "none",
              },
            })}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: "rgba(33, 33, 33, 0.92)",
                mb: 0.5,
              }}
            >
              {p.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.43,
                color: "rgba(33, 33, 33, 0.72)",
              }}
            >
              {p.body}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
