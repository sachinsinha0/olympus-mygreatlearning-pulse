// Content feedback collected below the AI Pulse player. The star rating is the
// required signal; the aspect + comment are optional detail (unlike the exit-intent
// dialog, where a reason is required). Stored per content item in localStorage.

export type ContentFeedback = {
  rating: number; // 1..5
  aspectId?: string;
  note?: string;
};

export type FeedbackAspect = { id: string; label: string };

export const PULSE_FEEDBACK_ASPECTS: FeedbackAspect[] = [
  { id: "depth", label: "Content depth and difficulty" },
  { id: "relevance", label: "Relevance to my work" },
  { id: "pacing", label: "Pacing and length" },
  { id: "clarity", label: "Clarity of explanation" },
  { id: "quality", label: "Video or audio quality" },
  { id: "other", label: "Other" },
];

/** Dialog supporting copy, tuned to how the user rated the content. */
export function feedbackPrompt(rating: number): string {
  if (rating <= 2) return "Sorry this missed the mark. What could be better?";
  if (rating === 3) return "Thanks for rating. What would make this better?";
  return "Glad this was useful! Tell us what stood out.";
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
