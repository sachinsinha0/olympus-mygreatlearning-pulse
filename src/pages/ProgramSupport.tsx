import { useMemo, useState } from "react";
import { Box, Button, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  MessageCircle,
  ClipboardList,
  ListChecks,
  MonitorSmartphone,
  Briefcase,
  FolderKanban,
  BookOpen,
  Video,
  CircleHelp,
  MessageSquareHeart,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { useSupport, type Thread, type Ticket } from "../context/SupportContext";
import {
  filterByStatus,
  statusCounts,
  STATUS_FILTERS,
  STATUS_LABELS,
  type StatusFilter,
  type TicketStatus,
} from "../lib/support/tickets";

const CATEGORY: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  payment: { Icon: DollarSign, bg: "#ffdcc0", color: "#8d4f00" },
  query: { Icon: MessageCircle, bg: "#ebddff", color: "#6f43c0" },
  attendance: { Icon: ClipboardList, bg: "#ffd9dc", color: "#bd0143" },
  general: { Icon: ListChecks, bg: "#ffd9dc", color: "#bd0143" },
  // Triage category keys used by Glaide threads.
  fee: { Icon: DollarSign, bg: "#ffdcc0", color: "#8d4f00" },
  olympus: { Icon: MonitorSmartphone, bg: "#cae6ff", color: "#006493" },
  career: { Icon: Briefcase, bg: "#dee0ff", color: "#4355b9" },
  projects: { Icon: FolderKanban, bg: "#ebddff", color: "#6f43c0" },
  material: { Icon: BookOpen, bg: "#a1efff", color: "#006876" },
  sessions: { Icon: Video, bg: "#74f8e5", color: "#006a60" },
  quizzes: { Icon: ListChecks, bg: "#ffd9dc", color: "#bd0143" },
  other: { Icon: CircleHelp, bg: "#dded49", color: "#5b6300" },
  feedback: { Icon: MessageSquareHeart, bg: "#ffd8eb", color: "#b2008a" },
};

