import { REFERRAL_CATEGORIES, type ReferralCategory, type ReferralStatus } from "./content";

/** Where Refer & Earn lives in this prototype (prod: /refer_and_earn?pb_id=…). */
export const REFER_AND_EARN_PATH = "/refer_and_earn";

/** Origin of the share links prod hands out (/rl/<token>). */
const REFERRAL_LINK_ORIGIN = "https://mgolympus1.iac-mygreatlearning.net";

/** Base64url without padding, safe for any string. */
function base64url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * A share link shaped like prod's: /rl/ followed by an opaque token that
 * carries the program the friend is referred to and who referred them.
 * Mock only: the real token is minted and signed by the referral service.
 */
export function buildReferralLink(category: ReferralCategory, userId: number, issuedAt: number): string {
  const programId = REFERRAL_CATEGORIES.indexOf(category);
  const payload = base64url(JSON.stringify({ program_id: programId, lms_user_id: userId, iat: Math.floor(issuedAt / 1000) }));
  return `${REFERRAL_LINK_ORIGIN}/rl/${base64url(`${base64url('{"alg":"HS256","typ":"JWT"}')}.${payload}`)}`;
}

export const STATUS_LABEL: Record<ReferralStatus, string> = {
  invite_sent: "Invite Sent",
  accepted: "Invite Accepted",
  enrolled: "Enrolled",
  rewarded: "Reward Credited",
};

/** "19 Dec 2022" */
export function formatReferredOn(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** "$150", or "No Reward" for programs where the friend gets nothing. */
export function formatReward(amount: number | null): string {
  return amount === null ? "No Reward" : `$${amount}`;
}

/** Split a sentence around email addresses so they can be rendered as links. */
export function splitEmails(text: string): { text: string; email?: boolean }[] {
  return text
    .split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/)
    .filter(Boolean)
    .map((part) => (/^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/.test(part) ? { text: part, email: true } : { text: part }));
}
