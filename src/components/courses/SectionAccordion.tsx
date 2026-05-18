import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ChevronDown, ChevronUp, PlayCircle, FileText, BookOpen, ChevronRight, CheckCircle2, Download, Lock } from "lucide-react";

type VideoItem = { id: string; title: string; duration: string };
type ResourceItem = { id: string; title: string; size?: string; viewed?: boolean };

export type OrderedItem =
  | { id: string; type: "video"; title: string; duration?: string }
  | { id: string; type: "tyu"; title: string; size?: string; viewed?: boolean }
  | { id: string; type: "reading"; title: string; viewed?: boolean };

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
  locked?: boolean;
  items?: OrderedItem[];
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
  locked,
  items,
}: Props) {
  const [open, setOpen] = useState(!locked && !!expandedDefault);
  const hasItems = (items?.length ?? 0) > 0;
  const hasContent =
    hasItems || (videos?.length ?? 0) + (presentations?.length ?? 0) + (readings?.length ?? 0) > 0;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: open ? "primary.main" : "outlineVariant.main",
        borderRadius: "8px",
        bgcolor: "surfaceContainer.highest",
        overflow: "hidden",
        opacity: locked ? 0.65 : 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={locked ? undefined : () => setOpen((v) => !v)}
        sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, cursor: locked ? "default" : "pointer", gap: 1.5 }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: 15, md: 16 },
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
          {!locked && (
            <Stack direction="row" alignItems="center" gap={1} sx={{ maxWidth: { xs: "100%", sm: 240 } }}>
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
          )}
        </Box>
        <Box sx={{ color: locked ? "text.disabled" : "text.primary", display: "flex", alignItems: "center" }}>
          {locked ? (
            <Lock size={18} strokeWidth={2.25} />
          ) : open ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </Box>
      </Stack>

      {open && hasItems && (
        <Stack gap={1.25} sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2.5, md: 3 } }}>
          {items!.map((it) => {
            if (it.type === "video") {
              return (
                <ContentRow
                  key={it.id}
                  icon={<PlayCircle size={18} />}
                  title={it.title}
                  subtitle={it.duration}
                  highlighted={it.id === highlightedId}
                />
              );
            }
            if (it.type === "tyu") {
              return (
                <ContentRow
                  key={it.id}
                  icon={<FileText size={18} />}
                  title={it.title}
                  subtitle={it.size}
                  highlighted={it.id === highlightedId}
                  rightSlot={
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      {it.viewed && <ViewedTag />}
                      <Download size={16} color="#45464f" />
                    </Stack>
                  }
                />
              );
            }
            return (
              <ContentRow
                key={it.id}
                icon={<BookOpen size={18} />}
                title={it.title}
                highlighted={it.id === highlightedId}
                rightSlot={it.viewed ? <ViewedTag /> : undefined}
              />
            );
          })}
        </Stack>
      )}

      {open && !hasItems && hasContent && (
        <Stack gap={1.25} sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2.5, md: 3 } }}>
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
