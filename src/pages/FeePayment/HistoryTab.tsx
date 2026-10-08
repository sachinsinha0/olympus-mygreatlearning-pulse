import { Box, ButtonBase, Stack, Tooltip, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { formatMoney, formatPaidAt, isReceiptAvailable, type Transaction } from "../../lib/fees/fees";
import type { FeeAccount } from "../../lib/fees/feeAccount";
import { ReceiptDownload } from "./icons";
import { downloadReceipt } from "./receipt";
import { feeColors, paperSx } from "./parts";

export function HistoryTab({ account }: { account: FeeAccount }) {
  return (
    <Stack gap={2.5}>
      <Stack
        direction="row"
        alignItems="center"
        sx={(t) => ({ minHeight: 52, py: 1, pl: 2, pr: 2, borderRadius: "4px", bgcolor: feeColors(t).infoBg, color: feeColors(t).infoText })}
      >
        <Box component={Info} size={22} sx={(t) => ({ color: feeColors(t).infoIcon, flexShrink: 0, mr: 1.5 })} />
        <Typography sx={{ fontSize: 14, lineHeight: "20px", py: 1 }}>
          Payment receipts generated on or after 1st April 2023 will be available for download here
        </Typography>
      </Stack>

      {account.transactions.length === 0 ? (
        <Box sx={{ ...paperSx, py: 6, textAlign: "center" }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>No payments yet</Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Payments you make will show up here with their receipts.</Typography>
        </Box>
      ) : (
        // Oldest first, as prod lists them.
        account.transactions.map((t) => <HistoryRow key={t.txnId} txn={t} account={account} />)
      )}
    </Stack>
  );
}

function HistoryRow({ txn, account }: { txn: Transaction; account: FeeAccount }) {
  const available = isReceiptAvailable(txn);
  const body = { fontSize: 16, lineHeight: "24px" };
  return (
    <Box
      sx={{
        ...paperSx,
        minHeight: 75,
        py: { xs: 2, md: 1.5 },
        pr: { xs: 2, md: 0 },
        display: "grid",
        alignItems: "center",
        columnGap: { xs: 1.5, md: 0 },
        rowGap: 0.5,
        gridTemplateColumns: { xs: "62px 1fr auto", md: "113px 201px 101px 201px 302px 1fr" },
        gridTemplateAreas: {
          xs: `"icon what amount" "icon status status" "icon mode mode" "icon txn txn"`,
          md: `"icon what status mode txn amount"`,
        },
      }}
    >
      <Box sx={{ gridArea: "icon", alignSelf: { xs: "start", md: "center" }, pl: 1.5 }}>
        <Tooltip title={available ? "Download receipt" : "Receipts are available for payments made on or after 1st April 2023"}>
          <ButtonBase
            aria-label={`Download receipt for ${txn.label}`}
            aria-disabled={!available}
            onClick={() => available && downloadReceipt(txn, account)}
            sx={(t) => ({ color: feeColors(t).green, borderRadius: "4px", cursor: available ? "pointer" : "default" })}
          >
            <ReceiptDownload />
          </ButtonBase>
        </Tooltip>
      </Box>
      <Box sx={{ gridArea: "what", minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, lineHeight: "17px" }}>{formatPaidAt(txn.paidAt)}</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 500, lineHeight: "28px", mt: "3px" }}>{txn.label}</Typography>
      </Box>
      <Typography sx={(t) => ({ ...body, gridArea: "status", color: feeColors(t).green })}>Paid</Typography>
      <Typography sx={{ ...body, gridArea: "mode" }}>Mode: {txn.mode}</Typography>
      <Typography sx={{ ...body, gridArea: "txn", minWidth: 0, overflowWrap: "anywhere" }}>Transaction id: {txn.txnId}</Typography>
      <Typography sx={{ ...body, gridArea: "amount", fontWeight: { xs: 600, md: 400 } }}>
        {formatMoney(txn.amount, txn.currency, { space: true, decimal: true })}
      </Typography>
    </Box>
  );
}
