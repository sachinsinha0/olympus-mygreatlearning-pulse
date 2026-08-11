// "I'm Interested" signal on upcoming module cards. Replaces the old dead
// "Coming soon" button: an upcoming card now collects real demand data, so we can
// see which unreleased modules people actually want before producing them.
//
// Stored per module id in localStorage and mirrored to analytics on every change.

import { useCallback, useState } from "react";
import { track } from "../analytics";

const STORAGE_KEY = "pulse-module-interest";

/**
 * Pure add — returns a new id list containing the module. Idempotent: marking
 * interest is one-way, so there is no remove counterpart. Once a user has said
 * they want a module, that demand signal stands.
 */
export function addInterestId(ids: string[], moduleId: string): string[] {
  return ids.includes(moduleId) ? ids : [...ids, moduleId];
}

export function readInterestedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function writeInterestedIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore write errors (e.g. storage full / disabled)
  }
}

export function isInterested(moduleId: string): boolean {
  return readInterestedIds().includes(moduleId);
}

/**
 * Per-card interest state. Each upcoming card owns one module id, so local state
 * is enough — there is no second surface rendering the same module's button.
 *
 * `markInterested` is one-way and fires its analytics event only on the
 * transition, so repeat calls (double-tap, re-render) cannot inflate the count.
 */
export function useModuleInterest(moduleId: string, moduleTitle?: string) {
  const [interested, setInterested] = useState<boolean>(() => isInterested(moduleId));

  const markInterested = useCallback(() => {
    const current = readInterestedIds();
    if (current.includes(moduleId)) {
      setInterested(true);
      return;
    }
    writeInterestedIds(addInterestId(current, moduleId));
    setInterested(true);
    track("GL:PulseUpcomingModuleInterest_Marked", { moduleId, moduleTitle });
  }, [moduleId, moduleTitle]);

  return { interested, markInterested };
}
