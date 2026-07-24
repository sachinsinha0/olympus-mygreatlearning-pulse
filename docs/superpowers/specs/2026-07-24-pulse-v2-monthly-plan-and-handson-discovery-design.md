# Pulse v2 — Monthly Plan & Hands-on Discovery

**Date:** 2026-07-24
**Status:** Approved design, pending spec review
**Scope:** Two feedback-driven changes to the Pulse experience following the v1 release.

## Background

Two consistent themes emerged from v1 feedback:

1. **"Wants more hands-on" is a discovery problem, not a content gap.** The hands-on content already exists and is fully available in the trial, yet engaged users churn saying it "wasn't hands-on." They spend their session on the intro videos and quit before reaching the practical part, which sits at the *end* of each module.

2. **Even users who liked the product struggled with annual-only pricing.** They benchmarked $300/year against a ChatGPT/Claude subscription, asked for a monthly option, or wanted a discount. The value landed; the annual-only structure didn't.

This spec addresses both. They are independent changes that ship together in one iteration.

---

## Feature 1 — Monthly plan alongside Annual

### Goal

Remove the annual-only objection by offering a monthly plan, while keeping annual the obvious better value (better for retention and margin) and answering "why not just pay monthly?" at the point of decision.

### Pricing model

| Plan | Price | Monthly-equivalent | Framing |
|------|-------|--------------------|---------|
| Annual | $300 / year | **$25/mo** | "Billed annually · $300/year", **Save $60/year**, "Best value" |
| Monthly | $30 / month | **$30/mo** | "Billed monthly · cancel anytime" |

**Decisions:**

- **One clean story: annual vs monthly.** The old sticker-discount framing ($400 struck through, "Save $100") is **removed**. It contradicted the annual-vs-monthly saving ($60) and read as busy. The savvy, price-comparing users we're targeting distrust inflated stickers; a single honest comparison reads as confidence.
- **Monthly is a flat $30/mo** — no strikethrough, no "discount." Only Annual carries value signaling, so Annual stays the winner.
- **$60/year** = $360 (12 × $30) − $300. Internally consistent with the $25-vs-$30 monthly comparison.
- **Default to Annual.** Research consistently shows defaulting to the better-value plan lifts its adoption via the default effect.
- Both plans are shown at once (not hidden behind a toggle) so the $25-vs-$30 comparison does its persuasion up front.

### Dialog design (approved: "Option B")

Two selectable plan cards stacked inside the existing `PricingModal` (~480px dialog):

```
Subscribe to Pulse
Stay on top of every AI development with biweekly modules you can apply at work.

┌───────────────────────────────────────────── Best value ┐
│ ◉  Annual                                          $25   │
│    Billed annually · $300/year                     /mo   │
│    [ Save $60/year ]                                     │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ ○  Monthly                                         $30   │
│    Billed monthly · cancel anytime                 /mo   │
└──────────────────────────────────────────────────────────┘

✓ New AI tools & innovations every two weeks.
✓ Under 60 minutes, designed to fit your schedule.
✓ Apply what you learn at work immediately.

[         Pay and Subscribe →         ]
              🛡 Secure checkout
```

- Selected plan: primary-colored border + tinted background + filled radio. Annual selected on open.
- "Best value" tag: filled primary pill, top-right of the Annual card.
- "Save $60/year" pill: `primary.main` text on `primary.light` background.
- Features list and "Pay and Subscribe" / "Secure checkout" footer are unchanged from today.
- The "Welcome back to Pulse" title variant for `state === "expired"` is preserved.

### Data / logic changes

- **`src/lib/pulse/pricing.tsx`**
  - `Plan` type: `"annual"` → `"annual" | "monthly"`.
  - `PLAN_PRICE`: add `monthly: { display: "$30/mo", perMo: "$30/mo", billing: "Billed monthly" }`; keep `annual` as `$25/mo` / "Billed annually".
  - `getInitial` plan validation: accept `"annual" | "monthly"` (currently only `"annual"`).
  - `subscribe(plan)`: set `activeUntil` by plan — annual → `daysFromNow(365)`, monthly → `daysFromNow(30)`. (Today it always uses 365.)
  - `setState("paid")` default plan stays `annual`.

- **`src/components/pulse/PricingModal.tsx`**
  - Add local `selectedPlan` state (default `"annual"`).
  - Render the two plan cards; `handleSubscribe` calls `subscribe(selectedPlan)`.
  - Prices sourced from a single place (constants in this file or `PLAN_PRICE`) — no duplicated literals.

- **`src/pages/Pulse/SubscriptionPage.tsx`**
  - Derive `planLabel` from `plan` (`"Annual"` / `"Monthly"`) instead of the hardcoded `"Annual"`. "Membership till {activeUntil}" already renders correctly for both since `activeUntil` now reflects the plan length.

---

## Feature 2 — Hands-on discovery

### Goal

Make it visible on the module card that a module is hands-on (fixing the "this is just videos" misread), and give a fast path to the hands-on so busy users reach the payoff before their session ends — without letting hands-on visually dominate the card.

### Two complementary levers (both approved)

1. **Secondary "hands-on" button on the module card** — an unmistakable, tappable action that deep-links straight to the module's hands-on demo.
2. **Curriculum reorder** — move each module's hands-on to right after the *first* video, so even users who just tap "Start Learning" reach it within minutes instead of at the very end.

### Card design (approved: "Option B" — bottom action row)

