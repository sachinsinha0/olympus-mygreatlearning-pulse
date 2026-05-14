import { Box, Stack, Typography } from "@mui/material";

export type FilterKey = "active" | "selfPaced" | "closed";

type Props = {
  selected: FilterKey | null;
  counts: Record<FilterKey, number>;
  onSelect: (key: FilterKey | null) => void;
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "selfPaced", label: "Self-Paced" },
  { key: "closed", label: "Closed" },
];

export function CourseFilters({ selected, counts, onSelect }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={{ xs: "flex-start", sm: "center" }}
      gap={{ xs: 1, sm: 1.5 }}
      sx={{
        py: 1.5,
        px: { xs: 2, sm: 0 },
        bgcolor: "surfaceContainer.highest",
        flexWrap: "wrap",
        overflowX: { xs: "auto", sm: "visible" },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: "text.secondary",
          mr: { xs: 0, sm: 1 },
          display: { xs: "none", sm: "block" },
        }}
      >
        Course Filters:
      </Typography>
      {FILTERS.map(({ key, label }) => {
        const isSelected = selected === key;
        return (
          <Box
            key={key}
            onClick={() => onSelect(isSelected ? null : key)}
            sx={{
              cursor: "pointer",
              px: 2,
              py: 0.75,
              borderRadius: "8px",
              border: 1,
              borderColor: isSelected ? "primary.main" : "outlineVariant.main",
              bgcolor: isSelected ? "primary.light" : "surfaceContainer.highest",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.2px",
              color: isSelected ? "primary.main" : "text.primary",
              transition: "border-color 120ms ease, background-color 120ms ease",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            {label} ({counts[key]})
          </Box>
        );
      })}
    </Stack>
  );
}
