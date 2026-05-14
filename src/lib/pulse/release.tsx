import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Release = "v1" | "v2";

export const V1_ISSUE_LIMIT = 4;

type ReleaseCtx = {
  release: Release;
  setRelease: (r: Release) => void;
};

const Ctx = createContext<ReleaseCtx | null>(null);

const STORAGE_KEY = "pulse-release";

function getInitial(): Release {
  if (typeof window === "undefined") return "v1";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "v1" || raw === "v2") return raw;
  } catch {
    // fall through
  }
  return "v1";
}

export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setReleaseState] = useState<Release>(getInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, release);
  }, [release]);

  const setRelease = useCallback((r: Release) => setReleaseState(r), []);

  const value = useMemo(() => ({ release, setRelease }), [release, setRelease]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRelease(): ReleaseCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRelease must be used within ReleaseProvider");
  return ctx;
}

export function isV1(release: Release): boolean {
  return release === "v1";
}
