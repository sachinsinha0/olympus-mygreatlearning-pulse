import { Box, Button, CircularProgress, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Info, MapPin, Pencil } from "lucide-react";
import { currencySymbol, formatDueDate, formatMoney, groupDigits, isPaid, nextDue, outstanding, totalPaid } from "../../lib/fees/fees";
import type { FeeAccount } from "../../lib/fees/feeAccount";
import { DiscountTag, PaidTick, ReceiptPaid } from "./icons";
import { feeColors, paperSx } from "./parts";

type Props = {
  account: FeeAccount;
  /** True while the pincode is being resolved to a state. */
  resolvingLocation: boolean;
  onMakePayment: () => void;
  onEditLocation: () => void;
};

export function PaymentTab({ account, resolvingLocation, onMakePayment, onEditLocation }: Props) {
  const { currency, gstRate, installments } = account;
  const due = nextDue(installments);
  const plusGst = gstRate > 0 ? " + GST" : "";

  return (
    <Box
      sx={{
        ...paperSx,
        px: 2,
        pt: 2.5,
        pb: 2.5,
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 379px" },
        columnGap: 4,
        rowGap: 3,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h1" sx={{ fontSize: 24, fontWeight: 500, lineHeight: "29px" }}>
          {account.programName}
        </Typography>
        <Typography component="h2" sx={{ fontSize: 16, fontWeight: 700, lineHeight: "21px", mt: 2 }}>
          Payment Schedule
        </Typography>
        <ScheduleTable account={account} />

        {account.discountNote && (
          <>
            <Typography component="h2" sx={{ fontSize: 16, fontWeight: 700, lineHeight: "21px", mt: 4, mx: 1 }}>
              Discounts
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              sx={(t) => ({ mt: "17px", minHeight: 33, px: "9px", bgcolor: feeColors(t).discountBg, fontSize: 14 })}
            >
              <Box sx={(t) => ({ color: feeColors(t).green, display: "flex", flexShrink: 0 })}>
                <DiscountTag />
              </Box>
              {account.discountNote}
            </Stack>
          </>
        )}

        <Box
          sx={(t) => ({
            mt: 3,
            p: 2,
            border: `1px solid ${feeColors(t).totalBorder}`,
            borderRadius: "4px",
            bgcolor: feeColors(t).totalBg,
          })}
        >
          <Typography sx={{ fontSize: 16, lineHeight: "24px" }}>Total Fee Paid</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 500, lineHeight: "29px", mt: 1 }}>
            {formatMoney(totalPaid(installments), currency, { space: true })}
            {plusGst}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ pt: { md: "76px" } }}>
        {due ? (
          <>
            <NextInstallmentCard
              amount={formatMoney(outstanding(due), currency, { space: true }) + plusGst}
              dueDate={formatDueDate(due.dueDate)}
              loading={resolvingLocation}
              onPay={onMakePayment}
            />
            {gstRate > 0 && <LocationCard location={account.location} resolving={resolvingLocation} onEdit={onEditLocation} />}
          </>
        ) : (
          <PaidUpCard />
        )}
      </Box>
    </Box>
  );
}

