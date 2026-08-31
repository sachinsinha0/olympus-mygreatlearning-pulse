import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Button, CssBaseline, TextField, Typography } from "@mui/material";
import { GL, landingTheme } from "./landingTheme";
import { RAIL_CARD } from "./content";
import logo from "../../assets/gl-logo.svg";
import { TRIAL_DAYS } from "../../lib/pulse/trial";
import { selectLandingModules } from "../../lib/pulse/landingModules";
import { getDefaultItemId } from "../../lib/pulse/courseItems";
import { usePricing } from "../../lib/pulse/pricing";
import { usePageLoader } from "../../components/common/PageLoader";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

/**
 * PROTOTYPE SHIM. There is no authentication here.
 *
 * There is no password field, nothing is checked, and nothing is sent anywhere.
 * The only rule is that the email field is not empty. Submitting starts the trial
 * in local state and opens the newest released module, which is the same thing the
 * Start Free Trial button in PulseV2Hero does, so both paths behave the same.
 *
 * This is also the seam between the two design languages. Everything above it is the
 * marketing skin, everything after it is the product theme, which is how the real
 * site behaves.
 */
export function AiPulseLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(() => params.get("email") ?? "");
  const { runWithPageLoader } = usePageLoader();
  const { startTrial } = usePricing();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // The freshest module, which is the far end of the chronological list the landing
    // page shows. Same destination as the Start Free Trial button on /pulse.
    const newest = selectLandingModules(issuesData as PulseIssue[]).newest;
    runWithPageLoader(() => {
      startTrial();
      if (!newest) {
        // Nothing released. Send them to the Pulse home rather than to
        // /pulse/modules/, which matches no route and would strand them on a blank page.
        navigate("/pulse");
        return;
      }
      const itemId = getDefaultItemId(newest.id, false);
      const itemPath = itemId ? `/items/${itemId}` : "";
      navigate(`/pulse/modules/${newest.id}${itemPath}?trial=started`);
    }, 950);
  };

  return (
    <ThemeProvider theme={landingTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: GL.pale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 440,
            width: "100%",
            backgroundColor: "#ffffff",
            border: `1px solid ${GL.border}`,
            borderRadius: "8px",
            boxShadow: "0 4px 24px rgba(16, 24, 40, 0.08)",
            padding: { xs: 3, md: 4.5 },
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Great Learning"
            sx={{ height: 30, display: "block", mx: "auto" }}
          />

          <Typography
            component="h1"
            sx={{
              fontSize: 20,
              fontWeight: 600,
              color: GL.heading,
              textAlign: "center",
              lineHeight: 1.35,
              mt: 3,
            }}
          >
            Log in to start your free trial
          </Typography>

          <Typography sx={{ fontSize: 14, color: GL.body, textAlign: "center", mt: 1 }}>
            {`${TRIAL_DAYS} days of full access. No credit card.`}
          </Typography>

          <Box component="form" onSubmit={onSubmit} noValidate>
            <TextField
              fullWidth
              size="medium"
              type="email"
              label="Email"
              placeholder={RAIL_CARD.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 3 }}
            />

            <Button type="submit" variant="contained" fullWidth disabled={!email.trim()} sx={{ mt: 2 }}>
              Continue
            </Button>
          </Box>

          <Typography
            sx={{ fontSize: 11, color: GL.body, textAlign: "center", mt: 2, lineHeight: 1.5 }}
          >
            {RAIL_CARD.consent}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AiPulseLogin;
