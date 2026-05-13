import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TopNav } from "../../components/TopNav/TopNav";
import { PulseHero } from "../../components/pulse/PulseHero";
import { PulseAtAGlance } from "../../components/pulse/PulseAtAGlance";
import { PaidHero } from "../../components/pulse/PaidHero";
import { SubscriptionCard } from "../../components/pulse/SubscriptionCard";
import { ConversionBanner } from "../../components/pulse/ConversionBanner";
import { BrowseControls, type SortKey } from "../../components/pulse/BrowseControls";
import { MostPopular } from "../../components/pulse/MostPopular";
import { FeaturedIssueCard } from "../../components/pulse/FeaturedIssueCard";
import { IssueCard } from "../../components/pulse/IssueCard";
import { usePricing } from "../../lib/pulse/pricing";
import { useRelease, V1_ISSUE_LIMIT } from "../../lib/pulse/release";
import type { PulseIssue, TopicTag } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";

const allIssues = issuesData as PulseIssue[];

function sortIssues(list: PulseIssue[], sort: SortKey): PulseIssue[] {
  const copy = [...list];
  if (sort === "latest") {
    copy.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
  } else if (sort === "popular") {
    copy.sort((a, b) => b.stats.completionCount - a.stats.completionCount);
  } else {
    copy.sort((a, b) => b.stats.ratingAvg - a.stats.ratingAvg);
  }
  return copy;
}

export function PulseHome() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<TopicTag | "all">("all");
  const [sort, setSort] = useState<SortKey>("latest");
  const { state, trialStartedAt } = usePricing();
  const { release } = useRelease();
  const isV1 = release === "v1";

  const issues = useMemo(() => {
    if (!isV1) return allIssues;
    return [...allIssues]
      .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt))
      .slice(0, V1_ISSUE_LIMIT);
  }, [isV1]);

  const mostPopular = useMemo(
    () =>
      isV1
        ? []
        : [...issues]
            .sort((a, b) => b.stats.weeklyReaders - a.stats.weeklyReaders)
            .slice(0, 6),
    [issues, isV1],
  );

  const recent = useMemo(
    () => [...issues].sort((a, b) => b.releasedAt.localeCompare(a.releasedAt)),
    [issues],
  );

  const thisWeek = useMemo(() => recent.find((i) => !i.consumed) || recent[0], [recent]);
  const inProgress = useMemo(
    () => recent.find((i) => i.consumed && (i.progress ?? 0) > 0 && (i.progress ?? 0) < 100),
    [recent],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = issues;
    if (tag !== "all") list = list.filter((i) => i.tags.includes(tag));
    if (q) {
      list = list.filter((i) => {
        return (
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }
    return sortIssues(list, sort);
  }, [issues, query, tag, sort]);

  // Layout flags
  const isPreTrial = state === "trial" && !trialStartedAt;
  const isTrialActive = state === "trial" && !!trialStartedAt;
  const isPaid = state === "paid";
  // Trial-active + Expired both use Paid layout
  const usePaidLayout = !isPreTrial;
  // Hide "Continue where you left" for trial-active (first-time experience)
  const heroInProgress = isTrialActive ? undefined : inProgress;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", pt: 3, pb: 6 }}>
        {/* Top banner — every state except Paid */}
        {!isPaid && (
          <Box sx={{ mb: 2.5 }}>
            <ConversionBanner />
          </Box>
        )}

        {/* Hero — PaidHero for trial-active/paid/expired, PulseHero for pre-trial */}
        {usePaidLayout ? (
          <PaidHero thisWeek={thisWeek} inProgress={heroInProgress} />
        ) : (
          <PulseHero issues={recent} />
        )}

        {/* SubscriptionCard — Paid only */}
        {isPaid && (
          <Box sx={{ mt: 2.5 }}>
            <SubscriptionCard variant="active" />
          </Box>
        )}

        {/* PulseAtAGlance — pre-trial only (still discovering the product) */}
        {isPreTrial && (
          <Box sx={{ mt: 4 }}>
            <PulseAtAGlance />
          </Box>
        )}

        {mostPopular.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <MostPopular issues={mostPopular} />
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <BrowseControls
            query={query}
            onQuery={setQuery}
            activeTag={tag}
            onTag={setTag}
            sort={sort}
            onSort={setSort}
          />
        </Box>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : usePaidLayout ? (
          <PaidGrid filtered={filtered} />
        ) : (
          <DefaultGrid filtered={filtered} />
        )}
      </Box>
    </Box>
  );
}

function EmptyState() {
  return (
    <Box
      sx={(theme) => ({
        mt: 4,
        p: 5,
        textAlign: "center",
        bgcolor: "surfaceContainer.lowest",
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        borderRadius: "12px",
      })}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 0.5 }}>
        No releases match this filter
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
        Try a different topic or clear your search.
      </Typography>
    </Box>
  );
}

function DefaultGrid({ filtered }: { filtered: PulseIssue[] }) {
  const [featured, ...rest] = filtered;
  return (
    <Stack gap={3} sx={{ mt: 3 }}>
      {featured && <FeaturedIssueCard issue={featured} />}
      {rest.length > 0 && (
        <Stack gap={2.5}>
          <SectionHeader title="From earlier" count={rest.length} />
          <IssueGrid issues={rest} />
        </Stack>
      )}
    </Stack>
  );
}

function PaidGrid({ filtered }: { filtered: PulseIssue[] }) {
  const newForYou = filtered.filter((i) => !i.consumed);
  const explored = filtered.filter((i) => i.consumed);
  return (
    <Stack gap={4} sx={{ mt: 3 }}>
      {newForYou.length > 0 && (
        <Stack gap={2}>
          <SectionHeader title="New for you" count={newForYou.length} />
          <IssueGrid issues={newForYou} />
        </Stack>
      )}
      {explored.length > 0 && (
        <Stack gap={2}>
          <SectionHeader title="Already explored" count={explored.length} />
          <IssueGrid issues={explored} />
        </Stack>
      )}
    </Stack>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <Stack direction="row" alignItems="baseline" gap={1.25} sx={{ flexWrap: "wrap" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary", letterSpacing: "-0.3px" }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
        {count} release{count > 1 ? "s" : ""}
      </Typography>
    </Stack>
  );
}

function IssueGrid({ issues }: { issues: PulseIssue[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 2,
      }}
    >
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </Box>
  );
}
