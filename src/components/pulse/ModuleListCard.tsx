import { useState } from "react";
import { Avatar, Box, Button, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { Bell, Check, Clock, FlaskConical, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatIssueDate } from "../../lib/format";
import { isTrialExpired, usePricing } from "../../lib/pulse/pricing";
import { useUnitLabel } from "../../lib/pulse/terminology";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
import { useModuleInterest } from "../../lib/pulse/moduleInterest";
import { usePageLoader } from "../common/PageLoader";
import { getDefaultItemId, getHandsOnItemId } from "../../lib/pulse/courseItems";

export type ModuleListCardStatus = "released" | "upcoming";

export function ModuleListCard({
  issue,
  status,
  displayNumber,
}: {
  issue: PulseIssue;
  status: ModuleListCardStatus;
  displayNumber?: number;
}) {
  const navigate = useNavigate();
  const unit = useUnitLabel();
  const { state, trialStartedAt, activeUntil, openPricingModal, startTrial } = usePricing();
  const { runWithPageLoader } = usePageLoader();
  const { hasStarted, markStarted } = useLearningProgress();
  const { interested, markInterested } = useModuleInterest(issue.id, issue.title);
  const [loading, setLoading] = useState(false);

  const isUpcoming = status === "upcoming";
  const trialExpired = isTrialExpired(state, trialStartedAt, activeUntil);
  const isLocked = state === "expired" || trialExpired;
  const isPreTrial = state === "trial" && !trialStartedAt;
  const started = hasStarted(issue.id);
  const handsOnItemId = getHandsOnItemId(issue.id);
  // The hands-on shortcut only makes sense on released, accessible modules that
  // actually contain a hands-on item — hidden for upcoming and locked/expired cards.
  const canShowHandsOn = !isUpcoming && !isLocked && handsOnItemId != null;

  const ctaLabel = state === "expired"
    ? "Renew to unlock"
    : trialExpired
    ? "Subscribe to unlock"
    : isPreTrial
    ? "Start Free Trial"
    : started
    ? "Resume Learning"
    : "Start Learning";

  const navigateToItem = (itemId: string, withTrialFlag = false) => {
    markStarted(issue.id);
    runWithPageLoader(() => {
      const suffix = withTrialFlag ? "?trial=started" : "";
      const itemPath = itemId ? `/items/${itemId}` : "";
      navigate(`/pulse/modules/${issue.id}${itemPath}${suffix}`);
    }, withTrialFlag ? 950 : 700);
  };

  const navigateToModule = (withTrialFlag = false) =>
    navigateToItem(getDefaultItemId(issue.id, started), withTrialFlag);

  const onStart = () => {
    if (loading) return;
    if (isLocked) {
      // Just opens the pricing dialog — no loader.
      openPricingModal();
      return;
    }
    if (isPreTrial) {
      // Full-page loader masks the trial-start state change + navigation in one motion.
      startTrial();
      navigateToModule(true);
      return;
    }
    // Trial-active or paid: just full-page loader for the navigation.
    navigateToModule();
  };

  // Secondary CTA: jump straight to the hands-on demo. Pre-trial users start the
  // trial and land directly on the demo — the fastest path to the payoff.
  const onTryHandsOn = () => {
    if (loading || !handsOnItemId) return;
    if (isPreTrial) {
      startTrial();
      navigateToItem(handsOnItemId, true);
      return;
    }
    navigateToItem(handsOnItemId);
  };

  const onCardClick = isUpcoming ? undefined : onStart;
  const outcomes = issue.outcomes.slice(0, 4);

  // Upcoming cards render at full strength — identical weight to released ones.
  // The only signal that they are not yet out is the "Coming" date prefix and the
  // outlined, non-interactive CTA below; nothing is dimmed.
  const eyebrowRow = (
    <Stack direction="row" gap={1} alignItems="center">
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          lineHeight: "16px",
          color: "primary.main",
        }}
      >
        {unit.numbered(displayNumber ?? issue.issueNumber)}
      </Typography>
      <Dot />
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 400,
          lineHeight: "16px",
          letterSpacing: "-0.2px",
          color: "text.secondary",
        }}
      >
        {isUpcoming ? "Coming " : ""}
        {formatIssueDate(issue.releasedAt)}
      </Typography>
    </Stack>
  );

  const titleEl = (
    <Typography
      sx={{
        fontSize: 18,
        fontWeight: 700,
        lineHeight: "24px",
        letterSpacing: "-0.4px",
        color: "text.primary",
      }}
    >
      {issue.title}
    </Typography>
  );

  const descriptionEl = (
    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: "-0.2px",
        color: "text.secondary",
      }}
    >
      {issue.description}
    </Typography>
  );

  // Time split: video/segment time vs the hands-on demo. Both are authored on the
  // issue and sum to durationMinutes, so the card never contradicts the "under 60
  // minutes per module" promise made in the hero and pricing dialog.
  const durationRow = (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.25}
      sx={{ flexWrap: "wrap", rowGap: 0.5 }}
    >
      <DurationItem Icon={Clock} label={`${issue.learningMinutes} min learning`} />
      {issue.handsOnMinutes > 0 && (
        <>
          <Dot />
          <DurationItem
            Icon={FlaskConical}
            label={`${issue.handsOnMinutes} min hands-on`}
          />
        </>
      )}
    </Stack>
  );

  const primaryButton = (fullWidth: boolean) => (
    <Button
      variant="contained"
      disableElevation
      disabled={loading}
      startIcon={
        isLocked ? (
          <Lock size={16} strokeWidth={2.25} />
        ) : loading ? (
          <CircularProgress size={16} thickness={5} sx={{ color: "inherit" }} />
        ) : undefined
      }
      onClick={(e) => {
        e.stopPropagation();
        onStart();
      }}
      sx={(theme) => ({
        height: 44,
        px: 2.5,
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "-0.2px",
        lineHeight: "22px",
        borderRadius: "8px",
        width: fullWidth ? "100%" : "auto",
        textTransform: "none",
        whiteSpace: "nowrap",
        boxShadow: "none",
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          bgcolor: theme.palette.primary.main,
          filter: "brightness(0.93)",
          boxShadow: "none",
        },
        "&.Mui-disabled": {
          bgcolor: theme.palette.action.disabledBackground,
          color: theme.palette.text.disabled,
        },
      })}
    >
      {ctaLabel}
    </Button>
  );

  // Upcoming cards carry a demand signal instead of a dead "Coming soon" label.
  // Marking interest is one-way: once recorded the button locks into a settled
  // confirmation, so the count can't be walked back or double-counted. It stays
  // full-colour while disabled — this is a completed action, not an unavailable one.
  const interestButton = (fullWidth: boolean) => (
    <Button
      variant="outlined"
      disabled={interested}
      onClick={(e) => {
        e.stopPropagation();
        markInterested();
      }}
      startIcon={
        interested ? (
          <Check size={16} strokeWidth={2.5} />
        ) : (
          <Bell size={16} strokeWidth={2.25} />
        )
      }
      sx={(theme) => ({
        height: 44,
        px: 2.5,
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "-0.2px",
        lineHeight: "22px",
        borderRadius: "8px",
        width: fullWidth ? "100%" : "auto",
        textTransform: "none",
        whiteSpace: "nowrap",
        color: theme.palette.primary.main,
        borderColor: theme.palette.outlineVariant.main,
        borderWidth: "1px",
        "&:hover": {
          borderWidth: "1px",
          borderColor: theme.palette.outlineVariant.main,
          bgcolor: theme.palette.primary.light,
        },
        "&.Mui-disabled": {
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          bgcolor: theme.palette.primary.light,
        },
      })}
    >
      {interested ? "Interested" : "I'm Interested"}
    </Button>
  );

  const handsOnButton = (fullWidth: boolean) => (
    <Button
      variant="outlined"
      disabled={loading}
      onClick={(e) => {
        e.stopPropagation();
        onTryHandsOn();
      }}
      sx={(theme) => ({
        height: 44,
        px: 2.5,
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "-0.2px",
        lineHeight: "22px",
        borderRadius: "8px",
        width: fullWidth ? "100%" : "auto",
        textTransform: "none",
        whiteSpace: "nowrap",
        // Prod @gl/elements "outlined": transparent bg, subtle outlineVariant border, primary text.
        color: theme.palette.primary.main,
        borderColor: theme.palette.outlineVariant.main,
        borderWidth: "1px",
        "&:hover": {
          borderWidth: "1px",
          borderColor: theme.palette.outlineVariant.main,
          bgcolor: theme.palette.primary.light,
        },
      })}
    >
      Hands-on demo
    </Button>
  );

  const actionRow = (fullWidth: boolean) => (
    <Stack
      direction={fullWidth ? "column" : "row"}
      gap={1.25}
      sx={{ mt: 2, width: fullWidth ? "100%" : "auto" }}
    >
      {isUpcoming ? (
        interestButton(fullWidth)
      ) : (
        <>
          {primaryButton(fullWidth)}
          {canShowHandsOn && handsOnButton(fullWidth)}
        </>
      )}
    </Stack>
  );

  const outcomesBlock = outcomes.length > 0 && (
    <Stack gap={1.25} sx={{ mt: 0.5 }}>
      {outcomes.map((o, i) => (
        <Stack
          key={i}
          direction="row"
          gap={1.25}
          alignItems="center"
          sx={{ minWidth: 0 }}
        >
          <Box
            sx={(theme) => ({
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.primary.main,
            })}
          >
            <Check size={16} strokeWidth={2.5} />
          </Box>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "-0.2px",
              color: "text.primary",
            }}
          >
            {o}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Card
      onClick={onCardClick}
      sx={(theme) => ({
        cursor: isUpcoming ? "default" : "pointer",
        p: { xs: 2.5, md: 3 },
        borderRadius: "12px",
        opacity: isLocked ? 0.78 : 1,
        transition:
          "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        "&:hover": isUpcoming
          ? undefined
          : isLocked
          ? { borderColor: theme.palette.outlineVariant.main }
          : {
              transform: "translateY(-1px)",
              borderColor: theme.palette.primary.main,
              boxShadow: "0 6px 22px rgba(0, 84, 214, 0.10)",
            },
      })}
    >
      {/* Desktop layout (md+) — single column under header, then a bottom action row */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Stack direction="row" gap={3} alignItems="flex-start">
          <ToolLogo issue={issue} />
          <Stack gap={1} sx={{ flex: 1, minWidth: 0 }}>
            <Stack gap={0.75} sx={{ minWidth: 0 }}>
              {eyebrowRow}
              {titleEl}
              {descriptionEl}
            </Stack>
            {durationRow}
            {outcomesBlock}
            {actionRow(false)}
          </Stack>
        </Stack>
      </Box>

      {/* Mobile + tablet layout (xs/sm) — logo top, then eyebrow + title + description + outcomes stacked, action row at bottom (full-width buttons). */}
      <Stack gap={2} sx={{ display: { xs: "flex", md: "none" } }}>
        <ToolLogo issue={issue} />
        <Stack gap={0.75}>
          {eyebrowRow}
          {titleEl}
        </Stack>
        {descriptionEl}
        {durationRow}
        {outcomesBlock}
        {actionRow(true)}
      </Stack>
    </Card>
  );
}

function ToolLogo({ issue }: { issue: PulseIssue }) {
  const fallback = (issue.toolName ?? issue.title).charAt(0).toUpperCase();
  return (
    <Avatar
      src={issue.toolLogo ?? undefined}
      alt={issue.toolName ?? issue.title}
      variant="rounded"
      sx={(theme) => ({
        width: 64,
        height: 64,
        bgcolor: theme.palette.primary.light,
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        fontSize: 22,
        fontWeight: 700,
        borderRadius: "10.67px",
        flexShrink: 0,
        overflow: "hidden",
        "& img": { objectFit: "cover", width: "100%", height: "100%" },
      })}
    >
      {fallback}
    </Avatar>
  );
}

function DurationItem({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
      <Box
        sx={(theme) => ({
          flexShrink: 0,
          display: "flex",
          color: theme.palette.primary.main,
        })}
      >
        <Icon size={14} strokeWidth={2} />
      </Box>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          letterSpacing: "-0.1px",
          color: "text.secondary",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

function Dot() {
  return (
    <Box
      sx={(theme) => ({
        width: 3,
        height: 3,
        borderRadius: "1.5px",
        bgcolor: theme.palette.text.secondary,
        opacity: 0.6,
      })}
    />
  );
}
