import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

/**
 * Great Learning marketing tokens, measured from the live course landing template
 * (the IIT Bombay and Johns Hopkins pages, which are the same template re-skinned).
 *
 * This is the MARKETING skin and it stays inside the /ai-pulse route. The product
 * theme in src/theme/ is a different design language and must not be changed to
 * match. A learner crosses from one to the other at the login step, which is how
 * the real site behaves.
 */
export const GL = {
  blue: "#196AE5",
  blueHover: "#1259C4",
  /** Hero H1. */
  ink: "#101828",
  /** Section headings on light backgrounds. */
  heading: "rgba(0, 0, 0, 0.92)",
  body: "#444444",
  /** Dark section background. */
  dark: "#0C111D",
  /** Body text on the dark background. */
  darkBody: "#B9BFCB",
  /** Pale band. rgba(0,0,0,0.04) resolved over white. */
  pale: "#F5F5F5",
  border: "#E4E7EC",
  darkBorder: "#2A3140",
  /**
   * The site footer's black, and the grey that reads on it.
   *
   * Neutral, not the navy the PG band uses. The live Great Learning footer is black,
   * and darkBody is a blue cast grey tuned for that navy, which goes faintly blue
   * once the ground behind it stops being blue.
   */
  /**
   * The brand blue, lightened for dark grounds. #196AE5 on #0C111D is about 3:1,
   * which fails for 11px type; this clears 7:1 on the same ground.
   */
  blueOnDark: "#8AB2F5",
  footer: "#111111",
  footerBody: "#C7C7C7",
  gold: "#F5B301",
  /**
   * The Great Learning site grid. The course pages measure 1256 in places, but the
   * homepage and the site at large run a 1280 container, and this page follows the
   * site for consistency.
   */
  maxWidth: 1280,
} as const;

const FONT = '"Poppins", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';

export const landingTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: GL.blue, contrastText: "#ffffff" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: GL.heading, secondary: GL.body },
    divider: GL.border,
  },
  typography: {
    fontFamily: FONT,
    body1: { fontSize: 16, lineHeight: 1.6, color: GL.body },
    body2: { fontSize: 15, lineHeight: 1.6, color: GL.body },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 600,
          minHeight: 48,
          padding: "12px 22px",
          boxShadow: "none",
        },
        contained: {
          backgroundColor: GL.blue,
          "&:hover": { backgroundColor: GL.blueHover, boxShadow: "none" },
        },
        outlined: {
          borderColor: GL.blue,
          color: GL.blue,
          "&:hover": { borderColor: GL.blue, backgroundColor: "rgba(25, 106, 229, 0.04)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 4, fontFamily: FONT, fontSize: 15 },
        notchedOutline: { borderColor: GL.border },
      },
    },
  },
});
