/**
 * Great Learning Light tokens — extracted from magna-theme.json (Material Design 3).
 * Source of truth for palette + typography + spacing + breakpoints.
 */

export const glLight = {
  light: {
    primary: "#0054d6",
    onPrimary: "#ffffff",
    primaryContainer: "#dae1ff",
    onPrimaryContainer: "#001849",
    secondary: "#3a3bff",
    onSecondary: "#ffffff",
    secondaryContainer: "#e1e0ff",
    onSecondaryContainer: "#05006d",
    tertiary: "#8b00e8",
    onTertiary: "#ffffff",
    tertiaryContainer: "#f1dbff",
    onTertiaryContainer: "#2d0050",
    error: "#ba1a17",
    onError: "#ffffff",
    errorContainer: "#ffdad5",
    onErrorContainer: "#410001",
    background: "#f2f4f7",
    onBackground: "#1a1b1e",
    surface: "#faf9fd",
    onSurface: "#1a1b1e",
    surfaceVariant: "#e2e2ec",
    onSurfaceVariant: "#45464f",
    outline: "#757680",
    outlineVariant: "#ebebef",
    surfaceContainerHighest: "#ffffff",
    surfaceContainerHigh: "#f4f3f7",
    surfaceContainer: "#efedf1",
    surfaceContainerLow: "#e9e7ec",
    surfaceContainerLowest: "#e4e2e6",
    surfaceBright: "#faf9fd",
    surfaceDim: "#dbd9dd",
    inverseSurface: "#2f3033",
    inverseOnSurface: "#f1f0f4",
    inversePrimary: "#b3c5ff",
    scrim: "#000000",
    shadow: "#000000",
  },
  // Extended palette — used for activity-row colored icons + promo gradients
  extended: {
    warning: { color: "#8d4f00", onColor: "#ffffff", colorContainer: "#ffdcc0", onColorContainer: "#2d1600" },
    success: { color: "#006d3c", onColor: "#ffffff", colorContainer: "#70fda7", onColorContainer: "#00210e" },
    teal: { color: "#006a60", onColor: "#ffffff", colorContainer: "#74f8e5", onColorContainer: "#00201c" },
    cyan: { color: "#006876", onColor: "#ffffff", colorContainer: "#a1efff", onColorContainer: "#001f25" },
    lightBlue: { color: "#006493", onColor: "#ffffff", colorContainer: "#cae6ff", onColorContainer: "#001e30" },
    indigo: { color: "#4355b9", onColor: "#ffffff", colorContainer: "#dee0ff", onColorContainer: "#00105c" },
    deepPurple: { color: "#6f43c0", onColor: "#ffffff", colorContainer: "#ebddff", onColorContainer: "#250059" },
    pink: { color: "#b2008a", onColor: "#ffffff", colorContainer: "#ffd8eb", onColorContainer: "#3b002c" },
    rose: { color: "#bd0143", onColor: "#ffffff", colorContainer: "#ffd9dc", onColorContainer: "#400011" },
    yellow: { color: "#695f00", onColor: "#ffffff", colorContainer: "#f9e534", onColorContainer: "#201c00" },
    amber: { color: "#785900", onColor: "#ffffff", colorContainer: "#ffdf9e", onColorContainer: "#261a00" },
    orange: { color: "#8b5000", onColor: "#ffffff", colorContainer: "#ffdcbe", onColorContainer: "#2c1600" },
    deepOrange: { color: "#b02f00", onColor: "#ffffff", colorContainer: "#ffdbd1", onColorContainer: "#3b0900" },
    lime: { color: "#5b6300", onColor: "#ffffff", colorContainer: "#dded49", onColorContainer: "#1a1d00" },
    lightGreen: { color: "#3e6a00", onColor: "#ffffff", colorContainer: "#b9f474", onColorContainer: "#0f2000" },
    green: { color: "#006e1c", onColor: "#ffffff", colorContainer: "#94f990", onColorContainer: "#002204" },
    purple: { color: "#9a25ae", onColor: "#ffffff", colorContainer: "#ffd6fe", onColorContainer: "#35003f" },
  },
  fixed: { white: "#ffffff", black: "#242424" },
} as const;

/** Great Learning Dark — magna-theme dark mode + custom contrast tweaks for legibility */
export const glDark = {
  light: {
    primary: "#b3c5ff",
    onPrimary: "#002b75",
    primaryContainer: "#003fa4",
    onPrimaryContainer: "#dae1ff",
    secondary: "#c0c1ff",
    onSecondary: "#0c00aa",
    secondaryContainer: "#1600ec",
    onSecondaryContainer: "#e1e0ff",
    tertiary: "#deb7ff",
    onTertiary: "#4a007f",
    tertiaryContainer: "#6900b2",
    onTertiaryContainer: "#f1dbff",
    error: "#ffb4aa",
    onError: "#690003",
    errorContainer: "#930006",
    onErrorContainer: "#ffdad5",
    background: "#121316",
    onBackground: "#e3e2e6",
    surface: "#121316",
    onSurface: "#e3e2e6",
    surfaceVariant: "#45464f",
    onSurfaceVariant: "#c5c6d0",
    outline: "#8f909a",
    outlineVariant: "#2f3033",
    surfaceContainerHighest: "#343538",
    surfaceContainerHigh: "#292a2d",
    surfaceContainer: "#1e1f23",
    surfaceContainerLow: "#1a1b1e",
    surfaceContainerLowest: "#0d0e11",
    surfaceBright: "#38393c",
    surfaceDim: "#121316",
    inverseSurface: "#e3e2e6",
    inverseOnSurface: "#1a1b1e",
    inversePrimary: "#0054d6",
    scrim: "#000000",
    shadow: "#000000",
  },
  extended: glLight.extended,
  fixed: glLight.fixed,
} as const;

export type ThemeTokens = typeof glLight;

// Spacing scale (magna): step = 4 * n  (i.e. 1=4, 2=8, 3=16, 4=24, 5=32, 6=40, 7=48, 8=56, 9=64...)
// MUI default spacing(n) = 8n. We expose magnaSpacing() helper for non-8-grid values where needed.
export const magnaSpacing = (step: number): number => {
  const map: Record<number, number> = {
    1: 4, 2: 8, 3: 16, 4: 24, 5: 32, 6: 40, 7: 48, 8: 56, 9: 64,
    10: 72, 11: 80, 12: 88, 13: 96, 14: 104, 15: 112, 16: 120,
  };
  return map[step] ?? step * 8;
};

export const breakpoints = {
  xs: 360,
  sm: 600,
  // md was 768 (iPad portrait) but the mobile UI works through tablet too.
  // Lift md to 1024 so tablet (iPad/Air/Pro 11") renders the mobile responsive UI,
  // and desktop responsive UI only kicks in at iPad Pro 13" / laptop (1024+).
  md: 1024,
  lg: 1024,
  xl: 1280,
  xl2: 1536,
  xl3: 1920,
} as const;
