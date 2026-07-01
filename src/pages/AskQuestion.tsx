import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  DollarSign,
  Tv,
  FileText,
  Video,
  MonitorSmartphone,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { useSupport, type Thread } from "../context/SupportContext";
import data from "../mocks/programSupport.json";

// Static lucide lookup so icon names from JSON resolve without dynamic import.
const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  Tv,
  FileText,
  Video,
  MonitorSmartphone,
  CircleHelp,
};

// One distinct extended-palette colorContainer (bg) + color (fg) pair per category.
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  quizzes: { bg: "#dee0ff", color: "#4355b9" }, // indigo (Assessment)
  sessions: { bg: "#cae6ff", color: "#006493" }, // lightBlue
  material: { bg: "#ffd9dc", color: "#bd0143" }, // rose
  fee: { bg: "#ffdcc0", color: "#8d4f00" }, // warning (Payment)
  olympus: { bg: "#ebddff", color: "#6f43c0" }, // deepPurple
  other: { bg: "#aee9de", color: "#006a60" }, // teal (tonal, not the neon GL teal container)
};

type Category = { key: string; label: string; icon: string; description: string };
const categories = data.categories as Category[];

export function AskQuestion() {
  const navigate = useNavigate();
  const { threads } = useSupport();
  // Threads are authored newest-first; the most recent powers the "Recent chat" card.
  const recentThread = threads[0];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <Box
        sx={{
          flex: 1,
          width: { xs: "100%", lg: "calc(100% - 352px)" },
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, md: 3, lg: 0 },
          pt: 3,
          pb: 8,
        }}
      >
        {/* Back + title */}
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            onClick={() => navigate("/program_support")}
            aria-label="Back to Support"
            sx={{ color: "text.primary", ml: -1 }}
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ color: "text.primary" }}>
            How can we help you?
          </Typography>
        </Stack>

        {/* Recent chat */}
        {recentThread && (
          <Box sx={{ mt: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Typography variant="subtitle1" sx={{ color: "text.primary" }}>
                Recent chat
              </Typography>
              <Button
                variant="text"
                size="small"
                disableElevation
                onClick={() => navigate("/program_support", { state: { tab: "glaide" } })}
                endIcon={<ChevronRight size={18} strokeWidth={2} />}
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: "8px",
                  px: 1,
                  py: 0.5,
                  minWidth: 0,
                  "& .MuiButton-endIcon": { ml: 0.5 },
                  "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
                }}
              >
                See All Chats
              </Button>
            </Stack>

            <Box
              sx={{
                mt: 1.5,
                border: "1px solid",
                borderColor: "outlineVariant.main",
                borderRadius: "8px",
                bgcolor: "background.paper",
                overflow: "hidden",
              }}
            >
              <RecentChatRow
                thread={recentThread}
                onClick={() => navigate(`/program_support/chat/${recentThread.id}`)}
              />
            </Box>
          </Box>
        )}

        {/* Browse by category */}
        <Typography
          variant="subtitle1"
          sx={{ mt: 3, color: "text.primary" }}
        >
          Browse by category
        </Typography>

        {/* Category cards */}
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {categories.map((c) => {
            const Icon = ICON_MAP[c.icon] ?? CircleHelp;
            const colors = CATEGORY_COLORS[c.key] ?? { bg: "#cae6ff", color: "#001e30" };
            return (
              <Box
                key={c.key}
                component="button"
                type="button"
                onClick={() =>
                  navigate("/program_support/glaide", {
                    state: { categoryKey: c.key, label: c.label },
                  })
                }
                sx={{
                  appearance: "none",
                  font: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: "outlineVariant.main",
                  borderRadius: "8px",
                  bgcolor: "background.paper",
                  p: 3,
                  // gl-app-native topic-card state layers: flat brand-blue tint, no shadow / no motion.
                  transition: "background-color 160ms ease",
                  "&:hover": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.08), // $primaryOpacity8P
                  },
                  "&:active": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12), // $primaryOpacity12P
                  },
                  "&:focus-visible": {
                    outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {/* Icon — the only place the category color appears (container tint + color). */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: colors.bg,
                    color: colors.color,
                  }}
                >
                  <Icon size={26} strokeWidth={2} />
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, color: "text.primary" }}
                >
                  {c.label}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  {c.description}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.5}
                  sx={{ mt: "auto", pt: 2.5, alignSelf: "flex-start", color: "primary.main" }}
                >
                  <Typography component="span" sx={{ fontSize: 14, fontWeight: 600, color: "inherit" }}>
                    Get Help
                  </Typography>
                  <ArrowRight size={16} strokeWidth={2} />
                </Stack>
              </Box>
            );
          })}
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={1}
          sx={{ flexWrap: "wrap", px: 2 }}
        >
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            © 2013 - 2026 Great Learning Education Services Pvt. Ltd. All rights reserved
          </Typography>
          <Typography component="span" sx={{ fontSize: 13, color: "text.secondary" }}>
            ·
          </Typography>
          <Typography
            component="a"
            href="#"
            sx={{
              fontSize: 13,
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Privacy
          </Typography>
          <Typography component="span" sx={{ fontSize: 13, color: "text.secondary" }}>
            ·
          </Typography>
          <Typography
            component="a"
            href="#"
            sx={{
              fontSize: 13,
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Terms
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

function RecentChatRow({ thread, onClick }: { thread: Thread; onClick: () => void }) {
  const firstUser = thread.messages.find((m) => m.role === "user");
  const preview = firstUser?.text ?? thread.messages[thread.messages.length - 1]?.text ?? "";
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      onClick={onClick}
      sx={{
        p: 2,
        cursor: "pointer",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
      }}
    >
      <Box
        component="img"
        src={new URL("../assets/ai-mentor-logo.svg", import.meta.url).href}
        alt="Glaide"
        sx={{ width: 32, height: 32, flexShrink: 0, display: "block" }}
      />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {thread.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 0.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {preview}
        </Typography>
      </Box>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", flexShrink: 0, display: { xs: "none", sm: "block" } }}
      >
        {thread.timestamp}
      </Typography>
    </Stack>
  );
}
