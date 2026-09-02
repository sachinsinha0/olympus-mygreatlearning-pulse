import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { GlobalNav } from "./sections/GlobalNav";
import { LandingHero } from "./sections/LandingHero";
import { RatingsRow } from "./sections/RatingsRow";
import { PitchWhatItIsSection } from "./sections/PitchWhatItIsSection";
import { PitchCadenceSection } from "./sections/PitchCadenceSection";
import { PitchInsideSection } from "./sections/PitchInsideSection";
import { ModulesSection } from "./sections/ModulesSection";
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
        {/* Trust straight after the hero: the reader arrives from a sales call, so
            the review scores confirm who they are dealing with before the pitch. */}
        <RatingsRow />
        {/* The product's three slide onboarding pitch, one section per beat. */}
        <PitchWhatItIsSection />
        <PitchCadenceSection />
        <PitchInsideSection />
        <TrialRailRegion>
          <ModulesSection />
        </TrialRailRegion>
        {/* No trial-steps section here. It restated the FAQ: the credit card, the
            under an hour, and what happens after the trial are all answered there in
            nearly the same words. The trial card in the rail is the one place that
            needs to explain the trial, because it is the one place you can start it. */}
        <PgProgramSection />
        <FaqSection />
        <LandingFooter />
        <StickyCtaBar />
      </Box>
    </ThemeProvider>
  );
}

export default AiPulseLanding;
