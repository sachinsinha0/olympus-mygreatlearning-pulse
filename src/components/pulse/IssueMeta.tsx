import { Stack, Typography } from "@mui/material";
import { Clock, Star, Users } from "lucide-react";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatDuration } from "../../lib/format";
import { useRelease } from "../../lib/pulse/release";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString();
}

export function IssueMeta({ issue }: { issue: PulseIssue }) {
  const { ratingAvg, ratingCount, completionCount } = issue.stats;
  const { release } = useRelease();
  const isV1 = release === "v1";
  const hasRating = !isV1 && ratingCount > 0;
  const hasCompletions = !isV1 && completionCount > 0;

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{ color: "text.secondary", flexWrap: "wrap", rowGap: 0.5 }}
    >
      <Stack direction="row" gap={0.5} alignItems="center">
        <Clock size={14} />
        <Typography variant="caption">{formatDuration(issue.durationMinutes)}</Typography>
      </Stack>

      {hasRating && (
        <>
          <Dot />
          <Stack
            direction="row"
            gap={0.5}
            alignItems="center"
            sx={(theme) => ({ color: theme.palette.extended.amber.color })}
          >
            <Star size={13} fill="currentColor" strokeWidth={0} />
            <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600 }}>
              {ratingAvg.toFixed(1)}
            </Typography>
            <Typography variant="caption">({formatCount(ratingCount)})</Typography>
          </Stack>
        </>
      )}

      {hasCompletions && (
        <>
          <Dot />
          <Stack direction="row" gap={0.5} alignItems="center">
            <Users size={13} />
            <Typography variant="caption">{formatCount(completionCount)} completed</Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
}

function Dot() {
  return (
    <Typography variant="caption" sx={{ opacity: 0.5 }}>
      ·
    </Typography>
  );
}
