import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { TopNav } from "../../components/TopNav/TopNav";
import { DetailHero } from "../../components/pulse/DetailHero";
import { OutcomesList } from "../../components/pulse/OutcomesList";
import { CurriculumList } from "../../components/pulse/CurriculumList";
import { CertificateBlock } from "../../components/pulse/CertificateBlock";
import { StickyEnrollBar } from "../../components/pulse/StickyEnrollBar";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

const issues = issuesData as PulseIssue[];

export function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const issue = issues.find((i) => i.id === id);

  if (!issue) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <TopNav />
        <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 6, textAlign: "center" }}>
          <Typography variant="subtitle1">Issue not found</Typography>
          <Button component={Link} to="/pulse" sx={{ mt: 2 }}>
            Back to Pulse
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 12 }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 3 }}>
        <Button
          component={Link}
          to="/pulse"
          startIcon={<ChevronLeft size={16} />}
          sx={{
            color: "text.secondary",
            mb: 2,
            "&:hover": { color: "text.primary", bgcolor: "surfaceContainer.high" },
          }}
        >
          Back to Pulse
        </Button>
        <Card sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
          <DetailHero issue={issue} />
        </Card>
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={3}
          alignItems="flex-start"
        >
          <Stack gap={3} sx={{ flex: 1, minWidth: 0 }}>
            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <OutcomesList outcomes={issue.outcomes} />
            </Card>
            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <CurriculumList items={issue.curriculum} />
            </Card>
          </Stack>
          <Stack gap={3} sx={{ width: { xs: "100%", md: 380 }, flexShrink: 0 }}>
            <CertificateBlock />
          </Stack>
        </Stack>
      </Box>
      <StickyEnrollBar issue={issue} />
    </Box>
  );
}
