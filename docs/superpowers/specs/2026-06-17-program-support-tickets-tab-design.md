# Program Support — Merge Ticket Tabs + Status Filter

**Date:** 2026-06-17
**Author:** Sachin Sinha
**Status:** Draft for review

## Problem

The Program Support page ([src/pages/ProgramSupport.tsx](../../../src/pages/ProgramSupport.tsx))
currently has **three tabs**: *Open Tickets*, *Closed Tickets*, and *Support Threads*. Splitting
tickets across two tabs is redundant — a user looking for "my tickets" has to know which tab a
ticket lives in. We want to:

1. Collapse the two ticket tabs into a single **Tickets** tab with a status filter.
2. Support three ticket states — **Open**, **Closed**, **Reopened** — that the user can filter by.
3. Keep a second tab for the Glaide conversations, renamed **Glaide Chat**.

End state: **two tabs** — *Tickets* and *Glaide Chat*.

## Current state (verified)

- Tabs are index-driven in `ProgramSupport.tsx`; `tab === 0 ? openTickets : closedTickets`, with
  a third tab (index 2) for threads.
- `Ticket` ([SupportContext.tsx](../../../src/context/SupportContext.tsx)) has **no status field**:
  `{ id, title, subtitle, timestamp, category }`. Open/closed are two separate arrays
  (`data.open`, `data.closed`) — there is no "reopened" concept.
- Mock data: `data.open` (6), `data.closed` (2), `data.threads` (2).
- **Consumers of `openTickets`/`closedTickets`:** only `ProgramSupport.tsx` (and the context
  itself). Merging is safe.
- **Mutators:** `createTicket` (called from `GlaideChat.tsx:247`) and `raiseTicket` (defined,
  no current UI caller) both push to `openTickets`. After the change they push with
  `status: "open"`; their seed signatures do not change, so `GlaideChat.tsx` needs no edit.
- `Thread` already has its own `status` (`"active" | "resolved" | "ticketed"`) — unrelated to
  ticket status and **unchanged**.

## Decisions (locked with stakeholder)

| Topic | Decision |
|-------|----------|
| Second tab name | **Glaide Chat** |
| Filter control | **Segmented pills** with live counts: `All · Open · Closed · Reopened` |
| Default filter | **All** |
| Default tab | **Tickets** (index 0) |
| Reopen | **Status + filter only** — no "Reopen" action button |
| Status chip colors | Open = primary/blue tint · Closed = neutral grey · Reopened = amber/warning |

## Design

### Tabs

Two tabs in `ProgramSupport.tsx`: **Tickets** (index 0, default) and **Glaide Chat** (index 1).
The third `<Tab>` and the `tab === 0 ? openTickets : closedTickets` logic are removed. The
threads branch moves from `tab === 2` to `tab === 1`.

### Data model

- `TicketStatus = "open" | "closed" | "reopened"`.
- `Ticket` gains `status: TicketStatus`.
- **Mock** (`src/mocks/programSupport.json`): replace `open` and `closed` with a single
  `tickets` array. Each former `open` entry gets `"status": "open"`, each former `closed` entry
  gets `"status": "closed"`, and **one new entry** with `"status": "reopened"` is added (a
  realistic reopened ticket, e.g. a quiz-score mismatch) so the Reopened filter is demonstrable.
  `threads` is unchanged.
- **`SupportContext`:**
  - State: a single `tickets: Ticket[]` (seeded from `data.tickets`) replacing `openTickets` /
    `closedTickets`.
  - Context value exposes `tickets` (drops `openTickets` / `closedTickets`).
  - `createTicket(seed)` and `raiseTicket(threadId)` prepend new tickets with `status: "open"`.
  - Seed signatures unchanged (`createTicket({ title, subtitle, category })`), so
    `GlaideChat.tsx` is untouched.

### Pure logic module (testable)

`src/lib/support/tickets.ts` — single responsibility, no React/DOM, unit-tested in the node
vitest env:

