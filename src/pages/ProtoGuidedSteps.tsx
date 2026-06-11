// ─────────────────────────────────────────────────────────────────────────────
// PROTOTYPE B — Guided steps.
// pick the item → dedicated "What kind of help?" step → compose → thread.
// Reuses Prototype A's shared shell (hero, item picker, composer, thread, dev
// switcher); only the landing interaction differs (a gated step vs. A's
// composer-first suggestions). Frozen for side-by-side comparison.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronRight, LifeBuoy } from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { EASE } from "../components/support/ChatBubble";
import { classifyIntent } from "../lib/classifyIntent";
import {
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
  glaideResponses,
  type CategoryKey,
  type Item,
  type Msg,
  type ChipModel,
} from "./GlaideChatMock";

export function ProtoGuidedSteps() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [category, setCategory] = useState<CategoryKey>("projects");
  const [phase, setPhase] = useState<"landing" | "thread">("landing");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [helpChosen, setHelpChosen] = useState(false);
  const [helpType, setHelpType] = useState<string>("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isPrereq = PREREQ.has(category);
  const needsItem = isPrereq && !selectedItem;
  const canSend = (input.trim().length > 0 || helpType.length > 0) && !needsItem && !isTyping;

  const switchCategory = (next: CategoryKey) => {
    setCategory(next);
    setPhase("landing");
    setSelectedItem(null);
    setHelpChosen(false);
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

  // Step-back mirrors chip removal: help-type → project → Ask page.
  const handleBack = () => {
    if (phase === "thread") { navigate("/program_support/ask"); return; }
    if (helpChosen) { setHelpChosen(false); setHelpType(""); return; }
    if (isPrereq && selectedItem) { setSelectedItem(null); return; }
    navigate("/program_support/ask");
  };

  const handleSend = () => {
    const typed = input.trim();
    const text = typed || helpType;
    if (!text || needsItem || isTyping) return;
    const landing = phase === "landing";
    const ctxParts = [selectedItem?.name, typed && helpType ? helpType : null].filter(Boolean) as string[];
    const context = landing && ctxParts.length ? ctxParts.join("  ·  ") : undefined;
    setMessages((prev) => [...prev, { role: "user", text, ...(context ? { context } : {}) }]);
    const routing = [helpType, typed].filter(Boolean).join(" ") || text;
    setInput("");
    setHelpType("");
    setHelpChosen(false);
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
      {phase === "landing" && <Atmosphere reduce={!!reduce} />}

      <TopNav />

      <LayoutGroup>
        <Box sx={{ flex: 1, width: "100%", maxWidth: 760, mx: "auto", px: 2.5, position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          <Stack direction="row" alignItems="center" sx={{ height: 56, flexShrink: 0 }}>
            <IconButton onClick={handleBack} aria-label="Back" sx={{ ml: -1, color: "text.secondary", "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "text.primary" } }}>
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
            <GuidedLanding
              category={category}
              isPrereq={isPrereq}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              helpChosen={helpChosen}
              setHelpChosen={setHelpChosen}
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
                <Composer ref={inputRef} value={input} onChange={setInput} onSend={handleSend} canSend={canSend} disabled={isTyping} reduce={!!reduce} placeholder="Ask Glaide" />
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

function GuidedLanding({
  category, isPrereq, selectedItem, setSelectedItem,
  helpChosen, setHelpChosen, helpType, setHelpType,
  input, setInput, onSend, canSend, isTyping, reduce, inputRef,
}: {
  category: CategoryKey; isPrereq: boolean;
  selectedItem: Item | null; setSelectedItem: (i: Item | null) => void;
  helpChosen: boolean; setHelpChosen: (v: boolean) => void;
  helpType: string; setHelpType: (v: string) => void;
  input: string; setInput: (v: string) => void; onSend: () => void;
  canSend: boolean; isTyping: boolean; reduce: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const ItemIcon = CATEGORY_ICON[category] ?? LifeBuoy;
  const needsItem = isPrereq && !selectedItem;
  const inHelpStep = !needsItem && !helpChosen;
  const inCompose = !needsItem && helpChosen;

  const changeItem = () => { setSelectedItem(null); setHelpChosen(false); setHelpType(""); };
  const chooseHelp = (t: string) => { setHelpType(t); setHelpChosen(true); };
  const skipHelp = () => { setHelpType(""); setHelpChosen(true); };

  const chips: ChipModel[] = [];
  if (selectedItem) chips.push({ id: "item", label: selectedItem.name, Icon: ItemIcon, tone: "primary", onClear: changeItem });
  if (helpType) chips.push({ id: "help", label: helpType, Icon: LifeBuoy, tone: "neutral", onClear: () => { setHelpType(""); setHelpChosen(false); } });

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", pt: { xs: 2, md: 3 }, gap: { xs: 3, md: 3.5 }, pb: 4, minHeight: "calc(100vh - 64px - 56px)" }}>
      <GlaidePresence category={category} heading="What do you need help with?" compact reduce={reduce} />

      {/* Step 1 — pick the item (prereq only) */}
      {needsItem && (
        <Box sx={{ maxWidth: 540, mx: "auto", width: "100%" }}>
          <ItemPicker category={category} onSelect={setSelectedItem} reduce={reduce} />
        </Box>
      )}

      {/* Step 2 — dedicated "What kind of help?" step (project bar + list) */}
      {inHelpStep && (
        <Stack gap={2.25} sx={{ maxWidth: 540, mx: "auto", width: "100%" }}>
          {selectedItem && <SelectedItemBar item={selectedItem} Icon={ItemIcon} onChange={changeItem} reduce={reduce} />}
          <HelpTypeStep category={category} onChoose={chooseHelp} onSkip={skipHelp} reduce={reduce} />
        </Stack>
      )}

      {/* Step 3 — compose */}
      <AnimatePresence>
        {inCompose && (
          <Box
            component={motion.div}
            key="compose"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            sx={{ maxWidth: 640, mx: "auto", width: "100%" }}
          >
            <Box component={motion.div} layoutId={reduce ? undefined : "composer"}>
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
            <Typography sx={{ mt: 1.5, textAlign: "center", fontSize: 12.5, color: "text.secondary" }}>
              Press <Box component="span" sx={{ fontWeight: 600 }}>Enter</Box> to send · Glaide can make mistakes, check important info.
            </Typography>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}

// The dedicated "What kind of help?" step — overline + divider list + escape row.
function HelpTypeStep({ category, onChoose, onSkip, reduce }: { category: CategoryKey; onChoose: (t: string) => void; onSkip: () => void; reduce: boolean }) {
  const opts = (SUBCATEGORIES[category] ?? []).filter((o) => o !== "Something else");
  const container = { show: { transition: { staggerChildren: reduce ? 0 : 0.04, delayChildren: reduce ? 0 : 0.04 } } };
  const childIn = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } } };

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
  const chevron = (
    <Box className="chev" sx={{ display: "flex", flexShrink: 0, color: "text.secondary", transition: "transform 160ms ease, color 160ms ease" }}>
      <ChevronRight size={18} strokeWidth={2} />
    </Box>
  );

  return (
    <Stack gap={1.25} sx={{ width: "100%" }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ pl: 0.5 }}>
        <LifeBuoy size={14} strokeWidth={2} style={{ opacity: 0.7, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "text.secondary", opacity: 0.85 }}>
          What kind of help?
        </Typography>
      </Stack>
      <Box sx={{ border: "1px solid", borderColor: "outlineVariant.main", borderRadius: "16px", overflow: "hidden", bgcolor: "background.paper", boxShadow: "0 1px 2px rgba(16,24,64,0.05)" }}>
        <Box
          component={motion.div}
          variants={container}
          initial="hidden"
          animate="show"
          sx={{
            maxHeight: { xs: 300, md: 360 }, overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": { borderRadius: 3, backgroundColor: (t) => t.palette.outlineVariant.main },
            "&::-webkit-scrollbar-track": { background: "transparent" },
          }}
        >
          {opts.map((o, i) => (
            <Box
              key={o}
              component={motion.button}
              type="button"
              variants={childIn}
              onClick={() => onChoose(o)}
              sx={{
                ...rowBase,
                ...(i > 0 && { "&::before": insetDivider }),
                "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.05) },
                "&:hover .chev": { transform: "translateX(3px)", color: (t) => t.palette.primary.main },
              }}
            >
              <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{o}</Box>
              {chevron}
            </Box>
          ))}
          <Box
            component={motion.button}
            type="button"
            variants={childIn}
            onClick={onSkip}
            sx={{
              ...rowBase,
              "&::before": insetDivider,
              "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.05) },
              "&:hover .chev": { transform: "translateX(3px)", color: (t) => t.palette.primary.main },
            }}
          >
            <Box component="span" sx={{ flex: 1, minWidth: 0 }}>I need help with something else</Box>
            {chevron}
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
