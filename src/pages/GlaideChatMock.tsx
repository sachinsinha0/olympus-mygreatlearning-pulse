// ─────────────────────────────────────────────────────────────────────────────
// MOCKUP — Program Support pre-chat landing state (design pass).
// Throwaway page at /program_support/chat-mock used to finalise the approach
// before implementing in the real GlaideChat. Self-contained: local state only.
//
// Design intent: Glaide as a calm, present intelligence. An ambient hero with a
// breathing orb anchors the page; a single elevated composer HOSTS the picked
// context as removable chips (project + optional topic) instead of stacked form
// fields. Stays inside the Great Learning M3 token system + Inter for product
// consistency — craft lives in composition, hierarchy, depth and motion.
// ─────────────────────────────────────────────────────────────────────────────
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Plus,
  Hash,
  FolderKanban,
  ListChecks,
  BookOpen,
  Video,
  Search,
  Clock,
  Calendar,
  Scale,
  Bug,
  Lightbulb,
  CreditCard,
  Briefcase,
  MessageSquare,
  MessageCircle,
  Pencil,
  LifeBuoy,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { ChatBubble, TypingIndicator, EASE } from "../components/support/ChatBubble";
import { classifyIntent } from "../lib/classifyIntent";
import data from "../mocks/programSupport.json";

// ── Types ────────────────────────────────────────────────────────────────────
type CategoryKey =
  | "projects" | "quizzes" | "material" | "sessions"
  | "fee" | "olympus" | "career" | "other" | "feedback";

type Item = { course: string; name: string };
type Course = { course: string; items: string[] };
type Msg = {
  role: "bot" | "user";
  text: string;
  context?: string;
  action?: { label: string; tag: string; style: "primary" | "outline" | "ghost" };
};

const glaideResponses = data.glaideResponses as Record<string, string>;
const PREREQ = new Set<CategoryKey>(["projects", "quizzes", "material", "sessions"]);

const CATEGORY_ORDER: CategoryKey[] = [
  "projects", "quizzes", "material", "sessions",
  "fee", "olympus", "career", "other", "feedback",
];

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  projects: "Projects", quizzes: "Quizzes", material: "Learning Material",
  sessions: "Live Sessions", fee: "Fee Enquiries", olympus: "Olympus Issues",
  career: "Career Services", other: "Other Issues", feedback: "Feedback",
};

// Heading shown while the user is still choosing (prereq) or as the sole prompt.
const PICK_HEADING: Record<CategoryKey, string> = {
  projects: "Which project are you stuck on?",
  quizzes: "Which quiz can I help with?",
  material: "Which module do you need?",
  sessions: "Which session is this about?",
  fee: "Let's sort out your fees.",
  olympus: "What's going wrong with Olympus?",
  career: "How can Career Services help?",
  other: "What can I help you with?",
  feedback: "We're listening.",
};

const ITEM_NOUN: Record<string, string> = {
  projects: "project", quizzes: "quiz", material: "module", sessions: "session",
};

const CATEGORY_ICON: Record<string, LucideIcon> = {
  projects: FolderKanban, quizzes: ListChecks, material: BookOpen, sessions: Video,
};

// Optional sub-category options per category (the skippable "+ topic" menu).
const SUBCATEGORIES: Record<CategoryKey, string[]> = {
  projects: ["When will I receive the solution?", "I need further explanation", "I need detailed feedback", "I am facing technical challenges with Olympus", "I need further explanation of the problem statement/dataset", "I want to extend my submission deadline", "Error/stuck with code", "I have a conceptual doubt"],
  quizzes: ["My attempt got locked", "My score looks wrong", "Explain a question", "When do I get the solution?", "Something else"],
  material: ["Can't access the content", "Explain a topic", "Find a resource", "Something else"],
  sessions: ["Get the recording", "Fix my attendance", "Reschedule a session", "Something else"],
  fee: ["Installment not updated", "Payment failed", "Refund status", "Invoice or receipt"],
  olympus: ["Page not loading", "Video not playing", "Login trouble", "Something looks broken"],
  career: ["Resume review", "Mock interview", "Job referrals", "Profile feedback"],
  other: ["Certificate issue", "Account or profile", "Technical glitch", "Something else"],
  feedback: ["Course content", "Mentor or session", "Platform experience", "A suggestion"],
};

// Tinted icon tiles, reusing the app's extended-palette container language.
const TILE_PALETTE = [
  { bg: "#dee0ff", fg: "#00105c" }, // indigo
  { bg: "#cae6ff", fg: "#001e30" }, // lightBlue
  { bg: "#ebddff", fg: "#250059" }, // deepPurple
  { bg: "#a1efff", fg: "#001f25" }, // cyan
  { bg: "#ffdcc0", fg: "#2d1600" }, // orange
];

const projectCourses: Course[] = (data.projectPicker.courses as { course: string; projects: string[] }[]).map(
  (c) => ({ course: c.course, items: c.projects })
);

