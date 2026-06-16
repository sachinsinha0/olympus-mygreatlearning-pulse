# Pulse Exit-Intent + Trial CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture *why* users leave Pulse before starting the trial (an exit-intent dialog), and reduce trial friction by making the banner CTA say "free" with a "No credit card required" reassurance.

**Architecture:** Migrate the app from declarative `<BrowserRouter>` to a data router (`createBrowserRouter` + `RouterProvider`) so React Router's `useBlocker` is available. A small `ExitIntentGuard` mounted on the Pulse pages uses `useBlocker` to intercept navigation **out of** `/pulse*` (in-app nav-away and browser Back) when the trial hasn't started, showing a capture-only dialog wired to a thin analytics shim. Separately, the pre-trial banner CTA copy gains "free" + a no-card reassurance line.

**Tech Stack:** React 18, TypeScript, MUI v6, react-router-dom v7.15, lucide-react, Vitest (node env).

**Branch:** `feature/pulse-exit-intent-trial-cta` (already created; spec already committed there).

**Spec:** `docs/superpowers/specs/2026-06-15-pulse-exit-intent-and-trial-cta-design.md`

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `src/lib/pulse/exitIntent.ts` | Pure exit logic: `isExitFromPulse`, `EXIT_INTENT_REASONS`, session show-once helpers | Create |
| `src/lib/pulse/exitIntent.test.ts` | Unit tests for the pure logic | Create |
| `src/lib/analytics.ts` | `track(event, props)` shim → `window.mixpanel` or `console.debug` | Create |
| `src/components/pulse/ExitIntentDialog.tsx` | Presentational capture-only dialog (reason chips + note) | Create |
| `src/components/pulse/ExitIntentGuard.tsx` | Wires `useBlocker` + pricing state + analytics to the dialog | Create |
| `src/App.tsx` | Data-router migration (`createBrowserRouter` + `RootLayout`) | Modify |
| `src/pages/Pulse/PulseHome.tsx` | Mount `<ExitIntentGuard source="pulse_home" />` | Modify |
| `src/pages/Pulse/PulseIntroPage.tsx` | Mount `<ExitIntentGuard source="onboarding" />` | Modify |
| `src/components/pulse/PulseV2Hero.tsx` | Feature B: CTA copy + no-card reassurance (pre-trial only) | Modify |

**Test note:** Vitest is configured with `environment: "node"` and `include: ["src/**/*.test.ts"]` — no jsdom. Only the pure logic in Task 1 is unit-tested. All other tasks are verified with `npm run build` (TypeScript typecheck via `tsc -b`, then vite build) plus the manual walkthrough in Task 7. This matches the existing repo convention (storage helpers in `onboarding.ts` are not unit-tested).

---

## Task 1: Pure exit-intent logic + tests

**Files:**
- Create: `src/lib/pulse/exitIntent.ts`
- Test: `src/lib/pulse/exitIntent.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/pulse/exitIntent.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { isExitFromPulse, EXIT_INTENT_REASONS } from "./exitIntent";

describe("isExitFromPulse", () => {
  it("blocks leaving the Pulse area for a non-Pulse route", () => {
    expect(isExitFromPulse("/pulse", "/")).toBe(true);
    expect(isExitFromPulse("/pulse/intro", "/courses")).toBe(true);
    expect(isExitFromPulse("/pulse/modules/m1", "/program_support")).toBe(true);
  });

  it("does not block navigation within the Pulse area", () => {
    expect(isExitFromPulse("/pulse/intro", "/pulse")).toBe(false);
    expect(isExitFromPulse("/pulse", "/pulse/modules/m1")).toBe(false);
  });

  it("does not block navigation that starts outside Pulse", () => {
    expect(isExitFromPulse("/", "/courses")).toBe(false);
    expect(isExitFromPulse("/courses", "/")).toBe(false);
  });

  it("treats lookalike paths outside /pulse as non-Pulse", () => {
    expect(isExitFromPulse("/pulse", "/pulse-x")).toBe(true);
    expect(isExitFromPulse("/pulse-x", "/pulse")).toBe(false);
  });
});

describe("EXIT_INTENT_REASONS", () => {
  it("has unique ids and includes the cost concern", () => {
    const ids = EXIT_INTENT_REASONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("cost");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/pulse/exitIntent.test.ts`
Expected: FAIL — cannot resolve `./exitIntent` (module not created yet).

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/pulse/exitIntent.ts`:

```ts
const STORAGE_KEY = "pulse-exit-intent-shown";

