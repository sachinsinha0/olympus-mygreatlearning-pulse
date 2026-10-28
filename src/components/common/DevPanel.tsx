import { useEffect, useState } from "react";
import { Box, Button, ButtonBase, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePricing, type PricingState } from "../../lib/pulse/pricing";
import { useLearningProgress } from "../../lib/pulse/learningProgress";
import { clearIntroSeen, useHasSeenIntro } from "../../lib/pulse/onboarding";
import { useFeeAccount, type FeeScenario } from "../../lib/fees/feeAccount";
import { FAILURE_CODES, FAILURE_REASONS, type FailureCode } from "../../lib/fees/failures";

/**
 * Dev Panel (⌘K). Feature-specific: on the fee payment pages it holds only the
 * payment settings and shortcuts; everywhere else, the general settings.
 */
export function DevPanel() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const feePayment = pathname.startsWith("/fee_payment");

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
          {feePayment && (
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: "999px",
                bgcolor: "primary.light",
                color: "primary.dark",
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              Fee Payment
            </Box>
          )}
        </Stack>
        <IconButton onClick={() => setOpen(false)} size="small" disableRipple>
          <X size={18} />
        </IconButton>
      </Stack>
      <Box sx={{ p: 2.5, flex: 1, overflow: "auto" }}>
        {feePayment ? <FeePaymentSettings onJump={() => setOpen(false)} /> : <GeneralSettings />}
      </Box>
    </Drawer>
  );
}

function GeneralSettings() {
  const { state, activeUntil, trialStartedAt, setState, setActiveUntil, startTrial, reset: resetPricing } = usePricing();
  const { reset: resetLearning } = useLearningProgress();
  const introSeen = useHasSeenIntro();
  const { reset: resetFees } = useFeeAccount();

  const resetAll = () => {
    resetPricing();
    resetFees();
    resetLearning();
    clearIntroSeen();
  };

  return (
    <>
      <Section title="Pulse Pricing">
        <SegmentedControl
          value={state}
          onChange={(v) => {
            setState(v);
            if (v === "paid") {
              // Subscribing today → membership runs for one year.
              const oneYear = new Date();
              oneYear.setFullYear(oneYear.getFullYear() + 1);
              setActiveUntil(oneYear.toISOString().slice(0, 10));
            } else if (v === "expired") {
              // Subscription that ended yesterday.
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              setActiveUntil(yesterday.toISOString().slice(0, 10));
            }
          }}
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

      <Section title="Onboarding">
        <Button
          variant="outlined"
          fullWidth
          disableElevation
          disabled={!introSeen}
          onClick={() => clearIntroSeen()}
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
            "&.Mui-disabled": {
              color: theme.palette.text.disabled,
              borderColor: theme.palette.outlineVariant.main,
            },
          })}
        >
          {introSeen ? "Reset onboarding (show intro again)" : "Onboarding not yet seen"}
        </Button>
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
    </>
  );
}

type NextPayment = "succeeds" | "fails";

