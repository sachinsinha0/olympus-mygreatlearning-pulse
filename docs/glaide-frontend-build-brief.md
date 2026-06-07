# Glaide Support — Problem Brief (Handoff)

**For:** the production project picking this up.
**Purpose:** describe *what we're trying to achieve* and the context behind it. It deliberately does **not** prescribe components, architecture, or a solution. The production project has the real codebase, design system, and existing support components, and should design the approach from there.

---

## 1. What we're trying to achieve

Replace today's form-based "Ask a Question" support flow with **Glaide**, a conversational support experience. A learner should be able to say what they need help with in a chat, and get help — an answer, an action taken, a resource, or a raise a ticket — instead of filling a multi-field ticket form and waiting.

## 2. Scope of this version

**Frontend only.** Two surfaces:

1. **Topics selection page** — where the learner enters support and chooses what they need help with. Topics and Recent Activites.
2. **Glaide chat page** — the conversation itself.

The intelligence that decides how to respond is **backend (LLM + MCP over real learner/program data) and is built separately**. This version is frontend with placeholder data; the backend is wired in later. So the frontend should be built to receive its responses from that backend, not to make support decisions itself.

## 3. The problem with the current experience

Today, asking for help means: pick a category, pick a sub-category, pick the course, pick the specific assignment, write a description, attach a file, submit a ticket, and wait for a human. It is a form, it is slow, it is fragmented across channels (support tickets, WhatsApp, email), and the responses are templated. Most of these queries are repetitive and answerable, but they still consume Program Manager time and leave the learner waiting.

## 4. What learners actually ask for (context)

From analysis of 65K+ support queries and the real Olympus support taxonomy, the support surface is 9 topics — Fee Related Enquiries, Olympus Issues, Career Services, Projects, Learning Material, Live Session, Quizzes, Others, Feedback — and the volume concentrates heavily:

- Deadline / submission extensions — ~29% (the single biggest theme)
- Technical / code errors — ~13%
- Attendance & session scheduling — ~10%
- Payment & fees — ~9%
- Grading / evaluation disputes — ~8%
- Platform / LMS access — ~6%
- Certificate / graduation — ~5%
- Conceptual doubts & content — ~5%

The detailed topic → sub-topic taxonomy is in the companion IA doc; carry it over as the source of truth for what queries exist. The point: the experience has to gracefully cover this whole spread, where some asks are answerable, some require an action or a human, and some are sensitive.

## 5. Product direction & guardrails (from the PRD)

These are product decisions to respect, not implementation choices:

- **Projects is the first milestone**, then Quizzes and Learning Material, then the rest. Build in that order.
- **Some categories must route to internal teams, not be auto-resolved:** Fee Related Queries, Careers, and Attendance updates. Re-evaluation requests and quiz mark-disputes also go to the human team.
- **Never invent operational facts** (deadlines, statuses). Those come from real data; with placeholder data, keep mock facts clearly placeholder.
- A human-escalation path must always be available.

## 6. Constraints / non-negotiables

- **No em-dash** in any product copy or placeholder content (it reads as AI-authored).
- **De-emphasize the "AI chatbot" framing.** No loud "AI BOT" labels, no fake "online" status indicator. Trust comes from a calm, credible presentation. A quiet "Glaide is AI and can make mistakes" disclosure is accepted.
- Frame Glaide by **what it does for the learner**, not what it is.
- **Use the production design system / tokens.** No raw hex, no bespoke one-off styling where a system primitive exists.
- Standard accessibility (labels, focus, contrast, reduced motion, correct heading semantics).

## 7. Left for the production project to decide

Intentionally open, because the real code should drive these:

- How responses are represented and rendered (what message types exist, how they look), and which existing components to reuse.
- How the page receives responses from the backend and how that contract is shaped.
- Page layout, navigation, and how the topic selection hands off into the chat.
- How placeholder data is structured so the backend can replace it cleanly.

## 8. What the prototype was for

We built a throwaway prototype only to pressure-test the *flow and structure* (does "pick what you need help with → describe it → get an adaptive response → resolve or escalate" feel right end to end). It confirmed the shape works and surfaced the constraints above. It is not a reference implementation — the production build should start from the real codebase, not from the prototype.

---

**Suggested first step in the production project:** read this brief + the companion IA doc + the PRD, look at what support/chat components already exist in the codebase, and propose an approach before building.
