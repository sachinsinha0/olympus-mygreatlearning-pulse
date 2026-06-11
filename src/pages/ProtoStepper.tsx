// ─────────────────────────────────────────────────────────────────────────────
// PROTOTYPE C — Stepper wizard.
// A form-style flow modelled on the dev playground's "New session" modal:
// numbered stepper + Back/Continue. Steps: Project → Help type (optional) →
// Your question → thread. Reuses Prototype A's shell (data, thread, composer).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, InputBase, MenuItem, Select, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { X, Check, ChevronRight, Search } from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { EASE } from "../components/support/ChatBubble";
import { classifyIntent } from "../lib/classifyIntent";
import {
  Composer,
  ThreadState,
  GlaideMark,
  DevPreview,
  CATEGORY_LABEL,
  ITEM_NOUN,
  CATEGORY_ICON,
  SUBCATEGORIES,
  PREREQ,
  PREREQ_DATA,
  TILE_PALETTE,
  glaideResponses,
  type CategoryKey,
  type Item,
  type Course,
  type Msg,
} from "./GlaideChatMock";

const selectSx = {
  borderRadius: "10px", fontSize: 14, bgcolor: "background.paper",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
} as const;

export function ProtoStepper() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [category, setCategory] = useState<CategoryKey>("projects");
  const [phase, setPhase] = useState<"wizard" | "thread">("wizard");
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [helpType, setHelpType] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isPrereq = PREREQ.has(category);
  // Non-prereq categories have no project step.
  const steps = isPrereq ? (["project", "help", "ask"] as const) : (["help", "ask"] as const);
  const stepKind = steps[stepIdx];

  const reset = () => {
    setPhase("wizard"); setStepIdx(0); setSelectedItem(null);
    setHelpType(""); setInput(""); setMessages([]); setIsTyping(false);
  };
  const switchCategory = (next: CategoryKey) => { setCategory(next); reset(); };

  useEffect(() => {
    if (phase === "thread") bottomRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [messages, isTyping, phase, reduce]);

  const canContinue =
    stepKind === "project" ? !!selectedItem :
    stepKind === "help" ? true :
    input.trim().length > 0;

  const continueLabel = stepKind === "ask" ? "Start chat" : "Continue";

  const goBack = () => {
    if (stepIdx === 0) { navigate("/program_support/ask"); return; }
    setStepIdx((i) => i - 1);
  };

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

  const startChat = () => {
    const typed = input.trim();
    if (!typed) return;
    const ctxParts = [selectedItem?.name, helpType || null].filter(Boolean) as string[];
    const context = ctxParts.length ? ctxParts.join("  ·  ") : undefined;
    setMessages([{ role: "user", text: typed, ...(context ? { context } : {}) }]);
    const routing = [helpType, typed].filter(Boolean).join(" ");
    setInput("");
    setPhase("thread");
    setIsTyping(true);
    const reply = computeReply(routing);
    window.setTimeout(() => { setMessages((p) => [...p, reply]); setIsTyping(false); }, 800);
  };

  const handleContinue = () => {
    if (!canContinue) return;
    if (stepKind === "ask") { startChat(); return; }
    setStepIdx((i) => i + 1);
  };

  // Follow-up sends once the thread is open.
  const sendFollowUp = () => {
    const typed = input.trim();
    if (!typed || isTyping) return;
    setMessages((p) => [...p, { role: "user", text: typed }]);
    setInput("");
    setIsTyping(true);
    const reply = computeReply(typed);
    window.setTimeout(() => { setMessages((p) => [...p, reply]); setIsTyping(false); }, 800);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <TopNav />

      {phase === "wizard" ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", px: 2.5, pt: { xs: 4, md: 7 }, pb: 6 }}>
          {/* Dev preview, kept out of the card */}
          <Box sx={{ width: "100%", maxWidth: 680, display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
            <DevPreview category={category} onPick={switchCategory} />
          </Box>

          {/* Wizard card */}
          <Box sx={{ width: "100%", maxWidth: 680, bgcolor: "background.paper", border: "1px solid", borderColor: "outlineVariant.main", borderRadius: "20px", boxShadow: "0 2px 4px rgba(16,24,64,0.04), 0 24px 64px -20px rgba(16,24,64,0.25)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Header: title + stepper + close */}
            <Stack direction="row" alignItems="center" gap={2.5} sx={{ px: 3, py: 2.25, borderBottom: "1px solid", borderColor: "outlineVariant.main" }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <GlaideMark size={26} />
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", whiteSpace: "nowrap" }}>New question</Typography>
              </Stack>
              <Stepper steps={steps} current={stepIdx} />
              <IconButton onClick={() => navigate("/program_support/ask")} aria-label="Close" sx={{ ml: "auto", color: "text.secondary", "&:hover": { bgcolor: (t) => alpha(t.palette.text.primary, 0.06), color: "text.primary" } }}>
                <X size={20} strokeWidth={2} />
              </IconButton>
            </Stack>

            {/* Body */}
            <Box sx={{ px: 3, py: 3, minHeight: 340 }}>
              <AnimatePresence mode="wait">
                <Box
                  component={motion.div}
                  key={stepKind}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  {stepKind === "project" && (
                    <ProjectStep category={category} selected={selectedItem} onSelect={setSelectedItem} />
                  )}
                  {stepKind === "help" && (
                    <HelpStep category={category} selected={helpType} onSelect={setHelpType} />
                  )}
                  {stepKind === "ask" && (
                    <AskStep
                      category={category}
                      selectedItem={selectedItem}
                      helpType={helpType}
                      input={input}
                      setInput={setInput}
                      onEnter={startChat}
                      inputRef={inputRef}
                    />
                  )}
                </Box>
              </AnimatePresence>
            </Box>

            {/* Footer: Back (left) + Continue/Start (right) — Material layout */}
            <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={0.5} sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "outlineVariant.main", bgcolor: (t) => alpha(t.palette.surfaceContainer.low, 0.4) }}>
              <Button onClick={goBack} sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, color: "text.secondary", borderRadius: "8px", px: 2, minHeight: 40, "&:hover": { bgcolor: (t) => alpha(t.palette.text.primary, 0.06), color: "text.primary" } }}>
                {stepIdx === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                variant="contained"
                disableElevation
                disabled={!canContinue}
                onClick={handleContinue}
                sx={{ textTransform: "none", fontSize: 14, fontWeight: 600, borderRadius: "10px", bgcolor: "primary.main", color: "primary.contrastText", minHeight: 40, px: 3, "&:hover": { bgcolor: "primary.main" }, "&.Mui-disabled": { bgcolor: "surfaceContainer.low", color: "text.secondary" } }}
              >
                {continueLabel}
              </Button>
            </Stack>
          </Box>
        </Box>
      ) : (
        <LayoutGroup>
          <Box sx={{ flex: 1, width: "100%", maxWidth: 760, mx: "auto", px: 2.5, display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" gap={1.25} sx={{ height: 56, flexShrink: 0 }}>
              <GlaideMark size={26} />
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
                Glaide
                <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>{` · ${CATEGORY_LABEL[category]}`}</Box>
              </Typography>
              <Box sx={{ flex: 1 }} />
              <DevPreview category={category} onPick={switchCategory} />
            </Stack>
            <ThreadState messages={messages} isTyping={isTyping} bottomRef={bottomRef} reduce={!!reduce} />
          </Box>
          <Box sx={{ position: "sticky", bottom: 0, bgcolor: "background.default", zIndex: 5 }}>
            <Box sx={{ maxWidth: 760, mx: "auto", px: 2.5, pt: 1.5, pb: 2.5 }}>
              <Composer ref={inputRef} value={input} onChange={setInput} onSend={sendFollowUp} canSend={input.trim().length > 0 && !isTyping} disabled={isTyping} reduce={!!reduce} placeholder="Ask Glaide" />
              <Typography sx={{ mt: 1.25, textAlign: "center", fontSize: 12, color: "text.secondary" }}>
                Glaide is AI and can make mistakes. Check important info.
              </Typography>
            </Box>
          </Box>
        </LayoutGroup>
      )}
    </Box>
  );
}

// ── Stepper header ──────────────────────────────────────────────────────────
const STEP_LABEL: Record<string, string> = { project: "Project", help: "Help type", ask: "Your question" };

function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ overflow: "hidden" }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Stack key={s} direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                border: "1.5px solid",
                borderColor: active || done ? "primary.main" : "outlineVariant.main",
                bgcolor: done ? "primary.main" : "transparent",
                color: done ? "primary.contrastText" : active ? "primary.main" : "text.secondary",
              }}
            >
              {done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? "text.primary" : "text.secondary", whiteSpace: "nowrap", display: { xs: "none", sm: "block" } }}>
              {STEP_LABEL[s]}
            </Typography>
            {i < steps.length - 1 && <Box sx={{ width: { xs: 12, sm: 20 }, height: "1.5px", bgcolor: "outlineVariant.main", mx: 0.25, flexShrink: 0 }} />}
          </Stack>
        );
      })}
    </Stack>
  );
}

