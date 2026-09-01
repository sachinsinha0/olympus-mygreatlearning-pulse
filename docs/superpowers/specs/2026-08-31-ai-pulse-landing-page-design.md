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
| Visual language | The Great Learning course landing template, scoped to the landing route only. |
| Page length | Short. Sections only where real content backs them. See "Scale" below. |
| Main button | Goes to a login step, which starts the trial and lands the user on a module. |

## The reference

Great Learning has **one reusable course landing template**. It is re-skinned per partner brand and
the layout stays identical. Confirmed by comparing two live pages built on it:

- `https://www.mygreatlearning.com/iit-bombay-certificate-leadership-with-ai`
- `https://online.lifelonglearning.jhu.edu/jhu-ai-in-healthcare-certificate-program`

Same section order, same stat strip, same cream expert band, same ratings row, same accordion, same
sticky tabs, same sticky bottom bar. Only the heading font and the brand colour change. Plus
`https://www.mygreatlearning.com/` and `https://www.mygreatlearning.com/enterprise` for the global
nav and the plain logo wall.

**The AI-Native Professional page is explicitly not the reference.** It was itself AI designed and
carries the tells: `//` eyebrows, two tone violet headlines, 48px weight 500 headings, and dark
gradient tile grids. None of that appears in this spec.

AI Pulse is a Great Learning product, so the brand layer is Great Learning's own. Heading font
Poppins, primary blue `#196AE5`.

### Template tokens

Measured from the live pages, not guessed.

| Token | Value |
|---|---|
| Font | Poppins. Weights 400, 500, 600, 700. |
| Body | 15px, colour `#444444` |
| Hero paragraph | 16px, colour `#444444` |
| Hero H1 | 36px, weight 500, colour `#101828` |
| Hero tagline above H1 | 14px, weight 400, brand blue |
| Section heading on light | 32px, weight 600, colour `rgba(0,0,0,0.92)` |
| Section heading on dark | 30px, weight 500, white |
| Item title | 18px, weight 600 |
| Hero buttons | 4px radius, 16px padding, 20px, weight 600, 58px tall |
| Body buttons | 4px radius, 16px 24px padding, 16px, weight 500, 56px tall |
| Primary button | Solid `#196AE5`, white text |
| Secondary button | Transparent, 1px `#196AE5` border, blue text |
| Cards | 8px radius, 1px light border, subtle shadow |
| Content width | 1280px, the site grid |

Section backgrounds this page uses:

| Role | Colour |
|---|---|
| Default | White |
| Dark section | `#0C111D` |
| Pale band | `rgba(0,0,0,0.04)` |

Note `rgba(0,0,0,0.92)` is already the heading colour in `PulseV2Hero`. The newer Great Learning
pages and our product share tokens, so the two ends of the journey already agree.

### Template patterns

- **Header.** Great Learning logo on a 72px white bar with a bottom border, and nothing else. The
  course pages carry the full site nav and a breadcrumb because they sit inside the course
  taxonomy. AI Pulse does not, and the standalone pages on the real site agree: `/enterprise` and
  `/universities` have no breadcrumb. Logging in is offered by the hero and the sticky bottom bar.
- **Hero.** Two columns. Left is a blue tagline line, a plain H1, a three line paragraph, two
  buttons, one line of extra information with a small icon, then the stat strip. Right is a real
  photograph in a rounded rectangle.
- **Stat strip.** A bordered card about 96px tall holding four cells with vertical dividers. Bold
  value on top, grey label under it.
- **Ratings row.** A centred heading, then four bordered white boxes each holding a score, a gold
  star, and the review site name.
- **Sticky bottom bar.** Product name and meta on the left, primary and secondary button on the
  right, one small line beneath them.
- **Dark feature section.** Left aligned white heading, then two columns of items. Each item has a
  small square outlined icon tile, a bold white title, and grey body text. No card backgrounds.
- **Labelled section.** A round pale blue circle icon, a small blue uppercase label, then the plain
  heading. This is the template's eyebrow. It is a coloured uppercase word, never `//`.
- **Checkmark list.** Blue circled ticks with plain sentences beside them. One column, left aligned.
- **Accordion.** White card rows with a bold title on the left and a light grey circular `+` on the
  right. Rows are separated by a small gap, not a shared border.
- **Question headings.** Most section headings are plain questions. "Why should you join this
  certificate course?" "Who is the certificate for?" "What is the certificate curriculum?" Single
  colour, no decoration.

