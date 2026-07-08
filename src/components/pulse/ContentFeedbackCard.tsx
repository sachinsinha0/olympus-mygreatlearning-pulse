import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Check, ChevronRight, Star, X } from "lucide-react";
import {
  PULSE_FEEDBACK_ASPECTS,
  feedbackPrompt,
  getFeedback,
  saveFeedback,
  type ContentFeedback,
} from "../../lib/pulse/contentFeedback";

// Fixed "highlight" treatment: a deep-primary-container panel with light text so
// it stands out from the light-tinted Glaide bar directly above it.
const NAVY = "#001849"; // onPrimaryContainer (light theme)
const NAVY_HOVER = "#04225f";
const LIGHT = "#dae1ff"; // primaryContainer (light theme)
const SUBTEXT = "#b3c5ff"; // inversePrimary (muted light blue)
const STAR_ON = "#ffb84d";

export function ContentFeedbackCard({ itemId }: { itemId: string }) {
  const [saved, setSaved] = useState<ContentFeedback | null>(() => getFeedback(itemId));
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [aspect, setAspect] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // The inline panel is just a clickable entry point — the rating is chosen inside
  // the dialog. Seed the draft from any saved feedback so editing pre-fills.
  const openDialog = () => {
    setRating(saved?.rating ?? 0);
    setAspect(saved?.aspectId ?? null);
    setNote(saved?.note ?? "");
    setOpen(true);
  };

  const submit = () => {
    if (rating < 1) return;
    const fb: ContentFeedback = {
      rating,
      aspectId: aspect ?? undefined,
      note: note.trim() || undefined,
    };
    saveFeedback(itemId, fb);
    setSaved(fb);
    setOpen(false);
  };

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={openDialog}
        aria-label={saved ? "Edit your feedback for this content" : "Rate this content"}
        sx={{
          display: "block",
          width: "100%",
          textAlign: "left",
          border: "none",
          fontFamily: "inherit",
          cursor: "pointer",
          mt: 2,
          borderRadius: "8px",
          bgcolor: NAVY,
          px: { xs: 2, md: 2.5 },
          py: 1.5,
          transition: "background-color 120ms ease",
          "&:hover": { bgcolor: NAVY_HOVER },
        }}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box sx={{ display: "flex", flexShrink: 0, color: saved ? LIGHT : STAR_ON }}>
            {saved ? <Check size={22} strokeWidth={2.5} /> : <Star size={22} fill={STAR_ON} strokeWidth={0} />}
          </Box>
          <Stack sx={{ flex: 1, minWidth: 0 }} gap={0}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, lineHeight: "20px", color: "#fff", letterSpacing: "-0.2px" }}>
              {saved ? "Thanks for your feedback!" : "Rate this content"}
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: SUBTEXT, letterSpacing: "-0.1px" }}>
              {saved ? "Tap to update your rating." : "Your feedback helps us improve AI Pulse."}
            </Typography>
          </Stack>
          <Box sx={{ display: "flex", color: LIGHT, flexShrink: 0 }}>
            <ChevronRight size={22} />
          </Box>
        </Stack>
      </Box>

      <FeedbackDialog
        open={open}
        rating={rating}
        aspect={aspect}
        note={note}
        onRating={setRating}
        onAspect={setAspect}
        onNote={setNote}
        onClose={() => setOpen(false)}
        onSubmit={submit}
      />
    </>
  );
}

function FeedbackDialog({
  open,
  rating,
  aspect,
  note,
  onRating,
  onAspect,
  onNote,
  onClose,
  onSubmit,
}: {
  open: boolean;
  rating: number;
  aspect: string | null;
  note: string;
  onRating: (r: number) => void;
  onAspect: (id: string) => void;
  onNote: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
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
      {/* Heading + supporting text, with close affordance */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, p: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 20, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.4px", color: "text.primary" }}
          >
            Share your feedback
          </Typography>
          <Typography sx={{ mt: 1, fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "text.secondary" }}>
            {rating > 0 ? feedbackPrompt(rating) : "How would you rate this content?"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close" sx={{ mt: -0.5, mr: -0.5, color: "text.secondary" }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Rating — chosen here */}
      <Box sx={{ px: 2, py: 1 }}>
        <DialogStarRow value={rating} onChange={onRating} />
      </Box>

      {/* Aspect (optional) */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography sx={{ mb: 0.5, fontSize: 14, fontWeight: 500, color: "text.primary" }}>
          What's your feedback about?{" "}
          <Box component="span" sx={{ fontWeight: 400, color: "text.secondary" }}>
            (Optional)
          </Box>
        </Typography>
        <RadioGroup value={aspect ?? ""} onChange={(e) => onAspect(e.target.value)}>
          {PULSE_FEEDBACK_ASPECTS.map((a) => (
            <FormControlLabel
              key={a.id}
              value={a.id}
              control={<Radio size="small" />}
              label={<Typography sx={{ fontSize: 14, color: "text.primary" }}>{a.label}</Typography>}
              sx={{ mx: 0, my: 0.25, gap: 1 }}
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Comment (optional) */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 500, color: "text.primary" }}>
          Comment{" "}
          <Box component="span" sx={{ fontWeight: 400, color: "text.secondary" }}>
            (Optional)
          </Box>
        </Typography>
        <TextField
          value={note}
          onChange={(e) => onNote(e.target.value)}
          placeholder="Tell us more"
          multiline
          minRows={2}
          fullWidth
          size="small"
        />
      </Box>

      {/* Actions */}
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
          disabled={rating < 1}
          onClick={onSubmit}
          sx={{ height: 40, px: 2.5, borderRadius: "8px", fontSize: 14, fontWeight: 600, textTransform: "none" }}
        >
          Submit
        </Button>
      </Box>
    </Dialog>
  );
}

// Interactive star picker — lives in the dialog only.
function DialogStarRow({ value, onChange }: { value: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <Stack direction="row" gap={0.75} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        return (
          <Box
            key={n}
            component="button"
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            sx={{
              p: 0,
              border: "none",
              background: "transparent",
              display: "inline-flex",
              cursor: "pointer",
              color: filled ? STAR_ON : "rgba(0,0,0,0.22)",
              transition: "color 120ms ease, transform 120ms ease",
              "&:hover": { transform: "scale(1.12)" },
            }}
          >
            <Star size={30} fill={filled ? STAR_ON : "transparent"} strokeWidth={filled ? 0 : 1.75} />
          </Box>
        );
      })}
    </Stack>
  );
}
