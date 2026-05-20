import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography, keyframes } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { TopNav } from "../../components/TopNav/TopNav";
import { usePricing } from "../../lib/pulse/pricing";
import { markIntroSeen } from "../../lib/pulse/onboarding";
import { usePageLoader } from "../../components/common/PageLoader";

const SLIDE_COUNT = 3;

const TICKER_ITEMS = [
  "Claude Sonnet 4.6",
  "GPT-5",
  "Gemini 2.5 Pro",
  "Cursor 1.0",
  "o1",
  "Claude Opus 4.7",
  "Anthropic API",
  "ChatGPT Atlas",
  "Cowork",
  "Gemma Slide",
  "Notion AI",
  "Perplexity Pro",
];

const enterUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const enterScale = keyframes`
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
`;

const marqueeScroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  visual: (active: boolean) => React.ReactNode;
};

export function PulseIntroPage() {
  const { state, trialStartedAt } = usePricing();
  const navigate = useNavigate();
  const { runWithPageLoader } = usePageLoader();

  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const eligible = state === "trial" && !trialStartedAt;

  const slides: Slide[] = useMemo(
    () => [
      {
        eyebrow: "WELCOME TO AI PULSE",
        title: "Your AI learning channel.",
        body: "Learn the new AI tools and how people are using them at work.",
        visual: (active) => <TickerVisual active={active} />,
      },
      {
        eyebrow: "EVERY TWO WEEKS",
        title: "26 modules a year.",
        body: "A new module every two weeks. 30 to 60 minutes each. Short enough to fit your day, deep enough to leave you with something usable.",
        visual: (active) => <NumeralVisual active={active} />,
      },
      {
        eyebrow: "INSIDE EVERY MODULE",
        title: "New tools · Real examples\nUse at work",
        body: "We show you new AI tools from OpenAI, Anthropic, Google and more, with real examples you can use at work.",
        visual: (active) => <PillarsVisual active={active} />,
      },
    ],
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, SLIDE_COUNT - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!eligible) {
    return <Navigate to="/pulse" replace />;
  }

  const isLast = index === SLIDE_COUNT - 1;

  const onPrimary = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    markIntroSeen();
    runWithPageLoader(() => navigate("/pulse", { replace: true }), 700);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 60) return;
    if (delta < 0) setIndex((i) => Math.min(i + 1, SLIDE_COUNT - 1));
    else setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Stacked slides — cross-fade between them */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 8 },
          }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <Box
                key={i}
                aria-hidden={!active}
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: { xs: 3, md: 6 },
                  py: { xs: 5, md: 8 },
                  opacity: active ? 1 : 0,
                  pointerEvents: active ? "auto" : "none",
                  transition: "opacity 360ms ease",
                }}
              >
                <SlideContent slide={slide} active={active} />
              </Box>
            );
          })}
        </Box>

        {/* Bottom chrome */}
        <Stack
          alignItems="center"
          gap={3}
          sx={{
            position: "relative",
            zIndex: 2,
            px: { xs: 3, md: 6 },
            pb: { xs: 5, md: 6 },
            pt: { xs: 2, md: 3 },
          }}
        >
          <ProgressDots count={SLIDE_COUNT} active={index} />
          <Button
            variant="contained"
            disableElevation
            endIcon={<ArrowRight size={18} />}
            onClick={onPrimary}
            sx={(theme) => ({
              height: 52,
              px: 4,
              minWidth: { xs: "100%", sm: 220 },
              width: { xs: "100%", sm: "auto" },
              maxWidth: 360,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.2px",
              textTransform: "none",
              borderRadius: "999px",
              bgcolor: theme.palette.text.primary,
              color: theme.palette.background.default,
              boxShadow: "none",
              "&:hover": {
                bgcolor: theme.palette.text.primary,
                filter: "brightness(1.1)",
                boxShadow: "none",
              },
            })}
          >
            {isLast ? "Explore AI Pulse" : "Continue"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function SlideContent({ slide, active }: { slide: Slide; active: boolean }) {
  const titleLines = slide.title.split("\n").map((line) => line.split(" "));
  const totalWords = titleLines.reduce((n, line) => n + line.length, 0);
  return (
    <Stack
      alignItems="center"
      gap={{ xs: 3, md: 4 }}
      sx={{
        width: "100%",
        maxWidth: 880,
        mx: "auto",
        textAlign: "center",
      }}
    >
      {active && (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            color: "primary.main",
            animation: `${enterUp} 500ms ease both`,
            animationDelay: "60ms",
          }}
        >
          {slide.eyebrow}
        </Typography>
      )}
      {active && (
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 34, md: 56 },
            fontWeight: 700,
            lineHeight: { xs: "40px", md: "62px" },
            letterSpacing: { xs: "-0.8px", md: "-1.4px" },
            color: "text.primary",
            textWrap: "balance",
          }}
        >
          {titleLines.map((words, lineIdx) => {
            const wordsBefore = titleLines.slice(0, lineIdx).reduce((n, l) => n + l.length, 0);
            return (
              <Box
                key={lineIdx}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0.25em",
                }}
              >
                {words.map((word, i) => (
                  <Box
                    component="span"
                    key={i}
                    sx={{
                      display: "inline-block",
                      animation: `${enterUp} 600ms cubic-bezier(0.22, 0.61, 0.36, 1) both`,
                      animationDelay: `${160 + (wordsBefore + i) * 70}ms`,
                    }}
                  >
                    {word}
                  </Box>
                ))}
              </Box>
            );
          })}
        </Typography>
      )}
      {active && (
        <Typography
          sx={{
            fontSize: { xs: 16, md: 18 },
            lineHeight: { xs: "24px", md: "28px" },
            letterSpacing: "-0.2px",
            color: "text.secondary",
            maxWidth: 560,
            animation: `${enterUp} 600ms ease both`,
            animationDelay: `${200 + totalWords * 70}ms`,
          }}
        >
          {slide.body}
        </Typography>
      )}
      {active && (
        <Box
          sx={{
            mt: { xs: 2, md: 3 },
            width: "100%",
            display: "flex",
            justifyContent: "center",
            animation: `${enterScale} 700ms cubic-bezier(0.22, 0.61, 0.36, 1) both`,
            animationDelay: `${280 + totalWords * 70}ms`,
          }}
        >
          {slide.visual(active)}
        </Box>
      )}
    </Stack>
  );
}

