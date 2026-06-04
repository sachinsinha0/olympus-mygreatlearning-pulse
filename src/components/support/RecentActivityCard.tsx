import { Box, Card, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  FileText,
  PlayCircle,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export type ActivityType = "video" | "doc" | "assignment" | "quiz";

type Props = {
  course: string;
  title: string;
  when: string;
  type: ActivityType;
  onClick: () => void;
};

// Monochrome content-type icons (color is reserved for the topic grid).
const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  video: PlayCircle,
  doc: FileText,
  assignment: FileText,
  quiz: HelpCircle,
};

export function RecentActivityCard({ course, title, when, type, onClick }: Props) {
  const Icon = TYPE_ICON[type] ?? FileText;
  return (
    <Card
      onClick={onClick}
      sx={{
        border: 1,
        borderColor: "outlineVariant.main",
        borderRadius: "12px",
        boxShadow: "none",
        p: 2,
        height: "100%",
        cursor: "pointer",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
      }}
    >
      <Stack direction="row" gap={1.5} alignItems="center">
        <Box sx={{ color: "text.primary", display: "flex", flexShrink: 0 }}>
          <Icon size={24} strokeWidth={2} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "primary.main",
              mb: 0.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {course}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.primary",
              mb: 0.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
            {when}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
