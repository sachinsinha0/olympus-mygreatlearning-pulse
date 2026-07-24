import { useEffect, useState } from "react";
import { Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ArrowRight, Check, ShieldCheck, X } from "lucide-react";
import { usePricing, type Plan } from "../../lib/pulse/pricing";
import { usePageLoader } from "../common/PageLoader";

const FEATURES = [
  "Featuring new AI tools and innovations every two weeks.",
  "Under 60 minutes, designed to fit your schedule.",
  "Apply what you learn at work immediately.",
];

type PlanCard = {
  plan: Plan;
  name: string;
  meta: string;
  perMo: string;
  save?: string;
};

const PLAN_CARDS: PlanCard[] = [
  {
    plan: "annual",
    name: "Annual",
    meta: "Billed annually · $300/year",
    perMo: "$25",
    save: "Save $60/year",
  },
  {
    plan: "monthly",
    name: "Monthly",
    meta: "Billed monthly · cancel anytime",
    perMo: "$30",
  },
];

export function PricingModal() {
  const { pricingModalOpen, closePricingModal, subscribe, state } = usePricing();
  const { runWithPageLoader } = usePageLoader();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");

  // Reset the default selection each time the dialog opens.
  useEffect(() => {
    if (pricingModalOpen) setSelectedPlan("annual");
  }, [pricingModalOpen]);

  const handleSubscribe = () => {
    runWithPageLoader(() => {
      subscribe(selectedPlan);
    }, 800);
  };

  return (
    <Dialog
      open={pricingModalOpen}
      onClose={closePricingModal}
      maxWidth={false}
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: { xs: "14px", md: "16px" },
          m: { xs: 2, md: 2 },
          width: { xs: "calc(100% - 32px)", md: 480 },
          maxWidth: { xs: "calc(100% - 32px)", md: 480 },
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

        <Stack gap={0.75} sx={{ mb: 2.5, pr: 5 }}>
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
            Stay on top of every AI development with biweekly modules you can apply at work.
          </Typography>
        </Stack>

        <Stack gap={1.25}>
          {PLAN_CARDS.map((card) => {
            const selected = selectedPlan === card.plan;
            return (
              <Box
                key={card.plan}
                role="radio"
                aria-checked={selected}
                tabIndex={0}
                onClick={() => setSelectedPlan(card.plan)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPlan(card.plan);
                  }
                }}
                sx={(theme) => ({
                  position: "relative",
                  cursor: "pointer",
                  p: { xs: 1.75, md: 2 },
                  borderRadius: "12px",
                  border: `1.5px solid ${selected ? theme.palette.primary.main : theme.palette.outlineVariant.main}`,
                  bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : theme.palette.background.paper,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  transition: "border-color 0.15s ease, background-color 0.15s ease",
                  "&:hover": { borderColor: theme.palette.primary.main },
                })}
              >
                {/* radio */}
                <Box
                  sx={(theme) => ({
                    flexShrink: 0,
                    mt: 0.375,
                    width: 18,
                    height: 18,
                    borderRadius: "999px",
                    border: `${selected ? 5 : 2}px solid ${selected ? theme.palette.primary.main : theme.palette.outlineVariant.main}`,
                    boxSizing: "border-box",
                    transition: "border 0.15s ease",
                  })}
                />

                <Stack gap={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.2px", color: "text.primary" }}>
                    {card.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: "text.secondary", letterSpacing: "-0.1px" }}>
                    {card.meta}
                  </Typography>
                  {card.save && (
                    <Box
                      sx={(theme) => ({
                        alignSelf: "flex-start",
                        mt: 0.25,
                        px: 1,
                        py: 0.375,
                        borderRadius: "6px",
                        bgcolor: theme.palette.primary.light,
                      })}
                    >
                      <Typography sx={(theme) => ({ fontSize: 11.5, fontWeight: 700, color: theme.palette.primary.main, letterSpacing: "-0.1px" })}>
                        {card.save}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Stack direction="row" alignItems="baseline" gap={0.5} sx={{ flexShrink: 0, pt: 0.25 }}>
                  <Typography sx={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.8px", color: "text.primary", lineHeight: 1 }}>
                    {card.perMo}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}>/mo</Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        <Stack gap={1.25} sx={{ mt: 2.5 }}>
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
        <Stack direction="row" gap={0.75} alignItems="center" justifyContent="center" sx={{ mt: 1.5 }}>
          <Box sx={{ display: "flex", color: "text.secondary" }}>
            <ShieldCheck size={13} strokeWidth={2} />
          </Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px" }}>
            Secure checkout
          </Typography>
        </Stack>
      </Box>
    </Dialog>
  );
}
