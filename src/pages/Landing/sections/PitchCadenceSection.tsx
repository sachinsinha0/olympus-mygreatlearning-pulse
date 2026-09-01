import { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useInView, useReducedMotion } from "framer-motion";
import { GL } from "../landingTheme";
import { ContentColumn, EyebrowRule } from "../parts";
import { INTRO_PITCH } from "../content";

/**
 * Beat two of the onboarding pitch: how often a module lands.
 *
 * The slide's own two stat cards carry it, verbatim: one new module every two weeks,
 * twenty six a year. Both numbers had fallen off the landing page entirely before
 * the pitch was brought over.
 *
 * Split composition, text left and the numbers right, so this reads differently from
 * the centred statement above it and the mirrored beat below.
 *
 * The numbers are solid blue where the slide sets them in a gradient, because
 * gradient text is one of the things this page rules out.
 */

/**
 * Counts up to the target, the way the slide does: 900ms on an easeOutCubic, driven
 * by requestAnimationFrame. The slide starts on becoming active; the equivalent
 * trigger on a scrolling page is entering the viewport, and it runs once.
 *
 * Only the accumulating number gets this. Counting to 1 would be pointless, and the
 * product animates only its 26 as well.
 */
function useCountUp(target: number, run: boolean, enabled: boolean) {
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, enabled]);

  return value;
}

/**
 * The slide's stat card. The second one is highlighted, because the product
 * highlights it: 26 a year is the payoff, not an equal twin of the fortnightly
 * figure, and two identical cards would present one idea as two.
 *
 * The product draws that highlight as a gradient border. Here it is a solid blue
 * tint, the same choice already made for the numbers themselves.
 */
function StatCard({
  caption,
  number,
  unit,
  highlight = false,
}: {
  caption: string;
  number: string;
  unit: string;
  highlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  // Only a whole number can count. "1" is left alone regardless.
  const numeric = Number(number);
  const countable = highlight && Number.isFinite(numeric) && numeric > 1 && !reduce;
  const counted = useCountUp(numeric, inView, countable);

  return (
    <Box
      ref={ref}
      sx={{
        flex: 1,
        minWidth: 0,
        backgroundColor: highlight ? "#F1F6FE" : "#ffffff",
        border: `1px solid ${highlight ? "rgba(25, 106, 229, 0.22)" : GL.border}`,
        borderRadius: "16px",
        boxShadow: highlight
          ? "0 1px 2px rgba(16, 24, 40, 0.04), 0 14px 36px rgba(25, 106, 229, 0.12)"
          : "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px rgba(16, 24, 40, 0.08)",
        px: { xs: 3, md: 3.5 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: GL.body,
        }}
      >
        {caption}
      </Typography>
      <Stack direction="row" alignItems="baseline" gap={1} sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontSize: { xs: 48, md: 62 },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-2.5px",
            color: GL.blue,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {countable ? counted : number}
        </Typography>
        <Typography sx={{ fontSize: { xs: 17, md: 19 }, fontWeight: 600, color: GL.heading }}>
          {unit}
        </Typography>
      </Stack>
    </Box>
  );
}

export function PitchCadenceSection() {
  const { label, title, body, stats } = INTRO_PITCH.release;

  return (
    <Box component="section" sx={{ bgcolor: "#ffffff", py: { xs: 8, md: 13 } }}>
      <ContentColumn>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 5, md: 10 },
            alignItems: "center",
          }}
        >
          <Box>
            <EyebrowRule label={label} />
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 24, md: 31 },
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: "-0.6px",
                color: GL.heading,
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ mt: 2, fontSize: 16, lineHeight: 1.65, color: GL.body, maxWidth: 520 }}>
              {body}
            </Typography>
          </Box>

          <Stack direction="row" gap={{ xs: 2, md: 3 }}>
            {stats.map((s, i) => (
              <StatCard key={s.caption} {...s} highlight={i === stats.length - 1} />
            ))}
          </Stack>
        </Box>
      </ContentColumn>
    </Box>
  );
}

export default PitchCadenceSection;
