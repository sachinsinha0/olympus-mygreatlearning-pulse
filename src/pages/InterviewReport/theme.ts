import { createTheme, type Theme } from "@mui/material/styles";
import { makeTheme } from "../../theme/theme";

const base = makeTheme("light");

/**
 * Interview Report surface theme.
 * Same GL palette/typography and the same MUI elements as the rest of the app,
 * but with a 4px border radius (MUI's default) so corners match our product
 * design system. Scoped to this page via a local ThemeProvider — it does not
 * affect any other route.
 */
export const interviewTheme = createTheme(base, {
  shape: { borderRadius: 4 },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.surfaceContainer.highest,
          border: `1px solid ${theme.palette.outlineVariant.main}`,
          borderRadius: 4,
          boxShadow: "none",
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({ borderRadius: 4, padding: 4, color: theme.palette.text.secondary }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 600 },
      },
    },
  },
});