const PREREQ_DATA: Record<string, { recent: Item[]; courses: Course[] }> = {
  projects: { recent: data.projectPicker.top as Item[], courses: projectCourses },
  quizzes: {
    recent: [
      { course: "Agentic AI Foundations", name: "Introduction to AI Agents" },
      { course: "Agentic AI Foundations", name: "Tools and Memory in Agents" },
      { course: "Advanced Agentic AI Solutions", name: "Securing Agentic AI Solutions" },
    ],
    courses: [
      { course: "Agentic AI Foundations", items: ["Introduction to AI Agents", "Tools and Memory in Agents", "Planning and Reasoning"] },
      { course: "Business Applications with Agentic AI", items: ["Multi-Agent Systems", "Testing and Evaluation"] },
      { course: "Advanced Agentic AI Solutions", items: ["Securing Agentic AI Solutions", "Multimodal Agentic AI"] },
    ],
  },
  material: {
    recent: [
      { course: "Python for Data Science", name: "Basics of Python" },
      { course: "Introduction to Big Data", name: "Hadoop Architecture" },
      { course: "Time Series Forecasting", name: "ARIMA Models" },
    ],
    courses: [
      { course: "Python for Data Science", items: ["Basics of Python", "Clustering", "Pandas Deep Dive"] },
      { course: "Introduction to Big Data", items: ["Hadoop Architecture", "Spark Fundamentals"] },
      { course: "Time Series Forecasting", items: ["ARIMA Models", "Seasonality & Trends"] },
    ],
  },
  sessions: {
    recent: [
      { course: "Advanced Agentic AI Solutions", name: "Multi-Agent Systems" },
      { course: "Advanced Agentic AI Solutions", name: "Securing Agentic AI Solutions" },
      { course: "Agentic AI Foundations", name: "Testing and Evaluation of Agentic Systems" },
    ],
    courses: [
      { course: "Agentic AI Foundations", items: ["Testing and Evaluation of Agentic Systems", "Multimodal Agentic AI"] },
      { course: "Advanced Agentic AI Solutions", items: ["Multi-Agent Systems", "Securing Agentic AI Solutions"] },
    ],
  },
};

