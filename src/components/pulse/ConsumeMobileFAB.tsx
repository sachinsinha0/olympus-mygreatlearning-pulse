import { Box, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ConsumeMobileFAB({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  hidden,
}: {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        pointerEvents: "none",
        zIndex: 9,
      }}
    >
      <FAB onClick={onPrev} disabled={!hasPrev} aria-label="Previous">
        <ChevronLeft size={22} />
      </FAB>
      <FAB onClick={onNext} disabled={!hasNext} aria-label="Next">
        <ChevronRight size={22} />
      </FAB>
    </Stack>
  );
}

function FAB({
  onClick,
  disabled,
  children,
  ...rest
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label": string;
}) {
  return (
    <Box
      component="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      sx={(theme) => ({
        width: 52,
        height: 52,
        borderRadius: "999px",
        border: "none",
        bgcolor: disabled ? theme.palette.action.disabledBackground : theme.palette.primary.main,
        color: disabled ? theme.palette.text.disabled : theme.palette.primary.contrastText,
        boxShadow: disabled ? "none" : "0 8px 24px rgba(0, 84, 214, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        cursor: disabled ? "default" : "pointer",
        transition: "background-color 120ms ease, filter 120ms ease",
        "&:hover": disabled ? undefined : { filter: "brightness(1.08)" },
      })}
      {...rest}
    >
      {children}
    </Box>
  );
}
