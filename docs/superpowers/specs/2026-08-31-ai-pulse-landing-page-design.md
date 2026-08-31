# AI Pulse Landing Page

_Design spec. 31 August 2026._

## Why we are building this

The sales team calls leads about the PG Program. During that call they offer a free 14 day trial of
AI Pulse as a low risk way to experience Great Learning. Emails and other collaterals will point at
a landing page. The lead reads the page, logs in, and arrives inside Olympus at `/pulse`.

Today there is no such page. `/pulse` is a logged in product page with the app top nav on it. A cold
lead landing there sees a profile menu and a program switcher for an account they do not have.

This spec covers a public landing page at `/ai-pulse`, a login step, and the change from a 30 day
trial to a 14 day trial across the whole prototype.

## Decisions already taken

| Decision | Choice |
|---|---|
| Trial length | 14 days, changed everywhere. Not just on the landing page. |
| Route | `/ai-pulse`, matching how mygreatlearning.com slugs its course pages. |
| Price on the page | No price anywhere. The page sells the free trial only. |
| Positioning | Sells AI Pulse on its own, then connects it to the PG Program near the end. |
| Visual language | Great Learning marketing language, scoped to the landing route only. |
| Main button | Goes to a login step, which starts the trial and lands the user on a module. |

## Design language

The page mirrors the design language of the real Great Learning course landing pages. The reference
page is `https://www.mygreatlearning.com/ai-native-professional`. These values were measured from the
live page, not guessed.

| Token | Value |
|---|---|
| Font | Poppins. Weights 400, 500, 600. |
| H1 and section H2 | 48px, weight 500, line height 64px, letter spacing -0.96px |
| Body | 15px to 16px, colour `#444444` |
| Primary blue | `#196AE5` |
| Violet accent | `#7C3AED` |
| Buttons | 4px radius, 56px tall, 16px, weight 600, padding 16px 24px |
| Content width | 1256px |
| Section backgrounds | White, near black `#0B0B0F`, pale lavender `#F7F7FD` |

Patterns taken from the reference page:

- **Eyebrow.** `//` in violet, then an uppercase label with wide letter spacing.
- **Two tone heading.** First phrase in black or white, second phrase in violet.
- **Sticky section tabs.** A row of section links under the header with a blue underline on the
  active one.
- **Sticky right rail card.** The reference floats a lead capture form there. We float a trial card
  instead. See "No lead form" below.
- **Numbered accordion.** "WEEK 01" in blue, a title, a blue round chevron. Expanded it shows a blue
  tinted "YOU'LL LEARN" panel, a pink tinted "PROJECT" panel, and a tools logo row labelled
  `// TOOLS`.
- **Stat strip.** A bordered card with vertical dividers between cells.
- **Ratings strip.** Four review site scores on a pale band.
- **Closing dark section.** A heading with benefit ticks on the left and a card on the right.

### This must not look AI designed

The page has to read as the work of a human designer. Concretely, these are banned:

- Coloured `border-left` or `border-top` accent strips on cards.
- Gradient text, glow blobs behind the hero, heavy glassmorphism.
- The same three column icon card grid repeated for every section.
- An icon in a rounded square on every single list item.
- Emoji used as icons.
- Everything centred. Everything the same size. Perfect symmetry with no hierarchy.
- Pill badges scattered for decoration.
- Invented urgency. There are no limited seats on an always open free trial, so we do not claim any.

The defence is simple. Every pattern on this page is taken from the reference page, not invented.
Where the reference has no pattern for something we need, we vary the layout rather than repeat the
last one. Section rhythm alternates between two column asymmetric, full width accordion, numbered
row, and list.

### Scoped, not global

The marketing theme lives in `src/pages/Landing/landingTheme.ts` and is applied by a nested MUI
`ThemeProvider` inside the landing page. `src/theme/` is not touched. `/pulse` looks exactly as it
does today.

This is deliberate. A past global theme alignment pass on this repo was reverted because the mixed
result looked wrong. The marketing skin belongs to marketing pages only. Crossing the login step is
the moment the product theme takes over, which is how the real site behaves.

## Page structure

