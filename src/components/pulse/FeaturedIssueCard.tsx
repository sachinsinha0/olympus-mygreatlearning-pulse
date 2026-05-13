import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { formatIssueDate, daysSince } from "../../lib/format";
import { IssueCover } from "./IssueCover";
import { IssueMeta } from "./IssueMeta";

export function FeaturedIssueCard({ issue }: { issue: PulseIssue }) {
  const navigate = useNavigate();
  const isNew = daysSince(issue.releasedAt) < 7;
  const releaseLabel = String(issue.issueNumber).padStart(2, "0");

  return (
    <Card
      onClick={() => navigate(`/pulse/issue/${issue.id}`)}
      sx={{
        cursor: "pointer",
        p: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1.1fr" },
        gap: { xs: 2, md: 3 },
        alignItems: "stretch",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 10px 30px rgba(0, 84, 214, 0.12)",
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <IssueCover issue={issue} variant="editorial" />
      </Box>
      <Stack gap={1.25} sx={{ py: 0.5, pr: 0.5, justifyContent: "space-between" }}>
        <Stack gap={1.25}>
          <Stack direction="row" gap={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              Release {releaseLabel} · {formatIssueDate(issue.releasedAt)}
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
              fontSize: { xs: 22, md: 26 },
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: "-0.6px",
              color: "text.primary",
            }}
          >
            {issue.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {issue.description}
          </Typography>
          <IssueMeta issue={issue} />
        </Stack>
        <Stack direction="row" gap={1.5} alignItems="center" justifyContent="flex-end">
          <Button
            variant="contained"
            disableElevation
            endIcon={<ArrowRight size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/pulse/issue/${issue.id}`);
            }}
            sx={{ height: 36, px: 2 }}
          >
            Start
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
