import { Box, Stack, Typography } from "@mui/material";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  Icon: LucideIcon;
  label: string;
  value?: string;
  valueColor?: "default" | "error";
  showChevron?: boolean;
  trailing?: ReactNode;
};

export function StatRow({ Icon, label, value, valueColor = "default", showChevron, trailing }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.5}
      sx={{
        bgcolor: "rgba(218, 225, 255, 0.16)",
        borderRadius: "8px",
        px: 1,
        py: 1,
        cursor: "pointer",
        "&:hover": { bgcolor: "rgba(218, 225, 255, 0.32)" },
      }}
    >
      <Box sx={{ color: "text.primary", display: "flex" }}>
        <Icon size={18} strokeWidth={1.75} />
      </Box>
      <Typography variant="body2" sx={{ flex: 1, color: "text.primary", fontWeight: 500 }}>
        {label}
      </Typography>
      {trailing}
      {value && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: valueColor === "error" ? "error.main" : "text.primary",
          }}
        >
          {value}
        </Typography>
      )}
      {showChevron && <ChevronRight size={18} color="#5e5e62" />}
    </Stack>
  );
}
