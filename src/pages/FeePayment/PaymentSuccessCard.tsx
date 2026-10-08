import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Box, Button, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { Check, Copy, Download, Headset } from "lucide-react";
import { formatReceiptDate, formatReceiptMoney, receiptLines, type PaymentMode, type Transaction } from "../../lib/fees/fees";
import type { FeeAccount } from "../../lib/fees/feeAccount";
import { feeColors } from "./parts";
import { downloadReceipt } from "./receipt";
import { burstOut, drawStroke, enterUp, fadeIn, popIn, rippleOut, SUCCESS_TIMELINE as T } from "./motion";

/**
 * Payment confirmation card, after the approved "Payment successful" card in
 * gl-payment-page (src/components/PaymentSuccess.tsx), rebuilt on this repo's
 * theme. Uses the Olympus fee page green so the whole fee flow has one green.
 */

const tabularNums = { fontVariantNumeric: "tabular-nums" } as const;

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  m: "-1px",
  p: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

const METHOD_LABEL: Record<PaymentMode, string> = {
  UPI: "UPI",
  "Credit Card": "Credit card",
  Netbanking: "Netbanking",
};

/** 24 / 32 / 40px side padding for every section of the card. */
const sectionPx = { xs: 3, sm: 4, md: 5 };

type Props = {
  txn: Transaction;
  account: FeeAccount;
  sx?: SxProps<Theme>;
};

export function PaymentSuccessCard({ txn, account, sx }: Props) {
  const lines = receiptLines(txn);
  const money = (n: number) => formatReceiptMoney(n, txn.currency);

  return (
    <Box
      component="section"
      aria-labelledby="payment-success-title"
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
      {/* Confirmation. The green tint fades in behind the content as the mark lands. */}
      <Box
        sx={(t) => ({
          position: "relative",
          isolation: "isolate",
          px: sectionPx,
          pt: 4,
          pb: 3,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            background: `linear-gradient(180deg, ${alpha(feeColors(t).green, t.palette.mode === "dark" ? 0.14 : 0.1)} 0%, ${t.palette.background.paper} 100%)`,
            ...fadeIn(T.tint),
          },
        })}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <SuccessMark />
          <Button
            variant="outlined"
            startIcon={<Download size={16} />}
            onClick={() => downloadReceipt(txn, account)}
            sx={[
              (t) => ({
                height: 32,
                px: 1.5,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 0,
                color: "text.primary",
                bgcolor: "background.paper",
                borderColor: alpha(t.palette.text.primary, 0.2),
                "&:hover": { bgcolor: "surfaceContainer.high", borderColor: alpha(t.palette.text.primary, 0.32) },
                "@media print": { display: "none" },
              }),
              enterUp(T.action),
            ]}
          >
            Download receipt
          </Button>
        </Stack>
        <Box sx={enterUp(T.title)}>
          <Typography id="payment-success-title" variant="h2" component="h2" sx={{ mt: 2 }}>
            Payment successful
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: "24px", color: "text.secondary", mt: 1, maxWidth: "52ch", textWrap: "pretty" }}>
            <Box component="span" sx={{ color: "text.primary", fontWeight: 600, ...tabularNums }}>
              {money(txn.amount)}
            </Box>{" "}
            paid towards {account.programName}.
          </Typography>
        </Box>
      </Box>

      {/* Key details */}
      <Box
        component="dl"
        sx={[
          {
            m: 0,
            px: sectionPx,
            pb: 3,
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
            columnGap: 4,
            rowGap: 2,
          },
          enterUp(T.details),
        ]}
      >
        <Detail label="Transaction ID" action={<CopyButton value={txn.txnId} label="Transaction ID" />}>
          <Box component="span" sx={tabularNums}>
            {txn.txnId}
          </Box>
        </Detail>
        <Detail label="Paid on">
          <Box component="time" dateTime={txn.paidAt} sx={tabularNums}>
            {formatReceiptDate(txn.paidAt)}
          </Box>
        </Detail>
        <Detail label="Payment method">{METHOD_LABEL[txn.mode]}</Detail>
        <Detail label="Receipt sent to">{account.email}</Detail>
      </Box>

      {/* Breakdown */}
      <Box
        sx={[
          (t) => ({
            px: sectionPx,
            py: 3,
            // A step off the card surface, in the card's own tone family.
            bgcolor: t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : t.palette.surfaceContainer.high,
            borderTop: 1,
            borderBottom: 1,
            borderColor: "divider",
          }),
          enterUp(T.breakdown),
        ]}
      >
        <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 600, lineHeight: "20px" }}>
          Payment breakdown
        </Typography>
        <Stack component="dl" gap={1} sx={{ m: 0, mt: 2 }}>
          {lines.map((line, i) => (
            <Stack key={line.label} direction="row" gap={2} justifyContent="space-between">
              <Typography component="dt" variant="body2" sx={{ color: "text.secondary" }}>
                {line.label}
              </Typography>
              <Typography component="dd" variant="body2" sx={{ m: 0, whiteSpace: "nowrap", ...tabularNums }}>
                {i > 0 ? "+" : ""}
                {money(line.amount)}
              </Typography>
            </Stack>
          ))}
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ pt: 2, mt: 1, borderTop: 1, borderColor: "divider" }}
          >
            <Typography component="dt" variant="subtitle1" sx={{ lineHeight: "24px" }}>
              Fee paid
            </Typography>
            <Typography component="dd" variant="h5" sx={{ m: 0, whiteSpace: "nowrap", ...tabularNums }}>
              {money(txn.amount)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Support */}
      <SupportLine contact={account.contact} sx={[{ px: sectionPx, py: 3 }, enterUp(T.support)]} />
    </Box>
  );
}

