import { Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { ArrowRight, Check, ShieldCheck, X } from "lucide-react";
import { usePricing } from "../../lib/pulse/pricing";
import { usePageLoader } from "../common/PageLoader";

const FEATURES = [
  "New tools and trends every two weeks.",
  "30–60 minutes, designed to fit your schedule.",
  "Apply what you learn in real projects.",
];

export function PricingModal() {
  const { pricingModalOpen, closePricingModal, subscribe, state } = usePricing();
  const { runWithPageLoader } = usePageLoader();

  const handleSubscribe = () => {
    runWithPageLoader(() => {
      subscribe("annual");
    }, 800);
  };

  return (
    <Dialog
      open={pricingModalOpen}
      onClose={closePricingModal}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: { xs: "14px", md: "16px" },
          m: { xs: 1.5, md: 2 },
          width: { xs: "calc(100% - 24px)", md: 520 },
          maxWidth: { md: 520 },
          overflow: "visible",
        },
      }}
    >
      <Box sx={{ position: "relative", px: { xs: 2.5, md: 4 }, pt: { xs: 3.5, md: 4.5 }, pb: { xs: 2.5, md: 3.5 } }}>
        <IconButton
          onClick={closePricingModal}
          aria-label="Close"
          sx={(theme) => ({
            position: "absolute",
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: "8px",
            color: theme.palette.text.secondary,
            bgcolor: "transparent",
            transition: "background-color 0.15s ease, color 0.15s ease",
            "&:hover": {
              color: theme.palette.text.primary,
              bgcolor: theme.palette.action.hover,
            },
            "&:active": {
              bgcolor: theme.palette.action.selected,
            },
          })}
        >
          <X size={18} strokeWidth={2.25} />
        </IconButton>

        <Stack gap={0.75} sx={{ mb: 3, pr: 5 }}>
          <Typography
            sx={{
              fontSize: { xs: 22, md: 24 },
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              color: "text.primary",
            }}
          >
            {state === "expired" ? "Welcome back to Pulse" : "Subscribe to Pulse"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5, letterSpacing: "-0.2px" }}>
            Stay ahead of every AI shift with biweekly modules you can apply at work.
          </Typography>
        </Stack>

        <Box
          sx={(theme) => ({
            p: { xs: 2.25, md: 3 },
            borderRadius: "12px",
            border: `1px solid ${theme.palette.outlineVariant.main}`,
            bgcolor: theme.palette.background.paper,
          })}
        >
          <Stack gap={1} sx={{ mb: 2.25 }}>
            <Stack direction="row" alignItems="baseline" gap={1}>
              <Typography
                sx={{
                  fontSize: { xs: 40, md: 48 },
                  fontWeight: 700,
                  letterSpacing: "-1.4px",
                  color: "text.primary",
                  lineHeight: 1,
                }}
              >
                $300
              </Typography>
              <Typography sx={{ fontSize: 16, color: "text.secondary", letterSpacing: "-0.2px", fontWeight: 500 }}>
                /year
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.75}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "text.secondary",
                  textDecoration: "line-through",
                  letterSpacing: "-0.2px",
                }}
              >
                $400/year
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
                ·
              </Typography>
              <Typography
                sx={(theme) => ({
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  letterSpacing: "-0.2px",
                })}
              >
                Save $100
              </Typography>
            </Stack>
          </Stack>
          <Stack gap={1.25}>
            {FEATURES.map((f) => (
              <Stack key={f} direction="row" gap={1} alignItems="flex-start">
                <Box
                  sx={(theme) => ({
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "999px",
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: "1px",
                  })}
                >
                  <Check size={11} strokeWidth={3} />
                </Box>
                <Typography sx={{ fontSize: 14, color: "text.primary", letterSpacing: "-0.2px", lineHeight: 1.45 }}>
                  {f}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleSubscribe}
          endIcon={<ArrowRight size={18} />}
          sx={{
            mt: 3,
            height: 46,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.2px",
            textTransform: "none",
            borderRadius: "10px",
          }}
        >
          Pay and Subscribe
        </Button>
        <Stack
          direction="row"
          gap={0.75}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 1.5 }}
        >
          <Box sx={{ display: "flex", color: "text.secondary" }}>
            <ShieldCheck size={13} strokeWidth={2} />
          </Box>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              letterSpacing: "-0.2px",
            }}
          >
            Secure checkout
          </Typography>
        </Stack>
      </Box>
    </Dialog>
  );
}
