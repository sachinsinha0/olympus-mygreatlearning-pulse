export type TopicTag =
  | "agents"
  | "rag"
  | "evals"
  | "prompting"
  | "multimodal"
  | "code-gen"
  | "reasoning"
  | "mcp"
  | "safety"
  | "ops"
  | "foundations";

export type CoverColor =
  | "primary"
  | "teal"
  | "deepPurple"
  | "warning"
  | "rose"
  | "lightBlue"
  | "lightGreen"
  | "amber"
  | "indigo"
  | "orange";

export type Author = {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
  linkedInUrl?: string;
};

export type CurriculumItem =
  | { type: "segment"; title: string; duration: number }
  | { type: "tyu"; title: string; questions: number }
  | { type: "demo"; title: string; duration: number }
  | { type: "discussion"; title: string };

export type IssueStats = {
  completionCount: number;
  ratingCount: number;
  ratingAvg: number;
  weeklyReaders: number;
  topDiscussionQuote: { quote: string; author: string } | null;
};

export type PulseIssue = {
  id: string;
  issueNumber: number;
  title: string;
  description: string;
  releasedAt: string;
  durationMinutes: number;
  tags: TopicTag[];
  isFoundations: boolean;
  coverColor: CoverColor;
  coverImageUrl?: string;
  author: Author;
  outcomes: string[];
  curriculum: CurriculumItem[];
  stats: IssueStats;
  courseUrl: string;
  consumed?: boolean;
  progress?: number;
};

export const TAG_LABELS: Record<TopicTag, string> = {
  agents: "Agents",
  rag: "RAG",
  evals: "Evals",
  prompting: "Prompting",
  multimodal: "Multi-modal",
  "code-gen": "Code-gen",
  reasoning: "Reasoning",
  mcp: "MCP",
  safety: "Safety",
  ops: "Ops",
  foundations: "Foundations",
};

export const FILTER_TAGS: TopicTag[] = [
  "agents",
  "code-gen",
  "reasoning",
  "mcp",
  "rag",
  "evals",
  "multimodal",
  "ops",
];
