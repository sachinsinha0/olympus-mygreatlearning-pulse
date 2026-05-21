import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography, keyframes, alpha, useTheme } from "@mui/material";
import { ArrowRight, BookOpen, FileQuestion, PlayCircle } from "lucide-react";
import glLogo from "../../assets/gl-logo.svg";
import { TopNav } from "../../components/TopNav/TopNav";
import { markIntroSeen } from "../../lib/pulse/onboarding";
import { usePageLoader } from "../../components/common/PageLoader";

const SLIDE_COUNT = 3;

const LOGO_ITEMS: { slug: string; label: string; inline?: "openai" }[] = [
  { slug: "anthropic", label: "Anthropic" },
  { slug: "openai", label: "OpenAI", inline: "openai" },
  { slug: "google", label: "Google" },
  { slug: "googlegemini", label: "Gemini" },
  { slug: "cursor", label: "Cursor" },
  { slug: "perplexity", label: "Perplexity" },
  { slug: "githubcopilot", label: "GitHub Copilot" },
  { slug: "huggingface", label: "Hugging Face" },
  { slug: "v0", label: "v0" },
];

const enterUp = keyframes`
  from { opacity: 0; transform: translateY(18px); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
`;

const enterScale = keyframes`
  from { opacity: 0; transform: scale(0.94) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const marqueeScroll = keyframes`
  from { transform: translate3d(0,0,0); }
  to { transform: translate3d(-50%,0,0); }
`;

const auroraDriftA = keyframes`
  0%, 100% { transform: translate3d(-10%, -15%, 0) scale(1); }
  50%      { transform: translate3d(15%, 10%, 0) scale(1.15); }
`;

const auroraDriftB = keyframes`
  0%, 100% { transform: translate3d(20%, 25%, 0) scale(1.1); }
  50%      { transform: translate3d(-15%, -5%, 0) scale(1); }
`;

const shimmerSweep = keyframes`
  0%   { transform: translateX(-120%) skewX(-12deg); }
  60%  { transform: translateX(220%) skewX(-12deg); }
  100% { transform: translateX(220%) skewX(-12deg); }