function ProgressDots({ count, active }: { count: number; active: number }) {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <Box
            key={i}
            sx={(theme) => ({
              width: isActive ? 28 : 6,
              height: 6,
              borderRadius: 999,
              bgcolor: isActive || isPast ? theme.palette.text.primary : theme.palette.outlineVariant.main,
              transition: "width 320ms ease, background-color 320ms ease",
            })}
          />
        );
      })}
    </Stack>
  );
}

function TickerVisual({ active }: { active: boolean }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        maxWidth: 720,
        position: "relative",
        py: 1,
        overflow: "hidden",
        // Fade edges via mask so items dissolve in/out instead of hard-cutting.
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        borderTop: `1px solid ${theme.palette.outlineVariant.main}`,
        borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
      })}
    >
      <Stack
        direction="row"
        gap={4}
        sx={{
          width: "max-content",
          animation: active ? `${marqueeScroll} 40s linear infinite` : "none",
        }}
      >
        {items.map((label, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.4px",
              color: "text.secondary",
              whiteSpace: "nowrap",
              py: 1.25,
            }}
          >
            {label}
            <Box
              component="span"
              sx={{
                ml: 4,
                color: "primary.main",
                fontWeight: 700,
              }}
            >
              ·
            </Box>
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function NumeralVisual({ active: _active }: { active: boolean }) {
  return (
    <Stack alignItems="center" gap={1.5}>
      <Typography
        sx={{
          fontSize: { xs: 160, md: 240 },
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: { xs: "-8px", md: "-14px" },
          color: "text.primary",
        }}
      >
        26
      </Typography>
      <Box sx={(theme) => ({ width: 56, height: 2, bgcolor: theme.palette.primary.main, borderRadius: 999 })} />
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        Modules · One Year
      </Typography>
    </Stack>
  );
}

function PillarsVisual({ active: _active }: { active: boolean }) {
  const pillars = ["New tools", "Real examples", "Use at work"];
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      gap={{ xs: 2, sm: 5 }}
      alignItems="center"
      justifyContent="center"
      sx={{ flexWrap: "wrap" }}
    >
      {pillars.map((label, i) => (
        <Stack key={label} direction="row" alignItems="center" gap={{ xs: 2, sm: 5 }}>
          <Typography
            sx={{
              fontSize: { xs: 18, md: 22 },
              fontWeight: 600,
              letterSpacing: "-0.4px",
              color: "text.primary",
            }}
          >
            {label}
          </Typography>
          {i < pillars.length - 1 && (
            <Box
              sx={(theme) => ({
                width: 6,
                height: 6,
                borderRadius: 999,
                bgcolor: theme.palette.primary.main,
                display: { xs: "none", sm: "block" },
              })}
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
}
