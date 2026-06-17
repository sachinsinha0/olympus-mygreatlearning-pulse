# Program Support Tickets Tab + Status Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Program Support page's separate *Open Tickets* / *Closed Tickets* tabs with a single **Tickets** tab that filters by status (All / Open / Closed / Reopened), and rename the threads tab to **Glaide Chat**.

**Architecture:** Give each ticket a `status` field and merge the two mock arrays into one `tickets` list in `SupportContext`. A small pure module (`src/lib/support/tickets.ts`) holds the filter/count logic (unit-tested). `ProgramSupport.tsx` renders two tabs; the Tickets tab adds a segmented filter-pill bar (default All, with counts) and a per-row status chip.

**Tech Stack:** React 18, TypeScript, MUI v6, lucide-react, Vitest (node env).

**Branch:** `feature/program-support-tickets-tab` (already created; spec already committed there).

**Spec:** `docs/superpowers/specs/2026-06-17-program-support-tickets-tab-design.md`

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `src/lib/support/tickets.ts` | Pure ticket-status logic: types, labels, `filterByStatus`, `statusCounts` | Create |
| `src/lib/support/tickets.test.ts` | Unit tests for the pure logic | Create |
| `src/mocks/programSupport.json` | Merge `open`+`closed` → one `tickets` array with `status`; add a reopened sample | Modify |
| `src/context/SupportContext.tsx` | `Ticket.status`; single `tickets` state; mutators set `status:"open"` | Modify |
| `src/pages/ProgramSupport.tsx` | 2 tabs; filter-pill bar; status chip; per-filter empty state | Modify |

**Test note:** Vitest runs `environment: "node"`, `include: ["src/**/*.test.ts"]` — no DOM. Only Task 1 (pure logic) is unit-tested; the rest is verified by `npm run build` (tsc) + the manual walkthrough in Task 4. This matches the repo convention.

---

## Task 1: Pure ticket-status logic + tests

**Files:**
- Create: `src/lib/support/tickets.ts`
- Test: `src/lib/support/tickets.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/support/tickets.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { filterByStatus, statusCounts, STATUS_FILTERS, STATUS_LABELS } from "./tickets";

const tickets = [
  { id: "a", status: "open" as const },
  { id: "b", status: "open" as const },
  { id: "c", status: "closed" as const },
  { id: "d", status: "reopened" as const },
];

describe("filterByStatus", () => {
  it("returns everything for 'all'", () => {
    expect(filterByStatus(tickets, "all")).toHaveLength(4);
  });
  it("filters by a specific status", () => {
    expect(filterByStatus(tickets, "open").map((t) => t.id)).toEqual(["a", "b"]);
    expect(filterByStatus(tickets, "closed").map((t) => t.id)).toEqual(["c"]);
    expect(filterByStatus(tickets, "reopened").map((t) => t.id)).toEqual(["d"]);
  });
  it("returns an empty array when nothing matches", () => {
    expect(filterByStatus([{ id: "x", status: "open" as const }], "reopened")).toEqual([]);
  });
});

describe("statusCounts", () => {
  it("counts each status plus a total", () => {
    expect(statusCounts(tickets)).toEqual({ all: 4, open: 2, closed: 1, reopened: 1 });
  });
  it("zeroes for an empty list", () => {
    expect(statusCounts([])).toEqual({ all: 0, open: 0, closed: 0, reopened: 0 });
  });
});

describe("constants", () => {
  it("orders filters with 'all' first", () => {
    expect(STATUS_FILTERS).toEqual(["all", "open", "closed", "reopened"]);
  });
  it("labels every status", () => {
    expect(STATUS_LABELS).toEqual({ open: "Open", closed: "Closed", reopened: "Reopened" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/support/tickets.test.ts`
Expected: FAIL — cannot resolve `./tickets`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/support/tickets.ts`:

```ts
export type TicketStatus = "open" | "closed" | "reopened";
export type StatusFilter = "all" | TicketStatus;

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  closed: "Closed",
  reopened: "Reopened",
};