// ── Step 1: Project ───────────────────────────────────────────────────────────
function ProjectStep({ category, selected, onSelect }: { category: CategoryKey; selected: Item | null; onSelect: (i: Item) => void }) {
  const [other, setOther] = useState(false);
  const [course, setCourse] = useState("");
  const [proj, setProj] = useState("");
  const cfg = PREREQ_DATA[category];
  const recent = cfg?.recent ?? [];
  const courses: Course[] = cfg?.courses ?? [];
  const items = courses.find((c) => c.course === course)?.items ?? [];
  const noun = ITEM_NOUN[category] ?? "item";
  const CatIcon = CATEGORY_ICON[category];

  if (other) {
    return (
      <Stack gap={1.75}>
        <Typography sx={fieldLabel}>Course</Typography>
        <Select size="small" fullWidth displayEmpty value={course} onChange={(e) => { setCourse(e.target.value); setProj(""); }} sx={selectSx}>
          <MenuItem value="" disabled>Select a course</MenuItem>
          {courses.map((c) => <MenuItem key={c.course} value={c.course} sx={{ fontSize: 14 }}>{c.course}</MenuItem>)}
        </Select>
        <Typography sx={{ ...fieldLabel, textTransform: "capitalize" }}>{noun}</Typography>
        <Select size="small" fullWidth displayEmpty value={proj} disabled={!course} onChange={(e) => { setProj(e.target.value); onSelect({ course, name: e.target.value }); }} sx={selectSx}>
          <MenuItem value="" disabled>{`Select a ${noun}`}</MenuItem>
          {items.map((p) => <MenuItem key={p} value={p} sx={{ fontSize: 14 }}>{p}</MenuItem>)}
        </Select>
        <Button onClick={() => setOther(false)} sx={{ alignSelf: "flex-start", textTransform: "none", fontSize: 13, fontWeight: 600, color: "text.secondary", mt: 0.5 }}>‹ Recent {CATEGORY_LABEL[category].toLowerCase()}</Button>
      </Stack>
    );
  }

  return (
    <Stack gap={1}>
      <Typography sx={fieldLabel}>Recent {CATEGORY_LABEL[category].toLowerCase()}</Typography>
      {recent.map((p, i) => {
        const tile = TILE_PALETTE[i % TILE_PALETTE.length];
        const isSel = selected?.name === p.name;
        return (
          <Box
            key={p.name}
            component="button"
            type="button"
            onClick={() => onSelect(p)}
            sx={{
              appearance: "none", font: "inherit", textAlign: "left", cursor: "pointer", width: "100%",
              display: "flex", alignItems: "center", gap: 1.75, px: 2, py: 1.5, borderRadius: "14px",
              border: "1px solid", borderColor: isSel ? "primary.main" : "outlineVariant.main",
              bgcolor: (t) => (isSel ? alpha(t.palette.primary.main, 0.06) : "background.paper"),
              transition: "border-color 140ms ease, background-color 140ms ease",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Box sx={{ width: 40, height: 40, borderRadius: "11px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: tile.bg, color: tile.fg }}>
              {CatIcon ? <CatIcon size={20} strokeWidth={2} /> : null}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.course}</Typography>
              <Typography sx={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.2px", color: "text.primary" }}>{p.name}</Typography>
            </Box>
            <Box sx={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid", borderColor: isSel ? "primary.main" : "outlineVariant.main", bgcolor: isSel ? "primary.main" : "transparent", color: "primary.contrastText" }}>
              {isSel && <Check size={13} strokeWidth={3} />}
            </Box>
          </Box>
        );
      })}
      <Box
        component="button"
        type="button"
        onClick={() => setOther(true)}
        sx={{
          appearance: "none", font: "inherit", textAlign: "left", cursor: "pointer", width: "100%",
          display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, borderRadius: "14px", borderStyle: "dashed",
          border: "1px dashed", borderColor: "outlineVariant.main", bgcolor: "transparent", color: "text.secondary",
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

// ── Step 2: Help type (optional) ────────────────────────────────────────────
function HelpStep({ category, selected, onSelect }: { category: CategoryKey; selected: string; onSelect: (v: string) => void }) {
  const opts = (SUBCATEGORIES[category] ?? []).filter((o) => o !== "Something else");
  return (
    <Stack gap={1.25}>
      <Box>
        <Typography sx={{ ...fieldLabel, mb: 0.25 }}>What kind of help? <Box component="span" sx={{ fontWeight: 400 }}>(optional)</Box></Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Pick one so Glaide can help faster — or just continue and describe it yourself.</Typography>
      </Box>
      <Stack gap={1} sx={{ mt: 0.5 }}>
        {opts.map((o) => {
          const isSel = selected === o;
          return (
            <Box
              key={o}
              component="button"
              type="button"
              onClick={() => onSelect(isSel ? "" : o)}
              sx={{
                appearance: "none", font: "inherit", textAlign: "left", cursor: "pointer", width: "100%",
                display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, borderRadius: "12px",
                border: "1px solid", borderColor: isSel ? "primary.main" : "outlineVariant.main",
                bgcolor: (t) => (isSel ? alpha(t.palette.primary.main, 0.06) : "background.paper"),
                fontSize: 14.5, fontWeight: 500, color: "text.primary",
                transition: "border-color 140ms ease, background-color 140ms ease",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{o}</Box>
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid", borderColor: isSel ? "primary.main" : "outlineVariant.main", bgcolor: isSel ? "primary.main" : "transparent", color: "primary.contrastText" }}>
                {isSel && <Check size={13} strokeWidth={3} />}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}

// ── Step 3: Your question ─────────────────────────────────────────────────────
function AskStep({ category, selectedItem, helpType, input, setInput, onEnter, inputRef }: {
  category: CategoryKey; selectedItem: Item | null; helpType: string; input: string;
  setInput: (v: string) => void; onEnter: () => void; inputRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const chips = [selectedItem?.name, helpType].filter(Boolean) as string[];
  return (
    <Stack gap={1.5}>
      {chips.length > 0 && (
        <Stack direction="row" gap={0.75} flexWrap="wrap">
          {chips.map((c) => (
            <Box key={c} sx={{ display: "inline-flex", alignItems: "center", height: 28, px: 1.25, borderRadius: 999, bgcolor: (t) => alpha(t.palette.primary.main, 0.08), border: "1px solid", borderColor: (t) => alpha(t.palette.primary.main, 0.18) }}>
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "primary.dark", whiteSpace: "nowrap" }}>{c}</Typography>
            </Box>
          ))}
        </Stack>
      )}
      <Box>
        <Typography sx={{ ...fieldLabel, mb: 0.75 }}>Your question</Typography>
        <Box sx={{ border: "1px solid", borderColor: "outlineVariant.main", borderRadius: "14px", px: 2, py: 1.5, bgcolor: "background.paper", transition: "border-color 140ms ease, box-shadow 140ms ease", "&:focus-within": { borderColor: "primary.main", boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.1)}` } }}>
          <InputBase
            inputRef={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onEnter(); } }}
            multiline
            minRows={3}
            maxRows={8}
            placeholder={category === "projects" || PREREQ.has(category) ? `Ask about this ${ITEM_NOUN[category] ?? "topic"}…` : "Describe what you need…"}
            sx={{ width: "100%", fontSize: 15.5, lineHeight: 1.55, color: "text.primary", caretColor: (t) => t.palette.primary.main, "& ::placeholder": { color: "text.secondary", opacity: 0.75 } }}
          />
        </Box>
      </Box>
    </Stack>
  );
}

const fieldLabel = { fontSize: 13, fontWeight: 600, color: "text.primary" } as const;
