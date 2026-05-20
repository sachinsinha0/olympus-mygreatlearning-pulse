import { useEffect, useState } from "react";

const STORAGE_KEY = "pulse-intro-seen";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: "1" }));
  } catch {
    // ignore
  }
}

export function clearIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: null }));
  } catch {
    // ignore
  }
}

export function useHasSeenIntro(): boolean {
  const [seen, setSeen] = useState<boolean>(() => hasSeenIntro());
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        setSeen(hasSeenIntro());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return seen;
}
