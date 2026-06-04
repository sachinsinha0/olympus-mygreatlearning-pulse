import { Box, Card, Stack, Typography } from "@mui/material";
import {
  Video,
  FileText,
  ClipboardList,
  ListChecks,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ActivityType = "video" | "doc" | "assignment" | "quiz";

type Props = {
  title: string;
  module: string;
  detectedIssue: string;
  type: ActivityType;
  onClick: () => void;
};

// Per-type tile colors sourced from the existing extended palette colorContainer/onColorContainer pairs.
const TYPE_MAP: Record<ActivityType, { Icon: LucideIcon; bg: string; color: string }> = {
  video: { Icon: Video, bg: "#ebddff", color: "#250059" }, // deepPurple
  doc: { Icon: FileText, bg: "#cae6ff", color: "#001e30" }, // lightBlue
  assignment: { Icon: ClipboardList, bg: "#ffdcc0", color: "#2d1600" }, // warning
  quiz: { Icon: ListChecks, bg: "#ffd9dc", color: "#400011" }, // rose
};

export function RecentActivityCard({ title, module, detectedIssue, type, onClick }: Props) {
  const { Icon, bg, color } = TYPE_MAP[type];
  return (
    <Card
      onClick={onClick}
      sx={{
        border: 1,
        borderColor: "outlineVariant.main",
        borderRadius: "16px",
        boxShadow: "none",
        p: 2,
        cursor: "pointer",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: "surfaceContainer.low" },
      }}
    >
      <Stack direction="row" gap={2} alignItems="flex-start">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            bgcolor: bg,
            color,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} strokeWidth={2} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: "text.primary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>
            {module}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              mt: 1,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              bgcolor: "surfaceContainer.low",
              color: "primary.main",
            }}
          >
            <Sparkles size={13} strokeWidth={2} color="currentColor" />
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary" }}>
              {detectedIssue}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
