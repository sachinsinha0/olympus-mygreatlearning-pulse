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
      <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 3, pb: 6 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          gap={2}
          alignItems="stretch"
        >
          {/* Main column: single combined card */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card sx={{ p: 2 }}>
              <ContinueLearning />
              <ActivitiesSummary />
            </Card>
          </Box>
          {/* Sidebar */}
          <Box sx={{ width: { xs: "100%", lg: 400 }, flexShrink: 0 }}>
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
