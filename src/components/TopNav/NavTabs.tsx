import { Box, Button, Stack, useTheme } from "@mui/material";
import { Home, Calendar, Tv, Briefcase, HeartHandshake, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Tab = {
  id: string;
  label: string;
  Icon: typeof Home;
  path: string;
  badge?: string;
};

const tabs: Tab[] = [
  { id: "dashboard", label: "Dashboard", Icon: Home, path: "/" },
  { id: "activities", label: "Activities", Icon: Calendar, path: "#activities" },
  { id: "courses", label: "Courses", Icon: Tv, path: "/courses" },
  { id: "excelerate", label: "Excelerate", Icon: Briefcase, path: "#excelerate" },
  { id: "connect", label: "Connect", Icon: HeartHandshake, path: "#connect" },
  { id: "pulse", label: "Pulse", Icon: Sparkles, path: "/pulse", badge: "New" },
];

export function NavTabs() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("#")) return false;
    return location.pathname.startsWith(path);
  };
  return (
    <Stack direction="row" gap={2} sx={{ ml: 1 }}>
      {tabs.map(({ id, label, Icon, path, badge }) => {
        const selected = isActive(path);
        const color = selected ? theme.palette.primary.main : theme.palette.text.primary;
        const routable = !path.startsWith("#");
        return (
          <Button
            key={id}
            onClick={() => { if (routable) navigate(path); }}
            startIcon={<Icon size={18} strokeWidth={2} color={color} />}
            disableRipple
            sx={{
              height: 40,
              px: 2,
              py: 1,
              borderRadius: "8px",
              fontSize: 14,
              fontWeight: 500,
              color,
              bgcolor: "transparent",
              cursor: routable ? "pointer" : "default",
              opacity: routable ? 1 : 0.95,
              "& .MuiButton-startIcon": { mr: 1 },
              "&:hover": { bgcolor: "surfaceContainer.high" },
            }}
          >
            {label}
            {badge && (
              <Box
                component="span"
                sx={(theme) => ({
                  ml: 0.75,
                  px: 1,
                  py: 0.25,
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "16px",
                  color: theme.palette.error.contrastText,
                  bgcolor: theme.palette.error.main,
                  borderRadius: "8px",
                  letterSpacing: "-0.1px",
                })}
              >
                {badge}
              </Box>
            )}
          </Button>
        );
      })}
    </Stack>
  );
}