`;

type SlideKey = "welcome" | "cadence" | "value";

type Slide = {
  key: SlideKey;
  stepLabel: string;
  title: string;
  body: string;
  accent: { from: string; to: string; glow: string };
};

export function PulseIntroPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { runWithPageLoader } = usePageLoader();

  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const slides: Slide[] = useMemo(
    () => [
      {
        key: "welcome",
        stepLabel: "Welcome",
        title: "AI Pulse.\nYour AI learning channel.",
        body: "Learn the new AI tools and how people are using them at work.",
        accent: {
          from: theme.palette.primary.main,
          to: "#3B82F6",
          glow: theme.palette.primary.light,
        },
      },
      {
        key: "cadence",
        stepLabel: "Release",
        title: "One module every two weeks.",
        body: "30 to 60 minutes each. Short enough to fit your day, deep enough to leave you with something usable.",
        accent: {
          from: "#3B82F6",
          to: theme.palette.primary.dark,
          glow: theme.palette.primary.light,
        },
      },
      {
        key: "value",
        stepLabel: "What's inside",
        title: "New AI tools. Real examples.\nUse at work.",
        body: "We show you new AI tools from OpenAI, Anthropic, Google and more, with real examples you can use at work.",
        accent: {
          from: theme.palette.primary.main,
          to: theme.palette.primary.dark,
          glow: theme.palette.primary.light,
        },
      },
    ],
    [theme],
  );

  const goTo = (next: number) => {
    setIndex(Math.max(0, Math.min(SLIDE_COUNT - 1, next)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const slide = slides[index];
  const isLast = index === SLIDE_COUNT - 1;

  const finish = () => {
    markIntroSeen();
    runWithPageLoader(() => navigate("/pulse", { replace: true }), 700);
  };

  const onPrimary = () => {
    if (!isLast) {
      goTo(index + 1);
      return;
    }
    finish();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 60) return;
    if (delta < 0) goTo(index + 1);
    else goTo(index - 1);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", position: "relative", overflow: "hidden" }}>
      <Aurora accent={slide.accent} />
      <CenterSpotlight />
      <NoiseOverlay />

      <TopNav />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <BrandMark />

        {/* Slide stage */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, md: 6 },
            py: { xs: 3, md: 4 },
          }}
        >
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <Box
                key={s.key}
                aria-hidden={!active}
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: { xs: 3, md: 6 },
                  py: { xs: 3, md: 5 },
                  opacity: active ? 1 : 0,
                  transform: active
                    ? "translateY(0)"
                    : i < index ? "translateY(-24px)" : "translateY(24px)",
                  pointerEvents: active ? "auto" : "none",
                  transition:
                    "opacity 480ms cubic-bezier(0.22,0.61,0.36,1), transform 520ms cubic-bezier(0.22,0.61,0.36,1)",
                }}
              >
                <SlideContent slide={s} active={active} />
              </Box>
            );
          })}
        </Box>

        {/* Bottom chrome */}
        <Stack
          alignItems="center"
          gap={{ xs: 3, md: 3.5 }}
          sx={{
            position: "relative",
            zIndex: 3,
            px: { xs: 3, md: 6 },
            pb: { xs: 3, md: 5 },
            pt: { xs: 1.5, md: 2 },
          }}
        >
          <Stepper slides={slides} active={index} onJump={goTo} />
          <PrimaryCTA onClick={onPrimary} accent={slide.accent}>
            {isLast ? "Explore AI Pulse" : "Continue"}
          </PrimaryCTA>
        </Stack>
      </Box>
    </Box>
  );
}

/* ───────────────────────── Slide content ───────────────────────── */

function SlideContent({ slide, active }: { slide: Slide; active: boolean }) {
  const titleLines = slide.title.split("\n");
  const totalWords = titleLines.reduce((n, line) => n + line.split(" ").length, 0);

  return (
    <Stack
      alignItems="center"
      gap={{ xs: 3.5, md: 5 }}
      sx={{
        width: "100%",
        maxWidth: 960,
        mx: "auto",
        textAlign: "center",
      }}
    >
      {active && (
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 28, md: 48 },
            fontWeight: 700,
            lineHeight: { xs: "34px", md: "54px" },
            letterSpacing: { xs: "-0.8px", md: "-1.4px" },
            color: "text.primary",
            textWrap: "balance",
          }}
        >
          {titleLines.map((line, lineIdx) => {
            const words = line.split(" ");
            const wordsBefore = titleLines.slice(0, lineIdx).reduce((n, l) => n + l.split(" ").length, 0);
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
                      animation: `${enterUp} 720ms cubic-bezier(0.22, 0.61, 0.36, 1) both`,
                      animationDelay: `${140 + (wordsBefore + i) * 60}ms`,
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
            fontSize: { xs: 16, md: 19 },
            lineHeight: { xs: "24px", md: "30px" },
            letterSpacing: "-0.2px",
            color: "text.secondary",
            maxWidth: 600,
            animation: `${enterUp} 700ms ease both`,
            animationDelay: `${220 + totalWords * 60}ms`,
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
            animation: `${enterScale} 800ms cubic-bezier(0.22, 0.61, 0.36, 1) both`,
            animationDelay: `${320 + totalWords * 60}ms`,
          }}
        >
          {slide.key === "welcome" && <TickerVisual accent={slide.accent} active={active} />}
          {slide.key === "cadence" && <CadenceVisual accent={slide.accent} active={active} />}
          {slide.key === "value" && <ValueVisual />}
        </Box>
      )}
    </Stack>
  );
}

/* ───────────────────────── Chrome pieces ───────────────────────── */

function Stepper({
  slides,
  active,
  onJump,
}: {
  slides: Slide[];
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <Stack direction="row" gap={{ xs: 1.2, md: 1.6 }} alignItems="stretch">
      {slides.map((s, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <Box
            key={s.key}
            role="button"
            tabIndex={0}
            onClick={() => onJump(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onJump(i);
              }
            }}
            sx={(t) => ({
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              minWidth: { xs: 60, md: 88 },
              outline: "none",
              "&:focus-visible > div:last-of-type": {
                outline: `2px solid ${alpha(t.palette.text.primary, 0.35)}`,
                outlineOffset: 2,
              },
            })}
          >
            <Stack direction="row" alignItems="center" gap={0.6}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  fontVariantNumeric: "tabular-nums",
                  color: isActive ? "text.primary" : "text.secondary",
                  opacity: isActive ? 1 : 0.7,
                  transition: "opacity 280ms ease, color 280ms ease",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "-0.2px",
                  color: isActive ? "text.primary" : "text.secondary",
                  opacity: isActive ? 1 : 0.55,
                  display: { xs: "none", md: "inline" },
                  transition: "opacity 280ms ease",
                }}
              >
                {s.stepLabel}
              </Typography>
            </Stack>
            <Box
              sx={(t) => ({
                height: 3,
                borderRadius: 999,
                bgcolor: isActive || isPast ? t.palette.text.primary : alpha(t.palette.text.primary, 0.12),
                position: "relative",
                overflow: "hidden",
                transition: "background-color 320ms ease",
              })}
            >
              {isActive && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(90deg, ${s.accent.from}, ${s.accent.to})`,
                  }}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

