import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, InputBase, Stack, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowDown, ArrowLeft, Paperclip, Check } from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { ChatBubble, TypingIndicator, EASE } from "../components/support/ChatBubble";
import { useSupport, type ChatMessage } from "../context/SupportContext";
import data from "../mocks/programSupport.json";

const glaideResponses = data.glaideResponses as Record<string, string>;

type TopicFlow = { question: string; options: string[]; reply: string };
const topicFlows = data.topicFlows as Record<string, TopicFlow>;

type ActivitySeed = {
  kind: "activity";
  activity: { id: string; type: string; course: string; title: string; when: string };
};
type CategorySeed = { kind: "category"; categoryKey: string; label: string };
type SeedState = ActivitySeed | CategorySeed;

// Map a recent-activity type to the closest support category for the reply bank.
const ACTIVITY_TYPE_TO_CATEGORY: Record<string, string> = {
  quiz: "quizzes",
  video: "material",
  doc: "material",
  assignment: "projects",
};

export function GlaideChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { threadId: routeThreadId } = useParams();
  const { getThread, createThread, addMessage } = useSupport();
  const reduce = useReducedMotion();

  const [threadId, setThreadId] = useState<string | null>(routeThreadId ?? null);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [sendPulse, setSendPulse] = useState(0);
  // The morphId of the chip currently animating into a user bubble (one-shot).
  const [morphTarget, setMorphTarget] = useState<string | null>(null);
  const initialised = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Seed a new thread once on mount when navigated with state and no :threadId.
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    if (routeThreadId) {
      // Existing thread path: guard against an unknown id.
      if (!getThread(routeThreadId)) {
        navigate("/program_support/ask", { replace: true });
      }
      return;
    }

    const seed = location.state as SeedState | null;
    if (!seed) {
      // Hard refresh / direct entry with no nav-state: no unseeded empty chat.
      navigate("/program_support/ask", { replace: true });
      return;
    }

    if (seed.kind === "activity") {
      const category = ACTIVITY_TYPE_TO_CATEGORY[seed.activity.type] ?? "other";
      const opening: ChatMessage = {
        role: "bot",
        text: `Let's pick up your "${seed.activity.title}" in ${seed.activity.course}. What do you need help with?`,
      };
      const id = createThread({
        category,
        title: seed.activity.title,
        messages: [opening],
      });
      setThreadId(id);
    } else {
      const flow = topicFlows[seed.categoryKey];
      const opening: ChatMessage = flow
        ? { role: "bot", text: flow.question, options: flow.options }
        : { role: "bot", text: glaideResponses[seed.categoryKey] ?? glaideResponses.fallback };
      const id = createThread({
        category: seed.categoryKey,
        title: seed.label,
        messages: [opening],
      });
      setThreadId(id);
    }
  }, [routeThreadId, location.state, createThread, getThread, navigate]);

  const thread = threadId ? getThread(threadId) : undefined;
  const isTicketed = thread?.status === "ticketed";
  const isResolved = thread?.status === "resolved";
  const isClosed = isTicketed || isResolved;

  const messageCount = thread?.messages.length ?? 0;
  // We always enter seeded; the lone opening turn IS the hero/landing moment.
  const isHeroState = messageCount === 1 && !isTyping;

  const listRef = useRef<HTMLDivElement>(null);

  // Sticky-bottom autoscroll: only yank down if the user was already near bottom.
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior) => {
      const el = listRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    },
    []
  );

  const wasNearBottom = useRef(true);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      wasNearBottom.current = distance <= 80;
      setShowScrollDown(distance > 80);
      setScrolled(el.scrollTop > 4);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Instant on first paint, smooth for subsequent turns (respecting reduced motion).
  const firstPaint = useRef(true);
  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      scrollToBottom("auto");
      return;
    }
    if (wasNearBottom.current) {
      scrollToBottom(reduce ? "auto" : "smooth");
    }
  }, [messageCount, isTyping, scrollToBottom, reduce]);

  // Desktop autofocus after the hero settle reads first; never on touch.
  useEffect(() => {
    if (isClosed) return;
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    if (!fine) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), reduce ? 50 : 380);
    return () => window.clearTimeout(t);
  }, [isClosed, reduce]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !threadId || !thread || isTyping) return;
    addMessage(threadId, { role: "user", text });
    setInput("");
    setSendPulse((p) => p + 1);
    setIsTyping(true);
    wasNearBottom.current = true; // user's own send always follows to bottom
    if (inputRef.current) inputRef.current.style.height = "auto";
    const reply = glaideResponses[thread.category] ?? glaideResponses.fallback;
    window.setTimeout(() => {
      addMessage(threadId, { role: "bot", text: reply });
      setIsTyping(false);
    }, 750);
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    if (fine) window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleOption = (option: string, morphId: string) => {
    if (!threadId || !thread || isClosed || isTyping) return;
    if (!reduce) setMorphTarget(morphId);
    addMessage(threadId, { role: "user", text: option });
    setIsTyping(true);
    wasNearBottom.current = true;
    const flow = topicFlows[thread.category];
    const reply = flow?.reply ?? glaideResponses[thread.category] ?? glaideResponses.fallback;
    window.setTimeout(() => {
      addMessage(threadId, { role: "bot", text: reply });
      setIsTyping(false);
    }, 750);
    // Clear the morph target after the shared-layout transition resolves.
    window.setTimeout(() => setMorphTarget(null), 400);
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    if (fine) window.setTimeout(() => inputRef.current?.focus(), 0);
  };


  const messages = thread?.messages ?? [];
  // Index of the last user message that arrived via a chip select (morph target).
  const lastUserIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return i;
    }
    return -1;
  })();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          mx: "auto",
          px: { xs: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Slim top bar: identity lives here only; hairline appears once scrolled. */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1.25}
          sx={{
            height: 56,
            position: "sticky",
            top: 64,
            bgcolor: "background.paper",
            zIndex: 3,
            borderBottom: "1px solid",
            borderColor: scrolled ? "outlineVariant.main" : "transparent",
            transition: "border-color 160ms ease",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            aria-label="Back"
            sx={{
              ml: -1,
              color: "text.primary",
              "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </IconButton>
          <Box
            component="img"
            src={new URL("../assets/ai-mentor-logo.svg", import.meta.url).href}
            alt="Glaide"
            sx={{ width: 28, height: 28, flexShrink: 0, display: "block" }}
          />
          <Typography sx={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, color: "text.primary" }}>
            Glaide
            <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
              {" · Program Support"}
            </Box>
          </Typography>
        </Stack>

        {/* One-time radial entrance glow tied to primary; fades on first user reply. */}
        <AnimatePresence>
          {isHeroState && !reduce && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              aria-hidden
              sx={{
                position: "absolute",
                left: "50%",
                top: "55%",
                width: 520,
                height: 520,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 0,
                background: (t) =>
                  `radial-gradient(closest-side, ${alpha(
                    t.palette.primary.main,
                    t.palette.mode === "dark" ? 0.06 : 0.1
                  )}, transparent)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Message list */}
        <Box
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          sx={{
            flex: 1,
            overflowY: "auto",
            py: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: isHeroState ? "center" : "flex-start",
            gap: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          <LayoutGroup>
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1;
              // The seeded opening, while alone, renders as the hero turn.
              const isHero = i === 0 && isHeroState;
              // A user turn that just arrived via chip select carries the morph id.
              const morphId =
                m.role === "user" && i === lastUserIndex && morphTarget ? morphTarget : undefined;
              return (
                <ChatBubble
                  key={i}
                  role={m.role}
                  text={m.text}
                  options={m.options}
                  optionsActive={isLast && !isTyping && !isClosed}
                  isHero={isHero}
                  isLatest={m.role === "bot" && isLast}
                  morphId={m.role === "user" ? morphId : `chip-${i}`}
                  onOptionClick={handleOption}
                />
              );
            })}
            <AnimatePresence>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>
          </LayoutGroup>
        </Box>

        {/* Scroll-to-latest control */}
        <AnimatePresence>
          {showScrollDown && !isClosed && (
            <Box
              component={motion.button}
              type="button"
              onClick={() => scrollToBottom(reduce ? "auto" : "smooth")}
              aria-label="Scroll to latest"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: EASE }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              sx={{
                appearance: "none",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: { xs: 88, md: 96 },
                zIndex: 4,
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: 1,
                borderColor: "outlineVariant.main",
                bgcolor: "surfaceContainer.highest",
                color: "text.secondary",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "color 120ms ease, background-color 120ms ease",
                "&:hover": { color: "text.primary", bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
              }}
            >
              <ArrowDown size={18} strokeWidth={2} />
            </Box>
          )}
        </AnimatePresence>

        {/* Composer, success panel, or resolved footer */}
        {isTicketed ? (
          <SuccessPanel onBack={() => navigate("/program_support")} />
        ) : isResolved ? (
          <ResolvedFooter onBack={() => navigate("/program_support")} />
        ) : (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              pt: 1.5,
              pb: { xs: 2, md: 3 },
              bgcolor: "background.paper",
              zIndex: 2,
            }}
          >
            {/* Fade mask: scrolling messages dissolve under the composer. */}
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                top: -24,
                left: 0,
                right: 0,
                height: 24,
                pointerEvents: "none",
                background: (t) => `linear-gradient(to bottom, transparent, ${t.palette.background.paper})`,
              }}
            />
            <Composer
              ref={inputRef}
              value={input}
              onChange={setInput}
              onSend={handleSend}
              sendPulse={sendPulse}
              disabled={isTyping}
              reduce={!!reduce}
            />
            <Typography
              sx={{ mt: 1, textAlign: "center", fontSize: 12, color: "text.secondary" }}
            >
              Glaide is AI and can make mistakes. Check important info.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

type ComposerProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  sendPulse: number;
  disabled: boolean;
  reduce: boolean;
};

const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { value, onChange, onSend, sendPulse, disabled, reduce },
  ref
) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "outlineVariant.main",
        borderRadius: "28px",
        pl: 1,
        pr: 0.75,
        py: 0.75,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        transition: "border-color 160ms ease, box-shadow 160ms ease",
        "&:hover": { boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 28px rgba(0,0,0,0.08)" },
        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.10)",
        },
      }}
    >
      <Tooltip title="Attach a screenshot" placement="top" enterDelay={300}>
        <IconButton
          component={motion.button}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          aria-label="Attach a screenshot"
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            color: "text.secondary",
            flexShrink: 0,
            transition: "background-color 120ms ease, color 120ms ease",
            "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "text.primary" },
            "&:focus-visible": {
              outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
              outlineOffset: 2,
            },
          }}
        >
          <Paperclip size={18} strokeWidth={2} />
        </IconButton>
      </Tooltip>

      <InputBase
        inputRef={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Guard IME composition so CJK input commits cleanly.
          if (e.nativeEvent?.isComposing || e.keyCode === 229) return;
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        multiline
        maxRows={6}
        placeholder="Ask Glaide"
        sx={{
          flex: 1,
          fontSize: 15,
          lineHeight: 1.6,
          color: "text.primary",
          py: 1.25,
          caretColor: (t) => t.palette.primary.main,
          "& ::placeholder": { color: "text.secondary", opacity: 0.7 },
        }}
      />

      <IconButton
        component={motion.button}
        onClick={onSend}
        disabled={!canSend}
        aria-label="Send message"
        aria-disabled={!canSend}
        whileTap={canSend && !reduce ? { scale: 0.92 } : undefined}
        animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
        key={sendPulse}
        transition={{ duration: 0.22, ease: "easeOut" }}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          flexShrink: 0,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          transition: "background-color 120ms ease, box-shadow 120ms ease",
          "&:hover": { bgcolor: "primary.main", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" },
          "&.Mui-disabled": { bgcolor: "surfaceContainer.low", color: "text.secondary", boxShadow: "none" },
          "&:focus-visible": {
            outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
            outlineOffset: 2,
          },
        }}
      >
        <ArrowUp size={18} strokeWidth={2.25} />
      </IconButton>
    </Box>
  );
});

function SuccessPanel({ onBack }: { onBack: () => void }) {
  return (
    <Stack
      alignItems="center"
      gap={1.5}
      sx={{
        py: 4,
        borderTop: 1,
        borderColor: "outlineVariant.main",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: (t) => t.palette.extended.success.colorContainer,
          color: (t) => t.palette.extended.success.onColorContainer,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={22} strokeWidth={2.5} />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
        Ticket raised
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", maxWidth: 360 }}>
        Our team will follow up on this. You can track it under Open Tickets.
      </Typography>
      <Button
        disableElevation
        variant="contained"
        onClick={onBack}
        sx={{
          mt: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          textTransform: "none",
          fontSize: 15,
          fontWeight: 500,
          borderRadius: "8px",
          minHeight: 40,
          px: "19px",
          "&:hover": { bgcolor: "primary.main" },
        }}
      >
        Back to Support
      </Button>
    </Stack>
  );
}

function ResolvedFooter({ onBack }: { onBack: () => void }) {
  return (
    <Stack
      alignItems="center"
      gap={1.5}
      sx={{
        py: 4,
        borderTop: 1,
        borderColor: "outlineVariant.main",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: "surfaceContainer.low",
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={22} strokeWidth={2.5} />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
        This conversation was resolved
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", maxWidth: 360 }}>
        Glaide marked this as sorted. Start a new question any time from the support page.
      </Typography>
      <Button
        disableElevation
        variant="contained"
        onClick={onBack}
        sx={{
          mt: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          textTransform: "none",
          fontSize: 15,
          fontWeight: 500,
          borderRadius: "8px",
          minHeight: 40,
          px: "19px",
          "&:hover": { bgcolor: "primary.main" },
        }}
      >
        Back to Support
      </Button>
    </Stack>
  );
}
