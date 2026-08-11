# Pulse — Module Hours, Upcoming-Card Parity & Reverse Timeline

**Date:** 2026-08-10
**Status:** Implemented
**Scope:** Four changes to the AI Pulse module list on the home page, in two passes.

## Background

First pass:

1. **Surface how much time a module takes**, split between learning content and the hands-on component. Today no duration appears anywhere on the module card — the "under 60 minutes" promise is made in the hero and the pricing dialog, but never substantiated per module.
2. **Stop greying out upcoming modules.** They were rendered at `opacity: 0.65` with disabled-grey text throughout, which read as unavailable and dead rather than as scheduled content worth anticipating.

Second pass, after reviewing the first:

3. **The newest content was sinking down the page.** Upcoming modules — the freshest thing on offer — sat *below* the released section, and that only gets worse as the archive grows.
4. **"Coming soon" was a dead label.** An upcoming card is the natural place to measure demand, so it should collect an interest signal instead of stating the obvious.

## Feature 1 — Learning and hands-on time on the module card

### Why minutes, not hours

Every piece of Pulse copy promises sub-hour modules: "30–60 minutes, designed to fit your schedule"
(`PulseV2Hero.tsx`), "Under 60 minutes" (`PricingModal.tsx`), "distilled into 60 minutes of learning"
(hero subtitle), "Up to 60 minutes each" (`PulseIntroPage.tsx`). Displaying hour figures on the card
would contradict the pitch made on the same page. The split is therefore shown in minutes and sums
to the module's existing `durationMinutes` (45–55).

### Why authored mock values, not derived

Deriving the split from each module's curriculum items was rejected:

- The visible cards would collapse to near-identical numbers — pulse-12, pulse-11, and pulse-13 all
  fall through to the synthesis path in `courseItems.ts` and would each report exactly 37 + 13.
- Authored curricula disagree with their own headline duration: pulse-10's items sum to 39 minutes
  while its `durationMinutes` is 55.
- Upcoming modules ship with `curriculum: []`, so there is nothing to derive from.

This is a design prototype, so the split is authored directly as mock data — one value per module,
guaranteed consistent with `durationMinutes`.

### Data

`PulseIssue` (`src/lib/pulse/types.ts`) gains two required fields:

```ts
learningMinutes: number;   // video/segment time, excluding the hands-on demo
handsOnMinutes: number;    // hands-on demo time; 0 when the module has none
```

Authored in `src/mocks/pulse-issues.json` for all 13 modules, each pair summing to that module's
`durationMinutes`:

| Module | Total | Learning | Hands-on |
|---|---|---|---|
| pulse-13 Agents That Read Your Codebase | 50 | 35 | 15 |
| pulse-12 The Month Claude Became a Platform | 50 | 35 | 15 |
| pulse-11 The "Zero-to-Slide" Workflow | 50 | 32 | 18 |
| pulse-10 What OpenClaw built | 55 | 35 | 20 |
| pulse-9 The Spreadsheet that Thinks | 50 | 30 | 20 |
| pulse-8 MCP in Production | 50 | 35 | 15 |
| pulse-7 Thinking Models, Earned Their Cost | 45 | 30 | 15 |
| pulse-6 Video, Practically | 50 | 34 | 16 |
| pulse-5 RAG With a Million Tokens | 55 | 37 | 18 |
| pulse-4 Voice Agents, Real-Time | 50 | 32 | 18 |
| pulse-3 Evals That Aren't a Vibe Check | 50 | 34 | 16 |
| pulse-2 The IDE Agent Wars | 45 | 30 | 15 |
| pulse-1 Claude 4, GPT-5, and the Model Map | 50 | 36 | 14 |

Only four modules render on the home page under the current `PULSE_TODAY`, but all 13 carry values so
nothing breaks when that date is moved.

### Presentation

A meta row sits between the description and the outcomes list, in both the desktop and the
mobile/tablet layout of `ModuleListCard`:

