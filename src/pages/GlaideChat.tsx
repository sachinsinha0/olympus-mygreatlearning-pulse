import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, InputBase, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Sparkles, Send, Check } from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { ChatBubble, TypingIndicator } from "../components/support/ChatBubble";
import { RaiseTicketChip } from "../components/support/RaiseTicketChip";
import { useSupport, type ChatMessage } from "../context/SupportContext";
import data from "../mocks/programSupport.json";

const GLAIDE_GRADIENT = "linear-gradient(135deg, #0054d6 0%, #60A5FA 55%, #DBEAFE 100%)";

const glaideResponses = data.glaideResponses as Record<string, string>;

type ActivitySeed = {
  kind: "activity";
  activity: { id: string; type: string; title: string; module: string; detectedIssue: string };
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
  const { getThread, createThread, addMessage, raiseTicket } = useSupport();

  const [threadId, setThreadId] = useState<string | null>(routeThreadId ?? null);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const initialised = useRef(false);

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
        text: `I noticed something on "${seed.activity.title}" in ${seed.activity.module}. ${seed.activity.detectedIssue} Want to work through it together?`,
      };
      const id = createThread({
        category,
        title: seed.activity.title,
        messages: [opening],
      });
      setThreadId(id);
    } else {
      const opening: ChatMessage = {
        role: "bot",
        text: glaideResponses[seed.categoryKey] ?? glaideResponses.fallback,
      };
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

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread?.messages.length, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !threadId || !thread) return;
    addMessage(threadId, { role: "user", text });
    setInput("");
    setIsTyping(true);
    const reply = glaideResponses[thread.category] ?? glaideResponses.fallback;
    window.setTimeout(() => {
      addMessage(threadId, { role: "bot", text: reply });
      setIsTyping(false);
    }, 750);
  };

  const handleRaise = () => {
    if (!threadId || isClosed) return;
    raiseTicket(threadId);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <Box
        sx={{
          width: "100%",
          maxWidth: 760,
          mx: "auto",
          px: { xs: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Glaide header */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          sx={{
            py: 2,
            borderBottom: 1,
            borderColor: "outlineVariant.main",
            position: "sticky",
            top: 64,
            bgcolor: "background.paper",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundImage: GLAIDE_GRADIENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "primary.contrastText",
            }}
          >
            <Sparkles size={18} strokeWidth={2} color="currentColor" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
              Glaide
            </Typography>
            <Typography
              sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary", letterSpacing: "-0.1px" }}
            >
              AI Mentor
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            onClick={() => navigate("/program_support")}
            sx={{
              cursor: "pointer",
              color: "text.secondary",
              transition: "color 120ms ease",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ChevronLeft size={18} strokeWidth={2} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "inherit" }}>Support</Typography>
          </Stack>
        </Stack>

        {/* Message list */}
        <Box
          ref={listRef}
          role="log"
          sx={{
            flex: 1,
            overflowY: "auto",
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {thread?.messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}
          {isTyping && <TypingIndicator />}
        </Box>

        {/* Composer, success panel, or resolved footer */}
        {isTicketed ? (
          <SuccessPanel onBack={() => navigate("/program_support")} />
        ) : isResolved ? (
          <ResolvedFooter onBack={() => navigate("/program_support")} />
        ) : (
          <Stack
            gap={1.5}
            sx={{
              pt: 1.5,
              pb: { xs: 2, md: 3 },
              borderTop: 1,
              borderColor: "outlineVariant.main",
              position: "sticky",
              bottom: 0,
              bgcolor: "background.paper",
            }}
          >
            <RaiseTicketChip onRaise={handleRaise} disabled={isClosed} />
            <Stack direction="row" gap={1} alignItems="flex-end">
              <InputBase
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                multiline
                maxRows={4}
                placeholder="Ask Glaide a question"
                sx={{
                  flex: 1,
                  border: 1,
                  borderColor: "outlineVariant.main",
                  borderRadius: "12px",
                  px: 2,
                  py: 1.25,
                  fontSize: 15,
                  bgcolor: "background.paper",
                  "&.Mui-focused": { borderColor: "primary.main" },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  flexShrink: 0,
                  "&:hover": { bgcolor: "primary.main" },
                  "&.Mui-disabled": { bgcolor: "surfaceContainer.low", color: "text.secondary" },
                }}
              >
                <Send size={18} strokeWidth={2} />
              </IconButton>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

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
