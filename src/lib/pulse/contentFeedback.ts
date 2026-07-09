// Content feedback collected below the AI Pulse player. The star rating is the
// required signal; the aspect + comment are optional detail (unlike the exit-intent
// dialog, where a reason is required). Stored per content item in localStorage.

export type ContentFeedback = {
  rating: number; // 1..5
  aspectIds?: string[];
  note?: string; // free text tied to the "Other" option
};

export type FeedbackAspect = { id: string; label: string };

// Multi-select follow-up ("select all that apply"). 3-and-below asks what didn't
// work; 4-and-above asks what worked. Ids are prefixed per set so selections can't
// carry across the boundary. The "-other" option reveals an optional text field.
export const FEEDBACK_IMPROVE: FeedbackAspect[] = [
  { id: "improve-too-basic", label: "Too basic for me" },
  { id: "improve-too-advanced", label: "Too advanced for me" },
  { id: "improve-not-usable", label: "Nothing I could actually use or apply" },
  { id: "improve-not-relevant", label: "Not relevant to my role or industry" },
  { id: "improve-free-elsewhere", label: "I can get this content free elsewhere" },
  { id: "improve-hard-to-follow", label: "Hard to follow or too long" },
  { id: "improve-other", label: "Other" },
];

export const FEEDBACK_LIKED: FeedbackAspect[] = [
  { id: "liked-actionable", label: "Learned something I can use right away" },
  { id: "liked-skill-level", label: "Matched my skill level" },
  { id: "liked-saved-time", label: "Saved me time keeping up with AI" },
  { id: "liked-relevant", label: "Relevant to my work" },
  { id: "liked-other", label: "Other" },
];

/** 4+ asks what worked well; 3 and below asks what didn't work. */
export function feedbackAspects(rating: number): FeedbackAspect[] {
  return rating >= 4 ? FEEDBACK_LIKED : FEEDBACK_IMPROVE;
}

export function feedbackAspectQuestion(rating: number): string {
  return rating >= 4 ? "What worked well?" : "What didn't work for you?";
}

export function isOtherAspect(id: string): boolean {
  return id.endsWith("-other");
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
