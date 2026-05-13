import { Box, Button, Stack, Typography } from "@mui/material";
import { Video } from "lucide-react";
import pattern1 from "../../assets/patterns/pattern1.svg";
import pattern9 from "../../assets/patterns/pattern9.svg";

const PATTERNS: Record<string, string> = { pattern1, pattern9 };

type Props = {
  title: string;
  moduleLabel: string;
  cta: string;
  pattern: string;
  thumbBg: string;
};

export function CourseWidget({ title, moduleLabel, cta, pattern, thumbBg }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        height: 80,
        px: 2,
        py: 1.5,
        gap: 2,
        border: 1,
        borderColor: "outlineVariant.main",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "8px",
          bgcolor: thumbBg,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={PATTERNS[pattern] || pattern1}
          alt=""
          sx={{ width: 48, height: 48 }}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "24px",
            color: "text.primary",
            mb: 0.25,
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ color: "text.secondary" }}>
          <Video size={14} />
          <Typography sx={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: "-0.2px" }} noWrap>
            {moduleLabel}
          </Typography>
        </Stack>
      </Box>
      <Button
        variant="text"
        disableRipple
        sx={{
          color: "primary.main",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.4px",
          "&:hover": { bgcolor: "transparent" },
        }}
      >
        {cta}
      </Button>
    </Stack>
  );
}
