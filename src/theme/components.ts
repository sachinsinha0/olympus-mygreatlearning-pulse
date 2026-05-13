import type { Components, Theme } from "@mui/material/styles";

export const componentOverrides: Components<Omit<Theme, "components">> = {
  MuiButton: {
    defaultProps: { disableElevation: true, disableRipple: false },
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        letterSpacing: "-0.2px",
        minWidth: 0,
        padding: "6px 12px",
        height: 32,
        boxShadow: "none",
      },
      sizeSmall: { height: 24, padding: "4px 8px", fontSize: 12, lineHeight: "16px" },
      sizeLarge: { height: 40, padding: "10px 16px" },
      outlined: {
        borderColor: "var(--mui-palette-outlineVariant-main, #ebebef)",
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        padding: 4,
        color: theme.palette.text.secondary,
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: { minHeight: 40 },
      indicator: ({ theme }) => ({
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: theme.palette.primary.main,
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: "none",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        letterSpacing: "-0.2px",
        minHeight: 40,
        minWidth: 0,
        padding: "8px 16px",
        color: theme.palette.text.primary,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        "&.Mui-selected": {
          color: theme.palette.primary.main,
          fontWeight: 600,
          backgroundColor: "transparent",
        },
      }),
    },
  },
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.surfaceContainer.highest,
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        borderRadius: 12,
        boxShadow: "none",
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({ borderColor: theme.palette.outlineVariant.main }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.palette.surfaceContainer.main,
      }),
      bar: ({ theme }) => ({ backgroundColor: theme.palette.primary.main, borderRadius: 4 }),
    },
  },
};
