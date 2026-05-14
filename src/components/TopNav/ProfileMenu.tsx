import { useState } from "react";
import { Box, Divider, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import {
  Search,
  HelpCircle,
  Bell,
  User,
  Folder,
  CreditCard,
  LineChart,
  Hash,
  Newspaper,
  Banknote,
  FilePen,
  Settings,
  Moon,
  Sun,
  LogOut,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useColorMode } from "../../theme/ColorModeContext";

const staticItems: { label: string; Icon: LucideIcon }[] = [
  { label: "My ePortfolio", Icon: Folder },
  { label: "Fee Payment", Icon: CreditCard },
  { label: "Grade Sheet", Icon: LineChart },
  { label: "MyGreatLearning", Icon: Hash },
  { label: "Industry Articles", Icon: Newspaper },
  { label: "Refer & Earn", Icon: Banknote },
  { label: "Testimonials", Icon: FilePen },
  { label: "Settings", Icon: Settings },
];

const USER = {
  name: "Vaibhav Singh Thukral",
  email: "vi@gl.in",
};

export function ProfileMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = !!anchor;
  const { mode, toggle } = useColorMode();
  const items: ({ label: string; Icon: LucideIcon; onClick?: () => void })[] = [
    ...staticItems,
    {
      label: mode === "dark" ? "Change to light mode" : "Change to dark mode",
      Icon: mode === "dark" ? Sun : Moon,
      onClick: toggle,
    },
    {
      label: "Open Dev Panel",
      Icon: Wrench,
      onClick: () => window.dispatchEvent(new Event("dev-panel:open")),
    },
    { label: "Logout", Icon: LogOut },
  ];
  return (
    <Stack direction="row" alignItems="center" gap={{ xs: 0.25, sm: 0.5 }}>
      <IconButton sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, borderRadius: "10px" }}>
        <Search size={20} />
      </IconButton>
      <IconButton sx={{ width: 44, height: 44, borderRadius: "10px", display: { xs: "none", sm: "inline-flex" } }}>
        <HelpCircle size={22} />
      </IconButton>
      <Box sx={{ position: "relative" }}>
        <IconButton sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, borderRadius: "10px" }}>
          <Bell size={22} />
        </IconButton>
        <Box
          sx={{
            position: "absolute",
            top: 11,
            right: 11,
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "error.main",
            border: (theme) => `1.5px solid ${theme.palette.surfaceContainer.highest}`,
          }}
        />
      </Box>
      <Box
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          borderRadius: "50%",
          ml: { xs: 0.5, sm: 1 },
          overflow: "hidden",
          bgcolor: "surfaceContainer.high",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          cursor: "pointer",
          border: 1,
          borderColor: open ? "primary.main" : "outlineVariant.main",
          transition: "border-color 0.15s",
        }}
      >
        <User size={22} strokeWidth={1.5} />
      </Box>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 320,
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: 1,
              borderColor: "outlineVariant.main",
              overflow: "visible",
            },
          },
          list: { sx: { p: 1 } },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 1.5, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "surfaceContainer.high",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              flexShrink: 0,
              border: 1,
              borderColor: "outlineVariant.main",
            }}
          >
            <User size={22} strokeWidth={1.5} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: "20px", color: "text.primary", textTransform: "uppercase" }} noWrap>
              {USER.name}
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: "text.secondary", lineHeight: "18px" }} noWrap>
              {USER.email}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 0.5 }} />

        {items.map(({ label, Icon, onClick }) => (
          <MenuItem
            key={label}
            onClick={() => {
              onClick?.();
              setAnchor(null);
            }}
            sx={(theme) => ({
              px: 1.5,
              py: 1,
              gap: 1.5,
              borderRadius: "8px",
              mx: 0.5,
              "&:hover": {
                bgcolor: theme.palette.mode === "dark"
                  ? "rgba(179, 197, 255, 0.12)"
                  : "rgba(218, 225, 255, 0.32)",
              },
            })}
          >
            <Icon size={20} strokeWidth={1.75} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
              {label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}
