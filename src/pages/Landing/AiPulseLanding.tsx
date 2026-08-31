import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { GlobalNav } from "./sections/GlobalNav";
import { LandingHero } from "./sections/LandingHero";
import { ExpertBand } from "./sections/ExpertBand";
import { RatingsRow } from "./sections/RatingsRow";
import { WhySubscribe } from "./sections/WhySubscribe";
import { ModulesSection } from "./sections/ModulesSection";
import { TrialSection } from "./sections/TrialSection";
import { PgProgramSection } from "./sections/PgProgramSection";
import { FaqSection } from "./sections/FaqSection";
import { LandingFooter } from "./sections/LandingFooter";
import { StickyCtaBar } from "./sections/StickyCtaBar";

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
