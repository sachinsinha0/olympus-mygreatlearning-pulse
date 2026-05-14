import { Box, Button, Stack, Typography } from "@mui/material";
import { BookOpen, Play } from "lucide-react";

/**
 * Mobile sticky bottom action bar for the Pulse course page.
 * Mirrors the Olympus mobile course-detail pattern: a primary-light strip
 * with a secondary "Course Outline" link on the left and a primary "Resume"
 * button on the right. Hidden at `lg` and above where the page-body Resume
 * strip is already visible.
 */
export function CourseStickyBar({
  resumeTitle,
  onResume,
}: {
  resumeTitle?: string;
  onResume?: () => void;
}) {
  const scrollToModules = () => {
    const target = document.getElementById("course-modules");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      sx={(theme) => ({
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        display: { xs: "block", lg: "none" },
        bgcolor: theme.palette.primary.light,
        borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
        px: { xs: 2, sm: 3 },
        py: 1.25,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 -6px 24px rgba(0,0,0,0.4)"
            : "0 -6px 24px rgba(15, 23, 42, 0.06)",
      })}
    >
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ maxWidth: 720, mx: "auto" }}>
        <Stack
          component="button"
          onClick={scrollToModules}
          direction="row"
          alignItems="center"
          gap={0.75}
          sx={(theme) => ({
            background: "none",
            border: "none",
            p: 0.5,
            cursor: "pointer",
            color: theme.palette.text.primary,
            fontFamily: "inherit",
            flexShrink: 0,
            "&:hover": { color: theme.palette.primary.main },
          })}
        >
          <BookOpen size={16} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.2px" }}>
            Course Outline
          </Typography>
        </Stack>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {resumeTitle && (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "text.secondary",
                letterSpacing: "-0.2px",
                textAlign: "right",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {resumeTitle}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Play size={14} fill="currentColor" />}
          onClick={onResume}
          sx={{
            height: 40,
            px: 2.25,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.2px",
            whiteSpace: "nowrap",
            borderRadius: "8px",
            textTransform: "none",
            flexShrink: 0,
          }}
        >
          Resume
        </Button>
      </Stack>
    </Box>
  );
}
