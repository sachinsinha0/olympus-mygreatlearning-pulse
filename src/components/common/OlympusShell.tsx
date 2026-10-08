import type { ReactNode } from "react";
import { Box, Link, Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { TopNav } from "../TopNav/TopNav";

/**
 * Olympus page shell: top nav, a centred content column and the
 * "© All rights reserved · Privacy" footer. Pages pick the column width.
 */
export function OlympusShell({ children, maxWidth, sx }: { children: ReactNode; maxWidth: number; sx?: SxProps<Theme> }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <TopNav />
      <Box
        component="main"
        sx={[
          { flex: 1, width: "100%", maxWidth, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: { xs: 1, md: 4 }, pb: 6 },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {children}
      </Box>
      <Box component="footer" sx={{ py: 2.5, bgcolor: "surfaceContainer.high" }}>
        <Stack direction="row" justifyContent="center" gap={1} sx={{ fontSize: 13, color: "text.secondary" }}>
          <span>© {new Date().getFullYear()} All rights reserved</span>
          <span aria-hidden>·</span>
          <Link href="#" underline="hover" color="inherit">
            Privacy
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
