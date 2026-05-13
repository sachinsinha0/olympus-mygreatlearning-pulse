import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { BookOpen, Calendar, LineChart, Trophy } from "lucide-react";
import { StatRow } from "./StatRow";
import data from "../../mocks/progress.json";

export function ProgressTracker() {
  return (
    <Card sx={{ p: 2 }}>
      <Stack gap={2}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: "text.primary" }}>
            {data.programName}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "-0.2px", color: "text.secondary", mt: 0.5 }}>
            {data.programCode}
          </Typography>
        </Box>

        <Divider />

        {/* Courses stats box */}
        <Box
          sx={{
            bgcolor: "rgba(218, 225, 255, 0.16)",
            borderRadius: "8px",
            p: 1,
          }}
        >
          <Stack direction="row" alignItems="center" gap={1} sx={{ px: 1, pt: 0.5, pb: 1 }}>
            <BookOpen size={16} />
            <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: "16px", letterSpacing: "-0.2px", color: "text.primary" }}>Courses</Typography>
          </Stack>
          <Divider sx={{ mx: -1, borderColor: "rgba(0, 84, 214, 0.12)" }} />
          <Stack direction="row" alignItems="stretch" justifyContent="space-between" sx={{ pt: 1.5, pb: 0.5 }}>
            <StatCol label="COMPLETE" value={data.courses.complete} />
            <StatCol label="INCOMPLETE" value={data.courses.incomplete} />
            <StatCol label="AT RISK" value={data.courses.atRisk} />
          </Stack>
        </Box>

        <Stack gap={1}>
          <StatRow
            Icon={Calendar}
            label="Attendance"
            value={`${data.stats.attendancePct}%`}
            valueColor="error"
          />
          <StatRow Icon={LineChart} label="Scorecard" showChevron />
          <StatRow Icon={Trophy} label="Leaderboard" value={`Rank ${data.stats.rank}`} />
        </Stack>
      </Stack>
    </Card>
  );
}

function StatCol({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ flex: 1, textAlign: "center" }}>
      <Typography sx={{ fontSize: 10, fontWeight: 600, lineHeight: "16px", letterSpacing: "1.2px", textTransform: "uppercase", color: "text.primary", display: "block" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 600, lineHeight: "32px", letterSpacing: "-0.4px", color: "text.primary", mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  );
}
