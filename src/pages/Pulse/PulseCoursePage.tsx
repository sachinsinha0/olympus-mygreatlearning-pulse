import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Bell, BookOpen, Play, PlayCircle } from "lucide-react";
import { TopNav } from "../../components/TopNav/TopNav";
import { SectionAccordion, type OrderedItem } from "../../components/courses/SectionAccordion";
import type { PulseIssue } from "../../lib/pulse/types";
import issuesData from "../../mocks/pulse-issues.json";
import detail from "../../mocks/pulseCourseDetail.json";
import pattern9 from "../../assets/patterns/pattern9.svg";

const TABS = ["Learning", "Notes"];

const allIssues = issuesData as PulseIssue[];

export function PulseCoursePage() {
  const [params] = useSearchParams();
  const moduleId = params.get("module");
  const [tab, setTab] = useState(0);

  // Same 4 module order used on the home grouped grid.
  const modulesOrder = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const released = allIssues
      .filter((i) => i.releasedAt <= today)
      .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt))
      .slice(0, 2);
    const upcoming = allIssues
      .filter((i) => i.releasedAt > today)
      .sort((a, b) => a.releasedAt.localeCompare(b.releasedAt))
      .slice(0, 2);
    return [...released, ...upcoming];
  }, []);

  // Map ?module=pulse-X to its display index → section index.
  const expandedIndex =
    modulesOrder.findIndex((m) => m.id === moduleId) >= 0
      ? modulesOrder.findIndex((m) => m.id === moduleId)
      : 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: 0, pt: 3, pb: 6 }}>
        <Card sx={{ p: 4, bgcolor: "surfaceContainer.highest", boxShadow: "none", borderRadius: "8px" }}>
          <Stack direction="row" gap={3} alignItems="flex-start" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 144,
                height: 144,
                borderRadius: "8px",
                bgcolor: "#7fb3b3",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Box component="img" src={pattern9} alt="" sx={{ width: 144, height: 144 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: "32px",
                  letterSpacing: "-0.4px",
                  color: "text.primary",
                  mb: 1.5,
                }}
              >
                Pulse
              </Typography>
              <Stack direction="row" alignItems="center" gap={1.5} sx={{ color: "text.secondary", mb: 1.5 }}>
                <Stack direction="row" alignItems="center" gap={0.75}>
                  <PlayCircle size={16} />
                  <Typography sx={{ fontSize: 13, letterSpacing: "-0.2px" }}>
                    {detail.videosCompleted} / {detail.videosTotal} Videos Completed
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 13 }}>·</Typography>
                <Stack direction="row" alignItems="center" gap={0.75}>
                  <BookOpen size={16} />
                  <Typography sx={{ fontSize: 13, letterSpacing: "-0.2px" }}>
                    {detail.resourcesViewed} / {detail.resourcesTotal} Resources Viewed
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: "outlineVariant.main",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={(theme) => ({
                      width: `${detail.progress}%`,
                      height: "100%",
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 2,
                    })}
                  />
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
                  {detail.progress}%
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                startIcon={<Bell size={16} />}
                sx={{
                  height: 36,
                  px: 2,
                  borderColor: "outlineVariant.main",
                  color: "primary.main",
                  fontSize: 14,
                  fontWeight: 500,
                  "&:hover": { borderColor: "primary.main", bgcolor: "primary.light" },
                }}
              >
                Announcements
              </Button>
            </Box>
          </Stack>

          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: "8px",
              bgcolor: theme.palette.primary.light,
              mb: 3,
            })}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 1,
              }}
            >
              Resume Where You Left
            </Typography>
            <Stack direction="row" alignItems="center" gap={2}>
              <Box sx={{ color: "text.primary", display: "flex" }}>
                <PlayCircle size={28} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
                  {detail.resume.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px", mt: 0.25 }}>
                  {detail.resume.timeLeft}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Play size={16} fill="currentColor" />}
                sx={{
                  height: 40,
                  px: 3,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "primary.main", boxShadow: "none", opacity: 0.92 },
                }}
              >
                Resume
              </Button>
            </Stack>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              borderBottom: 1,
              borderColor: "outlineVariant.main",
              mb: 3,
              minHeight: 48,
              "& .MuiTab-root": {
                minHeight: 48,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.2px",
                color: "text.primary",
                textTransform: "none",
              },
              "& .MuiTab-root.Mui-selected": { color: "primary.main" },
              "& .MuiTabs-indicator": { backgroundColor: "primary.main", height: 3, borderRadius: "2px 2px 0 0" },
            }}
          >
            {TABS.map((label) => (
              <Tab key={label} label={label} disableRipple />
            ))}
          </Tabs>

          {tab === 0 && (
            <Stack gap={1.5}>
              {modulesOrder.map((module, i) => {
                const s = detail.sections[i];
                const isUpcoming = i >= 2;
                const label = `Module ${i + 1}: ${module.title}`;
                return (
                  <SectionAccordion
                    key={module.id}
                    label={label}
                    videosCount={s?.videosCount ?? 0}
                    resourcesCount={s?.resourcesCount ?? 0}
                    progress={isUpcoming ? 0 : s?.progress ?? 0}
                    expandedDefault={!isUpcoming && i === expandedIndex}
                    items={(s as { items?: OrderedItem[] } | undefined)?.items}
                    highlightedId={detail.resume.itemId}
                    locked={isUpcoming}
                  />
                );
              })}
            </Stack>
          )}
          {tab > 0 && (
            <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
              <Typography sx={{ fontSize: 14 }}>{TABS[tab]} coming soon.</Typography>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
}
