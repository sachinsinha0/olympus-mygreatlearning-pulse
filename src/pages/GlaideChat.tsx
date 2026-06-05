import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

  // Single window scroll (scrollbar at the page edge), ChatGPT/Gemini style.
  const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
  }, []);

  // Window scroll state for the scroll-to-latest control and the header hairline.
  useEffect(() => {
    const onScroll = () => {
      const distance =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setShowScrollDown(distance > 80);
      setScrolled(window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // First paint of an existing (reopened) thread lands at the latest message.
  const firstPaint = useRef(true);
  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      scrollToBottom("auto");
    }
  }, [scrollToBottom]);

  // --- ChatGPT-style "pin the new turn to the top" ---------------------------
  // After a send, the latest turn reserves a viewport of space so the new
  // message sits near the top with room below for Glaide's reply, and no
  // permanent gap (the reservation shrinks as the reply fills it).
  const HEADER_OFFSET = 120; // 64 TopNav + 56 sticky chat header
  const logRef = useRef<HTMLDivElement | null>(null);
  const [spacer, setSpacer] = useState(0);
  const reserveRef = useRef(false); // only an actively-sent turn reserves space
  const pendingPin = useRef(false);

  const computeSpacer = useCallback(() => {
    const log = logRef.current;
    if (!log || !reserveRef.current) return 0;
    const users = log.querySelectorAll('[data-msg-role="user"]');
    const lastUser = users[users.length - 1] as HTMLElement | undefined;
    if (!lastUser) return 0;
    const lastUserTop = lastUser.getBoundingClientRect().top + window.scrollY;
    const contentBottom = log.getBoundingClientRect().bottom + window.scrollY;
    const afterHeight = contentBottom - lastUserTop;
    return Math.max(0, Math.ceil(window.innerHeight - HEADER_OFFSET - afterHeight));
  }, []);

  const pinLastUserToTop = useCallback(() => {
    const log = logRef.current;
    if (!log) return;
    const users = log.querySelectorAll('[data-msg-role="user"]');
    const el = users[users.length - 1] as HTMLElement | undefined;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  // Recompute the reserved spacer as the turn changes; once it settles and a
  // send is pending, pin that message to the top.
  useLayoutEffect(() => {
    const desired = computeSpacer();
    if (Math.abs(desired - spacer) > 1) {
      setSpacer(desired);
      return;
    }
    if (pendingPin.current) {
      pendingPin.current = false;
      pinLastUserToTop();
    }
  }, [messageCount, isTyping, spacer, computeSpacer, pinLastUserToTop]);

  // Keep the reservation correct on viewport resize.
  useEffect(() => {
    const onResize = () => setSpacer(computeSpacer());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeSpacer]);

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
    reserveRef.current = true; // this turn reserves space and pins to top
    pendingPin.current = true;
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
    reserveRef.current = true;
    pendingPin.current = true;
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper" }}>
      <TopNav />

      <Box
        sx={{
          width: "100%",
          maxWidth: 816,
          mx: "auto",
          px: { xs: 2, md: 3 },
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
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          sx={{
            // Only the lone hero turn stretches to centre vertically; an ongoing
            // conversation sizes to its content so there is no dead gap.
            minHeight: isHeroState ? "calc(100vh - 120px)" : 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: isHeroState ? "center" : "flex-start",
            gap: 3,
            pt: 2,
            pb: isClosed ? 4 : { xs: 16, md: 18 },
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

        {/* Reserved space so the latest sent turn can pin to the top; collapses
            as the reply fills it, leaving no permanent gap. */}
        {!isClosed && spacer > 0 && <Box aria-hidden sx={{ height: spacer, flexShrink: 0 }} />}

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
                position: "fixed",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: { xs: 132, md: 148 },
                zIndex: 6,
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

        {/* Closed conversations end with an in-flow panel (no composer) */}
        {isTicketed && <SuccessPanel onBack={() => navigate("/program_support")} />}
        {isResolved && <ResolvedFooter onBack={() => navigate("/program_support")} />}
      </Box>

      {/* Fixed composer: the page itself scrolls (scrollbar at the edge); the
          composer stays pinned to the viewport bottom, centered to the column. */}
      {!isClosed && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: 816,
              mx: "auto",
              px: { xs: 2, md: 3 },
              pt: 1.5,
              pb: { xs: 2, md: 3 },
              bgcolor: "background.paper",
              pointerEvents: "auto",
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
        </Box>
      )}
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

  // Single line -> one row [attach | text | send]. Two+ lines -> the text spans
  // the top full-width and the controls drop to a row below (ChatGPT/Gemini).
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const [stacked, setStacked] = useState(false);
  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );
  // Decide single-vs-stacked by measuring a hidden mirror at the FIXED single-row
  // text width. Measuring the live textarea instead oscillates: stacking widens
  // the textarea, which un-wraps the text, which un-stacks it, and so on.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    const mirror = mirrorRef.current;
    const el = innerRef.current;
    if (!grid || !mirror) return;
    const cs = window.getComputedStyle(grid);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const colGap = parseFloat(cs.columnGap) || 8;
    const BTN = 36; // attach + send columns
    const singleRowTextWidth = Math.max(0, grid.clientWidth - padL - padR - BTN * 2 - colGap * 2);
    // Mirror the textarea's exact typography so the mirror wraps identically to
    // the rendered textarea (letter-spacing especially shifts the wrap point).
    let lineH = 22.5;
    if (el) {
      const tcs = window.getComputedStyle(el);
      mirror.style.fontFamily = tcs.fontFamily;
      mirror.style.fontSize = tcs.fontSize;
      mirror.style.fontWeight = tcs.fontWeight;
      mirror.style.letterSpacing = tcs.letterSpacing;
      mirror.style.lineHeight = tcs.lineHeight;
      lineH = parseFloat(tcs.lineHeight) || 22.5;
    }
    mirror.style.width = `${singleRowTextWidth}px`;
    mirror.textContent = value || "x";
    // More than ~1.5 line-heights tall means it wrapped at the single-row width.
    setStacked(mirror.scrollHeight > lineH * 1.5);
  }, [value]);

  return (
    <Box
      ref={gridRef}
      sx={{
        display: "grid",
        alignItems: "center",
        columnGap: 1,
        rowGap: 0.5,
        gridTemplateColumns: "auto 1fr auto",
        gridTemplateAreas: stacked
          ? `"text text text" "attach . send"`
          : `"attach text send"`,
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
      {/* Off-screen mirror used only to measure wrap at the single-row width. */}
      <Box
        ref={mirrorRef}
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: -1,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 15,
          lineHeight: "22.5px",
          padding: 0,
          boxSizing: "content-box",
        }}
      />

      <Tooltip title="Attach a screenshot" placement="top" enterDelay={300}>
        <IconButton
          component={motion.button}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          aria-label="Attach a screenshot"
          sx={{
            gridArea: "attach",
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
        inputRef={setRefs}
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
        maxRows={8}
        placeholder="Ask Glaide"
        sx={{
          gridArea: "text",
          // Stacked text spans the FULL width (like ChatGPT), not constrained to
          // the single-row width. The single/stacked decision is made by the
          // mirror at the fixed single-row width, which keeps it stable.
          px: 0,
          fontSize: 15,
          lineHeight: 1.5,
          color: "text.primary",
          py: "6px",
          caretColor: (t) => t.palette.primary.main,
          "& ::placeholder": { color: "text.secondary", opacity: 0.7 },
          "& textarea": {
            overflowY: "auto",
            overscrollBehavior: "contain",
            scrollbarGutter: "stable",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 3,
              backgroundColor: (t) => t.palette.outlineVariant.main,
            },
            "&::-webkit-scrollbar-track": { background: "transparent" },
          },
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
          gridArea: "send",
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
