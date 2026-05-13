import { Box, Card, Stack, Typography } from "@mui/material";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pattern1 from "../../assets/patterns/pattern1.svg";
import pattern9 from "../../assets/patterns/pattern9.svg";

const PATTERNS: Record<string, string> = { pattern1, pattern9 };

type Props = {
  id: string;
  title: string;
  pattern: string;
  thumbBg: string;
  progress?: number;
  marks?: string;
  score?: string;
  atRisk?: boolean;
  locked?: boolean;
};

export function CourseCard({ id, title, pattern, thumbBg, progress, marks, score, atRisk, locked }: Props) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => !locked && navigate(`/courses/${id}`)}
      sx={{
        p: 2,
        height: "100%",
        bgcolor: "surfaceContainer.highest",
        border: 1,
        borderColor: "outlineVariant.main",
        boxShadow: "none",
        cursor: "pointer",
        transition: "border-color 120ms ease, box-shadow 120ms ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "8px",
            bgcolor: thumbBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Box component="img" src={PATTERNS[pattern] || pattern1} alt="" sx={{ width: 72, height: 72 }} />
        </Box>
        {atRisk && (
          <Box
            sx={(theme) => ({
              px: 1.25,
              py: 0.5,
              borderRadius: "8px",
              border: 1,
              borderColor: theme.palette.extended.warning.color,
              bgcolor: theme.palette.extended.warning.colorContainer,
              color: theme.palette.extended.warning.color,
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "16px",
              letterSpacing: "-0.2px",
            })}
          >
            At Risk
          </Box>
        )}
      </Stack>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          lineHeight: "20px",
          color: "text.primary",
          mb: 1,
          minHeight: 40,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </Typography>
      {locked ? (
        <Stack direction="row" gap={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
          <Lock size={12} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
            Locked
          </Typography>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 72,
              height: 4,
              borderRadius: 2,
              bgcolor: "outlineVariant.main",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: `${Math.min(100, Math.max(0, progress ?? 0))}%`,
                height: "100%",
                bgcolor: "#757680",
                borderRadius: 2,
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
            {progress ?? 0}%
          </Typography>
          {(marks || score) && (
            <>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>·</Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary", letterSpacing: "-0.2px" }}>
                {marks ? `Marks: ${marks}` : `Score: ${score}`}
              </Typography>
            </>
          )}
        </Stack>
      )}
    </Card>
  );
}
