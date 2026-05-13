import { Box, Card, Stack } from "@mui/material";
import { TopNav } from "../components/TopNav/TopNav";
import { ContinueLearning } from "../components/dashboard/ContinueLearning";
import { ActivitiesSummary } from "../components/dashboard/ActivitiesSummary";
import { ProgressTracker } from "../components/dashboard/ProgressTracker";
import { ReferEarnCarousel } from "../components/dashboard/ReferEarnCarousel";

export function Dashboard() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: 0, pt: 3, pb: 6 }}>
        <Stack direction="row" gap={2} alignItems="flex-start">
          {/* Main column: single combined card */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card sx={{ p: 2 }}>
              <ContinueLearning />
              <ActivitiesSummary />
            </Card>
          </Box>
          {/* Sidebar */}
          <Box sx={{ width: 400, flexShrink: 0 }}>
            <Stack gap={2}>
              <ProgressTracker />
              <ReferEarnCarousel />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
