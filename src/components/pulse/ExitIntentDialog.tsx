import { useEffect, useState } from "react";
import { Box, Button, Dialog, IconButton, Stack, TextField, Typography } from "@mui/material";
import { X } from "lucide-react";
import { EXIT_INTENT_REASONS } from "../../lib/pulse/exitIntent";

export function ExitIntentDialog({
  open,
  onSubmit,
  onSkip,
  onClose,
}: {
  open: boolean;
  onSubmit: (reasonId: string, note: string) => void;
  onSkip: () => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Reset the form each time the dialog is (re)opened.
  useEffect(() => {
    if (open) {
      setReason(null);
      setNote("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          maxWidth: "calc(100vw - 32px)",
          m: 2,
          borderRadius: "16px",
          boxShadow: "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary" }}
      >
        <X size={18} />
      </IconButton>

      <Box sx={{ px: 3, pt: 3.5, pb: 1 }}>
        <Typography
          sx={{ fontSize: 20, fontWeight: 600, lineHeight: "26px", letterSpacing: "-0.4px", color: "text.primary" }}
        >
          Before you go
        </Typography>
        <Typography
          sx={{ mt: 0.75, fontSize: 14, lineHeight: "20px", letterSpacing: "-0.2px", color: "text.secondary" }}
        >
          What's holding you back from starting your free trial?
        </Typography>
      </Box>

      <Box sx={{ px: 3, py: 1.5 }}>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          {EXIT_INTENT_REASONS.map((r) => {
            const selected = reason === r.id;
            return (
              <Box
                key={r.id}
                component="button"
                type="button"
                onClick={() => setReason(r.id)}
                aria-pressed={selected}
                sx={(theme) => ({
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "-0.1px",
                  px: 1.5,
                  py: 0.875,
                  borderRadius: 999,
                  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.outlineVariant.main}`,
                  bgcolor: selected ? theme.palette.primary.light : "transparent",
                  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
                  transition: "background-color 140ms ease, border-color 140ms ease, color 140ms ease",
                  "&:hover": { borderColor: theme.palette.primary.main },
                })}
              >
                {r.label}
              </Box>
            );
          })}
        </Stack>

        <TextField
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything else? (optional)"
          multiline
          minRows={2}
          fullWidth
          size="small"
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1.5, px: 3, py: 2 }}>
        <Button
          onClick={onSkip}
          sx={{ height: 40, px: 2, borderRadius: "8px", fontSize: 14, fontWeight: 500, textTransform: "none", color: "text.secondary" }}
        >
          Skip
        </Button>
        <Button
          variant="contained"
          disableElevation
          disabled={!reason}
          onClick={() => reason && onSubmit(reason, note.trim())}
          sx={{ height: 40, px: 2.5, borderRadius: "8px", fontSize: 14, fontWeight: 600, textTransform: "none" }}
        >
          Submit &amp; continue
        </Button>
      </Box>
    </Dialog>
  );
}
