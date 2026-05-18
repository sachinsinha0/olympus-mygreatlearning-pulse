import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Box, Button, Card, IconButton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import referIcon from "../../assets/refer-and-earn.png";
import interviewIcon from "../../assets/mock-interview.png";
import resumeIcon from "../../assets/resume-builder.png";
import connectIcon from "../../assets/gl-connect.png";
import pulseIcon from "../../assets/pulse-home-asset.png";
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

const SLIDE_GAP = 16;
const SLIDE_DURATION_MS = 8000;

export function ReferEarnCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const promos = data as Promo[];

  const next = () => setIdx((i) => (i + 1) % promos.length);
  const prev = () => setIdx((i) => (i - 1 + promos.length) % promos.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, SLIDE_DURATION_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promos.length, paused]);

  // Measure viewport width so each slide can be sized in px and we can translate by
  // exactly (slideWidth + gap) per step — leaving the 16px gap visible during the slide.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setSlideWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Stack gap={1}>
      <Box
        ref={viewportRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        sx={{ overflow: "hidden" }}
      >
        <Box
          sx={{
            display: "flex",
            transform: `translateX(${-idx * (slideWidth + SLIDE_GAP)}px)`,
            transition: "transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          {promos.map((slide, i) => (
            <Box
              key={slide.id}
              sx={{
                flex: `0 0 ${slideWidth}px`,
                minWidth: 0,
                mr: i < promos.length - 1 ? `${SLIDE_GAP}px` : 0,
              }}
            >
              <PromoCard slide={slide} />
            </Box>
          ))}
        </Box>
      </Box>

      <Stack direction="row" gap={1} alignItems="center" justifyContent="center">
        <IconButton
          onClick={prev}
          disableRipple
          aria-label="Previous slide"
          sx={(theme) => ({
            width: 28,
            height: 28,
            borderRadius: "8px",
            color: theme.palette.text.secondary,
            transition: "background-color 0.18s ease, color 0.18s ease",
            "&:hover": {
              color: theme.palette.primary.main,
              bgcolor: theme.palette.primary.light,
            },
          })}
        >
          <ChevronLeft size={18} />
        </IconButton>
        <Stack direction="row" gap={0.75} alignItems="center">
          {promos.map((_, i) => {
            const isActive = i === idx;
            return (
              <Box
                key={i}
                onClick={() => setIdx(i)}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  height: 8,
                  width: isActive ? 40 : 8,
                  borderRadius: 4,
                  bgcolor: "surfaceContainer.high",
                  cursor: "pointer",
                  transition: "width 0.25s ease",
                }}
              >
                {isActive && (
                  <Box
                    key={idx}
                    sx={(theme) => ({
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: 0,
                      bgcolor: theme.palette.primary.main,
                      animation: `pulseFill ${SLIDE_DURATION_MS}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                      "@keyframes pulseFill": {
                        from: { width: 0 },
                        to: { width: "100%" },
                      },
                    })}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
        <IconButton
          onClick={next}
          disableRipple
          aria-label="Next slide"
          sx={(theme) => ({
            width: 28,
            height: 28,
            borderRadius: "8px",
            color: theme.palette.text.secondary,
            transition: "background-color 0.18s ease, color 0.18s ease",
            "&:hover": {
              color: theme.palette.primary.main,
              bgcolor: theme.palette.primary.light,
            },
          })}
        >
          <ChevronRight size={18} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

function PromoCard({ slide }: { slide: Promo }) {
  const navigate = useNavigate();
  const ctaColor = CTA_COLORS[slide.ctaColor] || CTA_COLORS.primary;
  return (
    <Card sx={{ p: 2, height: 210 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ height: "100%" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: "text.primary",
                minWidth: 0,
                flex: 1,
              }}
            >
              {slide.headline}
            </Typography>
            {slide.chip && (
              <Box
                component="span"
                sx={(theme) => ({
                  flexShrink: 0,
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
          sx={{ width: 140, height: 140, flexShrink: 0, objectFit: "contain" }}
        />
      </Stack>
    </Card>
  );
}
