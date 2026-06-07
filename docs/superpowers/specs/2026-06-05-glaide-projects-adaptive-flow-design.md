# Glaide Projects Adaptive Support Flow — Design Spec

**Date:** 2026-06-05
**Status:** Approved (brainstorm), pending implementation plan
**Scope:** Frontend prototype only, dummy-data driven. Backend (real classification, ticket persistence, eligibility) is built separately.

## Goal

Replace the assumed Projects support flow in Glaide with one grounded in the real Olympus Program Support flow: the learner picks a recent project, describes the problem in free text, and Glaide replies in one of four adaptive shapes (mentor / action / lookup / route). No upfront sub-category form.

## Background (ground truth)

Captured live from prod Olympus (see memory `olympus-program-support-flow`). The current real Projects flow is a progressive ticket form: Select sub-category (9 options) → Select Course → Select Assignment → Description → Add Python Notebook (required) → Add Attachments → ASK QUESTION → ticket lands in a queue, learner waits for a human. There is **no resolution attempt** today.

"Auto-extension" in the platform is **not** an instant grant: it deep-links into Program Support pre-tagged `sub_category_type=auto_extension` with course/item context, only after a deadline is missed (status MISSED). No duration picker, no in-app approval. There is **no re-evaluation self-serve flow** today.

## Design overview

The learner enters Glaide chat from the Ask page "Projects" entry. The flow:

1. Glaide opens: **"Which project are you facing trouble with?"** + the learner's **last 3 interacted projects** as cards (Course + Project name) + an **"Other"** card.
2. Tapping a card posts it as the learner's message (`Course · Project`). "Other" opens an in-chat **Course → Project cascade**; Continue posts the same way.
3. Glaide asks **"What problem are you facing with it?"** → free-text composer (this replaces the old Description field).
4. On send, Glaide classifies the message and replies in one of **4 shapes**.

### The 4 reply shapes

| Shape | Real issues it covers | Glaide's reply |
|-------|----------------------|----------------|
| **mentor** | code error, conceptual doubt, clarify problem statement/dataset | Explains/helps in prose. Footer: 👍 Helpful · "Still stuck → talk to a human" (→ raises ticket). |
| **action** | extend deadline, request re-evaluation | Short text + a single button (**Request extension** / **Request re-evaluation**). One tap → pre-tagged ticket → green confirmation in chat + appears in Open Tickets. No duration collected (mirrors platform). |
| **lookup** | "when will I receive the solution?", feedback explanation | Direct factual answer, using project context (e.g. release date). |
| **route** | Olympus tech issue, "something else", or learner not satisfied | "I can't resolve this from here, I'll raise a ticket" + **Raise a ticket** button → tagged ticket → confirmation. |

### Opening edge cases

- **3+ projects:** 3 cards + Other.
- **Fewer than 3:** show however many exist (1–2 cards) + Other.
- **Zero projects:** no cards, no cascade. Graceful fallback message — *"You don't have any projects yet. What would you like to understand about projects?"* → straight to free text.
- **"Recent"** = last 3 projects the learner interacted with (by activity). Dummy data hardcodes a sensible 3; real backend sorts by last activity.

## How the AI is faked (frontend prototype)

No backend/LLM. Classification is a small pure helper over keyword buckets.

### Data model — `src/mocks/programSupport.json`

- `recentProjects`: array of `{ course, project }` (up to 3) for the opening cards.
- `projectCourses`: existing cascade data (Course → projects[]) for the "Other" path. (Already present as `projectPicker.courses`; reuse/rename.)
- `projectIntents`: ordered array of buckets:
  ```json
  {
    "id": "extension",
    "keywords": ["deadline", "more time", "missed", "extend", "late"],
    "shape": "action",
    "response": "Yes — I can raise an extension request to your program team for {project}. They'll review and confirm.",
    "actionLabel": "Request extension",
    "ticketTag": "auto_extension"
  }
  ```
  Shapes: `mentor` | `action` | `lookup` | `route`. `{project}` token is interpolated with the selected project name. `mentor`/`lookup` have no button; `action`/`route` carry `actionLabel` (+ `ticketTag` for action).

### Classification helper

`classifyIntent(text): Intent` — lowercase the message, return the first bucket whose any keyword is a substring match; fallback to the `route` bucket. Pure function, unit-testable, swappable for a real API call later with zero change to the rendering layer.

## Components

- **`src/pages/GlaideChat.tsx`** (modify) — seed Projects opening with recent-3 + Other (or zero-project fallback); on free-text send, call `classifyIntent`, then render the matched shape via a new bot message. Wire action/route buttons to `raiseTicket` (existing `SupportContext`) + render confirmation message.
- **`src/components/support/ProjectPicker.tsx`** (modify) — drive from `recentProjects` (variable length 0–3), keep Other. Handle zero-project case (don't render picker; emit fallback).
- **`src/components/support/ProjectForm.tsx`** (reuse) — the Other cascade; already built.
- **`src/components/support/ChatBubble.tsx`** (modify) — render the 4 shapes: action/route reply with an inline button; mentor footer (Helpful / talk to a human); success/confirmation bubble.
- **`src/lib/classifyIntent.ts`** (create) — the keyword classifier + types.
- **`src/context/SupportContext.tsx`** (reuse) — `raiseTicket` already exists; action/route buttons call it with a tag/title.
- **`src/mocks/programSupport.json`** (modify) — add `recentProjects`, `projectIntents`; align cascade data.

## Constraints (carry over)

- No em-dash in any product copy or mock data.
- Olympus MUI tokens only (no raw hex beyond sanctioned maps).
- De-emphasize AI framing, but the approved "Glaide is AI and can make mistakes" footer stays.
- New design gated under `useDesignVersion() === "v2"` where applicable; V1 baseline unchanged.
- Commits only; do not push/deploy unless asked.

## Out of scope

- Real intent classification / LLM.
- Real ticket persistence, extension eligibility, re-evaluation backend.
- Rolling this pattern out to Quizzes / Live Sessions / Learning Material (separate follow-up once Projects is validated).

## Testing

- `classifyIntent` unit tests: each bucket's keywords map to the right shape; unknown text → `route`.
- Manual/browser walkthrough of all 4 shapes + 3 opening edge cases via the running app.
