import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { Info, RotateCcw, TriangleAlert } from "lucide-react";
import { formatReceiptDate, formatReceiptMoney } from "../../lib/fees/fees";
import { FAILURE_REASONS, type FailedAttempt } from "../../lib/fees/failures";
import type { FeeAccount } from "../../lib/fees/feeAccount";
import { enterUp, popIn, rippleOut } from "./motion";
import { CopyButton, Detail, METHOD_LABEL, sectionPx, SupportLine, tabularNums } from "./PaymentSuccessCard";

/**
 * "Payment failed" card, after the approved failure card in gl-payment-page
 * (src/components/PaymentFailure.tsx), on the same shell as PaymentSuccessCard.
 * No referral here: getting the payment through is the only goal.
 */

/** Delays (ms) for the failure page's entry, quicker than the success celebration. */
const T = { ripple: 280, text: 120, reason: 200, actions: 260, details: 320, refund: 380 } as const;

type Props = {
  attempt: FailedAttempt;
  account: FeeAccount;
  onRetry: () => void;
  onChangeMethod: () => void;
  sx?: SxProps<Theme>;
};

export function PaymentFailureCard({ attempt, account, onRetry, onChangeMethod, sx }: Props) {
  const { title, reason, advice } = FAILURE_REASONS[attempt.code];
  const money = formatReceiptMoney(attempt.amount, attempt.currency);
  const desktop = useMediaQuery((t: Theme) => t.breakpoints.up("md"), { noSsr: true });

  return (
    <Box
      component="section"
      aria-labelledby="payment-failure-title"
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "outlineVariant.main",
          borderRadius: "8px",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Outcome, reason and the way forward */}
      <Box
        sx={(t) => ({
          px: sectionPx,
          pt: { xs: 3, md: 4 },
          pb: { xs: 3, md: 4 },
          // Fades out by 45% so the reason panel below stands out from it.
          background: `linear-gradient(180deg, ${alpha(t.palette.error.main, t.palette.mode === "dark" ? 0.14 : 0.08)} 0%, ${t.palette.background.paper} 45%)`,
        })}
      >
        <Stack direction="row" alignItems="center" gap={{ xs: 1.5, md: 2 }}>
          <ErrorMark />
          {!desktop && (
            <Typography id="payment-failure-title" variant="h3" component="h2" sx={[{ flex: 1, minWidth: 0 }, enterUp(T.text)]}>
              {title}
            </Typography>
          )}
        </Stack>
        <Box sx={enterUp(T.text)}>
          {desktop && (
            <Typography id="payment-failure-title" variant="h2" component="h2" sx={{ mt: 2 }}>
              {title}
            </Typography>
          )}
          <Typography
            sx={{ fontSize: { xs: 15, md: 16 }, lineHeight: { xs: "22px", md: "24px" }, color: "text.secondary", mt: { xs: 1.5, md: 1 }, maxWidth: "52ch", textWrap: "pretty" }}
          >
            Sorry {account.firstName}, your payment of{" "}
            <Box component="span" sx={{ color: "text.primary", fontWeight: 600, ...tabularNums }}>
              {money}
            </Box>{" "}
            for {account.programName} did not go through.
          </Typography>
        </Box>

        <Box
          sx={[
            (t) => ({ mt: 3, p: 2, borderRadius: "4px", bgcolor: alpha(t.palette.error.main, t.palette.mode === "dark" ? 0.14 : 0.08), color: "error.dark" }),
            enterUp(T.reason),
          ]}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: "20px" }}>{reason}</Typography>
          <Typography sx={{ fontSize: 14, lineHeight: "20px", mt: 0.5 }}>{advice}</Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={[{ mt: 3, alignItems: { sm: "center" } }, enterUp(T.actions)]}>
          <Button
            variant="contained"
            onClick={onRetry}
            startIcon={<RotateCcw size={18} />}
            sx={{ height: 44, px: 3, fontSize: 15, fontWeight: 600, letterSpacing: 0, borderRadius: "4px", whiteSpace: "nowrap" }}
          >
            Retry payment
          </Button>
          <Button onClick={onChangeMethod} sx={{ height: 44, px: 2, fontSize: 15, fontWeight: 600, letterSpacing: 0, whiteSpace: "nowrap" }}>
            Change payment method
          </Button>
        </Stack>
      </Box>

      {/* Attempt details, kept for support conversations */}
      <Box
        component="dl"
        sx={[
          {
            m: 0,
            px: sectionPx,
            py: { xs: 2.5, md: 3 },
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
            columnGap: 4,
            rowGap: { xs: 1.5, md: 2 },
            borderTop: 1,
            borderColor: "divider",
          },
          enterUp(T.details),
        ]}
      >
        <Detail label="Transaction ID" action={<CopyButton value={attempt.txnId} label="Transaction ID" />}>
          <Box component="span" sx={tabularNums}>
            {attempt.txnId}
          </Box>
        </Detail>
        <Detail label="Attempted on">
          <Box component="time" dateTime={attempt.attemptedAt} sx={tabularNums}>
            {formatReceiptDate(attempt.attemptedAt)}
          </Box>
        </Detail>
        <Detail label="Payment method">{METHOD_LABEL[attempt.mode]}</Detail>
        <Detail label="Amount">
          <Box component="span" sx={tabularNums}>
            {money}
          </Box>
        </Detail>
      </Box>

      {/* Refund reassurance and support */}
      <Box
        sx={[
          (t) => ({
            px: sectionPx,
            py: { xs: 2.5, md: 3 },
            bgcolor: t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : t.palette.surfaceContainer.high,
            borderTop: 1,
            borderColor: "divider",
          }),
          enterUp(T.refund),
        ]}
      >
        <Stack direction="row" gap={2} alignItems="flex-start">
          <Box component={Info} size={20} strokeWidth={1.75} sx={{ color: "primary.main", flexShrink: 0, mt: "1px" }} />
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            If any money was debited, it will be refunded to your source account within{" "}
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              3-5 business days
            </Box>
            .
          </Typography>
        </Stack>
        <SupportLine contact={account.contact} sx={{ mt: 2 }} />
      </Box>
    </Box>
  );
}

/** Red disc pops in with one ripple. Drawn at 56px, 40px below md beside the title. */
function ErrorMark() {
  return (
    <Box aria-hidden sx={{ width: { xs: 40, md: 56 }, height: { xs: 40, md: 56 }, flexShrink: 0 }}>
      <Box sx={{ position: "relative", width: 56, height: 56, transform: { xs: "scale(0.7143)", md: "none" }, transformOrigin: "top left" }}>
        <Box
          sx={[
            (t) => ({ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${alpha(t.palette.error.main, 0.5)}`, opacity: 0 }),
            rippleOut(T.ripple),
          ]}
        />
        <Box
          sx={[
            (t) => ({
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              bgcolor: "error.main",
              color: "error.contrastText",
              display: "grid",
              placeItems: "center",
              boxShadow: `0 4px 12px ${alpha(t.palette.error.main, 0.3)}`,
            }),
            popIn(),
          ]}
        >
          <TriangleAlert size={30} strokeWidth={2.25} />
        </Box>
      </Box>
    </Box>
  );
}
