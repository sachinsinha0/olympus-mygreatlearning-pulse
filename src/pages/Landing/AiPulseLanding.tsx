import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { GlobalNav } from "./sections/GlobalNav";
import { LandingHero } from "./sections/LandingHero";
import { RatingsRow } from "./sections/RatingsRow";
import { LabsSection } from "./sections/LabsSection";
import { WhySubscribe } from "./sections/WhySubscribe";
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
        <LabsSection />
        {/* The trial card travels past both of these, the way the lead capture form
            does on the real course pages. */}
        <TrialRailRegion>
          <WhySubscribe />
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
