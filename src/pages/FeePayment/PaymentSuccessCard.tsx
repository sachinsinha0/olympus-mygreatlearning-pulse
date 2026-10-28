import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Box, Button, ButtonBase, Collapse, IconButton, Link, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { Check, ChevronDown, Copy, Download, Headset } from "lucide-react";
import { formatReceiptDate, formatReceiptMoney, receiptLines, type PaymentMode, type Transaction } from "../../lib/fees/fees";
import type { FeeAccount } from "../../lib/fees/feeAccount";
import { feeColors } from "./parts";
import { downloadReceipt } from "./receipt";
import { burstOut, drawStroke, enterUp, fadeIn, popIn, rippleOut, SUCCESS_TIMELINE as T } from "./motion";

/**
 * Payment confirmation card, after the approved "Payment successful" card in
 * gl-payment-page (src/components/PaymentSuccess.tsx), rebuilt on this repo's
 * theme. Uses the Olympus fee page green so the whole fee flow has one green.
 *
 * Below md (phones and tablets) the card is compact so the Refer & Earn panel
 * under it shows without scrolling: the mark sits beside the title and the
 * details stack. On phones the breakdown also folds away (the total is already
 * in the headline) and the receipt download moves to the card's footer row.
 */

export const tabularNums = { fontVariantNumeric: "tabular-nums" } as const;

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

export const METHOD_LABEL: Record<PaymentMode, string> = {
  UPI: "UPI",
  "Credit Card": "Credit card",
  Netbanking: "Netbanking",
};

/** 24 / 32 / 40px side padding for every section of the card. */
export const sectionPx = { xs: 3, sm: 4, md: 5 };

type Props = {
  txn: Transaction;
  account: FeeAccount;
  /** Below md, leave the support line out (the page shows it after the referral panel). */
  supportOnDesktopOnly?: boolean;
  sx?: SxProps<Theme>;
};

export function PaymentSuccessCard({ txn, account, supportOnDesktopOnly = false, sx }: Props) {
  const lines = receiptLines(txn);
  const money = (n: number) => formatReceiptMoney(n, txn.currency);
  const desktop = useMediaQuery((t: Theme) => t.breakpoints.up("md"), { noSsr: true });
  // Tablets and up have the room to show the breakdown open, with the download in the header.
  const roomy = useMediaQuery((t: Theme) => t.breakpoints.up("sm"), { noSsr: true });
  // Folded only when the referral panel needs the room below the card.
  const [breakdownOpen, setBreakdownOpen] = useState(!supportOnDesktopOnly);
  const breakdownShown = roomy || breakdownOpen;

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
          pt: { xs: 3, md: 4 },
          pb: { xs: 2.5, md: 3 },
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={{ xs: 1.5, md: 2 }}>
          <SuccessMark />
          {!desktop && (
            <Typography id="payment-success-title" variant="h3" component="h2" sx={[{ flex: 1, minWidth: 0 }, enterUp(T.title)]}>
              Payment successful
            </Typography>
          )}
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
                display: { xs: "none", sm: "inline-flex" },
              }),
              enterUp(T.action),
            ]}
          >
            Download receipt
          </Button>
        </Stack>
        <Box sx={enterUp(T.title)}>
          {desktop && (
            <Typography id="payment-success-title" variant="h2" component="h2" sx={{ mt: 2 }}>
              Payment successful
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: { xs: 15, md: 16 },
              lineHeight: { xs: "22px", md: "24px" },
              color: "text.secondary",
              mt: { xs: 1.5, md: 1 },
              maxWidth: "52ch",
              textWrap: "pretty",
            }}
          >
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
            pb: { xs: 2.5, md: 3 },
            display: "grid",
            // One detail per row on phones and tablets; two columns on desktop.
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
            columnGap: 4,
            rowGap: { xs: 1.5, md: 2 },
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

      {/* Breakdown. On phones it folds behind a footer row that also holds the receipt download. */}
      <Box
        sx={[
          (t) => ({
            px: roomy ? sectionPx : 0,
            py: roomy ? 3 : 0,
            // A step off the card surface, in the card's own tone family.
            bgcolor: t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : t.palette.surfaceContainer.high,
            borderTop: 1,
            borderBottom: desktop || !supportOnDesktopOnly ? 1 : 0,
            borderColor: "divider",
          }),
          enterUp(T.breakdown),
        ]}
      >
        {roomy ? (
          <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 600, lineHeight: "20px" }}>
            Payment breakdown
          </Typography>
        ) : (
          <Stack direction="row" alignItems="stretch">
            <ButtonBase
              onClick={() => setBreakdownOpen((v) => !v)}
              aria-expanded={breakdownOpen}
              aria-controls="payment-breakdown"
              sx={{ flex: 1, justifyContent: "flex-start", gap: 0.75, minHeight: 48, pl: sectionPx, pr: 1.5, textAlign: "left" }}
            >
              <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 600, lineHeight: "20px" }}>
                Payment breakdown
              </Typography>
              <Box
                component={ChevronDown}
                size={18}
                aria-hidden
                sx={{
                  color: "text.secondary",
                  transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: breakdownOpen ? "rotate(180deg)" : "none",
                }}
              />
            </ButtonBase>
            <Box aria-hidden sx={{ width: "1px", my: 1.5, bgcolor: "divider" }} />
            <ButtonBase
              onClick={() => downloadReceipt(txn, account)}
              sx={{ gap: 0.75, minHeight: 48, px: sectionPx, fontSize: 14, fontWeight: 500, color: "primary.main", "@media print": { display: "none" } }}
            >
              <Download size={16} aria-hidden />
              Receipt
            </ButtonBase>
          </Stack>
        )}
        <Collapse in={breakdownShown} timeout={roomy ? 0 : "auto"}>
          <Stack id="payment-breakdown" component="dl" gap={1} sx={{ m: 0, mt: roomy ? 2 : 0, px: roomy ? 0 : sectionPx, pt: roomy ? 0 : 0.5, pb: roomy ? 0 : 2.5 }}>
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
        </Collapse>
      </Box>

      {/* Support */}
      <SupportLine
        contact={account.contact}
        sx={[{ px: sectionPx, py: { xs: 2.5, md: 3 } }, supportOnDesktopOnly && { display: { xs: "none", md: "flex" } }, enterUp(T.support)]}
      />
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
  // Drawn at 56px; scaled to 40px below md so it can sit beside the title.
  return (
    <Box aria-hidden sx={{ width: { xs: 40, md: 56 }, height: { xs: 40, md: 56 }, flexShrink: 0 }}>
      <Box sx={{ position: "relative", width: 56, height: 56, transform: { xs: "scale(0.7143)", md: "none" }, transformOrigin: "top left" }}>
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
    </Box>
  );
}

export function Detail({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
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

export function CopyButton({ value, label }: { value: string; label: string }) {
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

export function SupportLine({ contact, sx }: { contact: FeeAccount["contact"]; sx?: SxProps<Theme> }) {
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
