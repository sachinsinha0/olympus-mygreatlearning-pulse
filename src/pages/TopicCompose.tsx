import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Box, Button, IconButton, InputBase, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  BookOpen,
  ChevronRight,
  FileQuestion,
  FileText,
  Pencil,
  Search,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import data from "../mocks/programSupport.json";

type Kind = "quiz" | "project" | "material" | "session";
type EntityItem = { id?: string; kind: Kind; title: string; course: string; bg?: string; color?: string };

type IntentConfig = { topicName: string; entryType: "intent"; intents: string[] };
type EntityConfig = {
  topicName: string;
  entryType: "entity";
  entityNoun: string;
  recentLabel: string;
  findLabel: string;
  recent: EntityItem[];
  catalog: Array<{ course: string; items?: string[]; quizzes?: string[]; projects?: string[] }>;
  intents?: string[];
  quizIntents?: string[];
  projectIntents?: string[];
};
type SessionConfig = {
  topicName: string;
  entryType: "session";
  catalog: Array<{ course: string; sessions: string[] }>;
  intents: string[];
};
type ComposeConfig = IntentConfig | EntityConfig | SessionConfig;

const topicCompose = data.topicCompose as Record<string, ComposeConfig>;

// Content-type glyph (gl-app-native: quiz → FileQuestion, project → FileText, session → Video, material → BookOpen).
const KIND_ICON: Record<Kind, LucideIcon> = {
  quiz: FileQuestion,
  project: FileText,
  material: BookOpen,
  session: Video,
};
const KIND_NOUN: Record<Kind, string> = {
  quiz: "quiz",
  project: "project",
  material: "learning material",
  session: "live session",
};

// gl-app-native "course pattern": a solid keyPrimary tile colour + a decorative SVG
// overlay (extracted from the Magna design-system "Courses" patterns). Each course is
// assigned a (colour, pattern) pair deterministically by name, mirroring its colorName.
const COURSE_PALETTE = [
  "#F4A261", // orange
  "#6EA1D0", // light blue
  "#2A9D8F", // ocean
  "#6E62B5", // eggplant
  "#9A25AE", // purple
  "#BD0143", // rose
  "#3D7085", // dark teal
  "#6270B5", // ink
  "#ACB562", // olive
  "#9C7E78", // rust
];
const COURSE_PATTERNS = Array.from(
  { length: 11 },
  (_, i) => new URL(`../assets/course-patterns/pattern${i + 1}.svg`, import.meta.url).href,
);
function coursePattern(course: string): { color: string; pattern: string } {
  let h = 0;
  for (let i = 0; i < course.length; i++) h = (h * 31 + course.charCodeAt(i)) >>> 0;
  return {
    color: COURSE_PALETTE[h % COURSE_PALETTE.length],
    pattern: COURSE_PATTERNS[h % COURSE_PATTERNS.length],
  };
}

type CategoryState = { categoryKey: string; label: string };
type PickerItem = { title: string; kind: Kind };

