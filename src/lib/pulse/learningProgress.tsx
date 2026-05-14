import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STARTED_KEY = "pulse-started-modules";
const COMPLETED_KEY = "pulse-completed-modules";

type LearningProgressCtx = {
  hasStarted: (id: string) => boolean;
  markStarted: (id: string) => void;
  hasCompleted: (id: string) => boolean;
  markCompleted: (id: string) => void;
  unmarkCompleted: (id: string) => void;
  startedIds: string[];
  completedIds: string[];
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

  useEffect(() => {
    localStorage.setItem(STARTED_KEY, JSON.stringify(startedIds));
  }, [startedIds]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedIds));
  }, [completedIds]);

  const hasStarted = useCallback((id: string) => startedIds.includes(id), [startedIds]);
  const hasCompleted = useCallback((id: string) => completedIds.includes(id), [completedIds]);

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

  const reset = useCallback(() => {
    setStartedIds([]);
    setCompletedIds([]);
  }, []);

  const value = useMemo(
    () => ({
      hasStarted,
      markStarted,
      hasCompleted,
      markCompleted,
      unmarkCompleted,
      startedIds,
      completedIds,
      reset,
    }),
    [hasStarted, markStarted, hasCompleted, markCompleted, unmarkCompleted, startedIds, completedIds, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLearningProgress(): LearningProgressCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLearningProgress must be used within LearningProgressProvider");
  return ctx;
}
