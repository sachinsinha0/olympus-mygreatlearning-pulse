import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  BookOpen,
  Briefcase,
  Folder,
  ListVideo,
  Video,
  MessagesSquare,
  ClipboardList,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { RecentActivityCard, type ActivityType } from "../components/support/RecentActivityCard";
import { CategoryTile } from "../components/support/CategoryTile";
import data from "../mocks/programSupport.json";

// Static lucide lookup so icon names from JSON resolve without dynamic import.
const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  BookOpen,
  Briefcase,
  Folder,
  ListVideo,
  Video,
  MessagesSquare,
  ClipboardList,
  MessageSquare,
};

// One distinct extended-palette colorContainer/onColorContainer pair per category (no repeats).
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  fee: { bg: "#ffdcc0", color: "#2d1600" }, // warning
  olympus: { bg: "#ebddff", color: "#250059" }, // deepPurple
  career: { bg: "#cae6ff", color: "#001e30" }, // lightBlue
  projects: { bg: "#dee0ff", color: "#00105c" }, // indigo
  material: { bg: "#ffd9dc", color: "#400011" }, // rose
  sessions: { bg: "#ffdf9e", color: "#261a00" }, // amber
  quizzes: { bg: "#ffd6fe", color: "#35003f" }, // purple
  other: { bg: "#a1efff", color: "#001f25" }, // cyan
  feedback: { bg: "#74f8e5", color: "#00201c" }, // teal
};

const SECTION_LABEL_SX = {
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: "-0.3px",
  color: "text.primary",
  mt: { xs: 3, md: 4 },
  mb: 2,
};

export function AskQuestion() {
  const navigate = useNavigate();
  const recentActivity = data.recentActivity;
  const categories = data.categories;

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
          pt: { xs: 3, md: 4 },
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

        {/* Recent activity */}
        <Typography sx={SECTION_LABEL_SX}>Your Recent Activity</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {recentActivity.map((a) => (
            <RecentActivityCard
              key={a.id}
              course={a.course}
              title={a.title}
              when={a.when}
              type={a.type as ActivityType}
              onClick={() =>
                navigate("/program_support/chat", {
                  state: { kind: "activity", activity: a },
                })
              }
            />
          ))}
        </Box>

        {/* Topics */}
        <Typography sx={SECTION_LABEL_SX}>Browse Topics</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {categories.map((c) => {
            const Icon = ICON_MAP[c.icon] ?? MessageSquare;
            const colors = CATEGORY_COLORS[c.key] ?? { bg: "#cae6ff", color: "#001e30" };
            return (
              <CategoryTile
                key={c.key}
                label={c.label}
                Icon={Icon}
                bg={colors.bg}
                color={colors.color}
                onClick={() =>
                  navigate("/program_support/chat", {
                    state: { kind: "category", categoryKey: c.key, label: c.label },
                  })
                }
              />
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
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          © 2026 All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}