/** Filter pill order — "all" first. */
export const STATUS_FILTERS: StatusFilter[] = ["all", "open", "closed", "reopened"];

/** Return tickets matching the filter; "all" returns everything. */
export function filterByStatus<T extends { status: TicketStatus }>(
  tickets: T[],
  filter: StatusFilter,
): T[] {
  return filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
}

/** Count tickets per status, plus an "all" total. */
export function statusCounts(
  tickets: { status: TicketStatus }[],
): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = { all: tickets.length, open: 0, closed: 0, reopened: 0 };
  for (const t of tickets) counts[t.status]++;
  return counts;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/support/tickets.test.ts`
Expected: PASS — 3 suites, all green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/support/tickets.ts src/lib/support/tickets.test.ts
git commit -m "feat(support): pure ticket-status filter/count helpers"
```

---

## Task 2: Status field + merged tickets list (data model)

**Files:**
- Modify: `src/mocks/programSupport.json`
- Modify: `src/context/SupportContext.tsx`

This task keeps `openTickets` / `closedTickets` exposed (now **derived** from the merged list) so `ProgramSupport.tsx` keeps compiling — Task 3 switches the page over and removes them.

- [ ] **Step 1: Merge the mock ticket arrays**

In `src/mocks/programSupport.json`, transform the ticket data (leave every other top-level key — `recentActivity`, `categories`, `threads`, etc. — untouched):

1. Add `"status": "open"` to each of the 6 objects currently in the `open` array.
2. Add `"status": "closed"` to each of the 2 objects currently in the `closed` array.
3. Rename the `open` key to `tickets`, move the 2 `closed` objects into that same `tickets` array (keep their fields exactly; only the added `status` differs), and delete the now-empty `closed` key.
4. Append this new reopened sample as the last entry of `tickets`:

```json
{
  "id": "t7",
  "title": "Quiz score not updated after re-evaluation",
  "subtitle": "I raised this earlier and it was closed, but my corrected quiz score still isn't reflecting.",
  "timestamp": "10 Jun 26 11:20 AM",
  "category": "quizzes",
  "status": "reopened"
}
```

Result: `programSupport.json` has a single `tickets` array of 9 objects (6 open, 2 closed, 1 reopened) and no `open`/`closed` keys.

- [ ] **Step 2: Update SupportContext to the merged model**

Replace the entire contents of `src/context/SupportContext.tsx` with:

```tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import data from "../mocks/programSupport.json";
import type { TicketStatus } from "../lib/support/tickets";

export type ChatAction = {
  label: string;
  tag: string;
  style: "primary" | "outline" | "ghost";
};
export type ChatMessage = {
  role: "bot" | "user";
  text: string;
  options?: string[];
  /** Rich in-chat picker rendered under a bot message (e.g. project cards). */
  widget?: "projectCards" | "projectForm";
  /** Inline button under a bot reply (extension / re-evaluation / ticket / human). */
  action?: ChatAction;
  /** Visual tone for confirmation bubbles. */
  tone?: "success";
};
export type Thread = {
  id: string;
  category: string;
  title: string;
  status: "active" | "resolved" | "ticketed";
  timestamp: string;
  messages: ChatMessage[];
};
export type Ticket = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  category: string;
  status: TicketStatus;
};

type SupportState = {
  tickets: Ticket[];
  /** Derived from `tickets` for backward compat; removed once callers migrate. */
  openTickets: Ticket[];
  closedTickets: Ticket[];
  threads: Thread[];
  getThread: (id: string) => Thread | undefined;
  createThread: (seed: { category: string; title: string; messages: ChatMessage[] }) => string;
  addMessage: (threadId: string, message: ChatMessage) => void;
  raiseTicket: (threadId: string) => void;
  createTicket: (seed: { title: string; subtitle: string; category: string }) => void;
};

const SupportContext = createContext<SupportState | null>(null);

let counter = 0;
const nextId = (prefix: string) => `${prefix}_gen_${++counter}`;

export function SupportProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(data.tickets as Ticket[]);
  const [threads, setThreads] = useState<Thread[]>(data.threads as Thread[]);

  const value = useMemo<SupportState>(
    () => ({
      tickets,
      openTickets: tickets.filter((t) => t.status === "open"),
      closedTickets: tickets.filter((t) => t.status === "closed"),
      threads,
      getThread: (id) => threads.find((t) => t.id === id),
      createThread: (seed) => {
        const id = nextId("th");
        const thread: Thread = {
          id,
          category: seed.category,
          title: seed.title,
          status: "active",
          timestamp: "Just now",
          messages: seed.messages,
        };
        setThreads((prev) => [thread, ...prev]);
        return id;
      },
      addMessage: (threadId, message) =>
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, message] } : t))
        ),
      raiseTicket: (threadId) =>
        setThreads((prev) => {
          const thread = prev.find((t) => t.id === threadId);
          if (thread) {
            setTickets((ts) => [
              {
                id: nextId("t"),
                title: thread.title,
                subtitle: thread.messages[0]?.text ?? "Raised from Glaide chat",
                timestamp: "Just now",
                category: thread.category,
                status: "open",
              },
              ...ts,
            ]);
          }
          return prev.map((t) => (t.id === threadId ? { ...t, status: "ticketed" } : t));
        }),
      createTicket: (seed) =>
        setTickets((ts) => [
          {
            id: nextId("t"),
            title: seed.title,
            subtitle: seed.subtitle,
            timestamp: "Just now",
            category: seed.category,
            status: "open",
          },
          ...ts,
        ]),
    }),
    [tickets, threads]
  );

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupport must be used within SupportProvider");
  return ctx;
}
```