// Particles for the success burst: eight directions, alternating size.
const BURST = [
  { angle: 0, size: 8, tone: "light" },
  { angle: 45, size: 6, tone: "blue" },
  { angle: 90, size: 8, tone: "amber" },
  { angle: 135, size: 6, tone: "main" },
  { angle: 180, size: 8, tone: "blue" },
  { angle: 225, size: 6, tone: "amber" },
  { angle: 270, size: 8, tone: "main" },
  { angle: 315, size: 6, tone: "light" },
] as const;

function burstColor(t: Theme, tone: (typeof BURST)[number]["tone"]) {
  const green = feeColors(t).green;
  return { main: green, light: alpha(green, 0.55), blue: "#4788EA", amber: "#FFB74D" }[tone];
}

/** Green disc pops in, the tick draws itself, then a burst and two ripples go out. */
function SuccessMark() {
  return (
    <Box aria-hidden sx={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      {[T.ripple, T.ripple + 200].map((delay) => (
        <Box
          key={delay}
          sx={[
            (t) => ({ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${alpha(feeColors(t).green, 0.55)}`, opacity: 0 }),
            rippleOut(delay),
          ]}
        />
      ))}
      {BURST.map(({ angle, size, tone }) => (
        <Box
          key={angle}
          style={{ "--burst-angle": `${angle}deg` } as CSSProperties}
          sx={[
            (t) => ({
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              ml: `${-size / 2}px`,
              mt: `${-size / 2}px`,
              borderRadius: "50%",
              bgcolor: burstColor(t, tone),
              // Rests hidden, so reduced-motion users never see stray dots.
              opacity: 0,
            }),
            burstOut(T.burst),
          ]}
        />
      ))}
      <Box
        sx={[
          (t) => ({
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            bgcolor: feeColors(t).green,
            color: t.palette.mode === "dark" ? "#0b2a20" : "#fff",
            display: "grid",
            placeItems: "center",
            boxShadow: `0 4px 12px ${alpha(feeColors(t).green, 0.32)}`,
          }),
          popIn(T.mark),
        ]}
      >
        <Box component="svg" viewBox="0 0 24 24" sx={{ width: 32, height: 32, display: "block", overflow: "visible" }}>
          <Box
            component="path"
            d="M5.5 12.5l4.25 4.25L18.5 8"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={[{ strokeDasharray: 1, strokeDashoffset: 0 }, drawStroke(T.tick)]}
          />
        </Box>
      </Box>
    </Box>
  );
}

function Detail({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography component="dt" variant="caption" sx={{ color: "text.secondary", display: "block", letterSpacing: 0 }}>
        {label}
      </Typography>
      <Stack component="dd" direction="row" gap={0.5} alignItems="center" sx={{ m: 0, mt: 0.25 }}>
        <Typography component="span" sx={{ fontSize: 14, fontWeight: 500, lineHeight: "22px", overflowWrap: "anywhere", minWidth: 0 }}>
          {children}
        </Typography>
        {action}
      </Stack>
    </Box>
  );
}

type CopyState = "idle" | "copied" | "failed";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  const title = state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : `Copy ${label}`;

  return (
    <>
      <Tooltip title={title} placement="top">
        <IconButton
          size="small"
          onClick={copy}
          aria-label={`Copy ${label}`}
          // A step of negative margin keeps the 30px button from making its row taller than the text.
          sx={{ width: 30, height: 30, my: "-4px", color: "text.secondary", "@media print": { display: "none" } }}
        >
          {state === "copied" ? <Box component={Check} size={16} sx={(t) => ({ color: feeColors(t).green })} /> : <Copy size={16} />}
        </IconButton>
      </Tooltip>
      <Box component="span" role="status" sx={visuallyHidden}>
        {state === "copied" ? `${label} copied` : state === "failed" ? `Couldn't copy ${label}` : ""}
      </Box>
    </>
  );
}

function SupportLine({ contact, sx }: { contact: FeeAccount["contact"]; sx?: SxProps<Theme> }) {
  return (
    <Stack direction="row" gap={2} alignItems="flex-start" sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <Box component={Headset} size={20} strokeWidth={1.75} sx={{ color: "text.secondary", flexShrink: 0, mt: "1px" }} />
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Questions about this payment? Call{" "}
        {contact.phones.map((phone, i) => (
          <span key={phone}>
            {i > 0 && " or "}
            <Link href={`tel:${phone.replace(/\s/g, "")}`} underline="hover" sx={{ whiteSpace: "nowrap", ...tabularNums }}>
              {phone}
            </Link>
          </span>
        ))}{" "}
        <Box component="span" sx={{ whiteSpace: "nowrap" }}>
          (Mon to Fri, 10 AM to 6 PM)
        </Box>
        , or email{" "}
        <Link href={`mailto:${contact.email}`} underline="hover" sx={{ overflowWrap: "anywhere" }}>
          {contact.email}
        </Link>
        .
      </Typography>
    </Stack>
  );
}
