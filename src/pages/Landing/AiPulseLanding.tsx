import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { GlobalNav } from "./sections/GlobalNav";
import { LandingHero } from "./sections/LandingHero";
import { RatingsRow } from "./sections/RatingsRow";
import { IntroPitchSection } from "./sections/IntroPitchSection";
import { ModulesSection } from "./sections/ModulesSection";
import { TrialSection } from "./sections/TrialSection";
import { PgProgramSection } from "./sections/PgProgramSection";
import { FaqSection } from "./sections/FaqSection";
import { LandingFooter } from "./sections/LandingFooter";
import { StickyCtaBar } from "./sections/StickyCtaBar";
import { TrialRailRegion } from "./sections/TrialRailRegion";

export function AiPulseLanding() {
  return (
    <ThemeProvider theme={landingTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
        <GlobalNav />
        <LandingHero />
        <RatingsRow />
        <IntroPitchSection />
        <TrialRailRegion>
          <ModulesSection />
        </TrialRailRegion>
        <TrialSection />
        <PgProgramSection />
        <FaqSection />
        <LandingFooter />
        <StickyCtaBar />
      </Box>
    </ThemeProvider>
  );
}

export default AiPulseLanding;