// Soft grain overlay — kills the flat-white "AI slop" look at very low opacity.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// ── Page ─────────────────────────────────────────────────────────────────────
export function GlaideChatMock() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [category, setCategory] = useState<CategoryKey>("projects");
  const [phase, setPhase] = useState<"landing" | "thread">("landing");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  // The chosen help-type renders as a chip in the composer; empty = show suggestions.
  const [helpType, setHelpType] = useState<string>("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isPrereq = PREREQ.has(category);
  const needsItem = isPrereq && !selectedItem;
  // A typed question OR a picked help-type chip is enough to send.
  const canSend = (input.trim().length > 0 || helpType.length > 0) && !needsItem && !isTyping;

  const switchCategory = (next: CategoryKey) => {
    setCategory(next);
    setPhase("landing");
    setSelectedItem(null);
    setHelpType("");
    setInput("");
    setMessages([]);
    setIsTyping(false);
  };

  useEffect(() => {
    if (phase === "thread") bottomRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [messages, isTyping, phase, reduce]);

  const computeReply = (text: string): Msg => {
    if (category === "projects" && selectedItem) {
      const intent = classifyIntent(text);
      const reply = intent.response.replace(/\{project\}/g, selectedItem.name);
      const action =
        intent.actionLabel && intent.ticketTag
          ? { label: intent.actionLabel, tag: intent.ticketTag, style: intent.actionStyle ?? "primary" }
          : undefined;
      return { role: "bot", text: reply, ...(action ? { action } : {}) };
    }
    return { role: "bot", text: glaideResponses[category] ?? glaideResponses.fallback };
  };

  // Top-left arrow steps back, mirroring chip removal: help-type → project → Ask.
  const handleBack = () => {
    if (phase === "thread") { navigate("/program_support/ask"); return; }
    if (helpType) { setHelpType(""); return; }
    if (isPrereq && selectedItem) { setSelectedItem(null); return; }
    navigate("/program_support/ask");
  };

  const handleSend = () => {
    const typed = input.trim();
    const text = typed || helpType; // chip alone can be the message
    if (!text || needsItem || isTyping) return;
    const landing = phase === "landing";
    // Project is always context; the help-type is only separate context when the user also typed.
    const ctxParts = [selectedItem?.name, typed && helpType ? helpType : null].filter(Boolean) as string[];
    const context = landing && ctxParts.length ? ctxParts.join("  ·  ") : undefined;
    setMessages((prev) => [...prev, { role: "user", text, ...(context ? { context } : {}) }]);
    const routing = [helpType, typed].filter(Boolean).join(" ") || text;
    setInput("");
    setHelpType("");
    if (landing) setPhase("thread");
    setIsTyping(true);
    const reply = computeReply(routing);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", bgcolor: "background.default", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
      {/* Ambient atmosphere — only behind the landing hero */}
      {phase === "landing" && <Atmosphere reduce={!!reduce} />}

      <TopNav />

      <LayoutGroup>
        <Box sx={{ flex: 1, width: "100%", maxWidth: 760, mx: "auto", px: 2.5, position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          {/* Slim bar: back + quiet dev preview */}
          <Stack direction="row" alignItems="center" sx={{ height: 56, flexShrink: 0 }}>
            <IconButton
              onClick={handleBack}
              aria-label="Back"
              sx={{ ml: -1, color: "text.secondary", "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "text.primary" } }}
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </IconButton>
            {phase === "thread" && (
              <Stack direction="row" alignItems="center" gap={1.25} sx={{ ml: 0.5 }}>
                <GlaideMark size={26} />
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
                  Glaide
                  <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>{` · ${CATEGORY_LABEL[category]}`}</Box>
                </Typography>
              </Stack>
            )}
            <Box sx={{ flex: 1 }} />
            <DevPreview category={category} onPick={switchCategory} />
          </Stack>

          {phase === "landing" ? (
            <LandingState
              category={category}
              isPrereq={isPrereq}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              helpType={helpType}
              setHelpType={setHelpType}
              input={input}
              setInput={setInput}
              onSend={handleSend}
              canSend={canSend}
              isTyping={isTyping}
              reduce={!!reduce}
              inputRef={inputRef}
            />
          ) : (
            <ThreadState messages={messages} isTyping={isTyping} bottomRef={bottomRef} reduce={!!reduce} />
          )}
        </Box>

        {phase === "thread" && (
          <Box sx={{ position: "sticky", bottom: 0, bgcolor: "background.default", zIndex: 5 }}>
            <Box sx={{ maxWidth: 760, mx: "auto", px: 2.5, pt: 1.5, pb: 2.5 }}>
              <Box component={motion.div} layoutId={reduce ? undefined : "composer"}>
                <Composer
                  ref={inputRef}
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  canSend={canSend}
                  disabled={isTyping}
                  reduce={!!reduce}
                  placeholder="Ask Glaide"
                />
              </Box>
              <Typography sx={{ mt: 1.25, textAlign: "center", fontSize: 12, color: "text.secondary" }}>
                Glaide is AI and can make mistakes. Check important info.
              </Typography>
            </Box>
          </Box>
        )}
      </LayoutGroup>
    </Box>
  );
}

// ── Atmosphere ────────────────────────────────────────────────────────────────
function Atmosphere({ reduce }: { reduce: boolean }) {
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <Box
        component={motion.div}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: "absolute", top: -120, left: "50%", width: 900, height: 700, transform: "translateX(-50%)",
          background: (t) => `radial-gradient(closest-side, ${alpha(t.palette.primary.main, 0.12)}, transparent 70%)`,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute", top: 40, right: "12%", width: 420, height: 420,
          background: "radial-gradient(closest-side, rgba(139,0,232,0.07), transparent 70%)",
        }}
      />
      <Box aria-hidden sx={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "180px 180px", opacity: 0.5, mixBlendMode: "multiply" }} />
    </Box>
  );
}

// Glaide logomark on a white disc. The SVG carries its own circular border, so
// the container adds none (avoids a double ring); the mark fills the disc.
function GlaideMark({ size = 48 }: { size?: number }) {
  return (
    <Box sx={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#fff", overflow: "hidden" }}>
      <Box component="img" src={new URL("../assets/ai-mentor-logo.svg", import.meta.url).href} alt="Glaide" sx={{ width: size, height: size, display: "block" }} />
    </Box>
  );
}

function GlaidePresence({ category, heading, compact, back, reduce }: { category: CategoryKey; heading: string; compact?: boolean; back?: { label: string; onClick: () => void }; reduce: boolean }) {
  const wrap = compact ? 54 : 64;
  return (
    <Stack alignItems="center" gap={compact ? 1.5 : 2.5} sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", width: wrap, height: wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Breathing halo */}
        <Box
          component={motion.div}
          aria-hidden
          initial={reduce ? { opacity: 0.6, scale: 1 } : { opacity: 0.5, scale: 0.9 }}
          animate={reduce ? { opacity: 0.6, scale: 1 } : { opacity: [0.45, 0.85, 0.45], scale: [0.95, 1.12, 0.95] }}
          transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          sx={{ position: "absolute", inset: compact ? -9 : -14, borderRadius: "50%", background: (t) => `radial-gradient(closest-side, ${alpha(t.palette.primary.main, 0.28)}, transparent 70%)` }}
        />
        <Box
          component={motion.div}
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          sx={{ position: "relative" }}
        >
          <GlaideMark size={48} />
        </Box>
      </Box>

      <Stack alignItems="center" gap={compact ? 0.75 : 1}>
        {back ? (
          <Box
            component="button"
            type="button"
            onClick={back.onClick}
            sx={{
              appearance: "none", font: "inherit", cursor: "pointer", border: 0, bgcolor: "transparent",
              display: "inline-flex", alignItems: "center", gap: 0.25, maxWidth: 360,
              fontSize: 13, fontWeight: 600, letterSpacing: "-0.1px", color: "text.secondary",
              transition: "color 140ms ease",
              "&:hover": { color: "primary.main" },
            }}
          >
            <ChevronLeft size={16} strokeWidth={2.25} style={{ flexShrink: 0, marginLeft: -4 }} />
            <Box component="span" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{back.label}</Box>
          </Box>
        ) : (
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: "primary.main", opacity: 0.85 }}>
            Glaide · {CATEGORY_LABEL[category]}
          </Typography>
        )}
        <Typography
          component="h1"
          sx={{ fontSize: compact ? { xs: 22, md: 25 } : { xs: 26, md: 32 }, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.8px", color: "text.primary", whiteSpace: { md: "nowrap" }, textWrap: "balance" }}
        >
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
}

// ── Landing ─────────────────────────────────────────────────────────────────
// Composer-first: pick the item (prereq), then land on the input with the
// help-types offered BELOW it as optional, tappable suggestions (Claude/GPT
// style). Tap one to pre-fill the input, or just type and send. No gate.
function LandingState({
  category, isPrereq, selectedItem, setSelectedItem,
  helpType, setHelpType,
  input, setInput, onSend, canSend, isTyping, reduce, inputRef,
}: {
  category: CategoryKey; isPrereq: boolean;
  selectedItem: Item | null; setSelectedItem: (i: Item | null) => void;
  helpType: string; setHelpType: (v: string) => void;
  input: string; setInput: (v: string) => void; onSend: () => void;
  canSend: boolean; isTyping: boolean; reduce: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const CatIcon = CATEGORY_ICON[category] ?? FolderKanban;

  const needsItem = isPrereq && !selectedItem;
  const showCompose = !needsItem;
  // Suggestions show until a help-type is picked (it then becomes a chip).
  const showSuggestions = showCompose && !helpType;

  // Project + help-type render as removable chips; removing either reverts a step.
  const chips: ChipModel[] = [];
  if (selectedItem) chips.push({ id: "item", label: selectedItem.name, Icon: CatIcon, tone: "primary", onClear: () => setSelectedItem(null) });
  if (helpType) chips.push({ id: "help", label: helpType, Icon: LifeBuoy, tone: "neutral", onClear: () => setHelpType("") });

  const pickSuggestion = (t: string) => {
    setHelpType(t);
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    if (fine) window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <Box
      sx={{
        // Pin to the viewport area (nav 64 + bar 56 = 120) and clip — so the only
        // scroll is INSIDE the suggestions panel, which flexes to fill the leftover
        // height. The page itself never scrolls in the landing.
        height: "calc(100vh - 120px)", flexShrink: 0, minHeight: 0, overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-start",
        pt: { xs: 2, md: 3 }, gap: { xs: 3, md: 3.5 }, pb: 3,
      }}
    >
      <GlaidePresence category={category} heading="What do you need help with?" compact reduce={reduce} />

      {/* Step 1 — pick the item (prereq only) */}
      {needsItem && (
        <Box sx={{ maxWidth: 540, mx: "auto", width: "100%" }}>
          <ItemPicker category={category} onSelect={setSelectedItem} reduce={reduce} />
        </Box>
      )}

      {/* Compose — input (with chips) first, optional suggestions filling the rest */}
      {showCompose && (
        <Stack gap={2} sx={{ flex: 1, minHeight: 0, maxWidth: 640, mx: "auto", width: "100%" }}>
          <Box component={motion.div} layoutId={reduce ? undefined : "composer"} sx={{ flexShrink: 0 }}>
            <Composer
              ref={inputRef}
              value={input}
              onChange={setInput}
              onSend={onSend}
              canSend={canSend}
              disabled={isTyping}
              reduce={reduce}
              hero
              chips={chips}
              placeholder={isPrereq ? `Ask about this ${ITEM_NOUN[category] ?? "topic"}…` : "Describe what you need…"}
            />
          </Box>
          <AnimatePresence>
            {showSuggestions && (
              <SuggestionsPanel
                key="suggestions"
                category={category}
                onPick={pickSuggestion}
                reduce={reduce}
              />
            )}
          </AnimatePresence>
        </Stack>
      )}
    </Box>
  );
}

// Confirmed selection, shown above the help-type step so the chosen item stays in view.
function SelectedItemBar({ item, Icon, onChange, reduce }: { item: Item; Icon: LucideIcon; onChange: () => void; reduce: boolean }) {
  return (
    <Stack
      component={motion.div}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      direction="row" alignItems="center" gap={1.5}
      sx={{ px: 1.75, py: 1, borderRadius: "14px", border: "1px solid", borderColor: (t) => alpha(t.palette.primary.main, 0.28), bgcolor: (t) => alpha(t.palette.primary.main, 0.06) }}
    >
      <Box sx={{ width: 36, height: 36, borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: (t) => alpha(t.palette.primary.main, 0.12), color: "primary.main" }}>
        <Icon size={18} strokeWidth={2} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "primary.main", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.course}</Typography>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.2px", color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</Typography>
      </Box>
      <Button onClick={onChange} sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, color: "primary.main", flexShrink: 0, minWidth: 0, "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) } }}>
        Change
      </Button>
    </Stack>
  );
}

// Resolve a leading icon for a help-type by intent keywords (works across all
// categories without hand-mapping every option string).
const HELP_ICON_RULES: Array<[RegExp, LucideIcon]> = [
  [/solution|when|release|locked|attempt/i, Clock],
  [/extension|reschedul|deadline|attendance|more time/i, Calendar],
  [/re-?eval|score|grade|marks/i, Scale],
  [/stuck|error|bug|not working|broken|glitch|fail|load|play|video/i, Bug],
  [/understand|concept|explain|topic|content|resource|access|question/i, Lightbulb],
  [/payment|installment|fee|refund|invoice|receipt|paid/i, CreditCard],
  [/resume|certificate|profile|account|login|interview|referral|job/i, Briefcase],
  [/feedback|suggestion|mentor|session|experience/i, MessageSquare],
];
const helpIcon = (o: string): LucideIcon => HELP_ICON_RULES.find(([re]) => re.test(o))?.[1] ?? MessageCircle;

// Optional suggestions below the composer (Claude's-choice / GPT prompt starters).
// Tapping a row sets the help-type chip; the panel flexes to fill the remaining
// viewport height and scrolls internally (so the page itself never scrolls).
function SuggestionsPanel({ category, onPick, reduce }: { category: CategoryKey; onPick: (t: string) => void; reduce: boolean }) {
  const opts = (SUBCATEGORIES[category] ?? []).filter((o) => o !== "Something else");
  const container = { show: { transition: { staggerChildren: reduce ? 0 : 0.03, delayChildren: reduce ? 0 : 0.04 } } };
  const childIn = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } } };

  const rowBase = {
    appearance: "none", font: "inherit", border: 0, textAlign: "left" as const, cursor: "pointer", width: "100%",
    display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, position: "relative" as const,
    fontSize: 15, fontWeight: 500, color: "text.primary", bgcolor: "background.paper",
    transition: "background-color 140ms ease, color 140ms ease",
  };
  const insetDivider = {
    content: '""', position: "absolute" as const, top: 0, left: 16, right: 0, height: "1px",
    bgcolor: "outlineVariant.main",
  };

  return (
    <Box
      component={motion.div}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.24, ease: EASE }}
      sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: "1px solid", borderColor: "outlineVariant.main", borderRadius: "16px", overflow: "hidden", bgcolor: "background.paper", boxShadow: "0 1px 2px rgba(16,24,64,0.05)" }}
    >
      {/* Header — optional-suggestions affordance (no dismiss; it's already optional) */}
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.25, flexShrink: 0 }}>
        <LifeBuoy size={15} strokeWidth={2} style={{ opacity: 0.7, flexShrink: 0 }} />
        <Typography sx={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, color: "text.secondary", letterSpacing: "0.2px" }}>
          What kind of help?
        </Typography>
      </Stack>

      {/* Suggestions — fill the remaining height, single internal scroll */}
      <Box
        component={motion.div}
        variants={container}
        initial="hidden"
        animate="show"
        sx={{
          flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": { borderRadius: 3, backgroundColor: (t) => t.palette.outlineVariant.main },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        {opts.map((o) => (
          <Box
            key={o}
            component={motion.button}
            type="button"
            variants={childIn}
            onClick={() => onPick(o)}
            sx={{
              ...rowBase,
              "&::before": insetDivider,
              "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.05), color: "primary.main" },
            }}
          >
            <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{o}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── Item picker ───────────────────────────────────────────────────────────────
function ItemPicker({ category, onSelect, reduce }: { category: CategoryKey; onSelect: (i: Item) => void; reduce: boolean }) {
  const [other, setOther] = useState(false);
  const [course, setCourse] = useState("");
  const [item, setItem] = useState("");
  const cfg = PREREQ_DATA[category];
  const courses = cfg?.courses ?? [];
  const items = courses.find((c) => c.course === course)?.items ?? [];
  const noun = ITEM_NOUN[category] ?? "item";
  const CatIcon = CATEGORY_ICON[category] ?? FolderKanban;

  const container = useMemo(
    () => ({ show: { transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: reduce ? 0 : 0.1 } } }),
    [reduce]
  );
  const childIn = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } } };

  if (other) {
    return (
      <Box component={motion.div} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        <Stack gap={1.5} sx={{ p: 2.5, borderRadius: "18px", border: "1px solid", borderColor: "outlineVariant.main", bgcolor: "background.paper" }}>
          <Box>
            <Typography sx={fieldLabel}>Course</Typography>
            <Select size="small" fullWidth displayEmpty value={course} onChange={(e) => { setCourse(e.target.value); setItem(""); }} sx={selectSx}>
              <MenuItem value="" disabled>Select a course</MenuItem>
              {courses.map((c) => <MenuItem key={c.course} value={c.course} sx={{ fontSize: 14 }}>{c.course}</MenuItem>)}
            </Select>
          </Box>
          <Box>
            <Typography sx={{ ...fieldLabel, textTransform: "capitalize" }}>{noun}</Typography>
            <Select size="small" fullWidth displayEmpty value={item} disabled={!course} onChange={(e) => setItem(e.target.value)} sx={selectSx}>
              <MenuItem value="" disabled>{`Select a ${noun}`}</MenuItem>
              {items.map((p) => <MenuItem key={p} value={p} sx={{ fontSize: 14 }}>{p}</MenuItem>)}
            </Select>
          </Box>
          {/* Material button layout: actions right-aligned; confirming (Continue) far right, dismissive (Back) to its left. */}
          <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
            <Button onClick={() => setOther(false)} sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, color: "primary.main", borderRadius: "8px", px: 2, minHeight: 40, "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) } }}>Back</Button>
            <Button variant="contained" disableElevation disabled={!course || !item} onClick={() => onSelect({ course, name: item })} sx={primaryBtn}>Continue</Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack component={motion.div} variants={container} initial="hidden" animate="show" gap={1.25}>
      <Typography component={motion.p} variants={childIn} sx={sectionLabel}>Recent {CATEGORY_LABEL[category].toLowerCase()}</Typography>
      {(cfg?.recent ?? []).map((p, i) => {
        const tile = TILE_PALETTE[i % TILE_PALETTE.length];
        return (
          <Box
            key={p.name}
            component={motion.button}
            type="button"
            variants={childIn}
            whileHover={reduce ? undefined : { y: -2 }}
            transition={{ duration: 0.18, ease: EASE }}
            onClick={() => onSelect(p)}
            sx={{
              ...cardReset, display: "flex", alignItems: "center", gap: 1.75, px: 2, py: 1.75, borderRadius: "16px",
              boxShadow: "0 1px 2px rgba(16,24,64,0.04)",
              "&:hover": { borderColor: "primary.main", boxShadow: (t) => `0 8px 24px -10px ${alpha(t.palette.primary.main, 0.5)}` },
              "&:hover .chev": { transform: "translateX(3px)", color: (t: any) => t.palette.primary.main },
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: "12px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: tile.bg, color: tile.fg }}>
              <CatIcon size={21} strokeWidth={2} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "-0.1px", color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", mb: 0.25 }}>{p.course}</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.3px", color: "text.primary" }}>{p.name}</Typography>
            </Box>
            <Box className="chev" sx={{ color: "text.secondary", display: "flex", flexShrink: 0, transition: "transform 160ms ease, color 160ms ease" }}>
              <ChevronRight size={20} strokeWidth={2} />
            </Box>
          </Box>
        );
      })}
      <Box
        component={motion.button}
        type="button"
        variants={childIn}
        onClick={() => setOther(true)}
        sx={{
          ...cardReset, display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, borderRadius: "16px", borderStyle: "dashed",
          color: "text.secondary",
          "&:hover": { borderColor: "primary.main", color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.04) },
        }}
      >
        <Box sx={{ width: 32, height: 32, borderRadius: "9px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "surfaceContainer.low" }}>
          <Search size={16} strokeWidth={2} />
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{`Find another ${noun}`}</Typography>
      </Box>
    </Stack>
  );
}

// ── Composer ──────────────────────────────────────────────────────────────────
type ChipModel = { id: string; label: string; Icon: LucideIcon; tone: "primary" | "neutral"; onClear: () => void };
type ComposerProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  canSend: boolean;
  disabled: boolean;
  reduce: boolean;
  placeholder: string;
  hero?: boolean;
  chips?: ChipModel[];
  showAddHelp?: boolean;
  onAddHelp?: () => void;
};

