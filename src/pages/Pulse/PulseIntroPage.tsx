import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Stack, Typography, keyframes, alpha, useTheme } from "@mui/material";
import { ArrowRight } from "lucide-react";
import glLogo from "../../assets/gl-logo.svg";
import { TopNav } from "../../components/TopNav/TopNav";
import { markIntroSeen } from "../../lib/pulse/onboarding";
import { usePageLoader } from "../../components/common/PageLoader";
import issuesData from "../../mocks/pulse-issues.json";
import type { PulseIssue } from "../../lib/pulse/types";

const allIssues = issuesData as PulseIssue[];

const SLIDE_COUNT = 3;

const LOGO_ITEMS: { slug: string; label: string; inline?: "openai" }[] = [
  { slug: "anthropic", label: "Anthropic" },
  { slug: "claude", label: "Claude" },
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

const titleFadeIn = keyframes`
  from { opacity: 0; transform: translate3d(0, 14px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
`;

const titleEntrance = keyframes`
  0%   { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const titleBreath = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
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
        body: "Learn new AI tools and how people are using them at work.",
        // Icy cool wash — sky-leaning blues
        accent: {
          from: theme.palette.primary.main,
          to: "#60A5FA",
          glow: "#DBEAFE",
        },
      },
      {
        key: "cadence",
        stepLabel: "Release",
        title: "One cutting-edge AI tool.\nEvery two weeks.",
        body: "30 to 60 minutes each. Short enough to fit your day, deep enough to apply at work the same day.",
        // Deeper indigo — confident
        accent: {
          from: "#3B82F6",
          to: "#4338CA",
          glow: "#C7D2FE",
        },
      },
      {
        key: "value",
        stepLabel: "What's inside",
        title: "New AI tools. Real examples.\nUse at work.",
        body: "Hands-on modules on what's new from OpenAI, Anthropic, Google and other labs, so you walk away with something you can use at work.",
        // Bright primary with a hint of cyan — optimistic
        accent: {
          from: theme.palette.primary.main,
          to: "#0EA5E9",
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
      <SlideBackdrop accent={slide.accent} />
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
            py: { xs: 5, md: 8 },
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
                  py: { xs: 5, md: 8 },
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
          <PrimaryCTA onClick={onPrimary}>
            {isLast ? "Explore AI Pulse" : "Continue"}
          </PrimaryCTA>
        </Stack>
      </Box>
    </Box>
  );
}

/* ───────────────────────── Slide content ───────────────────────── */

function SlideContent({ slide, active }: { slide: Slide; active: boolean }) {
  const theme = useTheme();
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
            const highlight = lineIdx === 0 && slide.key === "welcome";

            if (highlight) {
              return (
                <Box
                  key={lineIdx}
                  component="span"
                  sx={{
                    display: "block",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    backgroundImage: `linear-gradient(100deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 22%, #60A5FA 40%, #DBEAFE 50%, #60A5FA 60%, ${theme.palette.primary.main} 78%, ${theme.palette.primary.dark} 100%)`,
                    backgroundSize: "180% 100%",
                    backgroundPosition: "0% 50%",
                    backgroundRepeat: "no-repeat",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    willChange: "background-position",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    animation: `${titleFadeIn} 800ms cubic-bezier(0.22, 0.61, 0.36, 1) 140ms both, ${titleEntrance} 1800ms cubic-bezier(0.4, 0, 0.2, 1) 240ms both, ${titleBreath} 10s ease-in-out 2200ms infinite`,
                  }}
                >
                  {line}
                </Box>
              );
            }

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
                {words.map((word, i) => {
                  const entryDelay = 140 + (wordsBefore + i) * 60;
                  return (
                    <Box
                      component="span"
                      key={i}
                      sx={{
                        display: "inline-block",
                        animation: `${enterUp} 720ms cubic-bezier(0.22, 0.61, 0.36, 1) both`,
                        animationDelay: `${entryDelay}ms`,
                      }}
                    >
                      {word}
                    </Box>
                  );
                })}
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
            maxWidth: 720,
            textWrap: "balance",
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
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="contained"
      disableElevation
      endIcon={<ArrowRight size={16} />}
      onClick={onClick}
      sx={(t) => ({
        position: "relative",
        height: 48,
        px: 3,
        minWidth: { xs: "100%", sm: 200 },
        width: { xs: "100%", sm: "auto" },
        maxWidth: 380,
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.2px",
        textTransform: "none",
        borderRadius: "8px",
        color: t.palette.background.default,
        bgcolor: t.palette.primary.main,
        boxShadow: "none",
        "&:hover": {
          bgcolor: t.palette.primary.main,
          filter: "brightness(1.08)",
          boxShadow: "none",
        },
        "& .MuiButton-endIcon": {
          transition: "transform 280ms cubic-bezier(0.22,0.61,0.36,1)",
        },
        "&:hover .MuiButton-endIcon": {
          transform: "translateX(3px)",
        },
        transition: "filter 200ms ease",
      })}
    >
      {children}
    </Button>
  );
}

