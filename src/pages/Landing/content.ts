import {
  BarChart3,
  Bot,
  BrainCircuit,
  Briefcase,
  Cloud,
  Clock,
  Compass,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TRIAL_DAYS } from "../../lib/pulse/trial";

export const ADVISOR_PHONE = "+91 797-117-1332";

/**
 * The product banner's reassurance line, and the sticky bar's.
 *
 * One constant because they are one promise. The bar used to abbreviate it to "14
 * days free · No credit card", which is the same fact in a fragment, and two wordings
 * of one promise on one page invites the reader to wonder which is the real offer.
 */
export const TRIAL_REASSURANCE = `Free for ${TRIAL_DAYS} days · No credit card required`;

/**
 * The hero is the product's banner, so every string here is PulseV2Hero's, verbatim:
 * the headline it renders as two lines, the subtitle, the CTA label and the
 * reassurance line. A lead sees this banner here and then sees the same banner after
 * logging in. The product's lockup row is not carried over, the page header already
 * shows the Great Learning logo.
 */
export const HERO = {
  titleLines: ["AI moves fast.", "Pulse keeps you in sync."],
  body: "A biweekly learning module on the new AI tools, innovations, and workflows reshaping work, distilled into 60 minutes of learning that you can actually apply.",
  primaryCta: "Start Free Trial",
  reassurance: TRIAL_REASSURANCE,
} as const;


/**
 * Great Learning's own review scores, copied from the live course landing pages,
 * with the review sites' logos taken from the same pages' CDN into
 * public/rating-logos/. Confirm the scores are current before this page goes in
 * front of a real lead.
 */
export const RATINGS: { score: string; site: string; logo: string }[] = [
  { score: "4.6", site: "Google", logo: "/rating-logos/google-logo.png" },
  { score: "4.89", site: "Course Report", logo: "/rating-logos/course-report.png" },
  { score: "4.94", site: "Switchup", logo: "/rating-logos/switchup.png" },
  { score: "4.7", site: "Career Karma", logo: "/rating-logos/career-karma.png" },
];

/**
 * The product's three pillars, verbatim from PILLARS in PulseV2Hero, which
 * PricingModal repeats as its feature list.
 *
 * Copied exactly, including the en dash in "30–60 minutes", which is how the product
 * writes it. A fourth point
 * about the compounding archive used to sit here. It came from the brief document, not
 * from the product, so it is gone.
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
    body: "30–60 minutes, designed to fit your schedule.",
  },
  {
    Icon: Briefcase,
    title: "Use it at work",
    body: "Apply what you learn at work immediately.",
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

/**
 * The product's three slide onboarding pitch, from PulseIntroPage, verbatim. A lead
 * never sees the intro carousel, so the landing page tells the same story in the
 * same words: what it is, how often it lands, what is inside.
 *
 * Two deliberate differences from the slides. Beat three says "stay updated" where
 * the slide says "stay current", the spoken register fix Sachin asked for. And the
 * slide's second title line, "The only learning companion you need", is left out
 * because beat one already calls Pulse your learning companion, and one section
 * saying it twice reads like a tic. Flagged rather than hidden.
 */
export const INTRO_PITCH = {
  welcome: {
    title: "Your AI learning companion",
    /**
     * The logo row needs announcing. On the slide it is ambient branding behind an
     * animated title; on a static page ten unlabelled marks are a claim nobody made.
     * This is the only line in this section that is not the product's.
     */
    labsLabel: "The labs we follow",
    body: "Learn new AI tools and how you can use them at work.",
  },
  release: {
    label: "Release",
    title: "Learn one cutting-edge AI tool or innovation, every two weeks",
    body: "Up to 60 minutes each. Short enough to fit your schedule, deep enough to apply at work immediately.",
    /** The two stat cards the slide renders, caption above the number, verbatim. */
    stats: [
      { caption: "every 2 weeks", number: "1", unit: "new module" },
      { caption: "annually", number: "26", unit: "modules" },
    ],
  },
  inside: {
    label: "What's inside",
    title: "Hands-on with real examples",
    body: "Hands-on modules on what's new from OpenAI, Anthropic, Google and other important AI labs, so you can stay updated with minimal effort.",
  },
} as const;

