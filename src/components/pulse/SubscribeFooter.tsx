import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowRight, CalendarClock } from "lucide-react";
import { usePricing } from "../../lib/pulse/pricing";

export function SubscribeFooter() {
  const { openPricingModal } = usePricing();

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
        px: { xs: 2.5, md: 4 },
        py: { xs: 3, md: 3.5 },
      })}
    >
      {/* Subtle glow accent in the top-right */}
      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          top: -40,
          right: -60,
          width: 360,
          height: 200,
          background: `radial-gradient(closest-side, ${theme.palette.primary.light} 0%, transparent 75%)`,
          opacity: 0.7,
          pointerEvents: "none",
        })}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={{ xs: 2, md: 3 }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative" }}
      >
        <Stack direction="row" gap={2.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
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
          <Stack gap={0.75} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: "primary.main",
                lineHeight: "16px",
              }}
            >
              New module every two weeks
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 18, md: 20 },
                fontWeight: 700,
                letterSpacing: "-0.4px",
                lineHeight: 1.25,
                color: "text.primary",
              }}
            >
              Get every new module the day it drops.
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: "text.secondary",
                lineHeight: 1.5,
                maxWidth: 620,
              }}
            >
              Subscribe and you'll see each release the moment it's live, plus the
              full archive of past modules whenever you want to revisit one.
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          disableElevation
          endIcon={<ArrowRight size={18} />}
          onClick={openPricingModal}
          sx={{
            height: 40,
            px: 2,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "-0.2px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            alignSelf: { xs: "stretch", md: "center" },
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Subscribe to Pulse
        </Button>
      </Stack>
    </Box>
  );
}
