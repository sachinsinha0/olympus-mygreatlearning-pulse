import { Box, Card, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatIssueDate, daysSince } from "../../lib/format";
import { useUnitLabel } from "../../lib/pulse/terminology";
import { IssueCover } from "./IssueCover";
import { IssueMeta } from "./IssueMeta";

export function IssueCard({ issue }: { issue: PulseIssue }) {
  const navigate = useNavigate();
  const unit = useUnitLabel();
  const isNew = daysSince(issue.releasedAt) < 7;

  return (
    <Card
      onClick={() => navigate(`/pulse/issue/${issue.id}`)}
      sx={{
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "primary.main",
          boxShadow: "0 8px 24px rgba(0, 84, 214, 0.10)",
        },
      }}
    >
      <Box sx={{ p: 1.5, pb: 0 }}>
        <IssueCover issue={issue} variant="editorial" />
      </Box>
      <Stack gap={1} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            {unit.numbered(issue.issueNumber)} · {formatIssueDate(issue.releasedAt)}
          </Typography>
          {isNew && (
            <Box
              component="span"
              sx={(theme) => ({
                px: 1,
                py: 0.25,
                fontSize: 12,
                fontWeight: 400,
                color: theme.palette.error.contrastText,
                bgcolor: theme.palette.error.main,
                borderRadius: "8px",
                letterSpacing: "-0.1px",
                lineHeight: "16px",
              })}
            >
              New
            </Box>
          )}
        </Stack>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "22px",
            letterSpacing: "-0.3px",
            color: "text.primary",
            minHeight: 44,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {issue.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 40,
          }}
        >
          {issue.description}
        </Typography>
        <IssueMeta issue={issue} />
      </Stack>
    </Card>
  );
}
