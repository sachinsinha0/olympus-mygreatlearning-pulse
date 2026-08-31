import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { GlobalNav } from "./sections/GlobalNav";
import { LandingHero } from "./sections/LandingHero";
import { ExpertBand } from "./sections/ExpertBand";
import { RatingsRow } from "./sections/RatingsRow";
import { WhySubscribe } from "./sections/WhySubscribe";
import { ModulesSection } from "./sections/ModulesSection";

export function AiPulseLanding() {
  return (
    <ThemeProvider theme={landingTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
        <GlobalNav />
        <LandingHero />
        <ExpertBand />
        <RatingsRow />
        <WhySubscribe />
        <ModulesSection />
      </Box>
    </ThemeProvider>
  );
}

export default AiPulseLanding;
