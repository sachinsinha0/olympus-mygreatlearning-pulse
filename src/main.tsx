import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, GlobalStyles } from "@mui/material";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { ColorModeProvider } from "./theme/ColorModeContext";
import { PricingProvider } from "./lib/pulse/pricing";
import { ReleaseProvider } from "./lib/pulse/release";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorModeProvider>
      <ReleaseProvider>
      <PricingProvider>
      <CssBaseline />
      <GlobalStyles
        styles={(theme) => ({
          "html, body, #root": {
            fontFamily: '"Inter", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
            fontFeatureSettings: '"ss01", "cv01"',
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default,
          },
          body: { margin: 0 },
        })}
      />
      <App />
      </PricingProvider>
      </ReleaseProvider>
    </ColorModeProvider>
  </StrictMode>
);
