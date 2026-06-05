import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronRight } from "lucide-react";
import data from "../../mocks/programSupport.json";

type Item = { course: string; name: string };
const top = (data.projectPicker.top as Item[]) ?? [];

const cardSx = {
  appearance: "none",
  font: "inherit",
  textAlign: "left" as const,
  cursor: "pointer",
  width: "100%",
  border: 1,
  borderColor: "outlineVariant.main",
  borderRadius: "12px",
  bgcolor: "background.paper",
  transition: "background-color 120ms ease, border-color 120ms ease",
  "&:hover": {
    bgcolor: (t: import("@mui/material").Theme) => alpha(t.palette.primary.main, 0.08),
    borderColor: "primary.main",
  },
};

// Top-3 project cards (course + name) plus an "Other" escape, shown under the
// opening Glaide message when a learner picks the Projects topic.
export function ProjectPicker({
  onPick,
  onOther,
}: {
  onPick: (course: string, name: string) => void;
  onOther: () => void;
}) {
  return (
    <Stack gap={1} sx={{ mt: 1.5, maxWidth: 460 }}>
      {top.map((p) => (
        <Box
          key={p.name}
          component="button"
          type="button"
          onClick={() => onPick(p.course, p.name)}
          sx={{ ...cardSx, display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5 }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "primary.main",
                mb: 0.25,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.course}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
              {p.name}
            </Typography>
          </Box>
          <Box sx={{ color: "text.secondary", display: "flex", flexShrink: 0 }}>
            <ChevronRight size={18} strokeWidth={2} />
          </Box>
        </Box>
      ))}

      <Box
        component="button"
        type="button"
        onClick={onOther}
        sx={{
          ...cardSx,
          px: 2,
          py: 1.25,
          fontSize: 14,
          fontWeight: 500,
          color: "text.secondary",
          "&:hover": {
            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
            borderColor: "primary.main",
            color: "text.primary",
          },
        }}
      >
        My project isn't listed
      </Box>
    </Stack>
  );
}