```
MODULE 01 · May 27, 2026
The Month Claude Became a Platform
Figma's stock dipped on a Friday. Claude Design wasn't the story, it was a symptom.

🕐 35 min learning  ·  ⚗ 15 min hands-on

✓ Understand how Claude evolved beyond a chatbot
...
```

- `Clock` and `FlaskConical` icons at 14px in `primary.main`; labels at 13px / weight 500 /
  `text.secondary`; the two halves separated by the same `Dot()` the eyebrow row uses.
- The hands-on half renders only when `handsOnMinutes > 0`.
- Identical in released, upcoming, and locked states — the row is module metadata, not a state signal.
- Fits on one line at 390px width; wraps with `rowGap` below that.

## Feature 2 — Upcoming cards at full strength

Every `isUpcoming` dimming rule is removed. The `isLocked` treatment (`opacity: 0.78`) is untouched —
locked and upcoming are different states and should not converge.

| Element | Before | After |
|---|---|---|
| Card | `opacity: 0.65` | `opacity: 1` |
| Eyebrow number | `text.disabled` | `primary.main` |
| Eyebrow date | `text.disabled`, "Jun 24, 2026" | **removed from the card entirely** (see below) |
| Title | `text.secondary` | `text.primary` |
| Outcome check icons | `text.disabled` | `primary.main` |
| Outcome text | `text.disabled` | `text.primary` |
| CTA | grey filled, "Coming soon" | outlined "I'm Interested" (see Feature 4) |

Unchanged: the card is not clickable, there is no hover lift, and the hands-on shortcut stays hidden
(it deep-links into content that does not exist yet).

### Release dates removed from the card

The eyebrow originally read `MODULE 04 · Coming Jun 24, 2026`. Dates are now dropped from every card,
released and upcoming alike, leaving just `MODULE 04`. `releasedAt` still drives sorting and the
released/upcoming split — it is simply not displayed.

**Consequence:** with both the dimming and the date gone, only two things now mark a card as
unreleased — the "Upcoming Modules" section header above it, and the "I'm Interested" CTA in place of
"Start Learning". A card viewed in isolation (or if the section headers are ever dropped) carries no
release signal of its own. That is an accepted trade for now; restoring a date-less "Coming soon"
chip to the eyebrow is the cheapest fix if the distinction ever reads too weakly.

**Known consequence:** in the expired/locked state, released cards dim to `opacity: 0.78` while
upcoming cards stay at full strength, so upcoming reads stronger than released. This is correct
semantically (upcoming content is not what the paywall gates) but is a visible inversion worth
noting.

## Feature 3 — Reverse timeline, upcoming first

The page now reads as one continuous newest-first timeline instead of two sections whose newest
content sank to the bottom:

- **Upcoming section renders above the released section** in `PulseHome`.
- **Both sections sort by `releasedAt` descending.** Released was already descending; upcoming flipped
  from ascending, so the furthest-out module leads.

With the current `PULSE_TODAY`, top to bottom: Jun 24 → Jun 10 → May 27 → May 13.

### Module numbering

`displayNumber` is positional, not `issue.issueNumber` — the real issue numbers do not track release
date (pulse-11 ships after pulse-12), so using them would produce out-of-order labels. With a
reversed list, positional numbering must count *down* the page or the labels contradict the ordering:

- Upcoming: `totalVisible - i` → MODULE 04, MODULE 03
- Released: `released.length - i` → MODULE 02, MODULE 01

So numbers ascend with release date while the list descends. Note this remains a prototype fiction:
only the two newest released modules are shown out of ten, so "MODULE 01" is the older of the two
visible released modules, not the first Pulse ever published.

## Feature 4 — "I'm Interested" on upcoming cards

The upcoming CTA changes from a dead, disabled "Coming soon" to a live demand signal, so we learn
which unreleased modules people actually want before producing them.

### Behaviour

- **Default state:** outlined button, `Bell` icon, label "I'm Interested", `outlineVariant` border,
  `primary.main` text.
