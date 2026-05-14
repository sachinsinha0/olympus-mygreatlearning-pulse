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

type Variant = "topbar" | "drawer";

export function NavTabs({ variant = "topbar", onNavigate }: { variant?: Variant; onNavigate?: () => void } = {}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("#")) return false;
    return location.pathname.startsWith(path);
  };

  const isDrawer = variant === "drawer";

  return (
    <Stack
      direction={isDrawer ? "column" : "row"}
      gap={isDrawer ? 0.5 : 2}
      sx={{ ml: isDrawer ? 0 : 1, width: isDrawer ? "100%" : "auto" }}
    >
      {tabs.map(({ id, label, Icon, path, badge }) => {
        const selected = isActive(path);
        // Drawer: icons are always primary-tinted (Olympus pattern). Topbar: icon follows label color.
        const iconColor = isDrawer ? theme.palette.primary.main : (selected ? theme.palette.primary.main : theme.palette.text.primary);
        const labelColor = selected ? theme.palette.primary.main : theme.palette.text.primary;
        const routable = !path.startsWith("#");
        return (
          <Button
            key={id}
            onClick={() => {
              if (routable) navigate(path);
              onNavigate?.();
            }}
            startIcon={<Icon size={18} strokeWidth={2} color={iconColor} />}
            disableRipple
            sx={{
              height: isDrawer ? 48 : 40,
              px: 2,
              py: 1,
              borderRadius: "8px",
              fontSize: 14,
              fontWeight: 500,
              color: labelColor,
              bgcolor: isDrawer && selected ? "primary.light" : "transparent",
              cursor: routable ? "pointer" : "default",
              opacity: routable ? 1 : 0.95,
              justifyContent: isDrawer ? "flex-start" : "center",
              width: isDrawer ? "100%" : "auto",
              "& .MuiButton-startIcon": { mr: 1 },
              "&:hover": { bgcolor: isDrawer ? "primary.light" : "surfaceContainer.high" },
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