type Att = { id: string; name: string; isImage: boolean; url?: string };

const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { value, onChange, onSend, canSend, disabled, reduce, placeholder, hero, chips = [], showAddHelp, onAddHelp },
  ref
) {
  const [files, setFiles] = useState<Att[]>([]);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const idc = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = Array.from(list).map((f) => {
      const isImage = f.type.startsWith("image/");
      return { id: `att-${idc.current++}`, name: f.name, isImage, url: isImage ? URL.createObjectURL(f) : undefined } as Att;
    });
    setFiles((prev) => [...prev, ...next]);
  };
  const removeFile = (id: string) =>
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.url) URL.revokeObjectURL(f.url);
      return prev.filter((x) => x.id !== id);
    });
  const clearFiles = () =>
    setFiles((prev) => {
      prev.forEach((f) => f.url && URL.revokeObjectURL(f.url));
      return [];
    });

  // Send via parent; if it actually sent (canSend), also clear attachments.
  const doSend = () => {
    onSend();
    if (canSend) clearFiles();
  };

  const hasContextRow = chips.length > 0 || !!showAddHelp;

  return (
    <Box
      onDragEnter={(e) => { e.preventDefault(); dragDepth.current += 1; setDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); }}
      onDragLeave={(e) => { e.preventDefault(); dragDepth.current -= 1; if (dragDepth.current <= 0) { dragDepth.current = 0; setDragging(false); } }}
      onDrop={(e) => { e.preventDefault(); dragDepth.current = 0; setDragging(false); addFiles(e.dataTransfer?.files ?? null); }}
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: dragging ? "primary.main" : "outlineVariant.main",
        borderRadius: hero ? "24px" : "22px",
        px: 2,
        py: 1.5,
        boxShadow: hero
          ? "0 2px 4px rgba(16,24,64,0.04), 0 18px 48px -16px rgba(0,84,214,0.22)"
          : "0 1px 2px rgba(16,24,64,0.04), 0 10px 28px -12px rgba(16,24,64,0.18)",
        transition: "border-color 160ms ease, box-shadow 160ms ease",
        "&:focus-within": { borderColor: "primary.main", boxShadow: (t) => `0 0 0 4px ${alpha(t.palette.primary.main, 0.1)}, 0 18px 48px -16px ${alpha(t.palette.primary.main, 0.28)}` },
      }}
    >
      {/* Hidden picker (opened by the paperclip) */}
      <Box component="input" ref={fileInputRef} type="file" multiple accept="image/*,application/pdf,.doc,.docx,.txt,.csv,.zip"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { addFiles(e.target.files); e.target.value = ""; }}
        sx={{ display: "none" }} />

      {/* Drop overlay */}
      {dragging && (
        <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 3, borderRadius: "inherit", border: "1.5px dashed", borderColor: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.06), display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "primary.main" }}>Drop to attach</Typography>
        </Box>
      )}

      {/* Row 1 — context chips (project / help-type) */}
      {hasContextRow && (
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 1.25 }}>
          {chips.map((c) => (
            <ContextChip key={c.id} {...c} reduce={reduce} />
          ))}
          {showAddHelp && (
            <Box
              component="button"
              type="button"
              onClick={() => onAddHelp?.()}
              sx={{
                appearance: "none", font: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 0.5,
                border: "1px dashed", borderColor: (t) => alpha(t.palette.text.secondary, 0.35), color: "text.secondary", bgcolor: "transparent",
                borderRadius: 999, px: 1.25, height: 30, fontSize: 13, fontWeight: 500,
                transition: "all 140ms ease",
                "&:hover": { borderColor: "primary.main", color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
              }}
            >
              <Plus size={14} strokeWidth={2.25} /> What kind of help?
            </Box>
          )}
        </Stack>
      )}

      {/* Row 2 — attachments (images as thumbnails, files as cards) */}
      {files.length > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 1.25 }}>
          {files.map((f) =>
            f.isImage ? (
              <Box key={f.id} sx={{ position: "relative", width: 56, height: 56, borderRadius: "12px", overflow: "hidden", border: "1px solid", borderColor: "outlineVariant.main", flexShrink: 0 }}>
                <Box component="img" src={f.url} alt={f.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <RemoveChip onClick={() => removeFile(f.id)} />
              </Box>
            ) : (
              <Stack key={f.id} direction="row" alignItems="center" gap={1} sx={{ position: "relative", maxWidth: 230, height: 56, pl: 1, pr: 1.5, borderRadius: "12px", border: "1px solid", borderColor: "outlineVariant.main", bgcolor: "background.paper", flexShrink: 0 }}>
                <FileTile name={f.name} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase" }}>{(f.name.split(".").pop() || "file")}</Typography>
                </Box>
                <RemoveChip onClick={() => removeFile(f.id)} />
              </Stack>
            )
          )}
        </Stack>
      )}

      <InputBase
        inputRef={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.nativeEvent?.isComposing) return;
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
        }}
        multiline
        maxRows={8}
        placeholder={placeholder}
        disabled={disabled}
        sx={{
          width: "100%", fontSize: 16, lineHeight: 1.5, color: "text.primary", px: 0.5, py: "4px",
          caretColor: (t) => t.palette.primary.main,
          "& ::placeholder": { color: "text.secondary", opacity: 0.75 },
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
        <Tooltip title="Attach files" placement="top" enterDelay={300}>
          <IconButton onClick={() => fileInputRef.current?.click()} aria-label="Attach files" sx={{ width: 34, height: 34, borderRadius: "10px", color: "text.secondary", "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "text.primary" } }}>
            <Paperclip size={18} strokeWidth={2} />
          </IconButton>
        </Tooltip>
        <IconButton
          component={motion.button}
          onClick={doSend}
          disabled={!canSend}
          aria-label="Send message"
          whileTap={canSend && !reduce ? { scale: 0.92 } : undefined}
          sx={{
            width: 38, height: 38, borderRadius: "12px", flexShrink: 0, bgcolor: "primary.main", color: "primary.contrastText",
            transition: "background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
            "&:hover": { bgcolor: "primary.main", boxShadow: (t) => `0 6px 16px -4px ${alpha(t.palette.primary.main, 0.6)}` },
            "&.Mui-disabled": { bgcolor: "surfaceContainer.low", color: "text.secondary", boxShadow: "none" },
          }}
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </IconButton>
      </Stack>
    </Box>
  );
});

// Colored file-type tile (PDFs red, everything else neutral primary).
function FileTile({ name }: { name: string }) {
  const isPdf = (name.split(".").pop() || "").toLowerCase() === "pdf";
  return (
    <Box
      sx={{
        width: 34, height: 34, borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: isPdf ? "#ffe1de" : (t) => alpha(t.palette.primary.main, 0.1),
        color: isPdf ? "#c0291f" : "primary.main",
      }}
    >
      <FileText size={18} strokeWidth={2} />
    </Box>
  );
}

// Small dark circular remove control pinned to an attachment's top-right corner.
function RemoveChip({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label="Remove attachment"
      sx={{
        position: "absolute", top: -7, right: -7, width: 20, height: 20, p: 0,
        bgcolor: "text.primary", color: "background.paper",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        "&:hover": { bgcolor: "text.primary", opacity: 0.85 },
      }}
    >
      <X size={12} strokeWidth={2.75} />
    </IconButton>
  );
}

function ContextChip({ label, Icon, tone, onClear, reduce }: ChipModel & { reduce: boolean }) {
  const primary = tone === "primary";
  return (
    <Stack
      component={motion.div}
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: EASE }}
      direction="row"
      alignItems="center"
      gap={0.75}
      sx={{
        height: 30, pl: 1, pr: 0.5, borderRadius: 999, maxWidth: 320,
        bgcolor: (t) => (primary ? alpha(t.palette.primary.main, 0.1) : t.palette.surfaceContainer.low),
        border: "1px solid",
        borderColor: (t) => (primary ? alpha(t.palette.primary.main, 0.24) : t.palette.outlineVariant.main),
        color: primary ? "primary.dark" : "text.primary",
      }}
    >
      <Icon size={14} strokeWidth={2} style={{ flexShrink: 0, opacity: primary ? 1 : 0.6 }} />
      <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Typography>
      <IconButton onClick={onClear} aria-label={`Remove ${label}`} sx={{ width: 20, height: 20, color: "inherit", opacity: 0.6, "&:hover": { opacity: 1, bgcolor: (t) => alpha(t.palette.text.primary, 0.08) } }}>
        <X size={13} strokeWidth={2.5} />
      </IconButton>
    </Stack>
  );
}

