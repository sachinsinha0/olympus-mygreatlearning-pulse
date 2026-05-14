import { useEffect, useState } from "react";
import { Box, Drawer, IconButton, MenuItem, Select, Stack, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { ChevronDown, RotateCcw, X } from "lucide-react";
import { usePricing, type PricingState, type Plan } from "../../lib/pulse/pricing";
import { useRelease, type Release, V1_ISSUE_LIMIT } from "../../lib/pulse/release";
import {
  useDesignVersion,
  DESIGN_VERSIONS,
  DEFAULT_DESIGN_VERSION,
  type DesignVersion,
} from "../../lib/pulse/designVersion";

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const { state, plan, activeUntil, trialStartedAt, setState, setPlan, setActiveUntil, startTrial, reset } = usePricing();
  const { release, setRelease } = useRelease();
  const { designVersion, setDesignVersion } = useDesignVersion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          width: 420,
          bgcolor: "surfaceContainer.highest",
          borderLeft: 1,
          borderColor: "outlineVariant.main",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: 1,
          borderColor: "outlineVariant.main",
        }}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", letterSpacing: "-0.2px" }}>
            Dev Panel
          </Typography>
          <Box
            sx={{
              px: 0.75,
              py: 0.25,
              border: 1,
              borderColor: "outlineVariant.main",
              borderRadius: "4px",
              fontSize: 11,
              fontWeight: 500,
              color: "text.secondary",
              letterSpacing: "0.2px",
            }}
          >
            ⌘K
          </Box>
        </Stack>
        <IconButton onClick={() => setOpen(false)} size="small" disableRipple>
          <X size={18} />
        </IconButton>
      </Stack>
      <Box sx={{ p: 2.5, flex: 1, overflow: "auto" }}>
        <Section title="Release Version">
          <SegmentedControl<Release>
            value={release}
            onChange={setRelease}
            options={[
              { value: "v1", label: `V1 · ${V1_ISSUE_LIMIT} courses` },
              { value: "v2", label: "V2 · Full" },
            ]}
          />
          <Typography
            sx={{
              mt: 1,
              fontSize: 12,
              color: "text.secondary",
              lineHeight: 1.45,
            }}
          >
            {release === "v1"
              ? `V1: first ${V1_ISSUE_LIMIT} releases only. Hides Most Popular and all learner social-proof (ratings, completions, weekly readers).`
              : "V2: full catalog with cohort/social-proof metadata."}
          </Typography>
        </Section>

        <Box sx={{ height: 24 }} />

        <Section title="Pulse Pricing">
          <SegmentedControl
            value={state}
            onChange={setState}
            options={[
              { value: "trial", label: "Trial" },
              { value: "paid", label: "Paid" },
              { value: "expired", label: "Expired" },
            ]}
          />

          {state === "paid" && (
            <Stack gap={0.75} sx={{ mt: 2 }}>
              <Label>Plan</Label>
              <SegmentedControl<Plan>
                value={plan ?? "monthly"}
                onChange={setPlan}
                options={[
                  { value: "monthly", label: "Monthly · $100/mo" },
                  { value: "annual", label: "Annual · $999/yr" },
                ]}
              />
            </Stack>
          )}

          {state === "trial" && (
            <Stack gap={0.75} sx={{ mt: 2 }}>
              <Label>Trial status</Label>
              <SegmentedControl<"not-started" | "started">
                value={trialStartedAt ? "started" : "not-started"}
                onChange={(v) => {
                  if (v === "started") startTrial();
                  else setState("trial");
                }}
                options={[
                  { value: "not-started", label: "Not started" },
                  { value: "started", label: "Started" },
                ]}
              />
            </Stack>
          )}

          {(state !== "trial" || trialStartedAt) && (
          <Stack gap={0.75} sx={{ mt: 2 }}>
            <Label>
              {state === "trial" ? "Trial ends on" : state === "paid" ? "Renews on" : "Ended on"}
            </Label>
            <Box
              component="input"
              type="date"
              value={activeUntil ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActiveUntil(e.target.value || null)}
              sx={{
                height: 36,
                px: 1.25,
                border: 1,
                borderColor: "outlineVariant.main",
                borderRadius: "8px",
                bgcolor: "surfaceContainer.highest",
                color: "text.primary",
                fontFamily: "inherit",
                fontSize: 14,
                outline: "none",
                "&:focus": { borderColor: "primary.main" },
              }}
            />
          </Stack>
          )}

          <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 2 }}>
            <IconButton onClick={reset} size="small" disableRipple sx={{ color: "text.secondary" }}>
              <RotateCcw size={14} />
            </IconButton>
            <Typography
              onClick={reset}
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "text.secondary",
                cursor: "pointer",
                letterSpacing: "-0.2px",
                "&:hover": { color: "primary.main" },
              }}
            >
              Reset to default (Trial · 30 days)
            </Typography>
          </Stack>
        </Section>

        <Box sx={{ height: 24 }} />

        <Section title="Design Version">
          <Select<DesignVersion>
            value={designVersion}
            onChange={(e: SelectChangeEvent<DesignVersion>) =>
              setDesignVersion(e.target.value as DesignVersion)
            }
            IconComponent={(props) => (
              <Box
                {...props}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                  pr: 1.25,
                  color: "text.secondary",
                }}
              >
                <ChevronDown size={16} />
              </Box>
            )}
            sx={(theme) => ({
              height: 40,
              fontSize: 13,
              fontWeight: 500,
              bgcolor: "surfaceContainer.highest",
              "& .MuiSelect-select": {
                py: 1,
                pl: 1.5,
                pr: "32px !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.outlineVariant.main,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.disabled,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
                borderWidth: 1,
              },
            })}
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 0.5,
                  borderRadius: "10px",
                  bgcolor: "surfaceContainer.highest",
                  border: 1,
                  borderColor: "outlineVariant.main",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                },
              },
            }}
          >
            {DESIGN_VERSIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                sx={{ py: 1, gap: 0.75 }}
              >
                <Typography
                  sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", lineHeight: 1.2 }}
                >
                  {opt.label}
                </Typography>
                {opt.value === DEFAULT_DESIGN_VERSION && (
                  <Typography
                    sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.2 }}
                  >
                    (Default)
                  </Typography>
                )}
              </MenuItem>
            ))}
          </Select>
        </Section>
      </Box>
    </Drawer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap={1.5}>
      <Label>{title}</Label>
      {children}
    </Stack>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        color: "text.secondary",
      }}
    >
      {children}
    </Typography>
  );
}

type Option<T> = { value: T; label: string };

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
}) {
  return (
    <Stack
      direction="row"
      sx={{
        p: 0.5,
        bgcolor: "outlineVariant.main",
        borderRadius: "8px",
      }}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Box
            key={opt.value}
            onClick={() => onChange(opt.value)}
            sx={{
              flex: 1,
              textAlign: "center",
              py: 0.75,
              px: 0.5,
              cursor: "pointer",
              borderRadius: "6px",
              bgcolor: selected ? "surfaceContainer.highest" : "transparent",
              boxShadow: selected ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              fontSize: 12.5,
              fontWeight: 500,
              color: selected ? "text.primary" : "text.secondary",
              transition: "background-color 120ms ease, color 120ms ease",
              "&:hover": { color: "text.primary" },
            }}
          >
            {opt.label}
          </Box>
        );
      })}
    </Stack>
  );
}
