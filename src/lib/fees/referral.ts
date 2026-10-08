/**
 * Refer & Earn offer promoted on the fee payment thank-you page. `maxReward`
 * matches the "Refer & Earn Up to $150" headline on the dashboard card.
 */
export type ReferralOffer = {
  maxReward: number;
  currency: "USD" | "INR";
  /**
   * Where "Refer a Friend" goes. null renders a link that goes nowhere.
   * TODO: point at the Olympus Refer & Earn page (/refer_and_earn?p=<program>&pb_id=<batch>)
   * once this prototype has one.
   */
  url: string | null;
};

export const referralOffer: ReferralOffer = {
  maxReward: 150,
  currency: "USD",
  url: null,
};

/** "$150" — whole units, no decimals. */
export function formatReward(offer: ReferralOffer): string {
  return new Intl.NumberFormat(offer.currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.maxReward);
}