export function ProgramSupport() {
  const navigate = useNavigate();
  const { tickets, threads } = useSupport();
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const counts = useMemo(() => statusCounts(tickets), [tickets]);
  const visibleTickets = useMemo(() => filterByStatus(tickets, statusFilter), [tickets, statusFilter]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <Box sx={{ position: "relative", flex: 1 }}>
        {/* Tinted hero band behind the upper portion of the page */}
        <Box
          sx={{
            position: "absolute",
            insetInline: 0,
            top: 0,
            // Prod tint spans y=0..438 (incl. the 64px nav); below the nav that
            // leaves 374px of visible band before the page switches to default bg.
            height: { xs: 480, md: 374 },
            bgcolor: "surface.main",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            // Olympus shell logic: fixed 176px gutter each side (2x = 352px),
            // capped at 1440px max-width then centered. On a 1512px display this
            // yields ~1145px of content, matching the reference page.
            width: { xs: "100%", lg: "calc(100% - 352px)" },
            maxWidth: 1440,
            mx: "auto",
            px: { xs: 2, md: 3, lg: 0 },
            pt: { xs: 4, md: 6 },
            pb: 8,
          }}
        >
          <Hero onAsk={() => navigate("/program_support/ask")} />

          <Card
            sx={{
              mt: { xs: 3, md: 0 },
              border: 1,
              borderColor: "outlineVariant.main",
              borderRadius: "16px",
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
              TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
              sx={{
                borderBottom: 1,
                borderColor: "outlineVariant.main",
                minHeight: 48,
                "& .MuiTab-root": {
                  minHeight: 48,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.1px",
                  textTransform: "none",
                  color: "text.primary",
                },
                "& .MuiTab-root.Mui-selected": { color: "primary.main", fontWeight: 600 },
                // Material 3 primary-tab indicator: hugs the label, not the full column
                "& .MuiTabs-indicator": {
                  height: 3,
                  backgroundColor: "transparent",
                  display: "flex",
                  justifyContent: "center",
                },
                "& .MuiTabs-indicatorSpan": {
                  width: "100%",
                  maxWidth: 92,
                  backgroundColor: "primary.main",
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab label="Tickets" disableRipple />
              <Tab label="Glaide Chat" disableRipple />
            </Tabs>

            {tab === 1 ? (
              <Box>
                {threads.length === 0 ? (
                  <ThreadsEmptyState onAsk={() => navigate("/program_support/ask")} />
                ) : (
                  threads.map((th, i) => (
                    <ThreadRow
                      key={th.id}
                      thread={th}
                      divider={i < threads.length - 1}
                      onClick={() => navigate(`/program_support/chat/${th.id}`)}
                    />
                  ))
                )}
              </Box>
            ) : (
              <Box>
                <TicketFilterBar counts={counts} value={statusFilter} onChange={setStatusFilter} />
                {visibleTickets.length === 0 ? (
                  <TicketsEmptyState filter={statusFilter} />
                ) : (
                  visibleTickets.map((t, i) => (
                    <TicketRow key={t.id} ticket={t} divider={i < visibleTickets.length - 1} />
                  ))
                )}
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "background.default",
          borderTop: 1,
          borderColor: "outlineVariant.main",
          py: 2.5,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          © 2026 All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}

function Hero({ onAsk }: { onAsk: () => void }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="stretch"
      justifyContent="space-between"
      gap={{ xs: 3, md: 4 }}
    >
      <Box sx={{ maxWidth: 620 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 24, md: 28 },
            fontWeight: 600,
            lineHeight: { xs: "30px", md: "32px" },
            letterSpacing: "-0.5px",
            color: "text.primary",
          }}
        >
          Need Assistance? We're Here to Help!
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontSize: 16,
            lineHeight: "24px",
            color: "text.secondary",
            maxWidth: 560,
          }}
        >
          You can use your program support to ask questions related to your program and check
          updates and replies to your questions.
        </Typography>
        <Stack direction="row" gap={1.5} sx={{ mt: 2, flexWrap: "wrap" }}>
          <Button
            disableElevation
            variant="contained"
            onClick={onAsk}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              textTransform: "none",
              fontSize: 16,
              fontWeight: 500,
              lineHeight: 1.5,
              borderRadius: "8px",
              minHeight: 40,
              py: "7px",
              px: "19px",
              "&:hover": { bgcolor: "primary.main" },
            }}
          >
            Ask A Question
          </Button>
          <Button
            disableElevation
            variant="contained"
            sx={{
              bgcolor: "#dae1ff",
              color: "#001849",
              textTransform: "none",
              fontSize: 16,
              fontWeight: 500,
              lineHeight: 1.5,
              borderRadius: "8px",
              minHeight: 40,
              py: "7px",
              px: "19px",
              "&:hover": { bgcolor: "#cdd6ff" },
            }}
          >
            Schedule Call
          </Button>
        </Stack>
      </Box>

      <Box
        component="img"
        src={new URL("../assets/program-support-hero.png", import.meta.url).href}
        alt="Program support"
        sx={{
          width: { xs: 220, md: 300 },
          height: "auto",
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
        }}
      />
    </Stack>
  );
}

function TicketRow({ ticket, divider }: { ticket: Ticket; divider: boolean }) {
  const cat = CATEGORY[ticket.category] ?? CATEGORY.general;
  const { Icon } = cat;
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={{
        px: 2,
        py: 2,
        cursor: "pointer",
        borderBottom: divider ? 1 : 0,
        borderColor: "outlineVariant.main",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          bgcolor: cat.bg,
          color: cat.color,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} strokeWidth={2} />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 500,
            color: "text.primary",
            letterSpacing: "-0.2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {ticket.title}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: "text.secondary",
            lineHeight: 1.4,
            mt: 0.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {ticket.subtitle}
        </Typography>
      </Box>

      <TicketStatusChip status={ticket.status} />

      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          letterSpacing: "-0.2px",
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
        }}
      >
        {ticket.timestamp}
      </Typography>
    </Stack>
  );
}

function TicketStatusChip({ status }: { status: TicketStatus }) {
  return (
    <Box
      sx={(theme) => {
        const tone = {
          open: { bg: theme.palette.primary.light, fg: theme.palette.primary.main },
          closed: { bg: alpha(theme.palette.text.primary, 0.08), fg: theme.palette.text.secondary },
          reopened: {
            bg: theme.palette.extended.warning.colorContainer,
            fg: theme.palette.extended.warning.color,
          },
        }[status];
        return {
          flexShrink: 0,
          px: 1,
          py: 0.25,
          borderRadius: 999,
          bgcolor: tone.bg,
          color: tone.fg,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "18px",
          letterSpacing: "-0.1px",
          whiteSpace: "nowrap",
        };
      }}
    >
      {STATUS_LABELS[status]}
    </Box>
  );
}

