import { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { ChevronDown, Check } from "lucide-react";

const PROGRAMS = [
  { id: "pgp-babi-intl-1", code: "PGP-BABI-INTL-1", name: "PGP-DSBA UT Austin JAN19" },
  { id: "pgp-dsba", code: "PGP-DSBA", name: "Post Graduate Program in Data Science" },
  { id: "pgp-aiml", code: "PGP-AIML", name: "Post Graduate Program in AI & ML" },
] as const;

export function ProgramSwitcher() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<string>("pgp-babi-intl-1");
  const current = PROGRAMS.find((p) => p.id === selected) ?? PROGRAMS[0];
  return (
    <>
      <Button
        onClick={(e) => setAnchor(e.currentTarget)}
        endIcon={<ChevronDown size={14} />}
        disableRipple
        sx={{
          height: 32,
          px: 1,
          py: 0,
          borderRadius: "8px",
          border: 1,
          borderColor: "outlineVariant.main",
          bgcolor: "surfaceContainer.highest",
          color: "primary.main",
          fontWeight: 500,
          fontSize: 14,
          justifyContent: "space-between",
          width: 134,
          minWidth: 134,
          "&:hover": { borderColor: "outline.main", bgcolor: "surfaceContainer.high" },
          "& .MuiButton-endIcon": { ml: 0.5, color: "primary.main" },
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>
          {current.code}
        </span>
      </Button>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 320,
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              border: 1,
              borderColor: "outlineVariant.main",
            },
          },
        }}
      >
        {PROGRAMS.map((p) => (
          <MenuItem
            key={p.id}
            onClick={() => { setSelected(p.id); setAnchor(null); }}
            sx={{
              py: 1.25,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.code}</div>
              <div style={{ fontSize: 12, color: "var(--mui-palette-text-secondary, #5e5e62)" }}>{p.name}</div>
            </div>
            {p.id === selected && <Check size={16} color="#0054d6" />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
