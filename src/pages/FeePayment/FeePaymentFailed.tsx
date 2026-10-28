import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { useFeeAccount } from "../../lib/fees/feeAccount";
import { FeeShell } from "./parts";
import { PaymentFailureCard } from "./PaymentFailureCard";
import { enterUp } from "./motion";

/** What /fee_payment should do when it opens after a failure. */
export type FeeReturnState = { retry: true } | { changeMethod: true };

/**
 * /fee_payment/failed?gl_trace_id=…&txn_id=…
 * One column at the success card's width, no referral panel. Retry runs the
 * same payment again; Change payment method goes back to the Payments dialog.
 */
export function FeePaymentFailed() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { account, lastFailure } = useFeeAccount();
  const attempt = lastFailure?.txnId === params.get("txn_id") ? lastFailure : null;

  if (!attempt) {
    return (
      <FeeShell>
        <Stack
          alignItems="flex-start"
          gap={1.5}
          sx={{ maxWidth: 672, mx: "auto", p: { xs: 3, md: 5 }, bgcolor: "background.paper", border: 1, borderColor: "outlineVariant.main", borderRadius: "8px" }}
        >
          <Typography variant="h3" component="h1">
            We couldn't find this payment attempt
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: "52ch" }}>Go back to Fee Payment to check what's due and pay again.</Typography>
          <Button component={RouterLink} to="/fee_payment" variant="contained" sx={{ mt: 1, height: 40, px: 2.5, fontSize: 15 }}>
            Go to Fee Payment
          </Button>
        </Stack>
      </FeeShell>
    );
  }

  const back = (state: FeeReturnState) => navigate("/fee_payment", { state });

  return (
    <FeeShell>
      <Box sx={{ maxWidth: 672, mx: "auto", mt: { xs: 2, md: 0 } }}>
        <PaymentFailureCard
          attempt={attempt}
          account={account}
          onRetry={() => back({ retry: true })}
          onChangeMethod={() => back({ changeMethod: true })}
          sx={enterUp()}
        />
      </Box>
    </FeeShell>
  );
}