/* ───────────────────────── Backdrop ───────────────────────── */

function SlideBackdrop({ accent }: { accent: Slide["accent"] }) {
  return (
    <Box
      aria-hidden
      sx={(t) => ({
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 55% at 88% 8%, ${alpha(accent.from, 0.10)} 0%, transparent 60%),
          radial-gradient(ellipse 75% 60% at 8% 92%, ${alpha(accent.to, 0.08)} 0%, transparent 62%),
          linear-gradient(180deg, ${t.palette.background.default} 0%, ${alpha(accent.glow, 0.28)} 100%)
        `,
        transition: "background 600ms ease",
      })}
    />
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
        opacity: 0.028,
        mixBlendMode: "multiply",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "max-content",
            animation: `${marqueeScroll} 64s linear infinite`,
            animationPlayState: active ? "running" : "paused",
            willChange: "transform",
          }}
        >
          {doubled.map((item, i) => (
            <Box
              key={`${item.slug}-${i}`}
              sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                pr: { xs: 4, md: 6 },
              }}
            >
              <BrandLogo slug={item.slug} label={item.label} inline={item.inline} />
            </Box>
          ))}
        </Box>
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
        border: `1px solid ${alpha(t.palette.common.white, 0.7)}`,
        bgcolor: alpha(t.palette.background.paper, 0.55),
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        boxShadow: `0 1px 0 ${alpha(t.palette.common.white, 0.6)} inset, 0 12px 32px ${alpha(t.palette.primary.dark, 0.08)}, 0 2px 8px ${alpha(t.palette.common.black, 0.04)}`,
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
  const cards = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const released = [...allIssues]
      .filter((i) => i.releasedAt <= today)
      .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
    const upcoming = [...allIssues]
      .filter((i) => i.releasedAt > today)
      .sort((a, b) => a.releasedAt.localeCompare(b.releasedAt));
    const thisWeek = released[0];
    const upNext = upcoming[0];
    return [
      thisWeek && {
        eyebrow: "Released this week",
        issue: thisWeek,
        live: true,
      },
      upNext && {
        eyebrow: "Next · in two weeks",
        issue: upNext,
        live: false,
      },
    ].filter(Boolean) as { eyebrow: string; issue: PulseIssue; live: boolean }[];
  }, []);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="stretch"
      justifyContent="center"
      gap={{ xs: 2, md: 3 }}
      sx={{
        width: "100%",
        maxWidth: 720,
        animation: `${enterScale} 700ms cubic-bezier(0.22,0.61,0.36,1) both`,
        animationDelay: "380ms",
      }}
    >
      {cards.map((c, i) => {
        const title = c.issue.toolName ?? c.issue.title;
        const fallback = title.charAt(0).toUpperCase();
        return (
          <Stack
            key={i}
            gap={1.25}
            sx={(theme) => ({
              flex: 1,
              minWidth: 0,
              px: { xs: 2.25, md: 2.75 },
              py: { xs: 2, md: 2.5 },
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.common.white, 0.7)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.55),
              backdropFilter: "blur(22px) saturate(160%)",
              WebkitBackdropFilter: "blur(22px) saturate(160%)",
              boxShadow: `0 1px 0 ${alpha(theme.palette.common.white, 0.6)} inset, 0 12px 32px ${alpha(theme.palette.primary.dark, 0.08)}, 0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
              textAlign: "left",
            })}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Avatar
                src={c.issue.toolLogo ?? undefined}
                alt={title}
                variant="rounded"
                sx={(theme) => ({
                  width: 48,
                  height: 48,
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.outlineVariant.main}`,
                  fontSize: 18,
                  fontWeight: 700,
                  borderRadius: "10px",
                  flexShrink: 0,
                  overflow: "hidden",
                })}
              >
                {fallback}
              </Avatar>
              <Stack gap={0.5} sx={{ minWidth: 0 }}>
                <Stack direction="row" alignItems="center" gap={0.75}>
                  {c.live && (
                    <Box
                      sx={(theme) => ({
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                        flexShrink: 0,
                      })}
                    />
                  )}
                  <Typography
                    sx={(theme) => ({
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      color: c.live ? theme.palette.primary.main : theme.palette.text.secondary,
                      lineHeight: 1.2,
                    })}
                  >
                    {c.eyebrow}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontSize: { xs: 17, md: 18 },
                    fontWeight: 700,
                    color: "text.primary",
                    letterSpacing: "-0.3px",
                    lineHeight: 1.2,
                    textAlign: "left",
                  }}
                  noWrap
                >
                  {title}
                </Typography>
              </Stack>
            </Stack>
            <Typography
              sx={{
                fontSize: { xs: 13, md: 14 },
                fontWeight: 500,
                color: "text.secondary",
                letterSpacing: "-0.1px",
                lineHeight: 1.45,
                textAlign: "left",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {c.issue.description}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}
