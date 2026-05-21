import { Box, IconButton, Stack, Typography } from "@mui/material";
import { BookOpen, CheckCircle2, Compass, FileQuestion, PlayCircle, X } from "lucide-react";
import type { CourseItem, CourseSection } from "../../lib/pulse/types";
import { useLearningProgress } from "../../lib/pulse/learningProgress";

export function ConsumeRail({
  sections,
  activeItemId,
  activeSectionId,
  onItemSelect,
  onClose,
  showCloseButton = true,
}: {
  sections: CourseSection[];
  activeItemId: string;
  activeSectionId?: string;
  onItemSelect: (itemId: string) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}) {
  return (
    <Stack
      sx={(theme) => ({
        height: "100%",
        bgcolor: theme.palette.background.default,
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={(theme) => ({
          px: 3,
          py: 2.5,
          borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
        })}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary", letterSpacing: "-0.3px" }}>
          Learning
        </Typography>
        {showCloseButton && (
          <IconButton onClick={onClose} size="small" disableRipple>
            <X size={20} />
          </IconButton>
        )}
      </Stack>
      <Stack
        gap={2}
        sx={{
          p: 2.5,
          overflow: "auto",
          flex: 1,
          minHeight: 0,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.18) transparent",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.18)", borderRadius: 999 },
          "&::-webkit-scrollbar-thumb:hover": { background: "rgba(0,0,0,0.32)" },
        }}
      >
        {sections.map((section, i) => (
          <SectionCard
            key={section.id}
            section={section}
            index={i}
            activeItemId={activeItemId}
            defaultExpanded={section.id === activeSectionId}
            onItemSelect={onItemSelect}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function SectionCard({
  section,
  index,
  activeItemId,
  onItemSelect,
}: {
  section: CourseSection;
  index: number;
  activeItemId: string;
  defaultExpanded?: boolean;
  onItemSelect: (itemId: string) => void;
}) {
  const { hasItemCompleted } = useLearningProgress();
  const items = section.items ?? [];
  const total = items.length;
  const completed = items.filter((it) => hasItemCompleted(it.id)).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : section.progress;
  const isLocked = total === 0;

  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        borderRadius: "12px",
        bgcolor: theme.palette.background.paper,
        overflow: "hidden",
        opacity: isLocked ? 0.65 : 1,
        flexShrink: 0,
      })}
    >
      <Stack
        sx={{ px: 2.5, pt: 2.25, pb: 2, gap: 0.75 }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: "primary.main",
            letterSpacing: "-0.3px",
            lineHeight: "22px",
          }}
        >
          Pulse · Release {index + 1}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.primary", letterSpacing: "-0.2px", lineHeight: "18px" }}>
          {section.videosCount} Videos · {countAssessments(section)} Assessments · {countResources(section)} Resource
        </Typography>
        {!isLocked && (
          <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.75 }}>
            <Box sx={(theme) => ({ flex: 1, height: 4, borderRadius: 2, bgcolor: theme.palette.outlineVariant.main, overflow: "hidden" })}>
              <Box sx={(theme) => ({ width: `${progress}%`, height: "100%", bgcolor: theme.palette.primary.main, borderRadius: 2, transition: "width 240ms ease" })} />
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary", letterSpacing: "-0.1px" }}>{progress}%</Typography>
          </Stack>
        )}
      </Stack>
      {total > 0 && (
        <Stack gap={2} sx={{ px: 2, pb: 2 }}>
          {items.map((it) => (
            <ItemRow
              key={it.id}
              item={it}
              active={it.id === activeItemId}
              onClick={() => onItemSelect(it.id)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function countAssessments(section: CourseSection): number {
  return (section.items ?? []).filter((i) => i.type === "tyu").length;
}

function countResources(section: CourseSection): number {
  return (section.items ?? []).filter((i) => i.type === "reading").length;
}

function ItemRow({
  item,
  active,
  onClick,
}: {
  item: CourseItem;
  active: boolean;
  onClick: () => void;
}) {
  const { hasItemCompleted } = useLearningProgress();
  const done = hasItemCompleted(item.id);
  const Icon =
    item.type === "video"
      ? PlayCircle
      : item.type === "tyu"
      ? FileQuestion
      : item.type === "overview"
      ? Compass
      : BookOpen;
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.5}
      onClick={onClick}
      sx={(theme) => ({
        height: 58,
        px: 2,
        borderRadius: "10px",
        border: `1px solid ${active ? theme.palette.primary.main : theme.palette.outlineVariant.main}`,
        bgcolor: active ? theme.palette.primary.light : theme.palette.background.default,
        cursor: "pointer",
        transition: "background-color 120ms ease, border-color 120ms ease",
        "&:hover": active ? undefined : { borderColor: theme.palette.primary.main },
      })}
    >
      <Box sx={(theme) => ({ color: active ? theme.palette.primary.main : theme.palette.text.primary, display: "flex", flexShrink: 0 })}>
        <Icon size={18} strokeWidth={2.25} />
      </Box>
      <Typography
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: 14,
          fontWeight: 500,
          color: active ? "primary.main" : "text.primary",
          letterSpacing: "-0.2px",
        }}
        noWrap
      >
        {item.title}
      </Typography>
      {done && (
        <Box sx={(theme) => ({ color: theme.palette.extended.success.color, display: "flex", flexShrink: 0 })}>
          <CheckCircle2 size={18} strokeWidth={2.25} />
        </Box>
      )}
    </Stack>
  );
}
