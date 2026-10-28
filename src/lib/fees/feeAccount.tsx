import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  allocatePayment,
  nextDue,
  outstanding,
  randomHex,
  stateForPincode,
  taxLines,
  withTax,
  type Currency,
  type Installment,
  type PaymentMode,
  type TaxLine,
  type Transaction,
} from "./fees";
import { isFailureCode, type FailedAttempt, type FailureCode, type PaymentChannel } from "./failures";

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
  /** Used in the failure page's "Sorry Vaibhav, …". */
  firstName: string;
  /** Where receipts are emailed. */
  email: string;
  contact: { phones: string[]; email: string };
  /** Whether this program runs Refer & Earn; without it the thank-you page has no referral panel. */
  referralEnabled: boolean;
  /**
   * Prototype switch: when set, the next payment fails for this reason. It is
   * one-shot, so the payment after a failure (Retry) goes through.
   */
  nextFailure: FailureCode | null;
};

export type PaymentRequest = {
  subtotal: number;
  tax: TaxLine[];
  amount: number;
  mode: PaymentMode;
};

/** A payment request as it leaves the checkout, with what Retry needs to run it again. */
export type AttemptRequest = PaymentRequest & { channel: PaymentChannel; phone: string };

/**
 * Pincode the location card starts with, so learners can pay straight away and
 * only edit it if it's wrong. Looking up the real one would need the browser's
 * location permission plus a reverse-geocoding service, so we use a fixed one.
 */
export const DEFAULT_PINCODE = "560102";

const SCENARIOS: Record<FeeScenario, () => FeeAccount> = {
  due: () => ({
    scenario: "due",
    programName: "PGPDSBA Online September26",
    currency: "INR",
    gstRate: 0.18,
    installments: [{ id: "admission", label: "Admission Fee", amount: 100000, dueDate: "2026-10-31", paid: 0 }],
    transactions: [],
    discountNote: null,
    location: { pincode: DEFAULT_PINCODE, state: stateForPincode(DEFAULT_PINCODE) },
    phone: "8800474004",
    firstName: "Vaibhav",
    email: "vi@gl.in",
    contact: { phones: ["+917752919436"], email: "testkt@gl.io" },
    referralEnabled: true,
    nextFailure: null,
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
    firstName: "Vaibhav",
    email: "vi@gl.in",
    contact: { phones: ["+91 8448092407", "+91 8448092043", "+91 8448498157"], email: "arjun@greatlearning.in" },
    referralEnabled: true,
    nextFailure: null,
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
  /** Arm (or disarm, with null) a failure for the next payment. */
  setNextFailure: (code: FailureCode | null) => void;
  recordPayment: (req: PaymentRequest) => Transaction;
  /** Record a payment that failed with the armed reason, and disarm it. */
  recordFailure: (req: AttemptRequest) => FailedAttempt;
  /** A sample success or failure for the Dev Panel to jump to; the schedule is left alone. */
  previewPayment: () => Transaction;
  previewFailure: (code: FailureCode) => FailedAttempt;
  /** The most recent payment, kept for this tab so the thank-you page survives a refresh. */
  lastPayment: Transaction | null;
  /** The most recent failed attempt, kept for this tab the same way. */
  lastFailure: FailedAttempt | null;
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
const LAST_FAILURE_KEY = "fee-last-failure";

type Settings = { scenario: FeeScenario; referralEnabled: boolean; nextFailure: FailureCode | null };

function load(): FeeAccount {
  try {
    localStorage.removeItem(LEGACY_KEY);
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const { scenario, referralEnabled, nextFailure } = JSON.parse(raw) as Partial<Settings>;
      if (scenario && scenario in SCENARIOS) {
        return { ...SCENARIOS[scenario](), referralEnabled: referralEnabled ?? true, nextFailure: isFailureCode(nextFailure) ? nextFailure : null };
      }
    }
  } catch {
    // storage unavailable or malformed: fall through to the default scenario
  }
  return SCENARIOS.due();
}

function loadSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable: the result page just won't survive a refresh
  }
}

/** What the next payment would charge: the next due installment (or the first, if all paid), with GST. */
function sampleCharge(a: FeeAccount): PaymentRequest & { label: string } {
  const due = nextDue(a.installments) ?? a.installments[0];
  const subtotal = due ? outstanding(due) || due.amount : 0;
  const tax = taxLines(subtotal, a.gstRate, a.location?.state ?? null);
  return { label: due?.label ?? "Payment", subtotal, tax, amount: withTax(subtotal, tax), mode: "UPI" };
}

function localISO(d: Date): string {
  const off = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - off).toISOString().slice(0, 19);
}

