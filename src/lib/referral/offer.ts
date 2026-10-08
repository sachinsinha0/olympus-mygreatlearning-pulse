import { REFER_AND_EARN_PATH } from "./referral";

/**
 * The Refer & Earn headline offer, shown on the Refer & Earn page and promoted
 * on the fee payment thank-you page. `maxReward` matches the "Refer & Earn Up
 * to $150" headline on the dashboard card.
 */
export type ReferralOffer = {
  maxReward: number;
  currency: "USD" | "INR";
  /** Where "Refer a Friend" goes: the Refer & Earn page. */
  url: string;
};

export const referralOffer: ReferralOffer = {
  maxReward: 150,
  currency: "USD",
  url: REFER_AND_EARN_PATH,
};

/** "$150" — whole units, no decimals. */
export function formatReward(offer: ReferralOffer): string {
  return new Intl.NumberFormat(offer.currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.maxReward);
}