- `export type TicketStatus = "open" | "closed" | "reopened"`.
- `export type StatusFilter = "all" | TicketStatus`.
- `export const STATUS_LABELS: Record<TicketStatus, string>` → `{ open: "Open", closed: "Closed",
  reopened: "Reopened" }`.
- `export const STATUS_FILTERS: StatusFilter[]` → `["all", "open", "closed", "reopened"]`
  (drives the pill order).
- `filterByStatus(tickets: Ticket[], filter: StatusFilter): Ticket[]` — returns all tickets when
  `filter === "all"`, else those whose `status === filter`.
- `statusCounts(tickets: Ticket[]): Record<StatusFilter, number>` — `{ all: tickets.length,
  open: n, closed: n, reopened: n }`.

`Ticket` stays defined in `SupportContext`; `tickets.ts` imports the `Ticket` type from there
(type-only import — no runtime cycle).

### Tickets tab UI (`ProgramSupport.tsx`)

- **Filter bar** above the list: a row of pills built from `STATUS_FILTERS`, each labelled
  `<Label> <count>` (e.g. `All 9`, `Open 6`, `Reopened 1`) from `statusCounts`. The selected pill
  is primary-tinted (filled light-primary bg + primary text/border); others are outlined. Local
  state `statusFilter` (default `"all"`).
- **List:** `filterByStatus(tickets, statusFilter).map(...)` rendered as `TicketRow`s. Each row
  gains a small **status chip** (right side, near the timestamp) showing
  `STATUS_LABELS[ticket.status]` in the status tone:
  - `open` → primary tint (e.g. `primary.light` bg, `primary.main` text)
  - `closed` → neutral (e.g. `outlineVariant`/surface bg, `text.secondary` text)
  - `reopened` → warning (`theme.palette.extended.warning.colorContainer` bg,
    `theme.palette.extended.warning.color` text — the token already used by Pulse banners)
- **Empty state** when the active filter yields zero tickets: a short message keyed to the filter
  (e.g. "No reopened tickets", "No tickets yet" for All).

### Glaide Chat tab UI

The existing threads list (`ThreadRow`) and `ThreadsEmptyState` are unchanged — only the tab
label changes to "Glaide Chat" and the branch index moves to `tab === 1`.

### Component boundaries

- `TicketStatusChip` — small presentational chip mapping a `TicketStatus` to label + tone.
- `TicketFilterBar` — the pill row; props `{ counts, value, onChange }`. Keeps `ProgramSupport`
  readable and the pieces independently understandable.
- Both live in `ProgramSupport.tsx` alongside the existing `TicketRow`/`ThreadRow` (the file is
  ~470 lines and cohesive; a same-file split matches the existing pattern). If the file grows
  past readability they can move to `src/components/support/`.

## Files touched

| File | Change |
|------|--------|
| `src/mocks/programSupport.json` | Merge `open`+`closed` → `tickets` with `status`; add a reopened sample |
| `src/context/SupportContext.tsx` | `Ticket.status`; single `tickets` state + value; mutators set `status:"open"` |
| `src/lib/support/tickets.ts` | **new** — `TicketStatus`, labels, filters, `filterByStatus`, `statusCounts` |
| `src/lib/support/tickets.test.ts` | **new** — unit tests for the pure helpers |
| `src/pages/ProgramSupport.tsx` | 2 tabs; filter bar; status chip; per-filter empty state |

## Testing

- `tickets.test.ts` (node env, `.test.ts`): `filterByStatus` (all returns everything; each status
  filters correctly; empty result for an absent status) and `statusCounts` (totals add up;
  `all === tickets.length`).
- UI (tabs, pills, chip rendering) verified via `npm run build` typecheck + manual walkthrough on
  the Program Support page (vitest has no DOM env, matching repo convention).

## Out of scope (YAGNI)

- A "Reopen" action button / state transition (status is data + filter only).
- Search, sorting, pagination, or date-range filtering of tickets.
- Changes to thread (`Glaide Chat`) behavior beyond the tab rename.
- Persisting the selected filter across navigation.