export function TopicCompose() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CategoryState | null;
  const config = state ? topicCompose[state.categoryKey] : undefined;

  const [entity, setEntity] = useState<EntityItem | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [findMode, setFindMode] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const entryType = config?.entryType;
  const isEntity = entryType === "entity";
  const isSession = entryType === "session";

  useEffect(() => {
    if (!state || !config) navigate("/program_support/ask", { replace: true });
  }, [state, config, navigate]);

  const intents = useMemo(() => {
    if (!config) return [];
    if (config.entryType === "intent" || config.entryType === "session") return config.intents;
    if (config.quizIntents && config.projectIntents) {
      return entity?.kind === "project" ? config.projectIntents : config.quizIntents;
    }
    return config.intents ?? [];
  }, [config, entity]);

  // View resolution.
  const view: "select" | "help" | "compose" = (() => {
    if (isEntity || isSession) {
      if (!entity) return "select";
      return intent ? "compose" : "help";
    }
    return intent ? "compose" : "help"; // intent-first
  })();

  useEffect(() => {
    if (view !== "compose") return;
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    if (!fine) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [view]);

  if (!config || !state) return null;

  const goBack = () => {
    if (view === "compose") return setIntent(null);
    if (view === "help" && (isEntity || isSession)) {
      setEntity(null);
      return;
    }
    if (isEntity && findMode) return setFindMode(false);
    navigate(-1);
  };

  const pickEntity = (e: EntityItem) => {
    setEntity(e);
    setFindMode(false);
  };

  const handleSend = () => {
    if (!intent) return;
    const detail = text.trim();
    let userText: string;
    if (entity) {
      userText = `I need help with my ${KIND_NOUN[entity.kind]} "${entity.title}" in ${entity.course}. ${intent}.`;
    } else {
      userText = `I need help with ${config.topicName}. ${intent}.`;
    }
    if (detail) userText += ` ${detail}`;
    navigate("/program_support/chat", {
      replace: true,
      state: { kind: "composed", category: state.categoryKey, title: state.label, userText },
    });
  };

  const showPrompt = view !== "compose";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <Box sx={{ flex: 1, width: "100%", maxWidth: 760, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 8 }}>
        {/* Back */}
        <IconButton
          onClick={goBack}
          aria-label="Back"
          sx={{ color: "text.primary", ml: -1, mb: 1, "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) } }}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </IconButton>

        {/* Centered Glaide header */}
        <Stack alignItems="center" sx={{ mb: showPrompt ? 4 : 3 }}>
          <Box
            component="img"
            src={new URL("../assets/ai-mentor-logo.svg", import.meta.url).href}
            alt="Glaide"
            sx={{ width: 48, height: 48, display: "block" }}
          />
          <Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>
            Glaide · {config.topicName}
          </Typography>
          {showPrompt && (
            <Typography sx={{ mt: 0.75, fontSize: 22, fontWeight: 600, color: "text.primary", textAlign: "center", letterSpacing: "-0.3px" }}>
              What do you need help with?
            </Typography>
          )}
        </Stack>

        {/* ── SELECT ─────────────────────────────────────────────── */}
        {view === "select" && isEntity && !findMode && (
          <EntitySelect
            config={config as EntityConfig}
            onPick={pickEntity}
            onFind={() => setFindMode(true)}
          />
        )}

        {view === "select" && isEntity && findMode && (
          <CascadePicker
            config={config as EntityConfig}
            onSelect={pickEntity}
          />
        )}

        {view === "select" && isSession && (
          <SessionForm config={config as SessionConfig} onSelect={pickEntity} />
        )}

        {/* ── HELP ───────────────────────────────────────────────── */}
        {view === "help" && (
          <Box>
            {entity && (
              <SelectedEntityCard entity={entity} onChange={() => setEntity(null)} />
            )}
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary", mt: entity ? 3 : 0, mb: 1.5 }}>
              What kind of help?
            </Typography>
            <RowList>
              {intents.map((it, i) => (
                <Row key={it} onClick={() => setIntent(it)} divider={i < intents.length - 1}>
                  <Typography sx={{ flex: 1, minWidth: 0, fontSize: 15, color: "text.primary" }}>{it}</Typography>
                  <ChevronRight size={20} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.55 }} />
                </Row>
              ))}
            </RowList>
          </Box>
        )}

        {/* ── COMPOSE ────────────────────────────────────────────── */}
        {view === "compose" && (
          <ComposeView
            entity={entity}
            intent={intent!}
            text={text}
            onText={setText}
            onClearEntity={entity ? () => { setEntity(null); setIntent(null); } : undefined}
            onClearIntent={() => setIntent(null)}
            onSend={handleSend}
            inputRef={inputRef}
          />
        )}
      </Box>
    </Box>
  );
}

/* ── Entity recent select (separate cards + find row) ────────────────────── */
function EntitySelect({
  config,
  onPick,
  onFind,
}: {
  config: EntityConfig;
  onPick: (e: EntityItem) => void;
  onFind: () => void;
}) {
  return (
    <Box>
      {config.recent.length > 0 && (
        <>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", mb: 1 }}>
            {config.recentLabel}
          </Typography>
          <Stack gap={1.5} sx={{ mb: 1.5 }}>
            {config.recent.map((it) => (
              <EntityCard key={it.id ?? it.title} entity={it} onClick={() => onPick(it)} />
            ))}
          </Stack>
        </>
      )}
      <FindRow label={config.findLabel} onClick={onFind} />
    </Box>
  );
}

