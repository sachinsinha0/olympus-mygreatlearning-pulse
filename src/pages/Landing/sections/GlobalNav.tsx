import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Home } from "lucide-react";
import { GL } from "../landingTheme";
import logo from "../../../assets/gl-logo.svg";

/**
 * The Great Learning global nav, copied from the live site so the landing page
 * reads as a real mygreatlearning.com course page.
 *
 * The 72px bar sticks to the top. The breadcrumb row below it scrolls away.
 */

const NAV_LINKS = ["Career Support", "Success Stories", "Enterprise", "For Recruiters"];

/** The 1256px content column, shared by the nav bar and the breadcrumb row. */
function NavColumn({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        maxWidth: GL.maxWidth,
        mx: "auto",
        px: { xs: 2.5, md: 4 },
        height: "100%",
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/**
 * The nav destinations do not exist in this prototype, so these render as spans
 * rather than as links that dead-end on a 404.
 */
function NavLink({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        fontSize: 15,
        fontWeight: 500,
        color: GL.heading,
        cursor: "default",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

export function GlobalNav() {
  const navigate = useNavigate();

  return (
    <Box component="header">
      <Box
        sx={{
          height: 72,
          bgcolor: "#ffffff",
          borderBottom: `1px solid ${GL.border}`,
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <NavColumn sx={{ gap: 3 }}>
          <Box component="img" src={logo} alt="Great Learning" sx={{ height: 30 }} />

          <Button
            variant="contained"
            endIcon={<ChevronDown size={16} />}
            sx={{
              minHeight: 40,
              padding: "8px 16px",
              fontSize: 15,
              display: { xs: "none", md: "inline-flex" },
              whiteSpace: "nowrap",
            }}
          >
            Explore Programs
          </Button>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3.5 }}>
            {NAV_LINKS.map((label) => (
              <NavLink key={label}>{label}</NavLink>
            ))}
            <NavLink>
              More
              <ChevronDown size={14} />
            </NavLink>
          </Box>

          <Button
            onClick={() => navigate("/ai-pulse/login")}
            sx={{
              ml: "auto",
              backgroundColor: "#EEF2F7",
              color: GL.blue,
              fontSize: 15,
              fontWeight: 600,
              minHeight: 40,
              padding: "8px 20px",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "#E2E8F0" },
            }}
          >
            LOGIN
          </Button>
        </NavColumn>
      </Box>

      <Box sx={{ height: 44, bgcolor: "#ffffff", borderBottom: `1px solid ${GL.border}` }}>
        <NavColumn sx={{ gap: 1 }}>
          <Home size={14} color={GL.body} />
          <ChevronRight size={13} color={GL.body} />
          <Typography sx={{ fontSize: 13, color: GL.body, whiteSpace: "nowrap" }}>
            Artificial Intelligence Courses
          </Typography>
          <ChevronRight size={13} color={GL.body} />
          <Typography sx={{ fontSize: 13, color: GL.heading, whiteSpace: "nowrap" }}>
            AI Pulse
          </Typography>
        </NavColumn>
      </Box>
    </Box>
  );
}
