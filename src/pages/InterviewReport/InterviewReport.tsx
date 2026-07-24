import { useState } from "react";
import { Box, Card, Container, IconButton, LinearProgress, Stack, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Play, AudioLines } from "lucide-react";
import { interviewTheme } from "./theme";
import { CandidateBar, RatingChip } from "./parts";
import { ReportHeader } from "./ReportHeader";
import { SkillCard } from "./SkillCard";
import { skillRatings, questionRatings } from "./mockData";

function SkillRatingsPanel() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
        alignItems: "start",
      }}
    >
      {skillRatings.map((skill) => (
        <SkillCard key={skill.title} skill={skill} />
      ))}
    </Box>
  );
}

function QuestionRatingsPanel() {
  return (
    <Stack gap={2}>
      {questionRatings.map((q, i) => (
        <Card key={i} sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2} sx={{ mb: 1 }}>
            <Stack direction="row" gap={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, color: "primary.main", flexShrink: 0 }}>Q{i + 1}</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{q.question}</Typography>
            </Stack>
            <Box sx={{ flexShrink: 0 }}>
              <RatingChip rating={q.rating} />
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: { xs: 0, sm: "34px" } }}>
            {q.answer}
          </Typography>
        </Card>
      ))}
    </Stack>
  );
}

function RecordingPanel() {
  const theme = useTheme();
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        >
          <AudioLines size={24} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>Interview Recording</Typography>
          <Typography variant="body2" color="text.secondary">
            Data Scientist Round 1 · 18 min 42 sec
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" gap={2}>
        <IconButton
          aria-label="Play recording"
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: 44, height: 44, "&:hover": { bgcolor: "primary.dark" } }}
        >
          <Play size={20} fill="currentColor" />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <LinearProgress variant="determinate" value={32} sx={{ height: 6 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
          06:01 / 18:42
        </Typography>
      </Stack>
    </Card>
  );
}

const TABS = ["Skill Ratings", "Question Ratings", "Recording"];

export function InterviewReport() {
  const [tab, setTab] = useState(0);

  return (
    <ThemeProvider theme={interviewTheme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f2f4f7" }}>
        <CandidateBar />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <ReportHeader />

          <Box sx={{ borderBottom: 1, borderColor: "outlineVariant.main", mt: 3, mb: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              {TABS.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          </Box>

          {tab === 0 && <SkillRatingsPanel />}
          {tab === 1 && <QuestionRatingsPanel />}
          {tab === 2 && <RecordingPanel />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
