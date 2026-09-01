import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { GlobalNav } from "./sections/GlobalNav";
import { LandingHero } from "./sections/LandingHero";
import { RecognitionSection } from "./sections/RecognitionSection";
import { RatingsRow } from "./sections/RatingsRow";
import { PitchWhatItIsSection } from "./sections/PitchWhatItIsSection";
import { PitchCadenceSection } from "./sections/PitchCadenceSection";
import { PitchInsideSection } from "./sections/PitchInsideSection";
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
        {/* The reader's own problem, before the page describes itself. */}
        <RecognitionSection />
        {/* The product's three slide onboarding pitch, one section per beat. */}
        <PitchWhatItIsSection />
        <PitchCadenceSection />
        <PitchInsideSection />
        <TrialRailRegion>
          <ModulesSection />
        </TrialRailRegion>
        {/* Trust signals sit here, just before the ask, rather than second on the
            page where they asked for trust before there was interest to protect. */}
        <RatingsRow />
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
