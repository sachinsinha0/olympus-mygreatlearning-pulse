import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, CalendarClock, Clock, Lock, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { daysUntil, isTrialExpired, usePricing } from "../../lib/pulse/pricing";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

type CtaMode = "button-loader" | "none";

type HeroCopy = {
  headline: React.ReactNode;
  subtitle: string;
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
  ctaMode: CtaMode;
  trialStatus?: { expiresAt: string; daysLeft: number };
};

type PillarItem = { title: string; body: string; Icon: LucideIcon };

const PILLARS: PillarItem[] = [
  {
    title: "Stay ahead of the AI curve",
    body: "New tools and trends every two weeks.",
    Icon: Sparkles,
  },
  {
    title: "Bite-sized modules",
    body: "30–60 minutes, designed to fit your schedule.",
    Icon: Clock,
  },
  {
    title: "Use it at work",
    body: "Apply what you learn in real projects.",
    Icon: Briefcase,
  },
];

const allIssues = issuesData as PulseIssue[];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function slowScrollTo(target: HTMLElement, duration = 1100) {
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const targetY = target.getBoundingClientRect().top + window.scrollY - margin;
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;
  const startTime = performance.now();
  const step = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function scrollToModules() {
  const target =
    document.getElementById("released-modules") ??
    document.getElementById("pulse-modules");
  if (target) slowScrollTo(target);
}

function useHeroCopy(): HeroCopy {
  const navigate = useNavigate();
  const { state, trialStartedAt, activeUntil, startTrial, openPricingModal } = usePricing();

  const firstModule = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...allIssues]
      .filter((i) => i.releasedAt <= today)
      .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt))[0];
  }, []);
  const trialActive = state === "trial" && !!trialStartedAt && !isTrialExpired(state, trialStartedAt, activeUntil);
  const trialEnded = isTrialExpired(state, trialStartedAt, activeUntil);

  const headline = (
    <>
      AI moves fast.
      <br />
      Pulse keeps you ahead.
    </>
  );
  const subtitle =
    "A biweekly learning module on the AI tools, models, and workflows reshaping work, distilled into 30–60 minutes you can actually apply.";

  if (trialActive || trialEnded) {
    return {
      headline,
      subtitle,
      primaryCtaLabel: "Subscribe to Pulse",
      onPrimaryCta: openPricingModal,
      ctaMode: "none",
      trialStatus:
        trialActive && activeUntil
          ? { expiresAt: activeUntil, daysLeft: daysUntil(activeUntil) }
          : undefined,
    };
  }

  return {
    headline,
    subtitle,
    primaryCtaLabel: "Start 30-day trial",
    onPrimaryCta: () => {
      startTrial();
      if (firstModule) {
        navigate(`/pulse/course?module=${firstModule.id}&trial=started`);
      } else {
        setTimeout(scrollToModules, 40);
      }
    },
    ctaMode: "button-loader",
  };
}