function TicketFilterBar({
  counts,
  value,
  onChange,
}: {
  counts: Record<StatusFilter, number>;
  value: StatusFilter;
  onChange: (filter: StatusFilter) => void;
}) {
  return (
    <Stack
      direction="row"
      gap={1}
      sx={{ flexWrap: "wrap", px: 2, py: 1.5, borderBottom: 1, borderColor: "outlineVariant.main" }}
    >
      {STATUS_FILTERS.map((f) => {
        const selected = value === f;
        const label = f === "all" ? "All" : STATUS_LABELS[f];
        return (
          <Box
            key={f}
            component="button"
            type="button"
            onClick={() => onChange(f)}
            aria-pressed={selected}
            sx={(theme) => ({
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.1px",
              px: 1.5,
              py: 0.625,
              borderRadius: 999,
              border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.outlineVariant.main}`,
              bgcolor: selected ? theme.palette.primary.light : "transparent",
              color: selected ? theme.palette.primary.main : theme.palette.text.primary,
              transition: "background-color 140ms ease, border-color 140ms ease, color 140ms ease",
              "&:hover": { borderColor: theme.palette.primary.main },
            })}
          >
            {label} {counts[f]}
          </Box>
        );
      })}
    </Stack>
  );
}

function TicketsEmptyState({ filter }: { filter: StatusFilter }) {
  const message =
    filter === "all" ? "No tickets yet" : `No ${STATUS_LABELS[filter].toLowerCase()} tickets`;
  return (
    <Stack alignItems="center" gap={1} sx={{ py: 4, px: 2, textAlign: "center" }}>
      <Box sx={{ color: "text.secondary", display: "flex" }}>
        <ClipboardList size={28} strokeWidth={2} />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: "text.primary" }}>{message}</Typography>
    </Stack>
  );
}

function ThreadRow({
  thread,
  divider,
  onClick,
}: {
  thread: Thread;
  divider: boolean;
  onClick: () => void;
}) {
  const cat = CATEGORY[thread.category] ?? CATEGORY.general;
  const { Icon } = cat;
  const last = thread.messages[thread.messages.length - 1];
  const sender = last?.role === "bot" ? "Glaide" : "You";
  const subtitle = last ? `${sender}: ${last.text}` : "No messages yet";

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      onClick={onClick}
      sx={{
        px: 2,
        py: 2,
        cursor: "pointer",
        borderBottom: divider ? 1 : 0,
        borderColor: "outlineVariant.main",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          bgcolor: cat.bg,
          color: cat.color,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} strokeWidth={2} />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: "text.primary",
              letterSpacing: "-0.2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {thread.title}
          </Typography>
          {thread.status !== "active" && (
            <Typography sx={{ fontSize: 12, color: "text.secondary", flexShrink: 0 }}>
              {thread.status === "ticketed" ? "Ticket raised" : "Resolved"}
            </Typography>
          )}
        </Stack>
        <Typography
          sx={{
            fontSize: 14,
            color: "text.secondary",
            lineHeight: 1.4,
            mt: 0.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          letterSpacing: "-0.2px",
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
        }}
      >
        {thread.timestamp}
      </Typography>
    </Stack>
  );
}

function ThreadsEmptyState({ onAsk }: { onAsk: () => void }) {
  return (
    <Stack alignItems="center" gap={1} sx={{ py: 4, px: 2, textAlign: "center" }}>
      <Box sx={{ color: "text.secondary", display: "flex" }}>
        <MessageSquareHeart size={28} strokeWidth={2} />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: "text.primary" }}>
        No conversations yet
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
        Start one from Ask A Question.
      </Typography>
      <Button
        onClick={onAsk}
        sx={{
          mt: 1,
          textTransform: "none",
          fontSize: 14,
          fontWeight: 500,
          color: "primary.main",
        }}
      >
        Ask A Question
      </Button>
    </Stack>
  );
}
