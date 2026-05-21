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
  toolName?: string;
  toolLogo?: string | null;
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

export type CourseItemType = "video" | "tyu" | "reading";

export type OverviewTopic = {
  title: string;
  description: string;
};

export type VideoTopic = {
  time: string;
  title: string;
  body?: string;
};

export type CourseItem =
  | {
      id: string;
      type: "video";
      title: string;
      duration?: string;
      body?: string;
      poster?: string;
      summary?: string;
      topics?: VideoTopic[];
    }
  | {
      id: string;
      type: "tyu";
      title: string;
      size?: string;
      questions?: number;
      body?: string;
      quizType?: string;
      totalMarks?: number;
      timeLimit?: string;
      instructions?: string;
    }
  | { id: string; type: "reading"; title: string; body?: string }
  | {
      id: string;
      type: "overview";
      title: string;
      moduleLabel: string;
      moduleTitle: string;
      summary: string;
      description: string;
      objectives: string[];
      topics: OverviewTopic[];
      prerequisites: string;
      estimatedMinutes?: number;
    };

export type CourseSection = {
  id: string;
  moduleId?: string;
  label: string;
  videosCount: number;
  resourcesCount: number;
  progress: number;
  expandedDefault?: boolean;
  items?: CourseItem[];
};

export type CourseDetail = {
  videosCompleted: number;
  videosTotal: number;
  resourcesViewed: number;
  resourcesTotal: number;
  progress: number;
  resume: {
    sectionId: string;
    itemId: string;
    title: string;
    timeLeft: string;
  };
  sections: CourseSection[];
};
