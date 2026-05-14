import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatIssueDate, formatDuration, formatNumber } from "../../lib/format";
import { usePulseCta } from "../../lib/pulse/cta";
import { stage, showStars } from "../../lib/pulse/socialProof";
import { useRelease } from "../../lib/pulse/release";
import { useUnitLabel } from "../../lib/pulse/terminology";
import { IssueCover } from "./IssueCover";

type StatItem = { value: React.ReactNode; label: string };

export function DetailHero({ issue }: { issue: PulseIssue }) {
  const unit = useUnitLabel();
  const cta = usePulseCta(issue.courseUrl);
  const { stats } = issue;
  const s = stage(issue);
  const { release } = useRelease();
  const isV1 = release === "v1";
  const segments = issue.curriculum.filter((c) => c.type === "segment").length;
  const demos = issue.curriculum.filter((c) => c.type === "demo").length;

  const statItems: StatItem[] = [
    { value: formatDuration(issue.durationMinutes), label: "Total" },
  ];

  if (isV1) {
    statItems.push({
      value: formatNumber(segments),
      label: segments === 1 ? "Segment" : "Segments",
    });
    statItems.push({
      value: formatNumber(demos),
      label: demos === 1 ? "Hands-on demo" : "Hands-on demos",
    });
  } else if (s === "fresh") {
    statItems.push({
      value: formatNumber(stats.weeklyReaders),
      label: "Reading this week",
    });
  } else {
    if (showStars(issue)) {
      statItems.push({
        value: (
          <Stack
            direction="row"
            gap={0.5}
            alignItems="baseline"
            component="span"
            sx={{ display: "inline-flex" }}
          >
            <span>{stats.ratingAvg.toFixed(1)}</span>
            <Box component="span" sx={{ color: "primary.main", fontSize: 16 }}>
              ★
            </Box>
          </Stack>
        ),
        label: `Rating (${formatNumber(stats.ratingCount)})`,
      });
    }
    statItems.push({
      value: formatNumber(stats.completionCount),
      label: "Completed",
    });
    statItems.push({
      value: formatNumber(stats.weeklyReaders),
      label: "Reading this week",
    });
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
        gap: { xs: 2.5, md: 4 },
        alignItems: "center",
      }}
    >
      <Stack gap={1.5}>
        <Stack direction="row" gap={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: "primary.main",
            }}
          >
            Pulse · {unit.numbered(issue.issueNumber)}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.disabled" }}>·</Typography>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            {formatIssueDate(issue.releasedAt)}
          </Typography>
        </Stack>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 24, md: 30 },
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.8px",
            color: "text.primary",
          }}
        >
          {issue.title}
        </Typography>

        <Typography
          sx={{
            fontSize: 15,
            lineHeight: 1.5,
            color: "text.secondary",
            maxWidth: 560,
          }}
        >
          {issue.description}
        </Typography>

        <Box
          sx={(theme) => ({
            mt: 1,
            display: "grid",
            gridTemplateColumns: `repeat(${statItems.length}, minmax(0, auto))`,
            columnGap: { xs: 2.5, md: 3.5 },
            rowGap: 1,
            borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
            borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
            py: 1.5,
            alignItems: "center",
          })}
        >
          {statItems.map((s, i) => (
            <Box
              key={s.label}
              sx={(theme) => ({
                position: "relative",
                pl: i === 0 ? 0 : { xs: 2.5, md: 3.5 },
                "&::before":
                  i === 0
                    ? undefined
                    : {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "15%",
                        bottom: "15%",
                        width: "1px",
                        background: theme.palette.outlineVariant.main,
                      },
              })}
            >
              <Typography
                component="div"
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.4px",
                  color: "text.primary",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  color: "text.secondary",
                  mt: 0.25,
                }}
              >
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 1 }}>
          <Button
            variant="contained"
            disableElevation
            endIcon={<ArrowRight size={16} />}
            onClick={cta.onClick}
            sx={{ height: 40, px: 2.5, fontSize: 14 }}
          >
            {cta.label}
          </Button>
        </Box>
      </Stack>

      <Box>
        <IssueCover issue={issue} variant="editorial" />
      </Box>
    </Box>
  );
}

