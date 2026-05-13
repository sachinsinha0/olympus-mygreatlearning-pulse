import { Box, Stack, Typography } from "@mui/material";
import { Newspaper, Code2, BookOpenText, Archive } from "lucide-react";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

const issues = issuesData as PulseIssue[];

type StatItem = { label: string; value: string };
type ArtifactItem = { Icon: typeof Newspaper; name: string; body: string };

const STATS: StatItem[] = [
  { label: "Cadence", value: "Every 2 wks" },
  { label: "Per release", value: "45 min" },
  { label: "Archive", value: `${issues.length} Courses` },
  { label: "Format", value: "Lab + code" },
];

const ARTIFACTS: ArtifactItem[] = [
  {
    Icon: Newspaper,
    name: "The brief",
    body: "5-min video. What shipped, why it matters.",
  },
  {
    Icon: Code2,
    name: "The lab",
    body: "30-min build. Working repo, guided walkthrough.",
  },
  {
    Icon: BookOpenText,
    name: "The playbook",
    body: "1-pager. When to use, when not, what breaks.",
  },
  {
    Icon: Archive,
    name: "The archive",
    body: "Every release stays. Searchable, dated, yours.",
  },
];

export function PulseAtAGlance() {
  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        borderRadius: "12px",
        bgcolor: "surfaceContainer.highest",
        overflow: "hidden",
      })}
    >
      {/* Stats strip */}
      <Box
        sx={(theme) => ({
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          "& > div": {
            p: 2,
            position: "relative",
          },
          "& > div:not(:first-of-type)::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 12,
            bottom: 12,
            width: "1px",
            background: theme.palette.outlineVariant.main,
            display: { xs: "none", md: "block" },
          },
        })}
      >
        {STATS.map((s) => (
          <Stack key={s.label} gap={0.5}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              {s.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: "-0.3px",
                color: "text.primary",
              }}
            >
              {s.value}
            </Typography>
          </Stack>
        ))}
      </Box>

      <Box
        sx={(theme) => ({
          borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
          px: 2,
          pt: 2.25,
          pb: 2.5,
        })}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: "text.secondary",
            mb: 2,
          }}
        >
          Every release includes
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            columnGap: 3,
            rowGap: 2.25,
          }}
        >
          {ARTIFACTS.map(({ Icon, name, body }) => (
            <Stack key={name} gap={0.75}>
              <Box sx={{ color: "text.primary", display: "flex" }}>
                <Icon size={20} strokeWidth={1.75} />
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  letterSpacing: "-0.2px",
                  color: "text.primary",
                }}
              >
                {name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  color: "text.secondary",
                }}
              >
                {body}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