- [ ] **Step 3: Typecheck + build**

Run: `npm run build`
Expected: PASS — `tsc -b` clean (ProgramSupport still uses the derived `openTickets`/`closedTickets`), vite build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/mocks/programSupport.json src/context/SupportContext.tsx
git commit -m "feat(support): merge tickets into one list with status field"
```

---

## Task 3: Tickets tab with filter + status chip; Glaide Chat tab

**Files:**
- Modify: `src/pages/ProgramSupport.tsx`
- Modify: `src/context/SupportContext.tsx` (remove the now-unused derived fields)

- [ ] **Step 1: Update imports in ProgramSupport.tsx**

In `src/pages/ProgramSupport.tsx`, change the React import (line 1) to add `useMemo`:

```tsx
import { useMemo, useState } from "react";
```

And add, after the existing `useSupport` import (line 20):

```tsx
import {
  filterByStatus,
  statusCounts,
  STATUS_FILTERS,
  STATUS_LABELS,
  type StatusFilter,
  type TicketStatus,
} from "../lib/support/tickets";
```

- [ ] **Step 2: Switch the page state to the merged list + filter**

Replace these lines in the `ProgramSupport` component (currently lines 41-43):

```tsx
  const { openTickets, closedTickets, threads } = useSupport();
  const [tab, setTab] = useState(0);
  const tickets = tab === 0 ? openTickets : closedTickets;
```

with:

```tsx
  const { tickets, threads } = useSupport();
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const counts = useMemo(() => statusCounts(tickets), [tickets]);
  const visibleTickets = useMemo(() => filterByStatus(tickets, statusFilter), [tickets, statusFilter]);
