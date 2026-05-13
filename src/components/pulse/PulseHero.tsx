import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PulseIssue } from "../../lib/pulse/types";
import { IssueCover } from "./IssueCover";
import { formatIssueDate } from "../../lib/format";
import { usePricing } from "../../lib/pulse/pricing";

export function PulseHero({ issues }: { issues: PulseIssue[] }) {
  const navigate = useNavigate();
  const { state, trialStartedAt, startTrial } = usePricing();
  const latest = issues[0];
  const stack = issues.slice(0, 3);
  const releaseLabel = latest ? String(latest.issueNumber).padStart(2, "0") : "01";
  const isPreTrial = state === "trial" && !trialStartedAt;
  const heroCtaLabel = isPreTrial ? "Start 7-day trial" : "Start";
  const onHeroCta = () => {
    if (isPreTrial) {
      startTrial();
      return;
    }
    if (latest) navigate(`/pulse/issue/${latest.id}`);
  };

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        p: { xs: 3, md: 3 },
        background: `linear-gradient(168deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 65%, ${theme.palette.primary.dark} 100%)`,
        color: theme.palette.primary.contrastText,
        border: `1px solid ${theme.palette.primary.dark}`,
      })}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
          gap: { xs: 3, md: 5 },
          alignItems: "center",
          pt: { xs: 1, md: 1 },
        }}
      >
        <Stack gap={1.75}>
          <Typography
            component="h1"
            sx={(theme) => ({
              fontSize: { xs: 26, md: 34 },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              color: theme.palette.primary.contrastText,
            })}
          >
            Ship AI faster
            <Box component="span" sx={{ display: "block", opacity: 0.85 }}>
              than the field moves.
            </Box>
          </Typography>

          <Box
            sx={(theme) => ({
              fontSize: 14,
              lineHeight: 1.55,
              opacity: 0.9,
              maxWidth: 520,
              color: theme.palette.primary.contrastText,
            })}
          >
            A biweekly hands-on lab. Every release: one important AI
            development, one working build, one thing you can use at work
            tomorrow.
          </Box>

          <Stack direction="row" gap={1.5} alignItems="center" sx={{ mt: 0, flexWrap: "wrap" }}>
            {latest && (
              <Button
                variant="contained"
                disableElevation
                endIcon={<ArrowRight size={16} />}
                onClick={onHeroCta}
                sx={(theme) => ({
                  bgcolor: theme.palette.primary.contrastText,
                  color: theme.palette.primary.dark,
                  height: 38,
                  px: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  "&:hover": { bgcolor: theme.palette.surfaceContainer.highest },
                })}
              >
                {heroCtaLabel}
              </Button>
            )}
            <Typography
              sx={(theme) => ({
                fontSize: 13,
                color: theme.palette.primary.contrastText,
                opacity: 0.75,
              })}
            >
              {isPreTrial
                ? "No card required. Cancel anytime."
                : latest
                ? `Latest · Release ${releaseLabel} · ${formatIssueDate(latest.releasedAt)}`
                : "A new release every two weeks"}
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            position: "relative",
            display: { xs: "none", md: "block" },
            minHeight: 210,
          }}
        >
          {stack.map((issue, i) => (
            <Box
              key={issue.id}
              sx={{
                position: "absolute",
                top: i === 0 ? 0 : i === 1 ? 32 : 64,
                left: i === 0 ? 90 : i === 1 ? 55 : 20,
                right: i === 0 ? 20 : i === 1 ? 55 : 90,
                transform: `rotate(${i === 0 ? 3 : i === 1 ? -1.5 : -4}deg)`,
                zIndex: 3 - i,
                boxShadow:
                  i === 0
                    ? "0 18px 40px rgba(0,0,0,0.45)"
                    : i === 1
                    ? "0 12px 28px rgba(0,0,0,0.35)"
                    : "0 8px 20px rgba(0,0,0,0.25)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "transform 0.3s ease",
              }}
            >
              <IssueCover issue={issue} variant="editorial" />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