/** Payment-only settings, shown on /fee_payment pages. */
function FeePaymentSettings({ onJump }: { onJump: () => void }) {
  const navigate = useNavigate();
  const { account, setScenario, setReferralEnabled, setNextFailure, previewPayment, previewFailure, reset } = useFeeAccount();
  // The reason picked for failures, remembered while the next payment is set to succeed.
  const [reason, setReason] = useState<FailureCode>(account.nextFailure ?? "declined");
  const next: NextPayment = account.nextFailure ? "fails" : "succeeds";

  const jump = (path: string) => {
    navigate(path);
    onJump();
  };

  return (
    <Stack gap={3}>
      <Section title="Program">
        <SegmentedControl<FeeScenario>
          value={account.scenario}
          onChange={setScenario}
          options={[
            { value: "due", label: "Payment due (₹)" },
            { value: "paid", label: "All paid ($)" },
          ]}
        />
        <Hint>Refreshing the page, or picking a program, starts it over unpaid so you can run the payment flow again.</Hint>
      </Section>

      <Section title="Next payment">
        <SegmentedControl<NextPayment>
          value={next}
          onChange={(v) => setNextFailure(v === "fails" ? reason : null)}
          options={[
            { value: "succeeds", label: "Succeeds" },
            { value: "fails", label: "Fails" },
          ]}
        />
        {next === "fails" && (
          <Stack gap={1}>
            <Label>Fails because</Label>
            <OptionGrid<FailureCode>
              value={reason}
              onChange={(c) => {
                setReason(c);
                setNextFailure(c);
              }}
              options={FAILURE_CODES.map((c) => ({ value: c, label: FAILURE_REASONS[c].label }))}
            />
          </Stack>
        )}
        <Hint>
          {next === "fails"
            ? "Only the next payment fails. It then goes back to succeeding, so Retry on the failure page goes through."
            : "Set this to Fails to see the failure page at the end of the payment flow."}
        </Hint>
      </Section>

      <Section title="Thank-you page">
        <SegmentedControl<"on" | "off">
          value={account.referralEnabled ? "on" : "off"}
          onChange={(v) => setReferralEnabled(v === "on")}
          options={[
            { value: "on", label: "With Refer & Earn" },
            { value: "off", label: "Without" },
          ]}
        />
      </Section>

      <Section title="Jump to">
        <Stack gap={1}>
          <JumpButton label="Payment page" onClick={() => jump("/fee_payment")} />
          <JumpButton
            label="Payment successful"
            onClick={() => {
              const txn = previewPayment();
              jump(`/fee_payment/success?gl_trace_id=${txn.traceId}&txn_id=${txn.txnId}`);
            }}
          />
          <JumpButton
            label={`Payment failed: ${FAILURE_REASONS[reason].label}`}
            onClick={() => {
              const attempt = previewFailure(reason);
              jump(`/fee_payment/failed?gl_trace_id=${attempt.traceId}&txn_id=${attempt.txnId}`);
            }}
          />
        </Stack>
        <Hint>Opens the page with sample data. The payment schedule isn't changed.</Hint>
      </Section>

      <PanelButton
        icon={<RotateCcw size={14} />}
        onClick={() => {
          reset();
          setReason("declined");
          jump("/fee_payment");
        }}
      >
        Reset fee payment
      </PanelButton>
    </Stack>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <Typography sx={{ fontSize: 12.5, lineHeight: "18px", color: "text.secondary" }}>{children}</Typography>;
}

function JumpButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={(theme) => ({
        justifyContent: "space-between",
        gap: 1,
        height: 40,
        px: 1.5,
        borderRadius: "8px",
        border: `1px solid ${theme.palette.outlineVariant.main}`,
        fontSize: 13,
        fontWeight: 500,
        color: "text.primary",
        textAlign: "left",
        "&:hover": { borderColor: theme.palette.text.primary },
        "&:focus-visible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
      })}
    >
      {label}
      <ArrowRight size={14} />
    </ButtonBase>
  );
}

function PanelButton({ children, icon, onClick }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Button
      variant="outlined"
      fullWidth
      disableElevation
      onClick={onClick}
      startIcon={icon}
      sx={(theme) => ({
        height: 38,
        fontSize: 13,
        fontWeight: 600,
        textTransform: "none",
        borderRadius: "8px",
        borderColor: theme.palette.outlineVariant.main,
        color: theme.palette.text.primary,
        "&:hover": { borderColor: theme.palette.text.primary, bgcolor: "transparent" },
      })}
    >
      {children}
    </Button>
  );
}

/** Like SegmentedControl, for more options than fit on one row: a wrapping 2-column grid. */
function OptionGrid<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: Option<T>[] }) {
  return (
    <Box role="radiogroup" sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 0.5, p: 0.5, bgcolor: "outlineVariant.main", borderRadius: "8px" }}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <ButtonBase
            key={opt.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            sx={{
              py: 0.75,
              px: 1,
              borderRadius: "6px",
              bgcolor: selected ? "surfaceContainer.highest" : "transparent",
              boxShadow: selected ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              fontSize: 12.5,
              fontWeight: 500,
              color: selected ? "text.primary" : "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            {opt.label}
          </ButtonBase>
        );
      })}
    </Box>
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