### This must not look AI designed

The user's constraint, and it is the reason the reference changed. Banned outright:

- `//` eyebrow marks.
- Two tone headlines where the second phrase switches to violet.
- Coloured `border-left` or `border-top` accent strips on cards. The reference uses a thin neutral
  grey rule to set off a blockquote, which is typography, not an accent stripe. That is the only one
  directional border allowed, and this page does not currently need it.
- Gradient text, glow blobs behind the hero, glassmorphism, backdrop blur.
- Dark gradient tile grids standing in for a real image.
- The same three column icon card grid repeated section after section.
- An icon in a rounded square on every list item. The template mixes plain checkmark lists, plain
  grids and accordions instead.
- Emoji as icons.
- Everything centred, everything the same size, symmetry without hierarchy.
- Decorative pill badges.
- Invented urgency. The reference says "Application closes on Today" because there is a real
  deadline. A free trial that is always open has none, so that slot carries a true fact instead:
  the release cadence.

The defence is that every pattern above was read off the live reference pages. Where the template
has no pattern for something we need, the nearest template pattern is reused rather than a new one
invented.

### Scoped, not global

The marketing theme lives in `src/pages/Landing/landingTheme.ts` and is applied by a nested MUI
`ThemeProvider` inside the landing page. `src/theme/` is not touched. `/pulse` looks exactly as it
does today.

This is deliberate. A past global theme alignment pass on this repo was reverted because the mixed
result looked wrong. The marketing skin belongs to marketing pages only. Crossing the login step is
the moment the product theme takes over, which is how the real site behaves.

## Scale: this is a feature, not a programme

The reference pages sell 4 to 7 month programmes costing tens of thousands of rupees. They run past
12,000px and carry faculty bios, industry speakers, fees, EMI options, a selection process,
eligibility criteria, batch dates, blog cards and trending programmes. They need that length because
the decision is large.

AI Pulse is a feature. It has 11 released modules, a two week cadence, and a free trial. The
decision is small: log in and try it.

So the template supplies the **visual language and the patterns**, not the page length. Sections only
exist where real content backs them. Anything the reference has that we cannot fill honestly is
dropped rather than padded, because padding a short story into a long page is itself the tell we are
trying to avoid.

Dropped from the template, and why:

| Dropped | Reason |
|---|---|
| Reviews carousel | No real learner quotes exist. Three invented ones would be the least trustworthy thing on the page. |
| Sticky section tabs | Six sections do not need a tab bar. The reference needs one because its page is three times longer. |
| Separate "what will you learn" checklist | The module accordion already lists real `outcomes` per module. |
| Second feature grid ("why choose") | Says the same thing as "why subscribe". |
| ~~Skills chips~~ | **Reinstated.** Dropped for lack of content, which was wrong: `PulseIntroPage` carries an 18 item topic vocabulary, written at concept level so it does not go stale. It is the topic row under the modules now. |
| "Who is it for" section | No real audience data. Becomes one FAQ answer. |
| Navy cadence band | One sentence the hero already carries. |
| Separate "talk to us" section | Not wanted. The footer carries a contact line and that is enough. |
| Faculty, mentors, academic director | AI Pulse has none. |
| Fees, EMI, selection process, eligibility, batch dates | None apply to a free trial. |
| Certificate section | Pulse issues no certificate. |
| Blog cards, similar courses, trending programmes | Site furniture, not part of this page's job. |

## Page structure

Eleven bands. The cream advisor strip the template runs under its hero was dropped, because
a "Speak with our expert" line is not wanted on this page.

| # | Section | Background | Backed by |
|---|---|---|---|
| 1 | Header | White | Great Learning logo only |
| 2 | Hero | White | Real cadence, real trial terms, existing hero photograph |
| 4 | Ratings row | White | Great Learning's real review site scores |
| 5 | AI labs | White | The lab list and logos the onboarding carousel already ships |
| 6 | Why subscribe | `#0C111D` | The three product pillars in `PulseV2Hero`, plus the archive argument from the brief |
| 6 | What is inside AI Pulse | White | `src/mocks/pulse-issues.json`, the file the product reads |
| 7 | How the trial works | Pale | The real trial flow |
| 8 | The PG Program | `#0C111D` | Real programme, real link, real number |
| 9 | FAQ | White | Written answers, no invented facts |
| 10 | Footer | Dark | GL footer links |
| 11 | Sticky bottom bar | White | Appears once the hero scrolls out of view |