function PrimaryCTA({
  onClick,
  accent,
  children,
}: {
  onClick: () => void;
  accent: Slide["accent"];
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", sm: "auto" },
        maxWidth: 380,
      }}
    >
      {/* Outer glow */}
      <Box
        sx={{
          position: "absolute",
          inset: -2,
          borderRadius: 999,
          background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
          opacity: 0.18,
          filter: "blur(10px)",
          transition: "opacity 400ms ease",
          pointerEvents: "none",
        }}
      />
      <Button
        variant="contained"
        disableElevation
        endIcon={<ArrowRight size={18} />}
        onClick={onClick}
        sx={(t) => ({
          position: "relative",
          height: 56,
          px: 4,
          minWidth: { xs: "100%", sm: 240 },
          width: { xs: "100%", sm: "auto" },
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.2px",
          textTransform: "none",
          borderRadius: 999,
          color: t.palette.background.default,
          bgcolor: t.palette.text.primary,
          boxShadow: "none",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "40%",
            background: `linear-gradient(90deg, transparent, ${alpha("#ffffff", 0.35)}, transparent)`,
            transform: "translateX(-120%) skewX(-12deg)",
            animation: `${shimmerSweep} 3.4s ease-in-out infinite`,
            pointerEvents: "none",
          },
          "&:hover": {
            bgcolor: t.palette.text.primary,
            filter: "brightness(1.08)",
            boxShadow: "none",
            transform: "translateY(-1px)",
          },
          "& .MuiButton-endIcon": {
            transition: "transform 280ms cubic-bezier(0.22,0.61,0.36,1)",
          },
          "&:hover .MuiButton-endIcon": {
            transform: "translateX(4px)",
          },
          transition: "transform 200ms ease, filter 200ms ease",
        })}
      >
        {children}
      </Button>
    </Box>
  );
}

/* ───────────────────────── Backdrop ───────────────────────── */

function Aurora({ accent }: { accent: Slide["accent"] }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "80vw",
          height: "80vw",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${alpha(accent.from, 0.28)} 0%, ${alpha(accent.from, 0)} 60%)`,
          filter: "blur(60px)",
          animation: `${auroraDriftA} 18s ease-in-out infinite`,
          transition: "background 800ms ease",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-25%",
          right: "-15%",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${alpha(accent.to, 0.24)} 0%, ${alpha(accent.to, 0)} 60%)`,
          filter: "blur(70px)",
          animation: `${auroraDriftB} 22s ease-in-out infinite`,
          transition: "background 800ms ease",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "40%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, ${alpha(accent.glow, 0.22)} 0%, ${alpha(accent.glow, 0)} 60%)`,
          filter: "blur(80px)",
          animation: `${auroraDriftA} 26s ease-in-out infinite reverse`,
          transition: "background 800ms ease",
        }}
      />
    </Box>
  );
}

function BrandMark() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={1.5}
      sx={{
        pt: { xs: 3.5, md: 5 },
        pb: { xs: 0.5, md: 1 },
      }}
    >
      <Typography
        sx={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "-0.2px",
          color: "text.primary",
        }}
      >
        AI Pulse
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: "-0.1px",
          color: "text.secondary",
        }}
      >
        by
      </Typography>
      <Box
        component="img"
        src={glLogo}
        alt="Great Learning"
        sx={{
          height: 28,
          width: "auto",
          display: "block",
        }}
      />
    </Stack>
  );
}

function CenterSpotlight() {
  return (
    <Box
      aria-hidden
      sx={(t) => ({
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${alpha(t.palette.background.default, 0.7)} 0%, ${alpha(t.palette.background.default, 0)} 70%)`,
      })}
    />
  );
}

function NoiseOverlay() {
  // Inline SVG turbulence — adds subtle film grain without an asset.
  const svg =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <filter id='n'>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/>
        </filter>
        <rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/>
      </svg>`,
    );
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        backgroundImage: `url("${svg}")`,
        backgroundSize: "160px 160px",
        opacity: 0.06,
        mixBlendMode: "overlay",
      }}
    />
  );
}

/* ───────────────────────── Visuals ───────────────────────── */