| # | Section | Background | Content |
|---|---|---|---|
| 1 | Header | White | GL logo. Breadcrumb `Home > Gen AI > AI Pulse` on a bordered row below. `Log in` on the right. |
| 2 | Hero | White with a soft lavender wash on the left | Eyebrow, two tone H1, subline, offer line, two buttons, stat strip. Right side is a dark panel of AI tool tiles. |
| 3 | Ratings | Pale | `TRUSTED BY MILLIONS OF LEARNERS` and four review scores. |
| 4 | Section tabs | White, sticky | What you get, Modules, The trial, Who it is for, Reviews, FAQ. |
| 5 | What you get | Near black | Two tone H2. Six value items in a two by three arrangement. Button scrolls to the modules. |
| 6 | Inside AI Pulse | White | Numbered module accordion built from real product data. |
| 7 | How the trial works | Pale | Three numbered steps. Large numerals, no icon cards. |
| 8 | Who it is for | White | Two column. Heading on the left, a plain role list on the right. |
| 9 | Reviews | Pale | Three quote cards. |
| 10 | The PG Program | Near black | Connects Pulse to the PG Program. Outbound link and advisor phone number. |
| 11 | FAQ | White | Accordion. |
| 12 | Closing CTA | Near black | Benefit ticks on the left, trial card on the right. |
| 13 | Footer | Near black | Four link columns, socials, contact, copyright. |

### 2. Hero

- Eyebrow: `// AI PULSE BY GREAT LEARNING`
- H1: "AI moves fast." in black, "Pulse keeps you in sync." in violet. This is the headline already
  live in `PulseV2Hero`, so the page a lead lands on says the same thing as the page they came from.
- Subline, rewritten into short sentences: "Learn one new AI tool every two weeks. Each module takes
  under an hour. Use what you learn at work the same day."
- Offer line with a shield icon: "Free for 14 days. No credit card needed."
- Buttons: `Start your 14 day free trial` solid, `Talk to an advisor` outlined.
- Stat strip, four cells: `Every 2 weeks / New module`, `Under 60 min / Per module`,
  `11 modules / Available now`, `Hands-on / Not just watching`.
- Right panel: a dark rounded panel holding a grid of tool tiles. Each tile is a logo and a name.
  Logos come from `public/brand-logos/` and `public/tool-logos/`, which we already ship.

### 6. Inside AI Pulse

This is the strongest section on the page because it is real. It reads from
`src/mocks/pulse-issues.json`, the same file the product reads.

- Released modules only, meaning `releasedAt <= PULSE_TODAY`. That is 11 of the 13.
- Newest first, sorted by `releasedAt` descending. Same rule as `PulseHome`.
- Show six, then a `View all modules` control that reveals the rest.
- Row label uses the product's own numbering, `useUnitLabel().numbered(issue.issueNumber)`, so a row
  reading "Module 12" matches what the lead sees after they log in.
- Collapsed row: number label, title, blue round chevron.
- Expanded row: the `description`, a blue tinted `YOU'LL LEARN` panel listing `outcomes`, a violet
  tinted `HANDS-ON` panel showing `handsOnMinutes` and one line about building something, and a
  `// TOOLS` row showing `toolName` with `toolLogo`.

**Open item carried forward.** The email templates number these modules 01 to 04 as a marketing
sequence, while the product numbers them by `issueNumber`. This spec makes the landing page match
the product, because the landing page sits one click from the product. It does not resolve the email
mismatch. That still needs one decision across the whole set.

### 7. How the trial works

Three steps as large numerals, deliberately not another icon card grid.

1. Log in with your email.
2. Open any module.
3. Finish it in under an hour.

Then one line: "After 14 days you can subscribe to keep going. Everything you finished stays yours."
No price, per the decision above.

### 9. Reviews

Three quote cards with a violet quote mark, the quote, a name and a role. No photos, because we do
not have any and stock faces attached to invented quotes would be worse.

**These testimonials are invented placeholder copy.** They are marked as such with a comment in
`content.ts`. They must be replaced with real learner quotes before this page is shown to a real
lead. This is called out again in the handover notes.

### 10. The PG Program

- Eyebrow `// GOING FURTHER`
- H2: "Pulse keeps you current." in white, "The PG Program takes you deeper." in violet.
- Three short lines on what the PG Program adds: live mentoring, a full curriculum, career support.
- `Explore the PG Program` button linking to
  `https://www.mygreatlearning.com/pg-program-online-artificial-intelligence-machine-learning`.
- `Speak with our expert +91 797-117-1332`, the number used on the reference page.

### 11. FAQ

Eight questions: what AI Pulse is, how long the trial runs, whether a card is needed, what happens
after 14 days, how much time a module takes, whether coding is needed, how it differs from watching
YouTube, and how it relates to the PG Program.

The "after 14 days" answer says the trial converts to a paid subscription. It does not name a price,
because the page shows no price.

### No lead form

The reference page floats a six field lead capture form in the right rail, because its job is to
capture a stranger. Our leads are already captured. Sales has them on the phone. The job of this
page is to get a known lead to log in.

