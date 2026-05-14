import { useState } from "react";
import { Box, Drawer, IconButton, Stack } from "@mui/material";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { ProgramSwitcher } from "./ProgramSwitcher";
import { NavTabs } from "./NavTabs";
import { ProfileMenu } from "./ProfileMenu";
import logo from "../../assets/gl-logo.svg";

/**
 * Top navigation — used across the entire product.
 * Below the nav, the page-specific content slot renders the current route.
 *
 * Below md (768px) the nav collapses behind a hamburger drawer that holds the
 * program switcher and nav tabs in a vertical list.
 */
export function TopNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        bgcolor: "surfaceContainer.highest",
        borderBottom: 1,
        borderColor: "outlineVariant.main",
        px: { xs: 1.5, md: 2 },
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
        <Stack direction="row" alignItems="center" gap={{ xs: 0.75, md: 1.5 }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            disableRipple
            aria-label="Open navigation"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              width: 40,
              height: 40,
              borderRadius: "10px",
              color: "text.primary",
            }}
          >
            <MenuIcon size={22} />
          </IconButton>
          <Box
            component="img"
            src={logo}
            alt="Great Learning"
            sx={{ height: { xs: 24, md: 28 }, width: "auto" }}
          />
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <ProgramSwitcher />
            <NavTabs />
          </Stack>
        </Stack>
        <ProfileMenu />
      </Stack>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "85vw", sm: 320 },
            maxWidth: 360,
            bgcolor: "surfaceContainer.highest",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "outlineVariant.main",
          }}
        >
          <Box component="img" src={logo} alt="Great Learning" sx={{ height: 24 }} />
          <IconButton
            onClick={() => setDrawerOpen(false)}
            disableRipple
            aria-label="Close navigation"
            sx={{ width: 36, height: 36, color: "text.primary" }}
          >
            <CloseIcon size={18} />
          </IconButton>
        </Stack>

        <Box sx={{ px: 2, pt: 2 }}>
          <ProgramSwitcher variant="drawer" />
        </Box>

        <Box sx={{ px: 1, pt: 1.5, pb: 2 }}>
          <NavTabs variant="drawer" onNavigate={() => setDrawerOpen(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}
