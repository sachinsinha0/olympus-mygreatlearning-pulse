import type { Currency, PaymentMode, TaxLine } from "./fees";

/**
 * Why a payment failed, in the six categories most gateways return. Copy is
 * from the approved payment result pages (gl-payment-page
 * src/data/paymentFailures.ts); map the real gateway's error codes onto these.
 */
export type FailureCode = "cancelled" | "declined" | "insufficient_funds" | "authentication_failed" | "bank_timeout" | "unknown";

export type FailureReason = {
  /** Card heading. */
  title: string;
  /** What happened, in plain language. */
  reason: string;
  /** What the learner can do about it. */
  advice: string;
  /** Short name for the Dev Panel. */
  label: string;
};

export const FAILURE_REASONS: Record<FailureCode, FailureReason> = {
  cancelled: {
    label: "Cancelled",
    title: "Payment cancelled",
    reason: "The payment was cancelled before it was completed.",
    advice: "You can try again whenever you are ready.",
  },
  declined: {
    label: "Declined",
    title: "Payment declined",
    reason: "Your bank declined this payment.",
    advice: "Try another card or payment method, or ask your bank to approve the payment.",
  },
  insufficient_funds: {
    label: "Insufficient funds",
    title: "Payment failed",
    reason: "There were not enough funds in your account to complete this payment.",
    advice: "Add funds to your account or use another payment method.",
  },
  authentication_failed: {
    label: "OTP / PIN failed",
    title: "Payment failed",
    reason: "The OTP or PIN for this payment could not be verified.",
    advice: "Try again and enter the OTP sent by your bank, or use another payment method.",
  },
  bank_timeout: {
    label: "Bank timeout",
    title: "Payment timed out",
    reason: "Your bank did not respond in time.",
    advice: "This is usually temporary. Wait a few minutes and try again.",
  },
  unknown: {
    label: "Unknown error",
    title: "Payment failed",
    reason: "Something went wrong while processing this payment.",
    advice: "Please try again, or use another payment method.",
  },
};

export const FAILURE_CODES = Object.keys(FAILURE_REASONS) as FailureCode[];

export function isFailureCode(value: string | null | undefined): value is FailureCode {
  return !!value && value in FAILURE_REASONS;
}

/** How the learner chose to pay in the Payments dialog. */
export type PaymentChannel = "card-upi" | "netbanking";

/**
 * A payment that didn't go through. Keeps everything needed to run the same
 * payment again from Retry.
 */
export type FailedAttempt = {
  txnId: string;
  traceId: string;
  code: FailureCode;
  /** Local ISO date-time, no zone. */
  attemptedAt: string;
  mode: PaymentMode;
  channel: PaymentChannel;
  phone: string;
  subtotal: number;
  tax: TaxLine[];
  /** What the learner tried to pay, tax included. */
  amount: number;
  currency: Currency;
};
