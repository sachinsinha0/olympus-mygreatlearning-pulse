import { useState } from "react";
import { Avatar, Box, Button, Card, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { Check, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatIssueDate } from "../../lib/format";
import { isTrialExpired, usePricing } from "../../lib/pulse/pricing";
import { useUnitLabel } from "../../lib/pulse/terminology";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
import { usePageLoader } from "../common/PageLoader";

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
  const [loading, setLoading] = useState(false);

  const isUpcoming = status === "upcoming";
  const trialExpired = isTrialExpired(state, trialStartedAt, activeUntil);
  const isLocked = state === "expired" || trialExpired;
  const isPreTrial = state === "trial" && !trialStartedAt;
  const started = hasStarted(issue.id);

  const ctaLabel = state === "expired"
    ? "Renew to unlock"
    : trialExpired
    ? "Subscribe to unlock"
    : isPreTrial
    ? "Start 30-day trial"
    : started
    ? "Continue Learning"
    : "Start Learning";

  const navigateToModule = () => {
    markStarted(issue.id);
    runWithPageLoader(() => {
      navigate(`/pulse/course?module=${issue.id}`);
    }, 700);
  };

  const onStart = () => {
    if (loading) return;
    if (isLocked) {
      // Just opens the pricing dialog — no loader.
      openPricingModal();
      return;
    }
    if (isPreTrial) {
      // Button loader during the trial-start state change, then full-page loader for nav.
      setLoading(true);
      setTimeout(() => {
        startTrial();
        setLoading(false);
        navigateToModule();
      }, 500);
      return;
    }
    // Trial-active or paid: just full-page loader for the navigation.
    navigateToModule();
  };

  const onCardClick = isUpcoming ? undefined : onStart;
  const outcomes = issue.outcomes.slice(0, 2);

  return (
    <Card
      onClick={onCardClick}
      sx={(theme) => ({
        cursor: isUpcoming ? "default" : "pointer",
        p: 3,
        borderRadius: "14px",
        opacity: isUpcoming ? 0.65 : isLocked ? 0.78 : 1,
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
      <Stack direction="row" gap={3} alignItems="flex-start">
        <ToolLogo issue={issue} />

        <Stack gap={2} sx={{ flex: 1, minWidth: 0 }}>
          {/* Header row: title block + CTA */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={{ xs: 1.5, md: 3 }}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Stack gap={0.5} sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    lineHeight: "16px",
                    color: isUpcoming ? "text.disabled" : "primary.main",
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
                    color: isUpcoming ? "text.disabled" : "text.secondary",
                  }}
                >
                  {formatIssueDate(issue.releasedAt)}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: "20px",
                  letterSpacing: "-0.4px",
                  color: "text.primary",
                }}
              >
                {issue.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "-0.2px",
                  color: "text.secondary",
                }}
              >
                {issue.description}
              </Typography>
            </Stack>

            <Box sx={{ flexShrink: 0, alignSelf: { xs: "flex-start", md: "center" } }}>
              <Button
                variant="outlined"
                disableElevation
                disabled={isUpcoming || loading}
                startIcon={
                  isUpcoming || isLocked ? (
                    <Lock size={14} strokeWidth={2.25} />
                  ) : loading ? (
                    <CircularProgress size={14} thickness={5} sx={{ color: "inherit" }} />
                  ) : undefined
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isUpcoming) onStart();
                }}
                sx={(theme) => ({
                  height: 32,
                  px: 1.5,
                  py: 0.75,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.2px",
                  lineHeight: "20px",
                  borderRadius: "8px",
                  borderColor: theme.palette.outlineVariant.main,
                  color: theme.palette.primary.main,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: theme.palette.primary.light,
                  },
                  "&.Mui-disabled": {
                    borderColor: theme.palette.outlineVariant.main,
                    color: theme.palette.text.disabled,
                  },
                })}
              >
                {isUpcoming ? "Coming soon" : ctaLabel}
              </Button>
            </Box>
          </Stack>

          {outcomes.length > 0 && (
            <>
              <Divider
                sx={(theme) => ({
                  borderColor: theme.palette.outlineVariant.main,
                  opacity: 0.7,
                })}
              />

              <Stack gap={1}>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    lineHeight: "16.5px",
                    color: isUpcoming ? "text.disabled" : "primary.main",
                  }}
                >
                  Learning Outcomes
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    columnGap: 0.625,
                    rowGap: 0.75,
                  }}
                >
                  {outcomes.map((o, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      gap={1}
                      alignItems="center"
                      sx={{ minWidth: 0 }}
                    >
                      <Box
                        sx={(theme) => ({
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isUpcoming ? theme.palette.text.disabled : theme.palette.primary.main,
                        })}
                      >
                        <Check size={16} strokeWidth={2.25} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 400,
                          lineHeight: "16px",
                          letterSpacing: "-0.2px",
                          color: "text.primary",
                        }}
                      >
                        {o}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Stack>
            </>
          )}
        </Stack>
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
