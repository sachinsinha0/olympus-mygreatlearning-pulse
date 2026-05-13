import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { FileText, HelpCircle, Video, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Theme } from "@mui/material/styles";

export type ActivityType = "session" | "assignment" | "discussion" | "quiz";

const TYPE_META: Record<
  ActivityType,
  { Icon: LucideIcon; color: keyof Theme["palette"]["extended"] }
> = {
  session: { Icon: Video, color: "deepPurple" },
  assignment: { Icon: FileText, color: "rose" },
  discussion: { Icon: MessageSquare, color: "lightGreen" },
  quiz: { Icon: HelpCircle, color: "lightGreen" },
};

type Props = {
  type: ActivityType;
  category: string;
  title: string;
  when: string;
  action: string;
};

export function ActivityRow({ type, category, title, when, action }: Props) {
  const theme = useTheme();
  const { Icon, color } = TYPE_META[type];
  const ext = theme.palette.extended[color];
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        px: 2,
        py: 1.5,
        gap: 2,
        border: 1,
        borderColor: "outlineVariant.main",
        borderRadius: 1.5,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          bgcolor: ext.colorContainer,
          color: ext.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} strokeWidth={1.75} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500, lineHeight: "16px", letterSpacing: "-0.2px", color: "primary.main", display: "block", mb: 0.25 }}>
          {category}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500, lineHeight: "24px", color: "text.primary", mb: 0.25 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "-0.2px", color: "text.secondary" }}>
          {when}
        </Typography>
      </Box>
      <Button
        variant="text"
        disableRipple
        sx={{
          color: "primary.main",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.4px",
          "&:hover": { bgcolor: "transparent" },
        }}
      >
        {action}
      </Button>
    </Stack>
  );
}
