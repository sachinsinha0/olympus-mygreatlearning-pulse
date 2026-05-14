import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarClock, Lock, Play } from "lucide-react";
import { isTrialExpired, usePricing } from "../../lib/pulse/pricing";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
import { usePageLoader } from "../common/PageLoader";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

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
  const { state, trialStartedAt, activeUntil, startTrial, openPricingModal } = usePricing();
  const trialActive = state === "trial" && !!trialStartedAt && !isTrialExpired(state, trialStartedAt, activeUntil);
  const trialEnded = isTrialExpired(state, trialStartedAt, activeUntil);

  const headline = (
    <>
      AI moves faster than any curriculum.
      <br />
      Pulse keeps you ahead.
    </>
  );
  const subtitle =
    "A new applied module every two weeks on what's actually shipping in AI. You leave each one with a skill you can use.";

  if (trialActive || trialEnded) {
    return {
      headline,
      subtitle,
      primaryCtaLabel: "Subscribe to Pulse",
      onPrimaryCta: openPricingModal,
      ctaMode: "none",
    };
  }

  return {
    headline,
    subtitle,
    primaryCtaLabel: "Start 30-day trial",
    onPrimaryCta: () => {
      startTrial();
      setTimeout(scrollToModules, 40);
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
        <MarketingHero />
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
        background: "linear-gradient(to right, #ffffff 0%, #ffffff 50%, #c1cedb 100%)",
      })}
    >
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

function PaidWelcomeStrip() {
  const navigate = useNavigate();
  const { runWithPageLoader } = usePageLoader();
  const { hasStarted } = useLearningProgress();
  const goToManage = () => navigate("/pulse/subscription");

  // Chronological ordering for "Module N" labels — oldest = 1, newest = last.
  const chronoNumber = useMemo(() => {
    const sorted = [...allIssues].sort((a, b) => a.releasedAt.localeCompare(b.releasedAt));
    const map = new Map<string, number>();
    sorted.forEach((i, idx) => map.set(i.id, idx + 1));
    return (id: string) => map.get(id) ?? 0;
  }, []);

  const resumeIssue = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const released = allIssues
      .filter((i) => i.releasedAt <= today)
      .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
    return released.find((i) => hasStarted(i.id));
  }, [hasStarted]);

  const onResume = () => {
    if (!resumeIssue) return;
    runWithPageLoader(() => navigate(`/pulse/course?module=${resumeIssue.id}`), 700);
  };

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
              px: 1,
              py: 0.5,
              borderRadius: "8px",
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.main,
            })}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.2px" }}>
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

      {/* Continue where you left — only shown once user has started at least one module */}
      {resumeIssue && (
        <Box
          sx={(theme) => ({
            mt: 2.5,
            px: { xs: 2, md: 2.5 },
            py: 2,
            borderRadius: "10px",
            bgcolor: theme.palette.primary.light,
          })}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={{ xs: 1.5, sm: 2 }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack gap={0.5} sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                Continue where you left
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "text.primary",
                  letterSpacing: "-0.2px",
                  lineHeight: 1.3,
                }}
              >
                Module {chronoNumber(resumeIssue.id)} · {resumeIssue.title}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              disableElevation
              startIcon={<Play size={14} fill="currentColor" />}
              onClick={onResume}
              sx={{
                height: 40,
                px: 2.25,
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: "nowrap",
                borderRadius: "8px",
                textTransform: "none",
                flexShrink: 0,
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            >
              Resume
            </Button>
          </Stack>
        </Box>
      )}
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
                letterSpacing: 1.6,
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
  const { openPricingModal } = usePricing();

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
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: theme.palette.extended.warning.color,
              })}
            >
              Free trial ended
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
