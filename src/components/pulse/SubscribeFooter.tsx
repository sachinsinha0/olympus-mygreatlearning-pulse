import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowRight, CalendarClock } from "lucide-react";
import { usePricing } from "../../lib/pulse/pricing";

export function SubscribeFooter() {
  const { openPricingModal } = usePricing();

  const iconTile = (
    <Box
      sx={(theme) => ({
        width: 48,
        height: 48,
        borderRadius: "12px",
        bgcolor: theme.palette.primary.light,
        color: theme.palette.primary.main,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        border: `1px solid ${theme.palette.outlineVariant.main}`,
      })}
    >
      <CalendarClock size={22} strokeWidth={2} />
    </Box>
  );

  const eyebrow = (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        color: "primary.main",
        lineHeight: "16px",
      }}
    >
      Ready to start?
    </Typography>
  );

  const titleEl = (
    <Typography
      sx={{
        fontSize: { xs: 18, md: 20 },
        fontWeight: 700,
        letterSpacing: "-0.4px",
        lineHeight: 1.25,
        color: "text.primary",
      }}
    >
      Get full access today.
    </Typography>
  );

  const bodyEl = (
    <Typography
      sx={{
        fontSize: 14,
        color: "text.secondary",
        lineHeight: 1.5,
        maxWidth: 620,
      }}
    >
      New module every two weeks. Each one short, hands-on, and applied to
      real work.
    </Typography>
  );

  const subscribeButton = (fullWidth: boolean) => (
    <Button
      variant="contained"
      disableElevation
      endIcon={<ArrowRight size={18} />}
      onClick={openPricingModal}
      sx={{
        height: fullWidth ? 44 : 40,
        px: 2,
        width: fullWidth ? "100%" : "auto",
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "-0.2px",
        whiteSpace: "nowrap",
        flexShrink: 0,
        borderRadius: "8px",
        textTransform: "none",
      }}
    >
      Subscribe to Pulse
    </Button>
  );

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        bgcolor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 6px 24px rgba(0,0,0,0.35)"
            : "0 8px 28px rgba(15, 23, 42, 0.06)",
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3.5 },
      })}
    >
      {/* Desktop layout (md+) — icon + content on left, CTA right-aligned */}
      <Stack
        direction="row"
        gap={3}
        alignItems="center"
        justifyContent="space-between"
        sx={{ position: "relative", display: { xs: "none", md: "flex" } }}
      >
        <Stack direction="row" gap={2.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
          {iconTile}
          <Stack gap={0.75} sx={{ minWidth: 0 }}>
            {eyebrow}
            {titleEl}
            {bodyEl}
          </Stack>
        </Stack>
        {subscribeButton(false)}
      </Stack>

      {/* Mobile layout (xs/sm) — same shape as ModuleListCard mobile: header [icon][eyebrow+title], then body, then full-width CTA */}
      <Stack
        gap={1.5}
        sx={{ position: "relative", display: { xs: "flex", md: "none" } }}
      >
        <Stack direction="row" gap={2} alignItems="flex-start">
          {iconTile}
          <Stack gap={0.5} sx={{ flex: 1, minWidth: 0 }}>
            {eyebrow}
            {titleEl}
          </Stack>
        </Stack>
        {bodyEl}
        {subscribeButton(true)}
      </Stack>
    </Box>
  );
}
