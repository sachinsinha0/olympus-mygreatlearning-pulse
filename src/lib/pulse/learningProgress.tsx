import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STARTED_KEY = "pulse-started-modules";
const COMPLETED_KEY = "pulse-completed-modules";
const COMPLETED_ITEMS_KEY = "pulse-completed-items";

type LearningProgressCtx = {
  hasStarted: (id: string) => boolean;
  markStarted: (id: string) => void;
  hasCompleted: (id: string) => boolean;
  markCompleted: (id: string) => void;
  unmarkCompleted: (id: string) => void;
  hasItemCompleted: (itemId: string) => boolean;
  markItemCompleted: (itemId: string) => void;
  unmarkItemCompleted: (itemId: string) => void;
  startedIds: string[];
  completedIds: string[];
  completedItemIds: string[];
  reset: () => void;
};

const Ctx = createContext<LearningProgressCtx | null>(null);

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

export function LearningProgressProvider({ children }: { children: ReactNode }) {
  const [startedIds, setStartedIds] = useState<string[]>(() => readIds(STARTED_KEY));
  const [completedIds, setCompletedIds] = useState<string[]>(() => readIds(COMPLETED_KEY));
  const [completedItemIds, setCompletedItemIds] = useState<string[]>(() => readIds(COMPLETED_ITEMS_KEY));

  useEffect(() => {
    localStorage.setItem(STARTED_KEY, JSON.stringify(startedIds));
  }, [startedIds]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedIds));
  }, [completedIds]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_ITEMS_KEY, JSON.stringify(completedItemIds));
  }, [completedItemIds]);

  const hasStarted = useCallback((id: string) => startedIds.includes(id), [startedIds]);
  const hasCompleted = useCallback((id: string) => completedIds.includes(id), [completedIds]);
  const hasItemCompleted = useCallback((id: string) => completedItemIds.includes(id), [completedItemIds]);

  const markStarted = useCallback((id: string) => {
    setStartedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    // Completing implies started.
    setStartedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unmarkCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const markItemCompleted = useCallback((id: string) => {
    setCompletedItemIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unmarkItemCompleted = useCallback((id: string) => {
    setCompletedItemIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const reset = useCallback(() => {
    setStartedIds([]);
    setCompletedIds([]);
    setCompletedItemIds([]);
  }, []);

  const value = useMemo(
    () => ({
      hasStarted,
      markStarted,
      hasCompleted,
      markCompleted,
      unmarkCompleted,
      hasItemCompleted,
      markItemCompleted,
      unmarkItemCompleted,
      startedIds,
      completedIds,
      completedItemIds,
      reset,
    }),
    [
      hasStarted,
      markStarted,
      hasCompleted,
      markCompleted,
      unmarkCompleted,
      hasItemCompleted,
      markItemCompleted,
      unmarkItemCompleted,
      startedIds,
      completedIds,
      completedItemIds,
      reset,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLearningProgress(): LearningProgressCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLearningProgress must be used within LearningProgressProvider");
  return ctx;
}
