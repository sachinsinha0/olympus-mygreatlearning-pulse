import { useState } from "react";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";

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
        mt: 1,
        height: 28,
        opacity: isLatest ? 1 : 0,
        pointerEvents: isLatest ? "auto" : "none",
        transition: "opacity 140ms ease",
      }}
    >
      <Box aria-live="polite" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
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
          <Check size={15} strokeWidth={2.25} color={theme.palette.extended.success.color} />
        ) : (
          <Copy size={15} strokeWidth={2} />
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
        <ThumbsUp size={15} strokeWidth={2} fill={rating === "up" ? "currentColor" : "none"} />
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
        <ThumbsDown size={15} strokeWidth={2} fill={rating === "down" ? "currentColor" : "none"} />
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
    // When arriving via a chip select, the bubble is the layout-morph target.
    return (
      <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
        <Box
          component={motion.div}
          layoutId={reduce ? undefined : morphId}
          {...(morphId ? {} : entrance)}
          sx={{
            maxWidth: "80%",
            px: 2,
            py: 1.25,
            fontSize: 15,
            lineHeight: 1.55,
            whiteSpace: "pre-line",
            bgcolor: "surfaceContainer.high",
            color: "text.primary",
            borderRadius: "18px 18px 6px 18px",
          }}
        >
          {text}
        </Box>
      </Stack>
    );
  }

  return (
    <Box
      component={motion.div}
      {...entrance}
      className="glaide-turn"
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

      {optionsActive && options && options.length > 0 && (
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
