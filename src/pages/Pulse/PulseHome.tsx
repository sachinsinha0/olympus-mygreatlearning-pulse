import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import { TopNav } from "../../components/TopNav/TopNav";
import { ModuleListCard } from "../../components/pulse/ModuleListCard";
import { SubscribeFooter } from "../../components/pulse/SubscribeFooter";
import { PulseV2Hero } from "../../components/pulse/PulseV2Hero";
import { ExitIntentGuard } from "../../components/pulse/ExitIntentGuard";
import { isTrialExpired, usePricing } from "../../lib/pulse/pricing";
import { useHasSeenIntro } from "../../lib/pulse/onboarding";
import { useUnitLabel } from "../../lib/pulse/terminology";
import type { PulseIssue } from "../../lib/pulse/types";
import { PULSE_TODAY } from "../../lib/pulse/prototypeDate";
import issuesData from "../../mocks/pulse-issues.json";

const allIssues = issuesData as PulseIssue[];

export function PulseHome() {
  const { state, trialStartedAt, activeUntil } = usePricing();
  const navigate = useNavigate();
  const introSeen = useHasSeenIntro();
  const trialExpired = isTrialExpired(state, trialStartedAt, activeUntil);
  const isPaid = state === "paid";

  useEffect(() => {
    if (!introSeen && state === "trial" && !trialStartedAt) {
      navigate("/pulse/intro", { replace: true });
    }
  }, [introSeen, state, trialStartedAt, navigate]);

  // Newest-first everywhere: upcoming above released, and both sections sorted by
  // date descending, so the page reads as one continuous reverse timeline and the
  // freshest module is always the first thing on screen. Module numbers therefore
  // count *down* the page — the bottom card is the earliest of the visible set.
  const groups = useMemo(() => {
    const today = PULSE_TODAY;
    const byDateDesc = (a: PulseIssue, b: PulseIssue) => b.releasedAt.localeCompare(a.releasedAt);
    const released = allIssues
      .filter((i) => i.releasedAt <= today)
      .sort(byDateDesc)
      .slice(0, 2);
    const upcoming = allIssues.filter((i) => i.releasedAt > today).sort(byDateDesc);
    return { released, upcoming };
  }, []);

  const totalVisible = groups.released.length + groups.upcoming.length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <ExitIntentGuard source="pulse_home" />
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 3, pb: 6 }}>
        <PulseV2Hero />

        <Stack gap={4} sx={{ mt: 4 }}>
          {groups.upcoming.length > 0 && (
            <Stack gap={2}>
              <SectionHeader title="Upcoming Modules" />
              <Stack gap={1.5}>
                {groups.upcoming.map((issue, i) => (
                  <ModuleListCard
                    key={issue.id}
                    issue={issue}
                    status="upcoming"
                    displayNumber={totalVisible - i}
                  />
                ))}
              </Stack>
            </Stack>
          )}
          {groups.released.length > 0 && (
            <Stack id="released-modules" gap={2} sx={{ scrollMarginTop: 96 }}>
              <SectionHeader title="AI Pulse Modules" />
              <Stack gap={1.5}>
                {groups.released.map((issue, i) => (
                  <ModuleListCard
                    key={issue.id}
                    issue={issue}
                    status="released"
                    displayNumber={groups.released.length - i}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>

        {!isPaid && state !== "expired" && !trialExpired && (
          <Box sx={{ mt: { xs: 5, md: 6 } }}>
            <SubscribeFooter />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  const unit = useUnitLabel();
  const noun = count !== undefined ? (count === 1 ? unit.singular : unit.plural).toLowerCase() : "";
  return (
    <Stack direction="row" alignItems="baseline" gap={1.25} sx={{ flexWrap: "wrap" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary", letterSpacing: "-0.3px" }}>
        {title}
      </Typography>
      {count !== undefined && (
        <Typography sx={{ fontSize: 13, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
          {count} {noun}
        </Typography>
      )}
    </Stack>
  );
}
