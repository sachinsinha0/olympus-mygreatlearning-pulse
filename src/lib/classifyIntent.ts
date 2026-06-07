import data from "../mocks/programSupport.json";

export type IntentShape = "mentor" | "action" | "lookup" | "route";

export type ProjectIntent = {
  id: string;
  keywords: string[];
  shape: IntentShape;
  response: string;
  actionLabel?: string;
  ticketTag?: string;
  actionStyle?: "primary" | "outline" | "ghost";
};

const intents = data.projectIntents as ProjectIntent[];

// Keyword substring match in order; the empty-keyword bucket is the fallback.
export function classifyIntent(text: string): ProjectIntent {
  const t = text.toLowerCase();
  const fallback =
    intents.find((i) => i.keywords.length === 0) ?? intents[intents.length - 1];
  for (const intent of intents) {
    if (intent.keywords.length === 0) continue;
    if (intent.keywords.some((k) => t.includes(k.toLowerCase()))) return intent;
  }
  return fallback;
}
