import { Box, Stack, Typography } from "@mui/material";
import { CheckCircle2, Target } from "lucide-react";

export function OutcomesList({ outcomes }: { outcomes: string[] }) {
  return (
    <Box>
      <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Box sx={{ color: "primary.main", display: "flex" }}>
          <Target size={16} strokeWidth={2.25} />
        </Box>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: "primary.main",
          }}
        >
          Learning Outcomes
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.4px",
          color: "text.primary",
          mb: 0.5,
        }}
      >
        What you'll walk away with
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 2.5, maxWidth: 560 }}
      >
        Specific skills and capabilities you'll have after completing this release.
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          rowGap: 1.75,
          columnGap: 4,
        }}
      >
        {outcomes.map((o) => (
          <Stack key={o} direction="row" gap={1.5} alignItems="flex-start">
            <Box sx={{ color: "primary.main", mt: "1px", flexShrink: 0 }}>
              <CheckCircle2 size={18} />
            </Box>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.45,
                color: "text.primary",
              }}
            >
              {o}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
