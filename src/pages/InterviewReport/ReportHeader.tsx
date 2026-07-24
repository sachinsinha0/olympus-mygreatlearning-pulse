import { Box, Card, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FileText } from "lucide-react";
import { report, scores } from "./mockData";
import { InterviewTitle, HeaderActions, ScoreTile } from "./parts";

/**
 * Interview Report header card (chosen layout: "Score Tiles + Summary").
 * Title with a single header-action slot (top-right), two score tiles in a
 * strip, and the Summary sitting directly on the card below.
 */
export function ReportHeader() {
  const theme = useTheme();
  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        gap={2}
      >
        <InterviewTitle />
        <HeaderActions />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mt: 3 }}>
        {scores.map((s) => (
          <ScoreTile key={s.key} score={s} emphasis />
        ))}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <FileText size={20} color={theme.palette.primary.main} />
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>Summary</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {report.summary}
        </Typography>
      </Box>
    </Card>
  );
}