So the right rail holds a sticky trial card in the same slot: `// YOUR FREE TRIAL`, "14 days, full
access", "No credit card needed", a `Start your free trial` button, and the advisor phone number.
Same layout language, no form that nobody needs to fill.

## The login step

Route `/ai-pulse/login`.

A centred card in the marketing theme: GL logo, "Log in to start your free trial", an email field, a
`Continue` button, and a line about the terms. No password field. This is a prototype, so there is no
real authentication and nothing is sent anywhere.

On submit it calls `startTrial()` from `PricingProvider`, then navigates to the newest released
module at `/pulse/modules/:id/items/:itemId?trial=started`. That is the same destination the existing
`Start Free Trial` button in `PulseV2Hero` uses, so both paths behave the same.

The page loader is used for the transition, matching the rest of the prototype.

## The 14 day change

A new constant is the single source of truth:

```ts
// src/lib/pulse/trial.ts
export const TRIAL_DAYS = 14;
```

Every place that currently hardcodes 30 reads from it instead. That is the point of the constant.
The number drifted into six files once already and should not do so again.

| File | Change |
|---|---|
| `src/lib/pulse/pricing.tsx` | `daysFromNow(30)` becomes `daysFromNow(TRIAL_DAYS)` in `startTrial`. The `paid` branch keeps its own fallback, because that path is a subscription fallback for `activeUntil`, not the trial length. |
| `src/components/pulse/PulseV2Hero.tsx` | "Free for 30 days" becomes "Free for 14 days". |
| `src/pages/Pulse/PulseConsumePage.tsx` | "You have 30 days of full access" becomes 14. |
| `emails/product-launch.html` | Six mentions of 30 days or 30 day trial become 14. |
| `emails/trial-expired-day-3.html` | One mention in the internal note becomes 14. |
| `scripts/build-emails.mjs` | The gallery note "the 30 day trial" becomes 14. |

`trial-expiring-10-days.html` and `trial-expiring-3-days.html` still work. On a 14 day trial they
land on day 4 and day 11.

## Files

```
src/pages/Landing/
  AiPulseLanding.tsx          page shell, composes the sections
  AiPulseLogin.tsx            the login step
  landingTheme.ts             Poppins, #196AE5, 4px buttons
  content.ts                  all copy in one place: FAQ, roles, testimonials, value items
  parts.tsx                   Eyebrow, TwoToneHeading, MarketingButton, SectionShell, StatStrip
  sections/
    LandingHeader.tsx
    LandingHero.tsx
    RatingsStrip.tsx
    SectionTabs.tsx
    ValueSection.tsx
    ModulesSection.tsx
    TrialSection.tsx
    AudienceSection.tsx
    ReviewsSection.tsx
    PgProgramSection.tsx
    FaqSection.tsx
    ClosingCta.tsx
    LandingFooter.tsx

src/lib/pulse/trial.ts             TRIAL_DAYS
src/lib/pulse/landingModules.ts    pure module selection for the accordion
src/lib/pulse/landingModules.test.ts
```

Copy lives in `content.ts` so a wording change is a one file edit and never a layout edit. Sections
stay small and each one owns one band of the page.

## Routing

Two new routes in `src/App.tsx`:

```
/ai-pulse         AiPulseLanding
/ai-pulse/login   AiPulseLogin
```

Both sit outside the `TopNav`, since they are public pages with their own header.

Both are loaded with `React.lazy`, so the Poppins font CSS and the marketing theme are only
downloaded by someone who visits the landing page. Product users never pay for them.

`vercel.json` needs no change. Its SPA rewrite already sends any non file path to `index.html`.

## Testing

`vitest` is already set up. Two things here are worth testing, and they are both pure functions:

- `landingModules.ts`. Returns released modules only, newest first, and splits them into the first
  six and the rest. Tests cover the `PULSE_TODAY` boundary and the ordering.
- The trial length. A test asserts `startTrial()` sets `activeUntil` 14 days out, so the change
  cannot silently regress to 30.

The page itself is checked by running it and looking at it, at 1440px, at 768px, and at 390px.

## Out of scope

- Real authentication. The login step is a prototype shim.
- Real payment or a pricing section. The page shows no price.
- Resolving the email module numbering mismatch.
- Changing `/pulse` beyond the trial length copy.
- Deploying the separate `pulse-email-assets` project. The landing page uses local assets from
  `public/`, so it needs nothing from there.

## Handover notes

Two things must be fixed before this page is shown to a real lead:

1. The three testimonials are invented placeholder copy and need real learner quotes.
2. The four review site ratings are taken from the live reference page. Confirm they are current
   before reusing them on a new page.