export function FeeAccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<FeeAccount>(load);
  const [lastPayment, setLastPayment] = useState<Transaction | null>(() => loadSession<Transaction>(LAST_PAYMENT_KEY));
  const [lastFailure, setLastFailure] = useState<FailedAttempt | null>(() => loadSession<FailedAttempt>(LAST_FAILURE_KEY));
  const { scenario, referralEnabled, nextFailure } = account;

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ scenario, referralEnabled, nextFailure } satisfies Settings));
    } catch {
      // storage unavailable: settings just won't survive a refresh
    }
  }, [scenario, referralEnabled, nextFailure]);

  // A new scenario keeps the Dev Panel switches that aren't about the program itself.
  const setScenario = useCallback(
    (s: FeeScenario) => setAccount((a) => ({ ...SCENARIOS[s](), referralEnabled: a.referralEnabled, nextFailure: a.nextFailure })),
    [],
  );
  const setLocation = useCallback((location: Location | null) => setAccount((a) => ({ ...a, location })), []);
  const setPhone = useCallback((phone: string) => setAccount((a) => ({ ...a, phone })), []);
  const setReferralEnabled = useCallback((referralEnabled: boolean) => setAccount((a) => ({ ...a, referralEnabled })), []);
  const setNextFailure = useCallback((nextFailure: FailureCode | null) => setAccount((a) => ({ ...a, nextFailure })), []);

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
      saveSession(LAST_PAYMENT_KEY, txn);
      return txn;
    },
    [account.installments, account.currency],
  );

  const recordFailure = useCallback(
    (req: AttemptRequest): FailedAttempt => {
      const attempt: FailedAttempt = {
        txnId: randomHex(24),
        traceId: randomHex(32),
        code: account.nextFailure ?? "unknown",
        attemptedAt: localISO(new Date()),
        mode: req.mode,
        channel: req.channel,
        phone: req.phone,
        subtotal: req.subtotal,
        tax: req.tax,
        amount: req.amount,
        currency: account.currency,
      };
      // One-shot: the failure is used up, so Retry goes through.
      setAccount((a) => ({ ...a, nextFailure: null }));
      setLastFailure(attempt);
      saveSession(LAST_FAILURE_KEY, attempt);
      return attempt;
    },
    [account.nextFailure, account.currency],
  );

  const previewPayment = useCallback((): Transaction => {
    const charge = sampleCharge(account);
    const txn: Transaction = {
      txnId: randomHex(24),
      traceId: randomHex(32),
      label: charge.label,
      paidAt: localISO(new Date()),
      mode: charge.mode,
      subtotal: charge.subtotal,
      amount: charge.amount,
      currency: account.currency,
      tax: charge.tax,
    };
    setLastPayment(txn);
    saveSession(LAST_PAYMENT_KEY, txn);
    return txn;
  }, [account]);

  const previewFailure = useCallback(
    (code: FailureCode): FailedAttempt => {
      const charge = sampleCharge(account);
      const attempt: FailedAttempt = {
        txnId: randomHex(24),
        traceId: randomHex(32),
        code,
        attemptedAt: localISO(new Date()),
        mode: charge.mode,
        channel: "card-upi",
        phone: account.phone,
        subtotal: charge.subtotal,
        tax: charge.tax,
        amount: charge.amount,
        currency: account.currency,
      };
      setLastFailure(attempt);
      saveSession(LAST_FAILURE_KEY, attempt);
      return attempt;
    },
    [account],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      sessionStorage.removeItem(LAST_PAYMENT_KEY);
      sessionStorage.removeItem(LAST_FAILURE_KEY);
    } catch {
      // nothing to clear
    }
    setAccount(SCENARIOS.due());
    setLastPayment(null);
    setLastFailure(null);
  }, []);

  const value = useMemo(
    () => ({
      account,
      setScenario,
      setLocation,
      setPhone,
      setReferralEnabled,
      setNextFailure,
      recordPayment,
      recordFailure,
      previewPayment,
      previewFailure,
      lastPayment,
      lastFailure,
      reset,
    }),
    [account, setScenario, setLocation, setPhone, setReferralEnabled, setNextFailure, recordPayment, recordFailure, previewPayment, previewFailure, lastPayment, lastFailure, reset],
  );

  return <FeeAccountContext.Provider value={value}>{children}</FeeAccountContext.Provider>;
}

export function useFeeAccount(): Ctx {
  const ctx = useContext(FeeAccountContext);
  if (!ctx) throw new Error("useFeeAccount must be used within FeeAccountProvider");
  return ctx;
}
