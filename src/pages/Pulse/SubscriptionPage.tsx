import { useMemo, useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { BookOpen, CheckCircle2, Clock4, Monitor, Sparkles } from "lucide-react";
import { TopNav } from "../../components/TopNav/TopNav";
import { ConfirmDialog } from "../../components/pulse/ConfirmDialog";
import { usePricing } from "../../lib/pulse/pricing";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
import { PULSE_TODAY } from "../../lib/pulse/prototypeDate";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

const allIssues = issuesData as PulseIssue[];

function formatDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

export function SubscriptionPage() {
  const { state, plan, activeUntil } = usePricing();
  const { hasStarted, hasCompleted } = useLearningProgress();

  const isPaid = state === "paid";
  const planLabel = plan === "monthly" ? "Monthly" : "Annual";
  const [cancelled, setCancelled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const stats = useMemo(() => {
    const today = PULSE_TODAY;
    const released = allIssues.filter((i) => i.releasedAt <= today);
    const startedCount = released.filter((i) => hasStarted(i.id)).length;
    const completedCount = released.filter((i) => hasCompleted(i.id)).length;
    const inProgressCount = Math.max(0, startedCount - completedCount);
    return {
      modulesStarted: startedCount,
      modulesCompleted: completedCount,
      modulesInProgress: inProgressCount,
      demosCompleted: completedCount,
    };
  }, [hasStarted, hasCompleted]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 640, mx: "auto", px: { xs: 2, sm: 3, md: 0 }, pt: 3, pb: 6 }}>
        {isPaid ? (
          <Stack gap={2}>
            <PlanHeroCard
              planLabel={planLabel}
              renewsOn={activeUntil}
              cancelled={cancelled}
              onCancelClick={() => setConfirmOpen(true)}
            />
            <LearningJourneyCard stats={stats} />
          </Stack>
        ) : (
          <>
            <Typography sx={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", color: "text.primary", mb: 1 }}>
              Manage Subscription
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              You don't have an active subscription.
            </Typography>
          </>
        )}
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setCancelled(true);
          setConfirmOpen(false);
        }}
        title="Cancel subscription?"
        body={`Your plan won't renew. You'll keep access to AI Pulse till ${formatDate(activeUntil)}.`}
        confirmLabel="Confirm"
        cancelLabel="Keep subscription"
      />
    </Box>
  );
}

function PlanHeroCard({
  planLabel,
  renewsOn,
  cancelled,
  onCancelClick,
}: {
  planLabel: string;
  renewsOn: string | null;
  cancelled: boolean;
  onCancelClick: () => void;
}) {
  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        borderRadius: "12px",
        bgcolor: theme.palette.background.paper,
        p: { xs: 2.25, md: 3 },
      })}
    >
      {cancelled && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: "10px", alignItems: "center" }}
        >
          Your subscription has been cancelled. You'll continue to have access to
          AI Pulse till {formatDate(renewsOn)}.
        </Alert>
      )}
      <Stack direction="row" gap={{ xs: 2, md: 2.5 }} alignItems="flex-start">
        <Box
          sx={(theme) => ({
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            borderRadius: "12px",
            bgcolor: theme.palette.extended.deepOrange.colorContainer,
            color: theme.palette.extended.deepOrange.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          })}
        >
          <Sparkles size={24} strokeWidth={2} />
        </Box>
        <Stack gap={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              alignSelf: "flex-start",
              px: 1.25,
              py: 0.625,
              borderRadius: "8px",
              bgcolor: cancelled ? theme.palette.error.light : theme.palette.primary.light,
              color: cancelled ? theme.palette.error.dark : theme.palette.primary.main,
            })}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.1px", lineHeight: "18px" }}>
              {cancelled ? "Cancelled" : "Active"}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 700, letterSpacing: "-0.3px", color: "text.primary", mt: 0.5 }}>
            Pulse · {planLabel}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
            Membership till {formatDate(renewsOn)}
          </Typography>
        </Stack>
        {!cancelled && (
          <Button
            variant="outlined"
            color="error"
            onClick={onCancelClick}
            sx={{
              flexShrink: 0,
              alignSelf: "center",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              whiteSpace: "nowrap",
            }}
          >
            Cancel Subscription
          </Button>
        )}
      </Stack>
    </Box>
  );
}

type StatTile = {
  label: string;
  value: number;
  icon: React.ReactNode;
  toneKey: "teal" | "indigo" | "purple" | "deepOrange";
};

function LearningJourneyCard({
  stats,
}: {
  stats: {
    modulesStarted: number;
    modulesCompleted: number;
    modulesInProgress: number;
    demosCompleted: number;
  };
}) {
  const tiles: StatTile[] = [
    { label: "Modules Started", value: stats.modulesStarted, icon: <BookOpen size={20} strokeWidth={2} />, toneKey: "indigo" },
    { label: "In Progress", value: stats.modulesInProgress, icon: <Clock4 size={20} strokeWidth={2} />, toneKey: "purple" },
    { label: "Modules Completed", value: stats.modulesCompleted, icon: <CheckCircle2 size={20} strokeWidth={2} />, toneKey: "teal" },
    { label: "Hands-on Demos Completed", value: stats.demosCompleted, icon: <Monitor size={20} strokeWidth={2} />, toneKey: "deepOrange" },
  ];

  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        borderRadius: "12px",
        bgcolor: theme.palette.background.paper,
        p: { xs: 2.25, md: 3 },
      })}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px", mb: 2 }}>
        Your Pulse Learning journey
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gridTemplateRows: { sm: "1fr 1fr" },
          gridAutoFlow: { xs: "row", sm: "column" },
          rowGap: 2,
          columnGap: 3,
        }}
      >
        {tiles.map((t) => (
          <StatRow key={t.label} tile={t} />
        ))}
      </Box>
    </Box>
  );
}

function StatRow({ tile }: { tile: StatTile }) {
  return (
    <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
      <Box
        sx={(theme) => ({
          width: { xs: 40, md: 44 },
          height: { xs: 40, md: 44 },
          borderRadius: "10px",
          bgcolor: theme.palette.extended[tile.toneKey].colorContainer,
          color: theme.palette.extended[tile.toneKey].color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        })}
      >
        {tile.icon}
      </Box>
      <Stack gap={0.125} sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: { xs: 20, md: 22 }, fontWeight: 700, letterSpacing: "-0.4px", color: "text.primary", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
          {tile.value}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
          {tile.label}
        </Typography>
      </Stack>
    </Stack>
  );
}

