import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";

type PageLoaderCtx = {
  visible: boolean;
  show: () => void;
  hide: () => void;
  /**
   * Show the overlay, run an action, then hide after the total elapsed time
   * reaches `holdMs`. Useful for navigation transitions where the action is
   * synchronous but we want a brief "things are happening" beat for the user.
   */
  runWithPageLoader: (action: () => void, holdMs?: number) => void;
};

const Ctx = createContext<PageLoaderCtx | null>(null);

export function PageLoaderProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  const runWithPageLoader = useCallback((action: () => void, holdMs = 600) => {
    setVisible(true);
    const start = Date.now();
    // Fire the action shortly after so the overlay has a chance to render
    // before any synchronous navigation kicks in.
    setTimeout(() => {
      action();
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, holdMs - elapsed);
      setTimeout(() => setVisible(false), remaining);
    }, 40);
  }, []);

  const value = useMemo(
    () => ({ visible, show, hide, runWithPageLoader }),
    [visible, show, hide, runWithPageLoader],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <PageLoaderOverlay visible={visible} />
    </Ctx.Provider>
  );
}

export function usePageLoader(): PageLoaderCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePageLoader must be used within PageLoaderProvider");
  return ctx;
}

const TOP_NAV_HEIGHT = 64;

function PageLoaderOverlay({ visible }: { visible: boolean }) {
  return (
    <Box
      aria-hidden={!visible}
      sx={(theme) => ({
        position: "fixed",
        top: TOP_NAV_HEIGHT,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(13, 14, 17, 0.55)"
            : "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 160ms ease",
      })}
    >
      <CircularProgress size={36} thickness={4} />
    </Box>
  );
}
