import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type DesignVersion = "v1" | "v2";

export const DEFAULT_DESIGN_VERSION: DesignVersion = "v2";

export const DESIGN_VERSIONS: { value: DesignVersion; label: string }[] = [
  { value: "v2", label: "Version 2" },
  { value: "v1", label: "Version 1" },
];

type DesignVersionCtx = {
  designVersion: DesignVersion;
  setDesignVersion: (v: DesignVersion) => void;
};

const Ctx = createContext<DesignVersionCtx | null>(null);

const STORAGE_KEY = "pulse-design-version";

function getInitial(): DesignVersion {
  if (typeof window === "undefined") return DEFAULT_DESIGN_VERSION;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "v1" || raw === "v2") return raw;
  } catch {
    // fall through
  }
  return DEFAULT_DESIGN_VERSION;
}

export function DesignVersionProvider({ children }: { children: ReactNode }) {
  const [designVersion, setState] = useState<DesignVersion>(getInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, designVersion);
  }, [designVersion]);

  const setDesignVersion = useCallback((v: DesignVersion) => setState(v), []);

  const value = useMemo(
    () => ({ designVersion, setDesignVersion }),
    [designVersion, setDesignVersion],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDesignVersion(): DesignVersionCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDesignVersion must be used within DesignVersionProvider");
  return ctx;
}

export function isDesignV2(v: DesignVersion): boolean {
  return v === "v2";
}
