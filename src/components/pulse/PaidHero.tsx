import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatIssueDate, formatDuration } from "../../lib/format";
import { usePricing } from "../../lib/pulse/pricing";
import { IssueCover } from "./IssueCover";

type Props = {
  thisWeek: PulseIssue;
  inProgress?: PulseIssue;
};

export function PaidHero({ thisWeek, inProgress }: Props) {
  const navigate = useNavigate();
  const { state, openPricingModal } = usePricing();
  const goToIssue = (id: string) => {
    if (state === "expired") openPricingModal();
    else navigate(`/pulse/issue/${id}`);
  };
  const goToCourse = (url: string) => {
    if (state === "expired") openPricingModal();
    else window.location.href = url;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: inProgress ? "1.6fr 1fr" : "1fr" },
        gap: { xs: 2.5, md: 3 },
      }}
    >
      <Box
        onClick={() => goToIssue(thisWeek.id)}
        sx={{
          border: 1,
          borderColor: "outlineVariant.main",
          borderRadius: "16px",
          bgcolor: "surfaceContainer.highest",
          p: 3,
          cursor: "pointer",
          transition: "border-color 120ms ease",
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} gap={3} alignItems={{ md: "center" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: "primary.main",
                mb: 1,
              }}
            >
              This week's release · Release {String(thisWeek.issueNumber).padStart(2, "0")}
            </Typography>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
                color: "text.primary",
                mb: 1.25,
              }}
            >
              {thisWeek.title}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5, mb: 1.5 }}>
              {thisWeek.description}
            </Typography>
            <Stack direction="row" gap={1.5} alignItems="center" sx={{ color: "text.secondary", flexWrap: "wrap", mb: 2 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                {formatDuration(thisWeek.durationMinutes)}
              </Typography>
              <Dot />
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{formatIssueDate(thisWeek.releasedAt)}</Typography>
            </Stack>
            <Button
              variant="contained"
              disableElevation
              endIcon={<ArrowRight size={16} />}
              sx={{ height: 40, px: 2.5, fontSize: 14 }}
            >
              Start
            </Button>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 240 }, flexShrink: 0 }}>
            <IssueCover issue={thisWeek} variant="editorial" />
          </Box>
        </Stack>
      </Box>

      {inProgress && (
        <Box
          onClick={() => goToCourse(inProgress.courseUrl)}
          sx={{
            border: 1,
            borderColor: "outlineVariant.main",
            borderRadius: "16px",
            bgcolor: "surfaceContainer.highest",
            p: 3,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            transition: "border-color 120ms ease",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <Stack direction="row" gap={2.5} sx={{ flex: 1 }}>
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                Continue where you left
              </Typography>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: "-0.3px",
                  color: "text.primary",
                  mb: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {inProgress.title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px", mb: "auto" }}>
                {minsLeft(inProgress)} min left of {formatDuration(inProgress.durationMinutes)}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 140,
                flexShrink: 0,
                alignSelf: "stretch",
                display: "flex",
                alignItems: "stretch",
                "& > *": { width: "100%", height: "100%" },
              }}
            >
              <IssueCover issue={inProgress} variant="editorial" />
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ mt: 2.5, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={inProgress.progress ?? 0}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: "outlineVariant.main",
                "& .MuiLinearProgress-bar": { bgcolor: "primary.main", borderRadius: 2 },
              }}
            />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
              {inProgress.progress ?? 0}%
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            disableElevation
            startIcon={<Play size={14} fill="currentColor" />}
            sx={{
              height: 40,
              px: 2.5,
              fontSize: 14,
              fontWeight: 500,
              borderColor: "primary.main",
              color: "primary.main",
              alignSelf: "flex-start",
              "&:hover": { bgcolor: "primary.light", borderColor: "primary.main" },
            }}
          >
            Resume
          </Button>
        </Box>
      )}
    </Box>
  );
}

function Dot() {
  return <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "text.disabled", opacity: 0.5 }} />;
}

function minsLeft(issue: PulseIssue): number {
  const pct = Math.max(0, Math.min(100, issue.progress ?? 0));
  return Math.max(1, Math.round(issue.durationMinutes * (1 - pct / 100)));
}
