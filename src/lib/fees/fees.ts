/**
 * Fee payment — pure logic for the /fee_payment clone.
 *
 * Money formats deliberately mirror the production page, quirks included:
 * the schedule table prints "1,00,000.0", the summary card "₹ 1,00,000",
 * the checkout "₹118,000" and the success page "₹ 118000.0".
 */

export type Currency = "INR" | "USD";

export type Installment = {
  id: string;
  label: string;
  /** Amount due, exclusive of GST. */
  amount: number;
  /** ISO date (YYYY-MM-DD). */
  dueDate: string;
  /** How much of `amount` has been paid so far. */
  paid: number;
};

export type PaymentMode = "UPI" | "Credit Card" | "Netbanking";

export type Transaction = {
  txnId: string;
  traceId: string;
  label: string;
  /** Local ISO date-time, no zone — rendered as wall-clock time. */
  paidAt: string;
  mode: PaymentMode;
  /** Exclusive of tax. */
  subtotal: number;
  /** What was actually charged, tax included. */
  amount: number;
  currency: Currency;
  /** GST lines charged on top of `subtotal`; absent for untaxed programs. */
  tax?: TaxLine[];
};

export type TaxLine = { label: string; amount: number };

const SYMBOL: Record<Currency, string> = { INR: "₹", USD: "$" };

/** GL's GST registration state. Same-state buyers pay CGST + SGST, everyone else IGST. */
export const SUPPLIER_STATE = "HARYANA";

/** Receipts are only downloadable for payments made on or after this date. */
export const RECEIPTS_FROM = "2023-04-01";

export function currencySymbol(currency: Currency): string {
  return SYMBOL[currency];
}

/** Locale digit grouping: lakh/crore for INR, thousands for USD. */
export function groupDigits(n: number, currency: Currency, fractionDigits = 0): string {
  return n.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: Math.max(fractionDigits, 2),
  });
}

type MoneyOpts = {
  /** Space between symbol and number ("₹ 1,000" vs "₹1,000"). */
  space?: boolean;
  /** Always show at least one decimal ("1,000.0"), like the Rails backend does. */
  decimal?: boolean;
  /** Thousands grouping even for INR ("₹118,000") — Razorpay's style. */
  western?: boolean;
  /** No grouping at all ("118000.0"). */
  plain?: boolean;
};

export function formatMoney(n: number, currency: Currency, opts: MoneyOpts = {}): string {
  const digits = opts.decimal ? 1 : 0;
  let body: string;
  if (opts.plain) {
    body = digits ? n.toFixed(Math.max(1, decimalsIn(n))) : String(n);
  } else {
    body = groupDigits(n, opts.western ? "USD" : currency, digits);
  }
  return `${SYMBOL[currency]}${opts.space ? " " : ""}${body}`;
}

function decimalsIn(n: number): number {
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : Math.min(2, s.length - i - 1);
}

/** "₹1,18,000.00" / "$2,000.00" — the receipt style: currency symbol, locale grouping, two decimals. */
export function formatReceiptMoney(n: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(n);
}

/** "8 Oct 2026, 10:10 am" */
export function formatReceiptDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * Line items for a receipt: what the payment went towards, then each tax line.
 * Payments recorded without a tax split still add up, via a single GST line.
 */
export function receiptLines(t: Transaction): TaxLine[] {
  const tax = t.tax ?? (t.amount > t.subtotal ? [{ label: "GST", amount: round2(t.amount - t.subtotal) }] : []);
  return [{ label: t.label, amount: t.subtotal }, ...tax];
}

/** "Sat, Oct 31" this year, "Thu, Aug 01, 2024" any other year. */
export function formatDueDate(iso: string, now: Date = new Date()): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = String(d).padStart(2, "0");
  return y === now.getFullYear() ? `${weekday}, ${month} ${d}` : `${weekday}, ${month} ${day}, ${y}`;
}

/** "Jan 12, 2019, 4:54 PM" */
export function formatPaidAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function outstanding(i: Installment): number {
  return Math.max(0, round2(i.amount - i.paid));
}

export function isPaid(i: Installment): boolean {
  return outstanding(i) === 0;
}

export function nextDue(installments: Installment[]): Installment | null {
  return installments.find((i) => !isPaid(i)) ?? null;
}

export function totalOutstanding(installments: Installment[]): number {
  return round2(installments.reduce((sum, i) => sum + outstanding(i), 0));
}