/* ── A recent entity card ────────────────────────────────────────────────── */
function EntityCard({ entity, onClick }: { entity: EntityItem; onClick: () => void }) {
  return (
    <Stack
      component="button"
      type="button"
      direction="row"
      alignItems="center"
      gap={2}
      onClick={onClick}
      sx={cardButtonSx}
    >
      <CourseThumb entity={entity} size={48} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <EntityText entity={entity} />
      </Box>
      <Box sx={{ color: "text.secondary", display: "flex", flexShrink: 0 }}>
        <ChevronRight size={20} strokeWidth={2} />
      </Box>
    </Stack>
  );
}

/* ── Course-pattern thumbnail (solid keyPrimary tile + white glyph) ───────── */
function CourseThumb({ entity, size }: { entity: EntityItem; size: number }) {
  const { color, pattern } = coursePattern(entity.course);
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: `${Math.round(size / 6)}px`,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        bgcolor: color,
      }}
    >
      <Box
        component="img"
        src={pattern}
        alt=""
        aria-hidden
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </Box>
  );
}

/* ── Course name (caption, primary) + title (subtitle2) with content icon ── */
function EntityText({ entity }: { entity: EntityItem }) {
  const Icon = KIND_ICON[entity.kind];
  return (
    <>
      <Typography
        variant="caption"
        sx={{ display: "block", color: "primary.main", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {entity.course}
      </Typography>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.25, minWidth: 0 }}>
        <Box sx={{ display: "flex", flexShrink: 0, color: "text.secondary" }}>
          <Icon size={16} strokeWidth={2} />
        </Box>
        <Typography variant="subtitle2" sx={{ color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {entity.title}
        </Typography>
      </Stack>
    </>
  );
}

/* ── The selected entity (help view) with a Change link ──────────────────── */
function SelectedEntityCard({ entity, onChange }: { entity: EntityItem; onChange: () => void }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={{ border: "1px solid", borderColor: "outlineVariant.main", borderRadius: "8px", p: 2, bgcolor: "background.paper" }}
    >
      <CourseThumb entity={entity} size={44} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <EntityText entity={entity} />
      </Box>
      <Stack
        component="button"
        type="button"
        direction="row"
        alignItems="center"
        gap={0.5}
        onClick={onChange}
        sx={{ appearance: "none", border: 0, bgcolor: "transparent", cursor: "pointer", color: "primary.main", fontFamily: "inherit", fontSize: 14, fontWeight: 600, flexShrink: 0, p: 0.5, "&:hover": { textDecoration: "underline" } }}
      >
        <Pencil size={15} strokeWidth={2} />
        Change
      </Stack>
    </Stack>
  );
}

/* ── "Find another / Find more…" search row ──────────────────────────────── */
function FindRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Stack
      component="button"
      type="button"
      direction="row"
      alignItems="center"
      gap={1.5}
      onClick={onClick}
      sx={{ ...cardButtonSx, py: 2 }}
    >
      <Box sx={{ display: "flex", flexShrink: 0, color: "text.secondary" }}>
        <Search size={20} strokeWidth={2} />
      </Box>
      <Typography sx={{ flex: 1, minWidth: 0, fontSize: 15, color: "text.secondary" }}>{label}</Typography>
    </Stack>
  );
}

