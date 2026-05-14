import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ArrowLeft, Bell, BookOpen, PlayCircle, Play } from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { SectionAccordion } from "../components/courses/SectionAccordion";
import courses from "../mocks/courses.json";
import detail from "../mocks/courseDetail.json";
import pattern1 from "../assets/patterns/pattern1.svg";
import pattern9 from "../assets/patterns/pattern9.svg";

const PATTERNS: Record<string, string> = { pattern1, pattern9 };

type CourseLike = {
  id: string;
  title: string;
  pattern: string;
  thumbBg: string;
  progress?: number;
};

function findCourse(id: string | undefined): CourseLike {
  const all: CourseLike[] = [...courses.active, ...courses.selfPaced, ...courses.closed];
  return all.find((c) => c.id === id) || all[0];
}

const TABS = ["Learning", "Mandatory Assessments", "Recordings", "Groups", "Notes"];

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = findCourse(id);
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 3, pb: 6 }}>
        <Stack
          direction="row"
          alignItems="center"
          gap={0.75}
          onClick={() => navigate("/courses")}
          sx={{
            mb: 2,
            cursor: "pointer",
            color: "text.secondary",
            width: "fit-content",
            "&:hover": { color: "primary.main" },
          }}
        >
          <ArrowLeft size={16} />
          <Typography sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.2px" }}>
            Back to Courses
          </Typography>
        </Stack>
        <Card sx={{ p: { xs: 2.5, md: 4 }, bgcolor: "surfaceContainer.highest", boxShadow: "none", borderRadius: "8px" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={{ xs: 2, md: 3 }}
            alignItems={{ xs: "stretch", sm: "flex-start" }}
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: { xs: 96, sm: 112, md: 144 },
                height: { xs: 96, sm: 112, md: 144 },
                borderRadius: "8px",
                bgcolor: course.thumbBg,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={PATTERNS[course.pattern] || pattern1}
                alt=""
                sx={{ width: "100%", height: "100%" }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
              <Typography
                sx={{
                  fontSize: { xs: 22, md: 24 },
                  fontWeight: 700,
                  lineHeight: "32px",
                  letterSpacing: "-0.4px",
                  color: "text.primary",
                  mb: 1.5,
                }}
              >
                {course.title}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={{ xs: 0.5, sm: 1.5 }}
                sx={{ color: "text.secondary", mb: 1.5, flexWrap: "wrap" }}
              >
                <Stack direction="row" alignItems="center" gap={0.75}>
                  <PlayCircle size={16} />
                  <Typography sx={{ fontSize: 13, letterSpacing: "-0.2px" }}>
                    {detail.videosCompleted} / {detail.videosTotal} Videos Completed
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 13, display: { xs: "none", sm: "block" } }}>·</Typography>
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={{ xs: 1.5, sm: 2 }}
            >
              <Stack direction="row" alignItems="center" gap={2} sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ color: "text.primary", display: "flex", flexShrink: 0 }}>
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
              </Stack>
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
                  whiteSpace: "nowrap",
                  alignSelf: { xs: "flex-start", sm: "center" },
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
            variant="scrollable"
            scrollButtons={false}
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
              {detail.sections.map((s) => (
                <SectionAccordion
                  key={s.id}
                  label={s.label}
                  videosCount={s.videosCount}
                  resourcesCount={s.resourcesCount}
                  progress={s.progress}
                  expandedDefault={s.expandedDefault}
                  videos={s.videos}
                  presentations={s.presentations}
                  readings={s.readings}
                  highlightedId={detail.resume.itemId}
                />
              ))}
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
