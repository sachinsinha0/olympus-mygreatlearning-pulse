# Pulse — Exit-Intent Capture + Trial CTA Reassurance

**Date:** 2026-06-15
**Author:** Sachin Sinha
**Status:** Draft for review

## Problem

The Mixpanel funnel *"GL Pulse Click → Free Trial Enrollment Conversion"* (since Jun 10, 2026)
shows overall conversion of **7.42%** with two clear leaks:

| Step | Event | Users | Step conv. |
|------|-------|-------|-----------|
| 1 | `GL:DashboardGLPulse_Click` | 768 | 100% |
| 2 | `GL:PulseOnboarding_StepView` | 721 | 93.88% |
| 3 | `GL:PulseOnboarding_StepView` | 471 | **65.33%** ← mid-funnel leak |
| 4 | `GL:PulseOnboarding_StepView` | 456 | 96.82% |
| 5 | `GL:PulseFreeTrialEnrolment_Success` | 57 | **12.5%** ← biggest leak |

- **Step 4 → 5 (456 → 57, ~87.5% drop)** is the largest leak: people finish onboarding,
  reach the page with the trial CTA, but do not start the free trial.
- **Step 2 → 3 (~35% drop)** is a secondary mid-onboarding leak.

The funnel tells us *where* people drop but not *why*. We address both:

1. **Feature A — Exit-intent dialog:** capture *why* a user leaves Pulse before starting the
   trial (qualitative signal we cannot get from the funnel).
2. **Feature B — Trial CTA reassurance:** reduce friction at the biggest leak by making it
   explicit that the trial is free and needs no card.

## Codebase mapping

- **"Onboarding"** = `src/pages/Pulse/PulseIntroPage.tsx` — a 3-slide intro (the `StepView`
  steps). Finishing it navigates (replace) to `/pulse`.
- **"Dashboard" / trial CTA** = `MarketingHero` in `src/components/pulse/PulseV2Hero.tsx`,
  rendered on `/pulse` (`PulseHome`). Pre-trial CTA is `"Start 30-day trial"`, firing
  `startTrial()` from the pricing context.
- **Trial state** lives in `src/lib/pulse/pricing.tsx` (`usePricing()`): `state`
  (`"trial" | "paid" | "expired"`), `trialStartedAt`, `startTrial()`. A user who has not
  started a trial is `state === "trial" && !trialStartedAt`.
- **Routing** uses declarative `<BrowserRouter>` in `src/App.tsx`. Providers
  (`PricingProvider`, `LearningProgressProvider`) live in `src/main.tsx`; always-on UI
  (`ScrollToTop`, `DevPanel`, `PricingModal`, `SupportProvider`) lives inside `<BrowserRouter>`
  in `App.tsx`.
- **No analytics layer exists** in this prototype — the `GL:*` events are wired in the real
  product, not here. We add a thin stub that mirrors the naming.
- **Dialog precedent:** `src/components/pulse/ConfirmDialog.tsx` (MUI `Dialog`, lucide icons,
  theme tokens) — we follow its visual conventions.

## Decisions (locked with stakeholder)

| Topic | Decision |
|-------|----------|
| Exit-intent trigger | **In-app navigation away from Pulse** (clicking a nav tab to a non-Pulse route) **and the browser Back button.** Both are real and in scope. |
| Tab close / new URL | **Out of scope** — browsers don't allow a custom dialog on unload. (Optional silent analytics ping deferred.) |
| Mouse-out (classic exit-intent) | **Out of scope** — GL traffic is largely mobile; no mouse-out heuristic. |
| Scope of pages | Pulse **onboarding intro** (`/pulse/intro`) **and Pulse home** (`/pulse`). |
| Dialog goal | **Capture reason only** — reason chips + optional note. **No** recovery / "start trial anyway" CTA. |
| Banner CTA copy | `"Start your 30-day free trial"` with reassurance line **"No credit card required"** below the button. |
| Interception mechanism | **Strategy 1: migrate to a data router (`createBrowserRouter`) + `useBlocker`.** |