function TickerVisual({ active }: { accent: Slide["accent"]; active: boolean }) {
  const doubled = [...LOGO_ITEMS, ...LOGO_ITEMS];
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 920,
        position: "relative",
        py: 1,
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 22%, black 78%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 22%, black 78%, transparent 100%)",
      }}
    >
      <Box sx={{ overflow: "hidden", py: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          gap={{ xs: 4, md: 6 }}
          sx={{
            width: "max-content",
            animation: active ? `${marqueeScroll} 64s linear infinite` : "none",
          }}
        >
          {doubled.map((item, i) => (
            <BrandLogo key={`${item.slug}-${i}`} slug={item.slug} label={item.label} inline={item.inline} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function BrandLogo({ slug, label, inline }: { slug: string; label: string; inline?: "openai" }) {
  const theme = useTheme();
  const hex = (theme.palette.text.primary || "#1a1b1e").replace("#", "");
  const sharedSx = {
    height: { xs: 28, md: 36 },
    width: "auto",
    flexShrink: 0,
    opacity: 0.75,
    transition: "opacity 200ms ease",
    "&:hover": { opacity: 1 },
    color: theme.palette.text.primary,
  } as const;

  if (inline === "openai") {
    return (
      <Box aria-label={label} sx={sharedSx}>
        <OpenAIMark height="100%" />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={`https://cdn.simpleicons.org/${slug}/${hex}`}
      alt={label}
      loading="lazy"
      sx={sharedSx}
    />
  );
}

function OpenAIMark({ height = 32 }: { height?: number | string }) {
  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={height}
      width="auto"
      fill="currentColor"
    >
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.05 6.05 0 0 0 6.515 2.9A5.98 5.98 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973v5.677a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function CadenceVisual({ accent, active }: { accent: Slide["accent"]; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 24));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <Stack alignItems="center" gap={{ xs: 2.5, md: 3 }} sx={{ width: "100%", maxWidth: 460 }}>
      <Stack
        direction="row"
        gap={{ xs: 1.5, md: 2 }}
        sx={{ width: "100%" }}
      >
        <StatCard accent={accent} number="1" unit="module" caption="every 2 weeks" />
        <StatCard accent={accent} number={String(count)} unit="modules" caption="a year" highlight />
      </Stack>
    </Stack>
  );
}

function StatCard({
  accent,
  number,
  unit,
  caption,
  highlight,
}: {
  accent: Slide["accent"];
  number: string;
  unit: string;
  caption: string;
  highlight?: boolean;
}) {
  return (
    <Box
      sx={(t) => ({
        position: "relative",
        flex: 1,
        px: { xs: 2.5, md: 3.5 },
        pt: { xs: 2.25, md: 3 },
        pb: { xs: 1.75, md: 2.25 },
        borderRadius: 3,
        border: `1px solid ${alpha(t.palette.text.primary, 0.08)}`,
        bgcolor: alpha(t.palette.background.paper, 0.7),
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        textAlign: "left",
        overflow: "hidden",
        "&::before": highlight
          ? {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              padding: "1px",
              background: `linear-gradient(135deg, ${alpha(accent.from, 0.4)}, transparent 60%)`,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            }
          : undefined,
      })}
    >
      <Typography
        sx={{
          mb: 1,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        {caption}
      </Typography>
      <Stack direction="row" alignItems="baseline" gap={1}>
        <Typography
          sx={{
            fontSize: { xs: 44, md: 64 },
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: { xs: "-1.5px", md: "-3px" },
            fontVariantNumeric: "tabular-nums",
            backgroundImage: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {number}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 16, md: 20 },
            fontWeight: 600,
            color: "text.primary",
            letterSpacing: "-0.3px",
          }}
        >
          {unit}
        </Typography>
      </Stack>
    </Box>
  );
}

function ValueVisual() {
  const types = [
    { icon: PlayCircle, label: "Video", meta: "Watch the segment" },
    { icon: FileQuestion, label: "Quiz", meta: "Check what stuck" },
    { icon: BookOpen, label: "Hands-on", meta: "Try it inside the player" },
  ];

  return (
    <Stack
      direction="row"
      alignItems="stretch"
      justifyContent="center"
      gap={{ xs: 2, md: 3 }}
      sx={{
        width: "100%",
        maxWidth: 960,
        animation: `${enterScale} 700ms cubic-bezier(0.22,0.61,0.36,1) both`,
        animationDelay: "380ms",
      }}
    >
      {types.map((t, i) => {
        const Icon = t.icon;
        return (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            gap={2}
            sx={(theme) => ({
              width: { xs: "100%", md: 264 },
              minWidth: 0,
              flexShrink: 0,
              px: { xs: 2, md: 2.25 },
              py: { xs: 1.75, md: 2 },
              borderRadius: 2,
              border: `1px solid ${theme.palette.outlineVariant.main}`,
              bgcolor: theme.palette.background.paper,
              boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.04)}`,
              textAlign: "left",
            })}
          >
            <Box
              sx={(theme) => ({
                width: 44,
                height: 44,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                color: theme.palette.background.default,
                bgcolor: theme.palette.primary.main,
                flexShrink: 0,
              })}
            >
              <Icon size={22} strokeWidth={2.25} />
            </Box>
            <Stack gap={0.25} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 15 },
                  fontWeight: 700,
                  color: "text.primary",
                  letterSpacing: "-0.2px",
                  textAlign: "left",
                  lineHeight: 1.25,
                }}
              >
                {t.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "text.secondary",
                  letterSpacing: "-0.1px",
                  textAlign: "left",
                  lineHeight: 1.4,
                }}
              >
                {t.meta}
              </Typography>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
