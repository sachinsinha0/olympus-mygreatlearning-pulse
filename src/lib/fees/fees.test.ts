import { describe, expect, it } from "vitest";
import {
  allocatePayment,
  formatDueDate,
  formatMoney,
  formatPaidAt,
  formatPhoneForCheckout,
  formatReceiptDate,
  formatReceiptMoney,
  isReceiptAvailable,
  isValidPhone,
  nextDue,
  receiptLines,
  stateForPincode,
  taxLines,
  totalOutstanding,
  totalPaid,
  validateCustomAmount,
  withTax,
  type Installment,
  type Transaction,
} from "./fees";

const schedule = (): Installment[] => [
  { id: "a", label: "Admission Fee", amount: 1000, dueDate: "2026-10-31", paid: 0 },
  { id: "b", label: "1st Installment", amount: 2000, dueDate: "2026-11-30", paid: 0 },
];

describe("formatMoney", () => {
  it("groups INR in lakhs", () => {
    expect(formatMoney(100000, "INR", { space: true })).toBe("₹ 1,00,000");
  });
  it("prints the trailing .0 the schedule table uses", () => {
    expect(formatMoney(100000, "INR", { decimal: true })).toBe("₹1,00,000.0");
    expect(formatMoney(2000, "USD", { space: true, decimal: true })).toBe("$ 2,000.0");
  });
  it("uses thousands grouping for the checkout", () => {
    expect(formatMoney(118000, "INR", { western: true })).toBe("₹118,000");
  });
  it("prints the ungrouped success-page amount", () => {
    expect(formatMoney(118000, "INR", { space: true, plain: true, decimal: true })).toBe("₹ 118000.0");
  });
});

describe("formatDueDate", () => {
  const now = new Date(2026, 9, 8);
  it("drops the year for this year", () => {
    expect(formatDueDate("2026-10-31", now)).toBe("Sat, Oct 31");
  });
  it("keeps the year and a padded day otherwise", () => {
    expect(formatDueDate("2024-08-01", now)).toBe("Thu, Aug 01, 2024");
  });
});

describe("formatPaidAt", () => {
  it("matches the history row format", () => {
    expect(formatPaidAt("2019-01-12T16:54:00")).toBe("Jan 12, 2019, 4:54 PM");
  });
});

describe("allocatePayment", () => {
  it("fills installments in schedule order", () => {
    const { installments, touched } = allocatePayment(schedule(), 1500);
    expect(installments.map((i) => i.paid)).toEqual([1000, 500]);
    expect(touched).toEqual(["Admission Fee", "1st Installment"]);
    expect(nextDue(installments)?.id).toBe("b");
    expect(totalPaid(installments)).toBe(1500);
    expect(totalOutstanding(installments)).toBe(1500);
  });
  it("skips installments that are already paid", () => {
    const paidFirst = schedule().map((i) => (i.id === "a" ? { ...i, paid: 1000 } : i));
    const { touched } = allocatePayment(paidFirst, 200);
    expect(touched).toEqual(["1st Installment"]);
  });
  it("leaves no next due once everything is paid", () => {
    const { installments } = allocatePayment(schedule(), 3000);
    expect(nextDue(installments)).toBeNull();
  });
});

describe("taxLines", () => {
  it("charges IGST to an out-of-state buyer", () => {
    const lines = taxLines(100000, 0.18, "KARNATAKA");
    expect(lines).toEqual([{ label: "IGST", amount: 18000 }]);
    expect(withTax(100000, lines)).toBe(118000);
  });
  it("splits CGST and SGST for a same-state buyer", () => {
    expect(taxLines(100000, 0.18, "Haryana")).toEqual([
      { label: "CGST", amount: 9000 },
      { label: "SGST", amount: 9000 },
    ]);
  });
  it("adds nothing when there is no GST", () => {
    expect(taxLines(2000, 0, null)).toEqual([]);
  });
});

describe("validateCustomAmount", () => {
  it("accepts an amount within the outstanding balance", () => {
    expect(validateCustomAmount("2500.50", 3000, "INR")).toBeNull();
  });
  it("rejects empty, malformed, zero and too-large amounts", () => {
    expect(validateCustomAmount("", 3000, "INR")).toBe("Enter an amount");
    expect(validateCustomAmount("12.345", 3000, "INR")).toBe("Enter a valid amount");
    expect(validateCustomAmount("0", 3000, "INR")).toBe("Amount must be more than 0");
    expect(validateCustomAmount("5000", 3000, "INR")).toBe("Amount can't be more than ₹3,000");
  });
});

describe("phone helpers", () => {
  it("validates 10–15 digit numbers", () => {
    expect(isValidPhone("8800474004")).toBe(true);
    expect(isValidPhone("+91 88004 74004")).toBe(true);
    expect(isValidPhone("12345")).toBe(false);
  });
  it("formats for the checkout header", () => {
    expect(formatPhoneForCheckout("8800474004")).toBe("+91 88004 74004");
  });
});

describe("stateForPincode", () => {
  it("resolves Bengaluru to Karnataka", () => {
    expect(stateForPincode("560102")).toBe("KARNATAKA");
  });
  it("resolves Gurugram to Haryana", () => {
    expect(stateForPincode("122002")).toBe("HARYANA");
  });
  it("rejects malformed pincodes", () => {
    expect(stateForPincode("056010")).toBeNull();
    expect(stateForPincode("56010")).toBeNull();
  });
});

describe("isReceiptAvailable", () => {
  const txn = (paidAt: string): Transaction => ({
    txnId: "x",
    traceId: "y",
    label: "Admission Fee",
    paidAt,
    mode: "UPI",
    subtotal: 1,
    amount: 1,
    currency: "INR",
  });
  it("is available from 1st April 2023", () => {
    expect(isReceiptAvailable(txn("2023-04-01T09:00:00"))).toBe(true);
    expect(isReceiptAvailable(txn("2023-03-31T23:59:00"))).toBe(false);
  });
});

describe("receipt formatting", () => {
  it("prints receipt amounts with two decimals and locale grouping", () => {
    expect(formatReceiptMoney(118000, "INR")).toBe("₹1,18,000.00");
    expect(formatReceiptMoney(2000, "USD")).toBe("$2,000.00");
  });
  it("prints the paid-on date day first", () => {
    expect(formatReceiptDate("2026-10-08T10:10:00")).toBe("8 Oct 2026, 10:10 am");
  });
  it("lists the fee, then each tax line", () => {
    const t: Transaction = {
      txnId: "x",
      traceId: "y",
      label: "Admission Fee",
      paidAt: "2026-10-08T10:10:00",
      mode: "UPI",
      subtotal: 100000,
      amount: 118000,
      currency: "INR",
      tax: [{ label: "IGST", amount: 18000 }],
    };
    expect(receiptLines(t)).toEqual([
      { label: "Admission Fee", amount: 100000 },
      { label: "IGST", amount: 18000 },
    ]);
    expect(receiptLines({ ...t, tax: undefined })).toEqual([
      { label: "Admission Fee", amount: 100000 },
      { label: "GST", amount: 18000 },
    ]);
    expect(receiptLines({ ...t, tax: undefined, amount: 100000 })).toHaveLength(1);
  });
});