export function PulseV2Hero() {
  const { state, trialStartedAt, activeUntil } = usePricing();

  if (state === "paid") return <PaidWelcomeStrip />;
  if (state === "expired") return <ExpiredBanner />;
  if (isTrialExpired(state, trialStartedAt, activeUntil)) {
    return (
      <Stack gap={2}>
        <TrialExpiredBanner />
        {/* Phones already have the Subscribe CTA on the banner above; the marketing pitch below is redundant scroll. Tablet/desktop keep it. */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <MarketingHero />
        </Box>
      </Stack>
    );
  }

  return <MarketingHero />;
}

function MarketingHero() {
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
        bgcolor: { xs: theme.palette.background.paper, md: "transparent" },
        background: {
          xs: "none",
          md: "linear-gradient(to right, #ffffff 0%, #ffffff 50%, #c1cedb 100%)",
        },
      })}
    >
      {/* Mobile-only: hero image stacked on top of the text. Hidden at md+.
          Modest container height; the image itself is scaled up inside via transform so the subject
          (laptop / phone / blocks on the right of the source image) reads bigger without making the
          container tall. transform-origin matches object-position so the subject stays anchored
          while the rest expands beyond and gets clipped. */}
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
            // Anchor to the right edge so the source's right-side content stays visible.
            objectPosition: "right center",
            // Scale up from the right edge: image grows leftward only, right edge stays pinned.
            transform: { xs: "translate(16px, -12px) scale(1.2)", sm: "translate(16px, -12px) scale(1.25)" },
            transformOrigin: "right center",
          }}
        />
      </Box>

      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box
          aria-hidden
          component="img"
          src="/hero/hero%20image.jpg"
          alt=""
          sx={{
            position: "absolute",
            right: -56,
            top: -40,
            bottom: 0,
            height: "118%",
            width: "auto",
            display: { xs: "none", lg: "block" },
            pointerEvents: "none",
            objectFit: "cover",
            objectPosition: "right center",
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 28%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 14%, black 28%)",
          }}
        />

        <Stack
          gap={2.5}
          sx={{
            position: "relative",
            px: { xs: 2, md: 5 },
            pt: { xs: 2, md: 4 },
            pb: { xs: 2, md: 4 },
            maxWidth: { xs: "100%", lg: 620 },
          }}
        >
          {copy.trialStatus && <TrialStatusChip status={copy.trialStatus} />}
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

          <Box sx={{ width: { xs: "100%", md: "auto" } }}>
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
                height: { xs: 44, md: 40 },
                px: 2,
                width: { xs: "100%", md: "auto" },
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
          <Stack
            key={p.title}
            direction="row"
            alignItems="flex-start"
            gap={1.25}
            sx={(theme) => ({
              px: { xs: 2.5, md: 2.5 },
              py: { xs: 1.5, md: 2 },
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
            <Box
              sx={(theme) => ({
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.primary.main,
                mt: "1px",
              })}
            >
              <p.Icon size={18} strokeWidth={2} />
            </Box>
            <Stack gap={0.5} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "rgba(33, 33, 33, 0.92)",
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
            </Stack>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}

function TrialStatusChip({ status }: { status: { expiresAt: string; daysLeft: number } }) {
  const expiry = new Date(status.expiresAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <Box
      sx={(theme) => ({
        alignSelf: "flex-start",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.625,
        bgcolor: theme.palette.primary.light,
        color: theme.palette.primary.main,
        borderRadius: "8px",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "-0.1px",
        lineHeight: "18px",
      })}
    >
      <CalendarClock size={15} strokeWidth={2.25} />
      <span>Free trial is active till {expiry}</span>
    </Box>
  );
}

function PaidWelcomeStrip() {
  const navigate = useNavigate();
  const goToManage = () => navigate("/pulse/subscription");

  return (
    <Box
      sx={(theme) => ({
        borderRadius: "16px",
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        bgcolor: theme.palette.background.paper,
        px: { xs: 3, md: 4 },
        py: { xs: 3, md: 3.5 },
      })}
    >
      {/* Top row: title + chip + Manage Subscription */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={{ xs: 2, md: 3 }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ flexWrap: "wrap" }}>
          <Typography
            sx={{
              fontSize: { xs: 22, md: 26 },
              fontWeight: 700,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              color: "text.primary",
            }}
          >
            Welcome to Pulse
          </Typography>
          <Box
            sx={(theme) => ({
              px: 1.25,
              py: 0.625,
              borderRadius: "8px",
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.main,
            })}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.1px", lineHeight: "18px" }}>
              Subscription Active
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          disableElevation
          onClick={goToManage}
          sx={(theme) => ({
            height: 36,
            px: 1.75,
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: "nowrap",
            borderRadius: "8px",
            textTransform: "none",
            borderColor: theme.palette.outlineVariant.main,
            color: theme.palette.text.primary,
            flexShrink: 0,
            alignSelf: { xs: "flex-start", md: "center" },
            "&:hover": {
              borderColor: theme.palette.text.primary,
              bgcolor: "transparent",
            },
          })}
        >
          Manage Subscription
        </Button>
      </Stack>

      {/* What is Pulse — body text */}
      <Typography
        sx={{
          fontSize: 14,
          color: "text.secondary",
          lineHeight: 1.5,
          letterSpacing: "-0.2px",
          maxWidth: 720,
          mt: 1.25,
        }}
      >
        A new applied module on what's actually shipping in AI. You leave each one with a skill you can use.
      </Typography>

    </Box>
  );
}

function ExpiredBanner() {
  const { activeUntil, openPricingModal } = usePricing();

  // Count modules released after expiry — what the user is missing.
  const missedCount = useMemo(() => {
    if (!activeUntil) return 0;
    const today = new Date().toISOString().slice(0, 10);
    return allIssues.filter((i) => i.releasedAt > activeUntil && i.releasedAt <= today).length;
  }, [activeUntil]);

  const expiredOnLabel = activeUntil
    ? new Date(activeUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        border: `1px solid ${theme.palette.extended.warning.color}`,
        bgcolor: theme.palette.extended.warning.colorContainer,
        px: { xs: 3, md: 4 },
        py: { xs: 3, md: 3.5 },
      })}
    >
      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          top: -60,
          right: -60,
          width: 320,
          height: 220,
          background: `radial-gradient(closest-side, ${theme.palette.extended.warning.color} 0%, transparent 70%)`,
          opacity: 0.18,
          pointerEvents: "none",
        })}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={{ xs: 2.5, md: 3 }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative" }}
      >
        <Stack direction="row" gap={2.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              width: 44,
              height: 44,
              borderRadius: "12px",
              bgcolor: theme.palette.background.paper,
              color: theme.palette.extended.warning.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `1px solid ${theme.palette.extended.warning.color}`,
            })}
          >
            <Lock size={20} strokeWidth={2.25} />
          </Box>
          <Stack gap={0.75} sx={{ minWidth: 0 }}>
            <Typography
              sx={(theme) => ({
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: theme.palette.extended.warning.color,
              })}
            >
              Subscription expired{expiredOnLabel ? ` · ${expiredOnLabel}` : ""}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 26 },
                fontWeight: 700,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              {missedCount > 0
                ? `You're missing ${missedCount} new module${missedCount === 1 ? "" : "s"}.`
                : "Renew to keep up with Pulse."}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5, maxWidth: 560 }}>
              Your archive is locked and new modules are dropping every two weeks. Renew to unlock everything in one click.
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          disableElevation
          onClick={openPricingModal}
          endIcon={<ArrowRight size={16} />}
          sx={{
            height: 44,
            px: 2.5,
            width: { xs: "100%", md: "auto" },
            fontSize: 15,
            fontWeight: 600,
            whiteSpace: "nowrap",
            borderRadius: "8px",
            textTransform: "none",
            flexShrink: 0,
            alignSelf: { xs: "stretch", md: "center" },
          }}
        >
          Renew Pulse
        </Button>
      </Stack>
    </Box>
  );
}

