# AI Pulse Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public landing page at `/ai-pulse` that sells the 14 day AI Pulse trial to sales-sourced leads and hands them to `/pulse` through a login step.

**Architecture:** A lazy-loaded route pair (`/ai-pulse`, `/ai-pulse/login`) rendering under a nested MUI `ThemeProvider` that carries the Great Learning marketing skin. `src/theme/` is untouched, so the product keeps its own look. Page copy lives in one `content.ts`; each of the eleven page bands is its own small section component. Module content is read from `src/mocks/pulse-issues.json`, the same file `/pulse` reads. Trial length moves to a single `TRIAL_DAYS` constant.

**Tech Stack:** Vite, React 18, TypeScript, MUI 6, react-router-dom 7, lucide-react, vitest, `@fontsource/poppins` (new).

**Spec:** `docs/superpowers/specs/2026-08-31-ai-pulse-landing-page-design.md`

---

## Ground rules for whoever executes this

- **Design source.** Every visual decision comes from the Great Learning course landing template.
  Reference screenshots are described in the spec. Do not invent patterns.
- **Banned, without exception:** `//` eyebrow marks, two tone violet headlines, coloured
  `border-left` or `border-top` accent strips, gradient text, glow blobs, glassmorphism, backdrop
  blur, emoji as icons, decorative pill badges, the same icon-card grid twice.
- **Copy.** Short plain sentences. One idea per sentence. **No em dashes anywhere.** Use a full
  stop, a comma, or a slash.
- **Nothing invented as fact.** No testimonials, no fake deadlines, no numbers we cannot source.
- Commit after every task. Never `git push` without being asked.

## File structure

| File | Responsibility |
|---|---|
| `src/lib/pulse/trial.ts` | `TRIAL_DAYS` and the trial end date calculation. Single source of truth. |
| `src/lib/pulse/trial.test.ts` | Locks the trial at 14 days. |
| `src/lib/pulse/landingModules.ts` | Pure selection of released modules for the accordion. |
| `src/lib/pulse/landingModules.test.ts` | Boundary, ordering and split coverage. |
| `src/pages/Landing/landingTheme.ts` | Poppins, GL tokens, MUI theme + Poppins font imports. |
| `src/pages/Landing/content.ts` | Every string on the page. |
| `src/pages/Landing/parts.tsx` | `Section`, `SectionHeading`, `DarkHeading`, `Lede`, `StatStrip`, `IconTile`, `CheckList`. Buttons come straight from MUI, styled once in the theme. |
| `src/pages/Landing/AiPulseLanding.tsx` | Page shell. Theme provider, section order, rail layout. |
| `src/pages/Landing/AiPulseLogin.tsx` | The prototype login step. |
| `src/pages/Landing/sections/*.tsx` | One file per page band, plus the rail card and the sticky bar. |

---

## Task 1: Branch and the Poppins dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b feat/ai-pulse-landing
git status
```

Expected: `On branch feat/ai-pulse-landing`, working tree clean apart from untracked `.vscode/`.

- [ ] **Step 2: Install Poppins**

```bash
npm install @fontsource/poppins
```

Expected: `@fontsource/poppins` added to `dependencies`. Verify:

```bash
ls node_modules/@fontsource/poppins/ | head -5
```

Expected: directory listing including `400.css`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(landing): add Poppins for the marketing skin"
```

---

## Task 2: The TRIAL_DAYS constant

The trial length is currently hardcoded as `30` in five places. Put it in one place first, so the
rest of the sweep has something to point at.

**Files:**
- Create: `src/lib/pulse/trial.ts`
- Create: `src/lib/pulse/trial.test.ts`
- Modify: `src/lib/pulse/pricing.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/lib/pulse/trial.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { TRIAL_DAYS, trialEndsOn } from "./trial";

describe("TRIAL_DAYS", () => {
  it("is 14 days", () => {
    expect(TRIAL_DAYS).toBe(14);
  });
});

describe("trialEndsOn", () => {
  it("adds the trial length to the start date", () => {
    expect(trialEndsOn("2026-08-31")).toBe("2026-09-14");
  });

  it("crosses a year boundary", () => {
    expect(trialEndsOn("2026-12-25")).toBe("2027-01-08");
  });

  it("handles a leap day", () => {
    expect(trialEndsOn("2028-02-20")).toBe("2028-03-05");
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm test -- src/lib/pulse/trial.test.ts
```

Expected: FAIL, `Failed to resolve import "./trial"`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/pulse/trial.ts`:

```ts
/**
 * How long the AI Pulse free trial runs.
 *
 * This number used to be written out as `30` in five separate files, which is how the
 * product and the emails drifted apart. Everything that needs the trial length reads it
 * from here now: the landing page, the /pulse hero, the consume page, and pricing.tsx.
 */
export const TRIAL_DAYS = 14;

