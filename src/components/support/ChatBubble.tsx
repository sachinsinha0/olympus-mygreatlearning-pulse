import { Box, Stack, Typography } from "@mui/material";

type Props = {
  role: "bot" | "user";
  text: string;
  options?: string[];
  optionsActive?: boolean;
  onOptionClick?: (option: string) => void;
};

function GlaideAvatar() {
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        flexShrink: 0,
        borderRadius: "50%",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        mt: 0.25,
      }}
    >
      G
    </Box>
  );
}

function OptionChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        appearance: "none",
        font: "inherit",
        cursor: "pointer",
        border: 1,
        borderColor: "outlineVariant.main",
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: 999,
        px: 1.75,
        py: 0.75,
        fontSize: 14,
        fontWeight: 500,
        transition: "background-color 120ms ease, border-color 120ms ease",
        "&:hover": { bgcolor: "surfaceContainer.low", borderColor: "primary.main" },
      }}
    >
      {label}
    </Box>
  );
}

// Assistant messages render full-width (no bubble) with an avatar, like ChatGPT/
// Claude/Gemini. User messages render as a subtle right-aligned pill.
export function ChatBubble({ role, text, options, optionsActive, onOptionClick }: Props) {
  if (role === "user") {
    return (
      <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
        <Box
          sx={{
            maxWidth: "80%",
            px: 2,
            py: 1.25,
            fontSize: 15,
            lineHeight: 1.5,
            whiteSpace: "pre-line",
            bgcolor: "surfaceContainer.high",
            color: "text.primary",
            borderRadius: "18px 18px 4px 18px",
          }}
        >
          {text}
        </Box>
      </Stack>
    );
  }

  return (
    <Stack direction="row" gap={1.5} alignItems="flex-start" sx={{ width: "100%" }}>
      <GlaideAvatar />
      <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
        <Typography
          sx={{
            fontSize: 15.5,
            lineHeight: 1.65,
            color: "text.primary",
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </Typography>
        {optionsActive && options && options.length > 0 && (
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
            {options.map((opt) => (
              <OptionChip key={opt} label={opt} onClick={() => onOptionClick?.(opt)} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export function TypingIndicator() {
  return (
    <Stack direction="row" gap={1.5} alignItems="flex-start" sx={{ width: "100%" }}>
      <GlaideAvatar />
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, height: 26 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: "text.secondary",
              opacity: 0.5,
              animation: "glaide-typing 1s infinite ease-in-out",
              animationDelay: `${i * 0.15}s`,
              "@keyframes glaide-typing": {
                "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.4 },
                "30%": { transform: "translateY(-3px)", opacity: 0.9 },
              },
            }}
          />
        ))}
      </Box>
    </Stack>
  );
}