/* ── Cascade picker (course → item) for Find-more ────────────────────────── */
function CascadePicker({ config, onSelect }: { config: EntityConfig; onSelect: (e: EntityItem) => void }) {
  const courses = config.catalog.map((c) => c.course);
  const itemsFor = (course: string): PickerItem[] => {
    const entry = config.catalog.find((c) => c.course === course);
    if (!entry) return [];
    if (entry.items) return entry.items.map((t) => ({ title: t, kind: "material" as Kind }));
    const quizzes = (entry.quizzes ?? []).map((t) => ({ title: t, kind: "quiz" as Kind }));
    const projects = (entry.projects ?? []).map((t) => ({ title: t, kind: "project" as Kind }));
    return [...quizzes, ...projects];
  };
  return (
    <PickerForm
      courses={courses}
      itemsFor={itemsFor}
      itemLabel={config.entityNoun.charAt(0).toUpperCase() + config.entityNoun.slice(1)}
      itemPlaceholder={`Select a ${config.entityNoun}`}
      onSelect={(course, item) => onSelect({ kind: item.kind, title: item.title, course })}
    />
  );
}

/* ── Live Session form (course → session) ────────────────────────────────── */
function SessionForm({ config, onSelect }: { config: SessionConfig; onSelect: (e: EntityItem) => void }) {
  const courses = config.catalog.map((c) => c.course);
  const itemsFor = (course: string): PickerItem[] =>
    (config.catalog.find((c) => c.course === course)?.sessions ?? []).map((t) => ({ title: t, kind: "session" as Kind }));
  return (
    <PickerForm
      courses={courses}
      itemsFor={itemsFor}
      itemLabel="Session"
      itemPlaceholder="Select a session"
      onSelect={(course, item) => onSelect({ kind: "session", title: item.title, course })}
    />
  );
}

/* ── Shared course→item form with Continue ───────────────────────────────── */
function PickerForm({
  courses,
  itemsFor,
  itemLabel,
  itemPlaceholder,
  onSelect,
}: {
  courses: string[];
  itemsFor: (course: string) => PickerItem[];
  itemLabel: string;
  itemPlaceholder: string;
  onSelect: (course: string, item: PickerItem) => void;
}) {
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const items = course ? itemsFor(course) : [];
  const selected = items.find((i) => i.title === title);
  const canContinue = !!course && !!selected;

  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "outlineVariant.main" },
  } as const;

  return (
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary", mb: 0.75 }}>Course</Typography>
      <TextField
        select
        fullWidth
        size="medium"
        value={course}
        onChange={(e) => {
          setCourse(e.target.value);
          setTitle("");
        }}
        SelectProps={{ displayEmpty: true }}
        sx={fieldSx}
      >
        <MenuItem value="" disabled>
          <Box component="span" sx={{ color: "text.secondary" }}>Select a course</Box>
        </MenuItem>
        {courses.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>

      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary", mt: 2.5, mb: 0.75 }}>{itemLabel}</Typography>
      <TextField
        select
        fullWidth
        size="medium"
        value={title}
        disabled={!course}
        onChange={(e) => setTitle(e.target.value)}
        SelectProps={{ displayEmpty: true }}
        sx={fieldSx}
      >
        <MenuItem value="" disabled>
          <Box component="span" sx={{ color: "text.secondary" }}>{itemPlaceholder}</Box>
        </MenuItem>
        {items.map((i) => (
          <MenuItem key={i.title} value={i.title}>
            {i.title}
            {(i.kind === "quiz" || i.kind === "project") && (
              <Box component="span" sx={{ ml: 1, fontSize: 12, color: "text.secondary", textTransform: "capitalize" }}>
                · {i.kind}
              </Box>
            )}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          disableElevation
          variant="contained"
          disabled={!canContinue}
          onClick={() => selected && onSelect(course, selected)}
          sx={{
            textTransform: "none",
            fontSize: 15,
            fontWeight: 500,
            borderRadius: "8px",
            minHeight: 40,
            px: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { bgcolor: "primary.main" },
            "&.Mui-disabled": { bgcolor: "surfaceContainer.low", color: "text.secondary" },
          }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  );
}

/* ── Compose view ────────────────────────────────────────────────────────── */
function ComposeView({
  entity,
  intent,
  text,
  onText,
  onClearEntity,
  onClearIntent,
  onSend,
  inputRef,
}: {
  entity: EntityItem | null;
  intent: string;
  text: string;
  onText: (v: string) => void;
  onClearEntity?: () => void;
  onClearIntent: () => void;
  onSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
}) {
  return (
    <Box>
      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 1.5, justifyContent: "center" }}>
        {entity && <Chip label={entity.title} kind={entity.kind} onClear={onClearEntity} />}
        <Chip label={intent} onClear={onClearIntent} />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          columnGap: 1,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "outlineVariant.main",
          borderRadius: "20px",
          px: 1.75,
          py: 1.25,
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          "&:focus-within": { borderColor: "primary.main", boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.12)}` },
        }}
      >
        <InputBase
          inputRef={inputRef}
          value={text}
          onChange={(e) => onText(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent?.isComposing) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          multiline
          maxRows={6}
          placeholder="Ask Glaide (optional)"
          sx={{ fontSize: 15, lineHeight: 1.5, color: "text.primary", py: "4px", caretColor: (t) => t.palette.primary.main, "& ::placeholder": { color: "text.secondary", opacity: 0.7 } }}
        />
        <IconButton
          onClick={onSend}
          aria-label="Send to Glaide"
          sx={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.main", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }, "&:focus-visible": { outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`, outlineOffset: 2 } }}
        >
          <ArrowUp size={18} strokeWidth={2.25} />
        </IconButton>
      </Box>
      <Typography sx={{ mt: 1, textAlign: "center", fontSize: 12, color: "text.secondary" }}>
        Glaide is AI and can make mistakes. Check important info.
      </Typography>
    </Box>
  );
}

