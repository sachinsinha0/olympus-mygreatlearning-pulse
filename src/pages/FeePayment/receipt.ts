import { formatMoney, formatPaidAt, type Transaction } from "../../lib/fees/fees";
import type { FeeAccount } from "../../lib/fees/feeAccount";

/** Stand-in for the PDF receipt service: a printable HTML receipt. */
export function downloadReceipt(txn: Transaction, account: FeeAccount) {
  const money = (n: number) => formatMoney(n, txn.currency, { space: true, decimal: true });
  const tax = txn.amount - txn.subtotal;
  const where = account.location ? `${account.location.state ?? ""}, ${account.location.pincode}` : "—";
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${txn.txnId}</title>
<style>body{font:15px/1.5 system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#1a1b1e}
h1{font-size:22px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin-top:24px}
td{padding:8px 0;border-bottom:1px solid #ebebef}td:last-child{text-align:right}.muted{color:#45464f}</style></head>
<body><h1>Payment Receipt</h1><div class="muted">Great Learning · ${account.programName}</div>
<table><tr><td>Transaction id</td><td>${txn.txnId}</td></tr>
<tr><td>Date</td><td>${formatPaidAt(txn.paidAt)}</td></tr>
<tr><td>Fee type</td><td>${txn.label}</td></tr>
<tr><td>Mode</td><td>${txn.mode}</td></tr>
<tr><td>Location</td><td>${where}</td></tr>
<tr><td>Amount</td><td>${money(txn.subtotal)}</td></tr>
${tax > 0 ? `<tr><td>GST</td><td>${money(tax)}</td></tr>` : ""}
<tr><td><b>Total paid</b></td><td><b>${money(txn.amount)}</b></td></tr></table></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${txn.txnId}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
