import { useLayoutEffect, useRef, useState } from "react";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { ProjectPicker } from "./ProjectPicker";
import { ProjectForm } from "./ProjectForm";

// Single signature easing for all translational motion (gentle decelerating ease-out).
export const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  role: "bot" | "user";
  text: string;
  options?: string[];
  optionsActive?: boolean;
  isHero?: boolean;
  isLatest?: boolean;
  /** Stable id used so a selected chip can morph into the resulting user bubble. */
  morphId?: string;
  onOptionClick?: (option: string, morphId: string) => void;
  /** Rich picker rendered under the message (project cards / cascading form). */
  widget?: "projectCards" | "projectForm";
  onProjectPick?: (course: string, name: string) => void;
  onProjectOther?: () => void;
  onProjectConfirm?: (course: string, project: string) => void;
};

function ActionRow({ text, isLatest }: { text: string; isLatest?: boolean }) {
  const reduce = useReducedMotion();
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const toggleRating = (v: "up" | "down") => setRating((cur) => (cur === v ? null : v));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard unavailable: fail quietly, never crash.
    }
  };

  const ghostBtn = {
    width: 28,
    height: 28,
    borderRadius: "8px",
    color: (t: import("@mui/material").Theme) => alpha(t.palette.text.secondary, 0.85),
    transition: "background-color 120ms ease, color 120ms ease",
    "&:hover": {
      bgcolor: (t: import("@mui/material").Theme) => alpha(t.palette.primary.main, 0.08),
      color: "text.primary",
    },
    "&:focus-visible": {
      outline: (t: import("@mui/material").Theme) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
      outlineOffset: 2,
    },
  } as const;

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.25}
      className="glaide-action-row"
      sx={{
        // position:relative so the visually-hidden announcer below resolves its
        // containing block here (a 28px-tall, in-flow row) instead of walking up
        // to the position:relative message list. Without this the absolute
        // announcer anchors to the tall list and a stray layout/projection node
        // can push the document past the white root, revealing the body bg.
        position: "relative",
        mt: 1,
        height: 28,
        opacity: isLatest ? 1 : 0,
        pointerEvents: isLatest ? "auto" : "none",
        transition: "opacity 140ms ease",
      }}
    >
      <Box
        aria-live="polite"
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          border: 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
        }}
      >
        {copied ? "Copied" : ""}
      </Box>
      <IconButton
        component={motion.button}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        onClick={handleCopy}
        aria-label="Copy message"
        sx={ghostBtn}
      >
        {copied ? (
          <Check size={17} strokeWidth={2.25} color={theme.palette.extended.success.color} />
        ) : (
          <Copy size={17} strokeWidth={2} />
        )}
      </IconButton>
      <IconButton
        component={motion.button}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        onClick={() => toggleRating("up")}
        aria-label="Good response"
        aria-pressed={rating === "up"}
        sx={{
          ...ghostBtn,
          ...(rating === "up" && {
            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
            color: "primary.main",
            "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main" },
          }),
        }}
      >
        <ThumbsUp size={17} strokeWidth={2} fill={rating === "up" ? "currentColor" : "none"} />
      </IconButton>
      <IconButton
        component={motion.button}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        onClick={() => toggleRating("down")}
        aria-label="Bad response"
        aria-pressed={rating === "down"}
        sx={{
          ...ghostBtn,
          ...(rating === "down" && {
            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
            color: "primary.main",
            "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main" },
          }),
        }}
      >
        <ThumbsDown size={17} strokeWidth={2} fill={rating === "down" ? "currentColor" : "none"} />
      </IconButton>
    </Stack>
  );
}

function OptionChip({
  label,
  morphId,
  onClick,
}: {
  label: string;
  morphId: string;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <Box
      component={motion.button}
      type="button"
      onClick={onClick}
      layoutId={reduce ? undefined : morphId}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.2, ease: EASE }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      sx={{
        appearance: "none",
        font: "inherit",
        cursor: "pointer",
        border: 1,
        borderColor: "transparent",
        bgcolor: "surfaceContainer.low",
        color: "text.primary",
        borderRadius: 999,
        px: 1.75,
        py: 1,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        transition: "background-color 120ms ease, border-color 120ms ease",
        "&:hover": {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
          borderColor: "primary.main",
          color: "text.primary",
        },
        "&:focus-visible": {
          outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
          outlineOffset: 2,
        },
      }}
    >
      {label}
    </Box>
  );
}

// A long user message collapses to this many lines with a Show more toggle.
const COLLAPSED_MAX_LINES = 12;

