/**
 * Mock data for the standalone Interview Report prototype (route: /sublime).
 * Mirrors the Figma "skill-user-attempts" frame content.
 */

export interface SkillPoint {
  positive: boolean;
  text: string;
}

export interface SkillRating {
  icon: "communication" | "presentation" | "handshake" | "work" | "idea" | "book";
  title: string;
  rating: "Good" | "Average" | "Below Average" | "Excellent";
  points: SkillPoint[];
}

export const report = {
  candidate: {
    name: "Abhijeet Singh",
    email: "abhijeet.singh@gmail.com",
  },
  title: "Data Scientist Round 1 Interview",
  role: "Senior Data Scientist",
  date: "Nov 15, 2025, 3:10 PM",
  summary:
    "The candidate communicates clearly with strong presentation skills, though minor grammatical issues and limited depth in transitions are noted. They show good job intent and learnability, with a genuine interest in growth. Problem-solving is above average but could benefit from more detailed examples. Overall scores range from Below Average to Good, indicating solid performance with scope for improvement in clarity and detail.",
} as const;

export interface Score {
  key: "transcribe" | "voice";
  label: string;
  /** null = not yet generated (e.g. voice analysis not triggered). */
  value: number | null;
  max: number;
  icon: "transcribe" | "voice";
}

export const scores: Score[] = [
  { key: "transcribe", label: "Transcribe Score", value: 92, max: 100, icon: "transcribe" },
  { key: "voice", label: "Voice Score", value: 88, max: 100, icon: "voice" },
];

export interface QuestionRating {
  question: string;
  rating: SkillRating["rating"];
  answer: string;
}

export const questionRatings: QuestionRating[] = [
  {
    question: "Walk me through a recent data science project you're proud of.",
    rating: "Good",
    answer:
      "Described an end-to-end churn model with clear framing of the business problem, though impact metrics were kept fairly high-level.",
  },
  {
    question: "How do you decide which evaluation metric to optimise for?",
    rating: "Good",
    answer:
      "Correctly tied metric choice to the cost of false positives vs. false negatives and gave a relevant precision/recall example.",
  },
  {
    question: "Tell me about a time you disagreed with a stakeholder.",
    rating: "Average",
    answer:
      "Showed willingness to align on goals, but the resolution felt generic and lacked a concrete outcome.",
  },
  {
    question: "Why do you want to join this team specifically?",
    rating: "Below Average",
    answer:
      "Expressed genuine interest in the domain but did not reference specific teams, products, or problems to work on.",
  },
];

export const skillRatings: SkillRating[] = [
  {
    icon: "communication",
    title: "Communication",
    rating: "Good",
    points: [
      { positive: true, text: "Delivered a fluent and grammatically correct response." },
      { positive: true, text: "Articulated thoughts clearly, making it easy to understand the candidate's interest in the trend." },
      {
        positive: false,
        text: "The impact could be further enhanced by adding a personal example or connecting the trend more directly to the role or company.",
      },
    ],
  },
  {
    icon: "presentation",
    title: "Presentation Skills",
    rating: "Good",
    points: [
      { positive: true, text: "Delivered a well-structured and engaging introduction." },
      { positive: true, text: "Highlighted achievements relevant to the role." },
      { positive: true, text: "Maintained a logical flow between experiences and job expectations." },
      {
        positive: false,
        text: "Minor improvement could be made by adding more dynamic examples or data-backed results to enhance persuasiveness.",
      },
    ],
  },
  {
    icon: "handshake",
    title: "Job Intent",
    rating: "Below Average",
    points: [
      { positive: true, text: "Expressed genuine interest in the domain and long-term growth." },
      { positive: true, text: "Connected personal goals with the company's mission." },
      {
        positive: false,
        text: "Could strengthen intent by referencing specific projects or teams they want to contribute to.",
      },
    ],
  },
  {
    icon: "work",
    title: "Problem Solving",
    rating: "Good",
    points: [
      { positive: true, text: "Broke the problem down into logical, manageable steps." },
      { positive: true, text: "Considered trade-offs before committing to an approach." },
      { positive: false, text: "Would benefit from walking through a concrete worked example end-to-end." },
    ],
  },
  {
    icon: "idea",
    title: "Learnability",
    rating: "Good",
    points: [
      { positive: true, text: "Showed curiosity and openness to feedback during the discussion." },
      { positive: true, text: "Referenced recent self-learning to stay current with the field." },
      { positive: false, text: "Limited depth when transitioning between related concepts." },
    ],
  },
  {
    icon: "book",
    title: "Domain Knowledge",
    rating: "Good",
    points: [
      { positive: true, text: "Demonstrated solid grounding in core data science fundamentals." },
      { positive: true, text: "Used correct terminology when describing modelling choices." },
      { positive: false, text: "Some advanced topics were covered at a surface level only." },
    ],
  },
];