## Approaches considered (interception mechanism)

`useBlocker` is the idiomatic React Router primitive for "intercept a navigation, show UI,
then proceed/cancel." It catches both in-app nav (PUSH) and Back (POP) with one predicate.
**Constraint:** `useBlocker` calls `useDataRouterContext()`, which `invariant`-throws unless a
**data router** is in use. This app uses declarative `<BrowserRouter>`, so `useBlocker` would
throw as-is.

- **Strategy 1 (chosen):** Migrate `App.tsx` to `createBrowserRouter` + `RouterProvider`, then
  use a single `useBlocker` guard. Clean, covers both channels uniformly, no history hacks.
  Verified low-risk: no provider/always-on component uses router hooks except `ScrollToTop`
  (`useLocation`) and `NavTabs` (`useNavigate`/`useLocation`), all of which work unchanged
  inside a data router.
- **Strategy 2 (rejected):** Keep `<BrowserRouter>`; intercept Back via a `popstate` sentinel
  and in-app nav via capture-phase click interception. NavTabs navigates programmatically via
  `navigate(path)`, so click interception is fragile and requires per-tab data attributes.
  More code, more edge cases.

## Design

### Component / data flow

```
RouterProvider (createBrowserRouter)
  └─ RootLayout (element)         ← ScrollToTop, DevPanel, PricingModal, SupportProvider, <Outlet/>
       ├─ "/"            Dashboard
       ├─ "/pulse"       PulseHome      ─┐  ExitIntentGuard mounted here
       ├─ "/pulse/intro" PulseIntroPage ─┘  ExitIntentGuard mounted here
       └─ … other routes
```

- `ExitIntentGuard` is a small component rendered by `PulseHome` and `PulseIntroPage` (not
  globally), so blocking logic only runs where it applies.

### Module boundaries

1. **`src/lib/analytics.ts`** — `track(event: string, props?: Record<string, unknown>): void`.
   Calls `window.mixpanel?.track?.(event, props)` if present, else `console.debug("[track]", …)`.
   Pure side-effect wrapper; no app state. Single responsibility: emit a named event.

2. **`src/lib/pulse/exitIntent.ts`** — pure helpers, unit-testable in isolation:
   - `isExitFromPulse(currentPath, nextPath): boolean` — `true` when `currentPath` starts with
     `/pulse` and `nextPath` does not. (Navigating *within* Pulse never triggers.)
   - `EXIT_INTENT_REASONS` — the ordered reason list (id + label).
   - sessionStorage helpers: `hasShownExitIntent()` / `markExitIntentShown()`
     (key `pulse-exit-intent-shown`), so the dialog appears at most **once per session**.

3. **`src/components/pulse/ExitIntentGuard.tsx`** — wires router + state to the dialog.
   - Props: `source: "onboarding" | "pulse_home"`.
   - `enabled = state === "trial" && !trialStartedAt && !hasShownExitIntent()`.
   - `useBlocker(({ currentLocation, nextLocation, historyAction }) =>
       enabled && isExitFromPulse(currentLocation.pathname, nextLocation.pathname))`.
   - When `blocker.state === "blocked"`: open `ExitIntentDialog`, fire
     `track("GL:PulseExitIntent_Shown", { source })`.
   - On **submit** `(reasonId, note)`: `track("GL:PulseExitIntent_Submitted",
     { reason: reasonId, note, source })`, `markExitIntentShown()`, `blocker.proceed()`.
   - On **skip / dismiss**: `track("GL:PulseExitIntent_Dismissed", { source })`,
     `markExitIntentShown()`, `blocker.proceed()`.
   - Renders nothing when idle.

