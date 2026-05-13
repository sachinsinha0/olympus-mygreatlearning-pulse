import { useEffect, useRef, useState } from "react";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { IssueCover } from "./IssueCover";
import { formatDuration } from "../../lib/format";

export function MostPopular({ issues }: { issues: PulseIssue[] }) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [issues.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.floor(el.clientWidth * 0.75), behavior: "smooth" });
  };

  if (issues.length === 0) return null;

  return (
    <Stack gap={1.5}>
      <Stack direction="row" alignItems="baseline" gap={1.25} sx={{ flexWrap: "wrap" }}>
        <Typography
          sx={{ fontSize: 18, fontWeight: 600, color: "text.primary", letterSpacing: "-0.3px" }}
        >
          Most popular
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          What others are learning now.
        </Typography>
      </Stack>

      <Box sx={{ position: "relative" }}>
        <Box
          ref={scrollRef}
          sx={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: { xs: "minmax(220px, 60%)", sm: "minmax(220px, 45%)", md: "calc((100% - 48px) / 4)" },
            gap: 2,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {issues.map((issue) => (
            <Card
              key={issue.id}
              onClick={() => navigate(`/pulse/issue/${issue.id}`)}
              sx={{
                cursor: "pointer",
                p: 1.25,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                scrollSnapAlign: "start",
                transition: "border-color 0.18s ease",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <IssueCover issue={issue} variant="editorial" />
              <Stack gap={0.5} sx={{ pt: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "text.primary",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 36,
                  }}
                >
                  {issue.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {formatDuration(issue.durationMinutes)} · {issue.stats.weeklyReaders.toLocaleString()} learners
                </Typography>
              </Stack>
            </Card>
          ))}
        </Box>

        {canLeft && <ScrollButton dir="left" onClick={() => scrollBy(-1)} />}
        {canRight && <ScrollButton dir="right" onClick={() => scrollBy(1)} />}
      </Box>
    </Stack>
  );
}

function ScrollButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      disableRipple
      sx={(theme) => ({
        position: "absolute",
        top: "50%",
        [dir]: 8,
        transform: "translateY(-50%)",
        width: 36,
        height: 36,
        bgcolor: theme.palette.surfaceContainer.highest,
        border: 1,
        borderColor: theme.palette.outlineVariant.main,
        color: theme.palette.text.primary,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        zIndex: 2,
        "&:hover": {
          bgcolor: theme.palette.surfaceContainer.highest,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
        },
      })}
    >
      {dir === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </IconButton>
  );
}
