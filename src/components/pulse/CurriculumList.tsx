import { Box, Stack, Typography } from "@mui/material";
import { BookOpen, FileQuestion, FlaskConical, MessagesSquare } from "lucide-react";
import type { CurriculumItem } from "../../lib/pulse/types";

const META: Record<
  CurriculumItem["type"],
  { Icon: typeof BookOpen; tint: "primary" | "warning" | "success" | "default" }
> = {
  segment: { Icon: BookOpen, tint: "primary" },
  tyu: { Icon: FileQuestion, tint: "warning" },
  demo: { Icon: FlaskConical, tint: "success" },
  discussion: { Icon: MessagesSquare, tint: "default" },
};

function Row({ item }: { item: CurriculumItem }) {
  const { Icon, tint } = META[item.type];
  const trailing =
    item.type === "segment"
      ? `${item.duration} min read`
      : item.type === "tyu"
      ? `${item.questions} questions`
      : item.type === "demo"
      ? `${item.duration} min hands-on`
      : "Cohort thread";
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.5}
      sx={{
        py: 1.25,
        px: 1.5,
        borderRadius: "8px",
        bgcolor: "surfaceContainer.high",
        "&:not(:last-of-type)": { mb: 0.5 },
      }}
    >
      <Box
        sx={(theme) => {
          const map = {
            primary: { bg: theme.palette.primary.light, fg: theme.palette.primary.main },
            warning: {
              bg: theme.palette.extended.warning.colorContainer,
              fg: theme.palette.extended.warning.color,
            },
            success: {
              bg: theme.palette.extended.success.colorContainer,
              fg: theme.palette.extended.success.color,
            },
            default: {
              bg: theme.palette.surfaceContainer.highest,
              fg: theme.palette.text.secondary,
            },
          } as const;
          const { bg, fg } = map[tint];
          return {
            width: 32,
            height: 32,
            borderRadius: "8px",
            bgcolor: bg,
            color: fg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          };
        }}
      >
        <Icon size={16} />
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary", flex: 1 }}>
        {item.title}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {trailing}
      </Typography>
    </Stack>
  );
}

export function CurriculumList({ items }: { items: CurriculumItem[] }) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "text.primary" }}>
        What's inside
      </Typography>
      <Box>
        {items.map((item, i) => (
          <Row key={i} item={item} />
        ))}
      </Box>
    </Box>
  );
}
