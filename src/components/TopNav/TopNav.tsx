import { Box, Stack } from "@mui/material";
import { ProgramSwitcher } from "./ProgramSwitcher";
import { NavTabs } from "./NavTabs";
import { ProfileMenu } from "./ProfileMenu";
import logo from "../../assets/gl-logo.svg";

/**
 * Top navigation — used across the entire product.
 * Below the nav, the page-specific content slot renders the current route.
 */
export function TopNav() {
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        bgcolor: "surfaceContainer.highest",
        borderBottom: 1,
        borderColor: "outlineVariant.main",
        px: 2,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            component="img"
            src={logo}
            alt="Great Learning"
            sx={{ height: 28, width: "auto" }}
          />
          <ProgramSwitcher />
          <NavTabs />
        </Stack>
        <ProfileMenu />
      </Stack>
    </Box>
  );
}
