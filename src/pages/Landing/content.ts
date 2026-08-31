import { Briefcase, Layers, Library, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TRIAL_DAYS } from "../../lib/pulse/trial";

export const ADVISOR_PHONE = "+91 797-117-1332";
/**
 * The same number with the spacing stripped.
 *
 * A `tel:` URI may not contain a literal space (RFC 3966). Most browsers recover,
 * but some mobile dialers truncate at the space and would dial a wrong number. Use
 * this for the href and ADVISOR_PHONE for the visible text.
 */
export const ADVISOR_PHONE_HREF = `tel:${ADVISOR_PHONE.replace(/[^+\d]/g, "")}`;
export const PG_PROGRAM_URL =
  "https://www.mygreatlearning.com/pg-program-online-artificial-intelligence-machine-learning";

export const HERO = {
  tagline: "Stay current with AI without falling behind.",
  title: "AI Pulse: new AI tools every two weeks",
  body: "Learn one new AI tool every two weeks. Each module takes under an hour. Use what you learn at work the same day.",
  primaryCta: "Start Free Trial",
  cadence: "New module every two weeks.",
} as const;

/**
 * Three of the four cells in the hero stat strip. The fourth is the live module
 * count, appended in LandingHero because it is computed from the real data.
 */
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
    a: "Under 60 minutes. Around 35 minutes of learning, then 14 to 20 minutes hands-on.",
  },
  {
    q: "How does this relate to the PG Program?",
    a: "Pulse keeps you current on what is new. The PG Program builds the full skill set. It adds live mentoring and career support. Many learners do both.",
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
  primaryCta: "Start Free Trial",
} as const;

export const FOOTER_COLUMNS: { heading: string; links: string[] }[] = [
  { heading: "Browse Courses", links: ["Data Science", "Artificial Intelligence", "Generative AI", "Software Engineering", "Cloud Computing"] },
  { heading: "Degrees", links: ["Online MBA", "Masters Programs", "Doctorate", "PG Programs"] },
  { heading: "Quick Links", links: ["About Us", "Careers", "Contact Us", "Grievance Redressal", "Privacy Policy"] },
  { heading: "Great Learning", links: ["Blog", "Academy", "Enterprise", "For Recruiters", "Success Stories"] },
];