Plus the sticky trial card in the right rail, which starts at section 5 and releases at the end of
section 6.

### 2. Hero

Follows the reference part for part.

- Blue tagline, 14px: "Stay current with AI without falling behind."
- H1, 36px, plain `#101828`: "AI Pulse: new AI tools every two weeks"
- Paragraph, 16px `#444`, short sentences: "Learn one new AI tool every two weeks. Each module takes
  under an hour. Use what you learn at work the same day."
- Buttons: `Start Free Trial` solid, `Log In` outlined.
- Information line with a small icon, in place of the reference's deadline line: "New module every
  two weeks." Checked against the data: `releasedAt` gaps are 14 days for the recent run, but the
  dates fall on Wednesdays and Fridays, so naming a weekday would be untrue.
- Stat strip, four cells: `14 Days / Free trial`, `Every 2 weeks / New module`,
  `Under 60 min / Per module`, `11 modules / Available now`.
- The hero is the product's own banner, PulseV2Hero reproduced value for value: the gradient
  card, the masked photograph, the lockup, the headline, the subtitle, the CTA row and the
  pillars strip. Six invented hero visuals were explored and rejected before settling here. The
  banner a lead sees on this page is the banner they see after logging in.

### Ratings row

Centred heading "Delivered by Great Learning", then four bordered white boxes, each a score, a gold
star, and the review site name. These are Great Learning's own scores, so the section is real. We do
not have the review site logos as local assets, so the name is set as text.

### 5. Why subscribe

Dark section. Heading "Why should you subscribe to AI Pulse?" Two columns of two items. Each item is
a small square outlined icon tile, a bold white title, and grey body text. No card backgrounds.

The first three items are the product's own pillars, taken verbatim from `PulseV2Hero` and repeated
by `PricingModal`: stay ahead of the AI curve, bite-sized modules, use it at work. A lead should
hear the same three reasons here that they will hear inside the product.

The fourth is the compounding archive argument from `docs/great-learning-pulse-brief.md`. The
product UI never states it, but it is the reason to hold a subscription rather than dip in once,
which is what this page is selling.

The sticky trial card floats over the right of this section, as the reference form does.

### 6. What is inside AI Pulse

The centrepiece, and the reason the page can be short. It reads `src/mocks/pulse-issues.json`, the
same file the product reads.

- Centred heading "What is inside AI Pulse?", centred intro line, then the accordion.
- Released modules only, meaning `releasedAt <= PULSE_TODAY`. That is 11 of the 13.
- Newest first, sorted by `releasedAt` descending. Same rule as `PulseHome`.
- Six rows, then a `View all modules` control that reveals the remaining five.
- Row title is the product's own label, `useUnitLabel().numbered(issue.issueNumber)` followed by the
  module title, so a row reading "Module 12" matches what the lead sees after logging in.
- Collapsed row: white card, bold title, light grey circular `+` on the right.
- Expanded row: the `description`, the `outcomes` as a blue circled checkmark list, one line giving
  `learningMinutes` and `handsOnMinutes`, and a tools row showing `toolName` with `toolLogo`.

No tinted inner panels. The reference accordion opens into plain body text and lists.

**Open item carried forward.** The email templates number these modules 01 to 04 as a marketing
sequence, while the product numbers them by `issueNumber`. This spec makes the landing page match
the product, because the landing page sits one click from the product. It does not resolve the email
mismatch. That still needs one decision across the whole set.

### 7. How the trial works

Centred heading "How does the free trial work?" Three numbered steps as large numerals.

1. Log in with your email.
2. Open any module.
3. Finish it in under an hour.

Then one line: "After 14 days you can subscribe to keep going. Everything you finished stays yours."
No price, per the decision above.

### 8. The PG Program

Dark section. Heading "Ready to go deeper than two weeks at a time?" Body explaining that Pulse
keeps you current while the PG Program builds the full skill set. Three short lines: live mentoring,
a full curriculum, career support. Then an `Explore the PG Program` button linking to
`https://www.mygreatlearning.com/pg-program-online-artificial-intelligence-machine-learning`, and


### 9. FAQ

Six questions, in the template's accordion. What AI Pulse is. Who it is for. Whether a card is
needed. What happens after 14 days. How much time a module takes. How it relates to the PG Program.

The "after 14 days" answer says the trial converts to a paid subscription. It does not name a price,
because the page shows no price.

