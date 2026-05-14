import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { makeTheme, type ColorMode } from "./theme";

type ColorModeCtx = {
  mode: ColorMode;
  toggle: () => void;
  setMode: (m: ColorMode) => void;
};

const Ctx = createContext<ColorModeCtx | null>(null);

const STORAGE_KEY = "pulse.colorMode";

function getInitialMode(): ColorMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const toggle = useCallback(() => setMode((m) => (m === "light" ? "dark" : "light")), []);
  const theme = useMemo(() => makeTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle]);

  return (
    <Ctx.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Ctx.Provider>
  );
}

export function useColorMode(): ColorModeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useColorMode must be used within ColorModeProvider");
  return ctx;
}
