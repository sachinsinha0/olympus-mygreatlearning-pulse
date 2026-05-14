import { Avatar, Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { Check, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatIssueDate } from "../../lib/format";
import { usePricing } from "../../lib/pulse/pricing";
import { useUnitLabel } from "../../lib/pulse/terminology";

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
  const { state, trialStartedAt, openPricingModal, startTrial } = usePricing();

  const isUpcoming = status === "upcoming";
  const isLocked = state === "expired";
  const isPreTrial = state === "trial" && !trialStartedAt;

  const ctaLabel = isLocked
    ? "Renew to unlock"
    : isPreTrial
    ? "Start 30-day trial"
    : "Start";

  const onStart = () => {
    if (isLocked) {
      openPricingModal();
      return;
    }
    if (isPreTrial) startTrial();
    navigate(`/pulse/course?module=${issue.id}`);
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
        opacity: isUpcoming ? 0.65 : 1,
        transition:
          "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        "&:hover": isUpcoming
          ? undefined
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
                disabled={isUpcoming}
                startIcon={isUpcoming ? <Lock size={14} strokeWidth={2.25} /> : undefined}
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