- **Marked state:** `Check` icon, label "Interested", `primary.light` background, `primary.main`
  border, and `disabled`.
- **One-way.** Interest cannot be withdrawn once recorded, so the demand count cannot be walked back
  or double-counted. The confirmed button keeps full colour while disabled — it reads as a completed
  action, not an unavailable one.
- Persists across reloads; available in every subscription state (an expired user expressing interest
  in future content is a signal worth having).

### Icon choice

`Bell` follows the dominant convention for unreleased content — Netflix's "Remind Me" on upcoming
titles, Steam and Amazon on unreleased items — so it needs no learning. Rejected alternatives:
`Sparkles` (Pulse's own brand mark in the nav and subscribe footer, so it reads as decoration),
`Star` (collides with the 1–5 rating in content feedback), `Heart` (implies a saved-favourites list
we do not have), `ThumbsUp` (reads as a quality vote rather than demand for something unreleased).

**Open commitment:** a bell implies a notification on release. If Pulse will not email interested
users when a module ships, swap to `ThumbsUp` — the button is otherwise unchanged.

### Implementation

New `src/lib/pulse/moduleInterest.ts`, following the `contentFeedback.ts` pattern:

- `addInterestId(ids, moduleId)` — pure, unit-tested, idempotent; no remove counterpart by design.
- `readInterestedIds()` / `isInterested(moduleId)` — localStorage-backed, key `pulse-module-interest`.
- `useModuleInterest(moduleId, moduleTitle)` — per-card `{ interested, markInterested }`. Local state
  is sufficient because no second surface renders the same module's button.

`markInterested` fires its analytics event only on the un-marked → marked transition, so a double-tap
or re-render cannot inflate the count. The event goes through the existing `track()` shim, matching
the `GL:PulseExitIntent_*` naming convention:

- `GL:PulseUpcomingModuleInterest_Marked`, with `{ moduleId, moduleTitle }`.

That event is what answers "how many users are interested in this upcoming module" once Mixpanel is
wired; the count is deliberately **not** displayed on the card — a visible low count would suppress
the very signal we are trying to collect.

## Files

- `src/lib/pulse/types.ts` — two fields on `PulseIssue`
- `src/mocks/pulse-issues.json` — the two fields × 13 modules
- `src/components/pulse/ModuleListCard.tsx` — meta row, `DurationItem` helper, upcoming restyle,
  interest button
- `src/lib/pulse/moduleInterest.ts` + `moduleInterest.test.ts` — interest store
- `src/pages/Pulse/PulseHome.tsx` — section order, descending sort, reversed numbering

## Verification

`addInterestId` is unit-tested (add, idempotence, same-reference on no-op, no mutation) alongside the
existing `src/lib/pulse/*.test.ts` suite — 43 tests passing. `npm run build` clean.

Visual and interaction pass at 1280px and 390px across the pre-trial and expired states, confirming:

- the meta row renders on all four visible cards and fits one line at 390px;
- upcoming cards render at full strength, with no date anywhere on the page;
- section order is Upcoming → AI Pulse Modules, with labels counting down 04 → 01 and the underlying
  `releasedAt` sort still descending;
- "I'm Interested" (bell) locks into a disabled, full-colour "✓ Interested" on tap, persists across
  reload, and emits `GL:PulseUpcomingModuleInterest_Marked` with the module id and title;
- the expired state retains its dimming, filled "Renew to unlock" CTA, and hidden hands-on button.

## Out of scope

- The in-module overview panel (`OverviewSurface.tsx` shows a single `{estimatedMinutes} min`).
- Curriculum item durations inside the player, which still disagree with `durationMinutes` for the
  authored modules (pulse-9, pulse-10).
- Displaying an aggregate interest count on the card, or any email/notification delivery when an
  interested module actually releases (see the open commitment under Feature 4).
- Any admin/undo path for a user who marked interest by mistake — one-way is deliberate.
- The two-module cap on the released section, which is unchanged.
