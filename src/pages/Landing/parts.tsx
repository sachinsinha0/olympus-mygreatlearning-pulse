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
 * The bordered four cell strip under the hero. Vertical dividers between cells on
 * desktop, a two by two grid on phones.
 */
export function StatStrip({ items }: { items: { value: string; label: string }[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: `repeat(${items.length}, 1fr)` },
        border: `1px solid ${GL.border}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {items.map((item, i) => (
        <Box
          key={item.label}
          sx={{
            px: 2,
            py: 2.25,
            textAlign: "center",
            borderRight: {
              xs: i % 2 === 0 ? `1px solid ${GL.border}` : "none",
              md: i < items.length - 1 ? `1px solid ${GL.border}` : "none",
            },
            borderBottom: { xs: i < items.length - 2 ? `1px solid ${GL.border}` : "none", md: "none" },
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: GL.heading, lineHeight: 1.4 }}>
            {item.value}
          </Typography>
          <Typography sx={{ fontSize: 14, color: GL.body, lineHeight: 1.4 }}>{item.label}</Typography>
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
