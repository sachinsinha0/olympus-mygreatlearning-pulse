import { Box, Stack } from "@mui/material";
import { Sparkles } from "lucide-react";

const GLAIDE_GRADIENT =
  "linear-gradient(135deg, #0054d6 0%, #60A5FA 55%, #DBEAFE 100%)";

type Props = {
  role: "bot" | "user";
  text: string;
};

export function ChatBubble({ role, text }: Props) {
  const isUser = role === "user";

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="flex-end"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      sx={{ width: "100%" }}
    >
      {!isUser && (
        <Box
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            borderRadius: "10px",
            backgroundImage: GLAIDE_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.contrastText",
          }}
        >
          <Sparkles size={14} strokeWidth={2} color="currentColor" />
        </Box>
      )}

      <Box
        sx={{
          maxWidth: "78%",
          px: 2,
          py: 1.25,
          fontSize: 15,
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          bgcolor: isUser ? "primary.main" : "surfaceContainer.low",
          color: isUser ? "primary.contrastText" : "text.primary",
          borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
        }}
      >
        {text}
      </Box>
    </Stack>
  );
}

export function TypingIndicator() {
  return (
    <Stack direction="row" gap={1} alignItems="flex-end" justifyContent="flex-start" sx={{ width: "100%" }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius: "10px",
          backgroundImage: GLAIDE_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.contrastText",
        }}
      >
        <Sparkles size={14} strokeWidth={2} color="currentColor" />
      </Box>
      <Box
        sx={{
          px: 2,
          py: 1.25,
          bgcolor: "surfaceContainer.low",
          borderRadius: "4px 16px 16px 16px",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
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
