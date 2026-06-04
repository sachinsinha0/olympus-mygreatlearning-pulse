import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  DollarSign,
  MonitorSmartphone,
  Briefcase,
  FolderKanban,
  BookOpen,
  Video,
  ListChecks,
  CircleHelp,
  MessageSquareHeart,
  type LucideIcon,
} from "lucide-react";
import { TopNav } from "../components/TopNav/TopNav";
import { RecentActivityCard, type ActivityType } from "../components/support/RecentActivityCard";
import { CategoryTile } from "../components/support/CategoryTile";
import data from "../mocks/programSupport.json";

// Static lucide lookup so icon names from JSON resolve without dynamic import.
const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  MonitorSmartphone,
  Briefcase,
  FolderKanban,
  BookOpen,
  Video,
  ListChecks,
  CircleHelp,
  MessageSquareHeart,
};

// Per-category tile colors from the existing extended palette colorContainer/onColorContainer pairs.
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  fee: { bg: "#ffdcc0", color: "#2d1600" }, // warning
  olympus: { bg: "#cae6ff", color: "#001e30" }, // lightBlue
  career: { bg: "#dee0ff", color: "#00105c" }, // indigo
  projects: { bg: "#ebddff", color: "#250059" }, // deepPurple
  material: { bg: "#a1efff", color: "#001f25" }, // cyan
  sessions: { bg: "#74f8e5", color: "#00201c" }, // teal
  quizzes: { bg: "#ffd9dc", color: "#400011" }, // rose
  other: { bg: "#dded49", color: "#1a1d00" }, // lime
  feedback: { bg: "#ffd8eb", color: "#3b002c" }, // pink
};

const SECTION_LABEL_SX = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "1.2px",
  textTransform: "uppercase" as const,
  color: "text.secondary",
  mt: { xs: 4, md: 5 },
  mb: 2,
};

export function AskQuestion() {
  const navigate = useNavigate();
  const recentActivity = data.recentActivity;
  const categories = data.categories;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
      <TopNav />

      <Box sx={{ position: "relative", flex: 1 }}>
        <Box
          sx={{
            position: "absolute",
            insetInline: 0,
            top: 0,
            height: { xs: 480, md: 374 },
            bgcolor: "surface.main",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: { xs: "100%", lg: "calc(100% - 352px)" },
            maxWidth: 1440,
            mx: "auto",
            px: { xs: 2, md: 3, lg: 0 },
            pt: { xs: 4, md: 6 },
            pb: 8,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            onClick={() => navigate("/program_support")}
            sx={{
              cursor: "pointer",
              mb: 2,
              color: "text.secondary",
              transition: "color 120ms ease",
              width: "fit-content",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ChevronLeft size={18} strokeWidth={2} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "inherit" }}>
              Back to Support
            </Typography>
          </Stack>

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
            What can I help you with?
          </Typography>
          <Typography
            sx={{ mt: 2, fontSize: 16, lineHeight: "24px", color: "text.secondary", maxWidth: 560 }}
          >
            Pick up from a recent activity, or choose a topic to start a chat with Glaide.
          </Typography>

          <Typography sx={SECTION_LABEL_SX}>Recent activity</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
              gap: 2,
            }}
          >
            {recentActivity.map((a) => (
              <RecentActivityCard
                key={a.id}
                title={a.title}
                module={a.module}
                detectedIssue={a.detectedIssue}
                type={a.type as ActivityType}
                onClick={() =>
                  navigate("/program_support/chat", {
                    state: { kind: "activity", activity: a },
                  })
                }
              />
            ))}
          </Box>

          <Typography sx={SECTION_LABEL_SX}>Or pick a topic</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "1fr 1fr 1fr",
                md: "repeat(3, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {categories.map((c) => {
              const Icon = ICON_MAP[c.icon] ?? CircleHelp;
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
