import { Box, Card, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  CheckCircle2,
  XCircle,
  MessagesSquare,
  MonitorPlay,
  Handshake,
  Briefcase,
  Lightbulb,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { RatingChip } from "./parts";
import type { SkillRating } from "./mockData";

const SKILL_ICONS: Record<SkillRating["icon"], LucideIcon> = {
  communication: MessagesSquare,
  presentation: MonitorPlay,
  handshake: Handshake,
  work: Briefcase,
  idea: Lightbulb,
  book: BookOpen,
};

export function SkillCard({ skill }: { skill: SkillRating }) {
  const theme = useTheme();
  const Icon = SKILL_ICONS[skill.icon] ?? MessagesSquare;
  return (
    <Card sx={{ p: 2.5, flex: 1, minWidth: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            <Icon size={20} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{skill.title}</Typography>
        </Stack>
        <RatingChip rating={skill.rating} />
      </Stack>
      <Stack gap={1.5}>
        {skill.points.map((p, i) => (
          <Stack key={i} direction="row" gap={1.25} alignItems="flex-start">
            {p.positive ? (
              <CheckCircle2 size={20} color={theme.palette.extended.green.color} style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <XCircle size={20} color={theme.palette.error.main} style={{ flexShrink: 0, marginTop: 1 }} />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {p.text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
