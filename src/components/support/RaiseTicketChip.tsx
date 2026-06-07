import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { LifeBuoy } from "lucide-react";

type Props = {
  onRaise: () => void;
  disabled?: boolean;
};

// Quiet, persistent escalation affordance anchored in the top bar. Replaces the
// old centered floating chip so it is always available but never shouts.
export function RaiseTicketChip({ onRaise, disabled = false }: Props) {
  const reduce = useReducedMotion();
  return (
    <Box
      component={motion.button}
      type="button"
      onClick={onRaise}
      disabled={disabled}
      aria-disabled={disabled}
      whileTap={disabled || reduce ? undefined : { scale: 0.97 }}
      sx={{
        appearance: "none",
        font: "inherit",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        border: 0,
        bgcolor: "transparent",
        borderRadius: "8px",
        px: 1,
        py: 0.5,
        fontSize: 13,
        fontWeight: 500,
        color: "text.secondary",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "color 120ms ease, background-color 120ms ease",
        "&:hover": disabled
          ? undefined
          : { color: "text.primary", bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
        "&:focus-visible": {
          outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
          outlineOffset: 2,
        },
      }}
    >
      <LifeBuoy size={15} strokeWidth={2} />
      Raise a ticket
    </Box>
  );
}
