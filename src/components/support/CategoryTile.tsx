import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  Icon: LucideIcon;
  bg: string;
  color: string;
  onClick: () => void;
};

export function CategoryTile({ label, Icon, bg, color, onClick }: Props) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        appearance: "none",
        font: "inherit",
        width: "100%",
        border: 1,
        borderColor: "outlineVariant.main",
        borderRadius: "12px",
        boxShadow: "none",
        px: 2,
        py: 2,
        cursor: "pointer",
        textAlign: "left",
        bgcolor: "background.paper",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
      }}
    >
      <Stack direction="row" gap={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "8px",
            bgcolor: bg,
            color,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} strokeWidth={2} />
        </Box>
        <Typography
          sx={{ fontSize: 16, fontWeight: 500, color: "text.primary", letterSpacing: "-0.2px" }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  );
}