/** The ISO date a trial started on `startISO` runs out. */
export function trialEndsOn(startISO: string): string {
  const d = new Date(`${startISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + TRIAL_DAYS);
  return d.toISOString().slice(0, 10);
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npm test -- src/lib/pulse/trial.test.ts
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Point `startTrial` at it**

In `src/lib/pulse/pricing.tsx`, add to the imports at the top of the file:

```ts
import { TRIAL_DAYS } from "./trial";
```

Then change `startTrial` (currently around line 115) from:

```ts
  const startTrial = useCallback(() => {
    setStored({ state: "trial", plan: null, activeUntil: daysFromNow(30), trialStartedAt: todayISO() });
  }, []);
```

to:

```ts
  const startTrial = useCallback(() => {
    setStored({ state: "trial", plan: null, activeUntil: daysFromNow(TRIAL_DAYS), trialStartedAt: todayISO() });
  }, []);
```

Leave the `daysFromNow(30)` inside the `paid` branch of `setState` alone. That is a subscription
fallback for `activeUntil`, not the trial length.

- [ ] **Step 6: Run the whole suite**

```bash
npm test
```

Expected: all tests pass. The existing `pricing.test.ts` only covers `planDurationDays` and
`PLAN_PRICE`, neither of which changed.

- [ ] **Step 7: Commit**

```bash
git add src/lib/pulse/trial.ts src/lib/pulse/trial.test.ts src/lib/pulse/pricing.tsx
git commit -m "feat(pulse): single TRIAL_DAYS constant, trial is 14 days"
```

---

## Task 3: Sweep the 30 day copy

**Files:**
- Modify: `src/components/pulse/PulseV2Hero.tsx:332`
- Modify: `src/pages/Pulse/PulseConsumePage.tsx:397`
- Modify: `emails/product-launch.html`
- Modify: `emails/trial-expired-day-3.html`
- Modify: `scripts/build-emails.mjs:51`

- [ ] **Step 1: Find every remaining mention**

```bash
grep -rn "30 days\|30-day" src/ emails/ scripts/
```

Expected: 9 hits. One in `PulseV2Hero.tsx`, one in `PulseConsumePage.tsx`, six in
`emails/product-launch.html`, one in `emails/trial-expired-day-3.html`, one in
`scripts/build-emails.mjs`. `emails/index.html` is generated, so ignore any hit there.

- [ ] **Step 2: Update the product copy**

In `src/components/pulse/PulseV2Hero.tsx`, change:

```
                  Free for 30 days · No credit card required
```

to:

```
                  Free for 14 days · No credit card required
```

In `src/pages/Pulse/PulseConsumePage.tsx`, change:

```
              You have 30 days of full access to AI Pulse. Dive in and apply what you learn.
```

to:

```
              You have 14 days of full access to AI Pulse. Dive in and apply what you learn.
```

- [ ] **Step 3: Update the emails and the build script**

```bash
sed -i '' 's/30-day/14-day/g; s/30 days/14 days/g' emails/product-launch.html emails/trial-expired-day-3.html
sed -i '' 's/the 30 day trial/the 14 day trial/' scripts/build-emails.mjs
```

- [ ] **Step 4: Verify nothing is left**

```bash
grep -rn "30 days\|30-day\|30 day" src/ emails/*.html scripts/ | grep -v "emails/index.html"
```

Expected: no output.

- [ ] **Step 5: Regenerate the email gallery and build**

```bash
npm run emails && npm run build
```

Expected: build succeeds, `dist/` written.

- [ ] **Step 6: Commit**

```bash
git add -A src/ emails/ scripts/
git commit -m "refine(pulse): the trial is 14 days everywhere, not 30"
```

---

## Task 4: Module selection for the accordion

**Files:**
- Create: `src/lib/pulse/landingModules.ts`
- Create: `src/lib/pulse/landingModules.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/pulse/landingModules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { selectLandingModules } from "./landingModules";
import type { PulseIssue } from "./types";

function issue(id: string, releasedAt: string): PulseIssue {
  return { id, releasedAt } as PulseIssue;
}

describe("selectLandingModules", () => {
  const all = [
    issue("future", "2026-07-01"),
    issue("today", "2026-06-05"),
    issue("older", "2026-05-01"),
    issue("oldest", "2026-04-01"),
  ];

  it("drops modules released after today", () => {
    const { visible } = selectLandingModules(all, "2026-06-05", 6);
    expect(visible.map((i) => i.id)).not.toContain("future");
  });

  it("includes a module released exactly today", () => {
    const { visible } = selectLandingModules(all, "2026-06-05", 6);
    expect(visible.map((i) => i.id)).toContain("today");
  });

  it("sorts newest first", () => {
    const { visible } = selectLandingModules(all, "2026-06-05", 6);
    expect(visible.map((i) => i.id)).toEqual(["today", "older", "oldest"]);
  });

  it("splits at the visible count", () => {
    const { visible, hidden } = selectLandingModules(all, "2026-06-05", 2);
    expect(visible.map((i) => i.id)).toEqual(["today", "older"]);
    expect(hidden.map((i) => i.id)).toEqual(["oldest"]);
  });

  it("counts every released module, not just the visible ones", () => {
    expect(selectLandingModules(all, "2026-06-05", 2).total).toBe(3);
  });

  it("leaves hidden empty when everything fits", () => {
    expect(selectLandingModules(all, "2026-06-05", 6).hidden).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm test -- src/lib/pulse/landingModules.test.ts
```

Expected: FAIL, `Failed to resolve import "./landingModules"`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/pulse/landingModules.ts`:

```ts
import { PULSE_TODAY } from "./prototypeDate";
import type { PulseIssue } from "./types";

export type LandingModules = {
  /** Shown when the accordion first renders. */
  visible: PulseIssue[];
  /** Revealed by "View all modules". */
  hidden: PulseIssue[];
  /** Every released module, visible plus hidden. */
  total: number;
};

/**
 * The released modules the landing page advertises, newest first.
 *
 * Same rule as PulseHome: classify against PULSE_TODAY rather than the real clock, so
 * the page does not change shape as real time passes, and sort by release date rather
 * than issue number, because the issue numbers are not chronological.
 */
export function selectLandingModules(
  all: PulseIssue[],
  today: string = PULSE_TODAY,
  visibleCount = 6,
): LandingModules {
  const released = all
    .filter((i) => i.releasedAt <= today)
    .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
  return {
    visible: released.slice(0, visibleCount),
    hidden: released.slice(visibleCount),
    total: released.length,
  };
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npm test -- src/lib/pulse/landingModules.test.ts
```

Expected: PASS, 6 tests.

- [ ] **Step 5: Confirm the real data gives 11 released modules**

```bash
node -e "
const all=require('./src/mocks/pulse-issues.json');
const r=all.filter(i=>i.releasedAt<='2026-06-05');
console.log('released:', r.length, 'newest:', r.sort((a,b)=>b.releasedAt.localeCompare(a.releasedAt))[0].title);
"
```

Expected: `released: 11 newest: The Month Claude Became a Platform`.

If this prints anything other than 11, update the hero stat strip copy in Task 6 to match.

- [ ] **Step 6: Commit**

```bash
git add src/lib/pulse/landingModules.ts src/lib/pulse/landingModules.test.ts
git commit -m "feat(landing): pure module selection for the landing accordion"
```

---

## Task 5: The marketing theme

**Files:**
- Create: `src/pages/Landing/landingTheme.ts`

- [ ] **Step 1: Write the theme**

Create `src/pages/Landing/landingTheme.ts`:

```ts
import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

/**
 * Great Learning marketing tokens, measured from the live course landing template
 * (the IIT Bombay and Johns Hopkins pages, which are the same template re-skinned).
 *
 * This is the MARKETING skin and it stays inside the /ai-pulse route. The product
 * theme in src/theme/ is a different design language and must not be changed to
 * match. A learner crosses from one to the other at the login step, which is how
 * the real site behaves.
 */
export const GL = {
  blue: "#196AE5",
  blueHover: "#1259C4",
  /** Hero H1. */
  ink: "#101828",
  /** Section headings on light backgrounds. */
  heading: "rgba(0, 0, 0, 0.92)",
  body: "#444444",
  /** Dark section background. */
  dark: "#0C111D",
  /** Body text on the dark background. */
  darkBody: "#B9BFCB",
  /** Pale band. rgba(0,0,0,0.04) resolved over white. */
  pale: "#F5F5F5",
  /** The "Speak with our expert" strip. */
  cream: "#FDF4E7",
  border: "#E4E7EC",
  darkBorder: "#2A3140",
  gold: "#F5B301",
  maxWidth: 1256,
} as const;

const FONT = '"Poppins", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';

export const landingTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: GL.blue, contrastText: "#ffffff" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: GL.heading, secondary: GL.body },
    divider: GL.border,
  },
  typography: {
    fontFamily: FONT,
    body1: { fontSize: 16, lineHeight: 1.6, color: GL.body },
    body2: { fontSize: 15, lineHeight: 1.6, color: GL.body },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 600,
          minHeight: 56,
          padding: "16px 24px",
          boxShadow: "none",
        },
        contained: {
          backgroundColor: GL.blue,
          "&:hover": { backgroundColor: GL.blueHover, boxShadow: "none" },
        },
        outlined: {
          borderColor: GL.blue,
          color: GL.blue,
          "&:hover": { borderColor: GL.blue, backgroundColor: "rgba(25, 106, 229, 0.04)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 4, fontFamily: FONT, fontSize: 15 },
        notchedOutline: { borderColor: GL.border },
      },
    },
  },
});
```

- [ ] **Step 2: Type check**

```bash
npx tsc -b
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing/landingTheme.ts
git commit -m "feat(landing): Great Learning marketing theme, scoped to the route"
```

---

## Task 6: The page copy

Everything a copy edit could touch lives here, so a wording change never becomes a layout change.

**Files:**
- Create: `src/pages/Landing/content.ts`

- [ ] **Step 1: Write the content module**

Create `src/pages/Landing/content.ts`:

```ts
import { Briefcase, Layers, Library, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TRIAL_DAYS } from "../../lib/pulse/trial";

