import { useCallback, useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { stateForPincode, type PaymentMode } from "../../lib/fees/fees";
import { useFeeAccount } from "../../lib/fees/feeAccount";
import { FeeShell, FeeTabs, QueriesLine, type FeeTab } from "./parts";
import { PaymentTab } from "./PaymentTab";
import { HistoryTab } from "./HistoryTab";
import { LocationDialog } from "./LocationDialog";
import { PaymentsDialog, type CheckoutRequest } from "./PaymentsDialog";
import { MockCheckout } from "./MockCheckout";
import type { FeeReturnState } from "./FeePaymentFailed";

/** How long the pincode → state lookup "takes". */
const RESOLVE_MS = 1100;
/** How long the post-checkout "Payment Processing" screen holds. */
const PROCESSING_MS = 1800;

/**
 * /fee_payment — clone of Olympus' fee payment page. Flow:
 * Make Payment → (location, if GST applies and none on file) → Payments dialog
 * → checkout → Payment Processing → /fee_payment/success, or /fee_payment/failed
 * when the Dev Panel has armed a failure. The failure page comes back here to
 * retry the same payment or to pick another method.
 */
export function FeePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, setLocation, setPhone, recordPayment, recordFailure, lastFailure } = useFeeAccount();
  const [tab, setTab] = useState<FeeTab>("payment");
  const [locationDialog, setLocationDialog] = useState<{ open: boolean; forPayment: boolean }>({ open: false, forPayment: false });
  const [resolving, setResolving] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutRequest | null>(null);
  const [processing, setProcessing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  // Back from the failure page: Retry reopens the checkout with the same payment,
  // Change payment method reopens the Payments dialog. Runs only when the route
  // state changes, and clears it, so each return is acted on once.
  useEffect(() => {
    const back = location.state as FeeReturnState | null;
    if (!back) return;
    if ("retry" in back && lastFailure) {
      const { subtotal, tax, amount, phone, channel } = lastFailure;
      setCheckout({ subtotal, tax, amount, phone, channel });
    } else if ("changeMethod" in back) {
      setPaymentsOpen(true);
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state]);

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

  const onCheckoutComplete = useCallback(
    (mode: PaymentMode) => {
      if (!checkout) return;
      const req = { subtotal: checkout.subtotal, tax: checkout.tax, amount: checkout.amount, mode };
      // The Dev Panel's "next payment fails" switch decides how this one ends.
      const result = account.nextFailure
        ? { path: "failed", ...recordFailure({ ...req, channel: checkout.channel, phone: checkout.phone }) }
        : { path: "success", ...recordPayment(req) };
      setCheckout(null);
      setProcessing(true);
      later(() => navigate(`/fee_payment/${result.path}?gl_trace_id=${result.traceId}&txn_id=${result.txnId}`), PROCESSING_MS);
    },
    [checkout, account.nextFailure, recordFailure, recordPayment, navigate],
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
      <MockCheckout request={checkout} currency={account.currency} onDismiss={() => setCheckout(null)} onSuccess={onCheckoutComplete} />
    </FeeShell>
  );
}