4. **`src/components/pulse/ExitIntentDialog.tsx`** — presentational MUI `Dialog`.
   - Props: `open`, `onSubmit(reasonId, note)`, `onSkip`, `onClose`.
   - Title **"Before you go"**; prompt **"What's holding you back from starting your free
     trial?"**
   - Single-select reason chips from `EXIT_INTENT_REASONS`:
     - `not-sure` — "Not sure what Pulse is"
     - `no-time` — "No time right now"
     - `cost` — "Worried about cost / being charged"
     - `not-relevant` — "Not relevant to me"
     - `browsing` — "Just browsing"
     - `other` — "Other"
   - Optional free-text note (`TextField` multiline), always available.
   - Primary button **"Submit & continue"** (enabled once a reason is selected) → `onSubmit`.
   - Secondary text button **"Skip"** and a top-right ✕ → `onSkip` / `onClose`.

5. **`src/components/pulse/PulseV2Hero.tsx`** (edit) — `MarketingHero` / `useHeroCopy`,
   **pre-trial branch only**:
   - `primaryCtaLabel: "Start 30-day trial"` → **"Start your 30-day free trial"**.
   - Add a reassurance line directly beneath the CTA button: a small lock icon (lucide `Lock`,
     14px) + **"No credit card required"** in `text.secondary` (~13px, `letterSpacing -0.1px`).
   - `trial`-active / `expired` / `paid` states are untouched.

### App.tsx / main.tsx migration (Strategy 1)

- Replace `<BrowserRouter><Routes>…</Routes></BrowserRouter>` with
  `createBrowserRouter([{ element: <RootLayout/>, children: [ …route objects… ] }])` +
  `<RouterProvider router={router} />`.
- `RootLayout` renders `ScrollToTop`, `DevPanel`, `PricingModal`, wraps `<Outlet/>` in
  `SupportProvider` — i.e. the exact always-on tree from today, just relocated into a layout
  route element.
- `PricingProvider` / `LearningProgressProvider` stay in `main.tsx` wrapping `<App/>`
  (they use no router hooks).
- Route paths and elements are otherwise unchanged.

## Analytics events emitted

| Event | When | Props |
|-------|------|-------|
| `GL:PulseExitIntent_Shown` | dialog opens | `{ source }` |
| `GL:PulseExitIntent_Submitted` | user submits a reason | `{ reason, note, source }` |
| `GL:PulseExitIntent_Dismissed` | user skips / closes | `{ source }` |

`source ∈ { "onboarding", "pulse_home" }`. Naming mirrors the existing `GL:*` convention so the
stub is a drop-in once real Mixpanel is wired.

## Edge cases

- **Navigating within Pulse** (intro → home, home → a module) — never blocked (`isExitFromPulse`
  returns false).
- **Starting the trial** sets `trialStartedAt`, disabling the guard before the
  `/pulse/modules/…?trial=started` navigation — no dialog on that transition.
- **Already shown this session** — guard disabled; user leaves freely thereafter.
- **Paid / expired / trial-expired** states — `enabled` is false; no dialog.
- **React StrictMode** (dev double-invoke) — `useBlocker` registration is idempotent; the
  sessionStorage guard prevents duplicate shows.
- **Tab close / external URL** — not interceptable; explicitly out of scope.

## Testing

Vitest is configured (`npm test`). Cover the pure logic, keep UI light:

- `exitIntent.test.ts`: `isExitFromPulse` truth table (in→out blocks; in→in and out→out don't);
  sessionStorage show-once helpers.
- `analytics.test.ts`: `track()` calls `window.mixpanel.track` when present; falls back to
  `console.debug` when absent.
- (Optional) a render test that `ExitIntentDialog` enables "Submit & continue" only after a
  reason is selected and forwards `(reasonId, note)`.
- **Manual:** use `DevPanel` to reset pricing state to a non-started trial, then verify the
  dialog appears on tab-away and Back from `/pulse` and `/pulse/intro`, once per session.

## Out of scope (YAGNI)

- Recovery / "start trial anyway" CTA inside the dialog.
- Email-reminder / save-my-spot flow.
- Mouse-out exit-intent and tab-close (`beforeunload`) capture.
- Multi-select reasons.
- Any change to trial-active, expired, or paid banner states.