/* ── Chip ─────────────────────────────────────────────────────────────────── */
function Chip({ label, kind, onClear }: { label: string; kind?: Kind; onClear?: () => void }) {
  const Icon = kind ? KIND_ICON[kind] : undefined;
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.75}
      sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.dark", borderRadius: "8px", pl: 1.25, pr: onClear ? 0.5 : 1.25, py: 0.5, maxWidth: "100%" }}
    >
      {Icon && (
        <Box sx={{ display: "flex", flexShrink: 0, color: "primary.main" }}>
          <Icon size={15} strokeWidth={2} />
        </Box>
      )}
      <Typography sx={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Typography>
      {onClear && (
        <IconButton onClick={onClear} aria-label={`Change ${label}`} size="small" sx={{ width: 22, height: 22, color: "primary.dark", "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) } }}>
          <X size={14} strokeWidth={2.25} />
        </IconButton>
      )}
    </Stack>
  );
}

/* ── Bordered list (help options) ────────────────────────────────────────── */
function RowList({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ border: "1px solid", borderColor: "outlineVariant.main", borderRadius: "12px", overflow: "hidden", bgcolor: "background.paper" }}>
      {children}
    </Box>
  );
}

function Row({ onClick, divider, children }: { onClick: () => void; divider: boolean; children: ReactNode }) {
  return (
    <Stack
      component="button"
      type="button"
      direction="row"
      alignItems="center"
      gap={1.5}
      onClick={onClick}
      sx={{
        appearance: "none",
        font: "inherit",
        textAlign: "left",
        width: "100%",
        cursor: "pointer",
        bgcolor: "transparent",
        border: 0,
        borderBottom: divider ? "1px solid" : 0,
        borderColor: "outlineVariant.main",
        px: 2,
        py: 1.75,
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
        "&:active": { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) },
        "&:focus-visible": { outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`, outlineOffset: -2 },
      }}
    >
      {children}
    </Stack>
  );
}

// Shared style for the separate "card button" rows (recent entity + find row).
const cardButtonSx = {
  appearance: "none",
  font: "inherit",
  textAlign: "left",
  width: "100%",
  cursor: "pointer",
  border: "1px solid",
  borderColor: "outlineVariant.main",
  borderRadius: "8px",
  bgcolor: "background.paper",
  p: 2,
  transition: "background-color 120ms ease",
  "&:hover": { bgcolor: (t: import("@mui/material").Theme) => alpha(t.palette.primary.main, 0.08) },
  "&:active": { bgcolor: (t: import("@mui/material").Theme) => alpha(t.palette.primary.main, 0.12) },
  "&:focus-visible": { outline: (t: import("@mui/material").Theme) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`, outlineOffset: 2 },
} as const;
