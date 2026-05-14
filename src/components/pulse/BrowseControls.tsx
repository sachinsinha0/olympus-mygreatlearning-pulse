import { Box, InputBase, MenuItem, Select, Stack } from "@mui/material";
import { Search } from "lucide-react";
import type { TopicTag } from "../../lib/pulse/types";
import { FILTER_TAGS, TAG_LABELS } from "../../lib/pulse/types";
import { useUnitLabel } from "../../lib/pulse/terminology";

export type SortKey = "latest" | "popular" | "rated";

const SORT_LABELS: Record<SortKey, string> = {
  latest: "Latest",
  popular: "Most read",
  rated: "Top rated",
};

type Props = {
  query: string;
  onQuery: (q: string) => void;
  activeTag: TopicTag | "all";
  onTag: (t: TopicTag | "all") => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
};

export function BrowseControls({ query, onQuery, activeTag, onTag, sort, onSort }: Props) {
  const chips: (TopicTag | "all")[] = ["all", ...FILTER_TAGS];
  const unit = useUnitLabel();
  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1.5} alignItems="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
            bgcolor: "surfaceContainer.highest",
            border: 1,
            borderColor: "outlineVariant.main",
            borderRadius: "10px",
            px: 1.5,
            height: 40,
            "&:focus-within": { borderColor: "primary.main" },
          }}
        >
          <Search size={16} color="currentColor" style={{ opacity: 0.6 }} />
          <InputBase
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={`Search ${unit.plural.toLowerCase()} by title or topic`}
            sx={{ flex: 1, fontSize: 14, color: "text.primary" }}
          />
        </Box>
        <Select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
          size="small"
          sx={{
            height: 40,
            minWidth: 140,
            bgcolor: "surfaceContainer.highest",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
            fontSize: 14,
          }}
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <MenuItem key={k} value={k} sx={{ fontSize: 14 }}>
              Sort: {SORT_LABELS[k]}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {chips.map((t) => {
          const active = activeTag === t;
          return (
            <Box
              key={t}
              onClick={() => onTag(t)}
              sx={{
                px: 1.5,
                py: 0.75,
                fontSize: 13,
                fontWeight: 500,
                borderRadius: "999px",
                border: 1,
                borderColor: active ? "primary.main" : "outlineVariant.main",
                bgcolor: active ? "primary.main" : "surfaceContainer.highest",
                color: active ? "primary.contrastText" : "text.primary",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: active ? "primary.main" : (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(179, 197, 255, 0.10)"
                      : "rgba(218, 225, 255, 0.4)",
                },
              }}
            >
              {t === "all" ? "All" : TAG_LABELS[t]}
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
