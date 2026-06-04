import { Box, Card, Stack, Typography } from "@mui/material";
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
        "&:hover": { bgcolor: "surfaceContainer.low" },
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 500,
          color: "primary.main",
          mb: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {course}
      </Typography>

      <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1 }}>
        <Box sx={{ color: "text.primary", display: "flex", flexShrink: 0 }}>
          <Icon size={18} strokeWidth={2} />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
      </Stack>

      <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
        {when}
      </Typography>
    </Card>
  );
}
