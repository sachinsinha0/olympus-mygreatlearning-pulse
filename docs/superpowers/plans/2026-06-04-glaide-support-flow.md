# Glaide Support Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the dead "Ask A Question" button into a triage -> Glaide AI-mentor chat -> ticket-escalation flow, fully mock-driven and additive to the existing Program Support page.

**Architecture:** New React Router routes layered onto the existing app. A `SupportContext` provider holds in-session threads and tickets (seeded from mock JSON) so created conversations and escalations appear on the support home without a backend. Glaide replies come from a category-keyed mock response bank.

**Tech Stack:** React, TypeScript, MUI v6 (Olympus token theme), react-router-dom, lucide-react. No test framework — verification is `npm run build` (tsc typecheck) plus a manual route walk in `npm run dev`.

**Conventions:**
- Olympus tokens only: `surface.main`, `surfaceContainer.low/main`, `outlineVariant.main`, `primary.main`, `text.primary/secondary`. No new raw hex except the existing per-category color map pattern in `ProgramSupport.tsx`.
- No em-dash in any user-facing copy.
- Each task ends with `npm run build` passing and a commit.

---

## File Structure

- Create `src/context/SupportContext.tsx` — provider + `useSupport` hook (threads, tickets, `createThread`, `addMessage`, `raiseTicket`).
- Create `src/components/support/RecentActivityCard.tsx`
- Create `src/components/support/CategoryTile.tsx`
- Create `src/components/support/ChatBubble.tsx`
- Create `src/components/support/RaiseTicketChip.tsx`
- Create `src/pages/AskQuestion.tsx` — triage screen.
- Create `src/pages/GlaideChat.tsx` — chat screen.
- Modify `src/mocks/programSupport.json` — add `recentActivity`, `categories`, `glaideResponses`, `threads`.
- Modify `src/pages/ProgramSupport.tsx` — wire "Ask A Question", add "Support Threads" tab.
- Modify `src/App.tsx` — add routes, wrap routes in `SupportProvider`.

---

## Task 1: Extend mock data

**Files:**
- Modify: `src/mocks/programSupport.json`

- [ ] **Step 1: Add new keys** alongside existing `open`/`closed`:

```json
"recentActivity": [
  { "id": "a1", "type": "quiz", "title": "Quiz: Transformers Basics", "module": "Module 8", "detectedIssue": "You scored below the pass mark on question 3 about attention heads." },
  { "id": "a2", "type": "video", "title": "Video: Fine-tuning LLMs", "module": "Module 9", "detectedIssue": "You rewatched the 12:40 segment three times. Stuck on LoRA?" },
  { "id": "a3", "type": "assignment", "title": "Assignment: RAG Pipeline", "module": "Module 10", "detectedIssue": "Your submission failed the vector-store connection check." },
  { "id": "a4", "type": "doc", "title": "Reading: Prompt Engineering", "module": "Module 7", "detectedIssue": "You spent a long time on the few-shot examples page." },
  { "id": "a5", "type": "quiz", "title": "Quiz: Evaluation Metrics", "module": "Module 11", "detectedIssue": "Two attempts used up. Confused about BLEU vs ROUGE?" },
  { "id": "a6", "type": "video", "title": "Video: Agentic Workflows", "module": "Module 12", "detectedIssue": "Playback stopped early. The content may have failed to load." }
],
"categories": [
  { "key": "fee", "label": "Fee Related Enquiries", "icon": "DollarSign" },
  { "key": "olympus", "label": "Olympus Issues", "icon": "MonitorSmartphone" },
  { "key": "career", "label": "Career Services", "icon": "Briefcase" },
  { "key": "projects", "label": "Projects", "icon": "FolderKanban" },
  { "key": "material", "label": "Learning Material", "icon": "BookOpen" },
  { "key": "sessions", "label": "Live Sessions", "icon": "Video" },
  { "key": "quizzes", "label": "Quizzes", "icon": "ListChecks" },
  { "key": "other", "label": "Other Issues", "icon": "CircleHelp" },
  { "key": "feedback", "label": "Feedback", "icon": "MessageSquareHeart" }
],
"glaideResponses": {
  "fee": "I can help with fees. Most installment mismatches clear within 24 hours of payment. Could you tell me the date and amount you paid?",
  "olympus": "Olympus glitches are usually fixed by a hard refresh or clearing the cache. What screen were you on when it broke?",
  "career": "Career Services covers resume reviews, mock interviews, and referrals. Which of these do you need help with?",
  "projects": "Happy to help with your project. Is this about the brief, a submission error, or feedback you received?",
  "material": "I can point you to the right module content. Which topic is giving you trouble?",
  "sessions": "For live sessions I can share recordings or attendance fixes. Which session is this about?",
  "quizzes": "Let us sort the quiz out. Is this about a score, a locked attempt, or a question you want explained?",
  "other": "Tell me a bit more about the issue and I will do my best to help.",
  "feedback": "Thanks for sharing feedback. I am listening, go ahead.",
  "fallback": "I want to make sure I get this right. Could you add a little more detail?"
},
"threads": [
  { "id": "th1", "category": "quizzes", "title": "Quiz attempt locked", "status": "resolved", "timestamp": "01 Jun 26 3:20 PM", "messages": [ { "role": "user", "text": "My quiz attempt got locked midway." }, { "role": "bot", "text": "That happens on a dropped connection. I have reset your attempt, try again now." } ] },
  { "id": "th2", "category": "olympus", "title": "Dashboard not loading", "status": "active", "timestamp": "29 May 26 10:05 AM", "messages": [ { "role": "user", "text": "The dashboard is stuck on a blank screen." }, { "role": "bot", "text": "A hard refresh fixes this most of the time. Did that help?" } ] }
]
```

