import { useEffect, useState } from "react";
import { Box, Button, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { RotateCcw, X } from "lucide-react";
import { usePricing, type PricingState } from "../../lib/pulse/pricing";
import { useLearningProgress } from "../../lib/pulse/learningProgress";

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const { state, activeUntil, trialStartedAt, setState, setActiveUntil, startTrial, reset: resetPricing } = usePricing();
  const { reset: resetLearning } = useLearningProgress();

  const resetAll = () => {
    resetPricing();
    resetLearning();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("dev-panel:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("dev-panel:open", onOpen);
    };
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          maxWidth: 420,
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

          {state === "trial" && (
            <Stack gap={0.75} sx={{ mt: 2 }}>
              <Label>Trial status</Label>
              <SegmentedControl<"not-started" | "started" | "expired">
                value={
                  !trialStartedAt
                    ? "not-started"
                    : activeUntil && new Date(activeUntil).getTime() < Date.now()
                    ? "expired"
                    : "started"
                }
                onChange={(v) => {
                  if (v === "started") {
                    startTrial();
                  } else if (v === "expired") {
                    // Trial that ended: trial started, activeUntil now in the past.
                    startTrial();
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setActiveUntil(yesterday.toISOString().slice(0, 10));
                  } else {
                    setState("trial");
                  }
                }}
                options={[
                  { value: "not-started", label: "Not started" },
                  { value: "started", label: "Started" },
                  { value: "expired", label: "Expired" },
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

        </Section>

        <Box sx={{ height: 24 }} />

        <Button
          variant="outlined"
          fullWidth
          disableElevation
          onClick={resetAll}
          startIcon={<RotateCcw size={14} />}
          sx={(theme) => ({
            height: 38,
            fontSize: 13,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "8px",
            borderColor: theme.palette.outlineVariant.main,
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.text.primary,
              bgcolor: "transparent",
            },
          })}
        >
          Reset everything to default
        </Button>
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
