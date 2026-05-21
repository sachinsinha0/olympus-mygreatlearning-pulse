import { useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { CourseItem, VideoTopic } from "../../lib/pulse/types";

const SUMMARY_CLAMP = 360;

export function VideoSummaryPanel({
  item,
  onClose,
  showCloseButton = true,
}: {
  item: CourseItem & { type: "video" };
  onClose?: () => void;
  showCloseButton?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const summary = item.summary ?? "";
  const topics = item.topics ?? [];
  const needsClamp = summary.length > SUMMARY_CLAMP;
  const shownSummary = expanded || !needsClamp ? summary : `${summary.slice(0, SUMMARY_CLAMP).trimEnd()}…`;

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
          Video Summary by Glaide
        </Typography>
        {showCloseButton && (
          <IconButton onClick={onClose} size="small" disableRipple>
            <X size={20} />
          </IconButton>
        )}
      </Stack>
      <Stack
        gap={3}
        sx={{
          flex: 1,
          overflow: "auto",
          px: 3,
          py: 3,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.18) transparent",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.18)", borderRadius: 999 },
          "&::-webkit-scrollbar-thumb:hover": { background: "rgba(0,0,0,0.32)" },
        }}
      >
        {summary ? (
          <Stack gap={1.5}>
            <Typography
              sx={{
                fontSize: 14,
                color: "text.primary",
                lineHeight: 1.6,
                letterSpacing: "-0.2px",
                whiteSpace: "pre-wrap",
              }}
            >
              {shownSummary}
            </Typography>
            {needsClamp && (
              <Box
                component="button"
                onClick={() => setExpanded((v) => !v)}
                sx={{
                  alignSelf: "flex-start",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  px: 0,
                  py: 0.5,
                  color: "primary.main",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.2px",
                  fontFamily: "inherit",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {expanded ? "Read Less" : "Read More"}
              </Box>
            )}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
            Summary is not available for this video yet.
          </Typography>
        )}

        {topics.length > 0 && (
          <Stack gap={1.5}>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 600,
                color: "text.primary",
                letterSpacing: "-0.3px",
              }}
            >
              Video Topics
            </Typography>
            <Stack gap={1.5}>
              {topics.map((t, i) => (
                <TopicAccordion key={i} topic={t} />
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

function TopicAccordion({ topic }: { topic: VideoTopic }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        borderRadius: "12px",
        bgcolor: theme.palette.background.paper,
        overflow: "hidden",
      })}
    >
      <Stack
        component="button"
        direction="row"
        alignItems="flex-start"
        gap={1.5}
        onClick={() => setOpen((v) => !v)}
        sx={(theme) => ({
          width: "100%",
          px: 2,
          py: 1.75,
          border: "none",
          background: "transparent",
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "inherit",
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2,
          },
        })}
        aria-expanded={open}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "primary.main",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.2px",
            flexShrink: 0,
            lineHeight: 1.6,
            minWidth: 48,
          }}
        >
          [{topic.time}]
        </Typography>
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 14,
            fontWeight: 500,
            color: "text.primary",
            letterSpacing: "-0.2px",
            lineHeight: 1.5,
          }}
        >
          {topic.title}
        </Typography>
        <Box sx={{ color: "text.secondary", display: "flex", flexShrink: 0, mt: 0.25 }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Box>
      </Stack>
      {open && topic.body && (
        <Box
          sx={(theme) => ({
            px: 2,
            pb: 2,
            pt: 0.5,
            borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
            bgcolor: theme.palette.background.default,
          })}
        >
          <Typography
            sx={{
              fontSize: 13.5,
              color: "text.secondary",
              lineHeight: 1.55,
              letterSpacing: "-0.2px",
              pt: 1.5,
            }}
          >
            {topic.body}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
