// Content feedback collected below the AI Pulse player. The star rating is the
// required signal; the aspect + comment are optional detail (unlike the exit-intent
// dialog, where a reason is required). Stored per content item in localStorage.

export type ContentFeedback = {
  rating: number; // 1..5
  aspectId?: string;
  note?: string;
};

export type FeedbackAspect = { id: string; label: string };

// The follow-up question adapts to the rating: 3-and-below asks what to improve,
// 4-and-above asks what worked. Each set is 4 specific options + "Other". The ids
// are prefixed so a selection made under one question doesn't carry over to the
// other when the rating crosses the boundary.
export const FEEDBACK_IMPROVE: FeedbackAspect[] = [
  { id: "improve-depth", label: "Too basic or too advanced" },
  { id: "improve-relevance", label: "Not relevant to my work" },
  { id: "improve-pacing", label: "Pacing or length" },
  { id: "improve-clarity", label: "Hard to follow" },
  { id: "improve-other", label: "Other" },
];

export const FEEDBACK_LIKED: FeedbackAspect[] = [
  { id: "liked-clarity", label: "Clear and easy to follow" },
  { id: "liked-relevance", label: "Relevant to my work" },
  { id: "liked-depth", label: "Right depth and detail" },
  { id: "liked-pacing", label: "Well paced" },
  { id: "liked-other", label: "Other" },
];

/** 4+ asks what the user liked; 3 and below asks what to improve. */
export function feedbackAspects(rating: number): FeedbackAspect[] {
  return rating >= 4 ? FEEDBACK_LIKED : FEEDBACK_IMPROVE;
}

export function feedbackAspectQuestion(rating: number): string {
  return rating >= 4 ? "What did you like?" : "What could be better?";
}

export type FeedbackMap = Record<string, ContentFeedback>;

/** Pure upsert — returns a new map with the item's feedback set. */
export function upsertFeedback(map: FeedbackMap, itemId: string, fb: ContentFeedback): FeedbackMap {
  return { ...map, [itemId]: fb };
}

const STORAGE_KEY = "pulse-content-feedback";

function readMap(): FeedbackMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as FeedbackMap;
      }
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

export function getFeedback(itemId: string): ContentFeedback | null {
  return readMap()[itemId] ?? null;
}

export function saveFeedback(itemId: string, fb: ContentFeedback): void {
  if (typeof window === "undefined") return;
  const next = upsertFeedback(readMap(), itemId, fb);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore write errors (e.g. storage full / disabled)
  }
}
