import type { ReactNode } from "react";
import { Box, Link, Stack, Tab, Tabs, Typography } from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import { TopNav } from "../../components/TopNav/TopNav";
import type { FeeAccount } from "../../lib/fees/feeAccount";

/**
 * Colours measured off the production page (light), with dark-mode stand-ins.
 */
export function feeColors(t: Theme) {
  const dark = t.palette.mode === "dark";
  const green = dark ? "#3ddba9" : "#00c48c";
  return {
    green,
    nextCardBg: dark ? alpha(t.palette.primary.main, 0.16) : "#d1e1f9",
    paidCardBg: dark ? alpha(green, 0.12) : "rgba(213, 242, 234, 0.5)",
    totalBg: dark ? t.palette.surfaceContainer.high : "#eaebed",
    totalBorder: dark ? alpha(t.palette.text.primary, 0.28) : "#6d6d6e",
    discountBg: dark ? t.palette.surfaceContainer.high : "#e0e1e2",
    infoBg: dark ? alpha("#2196f3", 0.14) : "#e8f4fd",
    infoText: dark ? "#b3dbfb" : "#0d3c61",
    infoIcon: "#2196f3",
  };
}

/** MUI Paper elevation 1, which every card on the production page uses. */
export const paperShadow = "0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)";

export const paperSx = {
  bgcolor: "background.paper",
  border: 0,
  borderRadius: "4px",
  boxShadow: paperShadow,
} as const;

/** Olympus shell: content capped at 1232px, centered under the top nav. */
export function FeeShell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <TopNav />
      <Box
        component="main"
        sx={{ flex: 1, width: "100%", maxWidth: 1232, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: { xs: 1, md: 4 }, pb: 6 }}
      >
        {children}
      </Box>
      <PageFooter />
    </Box>
  );
}

export type FeeTab = "payment" | "history";

export function FeeTabs({ value, onChange }: { value: FeeTab; onChange: (t: FeeTab) => void }) {
  return (
    <Tabs
      value={value}
      onChange={(_, v: FeeTab) => onChange(v)}
      variant="scrollable"
      scrollButtons={false}
      sx={{
        minHeight: 48,
        "& .MuiTabs-indicator": { height: 2, borderRadius: 0 },
        "& .MuiTab-root": {
          minHeight: 48,
          width: 160,
          px: 1.5,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
          textTransform: "uppercase",
          color: "text.primary",
          opacity: 0.7,
          borderRadius: 0,
        },
        "& .MuiTab-root.Mui-selected": { color: "text.primary", fontWeight: 600, opacity: 1 },
      }}
    >
      <Tab value="payment" label="Payment" disableRipple />
      <Tab value="history" label="Payment History" disableRipple />
    </Tabs>
  );
}

/** "In case of any queries, kindly reach out to us at … or mail to …" */
export function QueriesLine({ contact }: { contact: FeeAccount["contact"] }) {
  return (
    <Typography sx={{ fontSize: { xs: 14, md: 16 }, lineHeight: 1.5, textAlign: "center", color: "text.primary", px: 1.25 }}>
      In case of any queries, kindly reach out to us at {contact.phones.join(" / ")} (Mon to Fri: 10 AM - 6 PM) or mail to{" "}
      <Link href={`mailto:${contact.email}`} underline="none">
        {contact.email}
      </Link>
    </Typography>
  );
}

function PageFooter() {
  return (
    <Box component="footer" sx={{ py: 2.5, bgcolor: "surfaceContainer.high" }}>
      <Stack direction="row" justifyContent="center" gap={1} sx={{ fontSize: 13, color: "text.secondary" }}>
        <span>© {new Date().getFullYear()} All rights reserved</span>
        <span aria-hidden>·</span>
        <Link href="#" underline="hover" color="inherit">
          Privacy
        </Link>
      </Stack>
    </Box>
  );
}
