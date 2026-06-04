import { Box } from "@mui/material";
import { LifeBuoy } from "lucide-react";

type Props = {
  onRaise: () => void;
  disabled?: boolean;
};

export function RaiseTicketChip({ onRaise, disabled = false }: Props) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onRaise}
      disabled={disabled}
      sx={{
        appearance: "none",
        font: "inherit",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        border: 1,
        borderColor: "outlineVariant.main",
        bgcolor: "surfaceContainer.low",
        borderRadius: 999,
        px: 1.75,
        py: 0.75,
        fontSize: 13,
        fontWeight: 500,
        color: "text.secondary",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "color 120ms ease",
        "&:hover": { color: disabled ? "text.secondary" : "text.primary" },
      }}
    >
      <LifeBuoy size={15} strokeWidth={2} />
      Still not solved? Raise a ticket
    </Box>
  );
}
