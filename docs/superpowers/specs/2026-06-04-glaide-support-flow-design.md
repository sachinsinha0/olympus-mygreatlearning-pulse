# Glaide Support Flow — Design Spec

**Date:** 2026-06-04
**Status:** Approved (brainstorm), pending implementation plan
**Author:** Sachin Sinha (with Claude)

## Summary

Wire the currently-dead "Ask A Question" button on the Program Support page into a
three-stage flow: a triage screen, an AI-mentor chat ("Glaide"), and ticket
escalation. Everything is mock-driven (no backend, no real LLM). The work is
additive: the V1 support page baseline is preserved and only extended.

## Goals

- Turn "Ask A Question" into a real entry point.
- Let learners start support from recent activity (with a pre-detected issue) or
  from one of 9 topic categories.
- Provide a scripted Glaide chat that answers, and escalates to a ticket when the
  learner is not satisfied.
- Surface past Glaide conversations as "Support Threads" on the support home.

## Non-Goals (YAGNI)

- Real LLM / Claude API integration.
- Real backend, persistence across reloads, or auth.
- Wiring the existing "Schedule Call" button.
- Notifications, analytics, search.

## Routes (additive to `src/App.tsx`)

| Route | Purpose |
|-------|---------|
| `/program_support` | Existing home. Add a 3rd tab: "Support Threads". |
| `/program_support/ask` | Triage screen (NEW). |
| `/program_support/chat/:threadId?` | Glaide chat (NEW). No id = fresh chat; id = reopen an existing thread. |

## Screen 1 — Triage (`/program_support/ask`)

- **Recent activity row:** 6 cards sourced from mock data. Each card represents a
  recent learner activity (video, doc page, assignment, quiz) and carries a
  pre-baked `detectedIssue` string (e.g. "Looks like you got stuck on Q3 of the
  quiz"). Tapping a card opens chat seeded with that activity + issue as context.
- **Category grid:** Section titled "Or pick a topic". 9 icon tiles:
  Fee Related Enquiries, Olympus Issues, Career Services, Projects,
  Learning Material, Live Sessions, Quizzes, Other Issues, Feedback.
  Tapping a tile opens chat seeded with that category.
- Reuses the hero/tinted-band layout language of the existing support page.

## Screen 2 — Glaide chat (`/program_support/chat/:threadId?`)

- Header: Glaide avatar + name + "AI Mentor" label.
- Opening bot message is seeded from the entry point (activity issue OR category).
- Scripted replies: a mock response bank keyed by category. User input is matched
  to a canned answer; unmatched input gets a sensible fallback.
- Escalation: an inline chip "Still not solved? Raise a ticket" is available in the
  chat. Tapping it confirms, then creates an Open ticket. Shows a success state and
  a link back to the support home.

## Data Model

Two concepts, both in-memory for the session:

- **Thread** — a Glaide conversation. Fields: `id`, `category`, `title`,
  `messages[]` (`{ role: "bot" | "user", text }`), `status: "active" | "resolved"`,
  `timestamp`.
- **Ticket** — a thread the learner escalated. Created from a thread on "Raise a
  ticket". Appears under **Open Tickets**. Reuses the existing `Ticket` shape
  (`id`, `title`, `subtitle`, `timestamp`, `category`).

**State management:** A `SupportContext` (React context provider) holds the live
lists of threads and tickets so conversations and escalations created during the
session appear on the support home without a backend. Seeded from mock JSON on
mount. (Decision: context chosen over static lists specifically so the
create-thread / raise-ticket actions are demonstrable end-to-end.)

## Support Home Tabs

- **Open Tickets** (existing) — now also includes session-created tickets.
- **Closed Tickets** (existing).
- **Support Threads** (NEW) — lists Glaide conversations. Tapping a thread reopens
  it at `/program_support/chat/:id`.

## Mock Data (extends `src/mocks/programSupport.json`)

Add the following keys:

- `recentActivity[]` — `{ id, type: "video"|"doc"|"assignment"|"quiz", title,
  detectedIssue }`, 6 entries.
- `categories[]` — the 9 categories with `{ key, label, icon }`.
- `glaideResponses` — response bank keyed by category, plus a `fallback`.
- `threads[]` — seed past Glaide conversations.

## Design System Constraints

- Olympus MUI tokens only: `surface.main`, `outlineVariant.main`, `primary.main`,
  `surfaceContainer.low`, `text.primary/secondary`. No hardcoded hex outside the
  existing category-color map pattern.
- Reuse existing card / row / hero patterns from `ProgramSupport.tsx`.
- No em-dash in any user-facing copy (reads as AI-authored).
- Glaide's visual identity pulls from the Pulse family DNA, not a new invented look.
- V1 baseline untouched; this flow is purely additive.

## Components (proposed boundaries)

- `SupportContext.tsx` — provider + hook (`useSupport`) exposing threads, tickets,
  `createThread`, `addMessage`, `raiseTicket`.
- `pages/AskQuestion.tsx` — triage screen.
- `pages/GlaideChat.tsx` — chat screen.
- `components/support/RecentActivityCard.tsx`
- `components/support/CategoryTile.tsx`
- `components/support/ChatBubble.tsx`
- `components/support/RaiseTicketChip.tsx`
- `ProgramSupport.tsx` — add Support Threads tab + render thread rows.

## Acceptance Criteria

1. "Ask A Question" navigates to `/program_support/ask`.
2. Triage shows 6 recent-activity cards (each with a detected issue) and 9 category tiles.
3. Tapping either opens Glaide chat with a correctly seeded opening message.
4. Typing a message returns a scripted reply (category-keyed, with fallback).
5. "Raise a ticket" creates an Open ticket visible on the support home.
6. Support home has 3 tabs; Support Threads lists conversations; tapping one reopens the chat.
7. All copy is em-dash free; all styling uses Olympus tokens; V1 baseline unchanged.

## Execution Plan (5-agent Workflow)

Orchestrated pipeline:
1. **Product Manager** — refine this spec into prioritized, testable requirements + acceptance checks.
2. **Designer** — per-screen user flows and token-level layout specs.
3. **Developer** — implement routes, components, context, and mock data.
4. **Dev Buddy** — adversarial review: bugs, token/design violations, edge cases, V1-regression risks.

Orchestrator synthesizes outputs; final code is applied and verified in the main session.