export const ADVISOR_PHONE = "+91 797-117-1332";
export const PG_PROGRAM_URL =
  "https://www.mygreatlearning.com/pg-program-online-artificial-intelligence-machine-learning";

export const HERO = {
  tagline: "Stay current with AI without falling behind.",
  title: "AI Pulse: new AI tools every two weeks",
  body: "Learn one new AI tool every two weeks. Each module takes under an hour. Use what you learn at work the same day.",
  primaryCta: "Start Free Trial",
  secondaryCta: "Log In",
  cadence: "New module every two weeks.",
} as const;

/** Four cells, matching the template's stat strip. `modules` is filled in at render time. */
export const HERO_STATS: { value: string; label: string }[] = [
  { value: `${TRIAL_DAYS} Days`, label: "Free trial" },
  { value: "Every 2 weeks", label: "New module" },
  { value: "Under 60 min", label: "Per module" },
];

/**
 * Great Learning's own review scores, copied from the live course landing pages.
 * We do not ship the review site logos as local assets, so the site name is set as text.
 * Confirm these are current before this page goes in front of a real lead.
 */
export const RATINGS: { score: string; site: string }[] = [
  { score: "4.6", site: "Google" },
  { score: "4.89", site: "Course Report" },
  { score: "4.94", site: "Switchup" },
  { score: "4.7", site: "Career Karma" },
];

/** The four value props from docs/great-learning-pulse-brief.md. */
export const VALUE_PROPS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Layers,
    title: "Structured, not a feed",
    body: "YouTube is a feed. Every Pulse module builds on the last. After a year you have a clear record of how AI changed.",
  },
  {
    Icon: ShieldCheck,
    title: "Someone used it first",
    body: "No module ships until a team member has used the tool on a real problem. If it does not hold up, we drop the topic.",
  },
  {
    Icon: Briefcase,
    title: "Built to use at work",
    body: "Every module ends with something you build yourself. Most of it is useful the same day.",
  },
  {
    Icon: Library,
    title: "The archive keeps growing",
    body: "Every release joins the back catalogue. Your subscription is worth more in month twelve than in month one.",
  },
];

export const TRIAL_STEPS: { title: string; body: string }[] = [
  { title: "Log in with your email", body: "No card and no forms. Your email is enough." },
  { title: "Open any module", body: "Every released module is unlocked from day one." },
  { title: "Finish it in under an hour", body: "Watch how the tool works, then build something with it." },
];

export const TRIAL_FOOTNOTE = `After ${TRIAL_DAYS} days you can subscribe to keep going. Everything you finished stays yours.`;

export const PG_SECTION = {
  title: "Ready to go deeper than two weeks at a time?",
  body: "Pulse keeps you current on what is new. The PG Program in AI and Machine Learning builds the whole skill set.",
  points: [
    "Live mentoring from faculty and working practitioners",
    "A full curriculum, not a two week slice",
    "Career support: portfolio, resume and mock interviews",
  ],
  cta: "Explore the PG Program",
} as const;

export const FAQ: { q: string; a: string }[] = [
  {
    q: "What is AI Pulse?",
    a: "A learning subscription from Great Learning. You get one new module every two weeks on a new AI tool or shift. Each one takes under an hour.",
  },
  {
    q: "Who is it for?",
    a: "Working professionals who want to keep up with AI. You do not need to code. The modules assume you use AI at work, not that you build it.",
  },
  {
    q: "Do I need a credit card to start?",
    a: `No. The ${TRIAL_DAYS} day trial needs your email and nothing else.`,
  },
  {
    q: `What happens after ${TRIAL_DAYS} days?`,
    a: "You can subscribe to keep going. Anything you finished during the trial stays in your account.",
  },
  {
    q: "How much time does a module take?",
    a: "Under 60 minutes. Around 35 minutes of learning and 15 to 20 minutes hands-on.",
  },
  {
    q: "How does this relate to the PG Program?",
    a: "Pulse keeps you current on what is new. The PG Program builds the full skill set with live mentoring and career support. Many learners do both.",
  },
];

export const RAIL_CARD = {
  title: "Start your free trial",
  body: `${TRIAL_DAYS} days of full access. No credit card.`,
  placeholder: "Enter your email",
  cta: "Start Free Trial",
  consent: "By continuing you agree to our Terms of Use and Privacy Policy.",
  footnote: "New module every two weeks.",
} as const;

export const STICKY_BAR = {
  name: "AI Pulse",
  meta: `${TRIAL_DAYS} days free · No credit card`,
} as const;

