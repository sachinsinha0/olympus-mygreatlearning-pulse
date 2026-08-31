import { Briefcase, Clock, Library, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TRIAL_DAYS } from "../../lib/pulse/trial";

export const ADVISOR_PHONE = "+91 797-117-1332";
export const PG_PROGRAM_URL =
  "https://www.mygreatlearning.com/pg-program-online-artificial-intelligence-machine-learning";

/**
 * The hero says what the product says.
 *
 * `tagline` and `title` are lifted from the onboarding carousel and the /pulse hero
 * rather than written fresh, so a lead who reads this page and then logs in hears the
 * same voice on both sides of the login step. See PulseIntroPage and PulseV2Hero.
 */
export const HERO = {
  tagline: "Your AI learning companion",
  /**
   * Broken deliberately, the way the product's own hero breaks it. Left to wrap on its
   * own at this width the second line was the single word "sync.".
   */
  titleLines: ["AI moves fast.", "Pulse keeps you in sync."],
  body: "Learn one cutting-edge AI tool or innovation, every two weeks. Up to 60 minutes each. Short enough to fit your schedule, deep enough to apply at work immediately.",
  primaryCta: "Start Free Trial",
  /**
   * Sits beside the CTA, where the reference template prints its application deadline.
   * This slot used to repeat the release cadence, which the body paragraph and the stat
   * strip both already carry. Verbatim from PulseV2Hero.
   */
  reassurance: `Free for ${TRIAL_DAYS} days · No credit card required`,
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

/**
 * The first three are the product's own pillars, verbatim from PulseV2Hero, which the
 * pricing dialog repeats. A lead should hear the same three reasons here that they will
 * hear inside the product.
 *
 * The fourth is the compounding archive argument from docs/great-learning-pulse-brief.md.
 * The product does not state it anywhere in the UI, but it is the strongest reason to
 * keep a subscription rather than dip in once, which is exactly what this page is for.
 *
 * The pillar body reads "30 to 60 minutes" where the product writes "30-60". Ranges
 * spelled out read more easily than dashed ones.
 */
export const VALUE_PROPS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Sparkles,
    title: "Stay ahead of the AI curve",
    body: "New AI tools and innovations every two weeks.",
  },
  {
    Icon: Clock,
    title: "Bite-sized modules",
    body: "30 to 60 minutes, designed to fit your schedule.",
  },
  {
    Icon: Briefcase,
    title: "Use it at work",
    body: "Apply what you learn at work immediately.",
  },
  {
    Icon: Library,
    title: "The archive keeps growing",
    body: "Every release joins the back catalogue. Your subscription is worth more in month twelve than in month one.",
  },
];

/**
 * The AI labs the modules cover, and the assets are already in public/brand-logos/.
 * This is the same list the onboarding carousel scrolls past on its third slide.
 */
export const AI_LABS: { slug: string; label: string }[] = [
  { slug: "openai", label: "OpenAI" },
  { slug: "anthropic", label: "Anthropic" },
  { slug: "google", label: "Google" },
  { slug: "claude", label: "Claude" },
  { slug: "googlegemini", label: "Gemini" },
  { slug: "perplexity", label: "Perplexity" },
  { slug: "cursor", label: "Cursor" },
  { slug: "githubcopilot", label: "GitHub Copilot" },
  { slug: "huggingface", label: "Hugging Face" },
  { slug: "v0", label: "v0" },
];

export const LABS_SECTION = {
  title: "Hands-on with what is new from the AI labs",
  body: "Hands-on modules on what is new from OpenAI, Anthropic, Google and other important AI labs, so you can stay current with minimal effort.",
} as const;

/**
 * The topics the modules cover.
 *
 * Copied from TECH_ROWS in PulseIntroPage, which carries a comment explaining that the
 * list is deliberately concept-level rather than tool-specific so it never goes stale.
 * That property is exactly what a landing page needs, so the list is reused as it is.
 */
export const TOPICS: string[] = [
  "LLMs",
  "AI Agents",
  "Multimodal",
  "AI Automation",
  "Prompt Engineering",
  "AI Coding",
  "RAG",
  "MCP",
  "Tool Use",
  "Computer Use",
  "Reasoning Models",
  "Voice AI",
  "Image Generation",
  "Data Analysis",
  "Evals",
  "Guardrails",
  "Enterprise AI",
  "AI Research",
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
