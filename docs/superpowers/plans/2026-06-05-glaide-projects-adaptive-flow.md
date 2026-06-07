# Glaide Projects Adaptive Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After a learner picks a project and describes a problem in free text, Glaide replies in one of four adaptive shapes (mentor / action / lookup / route), faking AI with keyword classification on dummy data.

**Architecture:** A pure `classifyIntent(text)` helper maps the typed problem to an intent bucket from `programSupport.json`. `GlaideChat.handleSend` (only for the `projects` category) interpolates the bucket's response with the selected project name and renders the matching shape. ACTION/ROUTE/mentor-escalation buttons call a new `createTicket` on `SupportContext` and post an inline success confirmation; the chat stays open.

**Tech Stack:** React 18 + TypeScript + MUI v6 + framer-motion + Vite. Vitest (added here) for the one pure helper.

---

## Background

The Projects entry flow already exists (commit 1a0c091): tapping "Projects" opens Glaide with recent-3 project cards + "Other" cascade, and after a pick Glaide asks "What problem are you facing with it?". Today the free-text reply is generic (`glaideResponses[category]`). This plan replaces that generic reply, **for the projects category only**, with the adaptive engine. Other categories are untouched.

Spec: `docs/superpowers/specs/2026-06-05-glaide-projects-adaptive-flow-design.md`.

## File Structure

- `vitest.config.ts` (create) — minimal Vitest config.
- `src/lib/classifyIntent.ts` (create) — pure classifier + types. One responsibility: text → intent bucket.
- `src/lib/classifyIntent.test.ts` (create) — unit tests for the classifier.
- `src/mocks/programSupport.json` (modify) — add `projectIntents` (buckets) and `ticketConfirmations`.
- `src/context/SupportContext.tsx` (modify) — extend `ChatMessage` with `action`/`tone`; add `createTicket`.
- `src/components/support/ChatBubble.tsx` (modify) — render an action button and a success-tone reply.
- `src/pages/GlaideChat.tsx` (modify) — track selected project; classify on send (projects only); handle action clicks; zero-project opening fallback.

---

### Task 1: Add Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` added under devDependencies, no errors.

- [ ] **Step 2: Add the test script**

In `package.json`, add a `test` script to the `scripts` block so it reads:
```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Create the Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Verify the runner works (no tests yet)**

Run:
```bash
npx vitest run
```
Expected: exits 0 with "No test files found" (acceptable at this point).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add Vitest for unit tests"
```

---

### Task 2: Add intent + confirmation data

**Files:**
- Modify: `src/mocks/programSupport.json`

- [ ] **Step 1: Add `projectIntents` and `ticketConfirmations`**