### 11. Sticky bottom bar

The reference pattern, and it does real work on a short page. `AI Pulse` with
`14 days free · No credit card` on the left, `Start Free Trial` solid and `Log In` outlined on the
right. Appears once the hero has scrolled out of view.

### The right rail card

The reference floats a six field lead capture form in the right rail, because its job is to capture
a stranger. Our leads are already captured. Sales has them on the phone. The job of this page is to
get a known lead to log in.

So the rail keeps the card in the same slot and the same shape, with one field instead of six:
heading "Start your free trial", the line "14 days of full access. No credit card.", an email input,
a full width `Start Free Trial` button, the consent line, and "New module every two weeks" beneath.

The email typed here is carried to the login step, so the field is the first step of logging in
rather than a form that goes nowhere.

## The login step

Route `/ai-pulse/login`.

A centred card in the marketing theme: GL logo, "Log in to start your free trial", an email field, a
`Continue` button, and the consent line. No password field. This is a prototype, so there is no real
authentication and nothing is sent anywhere.

It accepts an `email` query parameter so the rail card and the hero can prefill it.

On submit it calls `startTrial()` from `PricingProvider`, then navigates to the newest released
module at `/pulse/modules/:id/items/:itemId?trial=started`. That is the same destination the existing
`Start Free Trial` button in `PulseV2Hero` uses, so both paths behave the same.

The page loader runs the transition, matching the rest of the prototype.

## The 14 day change

A new constant is the single source of truth:

```ts
// src/lib/pulse/trial.ts
export const TRIAL_DAYS = 14;
```

Every place that hardcodes 30 reads from it instead. That is the point of the constant. The number
drifted into six files once already and should not do so again.

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
  AiPulseLanding.tsx        page shell, composes the sections
  AiPulseLogin.tsx          the login step
  landingTheme.ts           Poppins, #196AE5, template tokens
  content.ts                all copy: value props, FAQ, ratings, trial steps
  parts.tsx                 SectionShell, SectionHeading, GlButton, StatStrip, IconTile,
                            CheckList
  sections/
    GlobalNav.tsx           the logo header
    LandingHero.tsx
    ExpertBand.tsx
    RatingsRow.tsx
    WhySubscribe.tsx
    ModulesSection.tsx
    TrialSection.tsx
    PgProgramSection.tsx
    FaqSection.tsx
    LandingFooter.tsx
    TrialRailCard.tsx
    StickyCtaBar.tsx

src/lib/pulse/trial.ts             TRIAL_DAYS
src/lib/pulse/landingModules.ts    pure module selection for the accordion
src/lib/pulse/landingModules.test.ts
```

Copy lives in `content.ts` so a wording change is a one file edit and never a layout edit. Each
section file owns one band of the page and nothing else.

## Routing

Two new routes in `src/App.tsx`:

```
/ai-pulse         AiPulseLanding
/ai-pulse/login   AiPulseLogin
```

Both sit outside `TopNav`, since they are public pages with their own nav.

Both load with `React.lazy`, so the Poppins font CSS and the marketing theme are only downloaded by
someone who visits the landing page. Product users never pay for them.

`vercel.json` needs no change. Its SPA rewrite already sends any non file path to `index.html`.

## Testing

`vitest` is already set up. Two things here are worth testing, and both are pure functions:

- `landingModules.ts`. Returns released modules only, newest first, split into the first six and the
  rest. Tests cover the `PULSE_TODAY` boundary and the ordering.
- The trial length. A test asserts `startTrial()` sets `activeUntil` 14 days out, so the change
  cannot silently regress to 30.

The page itself is checked by running it and looking at it, at 1440px, at 768px, and at 390px.

## Out of scope

- Real authentication. The login step is a prototype shim.
- Real payment or a pricing section. The page shows no price.
- Resolving the email module numbering mismatch.
- Changing `/pulse` beyond the trial length copy.
- Deploying the separate `pulse-email-assets` project. The landing page uses assets already in
  `public/`.

## Handover notes

Two things must be settled before this page is shown to a real lead:

1. The four review site scores are copied from the live reference pages. Confirm they are current.
   We also do not have the Google, Course Report, Switchup and Career Karma logos as local assets,
   so the rating boxes show the site name as text next to a gold star.
2. The footer still prints a contact phone number, which is the one from the reference pages.
   Confirm the right number for AI Pulse.

There are no invented testimonials on this page. That section was dropped rather than filled with
placeholder quotes.