export type ExitIntentReason = { id: string; label: string };

export const EXIT_INTENT_REASONS: ExitIntentReason[] = [
  { id: "not-sure", label: "Not sure what Pulse is" },
  { id: "no-time", label: "No time right now" },
  { id: "cost", label: "Worried about cost / being charged" },
  { id: "not-relevant", label: "Not relevant to me" },
  { id: "browsing", label: "Just browsing" },
  { id: "other", label: "Other" },
];

const inPulse = (p: string) => p === "/pulse" || p.startsWith("/pulse/");

/**
 * True when navigating OUT of the Pulse area: current path is under /pulse and
 * the destination is not. Navigating within Pulse never counts.
 */
export function isExitFromPulse(currentPath: string, nextPath: string): boolean {
  return inPulse(currentPath) && !inPulse(nextPath);
}

/** Whether the exit-intent dialog has already been shown this browser session. */
export function hasShownExitIntent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Mark the exit-intent dialog as shown for the rest of this session. */
export function markExitIntentShown(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/pulse/exitIntent.test.ts`
Expected: PASS — 2 suites, 5 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pulse/exitIntent.ts src/lib/pulse/exitIntent.test.ts
git commit -m "feat(pulse): pure exit-intent logic + reason list"
```

---

## Task 2: Analytics shim

**Files:**
- Create: `src/lib/analytics.ts`

No unit test (window-bound; node test env has no `window.mixpanel`). Verified by typecheck in later tasks and by the manual walkthrough.

- [ ] **Step 1: Create the shim**

Create `src/lib/analytics.ts`:

```ts
type MixpanelLike = { track?: (event: string, props?: Record<string, unknown>) => void };

declare global {
  interface Window {
    mixpanel?: MixpanelLike;
  }
}

/**
 * Thin analytics shim for the prototype. Forwards to window.mixpanel.track when
 * the real SDK is present; otherwise logs to the console. Event names mirror the
 * production GL:* convention so this is a drop-in once Mixpanel is wired.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.mixpanel?.track === "function") {
    window.mixpanel.track(event, props);
    return;
  }
  // eslint-disable-next-line no-console
  console.debug("[track]", event, props ?? {});
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run build`
Expected: PASS — `tsc -b` reports no errors, vite build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat: thin analytics track() shim mirroring GL:* events"
```

---

## Task 3: Feature B — banner CTA copy + no-card reassurance

**Files:**
- Modify: `src/components/pulse/PulseV2Hero.tsx`

This task is independent of the exit-intent work. `Lock` and `Stack` are already imported in this file — no new imports needed. The reassurance must show **only** in the pre-trial state (the same `MarketingHero` is reused when the trial is active, where the CTA reads "Subscribe to Pulse"), so we gate it behind a new `showNoCardReassurance` flag on `HeroCopy`.

- [ ] **Step 1: Add the flag to the HeroCopy type**

In `src/components/pulse/PulseV2Hero.tsx`, find the `HeroCopy` type (lines ~16-23):

```tsx
type HeroCopy = {
  headline: React.ReactNode;
  subtitle: string;
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
  ctaMode: CtaMode;
  trialStatus?: { expiresAt: string; daysLeft: number };
};
```

Replace with (adds `showNoCardReassurance`):

```tsx
type HeroCopy = {
  headline: React.ReactNode;
  subtitle: string;
  primaryCtaLabel: string;
  onPrimaryCta: () => void;
  ctaMode: CtaMode;
  showNoCardReassurance: boolean;
  trialStatus?: { expiresAt: string; daysLeft: number };
};
```

- [ ] **Step 2: Set the flag false in the trial-active / ended branch**

Find the `if (trialActive || trialEnded)` return block in `useHeroCopy` (lines ~98-110):

```tsx
  if (trialActive || trialEnded) {
    return {
      headline,
      subtitle,
      primaryCtaLabel: "Subscribe to Pulse",
      onPrimaryCta: openPricingModal,
      ctaMode: "none",
      trialStatus:
        trialActive && activeUntil
          ? { expiresAt: activeUntil, daysLeft: daysUntil(activeUntil) }
          : undefined,
    };
  }
```

Replace with (adds `showNoCardReassurance: false`):

```tsx
  if (trialActive || trialEnded) {
    return {
      headline,
      subtitle,
      primaryCtaLabel: "Subscribe to Pulse",
      onPrimaryCta: openPricingModal,
      ctaMode: "none",
      showNoCardReassurance: false,
      trialStatus:
        trialActive && activeUntil
          ? { expiresAt: activeUntil, daysLeft: daysUntil(activeUntil) }
          : undefined,
    };
  }
```

- [ ] **Step 3: Update the pre-trial CTA label + flag**

Find the final return in `useHeroCopy` (lines ~112-130):

```tsx
  return {
    headline,
    subtitle,
    primaryCtaLabel: "Start 30-day trial",
    onPrimaryCta: () => {
```

Replace with (new label + flag):

```tsx
  return {
    headline,
    subtitle,
    primaryCtaLabel: "Start your 30-day free trial",
    showNoCardReassurance: true,
    onPrimaryCta: () => {
```

- [ ] **Step 4: Render the reassurance line beneath the button**

Find the CTA `Stack` in `MarketingHero` (lines ~292-317):

```tsx
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={{ xs: 1.5, sm: 2 }}
          >
            <Button
              variant="contained"
              disableElevation
              endIcon={<ArrowRight size={18} />}
              onClick={handleCta}
              sx={{
                height: { xs: 44, md: 40 },
                px: 2,
                width: { xs: "100%", sm: "auto" },
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "-0.2px",
                textTransform: "none",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              {copy.primaryCtaLabel}
            </Button>
            {copy.trialStatus && <TrialStatusChip status={copy.trialStatus} />}
          </Stack>
```

Replace with (wraps the existing row in a column Stack and appends the reassurance line; the `Button` styling is unchanged):

```tsx
          <Stack gap={1.25} alignItems={{ xs: "stretch", sm: "flex-start" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={{ xs: 1.5, sm: 2 }}
            >
              <Button
                variant="contained"
                disableElevation
                endIcon={<ArrowRight size={18} />}
                onClick={handleCta}
                sx={{
                  height: { xs: 44, md: 40 },
                  px: 2,
                  width: { xs: "100%", sm: "auto" },
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.2px",
                  textTransform: "none",
                  borderRadius: "8px",
                  flexShrink: 0,
                }}
              >
                {copy.primaryCtaLabel}
              </Button>
              {copy.trialStatus && <TrialStatusChip status={copy.trialStatus} />}
            </Stack>
            {copy.showNoCardReassurance && (
              <Stack
                direction="row"
                alignItems="center"
                gap={0.75}
                sx={{ color: "text.secondary", px: { xs: 0.5, sm: 0 } }}
              >
                <Lock size={14} strokeWidth={2} />
                <Typography
                  sx={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.1px", lineHeight: "18px" }}
                >
                  No credit card required
                </Typography>
              </Stack>
            )}
          </Stack>
```

- [ ] **Step 5: Typecheck**

Run: `npm run build`
Expected: PASS — no TypeScript errors (the `showNoCardReassurance` field is now present on every `HeroCopy` return).

- [ ] **Step 6: Commit**

```bash
git add src/components/pulse/PulseV2Hero.tsx
git commit -m "feat(pulse): free trial CTA copy + no-credit-card reassurance"
```

---

## Task 4: Migrate to a data router

**Files:**
- Modify: `src/App.tsx`

`useBlocker` requires a data router. Convert `<BrowserRouter>`/`<Routes>` to `createBrowserRouter` + `RouterProvider`, moving the always-on tree (`PageLoaderProvider`, `ScrollToTop`, `DevPanel`, `PricingModal`, `SupportProvider`) into a `RootLayout` route element that renders `<Outlet />`. No behavior changes in this task — it must look and work identically. Providers in `main.tsx` (`PricingProvider`, `LearningProgressProvider`) stay put; they use no router hooks.

- [ ] **Step 1: Replace the App.tsx router structure**

Replace the entire contents of `src/App.tsx` with:

```tsx
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";
import { DevPanel } from "./components/common/DevPanel";
import { PageLoaderProvider } from "./components/common/PageLoader";
import { PricingModal } from "./components/pulse/PricingModal";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { PulseHome } from "./pages/Pulse/PulseHome";
import { PulseIntroPage } from "./pages/Pulse/PulseIntroPage";
import { PulseConsumePage } from "./pages/Pulse/PulseConsumePage";
import { SubscriptionPage } from "./pages/Pulse/SubscriptionPage";
import { ProgramSupport } from "./pages/ProgramSupport";
import { SupportProvider } from "./context/SupportContext";
import { AskQuestion } from "./pages/AskQuestion";
import { GlaideChat } from "./pages/GlaideChat";
import { GlaideChatMock } from "./pages/GlaideChatMock";
import { ProtoGuidedSteps } from "./pages/ProtoGuidedSteps";
import { ProtoStepper } from "./pages/ProtoStepper";
import { ProtoIndex } from "./pages/ProtoIndex";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RootLayout() {
  return (
    <PageLoaderProvider>
      <ScrollToTop />
      <DevPanel />
      <PricingModal />
      <SupportProvider>
        <Outlet />
      </SupportProvider>
    </PageLoaderProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/courses", element: <Courses /> },
      { path: "/courses/:id", element: <CourseDetail /> },
      { path: "/program_support", element: <ProgramSupport /> },
      { path: "/program_support/ask", element: <AskQuestion /> },
      { path: "/program_support/chat", element: <GlaideChat /> },
      { path: "/program_support/chat/:threadId", element: <GlaideChat /> },
      { path: "/program_support/chat-mock", element: <GlaideChatMock /> },
      { path: "/program_support/proto", element: <ProtoIndex /> },
      { path: "/program_support/proto/a", element: <GlaideChatMock /> },
      { path: "/program_support/proto/b", element: <ProtoGuidedSteps /> },
      { path: "/program_support/proto/c", element: <ProtoStepper /> },
      { path: "/pulse", element: <PulseHome /> },
      { path: "/pulse/intro", element: <PulseIntroPage /> },
      { path: "/pulse/subscription", element: <SubscriptionPage /> },
      { path: "/pulse/modules/:moduleId", element: <PulseConsumePage /> },
      { path: "/pulse/modules/:moduleId/items/:itemId", element: <PulseConsumePage /> },
      { path: "/pulse/course", element: <Navigate to="/pulse" replace /> },
      { path: "/pulse/course/*", element: <Navigate to="/pulse" replace /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
```

- [ ] **Step 2: Typecheck + build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, vite build succeeds.

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev`, then in the browser:
- Visit `/` — Dashboard renders; DevPanel visible.
- Visit `/pulse` — Pulse home renders (or redirects to `/pulse/intro` if intro unseen).
- Click a TopNav tab and back — navigation still works; scroll resets to top on route change.
- Trigger the pricing modal (via DevPanel or Subscribe) — it still opens.

Expected: app behaves exactly as before the migration.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: migrate to createBrowserRouter for navigation blocking"
```

---

## Task 5: ExitIntentDialog (presentational)

**Files:**
- Create: `src/components/pulse/ExitIntentDialog.tsx`

Capture-only dialog following the MUI conventions in `ConfirmDialog.tsx` (rounded 16px paper, theme tokens). Single-select reason chips + optional note. "Submit & continue" is disabled until a reason is picked; "Skip" and the ✕ dismiss without a reason.

- [ ] **Step 1: Create the dialog**

Create `src/components/pulse/ExitIntentDialog.tsx`:

```tsx
import { useEffect, useState } from "react";
import { Box, Button, Dialog, IconButton, Stack, TextField, Typography } from "@mui/material";
import { X } from "lucide-react";
import { EXIT_INTENT_REASONS } from "../../lib/pulse/exitIntent";

export function ExitIntentDialog({
  open,
  onSubmit,
  onSkip,
  onClose,
}: {
  open: boolean;
  onSubmit: (reasonId: string, note: string) => void;
  onSkip: () => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Reset the form each time the dialog is (re)opened.
  useEffect(() => {
    if (open) {
      setReason(null);
      setNote("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          maxWidth: "calc(100vw - 32px)",
          m: 2,
          borderRadius: "16px",
          boxShadow: "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary" }}
      >
        <X size={18} />
      </IconButton>

      <Box sx={{ px: 3, pt: 3.5, pb: 1 }}>
        <Typography
          sx={{ fontSize: 20, fontWeight: 600, lineHeight: "26px", letterSpacing: "-0.4px", color: "text.primary" }}
        >
          Before you go
        </Typography>
        <Typography
          sx={{ mt: 0.75, fontSize: 14, lineHeight: "20px", letterSpacing: "-0.2px", color: "text.secondary" }}
        >
          What's holding you back from starting your free trial?
        </Typography>
      </Box>

      <Box sx={{ px: 3, py: 1.5 }}>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          {EXIT_INTENT_REASONS.map((r) => {
            const selected = reason === r.id;
            return (
              <Box
                key={r.id}
                component="button"
                type="button"
                onClick={() => setReason(r.id)}
                aria-pressed={selected}
                sx={(theme) => ({
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "-0.1px",
                  px: 1.5,
                  py: 0.875,
                  borderRadius: 999,
                  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.outlineVariant.main}`,
                  bgcolor: selected ? theme.palette.primary.light : "transparent",
                  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
                  transition: "background-color 140ms ease, border-color 140ms ease, color 140ms ease",
                  "&:hover": { borderColor: theme.palette.primary.main },
                })}
              >
                {r.label}
              </Box>
            );
          })}
        </Stack>

        <TextField
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything else? (optional)"
          multiline
          minRows={2}
          fullWidth
          size="small"
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1.5, px: 3, py: 2 }}>
        <Button
          onClick={onSkip}
          sx={{ height: 40, px: 2, borderRadius: "8px", fontSize: 14, fontWeight: 500, textTransform: "none", color: "text.secondary" }}
        >
          Skip
        </Button>
        <Button
          variant="contained"
          disableElevation
          disabled={!reason}
          onClick={() => reason && onSubmit(reason, note.trim())}
          sx={{ height: 40, px: 2.5, borderRadius: "8px", fontSize: 14, fontWeight: 600, textTransform: "none" }}
        >
          Submit &amp; continue
        </Button>
      </Box>
    </Dialog>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run build`
Expected: PASS — no TypeScript errors. (Component is not yet rendered anywhere; it compiles as an unused export.)

- [ ] **Step 3: Commit**

```bash
git add src/components/pulse/ExitIntentDialog.tsx
git commit -m "feat(pulse): exit-intent capture dialog (presentational)"
```

---

## Task 6: ExitIntentGuard + mount on Pulse pages

**Files:**
- Create: `src/components/pulse/ExitIntentGuard.tsx`
- Modify: `src/pages/Pulse/PulseHome.tsx`
- Modify: `src/pages/Pulse/PulseIntroPage.tsx`

- [ ] **Step 1: Create the guard**

Create `src/components/pulse/ExitIntentGuard.tsx`:

```tsx
import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { usePricing } from "../../lib/pulse/pricing";
import { track } from "../../lib/analytics";
import {
  hasShownExitIntent,
  isExitFromPulse,
  markExitIntentShown,
} from "../../lib/pulse/exitIntent";
import { ExitIntentDialog } from "./ExitIntentDialog";

/**
 * Intercepts navigation OUT of the Pulse area (in-app nav-away or browser Back)
 * when the user has not started the trial, and shows a one-per-session
 * capture-only dialog. Renders nothing when idle.
 */
export function ExitIntentGuard({ source }: { source: "onboarding" | "pulse_home" }) {
  const { state, trialStartedAt } = usePricing();
  const enabled = state === "trial" && !trialStartedAt && !hasShownExitIntent();

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        enabled && isExitFromPulse(currentLocation.pathname, nextLocation.pathname),
      [enabled],
    ),
  );

  const open = blocker.state === "blocked";

  // Fire the "shown" event once per blocked transition.
  const shownRef = useRef(false);
  useEffect(() => {
    if (open && !shownRef.current) {
      shownRef.current = true;
      track("GL:PulseExitIntent_Shown", { source });
    } else if (!open) {
      shownRef.current = false;
    }
  }, [open, source]);

  // Capture-only: any resolution lets the navigation proceed and disables the
  // guard for the rest of the session.
  const proceed = useCallback(() => {
    markExitIntentShown();
    if (blocker.state === "blocked") blocker.proceed();
  }, [blocker]);

  const handleSubmit = (reason: string, note: string) => {
    track("GL:PulseExitIntent_Submitted", { reason, note, source });
    proceed();
  };

  const handleDismiss = () => {
    track("GL:PulseExitIntent_Dismissed", { source });
    proceed();
  };

  if (!open) return null;

  return (
    <ExitIntentDialog
      open={open}
      onSubmit={handleSubmit}
      onSkip={handleDismiss}
      onClose={handleDismiss}
    />
  );
}
```

- [ ] **Step 2: Mount in PulseHome**

In `src/pages/Pulse/PulseHome.tsx`, add the import after the existing component imports (near line 7):

```tsx
import { ExitIntentGuard } from "../../components/pulse/ExitIntentGuard";
```

Then find the start of the returned JSX (lines ~41-43):

```tsx
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 3, pb: 6 }}>
```

Replace with (adds the guard just inside the root Box):

```tsx
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <ExitIntentGuard source="pulse_home" />
      <TopNav />
      <Box sx={{ maxWidth: 1184, mx: "auto", px: { xs: 2, md: 3, lg: 0 }, pt: 3, pb: 6 }}>
```

- [ ] **Step 3: Mount in PulseIntroPage**

In `src/pages/Pulse/PulseIntroPage.tsx`, add the import after the existing imports (near line 11):

```tsx
import { ExitIntentGuard } from "../../components/pulse/ExitIntentGuard";
```

Then find the start of the returned JSX (lines ~168-170):

```tsx
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", position: "relative", overflow: "hidden" }}>
      <SlideBackdrop accent={slide.accent} />
      <NoiseOverlay />
```

Replace with (adds the guard just inside the root Box):

```tsx
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", position: "relative", overflow: "hidden" }}>
      <ExitIntentGuard source="onboarding" />
      <SlideBackdrop accent={slide.accent} />
      <NoiseOverlay />
```

- [ ] **Step 4: Typecheck + build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, vite build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/pulse/ExitIntentGuard.tsx src/pages/Pulse/PulseHome.tsx src/pages/Pulse/PulseIntroPage.tsx
git commit -m "feat(pulse): exit-intent guard on onboarding + pulse home"
```

---

## Task 7: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Run the unit tests**

Run: `npm test`
Expected: PASS — all suites green, including `exitIntent.test.ts`.

- [ ] **Step 2: Run the full build**

Run: `npm run build`
Expected: PASS — `tsc -b` clean, vite build succeeds.

- [ ] **Step 3: Manual walkthrough (use DevPanel to control trial state)**

Run: `npm run dev`. Open the browser devtools console to see `[track]` events. Use the DevPanel to set the pricing state to a **non-started trial** (state `trial`, no trial started) and clear "intro seen" if needed.

Feature B (banner):
- On `/pulse` pre-trial, the CTA reads **"Start your 30-day free trial"** with **🔒 No credit card required** beneath it.
- Start the trial → banner switches to the trial-active state; the reassurance line is gone.

Feature A (exit-intent), with a fresh session (no `pulse-exit-intent-shown` in sessionStorage) and trial not started:
- On `/pulse`, click a TopNav tab to leave Pulse (e.g. Dashboard) → dialog appears; console logs `GL:PulseExitIntent_Shown`.
- Pick a reason + optional note → "Submit & continue" → console logs `GL:PulseExitIntent_Submitted` with `{ reason, note, source: "pulse_home" }`, then navigation completes.
- Reload `/pulse`, try to leave again → **no dialog** (once per session).
- Clear `sessionStorage`, repeat on `/pulse/intro` (leave via a tab or browser Back) → dialog shows with `source: "onboarding"`; "Skip"/✕ logs `GL:PulseExitIntent_Dismissed` and lets you leave.
- Navigate **within** Pulse (intro → home, home → a module) → **no dialog**.
- Start the trial, then try to leave → **no dialog** (guard disabled).

- [ ] **Step 4: Final confirmation**

Confirm both features behave as in the spec. No commit needed (verification only); if the walkthrough surfaced a fix, commit it with a clear message.

---

## Self-Review

**Spec coverage:**
- Exit-intent trigger (in-app nav-away + Back, leaving `/pulse*` only) → `isExitFromPulse` (Task 1) + `useBlocker` (Task 6). ✓
- Scope: onboarding + pulse home → guard mounted on both pages (Task 6). ✓
- Capture-only dialog (reason chips + optional note, no recovery CTA) → Task 5. ✓
- Once per session → session helpers (Task 1) + `markExitIntentShown` on resolve (Task 6). ✓
- Enabled only when trial not started → `enabled` gate (Task 6). ✓
- Analytics events `Shown` / `Submitted` / `Dismissed` with `source` → Task 6 via shim (Task 2). ✓
- Banner CTA "Start your 30-day free trial" + "No credit card required", pre-trial only → Task 3. ✓
- Data-router migration (Strategy 1) → Task 4. ✓
- Out of scope (mouse-out, tab-close, recovery CTA, multi-select) → not implemented. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full content. ✓

**Type consistency:** `ExitIntentReason`/`EXIT_INTENT_REASONS`, `isExitFromPulse`, `hasShownExitIntent`/`markExitIntentShown`, `track`, and `ExitIntentDialog` props (`onSubmit`, `onSkip`, `onClose`) are referenced consistently across Tasks 1, 2, 5, 6. `HeroCopy.showNoCardReassurance` added on every return in Task 3. ✓