- [ ] **Step 2: Verify** `npm run build` passes (JSON import typechecks). Expected: build succeeds.
- [ ] **Step 3: Commit** `git add src/mocks/programSupport.json && git commit -m "feat(support): add triage, category and Glaide mock data"`

---

## Task 2: SupportContext provider

**Files:**
- Create: `src/context/SupportContext.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create the context.** It seeds from mock JSON and exposes mutators. Shape:

```tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import data from "../mocks/programSupport.json";

export type ChatMessage = { role: "bot" | "user"; text: string };
export type Thread = {
  id: string;
  category: string;
  title: string;
  status: "active" | "resolved";
  timestamp: string;
  messages: ChatMessage[];
};
export type Ticket = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  category: string;
};

type SupportState = {
  openTickets: Ticket[];
  closedTickets: Ticket[];
  threads: Thread[];
  getThread: (id: string) => Thread | undefined;
  createThread: (seed: { category: string; title: string; messages: ChatMessage[] }) => string;
  addMessage: (threadId: string, message: ChatMessage) => void;
  raiseTicket: (threadId: string) => void;
};

const SupportContext = createContext<SupportState | null>(null);

let counter = 0;
const nextId = (prefix: string) => `${prefix}_gen_${++counter}`;

export function SupportProvider({ children }: { children: ReactNode }) {
  const [openTickets, setOpenTickets] = useState<Ticket[]>(data.open as Ticket[]);
  const [closedTickets] = useState<Ticket[]>(data.closed as Ticket[]);
  const [threads, setThreads] = useState<Thread[]>(data.threads as Thread[]);

  const value = useMemo<SupportState>(() => ({
    openTickets,
    closedTickets,
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
          setOpenTickets((tickets) => [
            {
              id: nextId("t"),
              title: thread.title,
              subtitle: thread.messages[0]?.text ?? "Raised from Glaide chat",
              timestamp: "Just now",
              category: thread.category,
            },
            ...tickets,
          ]);
        }
        return prev.map((t) => (t.id === threadId ? { ...t, status: "resolved" } : t));
      }),
  }), [openTickets, closedTickets, threads]);

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupport must be used within SupportProvider");
  return ctx;
}
```

- [ ] **Step 2: Wrap routes** in `src/App.tsx`: import `SupportProvider`, wrap the `<Routes>` block (inside `PageLoaderProvider`).
- [ ] **Step 3: Verify** `npm run build` passes.
- [ ] **Step 4: Commit** `git commit -am "feat(support): add SupportContext for in-session threads and tickets"`

---

## Task 3: Support presentation components

**Files:**
- Create: `src/components/support/RecentActivityCard.tsx`, `CategoryTile.tsx`, `ChatBubble.tsx`, `RaiseTicketChip.tsx`

- [ ] **Step 1: RecentActivityCard** — a clickable Card. Props: `{ title, module, detectedIssue, type, onClick }`. Maps `type` to a lucide icon (Video, FileText, ClipboardList, ListChecks). Uses `outlineVariant.main` border, 16px radius, hover `surfaceContainer.low`. Shows title (16/500), module (12 secondary), and the detectedIssue (14 secondary, 2-line clamp).
- [ ] **Step 2: CategoryTile** — clickable Card. Props `{ label, Icon, onClick }`. Circular icon chip (reuse the 42px circle pattern from `ProgramSupport.tsx` TicketRow), label below. Grid-friendly (full width of its grid cell).
- [ ] **Step 3: ChatBubble** — props `{ role, text }`. Bot bubble left-aligned on `surfaceContainer.low`; user bubble right-aligned on `primary.main` with white text. 12px radius, max-width 75%.
- [ ] **Step 4: RaiseTicketChip** — props `{ onRaise }`. A bordered pill row: text "Still not solved?" + a contained "Raise a ticket" button using `primary.main`.
- [ ] **Step 5: Verify** `npm run build` passes.
- [ ] **Step 6: Commit** `git commit -am "feat(support): add triage and chat presentation components"`

---

## Task 4: AskQuestion triage page

**Files:**
- Create: `src/pages/AskQuestion.tsx`

- [ ] **Step 1: Build the page.** Reuse the `ProgramSupport` shell (TopNav, tinted band, gutter container, footer). Section "Based on your recent activity" -> responsive grid of 6 `RecentActivityCard`. Section "Or pick a topic" -> responsive grid (3 cols md) of 9 `CategoryTile`. A back affordance to `/program_support`.
- [ ] **Step 2: Wire navigation.** Reading mock `recentActivity` and `categories` directly (static lists; not in context). On activity click: `navigate("/program_support/chat", { state: { kind: "activity", activity } })`. On category click: `navigate("/program_support/chat", { state: { kind: "category", categoryKey, label } })`.
- [ ] **Step 3: Add route** in `App.tsx`: `<Route path="/program_support/ask" element={<AskQuestion />} />`.
- [ ] **Step 4: Verify** `npm run build` passes; in `npm run dev`, `/program_support/ask` renders both sections.
- [ ] **Step 5: Commit** `git commit -am "feat(support): add Ask a Question triage page"`

---

## Task 5: GlaideChat page

**Files:**
- Create: `src/pages/GlaideChat.tsx`

- [ ] **Step 1: Build the chat.** On mount, derive a seed from `location.state` (activity issue text, or category greeting from `glaideResponses[key]`) and call `useSupport().createThread(...)`, storing the returned `threadId`. If a `:threadId` param is present instead, load that existing thread via `getThread`.
- [ ] **Step 2: Render** the Glaide header (avatar circle + "Glaide" + "AI Mentor" caption), the scrollable message list of `ChatBubble`, the `RaiseTicketChip`, and a text input + send button fixed at the bottom of the chat card.
- [ ] **Step 3: Reply logic.** On send: `addMessage(threadId, { role: "user", text })`, then push a bot reply from `glaideResponses[category]` (or `fallback`) via `addMessage`. Keep it synchronous; optionally a short setTimeout for a typing feel.
- [ ] **Step 4: Escalation.** `RaiseTicketChip.onRaise` -> `raiseTicket(threadId)`, then show a success panel ("Ticket raised. Track it under Open Tickets.") with a button to `/program_support`.
- [ ] **Step 5: Add routes** in `App.tsx`: `/program_support/chat` and `/program_support/chat/:threadId`.
- [ ] **Step 6: Verify** `npm run build` passes; walk the flow in dev: triage -> chat seeded -> send -> reply -> raise ticket -> success.
- [ ] **Step 7: Commit** `git commit -am "feat(support): add Glaide chat page with scripted replies and escalation"`

---

## Task 6: Wire support home (button + Support Threads tab)

**Files:**
- Modify: `src/pages/ProgramSupport.tsx`

- [ ] **Step 1: Wire the button.** Add `const navigate = useNavigate();` and `onClick={() => navigate("/program_support/ask")}` to the "Ask A Question" Button.
- [ ] **Step 2: Source data from context.** Replace the static `data.open`/`data.closed` reads with `useSupport()` for tickets and threads. Keep the `Ticket`/`CATEGORY` shapes.
- [ ] **Step 3: Add third tab** `<Tab label="Support Threads" />`. When selected, render threads: reuse `TicketRow` styling but map a thread to `{ title, subtitle: last message text, timestamp, category }`. Row onClick -> `navigate("/program_support/chat/" + thread.id)`. Adjust the indicator `maxWidth` so 3 tabs space correctly.
- [ ] **Step 4: Verify** `npm run build` passes; in dev all three tabs render; a raised ticket from chat appears under Open Tickets; threads are tappable and reopen the chat.
- [ ] **Step 5: Commit** `git commit -am "feat(support): wire Ask a Question button and add Support Threads tab"`

---

## Self-Review Notes

- Spec coverage: routes (T4,T5,T6), triage screen (T4), chat + scripted replies + escalation (T5), data model + context (T1,T2), three tabs + threads (T6), mock data (T1). All covered.
- Verification adapted to no test framework: `npm run build` (tsc) + manual dev walk per task.
- Type consistency: `Thread`, `Ticket`, `ChatMessage`, `createThread`, `addMessage`, `raiseTicket`, `getThread` are defined in Task 2 and used unchanged in Tasks 5 and 6.
- Lucide icon names in `categories` must exist in `lucide-react` (DollarSign, MonitorSmartphone, Briefcase, FolderKanban, BookOpen, Video, ListChecks, CircleHelp, MessageSquareHeart). Map them in a lookup in `AskQuestion`/`CategoryTile`, not by dynamic string import.
- No em-dash in any copy above.
