import { Box, Button, Dialog, Typography } from "@mui/material";
import { OctagonX } from "lucide-react";

/**
 * Magna Design System · AlertDialog (Error).
 * Figma: Magna Design System v1.1, node 22123:95468.
 * Centered x-octagon header, centered title + body, a full-width primary
 * action with a text action stacked below it.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 328,
          m: 2,
          borderRadius: "16px",
          boxShadow: "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header · x-octagon */}
      <Box
        sx={{
          height: 112,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "error.main",
        }}
      >
        <OctagonX size={64} strokeWidth={2} />
      </Box>

      {/* Title */}
      <Box sx={{ px: 3, py: 1.5 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: "24px",
            letterSpacing: "-0.4px",
            textAlign: "center",
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ px: 3, py: 1 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "-0.2px",
            textAlign: "center",
            color: "text.primary",
          }}
        >
          {body}
        </Typography>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          px: 6,
          py: 2,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={onConfirm}
          sx={{
            height: 40,
            borderRadius: "8px",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "24px",
            letterSpacing: "-0.2px",
            textTransform: "capitalize",
          }}
        >
          {confirmLabel}
        </Button>
        <Button
          onClick={onClose}
          sx={{
            width: 232,
            height: 40,
            borderRadius: "8px",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "24px",
            letterSpacing: "-0.2px",
            textTransform: "capitalize",
          }}
        >
          {cancelLabel}
        </Button>
      </Box>
    </Dialog>
  );
}
