import { useState, useEffect } from "react";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import referIcon from "../../assets/refer-and-earn.png";
import interviewIcon from "../../assets/mock-interview.png";
import resumeIcon from "../../assets/resume-builder.png";
import connectIcon from "../../assets/gl-connect.png";
import pulseIcon from "../../assets/pulse-promo.png";
import data from "../../mocks/promos.json";

const ICONS: Record<string, string> = {
  "refer-and-earn": referIcon,
  "mock-interview": interviewIcon,
  "resume-builder": resumeIcon,
  "gl-connect": connectIcon,
  pulse: pulseIcon,
};

const CTA_COLORS: Record<string, { bg: string; fg: string }> = {
  warning: { bg: "#ffdcbe", fg: "#2c1600" },
  purple: { bg: "#ebddff", fg: "#250059" },
  teal: { bg: "#a1efff", fg: "#001f25" },
  primary: { bg: "#dae1ff", fg: "#001849" },
};

type Promo = {
  id: string;
  icon: string;
  chip?: string;
  headline: string;
  body: string;
  cta: string;
  ctaColor: string;
  href?: string;
};

export function ReferEarnCarousel() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const promos = data as Promo[];
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % promos.length), 5000);
    return () => clearInterval(t);
  }, [promos.length, paused]);
  const slide = promos[idx];
  const ctaColor = CTA_COLORS[slide.ctaColor] || CTA_COLORS.primary;
  return (
    <Stack gap={1.5}>
      <Card
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        sx={{ p: 2, height: 168 }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ height: "100%" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              sx={{ mb: 1, flexWrap: "wrap" }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "text.primary",
                }}
              >
                {slide.headline}
              </Typography>
              {slide.chip && (
                <Box
                  component="span"
                  sx={(theme) => ({
                    px: 1,
                    py: 0.25,
                    fontSize: 12,
                    fontWeight: 400,
                    color: theme.palette.error.contrastText,
                    bgcolor: theme.palette.error.main,
                    borderRadius: "8px",
                    letterSpacing: "-0.1px",
                    lineHeight: "16px",
                  })}
                >
                  {slide.chip}
                </Box>
              )}
            </Stack>
            <Typography sx={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "text.secondary", display: "block", mb: 2 }}>
              {slide.body}
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => slide.href && navigate(slide.href)}
              sx={{
                bgcolor: ctaColor.bg,
                color: ctaColor.fg,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.4px",
                "&:hover": { bgcolor: ctaColor.bg, opacity: 0.85 },
              }}
            >
              {slide.cta}
            </Button>
          </Box>
          <Box
            component="img"
            src={ICONS[slide.icon]}
            alt=""
            sx={{ width: 96, height: 96, flexShrink: 0, objectFit: "contain" }}
          />
        </Stack>
      </Card>

      <Stack direction="row" gap={0.75} justifyContent="center">
        {promos.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIdx(i)}
            sx={{
              height: 8,
              width: i === idx ? 24 : 8,
              borderRadius: 4,
              bgcolor: i === idx ? "primary.main" : "surfaceContainer.high",
              cursor: "pointer",
              transition: "width 0.2s",
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
