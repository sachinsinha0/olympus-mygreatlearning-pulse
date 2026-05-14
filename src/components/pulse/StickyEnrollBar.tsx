import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import type { PulseIssue } from "../../lib/pulse/types";
import { usePulseCta } from "../../lib/pulse/cta";
import { useUnitLabel } from "../../lib/pulse/terminology";

export function StickyEnrollBar({ issue }: { issue: PulseIssue }) {
  const [show, setShow] = useState(false);
  const cta = usePulseCta(issue.courseUrl);
  const unit = useUnitLabel();
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <Box
      sx={(theme) => ({
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        bgcolor: theme.palette.surfaceContainer.highest,
        borderTop: 1,
        borderColor: theme.palette.outlineVariant.main,
        px: 3,
        py: 1.5,
        transform: show ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.24s ease",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 -8px 24px rgba(0,0,0,0.4)"
            : "0 -8px 24px rgba(0,0,0,0.06)",
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ maxWidth: 1184, mx: "auto" }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.2 }}>
            {unit.numbered(issue.issueNumber)}
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "text.primary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {issue.title}
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          endIcon={<ArrowRight size={16} />}
          onClick={cta.onClick}
          sx={{ height: 40, px: 2.5, flexShrink: 0 }}
        >
          {cta.action === "start" ? "Start" : cta.label}
        </Button>
      </Stack>
    </Box>
  );
}
