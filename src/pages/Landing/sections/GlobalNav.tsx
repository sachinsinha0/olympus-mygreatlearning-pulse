import { Box } from "@mui/material";
import { GL } from "../landingTheme";
import { ContentColumn } from "../parts";
import logo from "../../../assets/gl-logo.svg";

/**
 * The landing page header. Great Learning logo, nothing else.
 *
 * The course landing pages carry the full site nav and a breadcrumb because they sit
 * inside the course taxonomy, so a learner needs a way back up to it. AI Pulse is not
 * a programme in that taxonomy, so neither applies. The standalone pages on the real
 * site work the same way: /enterprise and /universities have no breadcrumb.
 *
 * Logging in is offered by the hero and by the sticky bottom bar, so the header does
 * not need to carry it as well.
 */
export function GlobalNav() {
  return (
    <Box
      component="header"
      sx={{
        height: 72,
        bgcolor: "#ffffff",
        borderBottom: `1px solid ${GL.border}`,
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <ContentColumn sx={{ height: "100%", display: "flex", alignItems: "center" }}>
        <Box component="img" src={logo} alt="Great Learning" sx={{ height: 30 }} />
      </ContentColumn>
    </Box>
  );
}
