import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { EXIT_INTENT_REASONS } from "../../lib/pulse/exitIntent";

export function ExitIntentDialog({
  open,
  onSubmit,
  onClose,
}: {
  open: boolean;
  onSubmit: (reasonId: string, note: string) => void;
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
          width: 444,
          maxWidth: "calc(100vw - 32px)",
          m: 2,
          borderRadius: "8px",
          boxShadow: "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
          overflow: "hidden",
        },
      }}
    >
      {/* DialogTitle: heading + supporting text, with close affordance */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, p: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 20, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.4px", color: "text.primary" }}
          >
            Before you go
          </Typography>
          <Typography
            sx={{ mt: 1, fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "text.secondary" }}
          >
            What's holding you back from starting your free trial?
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close" sx={{ mt: -0.5, mr: -0.5, color: "text.secondary" }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Reasons */}
      <Box sx={{ px: 2, pb: 1 }}>
        <RadioGroup value={reason ?? ""} onChange={(e) => setReason(e.target.value)}>
          {EXIT_INTENT_REASONS.map((r) => (
            <FormControlLabel
              key={r.id}
              value={r.id}
              control={<Radio size="small" />}
              label={<Typography sx={{ fontSize: 14, color: "text.primary" }}>{r.label}</Typography>}
              sx={{ mx: 0, my: 0.25, gap: 1 }}
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Comment */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 500, color: "text.primary" }}>
          Comment{" "}
          <Box component="span" sx={{ fontWeight: 400, color: "text.secondary" }}>
            (Optional)
          </Box>
        </Typography>
        <TextField
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tell us more"
          multiline
          minRows={2}
          fullWidth
          size="small"
        />
      </Box>

      {/* DialogActions */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, p: 2 }}>
        <Button
          onClick={onClose}
          sx={{ height: 40, px: 2, borderRadius: "8px", fontSize: 14, fontWeight: 500, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          disabled={!reason}
          onClick={() => reason && onSubmit(reason, note.trim())}
          sx={{ height: 40, px: 2.5, borderRadius: "8px", fontSize: 14, fontWeight: 600, textTransform: "none" }}
        >
          Submit &amp; Continue
        </Button>
      </Box>
    </Dialog>
  );
}
