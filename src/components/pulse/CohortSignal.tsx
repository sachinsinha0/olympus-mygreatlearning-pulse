import { Box, Card, Stack, Typography } from "@mui/material";
import { Sparkles } from "lucide-react";
import type { PulseIssue } from "../../lib/pulse/types";
import { stage, showStars } from "../../lib/pulse/socialProof";
import { formatNumber } from "../../lib/format";

type StatItem = { label: string; value: React.ReactNode };

function StatRow({ items }: { items: StatItem[] }) {
  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
        borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
        "& > div": {
          py: 1.5,
          px: 1.25,
          position: "relative",
        },
        "& > div:not(:first-of-type)::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: "1px",
          background: theme.palette.outlineVariant.main,
        },
        "& > div:first-of-type": { pl: 0 },
        "& > div:last-of-type": { pr: 0 },
      })}
    >
      {items.map((s) => (
        <Stack key={s.label} gap={0.5}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: "text.secondary",
              lineHeight: 1.2,
            }}
          >
            {s.label}
          </Typography>
          <Typography
            component="div"
            sx={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.4px",
              color: "text.primary",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {s.value}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

export function CohortSignal({ issue }: { issue: PulseIssue }) {
  const s = stage(issue);
  const { stats } = issue;

  if (s === "fresh") {
    return (
      <Card sx={{ p: 2.5 }}>
        <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1 }}>
          <Box sx={{ color: "primary.main", display: "flex" }}>
            <Sparkles size={16} />
          </Box>
          <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
            Just released
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          You're early. Be one of the first to read this release and shape the conversation.
        </Typography>
        <StatRow
          items={[
            { label: "Reading this week", value: formatNumber(stats.weeklyReaders) },
          ]}
        />
      </Card>
    );
  }

  const items: StatItem[] = [];
  if (showStars(issue)) {
    items.push({
      label: `Rating (${formatNumber(stats.ratingCount)})`,
      value: (
        <Stack direction="row" gap={0.5} alignItems="baseline">
          <span>{stats.ratingAvg.toFixed(1)}</span>
          <Box component="span" sx={{ color: "primary.main", fontSize: 18 }}>
            ★
          </Box>
        </Stack>
      ),
    });
  }
  items.push({
    label: "Completed",
    value: formatNumber(stats.completionCount),
  });
  items.push({
    label: "Reading this week",
    value: formatNumber(stats.weeklyReaders),
  });

  return (
    <Card sx={{ p: 2.5 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 1.5, color: "text.primary" }}
      >
        Cohort activity
      </Typography>
      <StatRow items={items} />
    </Card>
  );
}
