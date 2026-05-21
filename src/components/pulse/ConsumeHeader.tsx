import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ArrowLeft, ChevronLeft, ChevronRight, List } from "lucide-react";
import type { CourseItem } from "../../lib/pulse/types";
import type { PulseIssue } from "../../lib/pulse/types";

export function ConsumeHeader({
  module: pulseModule,
  item,
  prev,
  next,
  onBack,
  onPrev,
  onNext,
  onRailToggle,
  railOpen,
}: {
  module: PulseIssue;
  item: CourseItem;
  prev?: CourseItem;
  next?: CourseItem;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onRailToggle?: () => void;
  railOpen?: boolean;
}) {
  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.background.default,
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
      })}
    >
      <Stack direction="row" alignItems="center" gap={{ xs: 1.5, md: 2 }}>
        <IconButton onClick={onBack} size="small" disableRipple sx={{ flexShrink: 0 }} aria-label="Back to AI Pulse">
          <ArrowLeft size={20} />
        </IconButton>
        <Stack gap={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color: "text.secondary",
              letterSpacing: "-0.1px",
              display: { xs: "none", md: "block" },
            }}
            noWrap
          >
            AI Pulse · {pulseModule.title}
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              lineHeight: "24px",
              color: "text.primary",
              letterSpacing: "-0.4px",
            }}
            noWrap
          >
            {item.title}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={{ xs: 0.5, md: 2 }} sx={{ flexShrink: 0 }}>
          <PagerButton
            label="Previous"
            disabled={!prev}
            onClick={onPrev}
            icon={<ChevronLeft size={18} />}
            iconLeft
          />
          <PagerButton
            label="Next"
            disabled={!next}
            onClick={onNext}
            icon={<ChevronRight size={18} />}
          />
          {onRailToggle && (
            <IconButton
              onClick={onRailToggle}
              size="small"
              disableRipple
              aria-label={railOpen ? "Close learning panel" : "Open learning panel"}
              sx={(theme) => ({
                display: { xs: "inline-flex", md: "none" },
                ml: 0.5,
                color: theme.palette.text.primary,
              })}
            >
              <List size={20} />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

function PagerButton({
  label,
  disabled,
  onClick,
  icon,
  iconLeft,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
  iconLeft?: boolean;
}) {
  return (
    <Box
      component="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      sx={(theme) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        height: 36,
        px: { xs: 1, md: 1.5 },
        border: "none",
        bgcolor: "transparent",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? theme.palette.text.disabled : theme.palette.primary.main,
        fontFamily: "inherit",
        fontSize: { xs: 13, md: 14 },
        fontWeight: 600,
        letterSpacing: "-0.2px",
        flexDirection: iconLeft ? "row" : "row-reverse",
        borderRadius: "8px",
        transition: "background-color 120ms ease",
        "&:hover": disabled ? undefined : { bgcolor: theme.palette.action.hover },
      })}
    >
      {icon}
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
        {label}
      </Box>
    </Box>
  );
}
