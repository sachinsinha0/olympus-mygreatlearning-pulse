import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ChevronDown, ChevronUp, PlayCircle, FileText, BookOpen, ChevronRight, CheckCircle2, Download } from "lucide-react";

type VideoItem = { id: string; title: string; duration: string };
type ResourceItem = { id: string; title: string; size?: string; viewed?: boolean };

type Props = {
  label: string;
  videosCount: number;
  resourcesCount: number;
  progress: number;
  expandedDefault?: boolean;
  videos?: VideoItem[];
  presentations?: ResourceItem[];
  readings?: ResourceItem[];
  highlightedId?: string;
};

export function SectionAccordion({
  label,
  videosCount,
  resourcesCount,
  progress,
  expandedDefault,
  videos,
  presentations,
  readings,
  highlightedId,
}: Props) {
  const [open, setOpen] = useState(!!expandedDefault);
  const hasContent = (videos?.length ?? 0) + (presentations?.length ?? 0) + (readings?.length ?? 0) > 0;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: open ? "primary.main" : "outlineVariant.main",
        borderRadius: "8px",
        bgcolor: "surfaceContainer.highest",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setOpen((v) => !v)}
        sx={{ px: 3, py: 2.5, cursor: "pointer" }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "24px",
              color: open ? "primary.main" : "text.primary",
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px", mb: 0.75 }}>
            {videosCount} Videos · {resourcesCount} Resources
          </Typography>
          <Stack direction="row" alignItems="center" gap={1} sx={{ maxWidth: 240 }}>
            <Box
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: "outlineVariant.main",
                overflow: "hidden",
              }}
            >
              <Box
                sx={(theme) => ({
                  width: `${progress}%`,
                  height: "100%",
                  bgcolor: open ? theme.palette.primary.main : "#757680",
                  borderRadius: 2,
                })}
              />
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
              {progress}%
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ color: "text.primary", display: "flex", alignItems: "center" }}>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Box>
      </Stack>

      {open && hasContent && (
        <Stack gap={1.25} sx={{ px: 3, pb: 3 }}>
          {videos?.map((v, i) => (
            <ContentRow
              key={v.id}
              icon={<PlayCircle size={18} />}
              title={`${i + 1} ${v.title}`}
              subtitle={v.duration}
              highlighted={v.id === highlightedId}
            />
          ))}
          {presentations && presentations.length > 0 && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", mt: 0.5, mb: 0.25 }}>
                Presentations
              </Typography>
              {presentations.map((p) => (
                <ContentRow
                  key={p.id}
                  icon={<FileText size={18} />}
                  title={p.title}
                  subtitle={p.size}
                  rightSlot={
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      {p.viewed && <ViewedTag />}
                      <Download size={16} color="#45464f" />
                    </Stack>
                  }
                />
              ))}
            </>
          )}
          {readings?.map((r) => (
            <ContentRow
              key={r.id}
              icon={<BookOpen size={18} />}
              title={r.title}
              rightSlot={r.viewed ? <ViewedTag /> : undefined}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function ViewedTag() {
  return (
    <Stack direction="row" alignItems="center" gap={0.5} sx={(theme) => ({ color: theme.palette.extended.success.color })}>
      <CheckCircle2 size={14} />
      <Typography sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.2px" }}>Viewed</Typography>
    </Stack>
  );
}

function ContentRow({
  icon,
  title,
  subtitle,
  rightSlot,
  highlighted,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={(theme) => ({
        px: 2,
        py: 1.5,
        border: 1,
        borderColor: highlighted ? theme.palette.primary.main : "outlineVariant.main",
        borderRadius: "8px",
        bgcolor: highlighted ? theme.palette.primary.light : "surfaceContainer.highest",
        cursor: "pointer",
        "&:hover": { borderColor: "primary.main" },
      })}
    >
      <Box sx={{ color: "text.primary", display: "flex", alignItems: "center" }}>{icon}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary", letterSpacing: "-0.2px" }} noWrap>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px", mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {rightSlot}
      <ChevronRight size={18} color="#45464f" />
    </Stack>
  );
}
