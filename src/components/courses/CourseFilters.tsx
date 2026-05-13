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
      justifyContent="center"
      gap={1.5}
      sx={{
        py: 1.5,
        bgcolor: "surfaceContainer.highest",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: "text.secondary",
          mr: 1,
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