// ── Thread ─────────────────────────────────────────────────────────────────────
function ThreadState({ messages, isTyping, bottomRef, reduce }: { messages: Msg[]; isTyping: boolean; bottomRef: React.RefObject<HTMLDivElement>; reduce: boolean }) {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, pt: 2, pb: 4 }}>
      {messages.map((m, i) =>
        m.role === "user" ? (
          <UserMessage key={i} text={m.text} context={m.context} reduce={reduce} />
        ) : (
          <ChatBubble key={i} role="bot" text={m.text} isLatest={i === messages.length - 1} action={m.action} />
        )
      )}
      <AnimatePresence>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>
      <Box ref={bottomRef} />
    </Box>
  );
}

function UserMessage({ text, context, reduce }: { text: string; context?: string; reduce: boolean }) {
  return (
    <Stack alignItems="flex-end" gap={0.75} sx={{ width: "100%" }} data-msg-role="user">
      {context && (
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ px: 1.25, height: 26, borderRadius: 999, bgcolor: (t) => alpha(t.palette.primary.main, 0.08), border: "1px solid", borderColor: (t) => alpha(t.palette.primary.main, 0.18) }}>
          <Hash size={12} strokeWidth={2.5} style={{ opacity: 0.7 }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "primary.dark", letterSpacing: "-0.1px" }}>{context}</Typography>
        </Stack>
      )}
      <Box
        component={motion.div}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: EASE }}
        sx={{ maxWidth: "80%", px: 2, py: 1.25, bgcolor: (t) => alpha(t.palette.primary.main, 0.1), color: "primary.dark", borderRadius: "18px 18px 6px 18px" }}
      >
        <Box sx={{ fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-line" }}>{text}</Box>
      </Box>
    </Stack>
  );
}

