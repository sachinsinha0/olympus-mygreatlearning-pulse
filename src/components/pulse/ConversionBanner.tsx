import { Box, Button, Stack, Typography } from "@mui/material";
import { AlertCircle, Clock, Sparkles } from "lucide-react";
import { daysUntil, usePricing } from "../../lib/pulse/pricing";

type Variant = "pre-trial" | "trial-active" | "expired";

function formatDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

export function ConversionBanner() {
  const { state, trialStartedAt, activeUntil, startTrial, openPricingModal } = usePricing();

  if (state === "paid") return null;

  const variant: Variant =
    state === "expired"
      ? "expired"
      : trialStartedAt
      ? "trial-active"
      : "pre-trial";

  if (variant === "expired") {
    return (
      <BannerShell tone="error">
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
          <Icon Comp={AlertCircle} tone="error" />
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
              Your Pulse subscription ended on {formatDate(activeUntil)}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px" }}>
              Subscribe again to unlock every release.
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          disableElevation
          onClick={openPricingModal}
          sx={{ height: 36, px: 2, fontSize: 13, fontWeight: 600, flexShrink: 0 }}
        >
          Subscribe · from $100/mo
        </Button>
      </BannerShell>
    );
  }

  if (variant === "trial-active") {
    const days = daysUntil(activeUntil);
    const dayLabel = days === 1 ? "1 day" : `${days} days`;
    return (
      <BannerShell tone="primary">
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
          <Icon Comp={Clock} tone="primary" />
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
              30-day trial · {dayLabel} left
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px" }}>
              Subscribe before your trial ends to keep building with Pulse.
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          disableElevation
          onClick={openPricingModal}
          sx={{ height: 36, px: 2, fontSize: 13, fontWeight: 600, flexShrink: 0 }}
        >
          Subscribe
        </Button>
      </BannerShell>
    );
  }

  return (
    <BannerShell tone="primary">
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
        <Icon Comp={Sparkles} tone="primary" />
        <Stack sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
            Try Pulse free for 30 days
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px" }}>
            Full access to every release and the archive. No card required.
          </Typography>
        </Stack>
      </Stack>
      <Button
        variant="contained"
        disableElevation
        onClick={startTrial}
        sx={{ height: 36, px: 2, fontSize: 13, fontWeight: 600, flexShrink: 0 }}
      >
        Start 30-day trial
      </Button>
    </BannerShell>
  );
}

function BannerShell({ tone, children }: { tone: "primary" | "error"; children: React.ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: 2.5,
        py: 1.5,
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        borderRadius: "12px",
        bgcolor: tone === "error" ? theme.palette.error.light : theme.palette.primary.light,
      })}
    >
      {children}
    </Box>
  );
}

function Icon({ Comp, tone }: { Comp: typeof Clock; tone: "primary" | "error" }) {
  return (
    <Box
      sx={(theme) => ({
        color: tone === "error" ? theme.palette.error.dark : theme.palette.primary.main,
        display: "flex",
      })}
    >
      <Comp size={18} />
    </Box>
  );
}