function UserBubble({ text, morphId, reduce }: { text: string; morphId?: string; reduce: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const line = parseFloat(window.getComputedStyle(el).lineHeight) || 23;
    setOverflowing(el.scrollHeight > line * COLLAPSED_MAX_LINES + 4);
  }, [text]);

  const entrance = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.18 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, ease: EASE },
      };

  const clamped = overflowing && !expanded;

  return (
    <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }} data-msg-role="user">
      <Box
        component={motion.div}
        layoutId={reduce ? undefined : morphId}
        {...(morphId ? {} : entrance)}
        sx={{
          maxWidth: "80%",
          px: 2,
          py: 1.25,
          bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
          color: "primary.dark",
          borderRadius: "18px 18px 6px 18px",
        }}
      >
        <Box
          ref={ref}
          sx={{
            fontSize: 15,
            lineHeight: 1.55,
            whiteSpace: "pre-line",
            ...(clamped && {
              display: "-webkit-box",
              WebkitLineClamp: COLLAPSED_MAX_LINES,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }),
          }}
        >
          {text}
        </Box>
        {overflowing && (
          <Box
            component="button"
            type="button"
            onClick={() => setExpanded((v) => !v)}
            sx={{
              appearance: "none",
              font: "inherit",
              cursor: "pointer",
              border: 0,
              bgcolor: "transparent",
              p: 0,
              mt: 0.75,
              fontSize: 13,
              fontWeight: 600,
              color: "primary.dark",
              opacity: 0.85,
              "&:hover": { opacity: 1, textDecoration: "underline" },
            }}
          >
            {expanded ? "Show less" : "Show more"}
          </Box>
        )}
      </Box>
    </Stack>
  );
}

// Assistant turns render full-width plain text (no avatar, no bubble) for a clean
// "document" reading feel. User turns render as a soft right-aligned bubble.
export function ChatBubble({
  role,
  text,
  options,
  optionsActive,
  isHero,
  isLatest,
  morphId,
  onOptionClick,
  widget,
  onProjectPick,
  onProjectOther,
  onProjectConfirm,
}: Props) {
  const reduce = useReducedMotion();

  const entrance = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.18 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, ease: EASE },
      };

  if (role === "user") {
    return <UserBubble text={text} morphId={morphId} reduce={!!reduce} />;
  }

  return (
    <Box
      component={motion.div}
      {...entrance}
      className="glaide-turn"
      data-msg-role="bot"
      sx={{
        width: "100%",
        "&:hover .glaide-action-row, &:focus-within .glaide-action-row": { opacity: 1, pointerEvents: "auto" },
      }}
    >
      <Typography
        sx={
          isHero
            ? {
                fontSize: 22,
                lineHeight: 1.4,
                fontWeight: 500,
                color: "text.primary",
                whiteSpace: "pre-line",
                maxWidth: "36ch",
              }
            : {
                fontSize: 15,
                lineHeight: 1.7,
                fontWeight: 400,
                color: "text.primary",
                whiteSpace: "pre-line",
              }
        }
      >
        {text}
      </Typography>

      {optionsActive && widget === "projectCards" && (
        <ProjectPicker onPick={onProjectPick!} onOther={onProjectOther!} />
      )}
      {optionsActive && widget === "projectForm" && (
        <ProjectForm onConfirm={onProjectConfirm!} />
      )}

      {optionsActive && !widget && options && options.length > 0 && (
        <Stack
          component={motion.div}
          direction="row"
          gap={1}
          flexWrap="wrap"
          sx={{ mt: 1.5 }}
          variants={{
            show: { transition: { staggerChildren: reduce ? 0 : 0.04, delayChildren: reduce ? 0 : 0.08 } },
          }}
          initial="show"
          animate="show"
        >
          {options.map((opt, idx) => (
            <OptionChip
              key={opt}
              label={opt}
              morphId={`${morphId ?? "opt"}-${idx}`}
              onClick={() => onOptionClick?.(opt, `${morphId ?? "opt"}-${idx}`)}
            />
          ))}
        </Stack>
      )}

      {!isHero && <ActionRow text={text} isLatest={isLatest} />}
    </Box>
  );
}

export function TypingIndicator() {
  const reduce = useReducedMotion();
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-label="Program Support is typing"
      sx={{ display: "flex", alignItems: "center", gap: 0.5, height: 26 }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.45),
            ...(reduce
              ? { opacity: 0.5 }
              : {
                  opacity: 0.4,
                  animation: "glaide-typing 1s infinite ease-in-out",
                  animationDelay: `${i * 0.15}s`,
                  "@keyframes glaide-typing": {
                    "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.4 },
                    "30%": { transform: "translateY(-3px)", opacity: 0.9 },
                  },
                }),
          }}
        />
      ))}
    </Box>
  );
}
