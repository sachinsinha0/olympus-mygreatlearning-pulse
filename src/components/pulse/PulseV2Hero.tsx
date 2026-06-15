import { useMemo } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, CalendarClock, Clock, Lock, Play, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { daysUntil, isTrialExpired, usePricing } from "../../lib/pulse/pricing";
import { usePageLoader } from "../common/PageLoader";
import { getDefaultItemId } from "../../lib/pulse/courseItems";
import glLogo from "../../assets/gl-logo.svg";
import { clearIntroSeen } from "../../lib/pulse/onboarding";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

type CtaMode = "button-loader" | "none";

type HeroCopy = {
  headline: React.ReactNode;
  subtitle: string;
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
  ctaMode: CtaMode;
  showNoCardReassurance: boolean;
  trialStatus?: { expiresAt: string; daysLeft: number };
};

type PillarItem = { title: string; body: string; Icon: LucideIcon };

const PILLARS: PillarItem[] = [
  {
    title: "Stay ahead of the AI curve",
    body: "New AI tools and innovations every two weeks.",
    Icon: Sparkles,
  },
  {
    title: "Bite-sized modules",
    body: "30–60 minutes, designed to fit your schedule.",
    Icon: Clock,
  },
  {
    title: "Use it at work",
    body: "Apply what you learn at work immediately.",
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
  const { runWithPageLoader } = usePageLoader();
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
      Pulse keeps you in sync.
    </>
  );
  const subtitle =
    "A biweekly learning module on the new AI tools, innovations, and workflows reshaping work, distilled into 60 minutes of learning that you can actually apply.";

  if (trialActive || trialEnded) {
    return {
      headline,
      subtitle,
      primaryCtaLabel: "Subscribe to Pulse",
      onPrimaryCta: openPricingModal,
      ctaMode: "none",
      showNoCardReassurance: false,
      trialStatus:
        trialActive && activeUntil
          ? { expiresAt: activeUntil, daysLeft: daysUntil(activeUntil) }
          : undefined,
    };
  }

  return {
    headline,
    subtitle,
    primaryCtaLabel: "Start your 30-day free trial",
    showNoCardReassurance: true,
    onPrimaryCta: () => {
      if (firstModule) {
        runWithPageLoader(() => {
          startTrial();
          const itemId = getDefaultItemId(firstModule.id, false);
          const itemPath = itemId ? `/items/${itemId}` : "";
          navigate(`/pulse/modules/${firstModule.id}${itemPath}?trial=started`);
        }, 950);
      } else {
        startTrial();
        setTimeout(scrollToModules, 40);
      }
    },
    ctaMode: "none",
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

  const handleCta = () => {
    copy.onPrimaryCta();
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
      <ReplayIntroButton />
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
            right: -72,
            top: -28,
            bottom: 0,
            height: "114%",
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
            px: { xs: 2, md: 4 },
            pt: { xs: 2, md: 4 },
            pb: { xs: 2, md: 4 },
            maxWidth: { xs: "100%", lg: 680 },
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.25}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.2px",
                color: "text.primary",
              }}
            >
              AI Pulse
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "-0.1px",
                color: "text.secondary",
              }}
            >
              by
            </Typography>
            <Box
              component="img"
              src={glLogo}
              alt="Great Learning"
              sx={{ height: 22, width: "auto", display: "block" }}
            />
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
            {copy.headline}
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
            {copy.subtitle}
          </Typography>

          <Stack gap={1.25} alignItems={{ xs: "stretch", sm: "flex-start" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={{ xs: 1.5, sm: 2 }}
            >
              <Button
                variant="contained"
                disableElevation
                endIcon={<ArrowRight size={18} />}
                onClick={handleCta}
                sx={{
                  height: { xs: 44, md: 40 },
                  px: 2,
                  width: { xs: "100%", sm: "auto" },
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.2px",
                  textTransform: "none",
                  borderRadius: "8px",
                  flexShrink: 0,
                }}
              >
                {copy.primaryCtaLabel}
              </Button>
              {copy.trialStatus && <TrialStatusChip status={copy.trialStatus} />}
            </Stack>
            {copy.showNoCardReassurance && (
              <Stack
                direction="row"
                alignItems="center"
                gap={0.75}
                sx={{ color: "text.secondary", px: { xs: 0.5, sm: 0 } }}
              >
                <Lock size={14} strokeWidth={2} />
                <Typography
                  sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.1px", lineHeight: "18px" }}
                >
                  No credit card required
                </Typography>
              </Stack>
            )}
          </Stack>
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

function ReplayIntroButton() {
  const navigate = useNavigate();
  const onClick = () => {
    clearIntroSeen();
    navigate("/pulse/intro");
  };
  return (
    <Box
      component="button"
      onClick={onClick}
      aria-label="Replay intro"
      sx={{
        position: "absolute",
        top: { xs: 12, md: 16 },
        right: { xs: 12, md: 16 },
        zIndex: 3,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        height: 32,
        px: 1.5,
        borderRadius: 999,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "-0.1px",
        color: "rgba(0, 0, 0, 0.78)",
        bgcolor: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
        transition: "background-color 160ms ease, transform 160ms ease",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.78)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      <Play size={13} strokeWidth={2} style={{ display: "block" }} />
      <span>Replay intro</span>
    </Box>
  );
}

function TrialStatusChip({ status }: { status: { expiresAt: string; daysLeft: number } }) {
  const expiry = new Date(status.expiresAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        color: "text.secondary",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "-0.1px",
        lineHeight: "18px",
      }}
    >
      <CalendarClock size={14} strokeWidth={2} />
      <span>Trial ends {expiry}</span>
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
      {/* Top row: brand mark + Manage Subscription */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ flexWrap: "wrap" }}
      >
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.2px",
              color: "text.primary",
            }}
          >
            AI Pulse
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "-0.1px",
              color: "text.secondary",
            }}
          >
            by
          </Typography>
          <Box
            component="img"
            src={glLogo}
            alt="Great Learning"
            sx={{ height: 22, width: "auto", display: "block" }}
          />
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
            "&:hover": {
              borderColor: theme.palette.text.primary,
              bgcolor: "transparent",
            },
          })}
        >
          Manage Subscription
        </Button>
      </Stack>

      {/* Title row */}
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ flexWrap: "wrap", mt: { xs: 2, md: 2.25 } }}>
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
        gap={{ xs: 2, md: 3 }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={{ xs: 2, md: 2.25 }}
          alignItems="flex-start"
          sx={{ minWidth: 0 }}
        >
          <Box
            sx={(theme) => ({
              width: { xs: 64, md: 44 },
              height: { xs: 64, md: 44 },
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
            <Lock size={28} strokeWidth={2.25} style={{ display: "block" }} />
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
            width: { xs: "100%", sm: "auto" },
            fontSize: 15,
            fontWeight: 600,
            whiteSpace: "nowrap",
            borderRadius: "8px",
            textTransform: "none",
            flexShrink: 0,
            alignSelf: { xs: "stretch", sm: "flex-start", md: "center" },
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
        gap={{ xs: 2, md: 3 }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={{ xs: 2, md: 2.25 }}
          alignItems="flex-start"
          sx={{ minWidth: 0 }}
        >
          <Box
            sx={(theme) => ({
              width: { xs: 64, md: 44 },
              height: { xs: 64, md: 44 },
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
            <Lock size={28} strokeWidth={2.25} style={{ display: "block" }} />
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
            width: { xs: "100%", sm: "auto" },
            fontSize: 15,
            fontWeight: 600,
            whiteSpace: "nowrap",
            borderRadius: "8px",
            textTransform: "none",
            flexShrink: 0,
            alignSelf: { xs: "stretch", sm: "flex-start", md: "center" },
          }}
        >
          Subscribe to Pulse
        </Button>
      </Stack>
    </Box>
  );
}
