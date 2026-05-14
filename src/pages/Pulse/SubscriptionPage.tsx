import { useMemo, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { Activity, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "../../components/TopNav/TopNav";
import { usePricing } from "../../lib/pulse/pricing";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
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
  const navigate = useNavigate();
  const { state, activeUntil, setState } = usePricing();
  const { hasStarted, hasCompleted } = useLearningProgress();
  const [cancelOpen, setCancelOpen] = useState(false);

  const isPaid = state === "paid";
  const planLabel = "Annual";

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
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

  const onCancel = () => {
    setState("expired");
    setCancelOpen(false);
    navigate("/pulse");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 640, mx: "auto", pt: 3, pb: 6 }}>
        {isPaid ? (
          <Stack gap={2}>
            <PlanHeroCard
              planLabel={planLabel}
              renewsOn={activeUntil}
            />
            <LearningJourneyCard stats={stats} />
            <CancelRow onCancel={() => setCancelOpen(true)} />
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

      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>
          Cancel subscription?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.5 }}>
            Your access ends on {formatDate(activeUntil)}. After that, your archive is locked and you'll miss the new module dropping every two weeks.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCancelOpen(false)} sx={{ textTransform: "none", fontWeight: 500 }}>
            Keep subscription
          </Button>
          <Button
            onClick={onCancel}
            variant="outlined"
            color="error"
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function PlanHeroCard({
  planLabel,
  renewsOn,
}: {
  planLabel: string;
  renewsOn: string | null;
}) {
  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        borderRadius: "12px",
        bgcolor: theme.palette.background.paper,
        p: 3,
      })}
    >
      <Stack direction="row" gap={2.5} alignItems="flex-start">
        <Box
          sx={(theme) => ({
            width: 56,
            height: 56,
            borderRadius: "12px",
            bgcolor: theme.palette.extended.deepOrange.colorContainer,
            color: theme.palette.extended.deepOrange.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          })}
        >
          <Sparkles size={26} strokeWidth={2} />
        </Box>
        <Stack gap={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              alignSelf: "flex-start",
              px: 1,
              py: 0.375,
              borderRadius: "8px",
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.main,
            })}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.2px" }}>
              Active
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", color: "text.primary", mt: 0.5 }}>
            Pulse · {planLabel}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
            Membership till {formatDate(renewsOn)}
          </Typography>
        </Stack>
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
    { label: "Modules Completed", value: stats.modulesCompleted, icon: <CheckCircle2 size={20} strokeWidth={2} />, toneKey: "teal" },
    { label: "In Progress", value: stats.modulesInProgress, icon: <Activity size={20} strokeWidth={2} />, toneKey: "purple" },
    { label: "Hands-on Demos Completed", value: stats.demosCompleted, icon: <Sparkles size={20} strokeWidth={2} />, toneKey: "deepOrange" },
  ];

  return (
    <Box
      sx={(theme) => ({
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        borderRadius: "12px",
        bgcolor: theme.palette.background.paper,
        p: 3,
      })}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px", mb: 2 }}>
        Your Pulse Learning journey
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
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
    <Stack direction="row" alignItems="center" gap={1.5}>
      <Box
        sx={(theme) => ({
          width: 44,
          height: 44,
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
      <Stack gap={0.125}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px", color: "text.primary", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
          {tile.value}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", letterSpacing: "-0.2px" }}>
          {tile.label}
        </Typography>
      </Stack>
    </Stack>
  );
}

function CancelRow({ onCancel }: { onCancel: () => void }) {
  return (
    <Box sx={{ mt: 1, textAlign: "center" }}>
      <Box
        component="button"
        onClick={onCancel}
        sx={(theme) => ({
          background: "none",
          border: "none",
          p: 0,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          letterSpacing: "-0.2px",
          "&:hover": { color: theme.palette.error.main, textDecoration: "underline" },
        })}
      >
        Cancel subscription
      </Box>
    </Box>
  );
}
