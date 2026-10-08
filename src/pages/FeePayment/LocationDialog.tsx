import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { X } from "lucide-react";
import { isValidPincode, stateForPincode } from "../../lib/fees/fees";

type Props = {
  open: boolean;
  initialPincode: string;
  /** Set when the dialog opened because Make Payment needs a location first. */
  requiredForPayment: boolean;
  onClose: () => void;
  onSave: (pincode: string) => void;
};

export function LocationDialog({ open, initialPincode, requiredForPayment, onClose, onSave }: Props) {
  const [pincode, setPincode] = useState(initialPincode);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setPincode(initialPincode);
      setTouched(false);
    }
  }, [open, initialPincode]);

  const error = !isValidPincode(pincode)
    ? "Enter a valid 6-digit pincode"
    : !stateForPincode(pincode)
      ? "We couldn't find a state for this pincode"
      : null;

  const submit = () => {
    setTouched(true);
    if (!error) onSave(pincode);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "8px" } }}>
      <DialogTitle sx={{ fontSize: 20, fontWeight: 600, pr: 6 }}>Location Details</DialogTitle>
      <IconButton aria-label="Close" onClick={onClose} sx={{ position: "absolute", right: 12, top: 12 }}>
        <X size={20} />
      </IconButton>
      <DialogContent>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
          {requiredForPayment
            ? "Add your pincode before you pay. We need it to put the right GST on your receipt."
            : "Your location is printed on the receipt and decides the GST applied."}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          error={touched && !!error}
          helperText={touched && error ? error : "We'll fill in the state for you"}
          inputProps={{ inputMode: "numeric", autoComplete: "postal-code" }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ height: 36 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} sx={{ height: 36, px: 2.5 }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