```

- [ ] **Step 3: Replace the Tabs + tab content**

Replace the `<Tabs>…</Tabs>` block and the conditional content that follows it (currently lines 91-150, from `<Tabs` through the closing of the `tab === 2 ? … : …` block) with:

```tsx
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
              sx={{
                borderBottom: 1,
                borderColor: "outlineVariant.main",
                minHeight: 48,
                "& .MuiTab-root": {
                  minHeight: 48,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.1px",
                  textTransform: "none",
                  color: "text.primary",
                },
                "& .MuiTab-root.Mui-selected": { color: "primary.main", fontWeight: 600 },
                "& .MuiTabs-indicator": {
                  height: 3,
                  backgroundColor: "transparent",
                  display: "flex",
                  justifyContent: "center",
                },
                "& .MuiTabs-indicatorSpan": {
                  width: "100%",
                  maxWidth: 92,
                  backgroundColor: "primary.main",
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab label="Tickets" disableRipple />
              <Tab label="Glaide Chat" disableRipple />
            </Tabs>

            {tab === 1 ? (
              <Box>
                {threads.length === 0 ? (
                  <ThreadsEmptyState onAsk={() => navigate("/program_support/ask")} />
                ) : (
                  threads.map((th, i) => (
                    <ThreadRow
                      key={th.id}
                      thread={th}
                      divider={i < threads.length - 1}
                      onClick={() => navigate(`/program_support/chat/${th.id}`)}
                    />
                  ))
                )}
              </Box>
            ) : (
              <Box>
                <TicketFilterBar counts={counts} value={statusFilter} onChange={setStatusFilter} />
                {visibleTickets.length === 0 ? (
                  <TicketsEmptyState filter={statusFilter} />
                ) : (
                  visibleTickets.map((t, i) => (
                    <TicketRow key={t.id} ticket={t} divider={i < visibleTickets.length - 1} />
                  ))
                )}
              </Box>
            )}
```

- [ ] **Step 4: Add the status chip to TicketRow**

In `TicketRow` (the existing function), add the status chip just before the timestamp `<Typography>`. Find this block inside `TicketRow`:

```tsx
      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          letterSpacing: "-0.2px",
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
        }}
      >
        {ticket.timestamp}
      </Typography>
```

and insert a `TicketStatusChip` immediately before it so the row reads chip-then-timestamp:

```tsx
      <TicketStatusChip status={ticket.status} />

      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          letterSpacing: "-0.2px",
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
        }}
      >
        {ticket.timestamp}
      </Typography>
```

- [ ] **Step 5: Add the new presentational components**

Add these three functions to `src/pages/ProgramSupport.tsx` (e.g. just after the `TicketRow` function). `alpha`, `Stack`, `Box`, `Typography`, and the `ClipboardList` icon are already imported in this file.

```tsx
function TicketStatusChip({ status }: { status: TicketStatus }) {
  return (
    <Box
      sx={(theme) => {
        const tone = {
          open: { bg: theme.palette.primary.light, fg: theme.palette.primary.main },
          closed: { bg: alpha(theme.palette.text.primary, 0.08), fg: theme.palette.text.secondary },
          reopened: {
            bg: theme.palette.extended.warning.colorContainer,
            fg: theme.palette.extended.warning.color,
          },
        }[status];
        return {
          flexShrink: 0,
          px: 1,
          py: 0.25,
          borderRadius: 999,
          bgcolor: tone.bg,
          color: tone.fg,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "18px",
          letterSpacing: "-0.1px",
          whiteSpace: "nowrap",
        };
      }}
    >
      {STATUS_LABELS[status]}
    </Box>
  );
}

