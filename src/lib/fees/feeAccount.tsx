import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  allocatePayment,
  randomHex,
  type Currency,
  type Installment,
  type PaymentMode,
  type TaxLine,
  type Transaction,
} from "./fees";

/**
 * The learner's fee account for the current program. Two seeded scenarios,
 * switchable from the Dev Panel, cover the states in the production page:
 * a fresh INR enrolment with the admission fee due, and a USD program that
 * has been paid off in full.
 */
export type FeeScenario = "due" | "paid";

export type Location = { pincode: string; state: string | null };

export type FeeAccount = {
  scenario: FeeScenario;
  programName: string;
  currency: Currency;
  /** GST rate, 0 when the program isn't billed in India. */
  gstRate: number;
  installments: Installment[];
  transactions: Transaction[];
  discountNote: string | null;
  location: Location | null;
  phone: string;
  /** Where receipts are emailed. */
  email: string;
  contact: { phones: string[]; email: string };
  /** Whether this program runs Refer & Earn; without it the thank-you page has no referral panel. */
  referralEnabled: boolean;
};

export type PaymentRequest = {
  subtotal: number;
  tax: TaxLine[];
  amount: number;
  mode: PaymentMode;
};

const SCENARIOS: Record<FeeScenario, () => FeeAccount> = {
  due: () => ({
    scenario: "due",
    programName: "PGPDSBA Online September26",
    currency: "INR",
    gstRate: 0.18,
    installments: [{ id: "admission", label: "Admission Fee", amount: 100000, dueDate: "2026-10-31", paid: 0 }],
    transactions: [],
    discountNote: null,
    location: null,
    phone: "8800474004",
    email: "vi@gl.in",
    contact: { phones: ["+917752919436"], email: "testkt@gl.io" },
    referralEnabled: true,
  }),
  paid: () => ({
    scenario: "paid",
    programName: "PGP-DSBA UT Austin JAN19",
    currency: "USD",
    gstRate: 0,
    installments: [
      { id: "i1", label: "1st Installment", amount: 2000, dueDate: "2024-08-01", paid: 2000 },
      { id: "i2", label: "2nd Installment", amount: 2000, dueDate: "2024-08-01", paid: 2000 },
      { id: "admission", label: "Admission Fee", amount: 1000, dueDate: "2024-08-01", paid: 1000 },
    ],
    transactions: [
      usd("3b5c67785b4f000bf7c2fa22", "Admission Fee", "2019-01-12T16:54:00", 1000),
      usd("1d672a842dbba277a9b9fed8", "1st Installment", "2019-02-21T18:37:00", 2000),
      usd("51a25d54e2229ba1f9fb303d", "2nd Installment", "2019-03-23T16:23:00", 2000),
    ],
    discountNote: "Referral Discount of $ 200.0 will be applied in the next installment.",
    location: null,
    phone: "8800474004",
    email: "vi@gl.in",
    contact: { phones: ["+91 8448092407", "+91 8448092043", "+91 8448498157"], email: "arjun@greatlearning.in" },
    referralEnabled: true,
  }),
};

function usd(txnId: string, label: string, paidAt: string, amount: number): Transaction {
  return { txnId, traceId: randomHex(32), label, paidAt, mode: "Credit Card", subtotal: amount, amount, currency: "USD" };
}

type Ctx = {
  account: FeeAccount;
  setScenario: (s: FeeScenario) => void;
  setLocation: (l: Location | null) => void;
  setPhone: (p: string) => void;
  setReferralEnabled: (on: boolean) => void;
  recordPayment: (req: PaymentRequest) => Transaction;
  /** The most recent payment, kept for this tab so the thank-you page survives a refresh. */
  lastPayment: Transaction | null;
  reset: () => void;
};

const FeeAccountContext = createContext<Ctx | null>(null);

/**
 * Only the Dev Panel settings persist. Payment progress (location, payments,
 * PAID rows) lives in memory, so a refresh restarts the chosen scenario and
 * the payment flow can be run again.
 */
const SETTINGS_KEY = "fee-account-settings";
/** Earlier builds saved the whole account here, payments included. */
const LEGACY_KEY = "fee-account";
const LAST_PAYMENT_KEY = "fee-last-payment";

type Settings = { scenario: FeeScenario; referralEnabled: boolean };

function load(): FeeAccount {
  try {
    localStorage.removeItem(LEGACY_KEY);
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const { scenario, referralEnabled } = JSON.parse(raw) as Partial<Settings>;
      if (scenario && scenario in SCENARIOS) return { ...SCENARIOS[scenario](), referralEnabled: referralEnabled ?? true };
    }
  } catch {
    // storage unavailable or malformed: fall through to the default scenario
  }
  return SCENARIOS.due();
}

function loadLastPayment(): Transaction | null {
  try {
    const raw = sessionStorage.getItem(LAST_PAYMENT_KEY);
    return raw ? (JSON.parse(raw) as Transaction) : null;
  } catch {
    return null;
  }
}

function localISO(d: Date): string {
  const off = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - off).toISOString().slice(0, 19);
}

export function FeeAccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<FeeAccount>(load);
  const [lastPayment, setLastPayment] = useState<Transaction | null>(loadLastPayment);
  const { scenario, referralEnabled } = account;

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ scenario, referralEnabled } satisfies Settings));
    } catch {
      // storage unavailable: settings just won't survive a refresh
    }
  }, [scenario, referralEnabled]);

  const setScenario = useCallback((s: FeeScenario) => setAccount(SCENARIOS[s]()), []);
  const setLocation = useCallback((location: Location | null) => setAccount((a) => ({ ...a, location })), []);
  const setPhone = useCallback((phone: string) => setAccount((a) => ({ ...a, phone })), []);
  const setReferralEnabled = useCallback((referralEnabled: boolean) => setAccount((a) => ({ ...a, referralEnabled })), []);

  const recordPayment = useCallback(
    (req: PaymentRequest): Transaction => {
      const { installments, touched } = allocatePayment(account.installments, req.subtotal);
      const txn: Transaction = {
        txnId: randomHex(24),
        traceId: randomHex(32),
        label: touched.join(", ") || "Payment",
        paidAt: localISO(new Date()),
        mode: req.mode,
        subtotal: req.subtotal,
        amount: req.amount,
        currency: account.currency,
        tax: req.tax,
      };
      setAccount((a) => ({ ...a, installments, transactions: [...a.transactions, txn] }));
      setLastPayment(txn);
      try {
        sessionStorage.setItem(LAST_PAYMENT_KEY, JSON.stringify(txn));
      } catch {
        // storage unavailable: the thank-you page just won't survive a refresh
      }
      return txn;
    },
    [account.installments, account.currency],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      sessionStorage.removeItem(LAST_PAYMENT_KEY);
    } catch {
      // nothing to clear
    }
    setAccount(SCENARIOS.due());
    setLastPayment(null);
  }, []);

  const value = useMemo(
    () => ({ account, setScenario, setLocation, setPhone, setReferralEnabled, recordPayment, lastPayment, reset }),
    [account, setScenario, setLocation, setPhone, setReferralEnabled, recordPayment, lastPayment, reset],
  );

  return <FeeAccountContext.Provider value={value}>{children}</FeeAccountContext.Provider>;
}

export function useFeeAccount(): Ctx {
  const ctx = useContext(FeeAccountContext);
  if (!ctx) throw new Error("useFeeAccount must be used within FeeAccountProvider");
  return ctx;
}