export const FOOTER_COLUMNS: { heading: string; links: string[] }[] = [
  { heading: "Browse Courses", links: ["Data Science", "Artificial Intelligence", "Generative AI", "Software Engineering", "Cloud Computing"] },
  { heading: "Degrees", links: ["Online MBA", "Masters Programs", "Doctorate", "PG Programs"] },
  { heading: "Quick Links", links: ["About Us", "Careers", "Contact Us", "Grievance Redressal", "Privacy Policy"] },
  { heading: "Great Learning", links: ["Blog", "Academy", "Enterprise", "For Recruiters", "Success Stories"] },
];
```

- [ ] **Step 2: Type check**

```bash
npx tsc -b
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing/content.ts
git commit -m "feat(landing): page copy in one module"
```

---

## Task 7: Shared parts

**Files:**
- Create: `src/pages/Landing/parts.tsx`

- [ ] **Step 1: Write the parts**

Create `src/pages/Landing/parts.tsx`:

```tsx
import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GL } from "./landingTheme";

/** A full width band with the template's 1256px content column inside it. */
export function Section({
  id,
  bg = "#ffffff",
  py = { xs: 6, md: 9 },
  children,
}: {
  id?: string;
  bg?: string;
  py?: object | number;
  children: ReactNode;
}) {
  return (
    <Box component="section" id={id} sx={{ bgcolor: bg, py }}>
      <Box sx={{ maxWidth: GL.maxWidth, mx: "auto", px: { xs: 2.5, md: 4 } }}>{children}</Box>
    </Box>
  );
}

/** 32px / 600 on light backgrounds. The template's section heading. */
export function SectionHeading({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Typography
      component="h2"
      sx={{
        fontSize: { xs: 26, md: 32 },
        fontWeight: 600,
        lineHeight: 1.25,
        color: GL.heading,
        textAlign: align,
      }}
    >
      {children}
    </Typography>
  );
}

/** 30px / 500 white. The template's heading on a dark band. */
export function DarkHeading({ children }: { children: ReactNode }) {
  return (
    <Typography
      component="h2"
      sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 500, lineHeight: 1.3, color: "#ffffff" }}
    >
      {children}
    </Typography>
  );
}

/** Grey supporting paragraph under a heading. */
export function Lede({ children, align = "left" }: { children: ReactNode; align?: "left" | "center" }) {
  return (
    <Typography
      sx={{
        fontSize: 16,
        lineHeight: 1.6,
        color: GL.body,
        textAlign: align,
        maxWidth: align === "center" ? 780 : 640,
        mx: align === "center" ? "auto" : 0,
      }}
    >
      {children}
    </Typography>
  );
}

/**
 * The bordered four cell strip under the hero. Vertical dividers between cells on
 * desktop, a two by two grid on phones.
 */
export function StatStrip({ items }: { items: { value: string; label: string }[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: `repeat(${items.length}, 1fr)` },
        border: `1px solid ${GL.border}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {items.map((item, i) => (
        <Box
          key={item.label}
          sx={{
            px: 2,
            py: 2.25,
            textAlign: "center",
            borderRight: {
              xs: i % 2 === 0 ? `1px solid ${GL.border}` : "none",
              md: i < items.length - 1 ? `1px solid ${GL.border}` : "none",
            },
            borderBottom: { xs: i < items.length - 2 ? `1px solid ${GL.border}` : "none", md: "none" },
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: GL.heading, lineHeight: 1.4 }}>
            {item.value}
          </Typography>
          <Typography sx={{ fontSize: 14, color: GL.body, lineHeight: 1.4 }}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/**
 * The template's small outlined square icon tile. Note it is a full 1px border on all
 * four sides. A one directional coloured accent border is banned on this page.
 */
export function IconTile({ Icon, dark = false }: { Icon: LucideIcon; dark?: boolean }) {
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "8px",
        border: `1px solid ${dark ? GL.darkBorder : GL.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: dark ? "#ffffff" : GL.heading,
      }}
    >
      <Icon size={20} strokeWidth={1.75} />
    </Box>
  );
}

