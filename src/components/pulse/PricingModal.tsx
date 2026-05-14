import { useState } from "react";
import { Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { Check, X } from "lucide-react";
import { usePricing, type Plan } from "../../lib/pulse/pricing";
import { usePageLoader } from "../common/PageLoader";

type TierProps = {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
};

const FEATURES: Record<Plan, string[]> = {
  monthly: [
    "Every release fully unlocked",
    "Full archive access",
    "Community access",
  ],
  annual: [
    "Everything in monthly",
    "Quarterly live builds with the team",
    "Priority on topic requests",
  ],
};

function PlanCard({ plan, selected, onSelect, recommended }: TierProps) {
  const isAnnual = plan === "annual";
  return (
    <Box
      onClick={onSelect}
      sx={(theme) => ({
        position: "relative",
        flex: 1,
        p: 3,
        borderRadius: "12px",
        border: 2,
        borderColor: selected ? theme.palette.primary.main : theme.palette.outlineVariant.main,
        bgcolor: "surfaceContainer.highest",
        cursor: "pointer",
        transition: "border-color 120ms ease, box-shadow 120ms ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
        },
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{ mb: 1.5 }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
          {isAnnual ? "Annual" : "Monthly"}
        </Typography>
        {recommended && (
          <Box
            sx={(theme) => ({
              px: 1,
              py: 0.25,
              borderRadius: "999px",
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "-0.2px",
              whiteSpace: "nowrap",
            })}
          >
            Best value
          </Box>
        )}
      </Stack>
      <Stack direction="row" alignItems="baseline" gap={0.5} sx={{ mb: 0.5 }}>
        <Typography sx={{ fontSize: 36, fontWeight: 700, letterSpacing: "-1px", color: "text.primary" }}>
          {isAnnual ? "$999" : "$100"}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", letterSpacing: "-0.2px" }}>
          {isAnnual ? "/yr" : "/mo"}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px", mb: 2.5 }}>
        {isAnnual ? "Save 17% · $83.25/mo" : "Cancel anytime."}
      </Typography>
      <Stack gap={1}>
        {FEATURES[plan].map((f) => (
          <Stack key={f} direction="row" gap={1} alignItems="center" sx={(theme) => ({ color: theme.palette.extended.success.color })}>
            <Check size={14} strokeWidth={2.5} />
            <Typography sx={{ fontSize: 13, color: "text.primary", letterSpacing: "-0.2px" }}>
              {f}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export function PricingModal() {
  const { pricingModalOpen, closePricingModal, subscribe, state } = usePricing();
  const { runWithPageLoader } = usePageLoader();
  const [selected, setSelected] = useState<Plan>("annual");

  const handleSubscribe = () => {
    runWithPageLoader(() => {
      subscribe(selected);
    }, 800);
  };

  return (
    <Dialog
      open={pricingModalOpen}
      onClose={closePricingModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          borderRadius: "16px",
          p: { xs: 3, md: 4 },
          m: 2,
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack gap={0.75}>
          <Typography
            sx={{
              fontSize: { xs: 22, md: 26 },
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              color: "text.primary",
            }}
          >
            {state === "expired" ? "Welcome back to Pulse" : "Pick a plan, ship with Pulse"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5 }}>
            No card games. Cancel anytime.
          </Typography>
        </Stack>
        <IconButton onClick={closePricingModal} size="small" disableRipple>
          <X size={20} />
        </IconButton>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={2} sx={{ mb: 3, pt: 1 }}>
        <PlanCard plan="monthly" selected={selected === "monthly"} onSelect={() => setSelected("monthly")} />
        <PlanCard
          plan="annual"
          selected={selected === "annual"}
          onSelect={() => setSelected("annual")}
          recommended
        />
      </Stack>

      <Stack direction="row" gap={1.5} justifyContent="flex-end" alignItems="center">
        <Button
          variant="text"
          onClick={closePricingModal}
          sx={{ color: "text.secondary", fontSize: 14, fontWeight: 500 }}
        >
          Maybe later
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubscribe}
          sx={{ height: 44, px: 3, fontSize: 15, fontWeight: 600 }}
        >
          {selected === "annual" ? "Subscribe · $999/yr" : "Subscribe · $100/mo"}
        </Button>
      </Stack>
    </Dialog>
  );
}
