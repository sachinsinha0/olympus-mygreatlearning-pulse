import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { GL } from "../landingTheme";
import { RAIL_CARD } from "../content";

/**
 * The rail card that replaces the six field lead capture form on the real course
 * landing pages.
 *
 * Our leads are already captured by the sales team, so there is nothing to collect
 * a second time. The card asks for one thing, an email, and that email is carried
 * to the login step as a query parameter so the lead does not type it twice. An
 * empty field is allowed. It just goes to the login step with no query.
 *
 * The same card is rendered in two places on the page, and only one shows at a
 * time: sticky in the right rail from lg up, and once at the end of the modules
 * section below lg so phones and tablets still get it.
 */
export function TrialRailCard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const start = () => {
    const trimmed = email.trim();
    navigate(trimmed ? `/ai-pulse/login?email=${encodeURIComponent(trimmed)}` : "/ai-pulse/login");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: `1px solid ${GL.border}`,
        borderRadius: "8px",
        boxShadow: "0 4px 24px rgba(16, 24, 40, 0.10)",
        padding: { xs: 3, md: 3.5 },
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Typography
        sx={{ fontSize: 20, fontWeight: 600, color: GL.heading, textAlign: "center", lineHeight: 1.35 }}
      >
        {RAIL_CARD.title}
      </Typography>

      <Typography sx={{ fontSize: 14, color: GL.body, textAlign: "center", mt: 0.75 }}>
        {RAIL_CARD.body}
      </Typography>

      <TextField
        fullWidth
        size="medium"
        type="email"
        placeholder={RAIL_CARD.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mt: 2.5 }}
      />

      <Button variant="contained" fullWidth onClick={start} sx={{ mt: 1.5 }}>
        {RAIL_CARD.cta}
      </Button>

      <Typography
        sx={{ fontSize: 11, color: GL.body, textAlign: "center", mt: 1.5, lineHeight: 1.5 }}
      >
        {RAIL_CARD.consent}
      </Typography>

      <Divider sx={{ mt: 1.5 }} />

      <Typography sx={{ fontSize: 13, color: GL.body, textAlign: "center", mt: 1.5 }}>
        {RAIL_CARD.footnote}
      </Typography>
    </Box>
  );
}

export default TrialRailCard;