In `src/mocks/programSupport.json`, add these two top-level keys (insert after the `projectPicker` object, keeping valid JSON with a trailing comma after `projectPicker`'s closing brace):

```json
  "projectIntents": [
    {
      "id": "extension",
      "keywords": ["deadline", "more time", "extend", "extension", "missed", "late", "submit late"],
      "shape": "action",
      "response": "Yes, I can raise an extension request to your program team for \"{project}\". They will review and confirm.",
      "actionLabel": "Request extension",
      "ticketTag": "auto_extension",
      "actionStyle": "primary"
    },
    {
      "id": "reeval",
      "keywords": ["re-eval", "reevaluat", "re-evaluat", "graded wrong", "regrade", "re-grade", "marks are wrong", "score is wrong", "mis-scored", "wrongly graded"],
      "shape": "action",
      "response": "I can request a re-evaluation for \"{project}\". A short note on what felt mis-scored helps the reviewer.",
      "actionLabel": "Request re-evaluation",
      "ticketTag": "reevaluation",
      "actionStyle": "primary"
    },
    {
      "id": "solution_timing",
      "keywords": ["when will i", "sample solution", "solution", "when do i get", "release"],
      "shape": "lookup",
      "response": "Sample solutions release 7 days after the submission deadline for \"{project}\". You will get a notification when it is available."
    },
    {
      "id": "code",
      "keywords": ["error", "stuck", "code", "exception", "traceback", "bug", "not working", "fails", "accessdenied", "credentials"],
      "shape": "mentor",
      "response": "Let's debug \"{project}\" together. Share the exact error message or the line it fails on, and tell me what you have already tried.",
      "actionLabel": "Talk to a human",
      "ticketTag": "projects_human",
      "actionStyle": "ghost"
    },
    {
      "id": "concept",
      "keywords": ["understand", "concept", "doubt", "confused", "explain", "how does", "what is", "why does"],
      "shape": "mentor",
      "response": "Happy to explain. Tell me which part of \"{project}\" is unclear and I will walk you through it step by step.",
      "actionLabel": "Talk to a human",
      "ticketTag": "projects_human",
      "actionStyle": "ghost"
    },
    {
      "id": "route",
      "keywords": [],
      "shape": "route",
      "response": "That one is best handled by your program team. I can raise a ticket with \"{project}\" and what you described so they can help.",
      "actionLabel": "Raise a ticket",
      "ticketTag": "projects_other",
      "actionStyle": "outline"
    }
  ],
  "ticketConfirmations": {
    "auto_extension": "Extension request raised for \"{project}\". Tracked in Open Tickets, your team will confirm.",
    "reevaluation": "Re-evaluation request raised for \"{project}\". Tracked in Open Tickets.",
    "projects_human": "Connected you to your program team about \"{project}\". They will follow up. Track it in Open Tickets.",
    "projects_other": "Ticket raised for \"{project}\". Your program team will follow up. Track it in Open Tickets.",
    "default": "Ticket raised for \"{project}\". Track it in Open Tickets."
  }
```

Note: copy uses no em-dash (constraint). `{project}` is the interpolation token.

- [ ] **Step 2: Verify JSON is valid**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('src/mocks/programSupport.json','utf8')); console.log('ok')"
```
Expected: prints `ok`.

- [ ] **Step 3: Commit**

```bash
git add src/mocks/programSupport.json
git commit -m "data: add project intent buckets and ticket confirmations"
```

---

### Task 3: The classifier (TDD)

**Files:**
- Create: `src/lib/classifyIntent.ts`
- Test: `src/lib/classifyIntent.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/classifyIntent.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { classifyIntent } from "./classifyIntent";

