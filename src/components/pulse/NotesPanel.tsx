import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { Plus, X } from "lucide-react";

export function NotesPanel({
  onClose,
  showCloseButton = true,
}: {
  onClose?: () => void;
  showCloseButton?: boolean;
}) {
  return (
    <Stack
      sx={(theme) => ({
        height: "100%",
        bgcolor: theme.palette.background.default,
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={(theme) => ({
          px: 3,
          py: 2.5,
          borderBottom: `1px solid ${theme.palette.outlineVariant.main}`,
        })}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary", letterSpacing: "-0.3px" }}>
          Notes
        </Typography>
        {showCloseButton && (
          <IconButton onClick={onClose} size="small" disableRipple>
            <X size={20} />
          </IconButton>
        )}
      </Stack>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={3}
        sx={{ flex: 1, px: 3, py: 5, textAlign: "center" }}
      >
        <NotesIllustration />
        <Stack gap={1.5} sx={{ maxWidth: 320 }}>
          <Typography
            sx={{
              fontSize: 17,
              fontWeight: 600,
              color: "text.primary",
              letterSpacing: "-0.3px",
              lineHeight: 1.4,
            }}
          >
            Take quick notes to remember what you have learned
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              lineHeight: 1.55,
              letterSpacing: "-0.2px",
            }}
          >
            Notes can help you to retain whatever you learn in courses for a longer period of time
          </Typography>
        </Stack>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Plus size={18} />}
          sx={{
            height: 44,
            px: 2.5,
            borderRadius: "8px",
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "-0.2px",
          }}
        >
          Add Note
        </Button>
      </Stack>
    </Stack>
  );
}

function NotesIllustration() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const ink = theme.palette.text.primary;
  return (
    <Box sx={{ position: "relative", width: 200, height: 180 }}>
      <svg width="200" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Decorative — top-left dot */}
        <circle cx="40" cy="40" r="6" fill={primary} />
        {/* Decorative — bottom-right small dot */}
        <circle cx="170" cy="135" r="4" fill={primary} />
        {/* Decorative — top-right sparkle */}
        <g transform="translate(160, 30)">
          <path d="M0 -10 L0 10 M-10 0 L10 0" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Decorative — bottom-left sparkle */}
        <g transform="translate(35, 145)">
          <path d="M0 -6 L0 6 M-6 0 L6 0" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Document body */}
        <rect x="62" y="42" width="76" height="96" rx="6" stroke={ink} strokeWidth="3.5" />
        {/* Document lines */}
        <line x1="74" y1="62" x2="118" y2="62" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        <line x1="74" y1="76" x2="124" y2="76" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <line x1="74" y1="90" x2="120" y2="90" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        <line x1="74" y1="104" x2="124" y2="104" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <line x1="74" y1="118" x2="106" y2="118" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        {/* Pen */}
        <g transform="translate(150 28) rotate(45)">
          <rect x="-6" y="0" width="12" height="46" rx="2" stroke={ink} strokeWidth="3" fill={theme.palette.background.default} />
          <line x1="-6" y1="12" x2="6" y2="12" stroke={ink} strokeWidth="3" />
          <polygon points="-6,46 6,46 0,58" fill={ink} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        </g>
      </svg>
    </Box>
  );
}
