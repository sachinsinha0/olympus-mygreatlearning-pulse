import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TopNav } from "../../components/TopNav/TopNav";
import { ModuleListCard } from "../../components/pulse/ModuleListCard";
import { SubscribeFooter } from "../../components/pulse/SubscribeFooter";
import { PulseV2Hero } from "../../components/pulse/PulseV2Hero";
import { isTrialExpired, usePricing } from "../../lib/pulse/pricing";
import { useUnitLabel } from "../../lib/pulse/terminology";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

const allIssues = issuesData as PulseIssue[];

export function PulseHome() {
  const { state, trialStartedAt, activeUntil } = usePricing();
  const trialExpired = isTrialExpired(state, trialStartedAt, activeUntil);
  const isPaid = state === "paid";

  const groups = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const released = allIssues
      .filter((i) => i.releasedAt <= today)
      .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt))
      .slice(0, 2);
    const upcoming = allIssues
      .filter((i) => i.releasedAt > today)
      .sort((a, b) => a.releasedAt.localeCompare(b.releasedAt));
    return { released, upcoming };
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 3, pb: 6 }}>
        <PulseV2Hero />

        <Stack gap={4} sx={{ mt: 4 }}>
          {groups.released.length > 0 && (
            <Stack id="released-modules" gap={2} sx={{ scrollMarginTop: 96 }}>
              <SectionHeader title="AI Pulse Modules" count={groups.released.length} />
              <Stack gap={1.5}>
                {groups.released.map((issue, i) => (
                  <ModuleListCard
                    key={issue.id}
                    issue={issue}
                    status="released"
                    displayNumber={i + 1}
                  />
                ))}
              </Stack>
            </Stack>
          )}
          {groups.upcoming.length > 0 && (
            <Stack gap={2}>
              <SectionHeader title="Upcoming Modules" />
              <Stack gap={1.5}>
                {groups.upcoming.map((issue, i) => (
                  <ModuleListCard
                    key={issue.id}
                    issue={issue}
                    status="upcoming"
                    displayNumber={groups.released.length + i + 1}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>

        {!isPaid && (
          <Box
            sx={{
              mt: { xs: 5, md: 6 },
              display: {
                xs: state === "expired" || trialExpired ? "none" : "block",
                md: "block",
              },
            }}
          >
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
