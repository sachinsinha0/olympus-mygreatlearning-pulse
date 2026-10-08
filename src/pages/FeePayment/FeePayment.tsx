import { useCallback, useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { stateForPincode, type PaymentMode } from "../../lib/fees/fees";
import { useFeeAccount } from "../../lib/fees/feeAccount";
import { FeeShell, FeeTabs, QueriesLine, type FeeTab } from "./parts";
import { PaymentTab } from "./PaymentTab";
import { HistoryTab } from "./HistoryTab";
import { LocationDialog } from "./LocationDialog";
import { PaymentsDialog, type CheckoutRequest } from "./PaymentsDialog";
import { MockCheckout } from "./MockCheckout";

/** How long the pincode → state lookup "takes". */
const RESOLVE_MS = 1100;
/** How long the post-checkout "Payment Processing" screen holds. */
const PROCESSING_MS = 1800;

/**
 * /fee_payment — clone of Olympus' fee payment page. Flow:
 * Make Payment → (location, if GST applies and none on file) → Payments dialog
 * → checkout → Payment Processing → /fee_payment/success.
 */
export function FeePayment() {
  const navigate = useNavigate();
  const { account, setLocation, setPhone, recordPayment } = useFeeAccount();
  const [tab, setTab] = useState<FeeTab>("payment");
  const [locationDialog, setLocationDialog] = useState<{ open: boolean; forPayment: boolean }>({ open: false, forPayment: false });
  const [resolving, setResolving] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutRequest | null>(null);
  const [processing, setProcessing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const needsLocation = account.gstRate > 0 && !account.location?.state;

  const makePayment = () => {
    if (needsLocation) setLocationDialog({ open: true, forPayment: true });
    else setPaymentsOpen(true);
  };

  const saveLocation = (pincode: string) => {
    setLocationDialog((d) => ({ ...d, open: false }));
    // The pincode lands straight away; the state fills in once the lookup returns.
    setLocation({ pincode, state: null });
    setResolving(true);
    later(() => {
      setLocation({ pincode, state: stateForPincode(pincode) });
      setResolving(false);
    }, RESOLVE_MS);
  };

  const proceedToCheckout = (req: CheckoutRequest) => {
    setPhone(req.phone);
    setPaymentsOpen(false);
    setCheckout(req);
  };

  const onCheckoutSuccess = useCallback(
    (mode: PaymentMode) => {
      if (!checkout) return;
      const txn = recordPayment({ subtotal: checkout.subtotal, tax: checkout.tax, amount: checkout.amount, mode });
      setCheckout(null);
      setProcessing(true);
      later(() => navigate(`/fee_payment/success?gl_trace_id=${txn.traceId}&txn_id=${txn.txnId}`), PROCESSING_MS);
    },
    [checkout, recordPayment, navigate],
  );

  return (
    <FeeShell>
      <FeeTabs value={tab} onChange={setTab} />

      {processing ? (
        <>
          <Box sx={{ mt: "47px" }}>
            <QueriesLine contact={account.contact} />
          </Box>
          {/* The checkout's backdrop stays up while the payment settles. */}
          <Stack
            alignItems="center"
            justifyContent="center"
            gap={3}
            role="status"
            aria-live="polite"
            sx={{ position: "fixed", inset: 0, zIndex: (t) => t.zIndex.modal, bgcolor: "rgba(0, 0, 0, 0.82)", color: "#fff" }}
          >
            <CircularProgress size={40} thickness={3.6} />
            <Typography sx={{ fontSize: 24, fontWeight: 500 }}>Payment Processing</Typography>
          </Stack>
        </>
      ) : (
        <>
          <Box sx={{ mt: tab === "payment" ? 0 : 2 }}>
            {tab === "payment" ? (
              <PaymentTab
                account={account}
                resolvingLocation={resolving}
                onMakePayment={makePayment}
                onEditLocation={() => setLocationDialog({ open: true, forPayment: false })}
              />
            ) : (
              <HistoryTab account={account} />
            )}
          </Box>
          <Box sx={{ mt: "34px" }}>
            <QueriesLine contact={account.contact} />
          </Box>
        </>
      )}

      <LocationDialog
        open={locationDialog.open}
        requiredForPayment={locationDialog.forPayment}
        initialPincode={account.location?.pincode ?? ""}
        onClose={() => setLocationDialog((d) => ({ ...d, open: false }))}
        onSave={saveLocation}
      />
      <PaymentsDialog open={paymentsOpen} account={account} onClose={() => setPaymentsOpen(false)} onProceed={proceedToCheckout} />
      <MockCheckout request={checkout} currency={account.currency} onDismiss={() => setCheckout(null)} onSuccess={onCheckoutSuccess} />
    </FeeShell>
  );
}
