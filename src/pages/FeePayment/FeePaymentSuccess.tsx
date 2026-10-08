import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useFeeAccount } from "../../lib/fees/feeAccount";
import { referralOffer } from "../../lib/fees/referral";
import { FeeShell } from "./parts";
import { PaymentSuccessCard } from "./PaymentSuccessCard";
import { ReferralPanel } from "./ReferralPanel";
import { SUCCESS_TIMELINE, enterUp } from "./motion";

/** Top nav height plus a 24px gap, for the sticky referral panel. */
const STICKY_TOP = 64 + 24;

/**
 * /fee_payment/success?gl_trace_id=…&txn_id=…
 * Programs with Refer & Earn get the referral panel beside the confirmation;
 * `?referral=off` previews a program without it.
 */
export function FeePaymentSuccess() {
  const [params] = useSearchParams();
  const { account, lastPayment } = useFeeAccount();
  const txnId = params.get("txn_id");
  // After a refresh the account has restarted, but this tab still remembers its last payment.
  const txn = account.transactions.find((t) => t.txnId === txnId) ?? (lastPayment?.txnId === txnId ? lastPayment : undefined);
  const showReferral = !!txn && account.referralEnabled && params.get("referral") !== "off";

  if (!txn) {
    return (
      <FeeShell>
        <Stack
          alignItems="flex-start"
          gap={1.5}
          sx={{ maxWidth: 672, mx: "auto", p: { xs: 3, md: 5 }, bgcolor: "background.paper", border: 1, borderColor: "outlineVariant.main", borderRadius: "8px" }}
        >
          <Typography variant="h3" component="h1">
            We couldn't find this payment
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: "52ch" }}>
            If you've just paid, it can take a few minutes to show up. Check your payment history.
          </Typography>
          <Button component={RouterLink} to="/fee_payment" variant="contained" sx={{ mt: 1, height: 40, px: 2.5, fontSize: 15 }}>
            Go to Fee Payment
          </Button>
        </Stack>
      </FeeShell>
    );
  }

  const card = <PaymentSuccessCard txn={txn} account={account} sx={enterUp()} />;

  return (
    <FeeShell>
      {showReferral ? (
        <Box
          sx={{
            // The shell gives 8px on phones; result pages sit 24px below the nav.
            mt: { xs: 2, md: 0 },
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 7fr) minmax(0, 4fr)" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
            maxWidth: 1080,
            mx: "auto",
          }}
        >
          {card}
          <ReferralPanel
            offer={referralOffer}
            program={account.programName}
            sx={[{ position: { md: "sticky" }, top: { md: STICKY_TOP } }, enterUp(SUCCESS_TIMELINE.aside)]}
          />
        </Box>
      ) : (
        // No aside: a single, readable column.
        <Box sx={{ maxWidth: 672, mx: "auto", mt: { xs: 2, md: 0 } }}>{card}</Box>
      )}
    </FeeShell>
  );
}
