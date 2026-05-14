import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type PricingState = "trial" | "paid" | "expired";
export type Plan = "monthly" | "annual";

export const PLAN_PRICE: Record<Plan, { display: string; perMo: string }> = {
  monthly: { display: "$100/mo", perMo: "$100/mo" },
  annual: { display: "$999/yr", perMo: "$83.25/mo" },
};

type PricingCtx = {
  state: PricingState;
  plan: Plan | null;
  activeUntil: string | null;
  trialStartedAt: string | null;
  pricingModalOpen: boolean;
  setState: (s: PricingState) => void;
  setPlan: (p: Plan | null) => void;
  setActiveUntil: (d: string | null) => void;
  openPricingModal: () => void;
  closePricingModal: () => void;
  startTrial: () => void;
  subscribe: (plan: Plan) => void;
  reset: () => void;
};

const Ctx = createContext<PricingCtx | null>(null);

const STORAGE_KEY = "pulse-pricing";

type Stored = {
  state: PricingState;
  plan: Plan | null;
  activeUntil: string | null;
  trialStartedAt: string | null;
};

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function getInitial(): Stored {
  if (typeof window === "undefined") {
    return { state: "trial", plan: null, activeUntil: null, trialStartedAt: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored> & { state?: string };
      const validStates = ["trial", "paid", "expired"];
      const s = parsed.state && validStates.includes(parsed.state) ? (parsed.state as PricingState) : "trial";
      const p = parsed.plan === "monthly" || parsed.plan === "annual" ? parsed.plan : null;
      const a = parsed.activeUntil ?? null;
      const t = parsed.trialStartedAt ?? null;
      return { state: s, plan: p, activeUntil: a, trialStartedAt: t };
    }
  } catch {
    // fall through to default
  }
  return { state: "trial", plan: null, activeUntil: null, trialStartedAt: null };
}

export function PricingProvider({ children }: { children: ReactNode }) {
  const [{ state, plan, activeUntil, trialStartedAt }, setStored] = useState<Stored>(getInitial);
  const [pricingModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, plan, activeUntil, trialStartedAt }));
  }, [state, plan, activeUntil, trialStartedAt]);

  const setState = useCallback((s: PricingState) => {
    setStored((prev) => {
      if (s === "trial") {
        return { state: "trial", plan: null, activeUntil: null, trialStartedAt: null };
      }
      if (s === "paid") {
        return {
          state: "paid",
          plan: prev.plan ?? "monthly",
          activeUntil: prev.activeUntil ?? daysFromNow(30),
          trialStartedAt: null,
        };
      }
      return {
        state: "expired",
        plan: null,
        activeUntil: prev.activeUntil ?? daysFromNow(0),
        trialStartedAt: null,
      };
    });
  }, []);

  const setPlan = useCallback((p: Plan | null) => {
    setStored((prev) => ({ ...prev, plan: p }));
  }, []);

  const setActiveUntil = useCallback((d: string | null) => {
    setStored((prev) => ({ ...prev, activeUntil: d }));
  }, []);

  const openPricingModal = useCallback(() => setModalOpen(true), []);
  const closePricingModal = useCallback(() => setModalOpen(false), []);

  const startTrial = useCallback(() => {
    setStored({ state: "trial", plan: null, activeUntil: daysFromNow(30), trialStartedAt: todayISO() });
  }, []);

  const subscribe = useCallback((p: Plan) => {
    const renewalDays = p === "annual" ? 365 : 30;
    setStored({ state: "paid", plan: p, activeUntil: daysFromNow(renewalDays), trialStartedAt: null });
    setModalOpen(false);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStored({ state: "trial", plan: null, activeUntil: null, trialStartedAt: null });
    setModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      state,
      plan,
      activeUntil,
      trialStartedAt,
      pricingModalOpen,
      setState,
      setPlan,
      setActiveUntil,
      openPricingModal,
      closePricingModal,
      startTrial,
      subscribe,
      reset,
    }),
    [
      state,
      plan,
      activeUntil,
      trialStartedAt,
      pricingModalOpen,
      setState,
      setPlan,
      setActiveUntil,
      openPricingModal,
      closePricingModal,
      startTrial,
      subscribe,
      reset,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePricing(): PricingCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePricing must be used within PricingProvider");
  return ctx;
}

export function daysUntil(date: string | null): number {
  if (!date) return 0;
  const target = new Date(date).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}
