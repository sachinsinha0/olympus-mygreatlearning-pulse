import type { ReactNode } from "react";
import { Box, Stack, Typography, keyframes } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Check } from "lucide-react";
import { GL } from "./landingTheme";

/**
 * The site's 1280px content column. Every band on the page lines its content up
 * on the same left edge, including the header and the fixed bottom bar, which are not
 * Sections and so use this directly.
 */
export function ContentColumn({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box sx={{ maxWidth: GL.maxWidth, mx: "auto", px: { xs: 2.5, md: 4 }, ...sx } as SxProps<Theme>}>
      {children}
    </Box>
  );
}

/** A full width band with the content column inside it. */
export function Section({
  id,
  bg = "#ffffff",
  py = { xs: 6, md: 9 },
  children,
}: {
  id?: string;
  bg?: string;
  /** A spacing step, or a breakpoint map of them, e.g. `{ xs: 6, md: 9 }`. */
  py?: number | string | Record<string, number | string>;
  children: ReactNode;
}) {
  return (
    <Box component="section" id={id} sx={{ bgcolor: bg, py }}>
      <ContentColumn>{children}</ContentColumn>
    </Box>
  );
}

/** 32px / 600 on light backgrounds. The template's section heading. */
export function SectionHeading({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Typography
      component="h2"
      sx={{
        fontSize: { xs: 26, md: 32 },
        fontWeight: 600,
        lineHeight: 1.25,
        color: GL.heading,
        textAlign: align,
      }}
    >
      {children}
    </Typography>
  );
}

/** 30px / 500 white. The template's heading on a dark band. */
/**
 * SectionHeading on a dark ground. Same size and same weight: it was a step smaller
 * and a weight lighter, which made the one section on a dark band the one section
 * whose heading did not carry.
 */
export function DarkHeading({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="h2"
      sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, lineHeight: 1.25, color: "#ffffff" }}
    >
      {children}
    </Typography>
  );
}

/** Grey supporting paragraph under a heading. */
export function Lede({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" }) {
  return (
    <Typography
      sx={{
        fontSize: 16,
        lineHeight: 1.6,
        color: GL.body,
        textAlign: align,
        maxWidth: align === "center" ? 780 : 640,
        mx: align === "center" ? "auto" : 0,
      }}
    >
      {children}
    </Typography>
  );
}




/**
 * The intro carousel's marquee: the same keyframes and the same travel to -50%, which
 * is what makes the loop seamless once the list is rendered twice.
 */
const marqueeScroll = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
`;

/**
 * A scrolling row, the way /pulse/intro scrolls its logos and its topic chips.
 *
 * The list is rendered twice and travelled half its width, so the loop has no seam.
 * Edges are masked rather than clipped, which is the product's treatment, and a
 * gradient is permitted here because it paints a mask and never a surface.
 *
 * Two behaviours the product does not need and this page does. The row pauses under
 * the pointer, because these rows carry readable labels and someone may want to stop
 * on one. And it freezes under prefers-reduced-motion, where the product instead
 * pauses whenever its slide is inactive.
 */
export function Marquee<T>({
  items,
  keyOf,
  renderItem,
  duration = 64,
  reverse = false,
  fade = 12,
  sx,
}: {
  items: readonly T[];
  keyOf: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Seconds for one full pass. */
  duration?: number;
  reverse?: boolean;
  /** Width of the edge fade, as a percentage of the row. */
  fade?: number;
  sx?: SxProps<Theme>;
}) {
  const doubled = [...items, ...items];
  const mask = `linear-gradient(90deg, transparent 0%, black ${fade}%, black ${100 - fade}%, transparent 100%)`;

  return (
    <Box
      sx={{
        overflow: "hidden",
        maskImage: mask,
        WebkitMaskImage: mask,
        "&:hover .marquee-track": { animationPlayState: "paused" },
        "@media (prefers-reduced-motion: reduce)": {
          "& .marquee-track": { animation: "none" },
        },
        ...sx,
      } as SxProps<Theme>}
    >
      <Box
        className="marquee-track"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          width: "max-content",
          animation: `${marqueeScroll} ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <Box key={`${keyOf(item)}-${i}`} sx={{ flexShrink: 0 }}>
            {renderItem(item)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/**
 * A small uppercase label on a rule, the eyebrow the product's onboarding carousel
 * puts above a slide title. Deliberately carries no number: the trial section runs
 * an 01/02/03 sequence for its steps, and a second numbered sequence elsewhere on
 * the page would read as related to it.
 */
/**
 * The label is brand blue, and one flat colour.
 *
 * It was grey, which is what made it read as flat. A gradient across the letters was
 * the other way to fix that, and it is the exact thing this page rules out: purple to
 * blue text is the signature of a machine made layout, and purple is not in Great
 * Learning's palette either.
 */
export function EyebrowRule({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <Stack direction="row" alignItems="baseline" gap={1} sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: dark ? GL.blueOnDark : GL.blue,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
      {/* The rule fades out rather than stopping dead at the column edge.
          A gradient on the rule, never on the label: gradient text is the tell this
          page is built to avoid, and a hairline dissolving is an old typographic
          device rather than a 2023 one. */}
      <Box
        sx={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(90deg, ${dark ? GL.darkBorder : GL.border} 0%, transparent 100%)`,
        }}
      />
    </Stack>
  );
}

/** Blue circled ticks with plain sentences beside them. */
export function CheckList({ items, dense = false }: { items: string[]; dense?: boolean }) {
  return (
    <Stack gap={dense ? 1.25 : 1.75}>
      {items.map((text) => (
        <Stack key={text} direction="row" gap={1.5} alignItems="flex-start">
          <Box
            sx={{
              flexShrink: 0,
              mt: "3px",
              width: 20,
              height: 20,
              borderRadius: "999px",
              border: `1.5px solid ${GL.blue}`,
              color: GL.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={12} strokeWidth={3} />
          </Box>
          <Typography sx={{ fontSize: dense ? 15 : 16, lineHeight: 1.55, color: GL.body }}>
            {text}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
