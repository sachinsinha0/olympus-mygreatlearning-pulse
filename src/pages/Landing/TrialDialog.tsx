import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";
import { GL } from "./landingTheme";
import { TRIAL_DIALOG, TRIAL_FORM } from "./content";
import { useStartTrial } from "./useStartTrial";
import pulseArt from "../../assets/pulse-home-asset.png";

/**
 * The sign up dialog behind every Start Free Trial button on the page.
 *
 * One door, opened from the hero and from the sticky bar, so the two CTAs cannot
 * drift apart. It replaces an email field in the bar and a separate login page: the
 * lead is already known to the sales team, so the only thing left to do is prove who
 * they are, and Google does that in one tap without a form.
 */
function GoogleMark() {
  return (
    <Box
      component="img"
      src="/brand-logos/google.png"
      alt=""
      sx={{ width: 20, height: 20, objectFit: "contain" }}
    />
  );
}

function TrialDialogBody({ onClose }: { onClose: () => void }) {
  const startTrial = useStartTrial();

  const signUp = () => {
    onClose();
    startTrial();
  };

  return (
    <Box sx={{ position: "relative", px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 }, textAlign: "center" }}>
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{ position: "absolute", top: 12, right: 12, color: GL.body }}
      >
        <X size={18} />
      </IconButton>

      {/* The product's mark, so the dialog is recognisably AI Pulse and not a generic
          consent box. Decorative next to the title, hence the empty alt. */}
      <Box
        component="img"
        src={pulseArt}
        alt=""
        sx={{ width: 56, height: 56, objectFit: "contain", display: "block", mx: "auto" }}
      />

      <Typography
        component="h2"
        id="trial-dialog-title"
        sx={{ mt: 2, fontSize: 22, fontWeight: 600, color: GL.heading, lineHeight: 1.3 }}
      >
        {TRIAL_DIALOG.title}
      </Typography>
      <Typography sx={{ mt: 1, fontSize: 15, color: GL.body }}>{TRIAL_DIALOG.body}</Typography>

      {/* Google's button, in Google's colours rather than ours. A blue filled button
          here would read as our own action and hide whose account is being used. */}
      <Button
        onClick={signUp}
        startIcon={<GoogleMark />}
        fullWidth
        sx={{
          mt: 3.5,
          backgroundColor: "#ffffff",
          border: `1px solid ${GL.border}`,
          color: GL.heading,
          fontSize: 15,
          fontWeight: 600,
          minHeight: 48,
          "&:hover": { backgroundColor: "#F9FAFB", borderColor: "#D0D5DD" },
        }}
      >
        {TRIAL_DIALOG.google}
      </Button>

      <Typography sx={{ mt: 2.5, fontSize: 12, color: GL.body, lineHeight: 1.55 }}>
        {TRIAL_FORM.consent}
      </Typography>
    </Box>
  );
}

const OpenTrialDialog = createContext<() => void>(() => {});

/** Opens the sign up dialog. Every Start Free Trial button on the page calls this. */
export function useOpenTrialDialog() {
  return useContext(OpenTrialDialog);
}

export function TrialDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <OpenTrialDialog.Provider value={show}>
      {children}
      <Dialog
        open={open}
        onClose={hide}
        aria-labelledby="trial-dialog-title"
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        {/* Mounted only while open, so the trial hook is not running behind a closed
            dialog and the mark is not fetched by readers who never open it. */}
        {open && <TrialDialogBody onClose={hide} />}
      </Dialog>
    </OpenTrialDialog.Provider>
  );
}

export default TrialDialogProvider;