/**
 * The topics the modules cover, in the product's own two rows.
 *
 * Copied from TECH_ROWS in PulseIntroPage, whose comment explains the vocabulary: it
 * is deliberately concept level rather than tool specific, so it never goes stale and
 * needs no upkeep. The split into two is the slide's, which scrolls them as
 * alternating-direction marquees. The landing page renders them as one still cluster
 * and so flattens them, but the shape is kept here to stay one edit from the source.
 */
export const TOPIC_ROWS: readonly (readonly string[])[] = [
  ["LLMs", "AI Agents", "Multimodal", "AI Automation", "AI Research", "Prompt Engineering", "AI Coding", "RAG", "MCP"],
  ["Tool Use", "Computer Use", "Reasoning Models", "Voice AI", "Image Generation", "Data Analysis", "Evals", "Guardrails", "Enterprise AI"],
];

/**
 * The module list's heading.
 *
 * It used to ask "What is inside AI Pulse?", directly under a beat the product heads
 * "What's inside". The reader met the same question twice and had no way to tell the
 * two sections apart. The difference is topics against modules, so the heading names
 * modules and lets the real titles below it do the selling.
 */
export const MODULES_HEADING = "Here are the modules";

/**
 * The row that closes the module list.
 *
 * The list shows what is already there, so the last thing the reader sees should be
 * what is not there yet. Without it the curriculum looks like a closed set
 * rather than something that keeps arriving.
 */
export const MODULES_NEXT = {
  title: "A new module every two weeks",
  body: "The list keeps growing after you join.",
};

/**
 * The cross sell.
 *
 * Our story on the left, Great Learning's own categories on the right. It used to be
 * one featured programme card, which was a dead end for a lead who wants data science
 * or management, and it read as though Great Learning ran a single course.
 *
 * The categories are the homepage's "Know more about" tiles, with its names and the
 * real domain paths from its navigation. Its programme counts are not shown: they
 * date, and a lead choosing a field does not pick it by how many courses are in it.
 *
 * Ordered by how close each one sits to what the reader has just been reading about,
 * so the AI categories come first and the broader ones follow.
 *
 * The heading is a statement, not a question. Great Learning's headings are
 * imperatives and noun phrases, and "Ready to go deeper than two weeks at a time?"
 * asked the reader to answer something before it told them anything.
 */
export const PG_SECTION = {
  eyebrow: "Programs",
  title: "Go further with a full program",
  body: "Pulse keeps you updated on what is new. A Great Learning program builds the whole skill set, with university faculty behind it.",
  cta: "Explore Programs",
  categories: [
    { Icon: BrainCircuit, name: "AI & Machine Learning", path: "/artificial-intelligence/courses" },
    { Icon: Sparkles, name: "Generative AI", path: "/gen-ai/courses" },
    { Icon: Bot, name: "Agentic AI", path: "/agentic-ai/courses" },
    { Icon: BarChart3, name: "Data Science & Analytics", path: "/data-science/courses" },
    { Icon: Cloud, name: "Cloud Computing", path: "/cloud-computing/courses" },
    { Icon: Briefcase, name: "Management", path: "/management/courses" },
    { Icon: Compass, name: "Leadership Programs", path: "/executive-leadership/courses" },
    { Icon: GraduationCap, name: "Masters", path: "/degrees/masters-courses" },
  ],
} as const;

/** Everything the cross sell links to lives on the marketing site. */
export const GL_SITE = "https://www.mygreatlearning.com";

