import { createTheme, type Theme } from "@mui/material/styles";
import { glLight, glDark, breakpoints } from "./tokens";
import { componentOverrides } from "./components";

export type ColorMode = "light" | "dark";

declare module "@mui/material/styles" {
  interface Palette {
    surface: { main: string; bright: string; dim: string };
    surfaceContainer: { main: string; low: string; lowest: string; high: string; highest: string };
    outlineVariant: { main: string };
    extended: typeof glLight.extended;
  }
  interface PaletteOptions {
    surface?: { main: string; bright: string; dim: string };
    surfaceContainer?: { main: string; low: string; lowest: string; high: string; highest: string };
    outlineVariant?: { main: string };
    extended?: typeof glLight.extended;
  }
  interface BreakpointOverrides {
    xl2: true;
    xl3: true;
  }
}

export function makeTheme(mode: ColorMode): Theme {
  const tokens = mode === "dark" ? glDark : glLight;
  const c = tokens.light;

  return createTheme({
    breakpoints: {
      values: {
        xs: breakpoints.xs,
        sm: breakpoints.sm,
        md: breakpoints.md,
        lg: breakpoints.lg,
        xl: breakpoints.xl,
        xl2: breakpoints.xl2,
        xl3: breakpoints.xl3,
      },
    },
    palette: {
      mode,
      primary: { main: c.primary, contrastText: c.onPrimary, light: c.primaryContainer, dark: c.onPrimaryContainer },
      secondary: { main: c.secondary, contrastText: c.onSecondary, light: c.secondaryContainer, dark: c.onSecondaryContainer },
      error: { main: c.error, contrastText: c.onError, light: c.errorContainer, dark: c.onErrorContainer },
      background: {
        default: mode === "dark" ? c.background : "#fdfbff",
        paper: c.surfaceContainerHighest,
      },
      text: { primary: c.onSurface, secondary: c.onSurfaceVariant },
      divider: c.outlineVariant,
      surface: { main: c.surface, bright: c.surfaceBright, dim: c.surfaceDim },
      surfaceContainer: {
        main: c.surfaceContainer,
        low: c.surfaceContainerLow,
        lowest: c.surfaceContainerLowest,
        high: c.surfaceContainerHigh,
        highest: c.surfaceContainerHighest,
      },
      outlineVariant: { main: c.outlineVariant },
      extended: tokens.extended,
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
      h5: { fontSize: 18, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.4px" },
      subtitle1: { fontSize: 16, fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.4px" },
      subtitle2: { fontSize: 14, fontWeight: 600, lineHeight: "20px", letterSpacing: "-0.4px" },
      body2: { fontSize: 14, fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.2px" },
      caption: { fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "-0.2px" },
      overline: { fontSize: 10, fontWeight: 600, lineHeight: "16px", letterSpacing: "1.2px", textTransform: "uppercase" },
      button: { fontSize: 14, fontWeight: 500, lineHeight: "20px", letterSpacing: "-0.2px", textTransform: "none" },
    },
    shape: { borderRadius: 8 },
    components: componentOverrides,
  });
}

// Back-compat export for any consumer still importing `theme` directly
export const theme = makeTheme("light");