// ── Dev preview switcher (mockup-only, quiet) ──────────────────────────────────
function DevPreview({ category, onPick }: { category: CategoryKey; onPick: (c: CategoryKey) => void }) {
  return (
    <Stack direction="row" alignItems="center" gap={0.75}>
      <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", color: "text.secondary", opacity: 0.6 }}>PREVIEW</Typography>
      <Select
        size="small"
        value={category}
        onChange={(e) => onPick(e.target.value as CategoryKey)}
        sx={{
          fontSize: 13, fontWeight: 500, color: "text.secondary", borderRadius: "10px",
          "& .MuiSelect-select": { py: 0.5, pr: "28px !important", pl: 1.25 },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.secondary" },
        }}
      >
        {CATEGORY_ORDER.map((c) => (
          <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
            {CATEGORY_LABEL[c]}{PREREQ.has(c) ? "  •" : ""}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}

// ── Shared style atoms ─────────────────────────────────────────────────────────
const cardReset = {
  appearance: "none",
  font: "inherit",
  textAlign: "left" as const,
  cursor: "pointer",
  width: "100%",
  border: "1px solid",
  borderColor: "outlineVariant.main",
  bgcolor: "background.paper",
  transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
} as const;

const sectionLabel = { fontSize: 11, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", color: "text.secondary", opacity: 0.8, mb: 0.25, pl: 0.5 } as const;
const fieldLabel = { fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.5 } as const;

const selectSx = {
  borderRadius: "10px",
  fontSize: 14,
  bgcolor: "background.paper",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
} as const;

const primaryBtn = {
  textTransform: "none", fontSize: 14, fontWeight: 600, borderRadius: "10px",
  bgcolor: "primary.main", color: "primary.contrastText", minHeight: 40, px: 3,
  "&:hover": { bgcolor: "primary.main" },
  "&.Mui-disabled": { bgcolor: "surfaceContainer.low", color: "text.secondary" },
} as const;

// ── Shared shell, re-exported for sibling prototype variants (B / C) ──────────
// Prototype A IS this page (composer-first). Variants import the common shell
// (hero, item picker, composer, thread, dev switcher, data) and only swap the
// landing interaction, so all prototypes share a consistent visual language.
export {
  Atmosphere,
  GlaideMark,
  GlaidePresence,
  ItemPicker,
  SelectedItemBar,
  Composer,
  ThreadState,
  DevPreview,
  CATEGORY_LABEL,
  ITEM_NOUN,
  CATEGORY_ICON,
  SUBCATEGORIES,
  PREREQ,
  PREREQ_DATA,
  TILE_PALETTE,
  CATEGORY_ORDER,
  glaideResponses,
};
export type { CategoryKey, Item, Course, Msg, ChipModel };
