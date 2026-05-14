import { Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { Check, X } from "lucide-react";
import { usePricing } from "../../lib/pulse/pricing";
import { usePageLoader } from "../common/PageLoader";

const FEATURES = [
  "New module every two weeks, 26 a year.",
  "Hands-on demos. You finish with a skill you can apply.",
  "Sequenced and outcome-driven learning.",
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
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: { xs: "14px", md: "16px" },
          m: { xs: 1.5, md: 2 },
          width: { xs: "calc(100% - 24px)", md: "auto" },
          overflow: "visible",
        },
      }}
    >
      <Box sx={{ position: "relative", px: { xs: 2.5, md: 4 }, pt: { xs: 3.5, md: 4.5 }, pb: { xs: 2.5, md: 3.5 } }}>
        <IconButton
          onClick={closePricingModal}
          size="small"
          disableRipple
          sx={(theme) => ({
            position: "absolute",
            top: 12,
            right: 12,
            color: theme.palette.text.secondary,
            "&:hover": { color: theme.palette.text.primary, bgcolor: "transparent" },
          })}
        >
          <X size={20} />
        </IconButton>

        <Stack gap={0.75} sx={{ mb: 3 }}>
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
            Keep every released module unlocked and get a new one every two weeks.
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
          <Stack direction="row" alignItems="baseline" gap={0.625} sx={{ mb: 0.5 }}>
            <Typography
              sx={{
                fontSize: { xs: 36, md: 42 },
                fontWeight: 700,
                letterSpacing: "-1.2px",
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              $25
            </Typography>
            <Typography sx={{ fontSize: 16, color: "text.secondary", letterSpacing: "-0.2px", fontWeight: 500 }}>
              /mo
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: "primary.main", letterSpacing: "-0.2px", mb: 2.25 }}>
            Billed annually
          </Typography>
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
          Subscribe
        </Button>
        <Typography
          sx={{
            mt: 1.5,
            textAlign: "center",
            fontSize: 12,
            color: "text.secondary",
            letterSpacing: "-0.2px",
          }}
        >
          Cancel anytime from Manage Subscription.
        </Typography>
      </Box>
    </Dialog>
  );
}