function TrialExpiredBanner() {
  const { openPricingModal, activeUntil } = usePricing();
  const endedOn = activeUntil
    ? new Date(activeUntil).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        border: `1px solid ${theme.palette.extended.warning.color}`,
        bgcolor: theme.palette.extended.warning.colorContainer,
        px: { xs: 3, md: 4 },
        py: { xs: 3, md: 3.5 },
      })}
    >
      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          top: -60,
          right: -60,
          width: 320,
          height: 220,
          background: `radial-gradient(closest-side, ${theme.palette.extended.warning.color} 0%, transparent 70%)`,
          opacity: 0.18,
          pointerEvents: "none",
        })}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={{ xs: 2.5, md: 3 }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative" }}
      >
        <Stack direction="row" gap={2.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              width: 44,
              height: 44,
              borderRadius: "12px",
              bgcolor: theme.palette.background.paper,
              color: theme.palette.extended.warning.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `1px solid ${theme.palette.extended.warning.color}`,
            })}
          >
            <Lock size={20} strokeWidth={2.25} />
          </Box>
          <Stack gap={0.75} sx={{ minWidth: 0 }}>
            <Typography
              sx={(theme) => ({
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: theme.palette.extended.warning.color,
              })}
            >
              {endedOn ? `Free trial ended · ${endedOn}` : "Free trial ended"}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 26 },
                fontWeight: 700,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              Your trial has ended. Subscribe to keep learning.
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5, maxWidth: 560 }}>
              Subscribe to unlock every released module and get a new one every two weeks.
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          disableElevation
          onClick={openPricingModal}
          endIcon={<ArrowRight size={16} />}
          sx={{
            height: 44,
            px: 2.5,
            width: { xs: "100%", md: "auto" },
            fontSize: 15,
            fontWeight: 600,
            whiteSpace: "nowrap",
            borderRadius: "8px",
            textTransform: "none",
            flexShrink: 0,
            alignSelf: { xs: "stretch", md: "center" },
          }}
        >
          Subscribe to Pulse
        </Button>
      </Stack>
    </Box>
  );
}
