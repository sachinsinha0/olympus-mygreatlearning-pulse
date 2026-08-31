import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GL } from "./landingTheme";

/**
 * The template's 1256px content column. Every band on the page lines its content up
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
export function DarkHeading({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="h2"
      sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 500, lineHeight: 1.3, color: "#ffffff" }}
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
 * The cadence stats, in the shape the product already uses.
 *
 * PulseIntroPage renders the same two figures as caption above, then the number and its
 * unit on one baseline. That structure is copied here rather than invented. The product
 * sets its numbers in a gradient; this page uses solid ink, since gradient text is one
 * of the things the design brief rules out.
 */
export function CadenceStats({
  items,
}: {
  items: { caption: string; number: string; unit: string }[];
}) {
  return (
    <Box sx={{ display: "flex", gap: { xs: 5, sm: 7 } }}>
      {items.map((item) => (
        <Box key={item.caption}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              color: GL.body,
            }}
          >
            {item.caption}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: 34, md: 40 },
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-1.5px",
                color: GL.heading,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.number}
            </Typography>
            <Typography sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 600, color: GL.heading }}>
              {item.unit}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/**
 * The template's small outlined square icon tile. Note it is a full 1px border on all
 * four sides. A one directional coloured accent border is banned on this page.
 */
export function IconTile({ Icon, dark = false }: { Icon: LucideIcon; dark?: boolean }) {
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "8px",
        border: `1px solid ${dark ? GL.darkBorder : GL.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: dark ? "#ffffff" : GL.heading,
      }}
    >
      <Icon size={20} strokeWidth={1.75} />
    </Box>
  );
}

/**
 * The reference template's skill chip: pale blue fill, uppercase blue label, wide
 * letter spacing, 4px radius. Used for the topic list under the modules.
 */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        backgroundColor: "#EAF1FD",
        color: GL.blue,
        borderRadius: "4px",
        padding: "6px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
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
