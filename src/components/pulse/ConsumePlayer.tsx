import { useMemo, useState } from "react";
import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import { ChevronDown, ChevronUp, HelpCircle, Maximize, Play, Settings, SquarePen, Volume2, X } from "lucide-react";
import type { CourseItem } from "../../lib/pulse/types";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
import { AskPulseAIBar } from "./AskPulseAIBar";
import { OverviewSurface } from "./OverviewSurface";

export function ConsumePlayer({ item }: { item: CourseItem }) {
  const { hasItemCompleted, markItemCompleted } = useLearningProgress();

  return (
    <Stack gap={0}>
      {item.type === "overview" && <OverviewSurface item={item} />}
      {item.type === "video" && <VideoSurface item={item} />}
      {item.type === "reading" && <ReadingSurface item={item} />}
      {item.type === "tyu" && (
        <TYUSurface
          item={item}
          completed={hasItemCompleted(item.id)}
          onMark={() => markItemCompleted(item.id)}
        />
      )}
      {item.type !== "overview" && item.type !== "tyu" && <AskPulseAIBar />}
    </Stack>
  );
}

function VideoSurface({ item }: { item: CourseItem & { type: "video" } }) {
  const poster = item.poster ?? "/video-posters/default.jpg";
  const duration = parseDuration(item.duration);
  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: "12px",
        bgcolor: "#0a0a0a",
        backgroundImage: `url(${poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        border: `1px solid ${theme.palette.outlineVariant.main}`,
      })}
    >
      <VideoControlsBar duration={duration} />
    </Box>
  );
}

function VideoControlsBar({ duration }: { duration: string }) {
  return (
    <Stack
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        px: { xs: 1.5, md: 2.5 },
        pb: { xs: 1.25, md: 1.5 },
        pt: { xs: 5, md: 6 },
        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
        color: "#fff",
        gap: 1,
      }}
    >
      {/* Scrubber */}
      <Box sx={{ position: "relative", height: 4, mx: 0.5 }}>
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.28)", borderRadius: 2 }} />
        <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "0%", bgcolor: "#fff", borderRadius: 2 }} />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "#fff",
            boxShadow: "0 0 0 3px rgba(255,255,255,0.18)",
          }}
        />
      </Box>
      {/* Controls row */}
      <Stack direction="row" alignItems="center" gap={1.25}>
        <ControlIcon ariaLabel="Play"><Play size={20} fill="#fff" /></ControlIcon>
        <ControlIcon ariaLabel="Volume"><Volume2 size={20} /></ControlIcon>
        <Typography
          sx={{
            fontSize: 13,
            color: "#fff",
            letterSpacing: "0.2px",
            fontVariantNumeric: "tabular-nums",
            ml: 0.5,
          }}
        >
          00:00 / {duration}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <ControlIcon ariaLabel="Notes"><SquarePen size={20} /></ControlIcon>
        <ControlIcon ariaLabel="Settings"><Settings size={20} /></ControlIcon>
        <ControlIcon ariaLabel="Fullscreen"><Maximize size={20} /></ControlIcon>
      </Stack>
    </Stack>
  );
}

function ControlIcon({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return (
    <Box
      component="button"
      aria-label={ariaLabel}
      sx={{
        width: 32,
        height: 32,
        border: "none",
        bgcolor: "transparent",
        color: "#fff",
        cursor: "pointer",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
      }}
    >
      {children}
    </Box>
  );
}

function parseDuration(input?: string): string {
  if (!input) return "00:00";
  // Accept "7 Mins 2 Secs" or "12 Mins" → mm:ss
  const minMatch = input.match(/(\d+)\s*Min/i);
  const secMatch = input.match(/(\d+)\s*Sec/i);
  const m = minMatch ? parseInt(minMatch[1], 10) : 0;
  const s = secMatch ? parseInt(secMatch[1], 10) : 0;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ReadingSurface({ item }: { item: CourseItem & { type: "reading" } }) {
  return (
    <Box sx={{ maxWidth: 720 }}>
      <MarkdownLite source={item.body ?? "_No content yet._"} />
    </Box>
  );
}

function TYUSurface({ item, completed, onMark }: { item: CourseItem & { type: "tyu" }; completed: boolean; onMark: () => void }) {
  const [open, setOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const questions = item.questions ?? parseInt((item.size ?? "").match(/\d+/)?.[0] ?? "5", 10);
  const quizType = item.quizType ?? "Graded Quiz";
  const totalMarks = item.totalMarks ?? questions;
  const timeLimit = item.timeLimit ?? `${questions} Mins`;
  const instructions = item.instructions ?? "Carefully read through the scenario presented in the question and pick the correct answer.";

  return (
    <Stack gap={3}>
      <Box
        sx={(theme) => ({
          px: { xs: 2.5, md: 3 },
          py: { xs: 2.5, md: 3 },
          borderRadius: "12px",
          border: `1px solid ${theme.palette.outlineVariant.main}`,
          bgcolor: theme.palette.background.paper,
        })}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: 2, sm: 4 }}
          sx={{ flexWrap: { sm: "wrap" } }}
        >
          <Stack gap={2} sx={{ flex: 1, minWidth: 0 }}>
            <MetaRow label="Type" value={quizType} />
            <MetaRow label="Total Marks" value={`${totalMarks}`} />
          </Stack>
          <Stack gap={2} sx={{ flex: 1, minWidth: 0 }}>
            <MetaRow label="Questions" value={`${questions}`} />
            <MetaRow label="Time Limit" value={timeLimit} />
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={(theme) => ({
          borderRadius: "12px",
          border: `1px solid ${theme.palette.outlineVariant.main}`,
          bgcolor: theme.palette.background.paper,
          overflow: "hidden",
        })}
      >
        <Stack
          component="button"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setInstructionsOpen((v) => !v)}
          sx={{
            width: "100%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
            px: { xs: 2.5, md: 3 },
            py: { xs: 2, md: 2.25 },
            textAlign: "left",
          }}
          aria-expanded={instructionsOpen}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
            Instructions
          </Typography>
          <Box sx={{ color: "text.primary", display: "flex" }}>
            {instructionsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Box>
        </Stack>
        {instructionsOpen && (
          <Box
            sx={(theme) => ({
              px: { xs: 2.5, md: 3 },
              pt: 2,
              pb: { xs: 2.5, md: 3 },
              borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
            })}
          >
            <Typography sx={{ fontSize: 14, color: "text.primary", lineHeight: 1.6, letterSpacing: "-0.2px" }}>
              {instructions}
            </Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="contained"
        disableElevation
        startIcon={<Play size={18} fill="currentColor" />}
        onClick={() => {
          onMark();
          setOpen(true);
        }}
        sx={{
          alignSelf: "flex-start",
          height: 44,
          px: 3,
          borderRadius: "8px",
          fontSize: 15,
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        {completed ? "Retake" : "Start"}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            width: { xs: "calc(100% - 32px)", sm: 420 },
            maxWidth: 420,
            m: 2,
          },
        }}
      >
        <Box sx={{ p: { xs: 3, md: 3.5 }, position: "relative" }}>
          <Box
            component="button"
            onClick={() => setOpen(false)}
            sx={(theme) => ({
              position: "absolute",
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: "8px",
              border: "none",
              bgcolor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { bgcolor: theme.palette.action.hover },
            })}
            aria-label="Close"
          >
            <X size={18} />
          </Box>
          <Stack gap={2} alignItems="center" sx={{ textAlign: "center", pt: 1 }}>
            <Box
              sx={(theme) => ({
                width: 64,
                height: 64,
                borderRadius: "16px",
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <HelpCircle size={28} strokeWidth={2} />
            </Box>
            <Stack gap={0.75}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "text.primary" }}>
                Interactive quiz · Coming soon
              </Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5 }}>
                We've marked this segment as complete for now. The interactive quiz lands in the next release.
              </Typography>
            </Stack>
            <Button
              variant="contained"
              disableElevation
              fullWidth
              onClick={() => setOpen(false)}
              sx={{ height: 44, borderRadius: "10px", textTransform: "none", fontSize: 15, fontWeight: 600, mt: 0.5 }}
            >
              Continue
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Stack>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" alignItems="baseline" gap={1}>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: "text.primary",
          letterSpacing: "-0.2px",
          flexShrink: 0,
        }}
      >
        {label}:
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 400,
          color: "text.primary",
          letterSpacing: "-0.2px",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function MarkdownLite({ source }: { source: string }) {
  const blocks = useMemo(() => parseBlocks(source), [source]);
  return (
    <Stack gap={2}>
      {blocks.map((b, i) => {
        if (b.type === "h2") return (
          <Typography key={i} component="h2" sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, letterSpacing: "-0.4px", color: "text.primary", mt: 1 }}>
            {renderInline(b.text)}
          </Typography>
        );
        if (b.type === "h3") return (
          <Typography key={i} component="h3" sx={{ fontSize: { xs: 17, md: 19 }, fontWeight: 700, letterSpacing: "-0.3px", color: "text.primary", mt: 0.5 }}>
            {renderInline(b.text)}
          </Typography>
        );
        if (b.type === "ul") return (
          <Stack key={i} component="ul" gap={1} sx={{ pl: 3, m: 0 }}>
            {b.items.map((it, j) => (
              <Typography key={j} component="li" sx={{ fontSize: 16, lineHeight: 1.6, color: "text.primary" }}>
                {renderInline(it)}
              </Typography>
            ))}
          </Stack>
        );
        return (
          <Typography key={i} sx={{ fontSize: 16, lineHeight: 1.6, color: "text.primary" }}>
            {renderInline(b.text)}
          </Typography>
        );
      })}
    </Stack>
  );
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

function parseBlocks(src: string): Block[] {
  const lines = src.split(/\r?\n/);
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    // Paragraph: gather until blank line or special marker
    const buf: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("## ") && !lines[i].startsWith("### ") && !lines[i].startsWith("- ")) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: buf.join(" ").trim() });
  }
  return blocks;
}

function renderInline(text: string): React.ReactNode {
  // Handles **bold**, *italic*
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