/** Blue circled ticks with plain sentences beside them. */
export function CheckList({ items, dense = false }: { items: string[]; dense?: boolean }) {
  return (
    <Stack gap={dense ? 1.25 : 1.75}>
      {items.map((text) => (
        <Stack key={text} direction="row" gap={1.5} alignItems="flex-start">
          <Box
            sx={{
              flexShrink: 0,
              mt: "3px",
              width: 20,
              height: 20,
              borderRadius: "999px",
              border: `1.5px solid ${GL.blue}`,
              color: GL.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={12} strokeWidth={3} />
          </Box>
          <Typography sx={{ fontSize: dense ? 15 : 16, lineHeight: 1.55, color: GL.body }}>
            {text}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc -b
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing/parts.tsx
git commit -m "feat(landing): shared section, heading, stat strip and list parts"
```

---

## Task 8: Route the page and see something on screen

Get a rendering page early so every later task can be checked in a browser.

**Files:**
- Create: `src/pages/Landing/AiPulseLanding.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the page shell**

Create `src/pages/Landing/AiPulseLanding.tsx`:

```tsx
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { landingTheme } from "./landingTheme";
import { Section, SectionHeading } from "./parts";

export function AiPulseLanding() {
  return (
    <ThemeProvider theme={landingTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
        <Section>
          <SectionHeading>AI Pulse landing page</SectionHeading>
        </Section>
      </Box>
    </ThemeProvider>
  );
}

export default AiPulseLanding;
```

- [ ] **Step 2: Add the lazy routes**

In `src/App.tsx`, widen the existing React import on line 1 from:

```tsx
import { useEffect } from "react";
```

to:

```tsx
import { lazy, Suspense, useEffect } from "react";
```

Then, after the other page imports, add:

```tsx
// Lazy so the Poppins font CSS and the marketing theme only load for someone who
// actually visits the landing page. Product users never download them.
const AiPulseLanding = lazy(() => import("./pages/Landing/AiPulseLanding"));
```

Then add these entries to the `children` array in `createBrowserRouter`, just above the `/sublime`
route:

```tsx
      {
        path: "/ai-pulse",
        element: (
          <Suspense fallback={null}>
            <AiPulseLanding />
          </Suspense>
        ),
      },
```

- [ ] **Step 3: Run it and look**

```bash
npm run dev
```

Open `http://localhost:5173/ai-pulse`. Expected: the words "AI Pulse landing page" in Poppins, at
32px, near the top left of a white page. If the font still looks like Inter, the Poppins CSS import
in `landingTheme.ts` did not resolve.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing/AiPulseLanding.tsx src/App.tsx
git commit -m "feat(landing): lazy /ai-pulse route with the marketing theme"
```

---

## Task 9: Header

> **Revised after review.** This originally reproduced the full Great Learning site nav plus a
> breadcrumb. That was wrong. The course pages carry both because they sit inside the course
> taxonomy and a learner needs a route back up to it. AI Pulse is not a programme in that taxonomy,
> and the standalone pages on the real site confirm the pattern: `/enterprise` and `/universities`
> have no breadcrumb. The header is now the logo alone. Logging in is offered by the hero and the
> sticky bottom bar instead.

**Files:**
- Create: `src/pages/Landing/sections/GlobalNav.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the header**

A `Box component="header"`, `height: 72`, `bgcolor: "#ffffff"`,
`borderBottom: 1px solid GL.border`, `position: sticky`, `top: 0`, `zIndex: 20`.

Inside, the shared content column (`maxWidth: GL.maxWidth`, `mx: auto`, `px: { xs: 2.5, md: 4 }`,
`height: 100%`, `display: flex`, `alignItems: center`) holding one thing: `src/assets/gl-logo.svg`
imported as a module, at `height: 30`, with `alt="Great Learning"`.

The horizontal padding matches `Section` in `parts.tsx` so the logo and every section below it
share one left edge.

- [ ] **Step 2: Mount it as the first child inside the page shell's outer Box.**

- [ ] **Step 3: Check it, then commit**

```bash
git add src/pages/Landing/sections/GlobalNav.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): page header"
```

---

## Task 10: The hero

**Files:**
- Create: `src/pages/Landing/sections/LandingHero.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the hero**

Create `src/pages/Landing/sections/LandingHero.tsx`. Two columns inside a `Section`, `display: grid`,
`gridTemplateColumns: { xs: "1fr", lg: "1fr 460px" }`, `gap: { xs: 4, lg: 6 }`, `alignItems: center`.

Left column, a `Stack` with `gap: 2.5`, in this order and no other:

1. `HERO.tagline` at 14px, weight 400, colour `GL.blue`.
2. `HERO.title` as `component="h1"`, `fontSize: { xs: 30, md: 36 }`, `fontWeight: 500`,
   `lineHeight: 1.25`, colour `GL.ink`.
3. `HERO.body` at 16px, `lineHeight: 1.6`, colour `GL.body`, `maxWidth: 620`.
4. A row of two buttons, `direction: { xs: "column", sm: "row" }`, `gap: 2`. Primary is
   `variant="contained"` with `HERO.primaryCta` and navigates to `/ai-pulse/login`. Secondary is
   `variant="outlined"` with `HERO.secondaryCta`, same destination. Both override to
   `fontSize: 18, minHeight: 58` for the hero size.
5. The cadence line: a `CalendarClock` lucide icon at `size={16}` in `GL.blue`, then `HERO.cadence`
   at 15px in `GL.body`. This sits where the reference puts its application deadline. It is a true
   fact, not manufactured urgency.
6. `<StatStrip items={stats} />` with `marginTop: 1`.

Build `stats` in the component as `[...HERO_STATS, { value: \`${total} modules\`, label: "Available now" }]`
where `total` comes from `selectLandingModules(issuesData as PulseIssue[]).total`.

Right column: `public/hero/hero image.jpg` as an `<img>`, `width: "100%"`, `height: { xs: 260, lg: 420 }`,
`objectFit: "cover"`, `borderRadius: "8px"`, `display: block`, `alt=""`. Reference the file as
`/hero/hero%20image.jpg`, which is how `PulseV2Hero` already does it. Hide the image below `sm` if it
crowds the copy.

No gradients, no glow, no tile grid, no overlay.

- [ ] **Step 2: Mount it and delete the placeholder**

In `AiPulseLanding.tsx`, replace the placeholder `Section` with `<LandingHero />`.

- [ ] **Step 3: Check it in the browser**

Reload and compare against the IIT Bombay hero. The order tagline, title, paragraph, buttons,
information line, stat strip must match, and the photograph must sit on the right.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing/sections/LandingHero.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): hero with stat strip and real photograph"
```

---

## Task 11: Expert band and ratings row

**Files:**
- Create: `src/pages/Landing/sections/ExpertBand.tsx`
- Create: `src/pages/Landing/sections/RatingsRow.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the expert band**

Create `src/pages/Landing/sections/ExpertBand.tsx`: a full width `Box` with
`backgroundColor: GL.cream`, `py: 1.5`, holding one centred row: a `UserRound` lucide icon at
`size={15}` in `GL.body`, the text `Speak with our expert` at 14px in `GL.body`, then
`ADVISOR_PHONE` as an `<a href={"tel:" + ...}>` at 14px, weight 600, colour `GL.heading`, with
`textDecoration: underline`.

- [ ] **Step 2: Write the ratings row**

Create `src/pages/Landing/sections/RatingsRow.tsx`: a `Section` with `py: { xs: 4, md: 6 }`. A
centred `SectionHeading` reading `Delivered by Great Learning`, then a centred flex row with
`gap: 2`, `flexWrap: wrap`, `marginTop: 3`, holding one box per entry in `RATINGS`.

Each box: `border: 1px solid GL.border`, `borderRadius: "8px"`, `padding: "14px 22px"`,
`display: flex`, `alignItems: center`, `gap: 1`. Inside, the score at 20px weight 600 in
`GL.heading`, a `Star` lucide icon at `size={16}` with `fill={GL.gold}` and `color={GL.gold}`, then
the site name at 14px weight 500 in `GL.body`.

- [ ] **Step 3: Mount both**

In `AiPulseLanding.tsx`, render `<ExpertBand />` then `<RatingsRow />` directly after `<LandingHero />`.

- [ ] **Step 4: Check it in the browser and commit**

```bash
git add src/pages/Landing/sections/ExpertBand.tsx src/pages/Landing/sections/RatingsRow.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): expert band and review score row"
```

---

## Task 12: Why subscribe, and the sticky rail card

The rail card overlaps the dark section and the one after it, exactly as the reference form does.

**Files:**
- Create: `src/pages/Landing/sections/WhySubscribe.tsx`
- Create: `src/pages/Landing/sections/TrialRailCard.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the rail card**

Create `src/pages/Landing/sections/TrialRailCard.tsx`.

A white card: `backgroundColor: #ffffff`, `border: 1px solid GL.border`, `borderRadius: "8px"`,
`boxShadow: "0 4px 24px rgba(16, 24, 40, 0.10)"`, `padding: { xs: 3, md: 3.5 }`, `width: "100%"`,
`maxWidth: 400`.

Contents, centred except the input:

1. `RAIL_CARD.title` at 20px weight 600, colour `GL.heading`, centred.
2. `RAIL_CARD.body` at 14px colour `GL.body`, centred, `marginTop: 0.75`.
3. A full width `TextField` with `size="medium"`, `placeholder={RAIL_CARD.placeholder}`,
   `type="email"`, controlled by local state, `marginTop: 2.5`.
4. A full width contained `Button` reading `RAIL_CARD.cta`, `marginTop: 1.5`. On click, navigate to
   `/ai-pulse/login` passing the email: `navigate(\`/ai-pulse/login?email=${encodeURIComponent(email)}\`)`.
   When the field is empty, navigate to `/ai-pulse/login` with no query.
5. `RAIL_CARD.consent` at 11px colour `GL.body`, centred, `marginTop: 1.5`, `lineHeight: 1.5`.
6. A hairline `Divider` then `RAIL_CARD.footnote` at 13px colour `GL.body`, centred, `marginTop: 1.5`.

This card replaces the reference's six field lead form. One field, and it is the first step of
logging in rather than a form that goes nowhere.

- [ ] **Step 2: Write the dark section**

Create `src/pages/Landing/sections/WhySubscribe.tsx`: a `Section` with `bg={GL.dark}` and
`py={{ xs: 6, md: 9 }}`.

Inside, a grid `gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" }`, `gap: { xs: 5, lg: 8 }`.

Left column: a `DarkHeading` reading `Why should you subscribe to AI Pulse?`, then a grid of the four
`VALUE_PROPS`, `gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }`, `columnGap: 5`, `rowGap: 4.5`,
`marginTop: 5`. Each item is a `Stack` with `gap: 2`: an `<IconTile Icon={p.Icon} dark />`, then the
title at 18px weight 600 in white, then the body at 15px `lineHeight: 1.6` in `GL.darkBody`.

No card backgrounds, no fills, no shadows on the items. Just the tile, the title and the text.

Right column: on `lg` and up, render `<TrialRailCard />` inside a `Box` with
`position: sticky, top: 96, alignSelf: start`. Below `lg` render nothing here; the card is rendered
once at the end of the modules section instead so phones still get it.

- [ ] **Step 3: Mount it**

Render `<WhySubscribe />` after `<RatingsRow />`.

- [ ] **Step 4: Check the sticky behaviour**

Scroll the page. The card should stay pinned as the dark section passes behind it, and it should
overlap the boundary into the next white section the way the reference form does.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Landing/sections/WhySubscribe.tsx src/pages/Landing/sections/TrialRailCard.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): why subscribe section and the sticky trial card"
```

---

## Task 13: The module accordion

The centrepiece. Real product data, which is why the page can be short.

**Files:**
- Create: `src/pages/Landing/sections/ModulesSection.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the section**

Create `src/pages/Landing/sections/ModulesSection.tsx`.

Data, computed once with `useMemo`:

```tsx
const { visible, hidden, total } = useMemo(
  () => selectLandingModules(issuesData as PulseIssue[]),
  [],
);
const [expanded, setExpanded] = useState<string | null>(null);
const [showAll, setShowAll] = useState(false);
const rows = showAll ? [...visible, ...hidden] : visible;
```

Layout: a `Section` on white, `py: { xs: 6, md: 9 }`.

1. A centred `SectionHeading` reading `What is inside AI Pulse?`.
2. A centred `Lede`, `marginTop: 2`: `` `${total} modules are live right now. A new one lands every two weeks.` ``
3. The accordion, `marginTop: 4`, `maxWidth: 900`, `marginX: auto`, a `Stack` with `gap: 1.25`.

Each row is a `Box` with `border: 1px solid GL.border`, `borderRadius: "8px"`,
`backgroundColor: #ffffff`, `boxShadow: "0 1px 2px rgba(16,24,40,0.04)"`, `overflow: hidden`.

Row header: a `<Box component="button">` filling the width, `display: flex`, `alignItems: center`,
`justifyContent: space-between`, `gap: 2`, `padding: "20px 22px"`, `background: none`, `border: none`,
`cursor: pointer`, `textAlign: left`, `fontFamily: inherit`. Toggles `expanded` to the issue id or
`null`. Set `aria-expanded` and `aria-controls`.

Header content: the title at 16px weight 600 in `GL.heading`, written as
`` `${unit.numbered(issue.issueNumber)}: ${issue.title}` `` using `useUnitLabel()` from
`src/lib/pulse/terminology.ts`, so a row reads `Module 12: The Month Claude Became a Platform` and
matches what the lead sees after logging in.

Header control: a 32px circle, `borderRadius: "999px"`, `backgroundColor: "#F2F4F7"`,
`color: GL.heading`, holding a lucide `Plus` at `size={16}`, swapped for `Minus` when that row is
open. Grey, not blue. Flex shrink 0.

Row body, rendered only when open, `padding: "0 22px 22px"`:

- The `description` at 15px `lineHeight: 1.65` in `GL.body`.
- `<CheckList items={issue.outcomes} dense />` with `marginTop: 2.5`.
- A meta line at 14px in `GL.body`, `marginTop: 2.5`:
  `` `${issue.learningMinutes} min learning · ${issue.handsOnMinutes} min hands-on` ``.
  Skip the hands-on half when `handsOnMinutes` is 0.
- When `issue.toolName` is set, a tools row `marginTop: 2`, `display: flex`, `alignItems: center`,
  `gap: 1.25`: the word `Tool` at 12px uppercase weight 600 with `letterSpacing: 1.2` in `GL.body`,
  then, when `issue.toolLogo` is set, an `<img>` at `height: 22, width: 22, objectFit: contain`, then
  `issue.toolName` at 14px weight 500 in `GL.heading`.

No tinted inner panels. The reference accordion opens into plain body text and lists.

4. Below the accordion, when `hidden.length > 0` and `showAll` is false, a centred text button
   reading `` `View all ${total} modules` `` that sets `showAll` to true. Style it as blue 15px
   weight 600 with no background.

5. Below `lg`, render `<TrialRailCard />` centred with `marginTop: 6`, so phones and tablets still
   get the trial card once. Wrap it in `<Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent: "center", mt: 6 }}>`.

- [ ] **Step 2: Mount it**

Render `<ModulesSection />` after `<WhySubscribe />`.

- [ ] **Step 3: Check it in the browser**

Six rows should show, reading Module 12, 11, 10, 09, 08, 07 by title, newest release first. Opening
one shows its description, its outcomes as blue ticks, the minutes line and the tool. `View all 11
modules` reveals five more.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing/sections/ModulesSection.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): module accordion built from real product data"
```

---

## Task 14: How the trial works

**Files:**
- Create: `src/pages/Landing/sections/TrialSection.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the section**

Create `src/pages/Landing/sections/TrialSection.tsx`: a `Section` with `bg={GL.pale}`.

1. A centred `SectionHeading` reading `How does the free trial work?`.
2. A three column grid, `gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }`, `gap: 5`,
   `marginTop: 5`, `maxWidth: 980`, `marginX: auto`.

Each step, from `TRIAL_STEPS`, is a `Stack` with `gap: 1.25`:
- The numeral, `String(i + 1).padStart(2, "0")`, at 40px weight 600 in `GL.blue`, `lineHeight: 1`.
- The title at 18px weight 600 in `GL.heading`.
- The body at 15px `lineHeight: 1.6` in `GL.body`.

Large numerals, deliberately not another icon card grid. The page already has icon tiles in the dark
section and blue ticks in the accordion; a third icon treatment here would be the repetition the
spec bans.

3. `TRIAL_FOOTNOTE` centred at 15px in `GL.body`, `marginTop: 5`.

- [ ] **Step 2: Mount, check, commit**

```bash
git add src/pages/Landing/sections/TrialSection.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): how the free trial works"
```

---

## Task 15: The PG Program section

**Files:**
- Create: `src/pages/Landing/sections/PgProgramSection.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the section**

Create `src/pages/Landing/sections/PgProgramSection.tsx`: a `Section` with `bg={GL.dark}`.

A grid `gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }`, `gap: { xs: 4, md: 8 }`,
`alignItems: center`.

Left: a `DarkHeading` with `PG_SECTION.title`, then `PG_SECTION.body` at 16px `lineHeight: 1.65` in
`GL.darkBody` with `marginTop: 2.5`, `maxWidth: 560`.

Right: the three `PG_SECTION.points` as a `Stack` with `gap: 2`. Each is a row with a lucide `Check`
at `size={18}` in `GL.blue` and the text at 15px in `#ffffff`. Then, `marginTop: 4`, a contained
`Button` reading `PG_SECTION.cta`, rendered as
`component="a" href={PG_PROGRAM_URL} target="_blank" rel="noopener noreferrer"`. Under it,
`marginTop: 2`, `Speak with our expert` at 14px in `GL.darkBody` followed by `ADVISOR_PHONE` as a
`tel:` link in white weight 600.

- [ ] **Step 2: Mount, check the link opens the real PG page, commit**

```bash
git add src/pages/Landing/sections/PgProgramSection.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): PG Program section for sales-sourced leads"
```

---

## Task 16: FAQ

**Files:**
- Create: `src/pages/Landing/sections/FaqSection.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the section**

Create `src/pages/Landing/sections/FaqSection.tsx`: a `Section` on white.

A centred `SectionHeading` reading `Frequently asked questions`, then the same accordion row styling
as Task 13, `maxWidth: 900`, `marginX: auto`, `marginTop: 4`, `gap: 1.25`.

Row header holds the question at 16px weight 600 in `GL.heading` and the same grey circular
`Plus` / `Minus` control. Row body holds the answer at 15px `lineHeight: 1.65` in `GL.body`, padded
`0 22px 22px`.

Keep one row open at a time, with local `useState<number | null>`.

Do not extract a shared accordion component for two callers with different content shapes. Two
small, readable implementations beat one component with a `variant` prop.

- [ ] **Step 2: Mount, check, commit**

```bash
git add src/pages/Landing/sections/FaqSection.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): FAQ accordion"
```

---

## Task 17: Footer

**Files:**
- Create: `src/pages/Landing/sections/LandingFooter.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the footer**

Create `src/pages/Landing/sections/LandingFooter.tsx`: a `Section` with `bg={GL.dark}` and
`py={{ xs: 6, md: 7 }}`.

The `gl-logo.svg` will not read on a dark background, so use the text `Great Learning` at 18px weight
600 in white instead, and note why in a comment.

Below it, `marginTop: 4`, a grid of `FOOTER_COLUMNS`, `gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }`,
`gap: 4`. Each column: the heading at 14px weight 600 in white, then the links at 14px in
`GL.darkBody`, `lineHeight: 2`, `cursor: default` since none of them go anywhere in a prototype.

Then a `Divider` with `borderColor: GL.darkBorder`, `marginTop: 5`, and a final row at 13px in
`GL.darkBody`: `© 2026 Great Learning. All rights reserved.` on the left and
`hello@mygreatlearning.com · ${ADVISOR_PHONE}` on the right, stacking on phones.

- [ ] **Step 2: Mount, check, commit**

```bash
git add src/pages/Landing/sections/LandingFooter.tsx src/pages/Landing/AiPulseLanding.tsx
git commit -m "feat(landing): footer"
```

---

## Task 18: Sticky bottom CTA bar

**Files:**
- Create: `src/pages/Landing/sections/StickyCtaBar.tsx`
- Modify: `src/pages/Landing/AiPulseLanding.tsx`

- [ ] **Step 1: Write the bar**

Create `src/pages/Landing/sections/StickyCtaBar.tsx`.

Visibility is driven by scroll position, not by an `IntersectionObserver` on the hero, because the
hero height differs per breakpoint and a plain threshold is easier to reason about:

```tsx
const [show, setShow] = useState(false);

useEffect(() => {
  const onScroll = () => setShow(window.scrollY > 600);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

Render a `Box` with `position: fixed`, `left: 0, right: 0, bottom: 0`, `zIndex: 30`,
`backgroundColor: #ffffff`, `borderTop: 1px solid GL.border`,
`boxShadow: "0 -4px 20px rgba(16,24,40,0.08)"`, `paddingY: 1.5`, and
`transform: show ? "translateY(0)" : "translateY(110%)"` with
`transition: "transform 220ms ease"`. Keep it mounted and slide it, so it does not pop.

Inside, the `GL.maxWidth` column, `display: flex`, `alignItems: center`,
`justifyContent: space-between`, `gap: 2`.

Left: `STICKY_BAR.name` at 17px weight 600 in `GL.heading`, and `STICKY_BAR.meta` at 13px in
`GL.body` beneath. Hide the left block below `sm` so the buttons keep their width.

Right: an outlined `Log In` button and a contained `Start Free Trial` button, both `minHeight: 44`,
`padding: "10px 20px"`, `fontSize: 15`, both routing to `/ai-pulse/login`. On phones show only the
contained button, full width.

- [ ] **Step 2: Mount it last inside the page shell, after the footer.**

- [ ] **Step 3: Check that it slides in after the hero and does not cover the footer content.**

Add `paddingBottom: { xs: 10, sm: 11 }` to the footer so the fixed bar never sits on top of the
copyright line.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing/sections/StickyCtaBar.tsx src/pages/Landing/AiPulseLanding.tsx src/pages/Landing/sections/LandingFooter.tsx
git commit -m "feat(landing): sticky bottom CTA bar"
```

---

## Task 19: The login step

**Files:**
- Create: `src/pages/Landing/AiPulseLogin.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the page**

Create `src/pages/Landing/AiPulseLogin.tsx`.

Wrap in the same `ThemeProvider theme={landingTheme}`. A full height `Box`,
`minHeight: 100vh`, `backgroundColor: GL.pale`, `display: flex`, `alignItems: center`,
`justifyContent: center`, `padding: 2`.

A card, `maxWidth: 440`, `width: 100%`, `backgroundColor: #ffffff`, `border: 1px solid GL.border`,
`borderRadius: "8px"`, `boxShadow: "0 4px 24px rgba(16,24,40,0.08)"`, `padding: { xs: 3, md: 4.5 }`.

Contents:
1. `gl-logo.svg` at `height: 30`, `display: block`, `marginX: auto`.
2. `Log in to start your free trial` at 20px weight 600 centred in `GL.heading`, `marginTop: 3`.
3. `` `${TRIAL_DAYS} days of full access. No credit card.` `` at 14px centred in `GL.body`,
   `marginTop: 1`.
4. A full width email `TextField`, `marginTop: 3`, seeded from the `email` query parameter:

```tsx
const [params] = useSearchParams();
const [email, setEmail] = useState(() => params.get("email") ?? "");
```

5. A full width contained `Continue` button, `marginTop: 2`, disabled while `email.trim()` is empty.
6. The consent line at 11px centred in `GL.body`, `marginTop: 2`.

There is no password field. This is a prototype shim with no authentication, and nothing is sent
anywhere. Say so in a comment at the top of the file.

Submit handler:

```tsx
const navigate = useNavigate();
const { runWithPageLoader } = usePageLoader();
const { startTrial } = usePricing();

const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!email.trim()) return;
  const first = selectLandingModules(issuesData as PulseIssue[]).visible[0];
  runWithPageLoader(() => {
    startTrial();
    const itemId = first ? getDefaultItemId(first.id, false) : "";
    const itemPath = itemId ? `/items/${itemId}` : "";
    navigate(`/pulse/modules/${first?.id ?? ""}${itemPath}?trial=started`);
  }, 950);
};
```

Wrap the field and the button in a `<form onSubmit={onSubmit}>` so Enter works.

This is the same destination the existing `Start Free Trial` button in `PulseV2Hero` uses, so both
paths behave identically. `startTrial()` sets `trialStartedAt`, which is what stops `PulseHome`
redirecting a fresh trial user into the `/pulse/intro` carousel.

- [ ] **Step 2: Add the route**

In `src/App.tsx`, add the lazy import beside the landing one:

```tsx
const AiPulseLogin = lazy(() => import("./pages/Landing/AiPulseLogin"));
```

and the route directly after `/ai-pulse`:

```tsx
      {
        path: "/ai-pulse/login",
        element: (
          <Suspense fallback={null}>
            <AiPulseLogin />
          </Suspense>
        ),
      },
```

Make sure `AiPulseLogin.tsx` has both a named and a default export, matching `AiPulseLanding.tsx`.

- [ ] **Step 3: Walk the whole journey**

From `http://localhost:5173/ai-pulse`: type an email into the rail card, press Start Free Trial,
confirm the login page opens with the email already filled, press Continue, and confirm you land on
a module player inside `/pulse` with the product theme back and the trial running.

Then open `/pulse` directly and confirm the hero now reads `Free for 14 days`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing/AiPulseLogin.tsx src/App.tsx
git commit -m "feat(landing): login step that starts the 14 day trial"
```

---

## Task 20: Responsive pass and verification

**Files:**
- Modify: whichever section files need breakpoint fixes.

- [ ] **Step 1: Check three widths**

Run the app and look at `/ai-pulse` at 1440px, 768px and 390px. Specifically confirm:

- The hero photograph drops below the copy, or hides, rather than squashing.
- The stat strip becomes two by two on phones.
- The rail card is absent from the dark section below `lg` and appears once under the accordion.
- The sticky bottom bar shows only the contained button on phones and does not cover the footer.
- The nav collapses to the logo and the LOGIN button below `md`.
- Nothing scrolls horizontally at 390px.

- [ ] **Step 2: Run the full test suite**

```bash
npm test
```

Expected: every test passes, including the new `trial.test.ts` and `landingModules.test.ts`.

- [ ] **Step 3: Run the production build**

```bash
npm run build
```

Expected: `tsc -b` clean, `vite build` succeeds, `build-emails.mjs` regenerates the gallery. Confirm
the landing page is a separate chunk:

```bash
ls dist/assets/ | grep -i "AiPulse"
```

Expected: at least one `AiPulseLanding-*.js` chunk, proving the lazy split worked and product users
do not download Poppins.

- [ ] **Step 4: Grep for the banned patterns**

```bash
grep -rn "borderLeft\|borderTop\|backdropFilter\|linear-gradient\|WebkitBackdropFilter" src/pages/Landing/
```

Expected: only the `borderTop` on the sticky bar, which is a full width hairline separating the bar
from the page, not a coloured accent stripe on a card. Anything else is a spec violation and must go.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A src/pages/Landing/
git commit -m "fix(landing): responsive pass at 1440, 768 and 390"
```

---

## Definition of done

- `/ai-pulse` renders eleven bands in the Great Learning marketing skin, and none of them contain
  invented facts.
- `/ai-pulse/login` starts a 14 day trial and lands the user on a real module.
- `/pulse` is visually unchanged apart from the trial length copy.
- `npm test` and `npm run build` both pass, with output quoted rather than assumed.
- The branch `feat/ai-pulse-landing` is ready for review. Nothing has been pushed.

## Known follow-ups, deliberately not in this plan

- Module numbering still disagrees between the emails (01 to 04) and the product (`issueNumber`).
  The landing page follows the product. The emails are untouched.
- The four review scores are copied from the live reference pages and need confirming.
- The advisor phone number is the one printed on the reference pages and needs confirming.
