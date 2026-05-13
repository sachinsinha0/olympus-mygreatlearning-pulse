import { Box, Button, Stack, Typography } from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLAN_PRICE, usePricing } from "../../lib/pulse/pricing";

type Props = { variant?: "active" };

function formatDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

export function SubscriptionCard(_props: Props = { variant: "active" }) {
  const { activeUntil, plan } = usePricing();
  const navigate = useNavigate();
  const planLabel = plan === "annual" ? "Annual" : "Monthly";
  const priceLabel = plan ? PLAN_PRICE[plan].display : "$29/mo";

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "outlineVariant.main",
        borderRadius: "12px",
        bgcolor: "surfaceContainer.highest",
        p: 2.5,
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={2}>
        <Stack gap={1}>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            sx={(theme) => ({
              px: 1.25,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: theme.palette.extended.success.colorContainer,
              color: theme.palette.extended.success.color,
              alignSelf: "flex-start",
            })}
          >
            <CheckCircle2 size={14} />
            <Typography sx={{ fontSize: 12, fontWeight: 500, letterSpacing: "-0.2px" }}>
              Your subscription is active
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
            Pulse subscription
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
            {planLabel} · {priceLabel} · Renews on {formatDate(activeUntil)}
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          disableElevation
          onClick={() => navigate("/pulse/subscription")}
          sx={{
            height: 36,
            px: 2,
            borderColor: "outlineVariant.main",
            color: "text.primary",
            fontSize: 14,
            fontWeight: 500,
            "&:hover": { borderColor: "primary.main", bgcolor: "primary.light", color: "primary.main" },
          }}
        >
          Manage Subscription
        </Button>
      </Stack>
    </Box>
  );
}
