import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { Section, SectionHeading } from "./parts";

export function AiPulseLanding() {
  return (
    <ThemeProvider theme={landingTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
        <Section>
          <SectionHeading>AI Pulse landing page</SectionHeading>
        </Section>
      </Box>
    </ThemeProvider>
  );
}

export default AiPulseLanding;