describe("classifyIntent", () => {
  it("maps deadline language to the extension action", () => {
    const i = classifyIntent("I missed the deadline, can I get more time?");
    expect(i.id).toBe("extension");
    expect(i.shape).toBe("action");
  });

  it("maps grading complaints to re-evaluation", () => {
    expect(classifyIntent("I think my project was graded wrong").id).toBe("reeval");
  });

  it("maps solution timing questions to lookup", () => {
    expect(classifyIntent("When will I receive the sample solution?").shape).toBe("lookup");
  });

  it("maps code errors to a mentor reply", () => {
    expect(classifyIntent("My code throws an AccessDenied error").shape).toBe("mentor");
  });

  it("falls back to route for unrecognised text", () => {
    const i = classifyIntent("asdfghjkl qwerty");
    expect(i.shape).toBe("route");
    expect(i.id).toBe("route");
  });

  it("is case-insensitive", () => {
    expect(classifyIntent("EXTEND my DEADLINE").id).toBe("extension");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npx vitest run src/lib/classifyIntent.test.ts
```
Expected: FAIL — cannot resolve `./classifyIntent`.

- [ ] **Step 3: Write the classifier**

Create `src/lib/classifyIntent.ts`:
```ts
import data from "../mocks/programSupport.json";

export type IntentShape = "mentor" | "action" | "lookup" | "route";

export type ProjectIntent = {
  id: string;
  keywords: string[];
  shape: IntentShape;
  response: string;
  actionLabel?: string;
  ticketTag?: string;
  actionStyle?: "primary" | "outline" | "ghost";
};

const intents = data.projectIntents as ProjectIntent[];

// Keyword substring match in order; the empty-keyword bucket is the fallback.
export function classifyIntent(text: string): ProjectIntent {
  const t = text.toLowerCase();
  const fallback =
    intents.find((i) => i.keywords.length === 0) ?? intents[intents.length - 1];
  for (const intent of intents) {
    if (intent.keywords.length === 0) continue;
    if (intent.keywords.some((k) => t.includes(k.toLowerCase()))) return intent;
  }
  return fallback;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npx vitest run src/lib/classifyIntent.test.ts
```
Expected: PASS — 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/classifyIntent.ts src/lib/classifyIntent.test.ts
git commit -m "feat: keyword intent classifier for project problems"
```

---

### Task 4: Extend the message model and ticket creation

**Files:**
- Modify: `src/context/SupportContext.tsx:4-35` (types + state shape)

- [ ] **Step 1: Add `ChatAction`, extend `ChatMessage`, add `createTicket` to the type**

In `src/context/SupportContext.tsx`, replace the `ChatMessage` type (lines 4-10) with:
```ts
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
```

- [ ] **Step 2: Add `createTicket` to the `SupportState` type**

In the `SupportState` type (lines 27-35), add this member after `raiseTicket`:
```ts
  createTicket: (seed: { title: string; subtitle: string; category: string }) => void;
```

- [ ] **Step 3: Implement `createTicket` in the provider value**

In the `useMemo` value object, add this method after the `raiseTicket` implementation (after line 86, before the closing `}),`):
```ts
      createTicket: (seed) =>
        setOpenTickets((tickets) => [
          {
            id: nextId("t"),
            title: seed.title,
            subtitle: seed.subtitle,
            timestamp: "Just now",
            category: seed.category,
          },
          ...tickets,
        ]),
```

- [ ] **Step 4: Verify the build typechecks**

Run:
```bash
npx tsc -b
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/context/SupportContext.tsx
git commit -m "feat: chat action/tone message fields + createTicket"
```

---

### Task 5: Render action buttons and success-tone replies in ChatBubble

**Files:**
- Modify: `src/components/support/ChatBubble.tsx`

- [ ] **Step 1: Import Button and the ChatAction type**

In `src/components/support/ChatBubble.tsx`, update the MUI import (line 2) to include `Button`:
```ts
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
```
And add to the support imports (after line 7):
```ts
import type { ChatAction } from "../../context/SupportContext";
```

- [ ] **Step 2: Extend `Props`**

In the `Props` type (lines 12-27), add these three fields before the closing `}`:
```ts
  action?: ChatAction;
  tone?: "success";
  onAction?: (tag: string) => void;
```

- [ ] **Step 3: Add an ActionButton sub-component**

Add this component just above the exported `ChatBubble` function (before line 289):
```tsx
function ActionButton({
  action,
  onAction,
}: {
  action: ChatAction;
  onAction?: (tag: string) => void;
}) {
  const base = {
    textTransform: "none" as const,
    fontSize: 14,
    fontWeight: 600,
    borderRadius: "8px",
    minHeight: 38,
    px: 2,
    boxShadow: "none",
  };
  const byStyle = {
    primary: {
      ...base,
      bgcolor: "primary.main",
      color: "primary.contrastText",
      "&:hover": { bgcolor: "primary.main", boxShadow: "none" },
    },
    outline: {
      ...base,
      bgcolor: "transparent",
      color: "primary.main",
      border: 1,
      borderColor: "primary.main",
      "&:hover": { bgcolor: (t: import("@mui/material").Theme) => alpha(t.palette.primary.main, 0.08) },
    },
    ghost: {
      ...base,
      fontWeight: 500,
      px: 1,
      minHeight: 32,
      bgcolor: "transparent",
      color: "text.secondary",
      "&:hover": { bgcolor: (t: import("@mui/material").Theme) => alpha(t.palette.primary.main, 0.08), color: "text.primary" },
    },
  } as const;

  return (
    <Box sx={{ mt: 1.5 }}>
      <Button disableElevation onClick={() => onAction?.(action.tag)} sx={byStyle[action.style]}>
        {action.label}
      </Button>
    </Box>
  );
}
```

- [ ] **Step 4: Render success tone and the action button in ChatBubble**

In the `ChatBubble` function, destructure the new props by replacing the parameter list (lines 289-302) with:
```tsx
export function ChatBubble({
  role,
  text,
  options,
  optionsActive,
  isHero,
  isLatest,
  morphId,
  onOptionClick,
  widget,
  onProjectPick,
  onProjectOther,
  onProjectConfirm,
  action,
  tone,
  onAction,
}: Props) {
```

Then, immediately after the `if (role === "user") { ... }` block (after line 315), add the success-tone early return:
```tsx
  if (tone === "success") {
    return (
      <Box
        component={motion.div}
        {...entrance}
        data-msg-role="bot"
        sx={{
          alignSelf: "flex-start",
          maxWidth: "80%",
          px: 2,
          py: 1.25,
          borderRadius: "12px",
          bgcolor: (t) => t.palette.extended.success.colorContainer,
          color: (t) => t.palette.extended.success.onColorContainer,
          fontSize: 14,
          lineHeight: 1.6,
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
        }}
      >
        <Check size={18} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>{text}</span>
      </Box>
    );
  }
```

Add the `Check` icon to the lucide import (line 5):
```ts
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
```
(`Check` is already imported in this file — confirm it is present; if so leave as is.)

Then render the action button: inside the returned bot `<Box>`, after the project-widget blocks and before the options block (after line 356), add:
```tsx
      {action && isLatest && <ActionButton action={action} onAction={onAction} />}
```

- [ ] **Step 5: Verify the build typechecks**

Run:
```bash
npx tsc -b
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/support/ChatBubble.tsx
git commit -m "feat: render adaptive action buttons and success replies"
```

---

### Task 6: Wire the adaptive engine into GlaideChat

**Files:**
- Modify: `src/pages/GlaideChat.tsx`

- [ ] **Step 1: Import the classifier and confirmation data**

In `src/pages/GlaideChat.tsx`, after line 10 (`import data from "../mocks/programSupport.json";`), add:
```ts
import { classifyIntent } from "../lib/classifyIntent";

const ticketConfirmations = data.ticketConfirmations as Record<string, string>;
const recentProjects = data.projectPicker.top as { course: string; name: string }[];
```

- [ ] **Step 2: Add selected-project state**

After line 46 (`const [morphTarget, setMorphTarget] = useState<string | null>(null);`), add:
```ts
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
```

And pull `createTicket` from the context by updating line 36:
```ts
  const { getThread, createThread, addMessage, createTicket } = useSupport();
```

- [ ] **Step 3: Zero-project opening fallback**

Replace the projects branch of the seed opening (lines 84-89) so an empty recent list degrades gracefully:
```ts
      const flow = topicFlows[seed.categoryKey];
      const opening: ChatMessage =
        seed.categoryKey === "projects"
          ? recentProjects.length > 0
            ? { role: "bot", text: "Which project are you facing trouble with?", widget: "projectCards" }
            : {
                role: "bot",
                text: "You don't have any projects yet. What would you like to understand about projects?",
              }
          : flow
            ? { role: "bot", text: flow.question, options: flow.options }
            : { role: "bot", text: glaideResponses[seed.categoryKey] ?? glaideResponses.fallback };
```

- [ ] **Step 4: Record the selected project on pick/confirm**

Replace `handleProjectPick` and `handleProjectConfirm` (lines 250-255) with:
```ts
  const handleProjectPick = (course: string, name: string) => {
    setSelectedProject(name);
    respondTo(`${course} · ${name}`, `Got it, the "${name}" project. What problem are you facing with it?`);
  };
  const handleProjectOther = () =>
    respondTo("My project isn't listed", "No problem. Pick your course and project and I will pull it up.", "projectForm");
  const handleProjectConfirm = (course: string, project: string) => {
    setSelectedProject(project);
    respondTo(`${course} · ${project}`, `Got it, the "${project}" project. What problem are you facing with it?`);
  };
```

- [ ] **Step 5: Classify on send for the projects category**

Replace `handleSend` (lines 197-213) with:
```ts
  const handleSend = () => {
    const text = input.trim();
    if (!text || !threadId || !thread || isTyping) return;
    addMessage(threadId, { role: "user", text });
    setInput("");
    setSendPulse((p) => p + 1);
    setIsTyping(true);
    reserveRef.current = true; // this turn reserves space and pins to top
    pendingPin.current = true;

    if (thread.category === "projects" && selectedProject) {
      const intent = classifyIntent(text);
      const reply = intent.response.replace(/\{project\}/g, selectedProject);
      const action =
        intent.actionLabel && intent.ticketTag
          ? { label: intent.actionLabel, tag: intent.ticketTag, style: intent.actionStyle ?? "primary" }
          : undefined;
      window.setTimeout(() => {
        addMessage(threadId, { role: "bot", text: reply, ...(action ? { action } : {}) });
        setIsTyping(false);
      }, 750);
    } else {
      const reply = glaideResponses[thread.category] ?? glaideResponses.fallback;
      window.setTimeout(() => {
        addMessage(threadId, { role: "bot", text: reply });
        setIsTyping(false);
      }, 750);
    }

    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    if (fine) window.setTimeout(() => inputRef.current?.focus(), 0);
  };
```

- [ ] **Step 6: Add the action-click handler**

Add this just after `handleSend` (after the block from Step 5):
```ts
  const handleAction = (tag: string) => {
    if (!threadId || !thread) return;
    const project = selectedProject ?? thread.title;
    createTicket({
      title: project,
      subtitle: `Raised from Glaide chat about ${project}`,
      category: "projects",
    });
    const confirm = (ticketConfirmations[tag] ?? ticketConfirmations.default).replace(
      /\{project\}/g,
      project
    );
    reserveRef.current = true;
    pendingPin.current = true;
    addMessage(threadId, { role: "bot", text: confirm, tone: "success" });
  };
```

- [ ] **Step 7: Pass the new props to ChatBubble**

In the `messages.map` render, add the three props to the `<ChatBubble>` element (after line 391, `onProjectConfirm={handleProjectConfirm}`):
```tsx
                  action={m.action}
                  tone={m.tone}
                  onAction={handleAction}
```

- [ ] **Step 8: Verify the build typechecks and the app compiles**

Run:
```bash
npx tsc -b && npm run build
```
Expected: build succeeds, no TS errors.

- [ ] **Step 9: Commit**

```bash
git add src/pages/GlaideChat.tsx
git commit -m "feat: adaptive Glaide replies for the projects flow"
```

---

### Task 7: End-to-end browser verification

**Files:** none (manual verification)

- [ ] **Step 1: Start the dev server**

Run:
```bash
npm run dev
```
Expected: Vite serves on a localhost port.

- [ ] **Step 2: Walk the four shapes**

Navigate to the Ask page, tap Projects, pick a project, then for each input confirm the reply shape:
- Type "I missed the deadline, need more time" → **ACTION**: reply + "Request extension" primary button. Click it → green success confirmation appears; open `/program_support` and confirm a new Open Ticket exists.
- Type "I think it was graded wrong" → **ACTION**: "Request re-evaluation".
- Type "When do I get the sample solution?" → **LOOKUP**: factual reply, no button.
- Type "My code throws an error" → **MENTOR**: reply + ghost "Talk to a human".
- Type "the submit button does nothing" → **ROUTE**: reply + outlined "Raise a ticket".

- [ ] **Step 3: Verify the "Other" cascade still records the project**

Pick "My project isn't listed" → choose a course + project → Continue → then type "extend deadline". Confirm the extension reply names the project chosen in the cascade.

- [ ] **Step 4: Run the unit tests once more**

Run:
```bash
npx vitest run
```
Expected: all classifier tests pass.

- [ ] **Step 5: Final commit (if any tweaks were needed)**

```bash
git add -A
git commit -m "test: verify adaptive projects flow end-to-end"
```

---

## Self-Review

**Spec coverage:**
- Entry / recent-3 + Other cascade — already built; zero-project fallback added (Task 6 Step 3). ✓
- 4 reply shapes — Tasks 2/3 (data+classifier), 5 (render), 6 (wire). ✓
- ACTION = one tap → pre-tagged ticket → confirmation + Open Tickets — Task 6 Step 6 (`createTicket` with `ticketTag`) + Task 5 success tone. ✓
- Dummy keyword classification, swappable — `classifyIntent` is pure and isolated. ✓
- Constraints: no em-dash in added copy ✓; Olympus tokens (`extended.success.*`, `primary.*`, `text.*`) ✓; AI footer unchanged ✓; commits only ✓.

**Placeholder scan:** No TBD/TODO; every code step shows full code. ✓

**Type consistency:** `ChatAction { label; tag; style }` is defined in SupportContext (Task 4) and imported in ChatBubble (Task 5) and constructed in GlaideChat (Task 6) with identical field names. `ProjectIntent.actionStyle` maps to `ChatAction.style`. `ticketTag` → `ChatAction.tag`. Confirmation lookup keys (`auto_extension`, `reevaluation`, `projects_human`, `projects_other`, `default`) match the `ticketTag` values in Task 2. ✓

**Scope:** Single subsystem (projects adaptive reply). Quizzes/Sessions/Material rollout explicitly out of scope. ✓