function ScheduleTable({ account }: { account: FeeAccount }) {
  const cell = { p: 2, fontSize: 14, lineHeight: "21px" };
  // The status column only exists once something has been paid.
  const anyPaid = account.installments.some((i) => i.paid > 0);
  const COLS = { xs: "1.2fr 1fr", sm: anyPaid ? "28% 23% 32% 17%" : "35% 33% 32%" };
  return (
    <Box role="table" aria-label="Payment schedule">
      <Box role="row" sx={{ display: "grid", gridTemplateColumns: COLS, alignItems: "center", borderBottom: 1, borderColor: "divider", minHeight: 57 }}>
        <Box role="columnheader" sx={{ ...cell, fontWeight: 600 }}>
          Fee Type
        </Box>
        <Box role="columnheader" sx={{ ...cell, fontWeight: 600 }}>
          Amount ({currencySymbol(account.currency)})
          {account.gstRate > 0 && <Box sx={{ fontSize: 11, fontWeight: 400, lineHeight: "16px" }}>(Exclusive of GST)</Box>}
        </Box>
        <Box role="columnheader" sx={{ ...cell, fontWeight: 600, display: { xs: "none", sm: "block" } }}>
          Due Date
        </Box>
        {anyPaid && <Box role="columnheader" sx={{ display: { xs: "none", sm: "block" } }} />}
      </Box>
      {account.installments.map((i) => (
        <Box
          key={i.id}
          role="row"
          sx={{ display: "grid", gridTemplateColumns: COLS, alignItems: "center", borderBottom: 1, borderColor: "divider", minHeight: 53 }}
        >
          <Box role="cell" sx={cell}>
            {i.label}
          </Box>
          <Box role="cell" sx={cell}>
            {groupDigits(i.amount, account.currency, 1)}
          </Box>
          <Box role="cell" sx={{ ...cell, pt: { xs: 0, sm: 2 } }}>
            {formatDueDate(i.dueDate)}
          </Box>
          {anyPaid && (
            <Box role="cell" sx={{ ...cell, pt: { xs: 0, sm: 2 } }}>
              {isPaid(i) ? <Status label="PAID" tick /> : i.paid > 0 ? <Status label="PARTLY PAID" /> : null}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

function Status({ label, tick }: { label: string; tick?: boolean }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.5}
      sx={(t) => ({ color: tick ? feeColors(t).green : t.palette.extended.warning.color, fontSize: 14 })}
    >
      {tick && <PaidTick />}
      {label}
    </Stack>
  );
}

function NextInstallmentCard({ amount, dueDate, loading, onPay }: { amount: string; dueDate: string; loading: boolean; onPay: () => void }) {
  return (
    <Box sx={(t) => ({ ...paperSx, bgcolor: feeColors(t).nextCardBg, textAlign: "center", px: 2, pt: 2, pb: 2.5 })}>
      <Typography sx={{ fontSize: 16, lineHeight: "24px" }}>Next Installment Amount</Typography>
      <Typography sx={{ fontSize: 24, fontWeight: 500, lineHeight: "29px", mt: "34px" }}>{amount}</Typography>
      <Typography sx={{ fontSize: 14, lineHeight: "20px", mt: "34px" }}>
        Due Date:&nbsp; {dueDate}
      </Typography>
      <Button
        variant="contained"
        onClick={onPay}
        disabled={loading}
        sx={{
          mt: "36px",
          height: 36,
          px: 2,
          fontSize: 16,
          fontWeight: 400,
          letterSpacing: 0,
          borderRadius: "4px",
          position: "relative",
          boxShadow: "0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)",
        }}
      >
        Make Payment
        {loading && (
          <CircularProgress
            size={24}
            thickness={4}
            aria-label="Looking up your state"
            sx={{ position: "absolute", left: "50%", top: "50%", mt: "-12px", ml: "-12px" }}
          />
        )}
      </Button>
    </Box>
  );
}

function LocationCard({ location, resolving, onEdit }: { location: FeeAccount["location"]; resolving: boolean; onEdit: () => void }) {
  return (
    <Box sx={{ ...paperSx, mt: "38px", px: 2, pt: 2, pb: 3 }}>
      <Typography component="h2" sx={{ fontSize: 16, fontWeight: 700, lineHeight: "24px" }}>
        Location Details
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ mt: 1.5, mb: 1.5, minHeight: 40 }}>
        <MapPin size={24} strokeWidth={2} />
        <Typography sx={{ fontSize: 16, fontWeight: 500, ml: 0.5 }}>
          {location?.state ?? ""}, {location?.pincode ?? ""}
        </Typography>
        <Tooltip title={location ? "Edit location" : "Add location"}>
          <span>
            <IconButton aria-label="Edit location" onClick={onEdit} disabled={resolving} sx={{ ml: 1, color: "text.secondary" }}>
              <Pencil size={20} fill="currentColor" strokeWidth={1.5} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Divider />
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ mt: 1.25 }}>
        <Info size={18} />
        <Typography sx={{ fontSize: 14, lineHeight: "20px" }}>Location will be included on the receipt</Typography>
      </Stack>
    </Box>
  );
}

function PaidUpCard() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={(t) => ({ ...paperSx, bgcolor: feeColors(t).paidCardBg, width: { xs: "100%", md: 341 }, height: { md: 352 }, py: { xs: 5, md: 3 }, textAlign: "center" })}
    >
      <Box sx={(t) => ({ color: feeColors(t).green, display: "flex" })}>
        <ReceiptPaid />
      </Box>
      <Typography sx={(t) => ({ color: feeColors(t).green, fontSize: 16, fontWeight: 700, lineHeight: "21px" })}>No Payment Pending</Typography>
      <Typography sx={{ fontSize: 16, lineHeight: "24px" }}>Thanks for your payment</Typography>
    </Stack>
  );
}