The module card gains a bottom **action row** containing both CTAs (a departure from today's top-right single CTA on desktop — chosen because the logo → content → vertical-CTA-stack scan path of the alternative was awkward):

```
┌──────────────────────────────────────────────────────────┐
│ [logo]  PULSE #12 · Jul 18, 2026                          │
│         Claude Code for everyday engineering              │
│         Go from prompt to shipped change on a real repo.  │
│         ✓ Set up Claude Code on your own project          │
│         ✓ Ship a real change end to end                   │
│                                                            │
│         [ Start Learning ]  [ 🖥 Try the hands-on demo → ]│
└──────────────────────────────────────────────────────────┘
```

- **Primary** — "Start Learning" (existing label logic preserved: Start / Resume / Start Free Trial / Subscribe to unlock / Renew to unlock). Filled style.
- **Secondary** — "🖥 Try the hands-on demo →". Outlined button using the existing **deep-orange** hands-on tone (`extended.deepOrange.color` text, soft border/`colorContainer` background) — the same color+monitor-icon language already used for "Hands-on Demos Completed" in the Learning Journey, so it reads as one system. Clearly a button, but visually subordinate to the filled primary.
- **Desktop:** buttons sit as a row at the bottom of the card body (replacing the top-right compact CTA). **Mobile/tablet:** buttons stack full-width at the bottom (consistent with today's mobile CTA), primary on top.

### Fixed copy, computed destination

- The secondary button's **label is fixed** ("Try the hands-on demo →") on every card — no per-module authoring, no drift.
- The **destination is computed** from the module's own curriculum.

### Behavior

- **Tap** → deep-link to the module's hands-on item: `navigate('/pulse/modules/{moduleId}/items/{handsOnItemId}')`, wrapped in the existing `runWithPageLoader`.
- **Pre-trial users:** tapping the secondary button calls `startTrial()` then lands them directly on the hands-on item (fastest path to value), mirroring the primary CTA's pre-trial flow with a `?trial=started` suffix.
- **Yes, users may jump straight to hands-on without consuming the whole module first.** This is intentional — the churn came from *forcing* linear consumption. Hands-on demos are largely self-contained, so entering there is not disorienting the way entering mid-video-sequence would be.
- **Visibility:** the secondary button appears **only** on **released, accessible** cards. It is hidden for **upcoming** ("Coming soon") and **locked/expired** ("Subscribe/Renew to unlock") cards, and hidden when the module has no resolvable hands-on item (see below).

### Resolving the hands-on item

Hands-on items in the data are plain `type: "video"` whose **title contains "hands-on"** (e.g. `m2-v5` "Hands-on Demo Part 1…", `m1-v5` "Hands-on demo"); synthesized modules produce a `{moduleId}-demo` item titled "Hands-on demo: {tool}". Some modules have **two** hands-on parts.

- **New helper in `src/lib/pulse/courseItems.ts`:** `getHandsOnItemId(moduleId): string | null` — returns the id of the **first** item in the module whose title matches `/hands[-\s]?on/i`, else `null`.
- The card calls this; `null` → secondary button hidden.

**Data gap to close for the demo:** the newest authored modules (pulse-12/11/8/7) are **overview-only** sections, so they currently resolve to `null` and would show no button — undermining the feature on the most-visible modules. Fix: extend the existing synthesis fallback in `getSectionsForModule` so it **also synthesizes when an authored section contains no video/hands-on item** (today it synthesizes only when there are zero authored sections). This guarantees every released module exposes segments + a hands-on demo, so both the shortcut and the reorder apply consistently. The synthesized overview is built from the same issue fields, so the loss for these thin modules is negligible.

### Curriculum reorder

- **New helper in `src/lib/pulse/courseItems.ts`:** `reorderHandsOnAfterFirstVideo(items): CourseItem[]` — keeps the overview at index 0, finds the first non-hands-on video, and moves the hands-on item(s) to immediately after it (preserving their relative order; TYU/reading items keep their relative positions otherwise).
- Applied inside `getSectionsForModule` so the **player order, `getNeighbors`, and the deep-link target are all consistent**. `getDefaultItemId` still returns the overview (index 0) — unchanged.

---

## Testing

Follows the existing pure-helper + Vitest pattern in `src/lib/pulse/*.test.ts`.

- **Pricing:** `subscribe("monthly")` sets `activeUntil` ~30 days out; `subscribe("annual")` ~365 days out. `getInitial` accepts and round-trips `"monthly"`. `PLAN_PRICE.monthly` present.
- **Hands-on resolution:** `getHandsOnItemId` returns the first hands-on video id for authored modules (m1, m2 → the earlier of two parts), the `-demo` id for synthesized modules, and (after the synthesis-fallback change) a non-null id for previously overview-only modules.
- **Reorder:** `reorderHandsOnAfterFirstVideo` places the hands-on item(s) immediately after the first non-hands-on video, keeps overview first, and is a no-op when there is no video or no hands-on item.
- **Manual/visual:** pricing dialog plan selection + subscribe for both plans; SubscriptionPage label reflects the chosen plan; module card renders the secondary button only in released/accessible state and deep-links correctly (including the pre-trial start-trial path); button hidden on upcoming/locked.

## Out of scope

- Payment processing, proration, or plan upgrade/downgrade flows (this is a design prototype with mock state).
- Changes to email lifecycle sequences.
- Any redesign of the in-player hands-on experience itself.
- The in-progress `src/pages/InterviewReport/` work (separate track).
