# Current Program Support IA → Chat Response Types

Maps the existing Olympus "Ask a Question" flow onto how each item should behave in the Glaide chat. Source: live Olympus prod (PGP - Cloud Computing). Goal: when we rebuild the flow as chat, nothing from the old form-based flow is missed.

## Response-type legend

- **TEXT** — plain explanatory reply (mentor/info). No control.
- **FOLLOW-UP** — reply that asks one clarifying question, then free text continues.
- **ACTION→ticket** — short text + a button that raises a pre-tagged ticket (then a green confirmation). For requests a human/team must action.
- **LOOKUP** — a direct factual answer (a date, a status, a number).
- **LINK CARD** — a resource/CTA card with a deep link (recording, material, payment page, schedule a call, refer page).
- **CODE** — code-block reply + a code/snippet input (paste code / attach notebook). For code help.
- **TROUBLESHOOT** — numbered steps + "did this help?" yes/no, then escalate if no.
- **FEEDBACK CAPTURE** — rating and/or text capture, then a thank-you state.
- **ESCALATE** — "I can't resolve this, raise a ticket / talk to a human" route.
- **PICKER (entry)** — flow opens by picking the specific item first (recent N cards + Other → course→item cascade) before the problem step.

Most replies also carry the quiet escape hatch (Helpful / Talk to a human → ESCALATE).

---

## After "Ask a Question" → 9 Help Topics

### 1. Fee Related Enquiries (#10)
- **Payment not reflecting in Olympus** → FOLLOW-UP (ask date + amount) → LOOKUP (status, "most reflect within 24h") → ESCALATE if still missing.
- **Access blocked** → FOLLOW-UP (what is blocked) → LOOKUP/TEXT (usually fee-linked) → ESCALATE or LINK CARD (make payment).
- **Make payment** → LINK CARD (open payment page).
- **I need help with something else** → TEXT → ESCALATE.

### 2. Olympus Issues (#11)
- **Something is not working (App/Website)** → FOLLOW-UP (which screen/device) → TROUBLESHOOT (refresh/cache) → ESCALATE→ticket if unresolved.
- **Access blocked** → FOLLOW-UP → TEXT → ESCALATE→ticket.
- **I need help with something else** → TEXT → ESCALATE.

### 3. Career Services (#12)
- **Excelerate** → TEXT + LINK CARD (open Excelerate).
- **Career Prep** → TEXT + LINK CARD (career prep) or schedule-a-call CTA.
- **I need help with something else** → TEXT → ESCALATE.

### 4. Projects (#13) — PICKER (entry): recent 3 projects + Other
- **When will I receive the solution?** → LOOKUP (release date for that project).
- **Explanation of feedback & sample solution** → TEXT (mentor) + LINK CARD (feedback/solution) → ESCALATE if needs a human.
- **Project re-evaluation** → ACTION→ticket (Request re-evaluation).
- **Technical challenges with Olympus** → TROUBLESHOOT → ESCALATE→ticket.
- **Further explanation of problem statement/dataset** → TEXT (mentor) + FOLLOW-UP.
- **Extend submission deadline** → ACTION→ticket (Request extension, tagged auto_extension).
- **Error/stuck with code** → CODE (mentor + code block + code input).
- **Conceptual doubt** → TEXT (mentor) + FOLLOW-UP.
- **I need help with something else** → TEXT → ESCALATE.

### 5. Learning Material (#14) — PICKER (entry): course/topic
- **Something incorrect in the content** → ACTION→ticket (report) + "thanks for flagging".
- **I want to understand a topic better** → TEXT (mentor) + FOLLOW-UP + optional LINK CARDs.
- **Looking for reference material on a topic** → LINK CARD(s) (resources).
- **Software/library installation challenges** → CODE / TROUBLESHOOT (steps + code input).
- **Error/stuck with code** → CODE.
- **I have a conceptual doubt** → TEXT (mentor) + FOLLOW-UP.
- **I need help with something else** → TEXT → ESCALATE.

### 6. Live Session (#15) — PICKER (entry): which session
- **Cannot find session recordings** → LINK CARD (recording).
- **Cannot find session material** → LINK CARD (material).
- **Need help with my schedule** → FOLLOW-UP → LOOKUP/LINK CARD (schedule) → ESCALATE if change needed.
- **I need help with something else** → TEXT → ESCALATE.

### 7. Quizzes (#16) — PICKER (entry): recent quizzes + Other
- **Error/stuck with code** → CODE.
- **I have a conceptual doubt** → TEXT (mentor) + FOLLOW-UP.
- **Quiz question is unclear** → ACTION→ticket (flag/report).
- **Need more explanation for the right answer** → TEXT (mentor).
- **I want to request an extension for the deadline** → ACTION→ticket (Request extension).
- **I am facing technical issues while attempting the quiz** → TROUBLESHOOT → ESCALATE→ticket.
- **I need help with something else** → TEXT → ESCALATE.

### 8. Others (#17)
- **Hackathon** → TEXT + LINK CARD.
- **Graduation/Certificate Related** → LOOKUP (status/date) → ESCALATE→ticket if action needed.
- **Inquire about other programs** → TEXT + LINK CARD (programs).
- **Error/stuck with code** → CODE.
- **Software/library installation** → CODE / TROUBLESHOOT.
- **I have a conceptual doubt** → TEXT (mentor).
- **Delivery Schedule** → LOOKUP (dates).
- **Referral bonus** → LOOKUP/TEXT + LINK CARD (refer & earn).
- **I need help with something else** → TEXT → ESCALATE.

### 9. Feedback (#18)
- **Share a Testimonial** → FEEDBACK CAPTURE (text) → thank-you.
- **Content Feedback** → FEEDBACK CAPTURE (rating + text) → thank-you.
- **Program Feedback** → FEEDBACK CAPTURE (rating + text) → thank-you.
- **Program Office Feedback** → FEEDBACK CAPTURE (rating + text) → thank-you.

---

## What this tells the build

Distinct response components needed across the whole surface:
1. TEXT (mentor/info) — built
2. FOLLOW-UP question (free text continues) — built (free text)
3. ACTION→ticket button + success confirmation — built
4. LOOKUP answer (date/status) — built
5. LINK / resource CTA card — **new**
6. CODE block + code/snippet input — **new**
7. TROUBLESHOOT steps + did-this-help — **new**
8. FEEDBACK CAPTURE (rating + text) → thank-you — **new**
9. PICKER entry (cards + Other → cascade) — built (Projects); reuse for Quizzes / Sessions / Material
10. ESCALATE / talk-to-human — built

Four new message types (5, 6, 7, 8) cover everything the old form flow did; the rest reuses what Projects already ships.