export function totalPaid(installments: Installment[]): number {
  return round2(installments.reduce((sum, i) => sum + i.paid, 0));
}

/**
 * Spread a payment over unpaid installments in schedule order.
 * Returns the new schedule and the labels of the installments it touched.
 */
export function allocatePayment(
  installments: Installment[],
  amount: number,
): { installments: Installment[]; touched: string[] } {
  let left = round2(amount);
  const touched: string[] = [];
  const next = installments.map((i) => {
    const owed = outstanding(i);
    if (left <= 0 || owed === 0) return i;
    const applied = Math.min(owed, left);
    left = round2(left - applied);
    touched.push(i.label);
    return { ...i, paid: round2(i.paid + applied) };
  });
  return { installments: next, touched };
}

/** GST lines for a subtotal. No rate (e.g. USD programs) means no lines. */
export function taxLines(subtotal: number, rate: number, buyerState: string | null): TaxLine[] {
  if (rate <= 0 || subtotal <= 0) return [];
  if (buyerState && buyerState.toUpperCase() === SUPPLIER_STATE) {
    const half = round2((subtotal * rate) / 2);
    return [
      { label: "CGST", amount: half },
      { label: "SGST", amount: half },
    ];
  }
  return [{ label: "IGST", amount: round2(subtotal * rate) }];
}

export function withTax(subtotal: number, lines: TaxLine[]): number {
  return round2(lines.reduce((sum, l) => sum + l.amount, subtotal));
}

/** Error message for a custom amount, or null when it is payable. */
export function validateCustomAmount(raw: string, max: number, currency: Currency): string | null {
  if (raw.trim() === "") return "Enter an amount";
  if (!/^\d+(\.\d{1,2})?$/.test(raw.trim())) return "Enter a valid amount";
  const n = Number(raw);
  if (n <= 0) return "Amount must be more than 0";
  if (n > max) return `Amount can't be more than ${formatMoney(max, currency)}`;
  return null;
}

export function isValidPhone(raw: string): boolean {
  return /^\+?\d{10,15}$/.test(raw.replace(/[\s-]/g, ""));
}

/** "8800474004" → "+91 88004 74004", the way the checkout shows it. */
export function formatPhoneForCheckout(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  const cc = digits.length > 10 ? digits.slice(0, -10) : "91";
  return local.length === 10 ? `+${cc} ${local.slice(0, 5)} ${local.slice(5)}` : `+${digits}`;
}

// India Post pincode zones: the first two digits pin down the state well enough
// for a receipt. Ranges shared by two states resolve to the larger one.
const PIN_PREFIX: [number, number, string][] = [
  [11, 11, "DELHI"],
  [12, 13, "HARYANA"],
  [14, 16, "PUNJAB"],
  [17, 17, "HIMACHAL PRADESH"],
  [18, 19, "JAMMU AND KASHMIR"],
  [20, 28, "UTTAR PRADESH"],
  [30, 34, "RAJASTHAN"],
  [36, 39, "GUJARAT"],
  [40, 44, "MAHARASHTRA"],
  [45, 48, "MADHYA PRADESH"],
  [49, 49, "CHHATTISGARH"],
  [50, 50, "TELANGANA"],
  [51, 53, "ANDHRA PRADESH"],
  [56, 59, "KARNATAKA"],
  [60, 64, "TAMIL NADU"],
  [67, 69, "KERALA"],
  [70, 74, "WEST BENGAL"],
  [75, 77, "ODISHA"],
  [78, 78, "ASSAM"],
  [80, 81, "BIHAR"],
  [82, 83, "JHARKHAND"],
  [84, 85, "BIHAR"],
];

export function isValidPincode(raw: string): boolean {
  return /^[1-9]\d{5}$/.test(raw);
}

export function stateForPincode(pincode: string): string | null {
  if (!isValidPincode(pincode)) return null;
  const prefix = Number(pincode.slice(0, 2));
  return PIN_PREFIX.find(([lo, hi]) => prefix >= lo && prefix <= hi)?.[2] ?? null;
}

export function isReceiptAvailable(t: Transaction): boolean {
  return t.paidAt.slice(0, 10) >= RECEIPTS_FROM;
}

export function randomHex(length: number): string {
  let out = "";
  while (out.length < length) out += Math.floor(Math.random() * 16).toString(16);
  return out;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