function TicketFilterBar({
  counts,
  value,
  onChange,
}: {
  counts: Record<StatusFilter, number>;
  value: StatusFilter;
  onChange: (filter: StatusFilter) => void;
}) {
  return (
    <Stack
      direction="row"
      gap={1}
      sx={{ flexWrap: "wrap", px: 2, py: 1.5, borderBottom: 1, borderColor: "outlineVariant.main" }}
    >
      {STATUS_FILTERS.map((f) => {
        const selected = value === f;
        const label = f === "all" ? "All" : STATUS_LABELS[f];
        return (
          <Box
            key={f}
            component="button"
            type="button"
            onClick={() => onChange(f)}
            aria-pressed={selected}
            sx={(theme) => ({
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.1px",
              px: 1.5,
              py: 0.625,
              borderRadius: 999,
              border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.outlineVariant.main}`,
              bgcolor: selected ? theme.palette.primary.light : "transparent",
              color: selected ? theme.palette.primary.main : theme.palette.text.primary,
              transition: "background-color 140ms ease, border-color 140ms ease, color 140ms ease",
              "&:hover": { borderColor: theme.palette.primary.main },
            })}
          >
            {label} {counts[f]}
          </Box>
        );
      })}
    </Stack>
  );
}

function TicketsEmptyState({ filter }: { filter: StatusFilter }) {
  const message =
    filter === "all" ? "No tickets yet" : `No ${STATUS_LABELS[filter].toLowerCase()} tickets`;
  return (
    <Stack alignItems="center" gap={1} sx={{ py: 4, px: 2, textAlign: "center" }}>
      <Box sx={{ color: "text.secondary", display: "flex" }}>
        <ClipboardList size={28} strokeWidth={2} />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: "text.primary" }}>{message}</Typography>
    </Stack>
  );
}
```

- [ ] **Step 6: Remove the derived compat fields from SupportContext**

Now that `ProgramSupport` uses `tickets`, remove the temporary derived fields. In `src/context/SupportContext.tsx`:

Remove these three lines from the `SupportState` type:

```tsx
  /** Derived from `tickets` for backward compat; removed once callers migrate. */
  openTickets: Ticket[];
  closedTickets: Ticket[];
```

And remove these two lines from the `value` object in `SupportProvider`:

```tsx
      openTickets: tickets.filter((t) => t.status === "open"),
      closedTickets: tickets.filter((t) => t.status === "closed"),
```

- [ ] **Step 7: Typecheck + build**

Run: `npm run build`
Expected: PASS — no TypeScript errors, vite build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/pages/ProgramSupport.tsx src/context/SupportContext.tsx
git commit -m "feat(support): single Tickets tab with status filter + Glaide Chat tab"
```

---

## Task 4: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Run the unit tests**

Run: `npm test`
Expected: PASS — all suites green, including `tickets.test.ts`.

- [ ] **Step 2: Run the full build**

Run: `npm run build`
Expected: PASS — `tsc -b` clean, vite build succeeds.

- [ ] **Step 3: Manual walkthrough**

Run: `npm run dev`, open `/program_support`:
- Two tabs only: **Tickets** (default) and **Glaide Chat**.
- Tickets tab shows the filter pills `All 9 · Open 6 · Closed 2 · Reopened 1`, "All" selected, all 9 tickets listed, each with a status chip (Open = blue tint, Closed = grey, Reopened = amber).
- Click **Open** → only the 6 open tickets; **Closed** → 2; **Reopened** → 1; **All** → 9 again.
- Glaide Chat tab shows the existing threads list (or its empty state).
- From Ask A Question, create a ticket (via Glaide chat flow) → it appears under Open with an Open chip and the All/Open counts increment.

- [ ] **Step 4: Final confirmation**

Confirm behavior matches the spec. No commit needed unless the walkthrough surfaced a fix.

---

## Self-Review

**Spec coverage:**
- Two tabs (Tickets + Glaide Chat) → Task 3 Step 3. ✓
- `Ticket.status` + merged `tickets` list + reopened sample → Task 2. ✓
- Mutators set `status:"open"`; `createTicket` seed unchanged so `GlaideChat.tsx` untouched → Task 2 Step 2. ✓
- Segmented filter pills, default All, with counts → Task 3 (`TicketFilterBar`, `statusFilter` default `"all"`). ✓
- Per-row status chip with the agreed tones → Task 3 (`TicketStatusChip`). ✓
- Per-filter empty state → Task 3 (`TicketsEmptyState`). ✓
- Pure testable module → Task 1. ✓
- Out of scope (reopen action, search/sort, thread changes, filter persistence) → not implemented. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full content. The mock edit (Task 2 Step 1) is a precise transformation of existing data plus a verbatim reopened object — the existing rows are preserved by instruction rather than re-typed to avoid transcription drift. ✓

**Type consistency:** `TicketStatus`/`StatusFilter`/`STATUS_LABELS`/`STATUS_FILTERS`/`filterByStatus`/`statusCounts` are defined in Task 1 and used identically in Tasks 2-3. `Ticket.status` added in Task 2 is consumed by `TicketStatusChip` and the filter in Task 3. `counts: Record<StatusFilter, number>` matches `statusCounts`'s return type. ✓