/**
 * Ordered by when the reader worries, not by what we want to say. Time is always the
 * first objection. Two entries were missing: whether you need to code, which was
 * buried inside the who-is-it-for answer, and how this differs from free videos and
 * newsletters, which every reader wonders and the page never asked.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "How much time does a module take?",
    a: "Under an hour. Around 35 minutes of learning, then 14 to 20 minutes building something with the tool.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. The modules assume you use AI at work, not that you build it. Where a module involves code, you are shown what to run and why.",
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
    q: "How is this different from free videos and newsletters?",
    a: "Someone here uses the tool on real work first, so the hour you spend is on something that held up. A newsletter tells you what shipped. A module shows you how to use it and has you build something.",
  },
  {
    q: "Who is it for?",
    a: "Working professionals who want to keep up with AI without taking time off to do it.",
  },
  {
    q: "How does this relate to the PG Program?",
    a: "Pulse keeps you updated on what's new. The PG Program builds the full skill set. It adds live mentoring and career support. Many learners do both.",
  },
];

/**
 * The sign up dialog behind every Start Free Trial button.
 */
export const TRIAL_DIALOG = {
  title: "Start your free trial",
  body: `${TRIAL_DAYS} days of full access. No credit card.`,
  google: "Continue with Google",
} as const;

/**
 * The two strings the login step needs.
 *
 * They are the remains of the rail card, which is gone: the sticky bottom bar already
 * carries the call to action past every section, so a second one floating beside the
 * module list was the same button twice on one screen.
 */
export const TRIAL_FORM = {
  placeholder: "Enter your email",
  consent: "By continuing you agree to our Terms of Use and Privacy Policy.",
} as const;

export const STICKY_BAR = {
  name: "AI Pulse",
  meta: TRIAL_REASSURANCE,
  primaryCta: "Start Free Trial",
} as const;

/**
 * The Great Learning site footer, copied from the live one.
 *
 * The link lists are the real site's, not this page's. A prototype footer that
 * invented its own navigation would be the one part of the page a Great Learning
 * reader could tell was fake at a glance.
 */
export const FOOTER_COLUMNS: { heading: string; links: string[] }[] = [
  {
    heading: "Trending Programs",
    links: [
      "UT Austin: PG Program in Data Science with Gen AI",
      "UT Austin: PG Program in Artificial Intelligence and Machine Learning",
      "UT Austin: PG Program in Artificial Intelligence for Leaders",
      "MIT: Applied AI and Data Science Program",
      "MIT IDSS Data Science and Machine Learning Course",
      "IITB (ePGD) in Artificial Intelligence and Data Science",
      "IITB Supply Chain Analytics with AI and ML",
      "Great Lakes: PG Diploma in Management (Online)",
    ],
  },
  {
    heading: "Browse Courses",
    links: [
      "Data Science Courses",
      "Artificial Intelligence Courses",
      "Generative AI",
      "Software Engineering Courses",
      "Cloud Computing Courses",
      "Design Courses",
      "Cyber Security Courses",
      "Management Courses",
      "Post Graduate (PG) Certificate Courses",
    ],
  },
  {
    heading: "Degrees",
    links: ["MBA Courses", "Masters Courses"],
  },
  {
    heading: "Quick Links",
    links: [
      "About Us",
      "Transparency Hub",
      "Careers at Great Learning",
      "Grievance Redressal",
      "Contact Us",
    ],
  },
];

/** The contact block in the footer's right column, in the live site's own grouping. */
export const FOOTER_CONTACT: { label: string; rows: { kind: "mail" | "phone"; value: string }[] }[] = [
  {
    label: "India :",
    rows: [
      { kind: "mail", value: "info@greatlearning.in" },
      { kind: "phone", value: "080 6947 4555" },
    ],
  },
  {
    label: "US and Other countries :",
    rows: [
      { kind: "mail", value: "info@mygreatlearning.com" },
      { kind: "phone", value: "+1 512 647 2647" },
    ],
  },
  {
    label: "For Enterprise queries:",
    rows: [{ kind: "mail", value: "business@greatlearning.in" }],
  },
];
