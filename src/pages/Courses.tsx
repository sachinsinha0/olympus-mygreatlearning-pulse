import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TopNav } from "../components/TopNav/TopNav";
import { CourseCard } from "../components/courses/CourseCard";
import { CourseFilters, type FilterKey } from "../components/courses/CourseFilters";
import data from "../mocks/courses.json";

type Course = {
  id: string;
  title: string;
  pattern: string;
  thumbBg: string;
  progress?: number;
  marks?: string;
  score?: string;
  atRisk?: boolean;
};

const SECTIONS: { key: FilterKey; label: string; items: Course[] }[] = [
  { key: "active", label: "Active Courses", items: data.active as Course[] },
  { key: "selfPaced", label: "Self-Paced Courses", items: data.selfPaced as Course[] },
  { key: "closed", label: "Closed Courses", items: data.closed as Course[] },
];

export function Courses() {
  const [filter, setFilter] = useState<FilterKey | null>(null);

  const counts: Record<FilterKey, number> = {
    active: data.active.length,
    selfPaced: data.selfPaced.length,
    closed: data.closed.length,
  };

  const visible = filter ? SECTIONS.filter((s) => s.key === filter) : SECTIONS;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <CourseFilters selected={filter} counts={counts} onSelect={setFilter} />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: 0, pt: 3, pb: 6 }}>
        <Stack gap={4}>
          {visible.map((section) => (
            <Stack key={section.key} gap={2}>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: "24px",
                  letterSpacing: "-0.4px",
                  color: "text.primary",
                }}
              >
                {section.label}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 2,
                }}
              >
                {section.items.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
