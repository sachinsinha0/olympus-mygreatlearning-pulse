import { Box, Stack, Typography, IconButton, Button, LinearProgress, CircularProgress, Chip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { X, PieChart, RefreshCw, MoreVertical, Award, AudioLines, type LucideIcon } from "lucide-react";
import { report, type Score } from "./mockData";

/** Icon for a given score type. */
export const SCORE_ICONS: Record<string, LucideIcon> = {
  transcribe: Award,
  voice: AudioLines,
};

/**
 * The single, consistent action slot that lives in the title row.
 * Today it holds "Trigger Voice Analysis" + an overflow menu, but the point of
 * a dedicated slot is that the set of CTAs can change without moving.
 */
export function HeaderActions() {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
      <Button
        variant="outlined"
        startIcon={<RefreshCw size={18} />}
        sx={{ height: 40, borderColor: alpha(theme.palette.primary.main, 0.4), color: "primary.main" }}
      >
        Trigger Voice Analysis
      </Button>
      <IconButton aria-label="More actions" sx={{ border: `1px solid ${theme.palette.outlineVariant.main}`, borderRadius: "4px", width: 40, height: 40 }}>
        <MoreVertical size={18} />
      </IconButton>
    </Stack>
  );
}

/** Sticky white bar at the very top: candidate name • email … close. */
export function CandidateBar() {
  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "surfaceContainer.highest",
        borderBottom: 1,
        borderColor: "outlineVariant.main",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 3 },
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }} noWrap>
          {report.candidate.name}
        </Typography>
        <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.secondary", opacity: 0.5 }} />
        <Typography variant="body2" color="text.secondary" noWrap>
          {report.candidate.email}
        </Typography>
      </Stack>
      <IconButton aria-label="Close" size="small">
        <X size={20} />
      </IconButton>
    </Box>
  );
}

/** Interview title row: donut icon in a tinted tile + title + role · date. */
export function InterviewTitle({ compact = false }: { compact?: boolean }) {
  const theme = useTheme();
  const tile = compact ? 48 : 60;
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Box
        sx={{
          width: tile,
          height: tile,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        <PieChart size={compact ? 24 : 30} strokeWidth={2.2} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: compact ? 18 : 20, lineHeight: 1.3 }}>
          {report.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {report.role} • {report.date}
        </Typography>
      </Box>
    </Stack>
  );
}

/** Horizontal score tile (icon + label + value + progress bar). */
export function ScoreTile({ score, emphasis = false }: { score: Score; emphasis?: boolean }) {
  const theme = useTheme();
  const Icon = SCORE_ICONS[score.icon];
  const pct = score.value == null ? 0 : (score.value / score.max) * 100;
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 220,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: "4px",
        p: 2,
        bgcolor: emphasis ? alpha(theme.palette.primary.main, 0.06) : "surfaceContainer.main",
        border: `1px solid ${emphasis ? alpha(theme.palette.primary.main, 0.16) : theme.palette.outlineVariant.main}`,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette.primary.main, 0.12),
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {score.label}
        </Typography>
        <Stack direction="row" alignItems="baseline" gap={0.5} sx={{ mb: 0.75 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 26, lineHeight: 1 }}>
            {score.value ?? "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            / {score.max}
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={pct} sx={{ height: 6 }} />
      </Box>
    </Box>
  );
}

/** Circular gauge score (number in the center of a ring). */
export function CircularScore({ score, size = 116 }: { score: Score; size?: number }) {
  const theme = useTheme();
  const pct = score.value == null ? 0 : (score.value / score.max) * 100;
  return (
    <Stack alignItems="center" gap={1}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" value={100} size={size} thickness={4.5} sx={{ color: alpha(theme.palette.primary.main, 0.14) }} />
        <CircularProgress
          variant="determinate"
          value={pct}
          size={size}
          thickness={4.5}
          sx={{ color: "primary.main", position: "absolute", left: 0, strokeLinecap: "round" }}
        />
        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontWeight: 700, fontSize: size * 0.26, lineHeight: 1 }}>{score.value ?? "—"}</Typography>
          <Typography variant="caption" color="text.secondary">/ {score.max}</Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {score.label}
      </Typography>
    </Stack>
  );
}

/** Green / amber / red MUI Chip used for skill ratings. */
export function RatingChip({ rating }: { rating: string }) {
  const theme = useTheme();
  const map: Record<string, string> = {
    Excellent: theme.palette.extended.green.color,
    Good: theme.palette.extended.green.color,
    Average: theme.palette.extended.amber.color,
    "Below Average": theme.palette.error.main,
  };
  const color = map[rating] ?? theme.palette.text.secondary;
  return (
    <Chip
      label={rating}
      variant="outlined"
      size="small"
      sx={{ color, borderColor: alpha(color, 0.4), fontWeight: 600, fontSize: 13 }}
    />
  );
}
