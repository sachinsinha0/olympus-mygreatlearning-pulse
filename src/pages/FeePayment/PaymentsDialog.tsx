import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { X } from "lucide-react";
import {
  currencySymbol,
  formatMoney,
  isValidPhone,
  outstanding,
  taxLines,
  totalOutstanding,
  validateCustomAmount,
  withTax,
  type TaxLine,
} from "../../lib/fees/fees";
import type { FeeAccount } from "../../lib/fees/feeAccount";

export type CheckoutRequest = {
  subtotal: number;
  tax: TaxLine[];
  amount: number;
  phone: string;
  channel: "card-upi" | "netbanking";
};

type Props = {
  open: boolean;
  account: FeeAccount;
  onClose: () => void;
  onProceed: (req: CheckoutRequest) => void;
};

type Mode = "installments" | "custom";

export function PaymentsDialog({ open, account, onClose, onProceed }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { currency } = account;
  const unpaid = useMemo(() => account.installments.filter((i) => outstanding(i) > 0), [account.installments]);

  const [phone, setPhone] = useState(account.phone);
  const [mode, setMode] = useState<Mode>("installments");
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [customTouched, setCustomTouched] = useState(false);

  // Fresh form each time it opens, with the next installment pre-ticked.
  useEffect(() => {
    if (!open) return;
    setPhone(account.phone);
    setMode("installments");
    setSelected(unpaid.slice(0, 1).map((i) => i.id));
    setCustom("");
    setCustomTouched(false);
  }, [open]);

  const max = totalOutstanding(account.installments);
  const customError = validateCustomAmount(custom, max, currency);
  const subtotal =
    mode === "installments"
      ? unpaid.filter((i) => selected.includes(i.id)).reduce((s, i) => s + outstanding(i), 0)
      : customError
        ? 0
        : Number(custom);
  const tax = taxLines(subtotal, account.gstRate, account.location?.state ?? null);
  const total = withTax(subtotal, tax);
  const phoneOk = isValidPhone(phone);
  const canPay = phoneOk && subtotal > 0;

  // Installments must be paid in order: ticking one ticks every earlier one,
  // unticking one unticks every later one.
  const toggle = (id: string) => {
    const idx = unpaid.findIndex((i) => i.id === id);
    const on = selected.includes(id);
    setSelected(unpaid.slice(0, on ? idx : idx + 1).map((i) => i.id));
  };

  const proceed = (channel: CheckoutRequest["channel"]) => {
    if (!canPay) {
      setCustomTouched(true);
      return;
    }
    onProceed({ subtotal, tax, amount: total, phone, channel });
  };

  const amountCell = { width: { xs: 110, sm: 122 }, flexShrink: 0, fontSize: 16 };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="payments-dialog-title"
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: fullScreen ? 0 : "4px", px: { xs: 2, sm: 3 }, pt: 3, pb: 2 } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography id="payments-dialog-title" component="h2" sx={{ fontSize: 24, fontWeight: 600, lineHeight: "32px" }}>
          Payments
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} sx={{ color: "text.primary" }}>
          <X size={24} />
        </IconButton>
      </Stack>
      <Typography sx={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: "text.secondary", mt: 3, mb: 2 }}>
        Select a payment or enter custom amount to make the payment
      </Typography>

      <TextField
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
        error={!phoneOk}
        helperText={phoneOk ? undefined : "Enter a valid phone number"}
        fullWidth
        inputProps={{ inputMode: "tel", autoComplete: "tel" }}
        InputLabelProps={{ shrink: true }}
        sx={{ "& .MuiInputBase-input": { fontSize: 16 } }}
      />

      <Tabs
        value={mode}
        onChange={(_, v: Mode) => setMode(v)}
        sx={{
          mt: 2,
          minHeight: 46,
          "& .MuiTabs-indicator": { height: 2, borderRadius: 0 },
          "& .MuiTab-root": { textTransform: "uppercase", fontSize: 14, fontWeight: 600, letterSpacing: 0, color: "text.secondary", width: { xs: "auto", sm: 160 }, px: 1.5, minHeight: 46, borderRadius: 0 },
          "& .MuiTab-root.Mui-selected": { color: "primary.main", fontWeight: 600 },
        }}
      >
        <Tab value="installments" label="Installments" disableRipple />
        <Tab value="custom" label="Custom Amount" disableRipple />
      </Tabs>

      {mode === "installments" ? (
        <Box sx={{ borderBottom: 1, borderColor: "outlineVariant.main" }}>
          {unpaid.map((i) => (
            <Stack
              key={i.id}
              component="label"
              direction="row"
              alignItems="center"
              sx={{ py: 0.25, cursor: "pointer", borderTop: 1, borderColor: "outlineVariant.main", "&:first-of-type": { borderTop: 0 } }}
            >
              <Checkbox checked={selected.includes(i.id)} onChange={() => toggle(i.id)} sx={{ ml: 0.5, mr: 1.5 }} />
              <Typography sx={{ flex: 1, fontSize: 16 }}>{i.label}</Typography>
              <Typography sx={amountCell}>{formatMoney(outstanding(i), currency, { decimal: true })}</Typography>
            </Stack>
          ))}
        </Box>
      ) : (
        <Box sx={{ py: 2.5, borderBottom: 1, borderColor: "outlineVariant.main" }}>
          <TextField
            autoFocus
            fullWidth
            label="Amount"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value.replace(/[^\d.]/g, ""));
              setCustomTouched(true);
            }}
            error={customTouched && !!customError}
            helperText={
              customTouched && customError
                ? customError
                : `Up to ${formatMoney(max, currency)} outstanding${account.gstRate > 0 ? ", exclusive of GST" : ""}`
            }
            inputProps={{ inputMode: "decimal" }}
            InputProps={{ startAdornment: <InputAdornment position="start">{currencySymbol(currency)}</InputAdornment> }}
          />
        </Box>
      )}

      {/* Summary: subtotal, tax lines, total */}
      <Stack>
        <SummaryRow amount={formatMoney(subtotal, currency)} cell={amountCell} />
        {tax.map((l) => (
          <SummaryRow key={l.label} label={l.label} amount={formatMoney(l.amount, currency)} cell={amountCell} />
        ))}
        <Stack direction="row" justifyContent="flex-end">
          <Box sx={{ ...amountCell, width: { xs: 126, sm: 138 }, borderTop: 1, borderColor: "outlineVariant.main" }} />
        </Stack>
        <SummaryRow label="Total Amount" bold amount={formatMoney(total, currency)} cell={amountCell} />
      </Stack>

      <Stack gap={2} sx={{ mt: 0.5, pt: 2, borderTop: 1, borderColor: "outlineVariant.main" }}>
        <Button variant="contained" disabled={!canPay} onClick={() => proceed("card-upi")} sx={payButton}>
          Pay with Debit/Credit Card or UPI
        </Button>
        {currency === "INR" && (
          <Button variant="outlined" disabled={!canPay} onClick={() => proceed("netbanking")} sx={{ ...payButton, borderColor: "outline.main" }}>
            Pay with Netbanking
          </Button>
        )}
      </Stack>
    </Dialog>
  );
}

const payButton = { height: 42, fontSize: 14, fontWeight: 500, letterSpacing: "0.4px", textTransform: "uppercase", borderRadius: "4px" } as const;

function SummaryRow({
  label,
  amount,
  bold,
  cell,
}: {
  label?: string;
  amount: string;
  bold?: boolean;
  cell: object;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4} sx={{ py: 2 }}>
      {label && <Typography sx={{ fontSize: 16, fontWeight: bold ? 700 : 400 }}>{label}</Typography>}
      <Typography sx={{ ...cell, fontWeight: bold ? 700 : 400 }}>{amount}</Typography>
    </Stack>
  );
}
